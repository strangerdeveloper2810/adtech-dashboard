# Frontend Implementation Tasks

## Trạng thái hiện tại: FE đã revert về skeleton

User sẽ tự implement lại từ đầu để ôn kiến thức. Dưới đây là danh sách chi tiết.

---

## Đã có sẵn (Skeleton — KHÔNG cần làm lại)

| Category | Files | Ghi chú |
|----------|-------|---------|
| Redux Store | `app/store.ts`, `app/api.ts`, `app/hooks.ts` | configureStore + RTK Query baseApi + typed hooks |
| Auth slice | `features/auth/authSlice.ts` + `authApi.ts` | login, register, setCredentials, logout |
| Campaign API | `features/campaigns/campaignApi.ts` | getCampaigns, getCampaign, createCampaign, updateCampaignStatus, deleteCampaign |
| Auth pages | `pages/auth/LoginPage.tsx`, `RegisterPage.tsx` | Hoàn chỉnh (RHF + mutation + toast + navigation) |
| Router | `app/router.tsx` | Lazy loading + ProtectedRoute + MainLayout |
| Design System | `components/ui/` (15+ components) | DataTable, StatCard, StatusChip, ChartCard, FormField, SelectField, SearchInput, etc. |
| Layout | `components/layout/` | Header, Sidebar, MainLayout, ProtectedRoute |
| Theme | `app/theme/` | Palette, typography, shadows, 25+ MUI overrides |
| Types | `types/domain/`, `types/api/`, `types/store/`, `types/component/` | User, Campaign, Ad, DashboardOverview, CampaignMetrics, etc. |
| Stores | `store/toastStore.ts`, `store/uiStore.ts` | Zustand (toast + sidebar) |
| Utils | `utils/axios.ts`, `utils/format.ts`, `utils/storage.ts` | Axios interceptor, formatCurrency, localStorage |
| Constants | `constants/routes.ts`, `constants/api.ts`, `constants/app.ts` | Routes, API endpoints, app config |
| Hooks | `hooks/useDocumentTitle.ts` | Dynamic title |

---

## Tasks cần implement (thứ tự khuyến nghị)

### Task 1: Metrics RTK Query API
**File tạo:** `src/features/metrics/metricsApi.ts`
**Kiến thức ôn:** RTK Query `injectEndpoints`, query params, `skip` option, tag invalidation
- `useGetDashboardOverviewQuery()` → GET `/dashboard/overview`
- `useGetMetricsQuery({ campaignId, from, to, granularity })` → GET `/metrics`
- Types: `DashboardOverview`, `CampaignMetrics` đã có trong `types/domain/campaign.ts`

### Task 2: WebSocket Types + Constants
**Files tạo:** `src/types/websocket.ts`, sửa `src/types/index.ts`, sửa `src/constants/api.ts`
**Kiến thức ôn:** TypeScript union types, constants pattern
- `WebSocketMessage`: type, count, impressions, clicks, conversions, timestamp
- `WebSocketStatus`: 'connecting' | 'connected' | 'disconnected' | 'error'
- `WS` constants: METRICS_URL, RECONNECT_INTERVAL, MAX_RECONNECT_ATTEMPTS

### Task 3: useWebSocket Hook
**File tạo:** `src/hooks/useWebSocket.ts`
**Kiến thức ôn:** useRef (WS instance + buffer), requestAnimationFrame batching, exponential backoff, cleanup
- Connect/disconnect lifecycle
- `useRef` buffer + `requestAnimationFrame` → batch high-freq messages, tránh render thrashing
- Exponential backoff reconnect (1s → 2s → 4s → 8s → max)
- `onMessageRef` pattern tránh stale closures
- Return: `{ status, messageHistory, totalProcessed }`

### Task 4: ECharts Components (4 files)
**Files tạo:** `src/components/charts/` (folder mới)
- `PerformanceTrendChart.tsx` — Line chart, dual Y-axis (impressions+clicks trái, spend phải)
- `DeviceDistributionChart.tsx` — Donut pie chart (mobile/desktop/tablet)
- `CountryTrafficChart.tsx` — Horizontal bar chart (top 10 countries)
- `LiveEventsChart.tsx` — Sparkline + counter + WS status chip
- `index.ts` — Barrel export

