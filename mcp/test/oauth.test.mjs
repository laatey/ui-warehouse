import { spawn } from 'node:child_process'
import http from 'node:http'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HTTP = fileURLToPath(new URL('../http.mjs', import.meta.url))
const CLAUDE_CB = 'https://claude.ai/api/mcp/auth_callback'
const PASSWORD = 'correct horse battery'
const SECRET = 'x'.repeat(40)
let fails = 0
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${cond ? '' : '  ' + extra}`); if (!cond) fails++ }

const start = (port, envx = {}) => new Promise((resolve, reject) => {
  const p = spawn('node', [HTTP], {
    env: { ...process.env, PORT: String(port), MCP_PUBLIC_URL: `http://localhost:${port}`, MCP_OWNER_PASSWORD: PASSWORD, MCP_OAUTH_SECRET: SECRET, MCP_RATE_LIMIT: '0', ...envx },
    stdio: ['ignore', 'ignore', 'pipe'],
  })
  let err = ''
  p.stderr.on('data', (d) => { err += d; if (/OAuth issuer/.test(err)) resolve({ p, err: () => err }) })
  p.on('exit', (code) => reject(Object.assign(new Error('exited ' + code), { err, code })))
})

const pkce = () => {
  const verifier = crypto.randomBytes(32).toString('base64url')
  return { verifier, challenge: crypto.createHash('sha256').update(verifier).digest('base64url') }
}
const form = (o) => new URLSearchParams(o).toString()
const mcp = (base, body, token) => fetch(`${base}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
const LIST = { jsonrpc: '2.0', id: 1, method: 'tools/list' }

async function register(base, redirect = CLAUDE_CB, extra = {}) {
  const r = await fetch(`${base}/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ client_name: 'Claude', redirect_uris: [redirect], ...extra }) })
  return { r, j: await r.json() }
}
const authorizeUrl = (base, o) => `${base}/authorize?${form({ response_type: 'code', ...o })}`
const reqBlob = (html) => /name="req" value="([^"]+)"/.exec(html)?.[1]

