# AdTech Dashboard — Frontend

React 19 + TypeScript SPA for managing advertising campaigns with real-time analytics.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19, TypeScript 5.9 (strict) |
| Build | Rsbuild (Rust-based) |
| State | Redux Toolkit + RTK Query, Zustand (UI) |
| Routing | React Router v7 (lazy-loaded) |
| UI | MUI v7 + Emotion, custom design system |
| Charts | ECharts + D3.js |
| Forms | React Hook Form + Zod |
| HTTP | Axios (interceptors, JWT auto-refresh) |
| Testing | Vitest, Testing Library, Playwright, MSW |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (port 3000, proxies /api to Go backend :8080)
pnpm dev

# Type check
pnpm lint

# Build for production
pnpm build
```

## Project Structure

```
src/
├── app/                      # App configuration
│   ├── router.tsx            # Route definitions (lazy-loaded)
│   ├── store.ts              # Redux store setup
│   ├── hooks.ts              # Typed useAppDispatch / useAppSelector
│   └── theme/                # MUI theme (atomic files)
│       ├── palette.ts
│       ├── typography.ts
│       ├── shadows.ts
│       ├── components/       # Component overrides (25+ MUI components)
│       └── index.ts
├── components/
│   ├── layout/               # MainLayout, Header, Sidebar, ProtectedRoute
│   └── ui/                   # Design system (barrel export via index.ts)
│       ├── data-display/     # DataTable, StatCard, StatusChip, ChartCard
│       ├── feedback/         # ErrorBoundary, ErrorState, LoadingState, EmptyState, LazyPage
│       ├── form/             # FormField, SelectField, SearchInput
│       ├── layout/           # PageContainer, PageHeader
│       ├── navigation/       # Pagination
│       ├── overlay/          # ConfirmDialog
│       └── typography/       # PageTitle, SectionTitle, TextMuted, Label, StatValue
├── constants/                # Centralized constants
│   ├── routes.ts             # Route paths
│   ├── api.ts                # API endpoints, timeout
│   └── app.ts                # App name, drawer width, pagination, labels
├── features/
│   ├── auth/                 # authSlice + authApi (login, register, refresh)
│   └── campaigns/            # campaignApi (CRUD + RTK Query cache)
├── hooks/                    # useDocumentTitle, ...
├── pages/                    # Route pages (lazy-loaded)
├── store/                    # Zustand stores (uiStore — sidebar toggle)
├── types/                    # Shared TypeScript interfaces
└── utils/                    # Axios instance (interceptors, JWT attach)
```

## Routes

| Route | Page | Auth |
|-------|------|------|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage | Protected |
| `/campaigns` | CampaignsPage | Protected |
| `/campaigns/new` | CampaignNewPage | Protected |
| `/campaigns/:id` | CampaignDetailPage | Protected |
| `/admin/users` | AdminPage | Admin only |
| `*` | NotFoundPage | — |

## Design System

All reusable UI components live in `src/components/ui/` with a single barrel export:

```tsx
import { DataTable, PageHeader, StatCard, ErrorBoundary } from '@/components/ui';
```

Theme is split into atomic files under `src/app/theme/` — palette, typography, shadows, and per-category component overrides.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | TypeScript type check |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:ui` | Vitest UI |
| `pnpm test:coverage` | Coverage report |
| `pnpm test:e2e` | E2E tests (Playwright) |
