# UI Warehouse MCP Server

Exposes this warehouse to any MCP client. Two transports, same tools: **stdio** (`server.mjs`, local) and **Streamable HTTP/HTTPS** (`http.mjs`, hosted). No dependencies, Node 18+.

## Tools

| Tool | Purpose |
|---|---|
| `search_assets` | Ranked search by keyword, alias, capability, or look-alike product ("Linear sidebar"). Filters: `platform`, `type`, `framework`. |
| `list_assets` | Compact list of every asset, optionally filtered. |
| `get_asset` | Full manifest + file list. Accepts id, name, or folder name. |
| `get_asset_source` | Entry-point source by default; `files: [...]` for specific files; `all: true` for everything (200 KB cap). |
| `get_related_assets` | Assets the manifest marks as combinable. |
| `find_by_visual_reference` | Look up by the product an asset is modeled on (Supabase, Chrome, Figma...). |
| `get_dependencies` | Merged npm deps for several assets + a ready `npm install` command. |
| `list_frameworks` | Framework coverage counts. |

Resources: `warehouse://AGENTS.md`, `warehouse://README.md`, `warehouse://schema/asset`, and `warehouse://asset/<id>` for each manifest.

Manifests are re-scanned on every call, so adding an asset or running `npm run build:indexes` needs no server restart.

## Connect it

Use an absolute path to `mcp/server.mjs`.

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "ui-warehouse": {
      "command": "node",
      "args": ["C:/Users/gersh/Desktop/ui-warehouse/mcp/server.mjs"]
    }
  }
}
```

**Claude Code:**
```bash
claude mcp add ui-warehouse -- node /absolute/path/to/ui-warehouse/mcp/server.mjs
```

**Cursor / others:** same `command` + `args` shape in their MCP settings.

To point at a warehouse stored elsewhere, set `UI_WAREHOUSE_PATH`.

## Quick test

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_assets","arguments":{"query":"kanban"}}}' \
  | node mcp/server.mjs
```

## HTTP / HTTPS transport

```bash
npm run mcp:http                      # http://127.0.0.1:3333/mcp, loopback only, no auth needed
MCP_AUTH_TOKEN=change-me HOST=0.0.0.0 PORT=3333 npm run mcp:http   # reachable from the network
```

Stateless Streamable HTTP: `POST /mcp` with JSON-RPC (single or batch) returns JSON, notifications return `202`. `GET /healthz` is open for load balancers. `GET`/`DELETE` on `/mcp` return `405` (no sessions, no server push).

| Variable | Default | Purpose |
|---|---|---|
| `PORT` / `HOST` | `3333` / `127.0.0.1` | Bind address. |
| `MCP_AUTH_TOKEN` | none | Static bearer token (Claude Code, scripts). Binding beyond loopback requires this or OAuth, or the server exits. |
| `MCP_PUBLIC_URL`, `MCP_OWNER_PASSWORD`, `MCP_OAUTH_SECRET` | none | Turn on OAuth for claude.ai. See the claude.ai section. |
| `MCP_OAUTH_CLIENT_ID` / `MCP_OAUTH_CLIENT_SECRET` | none | Optional pre-registered OAuth client. |
| `MCP_OAUTH_REDIRECT_URIS` / `MCP_ACCESS_TOKEN_TTL` | none / `3600` | Extra allowed redirect URIs; access-token lifetime in seconds. |
| `MCP_ALLOWED_HOSTS` | none | Accepted `Host` headers, e.g. `mcp.example.com`. On loopback binds only loopback hosts are accepted (DNS-rebinding guard). |
| `MCP_ALLOWED_ORIGINS` | none | Browser origins allowed to call (also drives CORS). Loopback origins are auto-allowed only on loopback binds. |
| `MCP_TLS_CERT` / `MCP_TLS_KEY` | none | PEM paths to serve HTTPS directly. Otherwise terminate TLS at your proxy. |
| `MCP_RATE_LIMIT` | `120` | Requests per minute per IP, `0` to disable. |
| `MCP_TRUST_PROXY` | off | `1` to key the rate limit on `X-Forwarded-For` (only behind a proxy you control). |
| `MCP_PATH` / `MCP_MAX_BODY` | `/mcp` / `1048576` | Endpoint path and body cap. |

