/**
 * MoreCode UI Warehouse — MCP core (transport-agnostic, zero dependencies).
 *
 * Exposes the warehouse to any MCP client (Claude Desktop, Claude Code, Cursor, ...)
 * so an agent can search assets, read manifests, and pull source files on demand.
 *
 * Warehouse root: $UI_WAREHOUSE_PATH, or the parent directory of this file.
 * Manifests are re-scanned on every call, so edits show up without a restart.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(process.env.UI_WAREHOUSE_PATH || path.join(__dirname, '..'))
export const SERVER_INFO = { name: 'ui-warehouse', version: '1.0.0' }
export const SUPPORTED_PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05']
const MAX_ALL_BYTES = 200_000
const SKIP_DIRS = new Set(['node_modules', '.git', '_temp_extract'])

export const log = (...a) => process.stderr.write(`[ui-warehouse-mcp] ${a.join(' ')}\n`)

/* ------------------------------------------------------------------ data */

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out)
    } else out.push(full)
  }
  return out
}

function loadAssets() {
  if (!fs.existsSync(ROOT)) throw new Error(`Warehouse root not found: ${ROOT}`)
  const assets = []
  for (const p of walk(ROOT)) {
    if (path.basename(p) !== 'asset.json') continue
    try {
      const m = JSON.parse(fs.readFileSync(p, 'utf8'))
      const dir = path.dirname(p)
      assets.push({ ...m, storage_path: path.relative(ROOT, dir).split(path.sep).join('/'), _dir: dir })
    } catch (e) {
      log(`skipping unreadable manifest ${p}: ${e.message}`)
    }
  }
  assets.sort((a, b) => a.id.localeCompare(b.id))
  return assets
}

const lc = (s) => String(s ?? '').toLowerCase()
const publicView = ({ _dir, ...rest }) => rest

function summary(a) {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    platform: a.platform,
    frameworks: a.frameworks,
    description: a.description,
    storage_path: a.storage_path,
  }
}

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

// Accepts: exact id, exact name, folder name, or a unique partial name. Suggests near misses otherwise.
function resolveAsset(assets, ref) {
  const q = lc(ref).trim()
  const folder = (a) => lc(a.storage_path.split('/').pop())
  const exact = assets.find((a) => lc(a.id) === q) || assets.find((a) => lc(a.name) === q) || assets.find((a) => folder(a) === q)
  if (exact) return { asset: exact }
  if (q.length >= 3) {
    const partial = assets.filter((a) => lc(a.name).includes(q) || folder(a).includes(q))
    if (partial.length === 1) return { asset: partial[0] }
  }
  const byText = rank(assets, ref).slice(0, 4).map((r) => r.asset)
  const byTypo = assets
    .map((a) => ({ a, d: Math.min(editDistance(q, lc(a.name)), editDistance(q, folder(a))) }))
    .filter((x) => x.d <= 3)
    .sort((x, y) => x.d - y.d)
    .slice(0, 3)
    .map((x) => x.a)
  const near = [...new Map([...byTypo, ...byText].map((a) => [a.id, a])).values()].slice(0, 5).map((a) => `${a.id} (${a.name})`)
  return { error: `No unique asset matches "${ref}".${near.length ? ` Closest: ${near.join(', ')}` : ' Try search_assets.'}` }
}

/* ---------------------------------------------------------------- search */

function tokens(q) {
  const base = lc(q).split(/[^a-z0-9]+/).filter(Boolean)
  const out = new Set()
  for (const t of base) {
    out.add(t)
    if (t.length > 3 && t.endsWith('s')) out.add(t.slice(0, -1))
  }
  return [...out]
}

function rank(assets, query) {
  const toks = tokens(query)
  const phrase = lc(query).trim()
  if (!toks.length) return []
  const scored = []
  for (const a of assets) {
    const fields = [
      [lc(a.name), 10],
      [lc(a.id), 4],
      [(a.aliases || []).map(lc).join(' | '), 6],
      [(a.keywords || []).map(lc).join(' | '), 5],
      [(a.visual_references || []).map((v) => lc(v.name)).join(' | '), 6],
      [(a.visual_references || []).map((v) => lc(v.purpose)).join(' | '), 3],
      [(a.capabilities || []).map(lc).join(' | '), 4],
      [lc(a.description), 2],
      [lc(a.type) + ' ' + lc(a.platform) + ' ' + (a.frameworks || []).map(lc).join(' '), 1],
    ]
    let score = 0
    const matched = new Set()
    for (const t of toks) {
      for (const [text, w] of fields) {
        if (text.includes(t)) {
          score += w
          matched.add(t)
        }
      }
    }
    if (!matched.size) continue
    if (lc(a.name) === phrase) score += 40
    if (phrase.length > 2) {
      const lists = [...(a.aliases || []), ...(a.keywords || []), ...(a.visual_references || []).map((v) => v.name)]
      if (lists.some((x) => lc(x).includes(phrase))) score += 10
    }
    if (matched.size === toks.length) score += 5 * toks.length
    scored.push({ asset: a, score })
  }
  return scored.sort((x, y) => y.score - x.score || x.asset.id.localeCompare(y.asset.id))
}

