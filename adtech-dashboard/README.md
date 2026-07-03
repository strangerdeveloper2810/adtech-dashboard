# AdTech Dashboard

Nền tảng quản lý chiến dịch quảng cáo số (kiểu Google Ads thu nhỏ) — fullstack **React + Go**, tổ chức dạng **monorepo** (pnpm workspaces + Turborepo).

A digital ad-campaign management platform (a mini Google Ads) — fullstack **React + Go**, organized as a **monorepo** (pnpm workspaces + Turborepo).

**Features:** Campaign & Ad CRUD · real-time analytics (impressions / clicks / conversions / CTR / CPC) · high-volume event ingestion (Go worker pool → PostgreSQL + Redis → WebSocket live) · JWT auth + RBAC (admin / advertiser / viewer).

---

## 🗂 Monorepo layout

```
adtech-dashboard/
├── apps/
│   ├── web/          # React 19 + Rsbuild frontend   → apps/web/README.md
│   └── api/          # Go (Gin) backend              → apps/api/README.md
├── packages/         # Shared JIT packages (raw TS source, no build step)
│   ├── theme/        # @adtech/theme    — "Signal" MUI v7 theme (design tokens)
│   ├── ui/           # @adtech/ui       — design-system component library
│   ├── charts/       # @adtech/charts   — ECharts chart components
│   ├── types/        # @adtech/types    — shared TypeScript types
│   ├── hooks/        # @adtech/hooks    — useWebSocket, useDocumentTitle
│   ├── utils/        # @adtech/utils    — format, storage helpers
│   └── tsconfig/     # @adtech/tsconfig — shared tsconfig base
├── turbo.json · pnpm-workspace.yaml · .npmrc (node-linker=hoisted)
└── docs/             # learning / interview-prep notes
```

**Package strategy — JIT (Just-In-Time):** each `@adtech/*` package exports raw TS source (`"exports": "./src/index.ts"`); no build step, so editing a package hot-reloads the app instantly. Rsbuild transpiles them via `source.include`. See `apps/web/README.md` for details.

---

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 · TypeScript 5.9 (strict) · Rsbuild · MUI v7 · Redux Toolkit + RTK Query · Zustand · ECharts · React Hook Form + Zod |
| **Backend** | Go 1.26 · Gin · pgx/v5 · PostgreSQL 16 · Redis 7 · gorilla/websocket · JWT · bcrypt · MinIO |
| **Monorepo** | pnpm 10 workspaces · Turborepo · JIT packages |
| **Design** | "Signal" — Instrument Serif + Geist + Geist Mono (self-hosted `@fontsource`), cobalt `#2340D9` accent, warm neutrals |

---

## 🚀 Quick start

**Prerequisites:** Docker · Go 1.26+ · Node 22+ · pnpm 10 · [`golang-migrate`](https://github.com/golang-migrate/migrate)

```bash
pnpm install                              # install all workspaces

# infra: PostgreSQL + Redis + MinIO
cd apps/api && docker compose up -d && cd ../..

# migrations + seed data (5 users, ~157 campaigns, ~95k events)
migrate -path apps/api/migrations \
  -database "postgres://adtech:adtech123@localhost:5432/adtech?sslmode=disable" up
pnpm seed

pnpm dev                                  # web :3000 + api :8080 (both, via turbo)
```

**Login:** `alice@adtech.io` / `password123` — seeded accounts: `admin@adtech.io` (admin), `alice@ · bob@ · charlie@adtech.io` (advertiser), `viewer@adtech.io` (viewer).

Optional live demo: `pnpm simulate` streams random ad events → watch the dashboard update in real time.

---

## 📜 Commands (run from repo root)

| Command | Description |
|---|---|
| `pnpm dev` | `turbo dev` — web + api together |
| `pnpm dev:web` / `pnpm dev:api` | run a single app |
| `pnpm build` | build everything (turbo-cached) |
| `pnpm type-check` | `tsc --noEmit` across 6 packages + web + `go build` check |
| `pnpm lint` | turbo lint |
| `pnpm seed` / `pnpm simulate` | seed DB / stream live events |

---

## 🔄 Data flow

```
User clicks ad  →  POST /api/v1/events/track
   →  Go worker pool (buffered channel + load-shedding)
   →  batch INSERT PostgreSQL  +  Redis real-time counters
   →  WebSocket hub fan-out  →  React dashboard (live, no refresh)
```

---

## 📚 More

- **Frontend** (structure, packages, conventions) → [`apps/web/README.md`](apps/web/README.md)
- **Backend** (API, schema, architecture) → [`apps/api/README.md`](apps/api/README.md)
- **Design system** → open `apps/web/design-system.html`, or run the app and visit **`/styleguide`**
