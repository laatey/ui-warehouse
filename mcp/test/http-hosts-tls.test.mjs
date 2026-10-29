import { spawn, execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const HTTP = fileURLToPath(new URL('../http.mjs', import.meta.url))
import http from 'node:http'; import https from 'node:https'; import fs from 'node:fs'
let fails=0; const ok=(n,c,x='')=>{console.log(`${c?'ok  ':'FAIL'} ${n} ${c?'':x}`); if(!c)fails++}
const start=(envx)=>new Promise((res,rej)=>{const p=spawn('node',[HTTP],{env:{...process.env,...envx},stdio:['ignore','ignore','pipe']});let e='';p.stderr.on('data',d=>{e+=d;const m=/MCP endpoint: (\S+)/.exec(e);if(m)res({p,url:m[1],e})});p.on('exit',c=>rej(new Error('exit '+c+e)))})
const post=(mod,port,headers,opts={})=>new Promise((res,rej)=>{const body=JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'});const r=mod.request({host:'127.0.0.1',port,path:'/mcp',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),...headers},...opts},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({status:x.statusCode,headers:x.headers,body:d}))});r.on('error',rej);r.end(body)})

{ const a=await start({PORT:'0',HOST:'0.0.0.0',MCP_AUTH_TOKEN:'t',MCP_ALLOWED_HOSTS:'mcp.example.com',MCP_ALLOWED_ORIGINS:'https://app.example.com'})
  const port=new URL(a.url.replace('0.0.0.0','127.0.0.1')).port
  let r=await post(http,port,{host:'mcp.example.com',authorization:'Bearer t'}); ok('allowed Host + token -> 200',r.status===200)
  r=await post(http,port,{host:'mcp.example.com',authorization:'Bearer t',origin:'https://app.example.com'}); ok('allowlisted Origin -> 200 + CORS',r.status===200&&r.headers['access-control-allow-origin']==='https://app.example.com')
  r=await post(http,port,{host:'mcp.example.com',authorization:'Bearer t',origin:'https://evil.example'}); ok('other Origin -> 403',r.status===403)
  a.p.kill() }

// TLS
try { execSync('openssl req -x509 -newkey rsa:2048 -nodes -keyout /tmp/k.pem -out /tmp/c.pem -days 1 -subj "/CN=localhost" 2>/dev/null') } catch(e){ console.log('openssl unavailable', e.message) }
if (fs.existsSync('/tmp/c.pem')) {
  const a=await start({PORT:'0',MCP_TLS_CERT:'/tmp/c.pem',MCP_TLS_KEY:'/tmp/k.pem'})
  ok('banner reports https',a.url.startsWith('https://'),a.url)
  const port=new URL(a.url).port
  const r=await post(https,port,{host:'localhost'},{rejectUnauthorized:false}); const j=JSON.parse(r.body)
  ok('HTTPS tools/list over TLS',r.status===200&&j.result.tools.length===8)
  let plain=await post(http,port,{host:'localhost'}).then(()=> 'answered', ()=> 'rejected'); ok('plain HTTP to TLS port fails',plain==='rejected',plain)
  a.p.kill()
}
// SIGTERM shutdown
{ const a=await start({PORT:'0'}); const done=new Promise(r=>a.p.on('exit',c=>r(c))); a.p.kill('SIGTERM'); ok('SIGTERM exits cleanly',(await done)===0) }
console.log(fails?`\n${fails} FAILED`:'\nall passed'); process.exit(fails?1:0)
