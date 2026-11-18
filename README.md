<div align="center">

# AMTRAK

AI Autonomous Penetration Testing System (Go backend + Next.js frontend)

🌐 **Online Demo**: [https://artex-demo-ruoji6.vercel.app/](https://artex-demo-ruoji6.vercel.app/)

</div>

This repository is an independently maintained fork of [RuoJi6/ARTEX](https://github.com/RuoJi6/ARTEX), preserving the original commit history of https://github.com/Autumn-27/ARTEX and the AGPL-3.0 license. Release packages are published from this repository. Docker images are built and published by GitHub Actions.

---

## Acknowledgments

Mister Security Team  
Mingxi  
wowo

## Screenshot Preview

> Full interactive demo: [Online Demo](https://artex-demo-ruoji6.vercel.app/).

| Dashboard (overview / token usage / activity stream) | Task list |
| :---: | :---: |
| ![Dashboard](screenshots/dashboard.png) | ![Tasks](screenshots/tasks.png) |

| Task · execution (sessions / tool calls) | Exploration graph |
| :---: | :---: |
| ![Execution](screenshots/sessions.png) | ![Graph](screenshots/graph.png) |

| Findings | Assets |
| :---: | :---: |
| ![Findings](screenshots/findings.png) | ![Assets](screenshots/assets.png) |

| Asset coverage graph (force layout · tested highlight · collapse/expand) |
| :---: |
| ![Asset coverage](screenshots/assets_test.png) |

| Traffic recording | Human-in-the-loop chat |
| :---: | :---: |
| ![Traffic](screenshots/traffic.png) | ![Chat](screenshots/chat.png) |

| Agent management | LLM configuration |
| :---: | :---: |
| ![Agent](screenshots/agents.png) | ![LLM](screenshots/llm.png) |

| Intercept / approval | Backend logs |
| :---: | :---: |
| ![Intercept](screenshots/intercept.png) | ![Logs](screenshots/logs.png) |

---

## Approval Record Details

Global “Approval Records”, in-task “Intercept Approvals”, and approval cards in chat all support expanding to view full details. The layout follows the AegisHook CallDetail component style while using AMTRAK’s components and theme.

## Asset Sync (ScopeSentry)

Supports direct asset synchronization from [ScopeSentry](https://github.com/Autumn-27/ScopeSentry):

- On the **Asset Sync** page, enter the ScopeSentry address and API key to connect a data source.
- Select targets and asset types (domain / subdomain / IP / port / site / endpoint, etc.) by **project** or **task**.
- One-click import, merged into the company asset scope, and immediately available in the asset graph for agent exploration.

---

## Deploy Your Own Online Demo (auto-updates with official releases)

The demo runs only the `web/` frontend with `NEXT_PUBLIC_MOCK=1`. It needs no Go, PostgreSQL, or model keys. The UI uses mock data and performs no real scans.

Release pipeline: after the program packages, `SHA256SUMS`, and Docker image are successfully published → the `demo` job in `release.yml` calls `demo.yml` → checks out the tag → builds the mock frontend → deploys to the fixed Vercel production domain. Regular main pushes, tag-only creation, failed releases, drafts, and pre-releases do not update the demo. New demo data for features must still be maintained by the maintainer in `web/src/lib/mock/`.

### First-time Vercel setup

1. Create an empty project in your Vercel account (e.g. `artex-demo-ruoji6`). Keep **Git disconnected** so every commit does not auto-deploy. `web/vercel.json` also disables Git auto-deploy.
2. In **Settings → Build and Deployment** choose **Next.js**, Node.js **22.x**, override install command to `npm ci`, build command `npm run build`, leave Output Directory default. **Leave Root Directory empty** — the workflow invokes the Vercel CLI from the checked-out `web/` directory.
3. Add environment variable `NEXT_PUBLIC_MOCK=1` (at least for **Production**). Do not set `NEXT_EXPORT=1` and do not add database or model keys.
4. Copy **Project ID** from the project’s **Settings → General** and **Team ID** from the team’s **Settings → General** (for `VERCEL_ORG_ID`). Confirm the production domain is present under **Domains**.
5. Create a deployment token in Vercel **Account Settings → Tokens** (scoped to the team, with a suitable expiry). Save it as the GitHub Actions secret `VERCEL_TOKEN`. Never commit the token.

On the same GitHub settings page add these **Variables**:

| Variable | Value |
| --- | --- |
| `VERCEL_ORG_ID` | Vercel Team ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |
| `DEMO_URL` | Fixed public production URL including `https://` (e.g. `https://artex-demo-ruoji6.vercel.app`) |

### First deploy and retries

After merging the configuration to the default branch, open **Actions → deploy-demo → Run workflow**, select branch `main`, and leave the tag empty or enter the latest official tag (e.g. `v0.3.21`). The workflow only accepts published official releases that contain the five platform packages and checksums. It can also deploy historical official releases that did not yet contain this workflow. No need to re-publish a Release or move existing tags.

The workflow sets the demo project’s framework to Next.js, Node to 22.x, root directory empty, install command `npm ci`, build command `npm run build`, ensures `NEXT_PUBLIC_MOCK=1` on Production, and binds the domain from `DEMO_URL`. Use a dedicated project; subsequent deploys continue to maintain these settings.

After success, visit the production domain and check `/demo-version.json` for `tag`, `commit`, and `mock: true`. Once confirmed, update the demo links at the top of this README and in the screenshot section to your own domain.

Higher versions published later will automatically update the demo. If a demo deploy fails, the already-published packages and image remain valid and the previous demo usually continues to serve. Fix the settings and re-run `deploy-demo` alone — you do not need to re-publish the entire Release. When two versions are published close together, deploys run serially and check “latest” before build and before go-live so an older build cannot overwrite a newer one.

The release workflow directly calls the deploy job because a Release created with `GITHUB_TOKEN` does not trigger another `release: published` workflow. `demo.yml` also listens for manually published Releases on the web, applies the same official-release / complete-package / latest checks, and deploys. Manual retries use `deploy-demo`.

---

## Installation

> Requires **PostgreSQL**. Exploration requires an **LLM** (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `XAI_API_KEY` — or configure in the UI).

### Method 1: One-click install script (recommended)

```bash
git clone https://github.com/jcald81-art/AMTRAK.git
cd AMTRAK
./install.sh
```

The script detects/installs Docker and lets you choose:

- **① Full Docker**: enter a Postgres password (or press Enter for a random one) → writes `.env` → `docker compose up -d`.
- **② Local run**: choose database (existing or start one with Docker) → generates `config.json` → compiles a single embedded binary with `go` → starts it.

Then open **http://localhost:8787** (first visit goes to `/setup` to set the admin password).

### Method 2: Docker Compose (manual)

```bash
git clone https://github.com/jcald81-art/AMTRAK.git
cd AMTRAK
cp .env.example .env          # set POSTGRES_PASSWORD and optionally LLM keys
docker compose up -d          # pulls the image + postgres
# → http://localhost:8787
```

The image includes common tools (ripgrep, curl, vim, npm, nmap, etc.). `./skills` and `./data` are bind-mounted for persistence.

In `.env` the defaults are `ARTEX_IMAGE=ruoji6/artex` and `ARTEX_TAG=latest`. You can pin a tag such as `v0.3.17`. The image supports `linux/amd64` and `linux/arm64`; Docker automatically selects the matching architecture. Change `POSTGRES_PASSWORD` on first deploy. No Docker Hub token is required to run the service.

Remote MCP can be configured in system settings as `http` (Streamable HTTP) or `sse` (legacy SSE). Legacy SSE services typically use `GET /sse` to open the event stream and then accept JSON-RPC on the `/message?sessionId=...` URL returned by the server. Set the URL to `/sse` and supply the header `Authorization=Bearer <token>`.

### Method 3: Pre-built binaries (Releases)

Download the zip for your platform from this repository’s [Releases](https://github.com/jcald81-art/AMTRAK/releases). It contains `artex` + `start.sh` (Windows: `start.bat`) + `skills/` + `config.example.json`. Use `linux-arm64` for ARM64 Linux (including ARM64 Kali) and `linux-amd64` for x86_64:

```bash
cp config.example.json config.json   # fill in the database connection
./start.sh                           # → http://localhost:8787
```

> Always start with `start.sh` / `start.bat`, not by running `./artex` directly. The script is a daemon that decides whether to restart based on the exit code and is required for the **one-click update** on the settings page. Running the binary directly means an update will not be relaunched.  
> Background: `nohup ./start.sh >artex.log 2>&1 &`.

### Method 4: Build a single binary from source

```bash
# 1) Static export of the frontend
cd web && npm ci && npm run build:static && cd ..
# 2) Create the embed directory
mkdir -p server/webui/dist
# 3) Copy the export into the embed directory
cp -r web/out/. server/webui/dist
# 4) Build (the embedui tag embeds the frontend)
CGO_ENABLED=0 go build -tags embedui -o artex ./cmd/artex
./start.sh
```

### Method 5: Build cross-platform release packages

`build.sh` first builds and embeds the frontend, then strips debug info with the Go linker and zips the release files. Release mode by default produces zip packages for Linux amd64/arm64, macOS amd64/arm64, and Windows amd64:

```bash
./build.sh --release
# output: dist/artex-0.3.3-*.zip
```

UPX self-extracting binaries can be incompatible with some Linux kernels, virtualization environments, or security policies, so they are off by default. Customize targets with `ARTEX_TARGETS`. When you know the target environment is compatible you can pass `--upx` to shrink the binary further:

```bash
ARTEX_TARGETS=linux/amd64,windows/amd64 ./build.sh --release
./build.sh --target linux/amd64 --upx
```

---

## Upgrades

> Upgrades replace only the program; data is preserved: the Postgres volume `pgdata`, `./data` (jwt.key, SQLite, etc.), and `./skills`. **No manual database migration is required** — `artex` re-runs `schema.sql` idempotently on every start (including `ADD COLUMN` / `CREATE INDEX IF NOT EXISTS`). “Restart = migrate.” Still back up `./data` and the database before upgrading.

### Method 1: One-click update on the page (recommended)

On the **System Settings** page (sidebar → System Settings → `/system/settings`) the **Version & Updates** card lets you check for and install a new version without logging into the server.

Binaries built from this repository check for updates against the latest official GitHub Release of the upstream project, skipping drafts and pre-releases. Old official binaries still point at the original author’s repository, so the first switch must be a manual install of a binary built from this repo; after that, higher three-part versions can be upgraded from the page. Pushing main or a Git tag without publishing a Release does not produce an installable version.

After clicking Update: download the platform package → verify against the Release’s `SHA256SUMS` → smoke-test the new binary with `-h` → stage it as `artex.new` → the process exits and `start.sh` / `start.bat` relaunches and completes the swap. The page waits for the new version to come up and then refreshes.

- **Failures do not leave a broken binary**: if checksum or smoke test fails the staged file is discarded and the current version keeps running. If the new version fails to start three times in a row it automatically rolls back to `artex.old` (the failed binary is kept as `artex.failed` for debugging).
- **Rollback is always available**: the previous version is kept as `artex.old` and the card has a “Roll back to previous version” button. Note that database schema changes are not rolled back.
- **Updates interrupt running tasks** — an update is a restart. Do it when the system is idle.
- **Development builds do not update**: if the version is `dev` or a `git describe` with a suffix, updates are disabled so a release cannot overwrite a local debug binary.
- **Docker only replaces the binary, not the image**: tools such as Playwright / nmap inside the image are not upgraded, and `docker compose up -d` that recreates the container reverts to the image’s built-in version. To upgrade the image as well use `docker compose pull artex && docker compose up -d artex`.
- **Update proxy (optional)** uses the same “address field + save” pattern as other proxies. Example: `http://127.0.0.1:7897`. Supports `http://`, `https://`, `socks5://`, `socks5h://`, and username/password auth. Clearing and saving means direct connection (not affected by global proxy or `HTTP_PROXY` / `HTTPS_PROXY`). After saving it re-checks automatically. Version check, checksum download, and package download all use the same egress. Updates only download from GitHub domains and force HTTPS.
- The proxy address is accessed by the **AMTRAK server**. Inside Docker `127.0.0.1` is the container itself; if the proxy runs on the host use an address reachable from the container (Docker Desktop is usually `http://host.docker.internal:7897`) and allow the container to reach the proxy port.

### Maintainer: publish online updates via GitHub Actions

The release workflow is `.github/workflows/release.yml`. Pushing an official tag triggers the build. You can also re-run a failed release from Actions → release → Run workflow by entering an existing tag. Tags must be `vMAJOR.MINOR.PATCH`, for example `v0.3.17`. Later versions must be higher than the version users are running.

```bash
git push origin main
git tag v0.3.17
git push origin v0.3.17
```

The workflow pins the commit of the tag, exports the frontend with Node.js 22, compiles the five platform binaries with the embedded frontend using the Go version from `go.mod`, and produces the ZIPs and `SHA256SUMS`. AMD64 and ARM64 images are built on native GitHub runners, start against a temporary PostgreSQL to verify the binary, version, and embedded frontend, then publish the multi-arch image with both the version tag and `latest`. After the image is published the full ZIPs and checksums are uploaded and the Release is made public. Overwriting an already-public same version is not allowed — publish a new tag.

Maintainers must configure the variable `ARTEX_DOCKER_IMAGE` (Docker Hub username/image) and the secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (with push permission) under Settings → Secrets and variables → Actions. Packages are uploaded with the built-in `GITHUB_TOKEN`; images are pushed to Docker Hub with the credentials above. Credentials are only used by the workflow to log in and are never written into source or the image. The image address is also recorded in `.env.example` and the Compose defaults.

### Migrating an existing Docker deployment to this repository’s image

Back up `.env`, the Compose files, `data/`, and the PostgreSQL data in the original deployment directory, keeping the original database volume and skills mounts. Set `ARTEX_IMAGE` in `.env` to this repository’s image address and `ARTEX_TAG` to the target version. If the old Compose hard-codes the original author’s image, create the following override (merge the image configuration if an override file already exists):

```yaml
# docker-compose.override.yml
services:
  artex:
    image: ${ARTEX_IMAGE}:${ARTEX_TAG:-latest}
```

Then update only the application container:

```bash
docker compose pull artex
docker compose up -d --no-deps artex
curl --fail http://127.0.0.1:8787/api/health
docker compose logs --tail=50 artex
```

Continue using the original deployment directory and Compose project name so that `./data`, `./skills`, and the PostgreSQL volume still point at the original data. After migration the program checks for online updates from the upstream project. You can later update the binary from the page or update the whole image with the commands above.

For the first migration of an existing Docker deployment you can also extract a verified new ARM64 ZIP on the host, back up the original binary, and replace only `/app/artex` inside the running container. Example container name `artex-artex-1`:

```bash
# Run in the download directory; verify the ZIP against SHA256SUMS first, then unzip.
sha256sum --ignore-missing --check SHA256SUMS
unzip artex-0.3.17-linux-arm64.zip
sudo docker stop artex-artex-1
sudo docker cp artex-artex-1:/app/artex ./artex-before-migration
sudo docker cp ./artex-0.3.17-linux-arm64/artex artex-artex-1:/app/artex
sudo docker start artex-artex-1
curl --fail http://127.0.0.1:8787/api/health
```

This preserves the existing database, data, and skills mounts. Log in to the system settings page to verify the update source and version. A binary replaced inside the container lives in the container’s writable layer; deleting or recreating the container loses the replacement. Use an image that already contains this repository’s binary if you need to recreate. Rolling back the program does not roll back database migrations — back up the database and data before upgrading.

### Method 2: One-click update script

```bash
cd AMTRAK
./update.sh
```

The script optionally does a `git pull` then lets you choose **① Docker update** or **② local compile update** (corresponding to `install.sh`):

- **① Docker**: you can specify a target image tag (Enter keeps the `ARTEX_TAG` from `.env`, default `latest`) → `docker compose pull` → `docker compose up -d` (new image restart applies migrations automatically).
- **② Local**: rebuild the frontend static export → recompile `./artex` (restart the process afterward to take effect).

### Method 3: Docker Compose (manual)

```bash
cd AMTRAK
git pull                       # update compose / scripts (optional)
# pin a version: set ARTEX_TAG=v0.3.17 in .env; otherwise latest is used
docker compose pull artex
docker compose up -d artex     # new image restart → automatic schema migration
docker image prune -f          # clean old images (optional)
```

### Method 4: Pre-built binaries (Releases)

Download the new version zip from [Releases](https://github.com/jcald81-art/AMTRAK/releases), stop the old process, overwrite `artex` and `skills/` (keep your `config.json` and `data/`), then restart:

```bash
cp -r <unzipped-dir>/skills ./ && cp <unzipped-dir>/artex ./
./start.sh
```

### Method 5: Build from source

```bash
git pull
cd web && npm ci && npm run build:static && cd ..
mkdir -p server/webui/dist
cp -r web/out/. server/webui/dist
CGO_ENABLED=0 go build -tags embedui -o artex ./cmd/artex
# restart ./start.sh
```

---

## Configuration

**Database** (`config.json`, or override with the environment variable `ARTEX_PG_DSN`):

```json
{
  "database": {
    "host": "127.0.0.1", "port": 5432,
    "user": "artex", "password": "yourpass",
    "dbname": "artex", "sslmode": "disable"
  }
}
```

**LLM**:

```bash
export ANTHROPIC_API_KEY=sk-...          # Claude
export OPENAI_API_KEY=sk-...             # OpenAI / compatible
export XAI_API_KEY=xai-...               # Grok (xAI)
# or configure any of them in the UI “LLM Configuration” page
```

Optional: `ARTEX_LLM_PROVIDER` (`anthropic` | `openai` | `openai-responses` | `grok`) / `ARTEX_LLM_MODEL` / `ARTEX_LLM_BASE_URL` / `ARTEX_LLM_PROXY`.

**Grok support**: set `ARTEX_LLM_PROVIDER=grok` and `XAI_API_KEY=...` (or leave the provider empty and only set `XAI_API_KEY`). The default base URL is `https://api.x.ai/v1` and the default model is `grok-4`. You can also create an LLM profile in the UI with format `grok`.

**HTTP User-Agent**: built-in WebFetch (worker / planner / main / chat), asset HTTP auto-completion, egress connectivity probes, HTTP custom tools, the request replayer, GitHub self-update, and the optional `harvest_static.py` / `spider_mpa.py` randomly pick from 20 browser UA samples by default and do not advertise the tool name. Go picks once per logical request; redirects and WebFetch’s proxy-failure direct-retry reuse the same value. Python scripts pick once per run and keep it consistent across entry, download, and retry. Random selection allows duplicates and does not depend on any AI service. Override with `ARTEX_HTTP_USER_AGENT` for a fixed value.

---

## License

AGPL-3.0. See [LICENSE](LICENSE).
