#!/usr/bin/env node
/**
 * MoreCode UI Warehouse — MCP server, stdio transport.
 * See core.mjs for the tools; http.mjs for the HTTP(S) transport.
 */
import readline from 'node:readline'
import { handlePayload, rpcError, log, ROOT } from './core.mjs'

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n')

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity })
rl.on('line', (line) => {
  if (!line.trim()) return
  let payload
  try {
    payload = JSON.parse(line)
  } catch {
    return send(rpcError(null, -32700, 'Parse error'))
  }
  const res = handlePayload(payload)
  if (res) send(res)
})
rl.on('close', () => process.exit(0))
log(`serving ${ROOT} over stdio`)
