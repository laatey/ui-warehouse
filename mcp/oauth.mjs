/**
 * Single-owner OAuth 2.1 layer for the UI warehouse MCP server (zero dependencies).
 *
 * Implements what MCP clients such as claude.ai need from a remote server:
 *   RFC 9728  protected-resource metadata      /.well-known/oauth-protected-resource[/mcp]
 *   RFC 8414  authorization-server metadata    /.well-known/oauth-authorization-server
 *   RFC 7591  dynamic client registration      POST /register
 *   RFC 7636  PKCE (S256 only)                 GET|POST /authorize, POST /token
 *   RFC 8707  resource indicators              `resource` must equal the MCP endpoint URL
 *   RFC 9207  `iss` on authorization responses
 *
 * Stateless by design: client ids, codes, access tokens and refresh tokens are HMAC-signed
 * blobs, so there is no database. The "user" is the owner: the consent page asks for
 * MCP_OWNER_PASSWORD. Rotating MCP_OAUTH_SECRET revokes everything.
 *
 * Known limits (documented in README): authorization codes are single-use per process only,
 * and refresh tokens are rotated but not replay-tracked across instances.
 */
import crypto from 'node:crypto'

const b64u = (x) => Buffer.from(x).toString('base64url')
const sha256 = (x) => crypto.createHash('sha256').update(x).digest()
const now = () => Math.floor(Date.now() / 1000)
const safeEq = (a, b) => crypto.timingSafeEqual(sha256(String(a)), sha256(String(b)))
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]'])
export const DEFAULT_REDIRECTS = ['https://claude.ai/api/mcp/auth_callback', 'https://claude.com/api/mcp/auth_callback']
const SCOPE = 'mcp'

