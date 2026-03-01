# Frontend Learning Log - AdTech Dashboard

## Session 1 (2026-03-02): Login Flow + Auth + Interceptor

### Đã implement

| # | Feature | File | Kiến thức |
|---|---------|------|-----------|
| 1 | Zod validation schema | `validation/auth.validation.ts` | z.email(), z.string(), z.infer, nonempty, min |
| 2 | React Hook Form + MUI | `pages/auth/LoginPage.tsx` | useForm, register, handleSubmit, zodResolver, errors display |
| 3 | Redux store | `app/store.ts` | configureStore, reducerPath, middleware concat |
| 4 | Typed hooks | `app/hooks.ts` | ReturnType<typeof store.getState>, withTypes pattern |
| 5 | Auth slice | `features/auth/authSlice.ts` | createSlice, PayloadAction, localStorage sync |
| 6 | RTK Query base API | `app/api.ts` | createApi, fetchBaseQuery, prepareHeaders, tagTypes |
| 7 | Login mutation | `features/auth/authApi.ts` | injectEndpoints, builder.mutation, generics |
| 8 | GuestRoute guard | `components/layout/wrappers/GuestRoute.tsx` | useAppSelector, Navigate, Outlet |
| 9 | Axios response interceptor | `utils/axios.ts` | Queue pattern, token refresh, retry |

---

### Kiến thức đã học

#### Redux Toolkit

- **`configureStore` vs `createStore`**
  - `configureStore` là phiên bản nâng cấp của `createStore`, tự động thêm 3 thứ:
    1. Middleware mặc định (redux-thunk, serializable check, immutability check) — không cần import `applyMiddleware`
    2. Redux DevTools — tự bật, không cần cài `composeWithDevTools`
    3. Immutability checks — phát hiện lỗi mutate state trực tiếp trong development

- **`createSlice`**
  - Viết reducer + action creators cùng 1 chỗ, không cần tạo file action riêng
  - Bên trong reducers được phép "mutate" state trực tiếp nhờ thư viện Immer (thực chất tạo bản copy mới)
  - Tự generate action types theo format `"sliceName/reducerName"` (ví dụ: `"auth/setCredentials"`)

- **`PayloadAction<T>`**
  - Type cho action có payload. Ví dụ `PayloadAction<AuthTokens>` nghĩa là action.payload sẽ có type `AuthTokens`
  - Giúp TypeScript biết chính xác payload chứa gì

- **`ReturnType<typeof store.getState>`**
  - Cách lấy type của RootState mà không cần define thủ công
  - `store.getState()` trả về toàn bộ state → `ReturnType` lấy type của giá trị trả về
  - Nếu thêm reducer mới → RootState tự cập nhật, không cần sửa type

#### RTK Query

- **`createApi` + `fetchBaseQuery`**
  - `createApi`: tạo 1 API service, quản lý tất cả endpoints, cache, loading states
  - `fetchBaseQuery`: wrapper nhẹ của `fetch()`, hỗ trợ baseUrl, headers, timeout
  - Chỉ cần 1 `createApi` cho toàn bộ app (code split bằng `injectEndpoints`)

- **`prepareHeaders`**
  - Hàm chạy trước MỌI request, dùng để gắn token vào header
  - Nhận `(headers, { getState })` → đọc token từ Redux store → set Authorization header

- **`injectEndpoints`**
  - Pattern code splitting: mỗi feature file tự inject endpoints riêng vào base API
  - Ví dụ: `authApi.ts` inject login, `campaignApi.ts` inject CRUD campaigns
  - Tránh 1 file API khổng lồ, dễ maintain

- **`builder.mutation` vs `builder.query`**
  - `builder.query`: cho GET request, có cache tự động, trả `{ data, isLoading, error }`
  - `builder.mutation`: cho POST/PUT/DELETE, không cache, trả `[triggerFn, { isLoading, error, data }]`
  - Mutation cần gọi `triggerFn(data)` để thực thi, query tự chạy khi component mount

- **`.unwrap()`**
  - RTK Query mutation trả về object đặc biệt, không throw error khi fail
  - `.unwrap()` chuyển thành Promise thông thường → throw error nếu fail → dùng được trong try/catch
  - QUAN TRỌNG: phải đặt `.unwrap()` BÊN TRONG try block, nếu đặt ngoài → error không được catch

