import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const HTTP = fileURLToPath(new URL('../http.mjs', import.meta.url))
import fs from 'node:fs'
let fails = 0
const ok = (name, cond, extra='') => { console.log(`${cond?'ok  ':'FAIL'} ${name} ${cond?'':extra}`); if(!cond) fails++ }
const start = (envx, args=[]) => new Promise((resolve, reject) => {
  const p = spawn('node', [HTTP, ...args], { env: { ...process.env, ...envx }, stdio: ['ignore','ignore','pipe'] })
  let err = ''; p.stderr.on('data', d => { err += d; const m = /MCP endpoint: (\S+)/.exec(err); if (m) resolve({ p, url: m[1], err: () => err }) })
  p.on('exit', code => reject(Object.assign(new Error('exited '+code), { err, code })))
})
const rpc = (url, body, headers={}) => fetch(url, { method:'POST', headers:{'content-type':'application/json', accept:'application/json, text/event-stream', ...headers}, body: typeof body==='string'?body:JSON.stringify(body) })
const init = {jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'t',version:'0'}}}

// ---------- 1. default: loopback, no token
{
  const { p, url } = await start({ PORT:'0' })
  const base = url.replace(/\/mcp$/, '')
  let r = await rpc(url, init); let j = await r.json()
  ok('initialize 200 + json', r.status===200 && /json/.test(r.headers.get('content-type')) && j.result.serverInfo.name==='ui-warehouse')
  r = await rpc(url, {jsonrpc:'2.0',method:'notifications/initialized'}); ok('notification -> 202 empty', r.status===202 && (await r.text())==='')
  r = await rpc(url, {jsonrpc:'2.0',id:2,method:'tools/list'}); j = await r.json(); ok('tools/list', j.result.tools.length===8)
  r = await rpc(url, {jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'search_assets',arguments:{query:'wizard stepper'}}}); j = await r.json()
  ok('search finds the wizard asset', JSON.parse(j.result.content[0].text).results[0].name==='form-wizard-shell')
  r = await rpc(url, [{jsonrpc:'2.0',id:10,method:'ping'},{jsonrpc:'2.0',method:'notifications/initialized'},{jsonrpc:'2.0',id:11,method:'tools/list'}]); j = await r.json()
  ok('batch returns array w/o notification', Array.isArray(j) && j.length===2 && j.map(x=>x.id).join()==='10,11')
  r = await rpc(url, [{jsonrpc:'2.0',method:'notifications/initialized'}]); ok('batch of only notifications -> 202', r.status===202)
  r = await rpc(url, '{not json'); j = await r.json(); ok('bad JSON -> 400/-32700', r.status===400 && j.error.code===-32700)
  r = await rpc(url, {foo:1,id:5}); j = await r.json(); ok('invalid request -> 400/-32600', r.status===400 && j.error.code===-32600)
  r = await rpc(url, []); ok('empty batch -> 400', r.status===400)
  r = await rpc(url, {jsonrpc:'2.0',id:6,method:'nope'}); j = await r.json(); ok('unknown method -> 200 + -32601', r.status===200 && j.error.code===-32601)
  r = await fetch(url); ok('GET -> 405 + Allow', r.status===405 && /POST/.test(r.headers.get('allow')))
  r = await fetch(url, {method:'DELETE'}); ok('DELETE -> 405', r.status===405)
  r = await fetch(base+'/healthz'); ok('healthz', r.status===200 && (await r.json()).status==='ok')
  r = await fetch(base+'/other'); ok('wrong path -> 404', r.status===404)
  r = await rpc(url, init, {'mcp-protocol-version':'1999-01-01'}); ok('bad protocol header -> 400', r.status===400)
  r = await rpc(url, init, {'mcp-protocol-version':'2025-06-18'}); ok('good protocol header', r.status===200)
  r = await rpc(url, 'x'.repeat(1_200_000)); ok('oversize body -> 413', r.status===413, r.status)
  // origin / host
  r = await rpc(url, init, {origin:'https://evil.example'}); ok('foreign Origin -> 403', r.status===403)
  r = await rpc(url, init, {origin:'http://localhost:6274'}); ok('loopback Origin allowed + CORS header', r.status===200 && r.headers.get('access-control-allow-origin')==='http://localhost:6274')
  r = await fetch(url, {method:'OPTIONS', headers:{origin:'http://localhost:6274','access-control-request-method':'POST'}}); ok('preflight 204 w/ allow-headers', r.status===204 && /Authorization/.test(r.headers.get('access-control-allow-headers')))
  // rebinding: raw request with spoofed Host
  const net = await import('node:net'); const port = new URL(url).port
  const raw = await new Promise(res => { const s = net.connect(port,'127.0.0.1',()=>{ s.write(`POST /mcp HTTP/1.1\r\nHost: evil.example\r\nContent-Type: application/json\r\nContent-Length: 2\r\nConnection: close\r\n\r\n{}`) }); let d=''; s.on('data',c=>d+=c); s.on('end',()=>res(d)) })
  ok('spoofed Host -> 403 (DNS rebinding guard)', /^HTTP\/1.1 403/.test(raw), raw.slice(0,40))
  p.kill()
}
// ---------- 2. auth + rate limit
{
  const { p, url } = await start({ PORT:'0', MCP_AUTH_TOKEN:'s3cret', MCP_RATE_LIMIT:'8' })
  let r = await rpc(url, init); ok('no token -> 401', r.status===401 && /Bearer/.test(r.headers.get('www-authenticate')))
  r = await rpc(url, init, {authorization:'Bearer wrong'}); ok('wrong token -> 401', r.status===401)
  r = await rpc(url, init, {authorization:'Bearer s3cret'}); ok('right token -> 200', r.status===200)
  r = await fetch(url.replace('/mcp','/healthz')); ok('healthz needs no token', r.status===200)
  r = await fetch(url, {method:'OPTIONS', headers:{origin:'http://localhost:1'}}); ok('preflight works without token', r.status===204)
  let last; for (let i=0;i<12;i++) last = await rpc(url, init, {authorization:'Bearer s3cret'})
  ok('rate limit -> 429 + Retry-After', last.status===429 && last.headers.get('retry-after')==='60', last.status)
  p.kill()
}
// ---------- 3. startup guards
{
  let res = await start({ PORT:'0', HOST:'0.0.0.0' }).then(()=>'started', e=>e)
  ok('public bind w/o token refuses to start', res.code===1 && /MCP_AUTH_TOKEN/.test(res.err), String(res))
  // allowlist cases with a spoofed Host are covered in http-hosts-tls.test.mjs (fetch cannot set Host)
}
console.log(fails ? `\n${fails} FAILED` : '\nall passed'); process.exit(fails?1:0)