**Client setup**
```bash
# Claude Code
claude mcp add --transport http ui-warehouse https://mcp.example.com/mcp --header "Authorization: Bearer change-me"
```
Clients that only speak stdio can bridge with `npx mcp-remote https://mcp.example.com/mcp --header "Authorization: Bearer change-me"`.

**Limits to know about**
- The warehouse is read from disk, so updating assets means redeploying (or mounting the warehouse as a volume and setting `UI_WAREHOUSE_PATH`).
- A `Dockerfile` is included at the repo root. It was written but not built in my environment.
- For claude.ai see the next section; a static bearer token alone does not work there.

## Use it from claude.ai (custom connector)

claude.ai connects from Anthropic's cloud, so the server must be reachable on a **public HTTPS URL**. `localhost` will not work. claude.ai custom connectors authenticate with OAuth 2.1, so this server includes a single-owner OAuth layer (`oauth.mjs`): discovery metadata, dynamic client registration, PKCE (S256 only), refresh tokens. Only you can approve a connection, using an owner password.

**1. Run it where it has a public https URL** (a host/platform that terminates TLS, or a tunnel while testing):

```bash
export MCP_PUBLIC_URL=https://mcp.example.com        # origin only, no path; must be https
export MCP_OWNER_PASSWORD='a long passphrase'        # 12+ chars; shown on the consent page
export MCP_OAUTH_SECRET=$(openssl rand -hex 32)      # keep it stable, or tokens reset on restart
export MCP_TRUST_PROXY=1                             # when behind a proxy/tunnel, so rate limits and login lockout key on the real client IP
npm run mcp:http
```

Quick test with a tunnel, for example `cloudflared tunnel --url http://localhost:3333`: set `MCP_PUBLIC_URL` to the URL it prints. The public host is accepted automatically even though the server binds to loopback.

**2. Add the connector:** Settings, Connectors, Add custom connector. Name it, and use `https://mcp.example.com/mcp` as the URL. Leave the OAuth client fields empty (the server supports dynamic client registration), then Connect. A browser tab opens on this server's consent page; enter the owner password and Approve. Team/Enterprise owners add it in org admin settings.

**3. Optional, if the dialog asks for a client ID/secret** (advanced settings), pre-register one instead of using dynamic registration:

```bash
export MCP_OAUTH_CLIENT_ID=claude-warehouse
export MCP_OAUTH_CLIENT_SECRET=$(openssl rand -hex 24)
```
Enter the same values in the connector. Claude's redirect URIs are `https://claude.ai/api/mcp/auth_callback` and `https://claude.com/api/mcp/auth_callback`; both are allowed by default (add others with `MCP_OAUTH_REDIRECT_URIS`).

**How it is secured**
- Dynamic registration is allowed only for Claude's callbacks and loopback addresses (Claude Code, MCP Inspector, mcp-remote), and only for public PKCE clients.
- Authorization codes last 60 s and are single-use; access tokens last 1 h (`MCP_ACCESS_TOKEN_TTL`); refresh tokens last 30 days and are rotated.
- Tokens are bound to this server's MCP URL (RFC 8707); a token for another resource is rejected.
- 10 wrong owner passwords per IP lock the consent page for 15 minutes.
- **Revoke everything** by changing `MCP_OAUTH_SECRET` and restarting. The static `MCP_AUTH_TOKEN` keeps working alongside OAuth if you set one (for Claude Code and scripts).

**Honest limits**
- Verified against a scripted client that follows the MCP authorization spec, not against live claude.ai. Anthropic's tracker has open reports of connector auth failing for some org-managed setups even when the server is spec-compliant, so test with your own account before relying on it.
- Stateless means: a used authorization code is remembered per process only, and refresh tokens are not replay-detected across instances. Run a single instance, or add shared storage first.
- The owner password is the single credential. Use a long one, and keep it out of shell history (prefer your platform's secret store).

## Tests

```bash
npm run test:mcp     # protocol, auth, origin/host guards, rate limit, TLS, shutdown, and the full OAuth flow with attack cases
```