- **`tagTypes`**
  - Khai báo các loại cache tag: `['Campaign', 'Ad', 'Metrics', 'User']`
  - Khi mutation thành công → invalidate tag → query liên quan tự fetch lại
  - Ví dụ: tạo campaign mới → invalidate tag `'Campaign'` → danh sách campaigns tự cập nhật

- **`useXxxMutation`** trả về `[triggerFn, { isLoading, error, data }]`
  - `triggerFn`: hàm gọi API, truyền data vào
  - `isLoading`: true khi đang gọi API → disable button, show spinner
  - `error`: lỗi từ server
  - `data`: kết quả thành công

#### Zod + React Hook Form

- **`z.email()` (Zod v4)**
  - Validator top-level mới trong Zod v4, không cần viết `z.string().email()` nữa
  - Tự validate email format + không rỗng

- **`z.infer<typeof schema>`**
  - Tự tạo TypeScript type từ Zod schema, không cần viết interface riêng
  - Schema thay đổi → type tự cập nhật → đảm bảo validation và type luôn đồng bộ
  - Ví dụ: `loginSchema` có email + password → `LoginInput` type sẽ có `{ email: string, password: string }`

- **`zodResolver(schema)`**
  - Cầu nối giữa Zod validation và React Hook Form
  - RHF không biết Zod, Zod không biết RHF → zodResolver dịch giữa 2 bên
  - Truyền vào `useForm({ resolver: zodResolver(loginSchema) })`

- **`register("fieldName")`**
  - Kết nối input với form state, trả về `{ onChange, onBlur, name, ref }`
  - Spread vào input: `{...register("email")}` → RHF tự quản lý giá trị input
  - Không cần useState cho từng field

- **`handleSubmit(onValid)`**
  - Validate toàn bộ form trước → nếu pass → gọi `onValid(data)` với data đã validated
  - Nếu fail → không gọi onValid, tự set errors lên các field
  - PHẢI gắn vào form: `<form onSubmit={handleSubmit(handler)}>` — nếu quên thì submit không validate

- **`mode: "onChange"`**
  - Validate mỗi khi user gõ (realtime)
  - Nặng hơn `"onSubmit"` (chỉ validate khi submit) và `"onBlur"` (validate khi rời field)
  - Tốt cho UX nhưng cần cân nhắc performance nếu form phức tạp

- **`!!errors.email`**
  - `errors.email` có type `FieldError | undefined`
  - MUI `error` prop cần `boolean`, không nhận `FieldError`
  - `!!` chuyển truthy/falsy → true/false: `!!undefined` = false, `!!{message: "..."}` = true

#### Axios Interceptor

- **Request interceptor** (chạy TRƯỚC mỗi request)
  - Đọc token từ localStorage → gắn vào header `Authorization: Bearer {token}`
  - Mọi request qua instance `api` đều tự có token, không cần set thủ công

- **Response interceptor** (chạy SAU khi nhận response)
  - Bắt lỗi 401 (token hết hạn) → tự động refresh token → retry request
  - Nếu không phải 401 → reject error như bình thường

- **Queue pattern** (xử lý nhiều request cùng bị 401)
  - Vấn đề: trang Dashboard gọi 3 API cùng lúc, cả 3 đều bị 401 → nếu cả 3 đều refresh → gọi refresh 3 lần (lãng phí + có thể conflict)
  - Giải pháp:
    - `isRefreshing` (boolean): cờ đánh dấu "đang refresh hay chưa"
    - `failedQueue` (array): phòng chờ cho các request bị 401 trong lúc đang refresh
    - `processQueue` (function): khi refresh xong, duyệt queue → resolve (thành công) hoặc reject (thất bại)
  - Flow:
    1. Request A bị 401 đầu tiên → `isRefreshing = false` → đi refresh → set `isRefreshing = true`
    2. Request B bị 401 → thấy `isRefreshing = true` → tạo Promise treo → đẩy resolve/reject vào queue → chờ
    3. Request A refresh xong → `processQueue(null, token)` → gọi `resolve(token)` cho B → B nhận token mới → B retry
    4. Request A cũng retry bằng `return api(originalRequest)`

