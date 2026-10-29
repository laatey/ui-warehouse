#!/usr/bin/env node
/**
 * MoreCode UI Warehouse — MCP server, Streamable HTTP transport (HTTP or HTTPS).
 *
 * Stateless: one endpoint (default POST /mcp), JSON responses, no sessions, no SSE.
 * Safe to run behind a load balancer.
 *
 * Config (env, or --port / --host flags):
 *   PORT                      default 3333
 *   HOST                      default 127.0.0.1  (loopback only)
 *   MCP_PATH                  default /mcp
 *   MCP_AUTH_TOKEN            static bearer token (Claude Code, scripts)
 *   MCP_PUBLIC_URL            public https URL of this server; enables OAuth for claude.ai (needs MCP_OWNER_PASSWORD)
 *   MCP_OWNER_PASSWORD        password shown on the OAuth consent page (min 12 chars)
 *   MCP_OAUTH_SECRET          signing secret for OAuth tokens (min 32 chars; random per start if unset)
 *   MCP_OAUTH_CLIENT_ID/_SECRET  optional pre-registered client (claude.ai 'advanced settings')
 *   MCP_OAUTH_REDIRECT_URIS   extra allowed redirect URIs, comma-separated
 *   (a token or OAuth is REQUIRED when HOST is not loopback)
 *   MCP_ALLOW_UNAUTHENTICATED set to 1 to allow a public bind without a token (not recommended)
 *   MCP_ALLOWED_ORIGINS       comma-separated browser origins allowed to call (CORS + Origin check)
 *   MCP_ALLOWED_HOSTS         comma-separated Host header values to accept (DNS-rebinding guard)
 *   MCP_TLS_CERT / MCP_TLS_KEY  paths to PEM files to serve HTTPS directly
 *   MCP_RATE_LIMIT            requests per minute per client IP (default 120, 0 = off)
 *   MCP_TRUST_PROXY           set to 1 to use X-Forwarded-For for the rate-limit key
 *   MCP_MAX_BODY              max request body bytes (default 1048576)
 */
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import crypto from 'node:crypto'
import { handlePayload, rpcError, log, ROOT, SERVER_INFO, SUPPORTED_PROTOCOLS } from './core.mjs'
import { createOAuth } from './oauth.mjs'

/* ---------------------------------------------------------------- config */

const argv = process.argv.slice(2)
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])
const env = process.env

const PORT = Number(flag('port') ?? env.PORT ?? 3333)
const HOST = flag('host') ?? env.HOST ?? '127.0.0.1'
const MCP_PATH = env.MCP_PATH || '/mcp'
const TOKEN = env.MCP_AUTH_TOKEN || ''
const ALLOWED_ORIGINS = new Set(list(env.MCP_ALLOWED_ORIGINS))
const ALLOWED_HOSTS = new Set(list(env.MCP_ALLOWED_HOSTS).map((h) => h.toLowerCase()))
const TLS = env.MCP_TLS_CERT && env.MCP_TLS_KEY ? { cert: fs.readFileSync(env.MCP_TLS_CERT), key: fs.readFileSync(env.MCP_TLS_KEY) } : null
const RATE_LIMIT = Number(env.MCP_RATE_LIMIT ?? 120)
const TRUST_PROXY = env.MCP_TRUST_PROXY === '1'
const MAX_BODY = Number(env.MCP_MAX_BODY ?? 1_048_576)

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])
const bindIsLoopback = LOOPBACK_HOSTS.has(HOST.toLowerCase())

const PUBLIC_URL = env.MCP_PUBLIC_URL || ''
const OWNER_PASSWORD = env.MCP_OWNER_PASSWORD || ''
let OAUTH_SECRET = env.MCP_OAUTH_SECRET || ''
if (PUBLIC_URL || OWNER_PASSWORD) {
  let u
  try { u = new URL(PUBLIC_URL) } catch { log('MCP_PUBLIC_URL must be a valid URL, e.g. https://mcp.example.com'); process.exit(1) }
  if (u.protocol !== 'https:' && !LOOPBACK_HOSTS.has(u.hostname)) { log('MCP_PUBLIC_URL must be https (http is only allowed for localhost testing)'); process.exit(1) }
  if (u.search || u.hash || (u.pathname !== '/' && u.pathname !== '')) { log('MCP_PUBLIC_URL must be an origin without a path, e.g. https://mcp.example.com'); process.exit(1) }
  if (OWNER_PASSWORD.length < 12) { log('OAuth needs MCP_OWNER_PASSWORD (at least 12 characters)'); process.exit(1) }
  if (OAUTH_SECRET && OAUTH_SECRET.length < 32) { log('MCP_OAUTH_SECRET must be at least 32 characters'); process.exit(1) }
  if (!OAUTH_SECRET) {
    OAUTH_SECRET = crypto.randomBytes(32).toString('hex')
    log('warning: MCP_OAUTH_SECRET not set; using a random one. All OAuth tokens become invalid on restart and will not work across multiple instances.')
  }
}

