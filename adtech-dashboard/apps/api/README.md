# AdTech Dashboard — Backend (`@adtech/api`)

Go REST API với Gin, PostgreSQL, Redis, JWT, worker pool + WebSocket real-time.

Go REST API with Gin, PostgreSQL, Redis, JWT auth, a goroutine worker pool and a WebSocket hub. Lives in the monorepo at `apps/api/`; Turborepo drives it via a thin `package.json` wrapper around the Go toolchain.

## Prerequisites

- Go 1.26+
- Docker Desktop (PostgreSQL + Redis + MinIO)
- [golang-migrate](https://github.com/golang-migrate/migrate) — `brew install golang-migrate`

## Getting started

From the **repo root** (recommended — via Turborepo/pnpm):

```bash
cd apps/api && docker compose up -d && cd ../..   # Postgres + Redis + MinIO
migrate -path apps/api/migrations \
  -database "postgres://adtech:adtech123@localhost:5432/adtech?sslmode=disable" up
pnpm seed        # seed users/campaigns/ads/events   (turbo → apps/api)
pnpm dev:api     # run API only  → http://localhost:8080
```

Or from **`apps/api/`** directly (Go toolchain / Makefile):

```bash
make docker-up      # or: docker compose up -d
make migrate-up
go run ./cmd/seed   # or: make (see Makefile)
make dev            # go run ./cmd/api  → http://localhost:8080
```

`package.json` scripts (invoked by turbo): `dev` = `go run ./cmd/api`, `build` = `go build -o bin/api ./cmd/api`, plus `seed`, `simulate`, `start`, `type-check` (`go build -o /dev/null ./...`), `lint` (`go vet`).

## Project structure

```
apps/api/
├── cmd/
│   ├── api/main.go        # Entry point — wire deps, start server
│   ├── seed/main.go       # DB seeder (5 users, campaigns, ads, ~95k events)
│   ├── simulate/main.go   # Load generator → POSTs random ad events
│   └── playground/        # Go learning sandbox (not part of the service)
├── config/config.go       # Load env (.env via godotenv)
├── docker-compose.yml     # PostgreSQL 16 + Redis 7 + MinIO
├── Makefile               # dev / build / migrate / docker commands
├── migrations/            # golang-migrate SQL (5 tables)
└── internal/              # private app code (Go-enforced)
    ├── server/            # Gin engine + routes + graceful shutdown
    ├── handler/           # HTTP transport layer
    │   └── middleware/    # CORS, RequestID, Logger, Auth(JWT), RequireRole(RBAC)
    ├── service/           # business logic (auth_service.go: JWT + bcrypt)
    ├── repository/        # data-access interfaces
    │   └── postgres/      # PostgreSQL implementations (raw pgx SQL)
    ├── worker/            # goroutine worker pool (event ingestion)
    ├── websocket/         # gorilla/websocket hub (live fan-out)
    ├── database/          # pgxpool + Redis connectors
    ├── storage/           # MinIO/S3 object storage (ad creatives)
    ├── domain/            # core structs (User, Campaign, Ad, AdEvent…)
    └── dto/               # request/response structs (Gin binding tags)
```

## Architecture

```
Request → Middleware → Handler → (Service) → Repository → PostgreSQL
```

- **Handler** — HTTP only: parse, call service/repo, return response
- **Service** — business logic. NOTE: only **Auth** has a service layer; Campaign/Ad/Metrics handlers call repositories directly (pragmatic layering)
- **Repository** — interface at the boundary + PostgreSQL implementation
- **Domain / DTO** — core structs vs. request/response shapes
- Dependencies are constructor-injected top-down in `cmd/api/main.go` (no DI framework)

**Concurrency highlights:** worker pool with a buffered job channel + load-shedding (`worker/pool.go`); WebSocket hub fan-out with slow-client eviction (`websocket/hub.go`); graceful shutdown via `signal.Notify` + `http.Server.Shutdown` (`server/server.go`).

## API (v1, prefix `/api/v1`)

| Group | Endpoints |
|---|---|
| Auth (public) | `POST /auth/register` · `/auth/login` · `/auth/refresh` |
| Campaigns | `GET /campaigns` · `GET /campaigns/:id` · `POST /campaigns` · `PUT /campaigns/:id` · `PATCH /campaigns/:id/status` · `DELETE /campaigns/:id` |
| Ads | `POST /campaigns/:id/ads` · `GET /campaigns/:id/ads` · `GET|PATCH|DELETE /ads/:id` |
| Metrics | `GET /dashboard/overview` · `GET /metrics` (time-series) |
| Events | `POST /events/track` (→ worker pool) |
| Users (admin) | `GET /users` · `GET /users/:id` · `PATCH /users/:id/role` |
| Upload | `POST /upload` · `/upload/multiple` (MinIO) |
| WebSocket | `GET /ws/metrics` (live counters) |

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | server port |
| `DATABASE_URL` | `postgres://adtech:adtech123@localhost:5432/adtech?sslmode=disable` | PostgreSQL DSN |
| `REDIS_URL` | `localhost:6379` | Redis |
| `JWT_SECRET` | `dev-secret-key` | JWT signing key (change in production) |
| `MINIO_*` | see `config/config.go` | object storage |

## Database schema (5 tables)

- **users** — email (unique), bcrypt password, role (admin/advertiser/viewer), soft-delete
- **campaigns** — budget / daily_budget / spent, `targeting` JSONB (GIN index), status, date range
- **ads** — banner/native/video, destination URL, image
- **ad_events** — impression/click/conversion, country, device, cost (high-volume, composite indexes)
- **campaign_metrics** — pre-aggregated per campaign+period (impressions/clicks/conversions/spend)

## Notes

- **Queries are raw pgx SQL** hand-written in `repository/postgres/*_pg.go`. The `sqlc` target in the `Makefile` and empty `internal/database/{queries,sqlc}/` dirs are scaffolding only — **sqlc is not used**.
- No tests yet (`test/testutil/` is empty) — a good first contribution.