- **`axios.post` vs `api.post` khi refresh**
  - `api` đã gắn interceptor → nếu refresh cũng bị 401 → lại vào interceptor → lại refresh → VÒNG LẶP VÔ HẠN
  - Dùng `axios` (instance gốc, không có interceptor) để gọi refresh → an toàn

- **`.finally()` → `isRefreshing = false`**
  - Dù refresh thành công hay thất bại, đều phải reset cờ
  - Nếu quên → lần sau bị 401 → mọi request đều vào queue → không ai refresh → treo mãi

- **Shadowing (đặt trùng tên biến)**
  - Callback ngoài: `(error: AxiosError) => { ... }`
  - Callback trong catch: `(error) => { ... }` → trùng tên → biến trong che biến ngoài
  - Sửa: đổi tên thành `refreshError` để phân biệt

- **`.catch()` phải return `Promise.reject()`**
  - Nếu catch không return reject → promise chain resolve với `undefined` → caller tưởng thành công
  - `return Promise.reject(refreshError)` → caller nhận error → xử lý được

#### Routing

- **`GuestRoute`**: ngược lại `ProtectedRoute`
  - Nếu user ĐÃ login (có token) mà vào `/login` → redirect về `/dashboard`
  - Tránh user login 2 lần

- **`ProtectedRoute`**: bảo vệ trang cần auth
  - Nếu user CHƯA login → redirect về `/login`

- **`<Navigate to="..." replace />`**
  - `replace`: thay thế entry hiện tại trong history, không tạo entry mới
  - Bấm Back sẽ không quay lại trang bị redirect

- **`<Outlet />`**: render route con
  - Layout component dùng Outlet để hiển thị child routes
  - GuestRoute render Outlet → LoginPage hiển thị bên trong

---

### Lỗi đã mắc & bài học

| # | Lỗi | Hậu quả | Cách sửa |
|---|-----|---------|----------|
| 1 | `.unwrap()` đặt ngoài try block | Error không được catch, app crash | Đặt `.unwrap()` bên trong try |
| 2 | Form thiếu `onSubmit={handleSubmit(...)}` | Submit không validate | Luôn gắn handleSubmit vào form tag |
| 3 | Input thiếu `error` + `helperText` props | Không hiện validation errors cho user | Thêm `error={!!errors.field}` và `helperText={errors.field?.message}` |
| 4 | `const isRefreshing` thay vì `let` | Không reassign được → TypeError | Dùng `let` cho biến cần thay đổi |
| 5 | `axios.interceptors` thay vì `api.interceptors` | Gắn interceptor vào instance gốc thay vì instance mình tạo | Luôn dùng instance đã tạo (`api`) |
| 6 | `.catch()` không return reject | Caller nhận undefined thay vì error | Thêm `return Promise.reject(error)` |
| 7 | `response.data` thay vì `response.data.data` | Destructure sai cấu trúc API response | Kiểm tra response format bằng curl trước |
| 8 | `.min(6)` trước `.nonempty()` | Empty input hiện "min 6 chars" thay vì "required" | Đặt `.nonempty()` trước `.min()` |

---

### Techbate Session 1 — Q&A (Bilingual / Song ngữ)

**Q1: What are the differences between `configureStore` and `createStore`?**
**(`configureStore` khác `createStore` ở những điểm nào?)**

> **EN:** `configureStore` is the modern replacement for `createStore`. It automatically includes 3 things out of the box:
> 1. **Default middleware** (redux-thunk, serializable check, immutability check) — no need to manually import `applyMiddleware`
> 2. **Redux DevTools** — enabled by default, no need to install `composeWithDevTools`
> 3. **Immutability checks** — detects accidental direct state mutation in development mode
>
> **VN:** `configureStore` là phiên bản nâng cấp, tự động thêm 3 thứ:
> 1. Middleware mặc định (redux-thunk, serializable check, immutability check) — không cần import `applyMiddleware`
> 2. Redux DevTools — tự bật, không cần `composeWithDevTools`
> 3. Immutability checks — phát hiện lỗi mutate state trực tiếp trong development