function applyFilters(assets, { platform, type, framework }) {
  return assets.filter(
    (a) =>
      (!platform || lc(a.platform) === lc(platform)) &&
      (!type || lc(a.type) === lc(type)) &&
      (!framework || (a.frameworks || []).some((f) => lc(f) === lc(framework))),
  )
}

/* ----------------------------------------------------------------- files */

const LANG = { ts: 'ts', tsx: 'tsx', js: 'js', jsx: 'jsx', mjs: 'js', json: 'json', css: 'css', md: 'md' }
const fence = (rel, body) => {
  const ext = path.extname(rel).slice(1)
  return `### ${rel}\n\`\`\`${LANG[ext] || ''}\n${body.replace(/\s+$/, '')}\n\`\`\``
}

function assetFiles(a) {
  return walk(a._dir)
    .map((f) => ({ rel: path.relative(a._dir, f).split(path.sep).join('/'), abs: f, size: fs.statSync(f).size }))
    .filter((f) => f.rel !== 'asset.json')
    .sort((x, y) => x.rel.localeCompare(y.rel))
}

function safeResolve(a, rel) {
  const clean = rel.replace(/\\/g, '/').replace(/^\.?\//, '')
  const candidates = [clean, `source/${clean}`]
  for (const c of candidates) {
    const abs = path.resolve(a._dir, c)
    if (abs !== a._dir && abs.startsWith(a._dir + path.sep) && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return { abs, rel: path.relative(a._dir, abs).split(path.sep).join('/') }
    }
  }
  return null
}

/* ----------------------------------------------------------------- tools */

const text = (t) => ({ content: [{ type: 'text', text: t }] })
const fail = (t) => ({ content: [{ type: 'text', text: t }], isError: true })
const json = (o) => text(JSON.stringify(o, null, 2))

const filterProps = {
  platform: { type: 'string', enum: ['web', 'desktop', 'mobile', 'cross-platform'], description: 'Filter by target platform.' },
  type: {
    type: 'string',
    enum: ['foundation', 'layout', 'navigation', 'primitive', 'component', 'utility', 'library'],
    description: 'Filter by asset type.',
  },
  framework: { type: 'string', description: 'Filter by framework, e.g. React, Electron, Expo, React Native.' },
}

const TOOLS = [
  {
    name: 'search_assets',
    description:
      'Search the UI warehouse by keyword, alias, capability, or a product it resembles (e.g. "Linear sidebar", "kanban board", "Chrome tabs", "bottom sheet"). Returns ranked matches with ids.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search.' },
        ...filterProps,
        limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
    run(args, assets) {
      const pool = applyFilters(assets, args)
      const results = rank(pool, args.query).slice(0, args.limit || 10)
      if (!results.length) return text(`No matches for "${args.query}". Try list_assets or find_by_visual_reference.`)
      return json({ count: results.length, results: results.map((r) => ({ ...summary(r.asset), score: r.score })) })
    },
  },
  {
    name: 'list_assets',
    description: 'List every asset in the warehouse (compact), optionally filtered by platform, type, or framework.',
    inputSchema: { type: 'object', properties: { ...filterProps } },
    annotations: { readOnlyHint: true },
    run(args, assets) {
      const list = applyFilters(assets, args)
      return json({ count: list.length, assets: list.map((a) => ({ id: a.id, name: a.name, type: a.type, platform: a.platform, storage_path: a.storage_path })) })
    },
  },
  {
    name: 'get_asset',
    description: 'Get the full manifest for one asset (capabilities, dependencies, design constraints, entry points, related assets) plus its file list with sizes.',
    inputSchema: {
      type: 'object',
      properties: { asset: { type: 'string', description: 'Asset id (mc-...) or canonical name.' } },
      required: ['asset'],
    },
    annotations: { readOnlyHint: true },
    run({ asset }, assets) {
      const r = resolveAsset(assets, asset)
      if (r.error) return fail(r.error)
      return json({ manifest: publicView(r.asset), files: assetFiles(r.asset).map((f) => ({ path: f.rel, bytes: f.size })) })
    },
  },
  {
    name: 'get_asset_source',
    description:
      'Return source code for an asset. By default returns its entry-point files. Pass `files` for specific paths (relative to the asset folder; the "source/" prefix is optional), or `all: true` for everything (capped at ~200 KB).',
    inputSchema: {
      type: 'object',
      properties: {
        asset: { type: 'string', description: 'Asset id (mc-...) or canonical name.' },
        files: { type: 'array', items: { type: 'string' }, description: 'Specific files, e.g. ["components/button.tsx"].' },
        all: { type: 'boolean', default: false },
      },
      required: ['asset'],
    },
    annotations: { readOnlyHint: true },
    run({ asset, files, all }, assets) {
      const r = resolveAsset(assets, asset)
      if (r.error) return fail(r.error)
      const a = r.asset
      const picked = []
      const missing = []
      if (all) {
        picked.push(...assetFiles(a).map((f) => ({ abs: f.abs, rel: f.rel })))
      } else {
        for (const rel of files && files.length ? files : a.entry_points) {
          const hit = safeResolve(a, rel)
          hit ? picked.push(hit) : missing.push(rel)
        }
      }
      let used = 0
      const blocks = []
      let truncated = 0
      for (const f of picked) {
        const body = fs.readFileSync(f.abs, 'utf8')
        if (used + body.length > MAX_ALL_BYTES && all) {
          truncated++
          continue
        }
        used += body.length
        blocks.push(fence(f.rel, body))
      }
      const notes = []
      if (missing.length) notes.push(`Not found: ${missing.join(', ')}`)
      if (truncated) notes.push(`${truncated} file(s) omitted to stay under the size cap; request them with \`files\`.`)
      if (!all && !(files && files.length)) {
        const others = assetFiles(a).filter((f) => !picked.some((p) => p.rel === f.rel))
        if (others.length) notes.push(`Other files available: ${others.map((f) => f.rel).join(', ')}`)
      }
      if (!blocks.length) return fail(notes.join('\n') || 'No files returned.')
      return text([`# ${a.name} (${a.id})`, ...blocks, ...(notes.length ? ['---', ...notes] : [])].join('\n\n'))
    },
  },
  {
    name: 'get_related_assets',
    description: 'Get assets that the manifest marks as compatible/combinable with the given asset.',
    inputSchema: { type: 'object', properties: { asset: { type: 'string' } }, required: ['asset'] },
    annotations: { readOnlyHint: true },
    run({ asset }, assets) {
      const r = resolveAsset(assets, asset)
      if (r.error) return fail(r.error)
      const rel = (r.asset.related_assets || []).map((id) => assets.find((x) => x.id === id)).filter(Boolean)
      return json({ asset: r.asset.id, related: rel.map(summary) })
    },
  },
  {
    name: 'find_by_visual_reference',
    description: 'Find assets by the recognizable product they are structurally modeled on (e.g. "Linear", "Supabase", "Chrome", "VS Code", "Figma"). These are search hints, not instructions to copy.',
    inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
    annotations: { readOnlyHint: true },
    run({ name }, assets) {
      const q = lc(name)
      const out = []
      for (const a of assets) {
        const refs = (a.visual_references || []).filter((v) => lc(v.name).includes(q) || lc(v.purpose).includes(q))
        if (refs.length) out.push({ ...summary(a), matched_references: refs })
      }
      return out.length ? json({ count: out.length, results: out }) : text(`No visual references matching "${name}".`)
    },
  },
  {
    name: 'get_dependencies',
    description: 'Compute the combined npm dependencies for one or more assets and return a ready-to-run install command. Internal asset-id dependencies are listed separately.',
    inputSchema: {
      type: 'object',
      properties: { assets: { type: 'array', items: { type: 'string' }, minItems: 1, description: 'Asset ids or names.' } },
      required: ['assets'],
    },
    annotations: { readOnlyHint: true },
    run({ assets: refs }, assets) {
      const npm = new Set()
      const internal = new Set()
      const resolved = []
      for (const ref of refs) {
        const r = resolveAsset(assets, ref)
        if (r.error) return fail(r.error)
        resolved.push(r.asset.id)
        for (const d of r.asset.dependencies || []) (d.startsWith('mc-') ? internal : npm).add(d)
      }
      const pkgs = [...npm].sort()
      return json({
        assets: resolved,
        npm_packages: pkgs,
        install_command: pkgs.length ? `npm install ${pkgs.join(' ')}` : null,
        internal_asset_dependencies: [...internal].sort(),
      })
    },
  },
  {
    name: 'list_frameworks',
    description: 'List frameworks covered by the warehouse and how many assets support each.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    run(_args, assets) {
      const map = new Map()
      for (const a of assets) for (const f of a.frameworks || []) map.set(f, (map.get(f) || 0) + 1)
      return json({ frameworks: [...map].map(([framework, total_assets]) => ({ framework, total_assets })).sort((a, b) => b.total_assets - a.total_assets) })
    },
  },
]