/** Walk GET /authorize -> POST /authorize. Returns the manual-redirect response. */
async function approve(base, client_id, redirect_uri, challenge, { password = PASSWORD, decision = 'approve', state = 'st4te', headers = {} } = {}) {
  const g = await fetch(authorizeUrl(base, { client_id, redirect_uri, code_challenge: challenge, code_challenge_method: 'S256', state, resource: `${base}/mcp` }))
  const html = await g.text()
  const blob = reqBlob(html)
  if (!blob) return { g, html }
  const r = await fetch(`${base}/authorize`, { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers }, body: form({ req: blob, password, decision }) })
  return { g, r, html }
}
const codeFrom = (r) => new URL(r.headers.get('location')).searchParams.get('code')
const token = (base, o, headers = {}) => fetch(`${base}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers }, body: form(o) })

async function fullFlow(base) {
  const { j: client } = await register(base)
  const { verifier, challenge } = pkce()
  const { r } = await approve(base, client.client_id, CLAUDE_CB, challenge)
  const code = codeFrom(r)
  const t = await token(base, { grant_type: 'authorization_code', code, redirect_uri: CLAUDE_CB, client_id: client.client_id, code_verifier: verifier })
  return { client, tokens: await t.json(), verifier, challenge, code, status: t.status }
}

/* ============ A. the happy path, as claude.ai does it ============ */
{
  const port = 39871, base = `http://localhost:${port}`
  const { p } = await start(port)

  let r = await mcp(base, LIST)
  const wa = r.headers.get('www-authenticate') || ''
  ok('unauthenticated /mcp -> 401 with resource_metadata pointer', r.status === 401 && wa.includes(`resource_metadata="${base}/.well-known/oauth-protected-resource"`), wa)

  r = await fetch(`${base}/.well-known/oauth-protected-resource`)
  let j = await r.json()
  ok('protected-resource metadata', r.status === 200 && j.resource === `${base}/mcp` && j.authorization_servers[0] === base, JSON.stringify(j))
  r = await fetch(`${base}/.well-known/oauth-protected-resource/mcp`)
  ok('path-inserted metadata variant', r.status === 200 && (await r.json()).resource === `${base}/mcp`)

  r = await fetch(`${base}/.well-known/oauth-authorization-server`)
  j = await r.json()
  ok('AS metadata: endpoints + S256 + DCR', j.issuer === base && j.authorization_endpoint === `${base}/authorize` && j.token_endpoint === `${base}/token` && j.registration_endpoint === `${base}/register` && j.code_challenge_methods_supported.join() === 'S256', JSON.stringify(j))
  ok('AS metadata is CORS-readable', r.headers.get('access-control-allow-origin') === '*')

  const f = await fullFlow(base)
  ok('full flow: DCR -> authorize -> token', f.status === 200 && f.tokens.token_type === 'Bearer' && f.tokens.access_token && f.tokens.refresh_token, JSON.stringify(f.tokens))

  r = await mcp(base, { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } } }, f.tokens.access_token)
  ok('access token works on /mcp', r.status === 200)
  r = await mcp(base, { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_assets', arguments: { query: 'kanban' } } }, f.tokens.access_token)
  ok('tool call with OAuth token', r.status === 200 && JSON.parse((await r.json()).result.content[0].text).results.length > 0)

  // replay + binding
  r = await token(base, { grant_type: 'authorization_code', code: f.code, redirect_uri: CLAUDE_CB, client_id: f.client.client_id, code_verifier: f.verifier })
  ok('code replay rejected', r.status === 400 && (await r.json()).error === 'invalid_grant')

  // refresh
  r = await token(base, { grant_type: 'refresh_token', refresh_token: f.tokens.refresh_token, client_id: f.client.client_id })
  j = await r.json()
  ok('refresh grant returns a working token', r.status === 200 && (await mcp(base, LIST, j.access_token)).status === 200)
  const other = (await register(base)).j
  r = await token(base, { grant_type: 'refresh_token', refresh_token: f.tokens.refresh_token, client_id: other.client_id })
  ok('refresh token bound to its client', r.status === 400 && (await r.json()).error === 'invalid_grant')
  r = await token(base, { grant_type: 'refresh_token', refresh_token: f.tokens.access_token, client_id: f.client.client_id })
  ok('access token cannot be used as refresh token', r.status === 400)
  r = await mcp(base, LIST, f.tokens.refresh_token)
  ok('refresh token cannot be used as access token', r.status === 401)

  // tampering
  const tampered = f.tokens.access_token.slice(0, -3) + (f.tokens.access_token.endsWith('AAA') ? 'BBB' : 'AAA')
  r = await mcp(base, LIST, tampered)
  ok('tampered token -> 401 invalid_token', r.status === 401 && /invalid_token/.test(r.headers.get('www-authenticate')))
  const [pl] = f.tokens.access_token.split('.')
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(pl, 'base64url')), exp: 9999999999 })).toString('base64url') + '.' + f.tokens.access_token.split('.')[1]
  r = await mcp(base, LIST, forged)
  ok('payload-edited token rejected (signature check)', r.status === 401)

  // registration policy
  let reg = await register(base, 'https://evil.example/cb')
  ok('DCR rejects non-allowlisted redirect', reg.r.status === 400 && reg.j.error === 'invalid_redirect_uri')
  reg = await register(base, CLAUDE_CB, { token_endpoint_auth_method: 'client_secret_basic' })
  ok('DCR rejects confidential-client request', reg.r.status === 400)
  reg = await register(base, 'http://127.0.0.1:54321/callback')
  ok('DCR accepts loopback redirect (Claude Code / Inspector)', reg.r.status === 201)
  reg = await register(base, 'http://evil.example/cb')
  ok('DCR rejects plain-http non-loopback', reg.r.status === 400)

  // authorize validation
  const { challenge } = pkce()
  const c = (await register(base)).j
  let g = await fetch(authorizeUrl(base, { client_id: c.client_id, redirect_uri: 'https://claude.com/api/mcp/auth_callback', code_challenge: challenge, code_challenge_method: 'S256' }), { redirect: 'manual' })
  ok('redirect_uri not registered for client -> error page, no redirect', g.status === 400 && !g.headers.get('location'))
  g = await fetch(authorizeUrl(base, { client_id: 'bogus', redirect_uri: CLAUDE_CB, code_challenge: challenge, code_challenge_method: 'S256' }), { redirect: 'manual' })
  ok('unknown client -> error page', g.status === 400 && !g.headers.get('location'))
  g = await fetch(authorizeUrl(base, { client_id: c.client_id, redirect_uri: CLAUDE_CB, state: 's' }), { redirect: 'manual' })
  ok('missing PKCE -> invalid_request redirect', g.status === 303 && new URL(g.headers.get('location')).searchParams.get('error') === 'invalid_request')
  g = await fetch(authorizeUrl(base, { client_id: c.client_id, redirect_uri: CLAUDE_CB, code_challenge: challenge, code_challenge_method: 'plain' }), { redirect: 'manual' })
  ok('PKCE plain refused', g.status === 303 && new URL(g.headers.get('location')).searchParams.get('error') === 'invalid_request')
  g = await fetch(authorizeUrl(base, { client_id: c.client_id, redirect_uri: CLAUDE_CB, code_challenge: challenge, code_challenge_method: 'S256', resource: 'https://other.example/mcp' }), { redirect: 'manual' })
  ok('wrong resource -> invalid_target', g.status === 303 && new URL(g.headers.get('location')).searchParams.get('error') === 'invalid_target')
  g = await fetch(authorizeUrl(base, { client_id: c.client_id, redirect_uri: CLAUDE_CB, code_challenge: challenge, code_challenge_method: 'S256' }))
  ok('consent page is frame-proof and escapes content', /frame-ancestors 'none'/.test(g.headers.get('content-security-policy')) && g.headers.get('x-frame-options') === 'DENY')
  const evilName = (await register(base, CLAUDE_CB, { client_name: '<script>alert(1)</script>' })).j
  g = await fetch(authorizeUrl(base, { client_id: evilName.client_id, redirect_uri: CLAUDE_CB, code_challenge: challenge, code_challenge_method: 'S256' }))
  const html = await g.text()
  ok('client_name is HTML-escaped on consent page', !html.includes('<script>alert(1)') && html.includes('&lt;script&gt;'))

  // consent decisions
  let a = await approve(base, c.client_id, CLAUDE_CB, challenge, { password: 'wrong password!!' })
  ok('wrong password -> 401 page, no redirect, no code', a.r.status === 401 && !a.r.headers.get('location'))
  a = await approve(base, c.client_id, CLAUDE_CB, challenge, { decision: 'deny' })
  ok('deny -> access_denied redirect with state', a.r.status === 303 && new URL(a.r.headers.get('location')).searchParams.get('error') === 'access_denied' && new URL(a.r.headers.get('location')).searchParams.get('state') === 'st4te')
  a = await approve(base, c.client_id, CLAUDE_CB, challenge)
  const loc = new URL(a.r.headers.get('location'))
  ok('approve -> code + state + iss on redirect', loc.origin + loc.pathname === CLAUDE_CB && loc.searchParams.get('code') && loc.searchParams.get('state') === 'st4te' && loc.searchParams.get('iss') === base, a.r.headers.get('location'))
  a = await approve(base, c.client_id, CLAUDE_CB, challenge, { headers: { origin: 'https://evil.example' } })
  ok('cross-origin consent POST rejected', a.r.status === 403)

  // token-endpoint attacks (each gets a fresh code; a failed attempt burns the code)
  const attempt = async (mut) => {
    const cl = (await register(base)).j
    const pk = pkce()
    const ap = await approve(base, cl.client_id, CLAUDE_CB, pk.challenge)
    const body = { grant_type: 'authorization_code', code: codeFrom(ap.r), redirect_uri: CLAUDE_CB, client_id: cl.client_id, code_verifier: pk.verifier }
    const res = await token(base, mut(body, cl, pk))
    return { status: res.status, j: await res.json() }
  }
  let t = await attempt((b, cl, pk) => ({ ...b, code_verifier: pkce().verifier }))
  ok('wrong PKCE verifier rejected', t.status === 400 && t.j.error === 'invalid_grant')
  t = await attempt((b) => { const { code_verifier, ...rest } = b; return rest })
  ok('missing code_verifier rejected', t.status === 400 && t.j.error === 'invalid_grant')
  t = await attempt((b) => ({ ...b, redirect_uri: 'https://claude.com/api/mcp/auth_callback' }))
  ok('redirect_uri mismatch at token rejected', t.status === 400)
  {
    const cl1 = (await register(base)).j, cl2 = (await register(base)).j, pk = pkce()
    const ap = await approve(base, cl1.client_id, CLAUDE_CB, pk.challenge)
    const res = await token(base, { grant_type: 'authorization_code', code: codeFrom(ap.r), redirect_uri: CLAUDE_CB, client_id: cl2.client_id, code_verifier: pk.verifier })
    ok('code bound to issuing client', res.status === 400 && (await res.json()).error === 'invalid_grant')
  }
  t = await attempt((b) => ({ ...b, resource: 'https://other.example/mcp' }))
  ok('wrong resource at token rejected', t.status === 400 && t.j.error === 'invalid_target')
  r = await token(base, { grant_type: 'password', client_id: c.client_id })
  ok('unsupported grant type', r.status === 400 && (await r.json()).error === 'unsupported_grant_type')
  r = await token(base, { grant_type: 'authorization_code', code: 'junk', client_id: c.client_id, redirect_uri: CLAUDE_CB, code_verifier: 'x'.repeat(50) })
  ok('garbage code rejected', r.status === 400)
  r = await fetch(`${base}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form({ grant_type: 'refresh_token', refresh_token: 'a.b', client_id: 'nope' }) })
  ok('unknown client at token -> 401 invalid_client', r.status === 401 && (await r.json()).error === 'invalid_client')
  ok('token responses are no-store', (await token(base, { grant_type: 'x', client_id: c.client_id })).headers.get('cache-control') === 'no-store')

  // brute force: this IP has already had several failures above; push past 10 total
  let last
  for (let i = 0; i < 12; i++) last = await approve(base, c.client_id, CLAUDE_CB, challenge, { password: 'nope nope nope nope' })
  ok('password brute-force locked out (429)', last.r.status === 429, String(last.r.status))
  a = await approve(base, c.client_id, CLAUDE_CB, challenge)
  ok('lockout also blocks the right password', a.r.status === 429)

  // wrong HTTP methods
  r = await fetch(`${base}/token`)
  ok('GET /token -> 405', r.status === 405)

  // Existing auth surfaces still behave
  r = await fetch(`${base}/healthz`)
  ok('healthz stays open', r.status === 200)
  p.kill()
}

/* ============ B. static token coexists; secret rotation revokes; expiry ============ */
{
  const port = 39872, base = `http://localhost:${port}`
  let s = await start(port, { MCP_AUTH_TOKEN: 'static-token-123' })
  const f = await fullFlow(base)
  ok('OAuth + static token: OAuth token works', (await mcp(base, LIST, f.tokens.access_token)).status === 200)
  ok('OAuth + static token: static token works', (await mcp(base, LIST, 'static-token-123')).status === 200)
  s.p.kill(); await new Promise((r) => setTimeout(r, 300))
  s = await start(port, { MCP_OAUTH_SECRET: 'y'.repeat(40) })
  ok('rotating MCP_OAUTH_SECRET revokes old tokens', (await mcp(base, LIST, f.tokens.access_token)).status === 401)
  s.p.kill(); await new Promise((r) => setTimeout(r, 300))

  s = await start(port, { MCP_ACCESS_TOKEN_TTL: '1' })
  const g = await fullFlow(base)
  ok('short-lived token works at first', (await mcp(base, LIST, g.tokens.access_token)).status === 200)
  await new Promise((r) => setTimeout(r, 2200))
  ok('access token expires', (await mcp(base, LIST, g.tokens.access_token)).status === 401)
  const rr = await token(base, { grant_type: 'refresh_token', refresh_token: g.tokens.refresh_token, client_id: g.client.client_id })
  ok('refresh still works after access token expiry', rr.status === 200)
  s.p.kill(); await new Promise((r) => setTimeout(r, 300))
}