Result: Correct / Chính xác

---

**Q2: What is the difference between `builder.query` and `builder.mutation`?**
**(`builder.query` và `builder.mutation` khác nhau như thế nào?)**

> **EN:**
> - `builder.query`: Used for GET requests. Has **automatic caching** and **auto-fetches when the component mounts**. Returns `{ data, isLoading, error }`.
> - `builder.mutation`: Used for POST/PUT/DELETE. **No caching**, must **manually call the trigger function**. Returns `[triggerFn, { isLoading, error, data }]`.
>
> Key difference: query = auto-fetch + cached, mutation = manual trigger + not cached.
>
> **VN:**
> - `builder.query`: dùng cho GET, **có cache tự động**, **tự fetch khi component mount**, trả `{ data, isLoading, error }`
> - `builder.mutation`: dùng cho POST/PUT/DELETE, **không cache**, **phải gọi triggerFn() thủ công**, trả `[triggerFn, { isLoading, error, data }]`
>
> Điểm quan trọng: query tự fetch + có cache, mutation phải trigger thủ công + không cache.

Result: Correct direction but missing details about cache and auto fetch — need to mention these in interview
Kết quả: Đúng hướng nhưng thiếu chi tiết về cache và auto fetch — cần bổ sung khi interview

---

**Q3: Why use `axios.post` instead of `api.post` when calling the refresh token endpoint?** ⚠️ REVIEW THIS
**(Tại sao dùng `axios.post` mà không dùng `api.post` khi gọi refresh token?)** ⚠️ CẦN ÔN LẠI

> **EN:** We use the raw `axios` instance (which has **no interceptor attached**) to **avoid an infinite loop**.
>
> If we used `api.post`, the `api` instance already has a response interceptor. If the refresh token is also expired, the server returns 401 → the interceptor catches it → calls refresh again → 401 again → calls refresh again → **infinite loop**.
>
> Using `axios.post` → no interceptor → the error goes straight to `.catch()` → we logout the user → stops cleanly.
>
> **VN:** Dùng `axios` (instance gốc, **không có interceptor**) để tránh **infinite loop**.
>
> Nếu dùng `api.post` → `api` đã gắn response interceptor → nếu refresh token cũng hết hạn → server trả 401 → interceptor bắt → gọi refresh lại → 401 → gọi refresh lại → **vòng lặp vô hạn**.
>
> Dùng `axios.post` → không có interceptor → lỗi rơi thẳng vào `.catch()` → logout → dừng.

Result: Incorrect — answered "because the token in header expired" (WRONG, refresh sends token in body, not header). Keyword to remember: **infinite loop**
Kết quả: Sai — trả lời "vì token header đã hết hạn" (KHÔNG ĐÚNG, refresh gửi token trong body). Keyword: **infinite loop**

---

**Q4: What problem does `injectEndpoints` solve?**
**(`injectEndpoints` giải quyết vấn đề gì?)**

> **EN:** It enables a **code splitting pattern** for RTK Query. Instead of defining 20-30 endpoints in a single massive `api.ts` file, each feature file injects its own endpoints into the shared base API.
>
> Example: `authApi.ts` injects login/register, `campaignApi.ts` injects CRUD campaigns, `metricsApi.ts` injects dashboard queries. They all share the same base API (same baseUrl, headers, cache). Easier to maintain, easier to find code, and avoids merge conflicts in large teams.
>
> **VN:** Pattern code splitting: thay vì viết 20-30 endpoints trong 1 file `api.ts` khổng lồ, mỗi feature tự inject endpoints riêng vào base API.
>
> Ví dụ: `authApi.ts` inject login/register, `campaignApi.ts` inject CRUD campaigns, `metricsApi.ts` inject dashboard queries. Tất cả share chung 1 base API (cùng baseUrl, headers, cache). Dễ maintain, dễ tìm code, team nhiều người làm không bị conflict.

Result: Correct / Chính xác

---

**Q5: Describe the flow when 3 concurrent requests all receive 401**
**(Mô tả flow xử lý khi 3 request cùng bị 401)**