if (PUBLIC_URL) {
  const pu = new URL(PUBLIC_URL)
  ALLOWED_HOSTS.add(pu.host.toLowerCase())
  ALLOWED_ORIGINS.add(pu.origin)
}
if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  log(`invalid port: ${PORT}`)
  process.exit(1)
}
if (!bindIsLoopback && !TOKEN && !PUBLIC_URL && env.MCP_ALLOW_UNAUTHENTICATED !== '1') {
  log(`refusing to bind to ${HOST} without MCP_AUTH_TOKEN or OAuth (MCP_PUBLIC_URL + MCP_OWNER_PASSWORD). Configure auth, bind to 127.0.0.1, or set MCP_ALLOW_UNAUTHENTICATED=1.`)
  process.exit(1)
}
if (ALLOWED_ORIGINS.has('*')) log('warning: MCP_ALLOWED_ORIGINS="*" lets any website call this server from a browser')

/* --------------------------------------------------------------- helpers */

const sha = (s) => crypto.createHash('sha256').update(s).digest()
const bearerOf = (header) => (/^Bearer\s+(.+)$/i.exec(header || '') || [])[1]?.trim()

const hostnameOf = (hostHeader) => {
  const h = String(hostHeader || '').toLowerCase()
  if (h.startsWith('[')) return h.slice(0, h.indexOf(']') + 1) // [::1]:3333 -> [::1]
  return h.split(':')[0]
}

const hostAllowed = (hostHeader) => {
  const full = String(hostHeader || '').toLowerCase()
  const name = hostnameOf(hostHeader)
  if (ALLOWED_HOSTS.has(full) || ALLOWED_HOSTS.has(name)) return true
  if (bindIsLoopback) return LOOPBACK_HOSTS.has(name) // DNS-rebinding guard
  return ALLOWED_HOSTS.size === 0
}

const originAllowed = (origin) => {
  if (ALLOWED_ORIGINS.has('*') || ALLOWED_ORIGINS.has(origin)) return true
  if (bindIsLoopback) {
    try {
      return LOOPBACK_HOSTS.has(new URL(origin).hostname.toLowerCase())
    } catch {
      return false
    }
  }
  return false
}

const hits = new Map() // ip -> { count, resetAt }
const rateLimited = (ip) => {
  if (!RATE_LIMIT) return false
  const now = Date.now()
  let e = hits.get(ip)
  if (!e || e.resetAt <= now) {
    e = { count: 0, resetAt: now + 60_000 }
    hits.set(ip, e)
  }
  e.count++
  return e.count > RATE_LIMIT
}
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
}, 60_000).unref()