/* ============ C. pre-registered client (claude.ai "advanced settings") ============ */
{
  const port = 39873, base = `http://localhost:${port}`
  const { p } = await start(port, { MCP_OAUTH_CLIENT_ID: 'claude-warehouse', MCP_OAUTH_CLIENT_SECRET: 'client-secret-abcdefgh' })
  const { verifier, challenge } = pkce()
  const ap = await approve(base, 'claude-warehouse', CLAUDE_CB, challenge)
  ok('static client can authorize on Claude callback', ap.r && ap.r.status === 303)
  const code = codeFrom(ap.r)
  const body = { grant_type: 'authorization_code', code, redirect_uri: CLAUDE_CB, client_id: 'claude-warehouse', code_verifier: verifier }
  let r = await token(base, body)
  ok('static client without secret -> 401', r.status === 401)
  const ap2 = await approve(base, 'claude-warehouse', CLAUDE_CB, challenge)
  r = await token(base, { ...body, code: codeFrom(ap2.r), client_secret: 'wrong-secret-xxxxxxx' })
  ok('static client wrong secret -> 401', r.status === 401)
  const ap3 = await approve(base, 'claude-warehouse', CLAUDE_CB, challenge)
  r = await token(base, { ...body, code: codeFrom(ap3.r), client_secret: 'client-secret-abcdefgh' })
  const t3 = await r.json()
  ok('static client secret in body -> tokens', r.status === 200 && (await mcp(base, LIST, t3.access_token)).status === 200)
  const ap4 = await approve(base, 'claude-warehouse', CLAUDE_CB, challenge)
  const basic = 'Basic ' + Buffer.from('claude-warehouse:client-secret-abcdefgh').toString('base64')
  const { client_id, ...noId } = { ...body, code: codeFrom(ap4.r) }
  r = await token(base, noId, { authorization: basic })
  ok('static client via HTTP Basic -> tokens', r.status === 200)
  const ap5 = await approve(base, 'claude-warehouse', 'https://evil.example/cb', challenge)
  ok('static client still limited to allowlisted redirects', ap5.g.status === 400)
  p.kill()
}