**Kiến thức ôn:** useMemo cho ECharts option, useTheme() MUI integration, echarts-for-react ReactECharts component

### Task 5: DashboardPage (integrate everything)
**File sửa:** `src/pages/dashboard/DashboardPage.tsx`
**Kiến thức ôn:** RTK Query skip, useMemo, useCallback, useEffect, conditional rendering
- Wire `useGetDashboardOverviewQuery` → 4 StatCards (real data)
- Wire `useGetCampaignsQuery` → Campaign selector dropdown
- Wire `useGetMetricsQuery` → PerformanceTrendChart (với granularity toggle)
- Wire `useWebSocket` → LiveEventsChart
- Wire overview data → DeviceDistributionChart + CountryTrafficChart
- Layout: Grid container 3 rows (StatCards → Trend+Live → Device+Country)

### Task 6: CampaignDetailPage
**File sửa:** `src/pages/campaigns/children/CampaignDetailPage.tsx`
**Kiến thức ôn:** useParams, RTK Query single entity, conditional rendering, ConfirmDialog
- `useGetCampaignQuery(id)` — fetch campaign by URL param
- Display: name, status (StatusChip), budget, spent, dates, targeting
- Actions: Edit button, Delete (ConfirmDialog), Status change dropdown
- `useDeleteCampaignMutation`, `useUpdateCampaignStatusMutation`

### Task 7: CampaignNewPage (Create/Edit Form)
**File sửa:** `src/pages/campaigns/children/CampaignNewPage.tsx`
**Kiến thức ôn:** react-hook-form + zod validation, controlled MUI components, date pickers
- Form fields: name, description, budget, dailyBudget, startDate, endDate, targeting (countries, devices, age_range)
- Validation: zod schema (budget > 0, endDate > startDate, etc.)
- `useCreateCampaignMutation` + toast success/error
- Optional: Edit mode (prefill from `useGetCampaignQuery`)

### Task 8: Refactor CampaignsPage (use design system)
**File sửa:** `src/pages/campaigns/CampaignsPage.tsx`
**Kiến thức ôn:** Generic DataTable component, component composition
- Replace raw MUI `Table` → `DataTable<Campaign>` (generic)
- Replace raw `Chip` → `StatusChip`
- Replace inline search → `SearchInput` component
- Replace inline pagination → `Pagination` component

### Task 9 (Bonus): Ads RTK Query API
**File tạo:** `src/features/ads/adsApi.ts`
**Kiến thức ôn:** RTK Query nested resources, tag relationships
- CRUD endpoints for ads (belongs to campaign)

### Task 10 (Bonus): Admin Users Page
**Files tạo:** `src/pages/admin/UsersPage.tsx`, sửa `router.tsx`
**Kiến thức ôn:** Role-based routing, admin guard
- Cần BE user management API trước (đang thiếu)
- List users + change role + delete

---

## Interview Patterns tích lũy qua các tasks

| Pattern | Task | Câu hỏi interview |
|---------|------|-------------------|
| RTK Query `skip` + conditional fetch | 1, 5 | "How do you handle dependent queries?" |
| `useMemo` cho expensive objects | 4, 5 | "When should you memoize?" |
| `useRef` buffer + rAF batching | 3 | "How to handle high-frequency updates?" |
| Exponential backoff | 3 | "Production WebSocket patterns?" |
| `useCallback` cho stable refs | 5 | "When to use useCallback vs useMemo?" |
| react-hook-form + zod | 7 | "Form validation approach?" |
| Generic components `<T>` | 8 | "TypeScript generics in React?" |
| Component composition (ChartCard wrapping charts) | 4, 5 | "Composition vs inheritance?" |
| Conditional rendering patterns | 5, 6 | "Loading/error/empty state handling?" |
| Dual Y-axis chart | 4 | "Complex data visualization?" |