> **EN:**
> 1. Request A gets 401 first → `isRefreshing` is `false` → sets it to `true` → initiates token refresh
> 2. Requests B and C also get 401 → see `isRefreshing` is `true` → each creates a pending Promise → pushes its resolve/reject callbacks into `failedQueue` → waits
> 3. Request A's refresh succeeds → saves new token to localStorage + dispatches to Redux store
> 4. Calls `processQueue(null, accessToken)` → iterates `failedQueue` → calls `resolve(token)` for B and C → they receive the new token → their `.then()` runs → retries with new Authorization header
> 5. **Request A itself retries via `return api(originalRequest)`** — this is separate from processQueue
> 6. **`.finally()` resets `isRefreshing = false`** — ensures the mechanism works for future 401 errors
>
> **VN:**
> 1. Request A bị 401 đầu tiên → `isRefreshing = false` → set thành `true` → đi refresh token
> 2. Request B, C bị 401 → thấy `isRefreshing = true` → tạo Promise treo → đẩy resolve/reject vào `failedQueue` → chờ
> 3. Request A refresh thành công → lưu token mới vào storage + dispatch lên store
> 4. Gọi `processQueue(null, accessToken)` → duyệt failedQueue → gọi `resolve(token)` cho B và C → B, C nhận token mới → retry
> 5. **Request A cũng retry bằng `return api(originalRequest)`** — tách biệt với processQueue
> 6. **`.finally()` reset `isRefreshing = false`** — để lần sau vẫn hoạt động

Result: Very good, missed points 5 and 6 / Rất tốt, thiếu nhẹ điểm 5 và 6

---

### Điểm yếu cần ôn lại

| # | Chủ đề | Vấn đề | Keyword cần nhớ |
|---|--------|--------|-----------------|
| 1 | axios.post vs api.post | Trả lời sai lý do | **infinite loop**, không phải "token hết hạn" |
| 2 | query vs mutation | Thiếu chi tiết | **cache + auto fetch** (query) vs **manual trigger + no cache** (mutation) |
| 3 | Queue pattern flow | Thiếu 2 điểm | **Request A retry riêng** + **finally reset isRefreshing** |

---

## Tasks còn lại

| Task | Feature | Kiến thức sẽ học |
|------|---------|-----------------|
| 1 | Metrics RTK Query API | query params, `skip` option, dependent queries (fetch phụ thuộc kết quả fetch khác) |
| 2 | WebSocket Types + Constants | TypeScript union types, constants pattern |
| 3 | useWebSocket Hook | useRef buffer, requestAnimationFrame batching (gom nhiều update thành 1 render), exponential backoff (1s→2s→4s→8s) |
| 4 | ECharts Components (4 charts) | useMemo cho chart options (tránh re-create mỗi render), MUI theme integration |
| 5 | DashboardPage | useCallback (stable function reference), conditional rendering (loading/error/empty states), Grid layout |
| 6 | CampaignDetailPage | useParams (lấy id từ URL), single entity fetch, ConfirmDialog |
| 7 | CampaignNewPage | complex Zod schema (budget > 0, endDate > startDate), date pickers, edit mode (prefill form) |
| 8 | Refactor CampaignsPage | Generic TypeScript `<T>` (component nhận type linh hoạt), component composition |
| 9 | Ads API (bonus) | nested resources (ads thuộc campaign), tag relationships |
| 10 | Admin Users Page (bonus) | role-based routing, admin guard |

## Docs đã cover

| Doc | Kiến thức đã ôn |
|-----|----------------|
| Tier 0 - JS Core | !! operator (type coercion), Promise (resolve/reject/then/catch/finally) |
| Tier 0 - TypeScript | ReturnType, generics `<T>`, z.infer, withTypes |
| Tier 1 - React Core | Route guards (ProtectedRoute, GuestRoute), Navigate, Outlet |
| Tier 3 - Client State | localStorage sync (lưu/đọc token), Zustand toast store |
| Tier 3 - Server State | tagTypes (cache invalidation concept) |
| Tier 3 - Redux Deep | configureStore, createSlice, RTK Query (createApi, fetchBaseQuery, injectEndpoints, mutations) |
| Go - API Auth | JWT flow (access + refresh token), token refresh interceptor pattern |