/* ------------------------------------------------------------- resources */

const DOCS = [
  { uri: 'warehouse://AGENTS.md', file: 'AGENTS.md', name: 'AGENTS.md', description: 'Contributor rules: neutralization checklist and manifest spec.', mimeType: 'text/markdown' },
  { uri: 'warehouse://README.md', file: 'README.md', name: 'README.md', description: 'Warehouse overview and visual-reference discovery hints.', mimeType: 'text/markdown' },
  { uri: 'warehouse://schema/asset', file: 'schemas/asset.schema.json', name: 'asset.schema.json', description: 'JSON Schema for asset manifests.', mimeType: 'application/json' },
]

function listResources(assets) {
  return [
    ...DOCS.map(({ file, ...d }) => d),
    ...assets.map((a) => ({ uri: `warehouse://asset/${a.id}`, name: `${a.name} (${a.id})`, description: a.description, mimeType: 'application/json' })),
  ]
}

function readResource(uri, assets) {
  const doc = DOCS.find((d) => d.uri === uri)
  if (doc) return { uri, mimeType: doc.mimeType, text: fs.readFileSync(path.join(ROOT, doc.file), 'utf8') }
  const m = uri.match(/^warehouse:\/\/asset\/(.+)$/)
  if (m) {
    const r = resolveAsset(assets, m[1])
    if (!r.error) return { uri, mimeType: 'application/json', text: JSON.stringify(publicView(r.asset), null, 2) }
  }
  return null
}

