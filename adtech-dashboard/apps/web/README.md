# AdTech Dashboard — Frontend (`@adtech/web`)

React 19 + TypeScript SPA for managing ad campaigns with real-time analytics. Lives in the monorepo at `apps/web/`; the design system, shared types, hooks and utils are consumed from `@adtech/*` workspace packages (JIT — raw TS source, no build step).

## Tech stack

| Category | Technology |
|---|---|
| Framework | React 19 · TypeScript 5.9 (strict) |
| Build | Rsbuild (Rspack / SWC) |
| State | Redux Toolkit + RTK Query · Zustand (UI + toast) · redux-persist |
| Routing | React Router v7 (lazy-loaded) |
| UI | MUI v7 + Emotion · **`@adtech/ui`** design system · **`@adtech/theme`** ("Signal") |
| Charts | ECharts (`@adtech/charts`) + D3 |
| Forms | React Hook Form + Zod |
| HTTP | Axios (interceptors, JWT auto-refresh) + RTK Query `baseQueryWithReauth` |
| Testing | Vitest · Testing Library · Playwright · MSW |

## Getting started

From the **repo root**: `pnpm dev:web` (or `pnpm dev` to also start the Go API).

From **`apps/web/`** directly:

```bash
pnpm dev          # dev server :3000 (proxies /api and /ws to the Go backend :8080)
pnpm build        # production build
pnpm type-check   # tsc --noEmit
pnpm test         # Vitest
pnpm test:e2e     # Playwright
```

Needs the backend running for live data — see `apps/api/README.md`.

## Shared packages consumed

```ts
import { createSignalTheme } from '@adtech/theme';           // MUI theme
import { StatCard, DataTable, Tabs, Drawer, CommandPalette } from '@adtech/ui';
import { PerformanceTrendChart } from '@adtech/charts';
import type { Campaign, DashboardOverview } from '@adtech/types';
import { useWebSocket, useDocumentTitle } from '@adtech/hooks';
import { formatCurrency, storage } from '@adtech/utils';
```

These resolve to raw TS source (`node-linker=hoisted` + Rsbuild `source.include`), so edits in `packages/*` hot-reload here instantly — no rebuild.

## Project structure (app-local)

```
apps/web/src/
├── app/                     # wiring
│   ├── router.tsx           # routes (lazy-loaded)
│   ├── store.ts             # Redux store + persist
│   ├── api.ts               # RTK Query base + baseQueryWithReauth
│   └── hooks.ts             # typed useAppDispatch / useAppSelector
├── features/                # RTK slices + injected RTK Query APIs
│   ├── auth/                # authSlice + authApi
│   ├── campaigns/           # campaignApi (CRUD + cache tags)
│   ├── metrics/             # metricsApi (dashboard + time-series)
│   └── dashboard/           # dashboardSlice (selected campaign, persisted)
├── pages/                   # route pages (lazy)
│   ├── auth/                # LoginPage
│   ├── dashboard/           # DashboardPage
│   ├── campaigns/           # CampaignsPage (+ children/: New, Detail, Edit, Form)
│   ├── styleguide/          # StyleguidePage — live @adtech/ui gallery
│   └── errors/              # NotFoundPage
├── components/layout/       # app chrome: Header, Sidebar, MainLayout, Protected/GuestRoute
├── store/                   # Zustand: uiStore (sidebar)  (toast store lives in @adtech/ui)
├── validation/              # Zod schemas (auth, campaign)
├── constants/               # routes, api, app config
├── utils/axios.ts           # Axios instance + JWT refresh queue
├── lib/                     # third-party init
└── index.tsx                # entry — imports self-hosted fonts + mounts <App/>
```

Everything presentational and reusable (buttons, cards, tables, charts, forms, overlays…) lives in the shared packages, not here.

## State ownership

- **Server cache** → RTK Query (`features/*Api`)
- **Auth session** → `authSlice` (mirrored to `localStorage` for the axios/prepareHeaders layers)
- **Cross-page selection** → `dashboardSlice` (only slice persisted via redux-persist)
- **Ephemeral UI** → Zustand (`uiStore` sidebar; `toast` from `@adtech/ui`)

## Routes

| Route | Page | Access |
|---|---|---|
| `/login` | LoginPage | Guest |
| `/dashboard` | DashboardPage | Protected |
| `/campaigns` | CampaignsPage | Protected |
| `/campaigns/new` | CampaignNewPage | Protected |
| `/campaigns/:id` | CampaignDetailPage | Protected |
| `/campaigns/:id/edit` | CampaignEditPage | Protected |
| `/styleguide` | StyleguidePage (component gallery) | Protected |
| `*` | NotFoundPage | — |

## Design system — "Signal"

- **Theme** (`@adtech/theme`): `createSignalTheme('light'|'dark')` — cobalt `#2340D9` accent, warm neutrals, **Instrument Serif** display headings + **Geist** body + **Geist Mono**, self-hosted via `@fontsource` (imported in `src/index.tsx`).
- **Components** (`@adtech/ui`): the full library, imported from one barrel — atoms → organisms + the extended set (Tabs, SegmentedControl, DropdownMenu, Drawer, CommandPalette, Combobox, TagInput, Slider, Dropzone, Accordion, Banner, NotificationCenter, meters, KpiDelta, GeoDistribution…). Browse them live at **`/styleguide`**, or in the standalone spec `design-system.html`.

## Conventions

- **No inline prop types** — component props live in `@adtech/types` (`component/*`), re-exported through two barrels.
- **Path alias** `@/*` → `apps/web/src/*` (app-local); shared code via `@adtech/*`.
- `verbatimModuleSyntax` on → use `import type` for type-only imports.