/* ============ D. behind a tunnel / proxy: public Host header ============ */
{
  const port = 39874
  const { p } = await start(port, { MCP_PUBLIC_URL: 'https://mcp.example.com' })
  const get = (host, path) => new Promise((res, rej) => {
    const r = http.request({ host: '127.0.0.1', port, path, headers: { host } }, (x) => { let d = ''; x.on('data', (c) => (d += c)); x.on('end', () => res({ status: x.statusCode, body: d })) })
    r.on('error', rej); r.end()
  })
  let r = await get('mcp.example.com', '/.well-known/oauth-authorization-server')
  ok('public Host accepted on loopback bind (tunnel case)', r.status === 200 && JSON.parse(r.body).issuer === 'https://mcp.example.com', r.body)
  r = await get('evil.example', '/.well-known/oauth-authorization-server')
  ok('other Host still rejected', r.status === 403)
  r = await get('mcp.example.com', '/.well-known/oauth-protected-resource')
  ok('resource URL advertises public https URL', JSON.parse(r.body).resource === 'https://mcp.example.com/mcp')
  p.kill()
}

/* ============ E. startup validation ============ */
{
  const bad = (envx) => new Promise((res) => {
    const p = spawn('node', [HTTP], { env: { ...process.env, PORT: '0', ...envx }, stdio: ['ignore', 'ignore', 'pipe'] })
    let e = ''; p.stderr.on('data', (d) => (e += d)); p.on('exit', (c) => res({ code: c, err: e }))
    setTimeout(() => { p.kill(); res({ code: 'running', err: e }) }, 1500)
  })
  let r = await bad({ MCP_PUBLIC_URL: 'http://mcp.example.com', MCP_OWNER_PASSWORD: PASSWORD })
  ok('refuses non-https public URL', r.code === 1 && /https/.test(r.err))
  r = await bad({ MCP_PUBLIC_URL: 'https://mcp.example.com' })
  ok('refuses OAuth without owner password', r.code === 1 && /MCP_OWNER_PASSWORD/.test(r.err))
  r = await bad({ MCP_PUBLIC_URL: 'https://mcp.example.com', MCP_OWNER_PASSWORD: 'short' })
  ok('refuses weak owner password', r.code === 1)
  r = await bad({ MCP_PUBLIC_URL: 'https://mcp.example.com/path', MCP_OWNER_PASSWORD: PASSWORD })
  ok('refuses public URL with a path', r.code === 1)
  r = await bad({ MCP_PUBLIC_URL: 'https://mcp.example.com', MCP_OWNER_PASSWORD: PASSWORD, MCP_OAUTH_SECRET: 'tooshort' })
  ok('refuses short signing secret', r.code === 1)
  r = await bad({ MCP_PUBLIC_URL: 'https://mcp.example.com', MCP_OWNER_PASSWORD: PASSWORD, HOST: '0.0.0.0', MCP_OAUTH_SECRET: SECRET })
  ok('public bind with OAuth configured starts', r.code === 'running')
}

console.log(fails ? `\n${fails} FAILED` : '\nall passed')
process.exit(fails ? 1 : 0)