/* ------------------------------------------------------------- JSON-RPC */

const INSTRUCTIONS =
  'Query a warehouse of generic, unbranded UI foundations (layouts, navigation, primitives, component libraries) for web, desktop (Electron), and mobile (React Native/Expo). ' +
  'Workflow: search_assets -> get_asset -> get_asset_source -> get_dependencies. Assets ship with blank content areas and semantic tokens; build on them rather than copying the products named in visual references.'

const ok = (id, result) => ({ jsonrpc: '2.0', id, result })
const err = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } })

/**
 * Handle one JSON-RPC message. Returns a response object, or null when no response
 * is due (notifications, or responses coming from the client).
 */
export function handleMessage(req) {
  if (!req || typeof req !== 'object' || Array.isArray(req)) return err(null, -32600, 'Invalid Request')
  const { id, method, params = {} } = req
  const isNotification = id === undefined || id === null
  if (typeof method !== 'string') return isNotification ? null : err(id, -32600, 'Invalid Request')
  try {
    switch (method) {
      case 'initialize': {
        const v = SUPPORTED_PROTOCOLS.includes(params.protocolVersion) ? params.protocolVersion : SUPPORTED_PROTOCOLS[0]
        return ok(id, { protocolVersion: v, capabilities: { tools: {}, resources: {} }, serverInfo: SERVER_INFO, instructions: INSTRUCTIONS })
      }
      case 'ping':
        return ok(id, {})
      case 'tools/list':
        return ok(id, { tools: TOOLS.map(({ run, ...t }) => t) })
      case 'tools/call': {
        const tool = TOOLS.find((t) => t.name === params.name)
        if (!tool) return err(id, -32602, `Unknown tool: ${params.name}`)
        try {
          return ok(id, tool.run(params.arguments || {}, loadAssets()))
        } catch (e) {
          return ok(id, fail(`Tool error: ${e.message}`))
        }
      }
      case 'resources/list':
        return ok(id, { resources: listResources(loadAssets()) })
      case 'resources/templates/list':
        return ok(id, { resourceTemplates: [{ uriTemplate: 'warehouse://asset/{id}', name: 'asset-manifest', description: 'Manifest for one asset by id.', mimeType: 'application/json' }] })
      case 'resources/read': {
        const c = readResource(params.uri, loadAssets())
        return c ? ok(id, { contents: [c] }) : err(id, -32002, `Resource not found: ${params.uri}`)
      }
      default:
        if (isNotification) return null // e.g. notifications/initialized, notifications/cancelled
        return err(id, -32601, `Method not found: ${method}`)
    }
  } catch (e) {
    log('internal error:', e.stack || e.message)
    return isNotification ? null : err(id, -32603, e.message)
  }
}

/** Handle a parsed JSON body (single message or batch). Returns response(s) or null. */
export function handlePayload(payload) {
  if (Array.isArray(payload)) {
    if (!payload.length) return err(null, -32600, 'Invalid Request')
    const out = payload.map(handleMessage).filter(Boolean)
    return out.length ? out : null
  }
  return handleMessage(payload)
}

export { err as rpcError }
