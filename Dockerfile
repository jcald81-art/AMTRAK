# syntax=docker/dockerfile:1
#
# Runtime image (no compilation inside the image): installs common tools and
# copies a pre-built Linux binary. The binary is cross-compiled by CI
# (pure Go, no QEMU) and placed at dist/<TARGETARCH>/artex in the build context.
# This keeps multi-arch builds fast — arm64 only emulates the apt layer.
#
# For a local manual build, prepare the binary first:
#   cd web && npm run build:static && cd ..
#   cp -r web/out server/webui/dist
#   CGO_ENABLED=0 GOARCH=amd64 go build -tags embedui -o dist/amd64/artex ./cmd/artex
#   docker build -t artex:local .
FROM python:3.12-slim-bookworm
ARG TARGETARCH
# Common tools: ripgrep / curl / vim + recon utilities (add/remove as needed).
# Node is installed from NodeSource at 22.x to match the frontend build.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates ripgrep curl wget vim git jq unzip \
      tzdata \
      dnsutils iputils-ping netcat-openbsd inetutils-telnet whois nmap \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*
# Pre-install Playwright MCP and CLI globally so runtime does not download via npx.
# @playwright/mcp: browser MCP (already global, no -y/@latest needed).
# @playwright/cli: provides playwright-cli; --help is run to verify.
# playwright itself is also installed; chromium + system deps are pre-provisioned
# so the first MCP/CLI start works offline.
RUN npm install -g @playwright/mcp@latest @playwright/cli@latest playwright@latest \
    && playwright-cli --help \
    && playwright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV TZ=Asia/Shanghai
# Pre-built binary for the target architecture (dist/amd64/artex or dist/arm64/artex)
COPY dist/${TARGETARCH}/artex /app/artex
# Daemon start script: restarts on exit according to exit code and enables
# one-click updates. It also forwards SIGTERM to artex — docker stop only
# signals PID 1; without forwarding, artex never gets a graceful shutdown.
COPY start.sh /app/start.sh
RUN chmod +x /app/artex /app/start.sh
COPY skills/ /app/skills/
# data/ (SQLite + jwt.key) is a persistent volume
VOLUME ["/app/data"]
EXPOSE 8787 8788
ENTRYPOINT ["/app/start.sh"]
CMD ["-addr", ":8787", "-proxy", ":8788"]
