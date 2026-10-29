# Hosted MCP endpoint for the UI warehouse (Streamable HTTP).
#   docker build -t ui-warehouse-mcp .
#   docker run -p 3333:3333 -e MCP_AUTH_TOKEN=change-me -e MCP_ALLOWED_HOSTS=mcp.example.com ui-warehouse-mcp
# For claude.ai add: -e MCP_PUBLIC_URL=https://mcp.example.com -e MCP_OWNER_PASSWORD=... -e MCP_OAUTH_SECRET=... -e MCP_TRUST_PROXY=1
# Terminate TLS at your reverse proxy / platform, or mount certs and set MCP_TLS_CERT / MCP_TLS_KEY.
FROM node:22-alpine
WORKDIR /app
COPY . .
ENV HOST=0.0.0.0 PORT=3333 NODE_ENV=production
EXPOSE 3333
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT:-3333}/healthz >/dev/null || exit 1
# The server refuses to start on 0.0.0.0 without MCP_AUTH_TOKEN or OAuth (MCP_PUBLIC_URL + MCP_OWNER_PASSWORD).
CMD ["node", "mcp/http.mjs"]