export function createOAuth({ publicUrl, mcpPath, secret, ownerPassword, staticClient, extraRedirects = [], accessTtl = 3600, refreshTtl = 30 * 86400, log, reply, readBody }) {
  const issuer = publicUrl.replace(/\/+$/, '')
  const resource = issuer + mcpPath
  const publicOrigin = new URL(issuer).origin
  const redirectAllow = new Set([...DEFAULT_REDIRECTS, ...extraRedirects])
  const key = Buffer.from(secret)

  /* ------------------------------------------------------------ tokens */
  const sign = (type, obj) => {
    const payload = b64u(JSON.stringify({ t: type, ...obj }))
    return `${payload}.${b64u(crypto.createHmac('sha256', key).update(payload).digest())}`
  }
  const verify = (token, type) => {
    if (typeof token !== 'string' || token.length > 4096) return null
    const [payload, sig, extra] = token.split('.')
    if (!payload || !sig || extra !== undefined) return null
    const want = crypto.createHmac('sha256', key).update(payload).digest()
    let got
    try { got = Buffer.from(sig, 'base64url') } catch { return null }
    if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null
    let obj
    try { obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) } catch { return null }
    if (obj.t !== type) return null
    if (obj.exp !== undefined && obj.exp <= now()) return null
    return obj
  }

  const usedCodes = new Map() // jti -> exp (single-use within this process)
  setInterval(() => { for (const [k, v] of usedCodes) if (v <= now()) usedCodes.delete(k) }, 60_000).unref()

  /* ---------------------------------------------------- redirect policy */
  const redirectOk = (uri) => {
    if (typeof uri !== 'string' || uri.length > 300) return false
    let u
    try { u = new URL(uri) } catch { return false }
    if (u.hash) return false
    if (redirectAllow.has(uri)) return true
    return u.protocol === 'http:' && LOOPBACK.has(u.hostname.toLowerCase()) // Claude Code, MCP Inspector, mcp-remote
  }

  const resolveClient = (clientId) => {
    if (staticClient && typeof clientId === 'string' && safeEq(clientId, staticClient.id)) {
      return { id: staticClient.id, name: 'Pre-registered client', uris: null, secret: staticClient.secret }
    }
    const c = verify(clientId, 'client')
    return c ? { id: clientId, name: c.name, uris: new Set(c.uris), secret: null } : null
  }
  const clientAllowsRedirect = (client, uri) => (client.uris ? client.uris.has(uri) : redirectOk(uri))

  /* ----------------------------------------------------------- helpers */
  const noStore = { 'Cache-Control': 'no-store', Pragma: 'no-cache' }
  const oauthError = (res, status, error, description, extra = {}) =>
    reply(res, status, { error, ...(description ? { error_description: description } : {}) }, { ...noStore, ...extra })

  const redirect = (res, uri, params) => {
    const u = new URL(uri)
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v)
    u.searchParams.set('iss', issuer)
    res.writeHead(303, { Location: u.toString(), ...noStore })
    res.end()
  }

  const page = (res, status, title, body) => {
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title><style>
:root{color-scheme:light dark;--bg:#fff;--fg:#111;--mut:#666;--bd:#ddd;--pri:#111;--prif:#fff}
@media(prefers-color-scheme:dark){:root{--bg:#111;--fg:#eee;--mut:#999;--bd:#333;--pri:#eee;--prif:#111}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{width:min(420px,92vw);padding:28px;border:1px solid var(--bd);border-radius:12px}
h1{font-size:18px;margin:0 0 8px}p{color:var(--mut);margin:6px 0}code{color:var(--fg);word-break:break-all}
input[type=password]{width:100%;box-sizing:border-box;margin:14px 0 4px;padding:9px 10px;border:1px solid var(--bd);border-radius:8px;background:transparent;color:var(--fg);font:inherit}
.row{display:flex;gap:8px;margin-top:14px}button{flex:1;padding:9px;border-radius:8px;border:1px solid var(--bd);background:transparent;color:var(--fg);font:inherit;cursor:pointer}
button.pri{background:var(--pri);color:var(--prif);border-color:var(--pri)}.err{color:#c0392b}</style></head><body><main>${body}</main></body></html>`
    res.writeHead(status, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(html),
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
      ...noStore,
    })
    res.end(html)
  }

  const consentPage = (res, reqBlob, client, redirectUri, errorMsg) => {
    const host = new URL(redirectUri).host
    page(res, errorMsg ? 401 : 200, 'Authorize UI Warehouse', `
<h1>Authorize access</h1>
<p><strong>${esc(client.name)}</strong> wants to read the UI warehouse (asset manifests and source code).</p>
<p>It will be sent back to <code>${esc(host)}</code>.</p>
${errorMsg ? `<p class="err" role="alert">${esc(errorMsg)}</p>` : ''}
<form method="post" action="${esc(issuer)}/authorize">
<input type="hidden" name="req" value="${esc(reqBlob)}">
<input type="password" name="password" placeholder="Owner password" autocomplete="current-password" autofocus aria-label="Owner password">
<div class="row"><button type="submit" name="decision" value="deny" formnovalidate>Deny</button><button class="pri" type="submit" name="decision" value="approve">Approve</button></div>
</form>`)
  }

  // Password attempts: 10 per 15 minutes per IP (per process).
  const attempts = new Map()
  const tooManyAttempts = (ip, bump) => {
    const t = Date.now()
    let e = attempts.get(ip)
    if (!e || e.reset <= t) { e = { n: 0, reset: t + 15 * 60_000 }; attempts.set(ip, e) }
    if (bump) e.n++
    return e.n > 10
  }
  setInterval(() => { const t = Date.now(); for (const [k, v] of attempts) if (v.reset <= t) attempts.delete(k) }, 60_000).unref()

  const parseForm = async (req) => {
    const raw = await readBody(req)
    if (/json/i.test(req.headers['content-type'] || '')) return JSON.parse(raw || '{}')
    return Object.fromEntries(new URLSearchParams(raw))
  }

  /* ---------------------------------------------------------- endpoints */
  const protectedResourceDoc = { resource, authorization_servers: [issuer], bearer_methods_supported: ['header'], scopes_supported: [SCOPE], resource_name: 'MoreCode UI Warehouse' }
  const authServerDoc = {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    registration_endpoint: `${issuer}/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: staticClient ? ['none', 'client_secret_post', 'client_secret_basic'] : ['none'],
    scopes_supported: [SCOPE],
    authorization_response_iss_parameter_supported: true,
  }

  async function register(req, res) {
    let body
    try { body = await parseForm(req) } catch { return oauthError(res, 400, 'invalid_client_metadata', 'Body must be JSON') }
    const uris = body.redirect_uris
    if (!Array.isArray(uris) || uris.length < 1 || uris.length > 5 || !uris.every(redirectOk)) {
      return oauthError(res, 400, 'invalid_redirect_uri', 'redirect_uris must list 1-5 allowed URIs (Claude callbacks or loopback)')
    }
    if (body.token_endpoint_auth_method && body.token_endpoint_auth_method !== 'none') {
      return oauthError(res, 400, 'invalid_client_metadata', 'Only public clients (token_endpoint_auth_method "none") may self-register')
    }
    const name = String(body.client_name || 'MCP client').replace(/[\u0000-\u001f]/g, '').slice(0, 100)
    const iat = now()
    reply(res, 201, {
      client_id: sign('client', { name, uris, iat, n: b64u(crypto.randomBytes(9)) }), // nonce: every registration gets a distinct id
      client_id_issued_at: iat,
      client_name: name,
      redirect_uris: uris,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
      scope: SCOPE,
    }, noStore)
  }

  function authorizeGet(req, res, url) {
    const q = url.searchParams
    const client = resolveClient(q.get('client_id'))
    const redirectUri = q.get('redirect_uri')
    if (!client) return page(res, 400, 'Invalid request', '<h1>Invalid request</h1><p>Unknown client.</p>')
    if (!redirectUri || !clientAllowsRedirect(client, redirectUri)) return page(res, 400, 'Invalid request', '<h1>Invalid request</h1><p>Redirect URI is not registered for this client.</p>')

    const state = q.get('state') || undefined
    const fail = (error, description) => redirect(res, redirectUri, { error, error_description: description, state })
    if (q.get('response_type') !== 'code') return fail('unsupported_response_type', 'Only response_type=code is supported')
    const challenge = q.get('code_challenge')
    if (!challenge || !/^[A-Za-z0-9_-]{43}$/.test(challenge) || q.get('code_challenge_method') !== 'S256') return fail('invalid_request', 'PKCE with code_challenge_method=S256 is required')
    const res_ = q.get('resource')
    if (res_ && res_ !== resource) return fail('invalid_target', 'Unknown resource')

    const blob = sign('req', { cid: client.id, uri: redirectUri, st: state, ch: challenge, exp: now() + 600 })
    consentPage(res, blob, client, redirectUri)
  }

  async function authorizePost(req, res, ip) {
    const origin = req.headers.origin
    const fwdHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase()
    let originHost = ''
    try { if (origin && origin !== 'null') originHost = new URL(origin).host.toLowerCase() } catch { originHost = 'invalid' }
    if (origin && origin !== 'null' && origin !== publicOrigin && (!fwdHost || originHost !== fwdHost)) {
      return page(res, 403, 'Forbidden', '<h1>Forbidden</h1><p>Cross-origin submission rejected.</p>')
    }
    let form
    try { form = await parseForm(req) } catch { return page(res, 400, 'Invalid request', '<h1>Invalid request</h1>') }
    const r = verify(form.req, 'req')
    if (!r) return page(res, 400, 'Expired', '<h1>Request expired</h1><p>Return to the app and start again.</p>')
    const client = resolveClient(r.cid)
    if (!client || !clientAllowsRedirect(client, r.uri)) return page(res, 400, 'Invalid request', '<h1>Invalid request</h1>')

    if (form.decision === 'deny') return redirect(res, r.uri, { error: 'access_denied', state: r.st })

    if (tooManyAttempts(ip, false)) return page(res, 429, 'Too many attempts', '<h1>Too many attempts</h1><p>Try again in 15 minutes.</p>')
    if (!form.password || !safeEq(form.password, ownerPassword)) {
      tooManyAttempts(ip, true)
      log(`failed owner login from ${ip}`)
      return consentPage(res, form.req, client, r.uri, 'Incorrect password.')
    }
    const code = sign('code', { cid: r.cid, uri: r.uri, ch: r.ch, res: resource, jti: b64u(crypto.randomBytes(12)), exp: now() + 60 })
    redirect(res, r.uri, { code, state: r.st })
  }

  async function token(req, res) {
    let p
    try { p = await parseForm(req) } catch { return oauthError(res, 400, 'invalid_request', 'Malformed body') }

    // Client authentication: Basic header, or client_id/client_secret in the body.
    let clientId = p.client_id
    let clientSecret = p.client_secret
    const basic = /^Basic\s+(.+)$/i.exec(req.headers.authorization || '')
    if (basic) {
      const [id, ...rest] = Buffer.from(basic[1], 'base64').toString('utf8').split(':')
      clientId = decodeURIComponent(id)
      clientSecret = decodeURIComponent(rest.join(':'))
    }
    const client = resolveClient(clientId)
    if (!client) return oauthError(res, 401, 'invalid_client', 'Unknown client', { 'WWW-Authenticate': 'Basic realm="ui-warehouse"' })
    if (client.secret && !(clientSecret && safeEq(clientSecret, client.secret))) {
      return oauthError(res, 401, 'invalid_client', 'Bad client credentials', { 'WWW-Authenticate': 'Basic realm="ui-warehouse"' })
    }
    if (p.resource && p.resource !== resource) return oauthError(res, 400, 'invalid_target', 'Unknown resource')

    const issue = (cid) => ({
      access_token: sign('at', { cid, res: resource, exp: now() + accessTtl }),
      token_type: 'Bearer',
      expires_in: accessTtl,
      refresh_token: sign('rt', { cid, res: resource, jti: b64u(crypto.randomBytes(12)), exp: now() + refreshTtl }),
      scope: SCOPE,
    })

    if (p.grant_type === 'authorization_code') {
      const c = verify(p.code, 'code')
      if (!c || c.cid !== client.id) return oauthError(res, 400, 'invalid_grant', 'Invalid or expired code')
      if (usedCodes.has(c.jti)) return oauthError(res, 400, 'invalid_grant', 'Code already used')
      usedCodes.set(c.jti, c.exp)
      if (p.redirect_uri !== c.uri) return oauthError(res, 400, 'invalid_grant', 'redirect_uri mismatch')
      const v = p.code_verifier
      if (typeof v !== 'string' || !/^[A-Za-z0-9\-._~]{43,128}$/.test(v)) return oauthError(res, 400, 'invalid_grant', 'Missing or malformed code_verifier')
      if (!safeEq(b64u(sha256(v)), c.ch)) return oauthError(res, 400, 'invalid_grant', 'PKCE verification failed')
      return reply(res, 200, issue(client.id), noStore)
    }

    if (p.grant_type === 'refresh_token') {
      const rt = verify(p.refresh_token, 'rt')
      if (!rt || rt.cid !== client.id || rt.res !== resource) return oauthError(res, 400, 'invalid_grant', 'Invalid or expired refresh token')
      return reply(res, 200, issue(client.id), noStore)
    }

    return oauthError(res, 400, 'unsupported_grant_type', 'Use authorization_code or refresh_token')
  }

  const wellKnownHeaders = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' }
  const WK_PR = ['/.well-known/oauth-protected-resource', `/.well-known/oauth-protected-resource${mcpPath}`]
  const WK_AS = ['/.well-known/oauth-authorization-server', '/.well-known/openid-configuration']
  const PATHS = new Set([...WK_PR, ...WK_AS, '/register', '/authorize', '/token'])

  return {
    issuer,
    resource,
    metadataUrl: `${issuer}${WK_PR[0]}`,
    owns: (pathname) => PATHS.has(pathname),
    verifyAccessToken: (tok) => {
      const t = verify(tok, 'at')
      return !!t && t.res === resource
    },
    /** Handles an OAuth route. `ip` is used for login throttling. */
    async handle(req, res, url, ip) {
      const p = url.pathname
      if (WK_PR.includes(p) && req.method === 'GET') return reply(res, 200, protectedResourceDoc, wellKnownHeaders)
      if (WK_AS.includes(p) && req.method === 'GET') return reply(res, 200, authServerDoc, wellKnownHeaders)
      if (p === '/register' && req.method === 'POST') return register(req, res)
      if (p === '/token' && req.method === 'POST') return token(req, res)
      if (p === '/authorize' && req.method === 'GET') return authorizeGet(req, res, url)
      if (p === '/authorize' && req.method === 'POST') return authorizePost(req, res, ip)
      return reply(res, 405, { error: 'method_not_allowed' }, { Allow: p === '/authorize' ? 'GET, POST' : p === '/register' || p === '/token' ? 'POST' : 'GET' })
    },
  }
}