function reply(res, status, body, extra = {}) {
  const data = body === undefined ? '' : JSON.stringify(body)
  res.writeHead(status, {
    ...(data ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  })
  res.end(data)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers['content-length'])
    if (declared > MAX_BODY) return reject(Object.assign(new Error('Payload too large'), { status: 413 }))
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const oauth = PUBLIC_URL
  ? createOAuth({
      publicUrl: PUBLIC_URL,
      mcpPath: MCP_PATH,
      secret: OAUTH_SECRET,
      ownerPassword: OWNER_PASSWORD,
      staticClient: env.MCP_OAUTH_CLIENT_ID && env.MCP_OAUTH_CLIENT_SECRET ? { id: env.MCP_OAUTH_CLIENT_ID, secret: env.MCP_OAUTH_CLIENT_SECRET } : null,
      extraRedirects: list(env.MCP_OAUTH_REDIRECT_URIS),
      accessTtl: Number(env.MCP_ACCESS_TOKEN_TTL ?? 3600),
      log,
      reply,
      readBody,
    })
  : null
const AUTH_REQUIRED = !!(TOKEN || oauth)

const requestAuthorized = (header) => {
  if (!AUTH_REQUIRED) return true
  const t = bearerOf(header)
  if (!t) return false
  if (TOKEN && crypto.timingSafeEqual(sha(t), sha(TOKEN))) return true
  return !!oauth && oauth.verifyAccessToken(t)
}

const clientIp = (req) => (TRUST_PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || 'unknown'

/* --------------------------------------------------------------- handler */

async function onRequest(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const origin = req.headers.origin
  const corsHeaders = {}

  if (url.pathname === '/healthz' && req.method === 'GET') {
    return reply(res, 200, { status: 'ok', name: SERVER_INFO.name, version: SERVER_INFO.version })
  }
  if (!hostAllowed(req.headers.host)) return reply(res, 403, rpcError(null, -32000, 'Forbidden: Host not allowed'))

  // OAuth routes (claude.ai connector flow). Browsers navigate here, so no Origin rejection;
  // CORS headers are added only for allowed origins. Per-IP rate limit still applies.
  if (oauth && oauth.owns(url.pathname)) {
    const ip = clientIp(req)
    if (req.method === 'OPTIONS') {
      return reply(res, 204, undefined, origin && originAllowed(origin) ? {
        'Access-Control-Allow-Origin': origin, Vary: 'Origin',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version', 'Access-Control-Max-Age': '600',
      } : {})
    }
    if (rateLimited(ip)) return reply(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' })
    try {
      return await oauth.handle(req, res, url, ip)
    } catch (e) {
      log('oauth error:', e.stack || e.message)
      return reply(res, e.status || 500, { error: e.status === 413 ? 'invalid_request' : 'server_error' })
    }
  }

  if (url.pathname !== MCP_PATH) return reply(res, 404, { error: 'Not found' })

  if (origin) {
    if (!originAllowed(origin)) return reply(res, 403, rpcError(null, -32000, 'Forbidden: Origin not allowed'))
    Object.assign(corsHeaders, {
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Mcp-Session-Id, MCP-Protocol-Version',
      'Access-Control-Expose-Headers': 'Mcp-Session-Id',
      'Access-Control-Max-Age': '600',
    })
  }

  if (req.method === 'OPTIONS') return reply(res, 204, undefined, corsHeaders) // preflight carries no credentials

  if (!requestAuthorized(req.headers.authorization)) {
    // RFC 9728: point OAuth clients at the protected-resource metadata so they can start the flow.
    const challenge = `Bearer realm="ui-warehouse"${oauth ? `, resource_metadata="${oauth.metadataUrl}"` : ''}${req.headers.authorization ? ', error="invalid_token"' : ''}`
    return reply(res, 401, rpcError(null, -32001, 'Unauthorized'), { ...corsHeaders, 'WWW-Authenticate': challenge })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) return reply(res, 429, rpcError(null, -32002, 'Too many requests'), { ...corsHeaders, 'Retry-After': '60' })

  if (req.method !== 'POST') {
    // No server-initiated stream and no sessions in this stateless server.
    return reply(res, 405, rpcError(null, -32000, 'Method not allowed; use POST'), { ...corsHeaders, Allow: 'POST, OPTIONS' })
  }

  const proto = req.headers['mcp-protocol-version']
  if (proto && !SUPPORTED_PROTOCOLS.includes(proto)) {
    return reply(res, 400, rpcError(null, -32600, `Unsupported MCP-Protocol-Version: ${proto}`), corsHeaders)
  }

  let raw
  try {
    raw = await readBody(req)
  } catch (e) {
    return reply(res, e.status || 400, rpcError(null, -32600, e.message), corsHeaders)
  }

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return reply(res, 400, rpcError(null, -32700, 'Parse error'), corsHeaders)
  }

  const result = handlePayload(payload)
  if (result === null) return reply(res, 202, undefined, corsHeaders) // only notifications / client responses
  const invalid = !Array.isArray(result) && result.error && result.error.code === -32600
  return reply(res, invalid ? 400 : 200, result, corsHeaders)
}

/* ---------------------------------------------------------------- server */

const server = TLS ? https.createServer(TLS, onRequest) : http.createServer(onRequest)
server.requestTimeout = 30_000
server.headersTimeout = 15_000

server.listen(PORT, HOST, () => {
  const { port } = server.address()
  const scheme = TLS ? 'https' : 'http'
  const shownHost = HOST.includes(':') ? `[${HOST}]` : HOST
  log(`serving ${ROOT}`)
  log(`MCP endpoint: ${scheme}://${shownHost}:${port}${MCP_PATH}  (auth: ${[TOKEN && 'bearer token', oauth && 'OAuth'].filter(Boolean).join(' + ') || 'none'}${TLS ? ', TLS' : ''})`)
  if (oauth) log(`OAuth issuer: ${oauth.issuer}  (claude.ai connector URL: ${oauth.resource})`)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log(`${sig} received, shutting down`)
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 3000).unref()
  })
}
