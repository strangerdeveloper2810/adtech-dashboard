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

---

## Session 2 (2026-03-09): Dashboard + ECharts + Redux Persist

### Đã implement

| # | Feature | File | Kiến thức |
|---|---------|------|-----------|
| 1 | Dashboard Overview API | `features/dashboard/dashboardApi.ts` | RTK Query `transformResponse`, `providesTags` |
| 2 | StatCards với real data | `pages/DashboardPage.tsx` | Conditional rendering, props typing |
| 3 | Device Distribution Chart | `components/charts/DeviceDistributionChart.tsx` | ECharts donut, `useMemo`, color mapping |
| 4 | Country Traffic Chart | `components/charts/CountryTrafficChart.tsx` | ECharts horizontal bar, sort by value |
| 5 | Campaign Selector | `pages/DashboardPage.tsx` | MUI Select, FormControl, handleChange |
| 6 | Redux Persist | `app/store.ts`, `App.tsx` | `persistReducer`, `persistStore`, `PersistGate`, whitelist |
| 7 | Dashboard Slice | `features/dashboard/dashboardSlice.ts` | `createSlice`, selected campaign state |
| 8 | baseQueryWithReauth | `app/api.ts` | RTK Query token refresh, `BaseQueryFn` |

---

### Redux Persist — Chi tiết

#### 1. Vấn đề cần giải quyết

Redux store bị **reset về initialState** mỗi khi user:
- Refresh trang (F5)
- Close tab rồi mở lại
- Navigate bằng URL trực tiếp

→ User phải chọn lại campaign mỗi lần, UX tệ.

#### 2. Giải pháp: Redux Persist

Redux Persist **đồng bộ Redux store với localStorage** (hoặc sessionStorage/AsyncStorage cho React Native).

Flow hoạt động:

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP BOOT                                │
├─────────────────────────────────────────────────────────────────┤
│ 1. createStore() → store có initialState                        │
│ 2. persistStore() dispatch PERSIST action                       │
│ 3. Đọc localStorage → tìm key "persist:adtech"                  │
│ 4. Deserialize JSON → Redux state                               │
│ 5. dispatch REHYDRATE action → merge vào store                  │
│ 6. PersistGate nhận signal → render children                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      RUNTIME (state change)                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Component dispatch action (vd: setSelectedCampaign(5))       │
│ 2. Reducer update state                                         │
│ 3. Persist middleware detect change trong whitelist slices      │
│ 4. Serialize state → JSON                                       │
│ 5. Write to localStorage["persist:adtech"]                      │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Cấu hình

```typescript
// app/store.ts
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage wrapper

const persistConfig = {
  key: "adtech",           // key trong localStorage
  storage,                 // engine (localStorage)
  whitelist: ["dashboard"] // CHỈ persist những slice này (không persist auth, api cache)
};

const rootReducer = combineReducers({
  auth: authSlice,
  dashboard: dashboardSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Wrap rootReducer với persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // QUAN TRỌNG: ignore redux-persist internal actions
        // (chúng chứa Promise, function - không serializable)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store); // tạo persistor instance
```

#### 4. PersistGate

```typescript
// App.tsx
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./app/store";

<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    {/* children không render cho đến khi REHYDRATE xong */}
  </PersistGate>
</Provider>
```

**Tại sao cần PersistGate?**
- REHYDRATE là **async** (đọc localStorage mất vài ms)
- Nếu render trước khi REHYDRATE xong → component thấy initialState → flash sai data
- PersistGate block render → đợi REHYDRATE → render với data đúng

**`loading={null}`**: không hiện gì trong lúc chờ (hoặc có thể truyền spinner component)

#### 5. Actions của Redux Persist

| Action | Khi nào | Làm gì |
|--------|---------|--------|
| `PERSIST` | App boot, sau createStore | Khởi tạo persist, đọc localStorage |
| `REHYDRATE` | Sau khi đọc localStorage xong | Merge persisted state vào store |
| `PAUSE` | Tạm dừng persist (manual) | Ngừng write localStorage |
| `FLUSH` | Force flush pending writes | Đảm bảo data được save ngay |
| `PURGE` | Clear all persisted data | Xóa localStorage, logout |
| `REGISTER` | Register new persistor | Internal |

#### 6. Whitelist vs Blacklist

```typescript
// Whitelist: CHỈ persist những slice được liệt kê
whitelist: ["dashboard", "settings"]

// Blacklist: persist TẤT CẢ NGOẠI TRỪ những slice này
blacklist: ["auth", "api"]
```

**Best practices:**
- KHÔNG persist `auth` slice (token trong localStorage riêng, nếu persist cả slice → stale token vẫn được rehydrate)
- KHÔNG persist RTK Query cache (`api` slice) — cache có TTL riêng, persist sẽ gây stale data
- CHỈ persist UI state (selected items, filters, preferences)

#### 7. Kiểm tra trong DevTools

1. **Redux DevTools**: thấy 2 actions khi boot:
   - `persist/PERSIST`
   - `persist/REHYDRATE` với payload = data từ localStorage

2. **Application tab → localStorage**:
   - Key: `persist:adtech`
   - Value: `{"dashboard":"{\"selectedCampaignId\":5}","_persist":{"version":-1,"rehydrated":true}}`

---

### baseQueryWithReauth — RTK Query Token Refresh

#### Vấn đề

RTK Query dùng `fetchBaseQuery` (wrapper của `fetch()`), KHÔNG dùng Axios → interceptor Axios KHÔNG chạy cho RTK Query requests.

#### Giải pháp: Custom baseQuery wrapper

```typescript
// app/api.ts
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = storage.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wrapper xử lý 401 và auto refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Gọi API bình thường
  let result = await baseQuery(args, api, extraOptions);

  // 2. Nếu 401 → refresh token
  if (result.error && result.error.status === 401) {
    const refreshToken = storage.getRefreshToken();

    if (refreshToken) {
      // 3. Gọi refresh endpoint
      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // 4. Thành công → save tokens + retry request gốc
        const { data } = refreshResult.data as RefreshResponse;
        storage.setAccessToken(data.accessToken);
        storage.setRefreshToken(data.refreshToken);
        api.dispatch(setCredentials({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        }));

        // 5. Retry request ban đầu với token mới
        result = await baseQuery(args, api, extraOptions);
      } else {
        // 6. Refresh thất bại → logout
        api.dispatch(logout());
        window.location.href = "/login";
      }
    }
  }

  return result;
};

// Dùng wrapper thay vì baseQuery trực tiếp
export default createApi({
  baseQuery: baseQueryWithReauth, // <-- THAY ĐỔI Ở ĐÂY
  endpoints: () => ({}),
});
```

#### So sánh với Axios Interceptor

| Axios Interceptor | baseQueryWithReauth |
|-------------------|---------------------|
| Cho `axios.get/post()` calls | Cho RTK Query endpoints |
| `api.interceptors.response.use()` | Custom `BaseQueryFn` wrapper |
| Queue pattern cho concurrent 401s | Simple (1 request tại 1 thời điểm) |
| `api(originalRequest)` retry | `baseQuery(args)` retry |

**Khi nào dùng cái nào?**
- Axios interceptor: nếu gọi API trực tiếp bằng `axios.get()` (ít khi trong app dùng RTK Query)
- baseQueryWithReauth: nếu dùng RTK Query hooks (`useGetCampaignsQuery`, etc.)

**Note:** Có thể giữ cả 2 nếu app có mixed usage (một số chỗ dùng axios, một số dùng RTK Query).

---

### transformResponse + providesTags

#### transformResponse

Backend trả về:
```json
{
  "success": true,
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

RTK Query default chỉ lấy response body → cần transform:

```typescript
getCampaigns: builder.query<PaginatedResponse<Campaign>, CampaignListParams>({
  query: (params) => ({ url: "/campaigns", params }),
  // Transform response structure
  transformResponse: (response: PaginatedApiResponse<Campaign>) => ({
    success: response.success,
    data: response.data,
    meta: response.meta,
  }),
}),
```

#### providesTags

```typescript
providesTags: (result) =>
  result?.data
    ? [
        // Tag cho từng campaign (invalidate 1 campaign)
        ...result.data.map(({ id }) => ({ type: "Campaign" as const, id })),
        // Tag cho list (invalidate tất cả)
        { type: "Campaign", id: "LIST" },
      ]
    : [{ type: "Campaign", id: "LIST" }],
```

**Flow:**
1. `getCampaigns` query có tags `Campaign:1`, `Campaign:2`, `Campaign:LIST`
2. `createCampaign` mutation thành công → `invalidatesTags: [{ type: "Campaign", id: "LIST" }]`
3. RTK Query thấy tag `Campaign:LIST` bị invalidate → auto refetch `getCampaigns`

---

### Kiến thức ECharts

#### Pattern chuẩn

```typescript
// 1. useRef cho DOM container
const chartRef = useRef<HTMLDivElement>(null);

// 2. useMemo cho options (tránh re-create mỗi render)
const options = useMemo(() => ({
  // chart config
}), [data]); // chỉ re-create khi data thay đổi

// 3. useEffect init/update chart
useEffect(() => {
  if (!chartRef.current) return;

  // Dispose cũ nếu có
  const existingInstance = echarts.getInstanceByDom(chartRef.current);
  if (existingInstance) existingInstance.dispose();

  // Init mới
  const chart = echarts.init(chartRef.current);
  chart.setOption(options);

  // Cleanup khi unmount
  return () => chart.dispose();
}, [options]);

// 4. Render container với fixed height
return <div ref={chartRef} style={{ width: "100%", height: 300 }} />;
```

#### Tại sao useMemo cho options?

```typescript
// ❌ KHÔNG DÙNG: options object mới mỗi render → useEffect chạy liên tục → chart bị re-init
const options = { title: { text: "Chart" } };

// ✅ DÙNG: options chỉ thay đổi khi dependencies thay đổi
const options = useMemo(() => ({
  title: { text: "Chart" }
}), []); // [] = không bao giờ thay đổi
```

---

### Lỗi đã mắc & bài học (Session 2)

| # | Lỗi | Hậu quả | Cách sửa |
|---|-----|---------|----------|
| 1 | `result.data.map()` khi result undefined | TypeError: Cannot read map of undefined | `result?.data` optional chaining |
| 2 | transformResponse trả về sai structure | RTK Query hooks nhận data rỗng | Check backend response format bằng curl trước |
| 3 | PaginationMeta `total_pages` vs `totalPages` | Type mismatch, TS error | Check backend JSON camelCase convention |
| 4 | Quên `loading={null}` trong PersistGate | TypeScript error | Thêm loading prop (null hoặc spinner) |
| 5 | Persist auth slice | Token hết hạn vẫn được rehydrate | Chỉ whitelist UI state, không persist auth |

---

### Techbate Session 2 — Q&A

**Q1: Redux Persist hoạt động như thế nào?**

> **EN:** Redux Persist syncs Redux store with localStorage through a 2-way binding:
> - **On boot:** dispatch PERSIST → read localStorage → dispatch REHYDRATE → merge into store
> - **On change:** reducer updates state → persist middleware detects change in whitelisted slices → serialize → write to localStorage
>
> PersistGate blocks rendering until REHYDRATE completes to prevent UI flash with wrong data.
>
> **VN:** Redux Persist đồng bộ 2 chiều giữa Redux store và localStorage:
> - **Khi boot:** dispatch PERSIST → đọc localStorage → dispatch REHYDRATE → merge vào store
> - **Khi state thay đổi:** reducer update → middleware detect → serialize → ghi localStorage
>
> PersistGate chặn render cho đến khi REHYDRATE xong để tránh flash data sai.

---

**Q2: Tại sao cần baseQueryWithReauth khi đã có Axios interceptor?**

> **EN:** RTK Query uses `fetchBaseQuery` (a fetch() wrapper), NOT Axios. Axios interceptors only apply to `axios.get/post()` calls. Since RTK Query hooks don't use Axios, we need a custom baseQuery wrapper to handle 401 and token refresh.
>
> **VN:** RTK Query dùng `fetchBaseQuery` (wrapper của fetch()), KHÔNG dùng Axios. Axios interceptors chỉ apply cho `axios.get/post()`. RTK Query hooks không qua Axios → cần custom baseQuery wrapper để xử lý 401 và refresh token.

---

**Q3: Whitelist vs Blacklist trong redux-persist?**

> **EN:**
> - **Whitelist:** ONLY persist listed slices. Recommended because explicit is better than implicit.
> - **Blacklist:** Persist ALL EXCEPT listed slices. Risky because new slices get persisted by default.
>
> Best practice: whitelist UI state only (selected items, filters). DO NOT persist auth (stale tokens) or api cache (stale data).
>
> **VN:**
> - **Whitelist:** CHỈ persist những slice được liệt kê. Khuyến khích vì explicit hơn.
> - **Blacklist:** Persist TẤT CẢ NGOẠI TRỪ. Rủi ro vì slice mới tự động bị persist.
>
> Best practice: chỉ whitelist UI state. KHÔNG persist auth (token hết hạn) hoặc api cache (stale data).

---

**Q4: Tại sao cần serializableCheck ignoredActions cho redux-persist?**

> **EN:** Redux Persist's internal actions (PERSIST, REHYDRATE, etc.) contain non-serializable values like Promises and functions. Redux Toolkit's middleware throws warnings/errors for non-serializable action payloads. We ignore these specific actions to suppress false warnings.
>
> **VN:** Các actions nội bộ của Redux Persist (PERSIST, REHYDRATE, v.v.) chứa giá trị không serializable như Promise và function. Middleware của Redux Toolkit báo warning/error khi action có payload không serializable. Ta ignore những actions này để tránh warning sai.

---

**Q5: providesTags pattern trong RTK Query?**

> **EN:** Tags enable automatic cache invalidation:
> 1. Query provides tags: `[{ type: "Campaign", id: 1 }, { type: "Campaign", id: "LIST" }]`
> 2. Mutation invalidates tags: `invalidatesTags: [{ type: "Campaign", id: "LIST" }]`
> 3. RTK Query sees tag invalidated → auto-refetches queries with that tag
>
> Pattern: list queries provide `id: "LIST"` tag. Mutations (create/delete) invalidate `id: "LIST"`. Update mutations invalidate specific `id: campaignId`.
>
> **VN:** Tags cho phép auto invalidate cache:
> 1. Query provides tags: `[{ type: "Campaign", id: 1 }, { type: "Campaign", id: "LIST" }]`
> 2. Mutation invalidates tags: `invalidatesTags: [{ type: "Campaign", id: "LIST" }]`
> 3. RTK Query thấy tag bị invalidate → auto refetch queries có tag đó
>
> Pattern: list queries có tag `id: "LIST"`. Mutations (create/delete) invalidate `id: "LIST"`. Update mutations invalidate specific `id: campaignId`.

---

## Tasks còn lại

| Task | Feature | Kiến thức sẽ học |
|------|---------|-----------------|
| ~~1~~ | ~~Metrics RTK Query API~~ | ~~query params, transformResponse~~ ✅ |
| ~~2~~ | ~~WebSocket Types~~ | ~~TypeScript union types~~ ✅ |
| ~~3~~ | ~~useWebSocket Hook~~ | ~~useRef buffer, exponential backoff~~ ✅ |
| ~~4~~ | ~~ECharts Components~~ | ~~useMemo, dispose pattern~~ ✅ |
| ~~5~~ | ~~DashboardPage~~ | ~~conditional rendering, Grid~~ ✅ |
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
| Tier 3 - Client State | localStorage sync (lưu/đọc token), Zustand toast store, **Redux Persist (whitelist, PERSIST, REHYDRATE, PersistGate)** |
| Tier 3 - Server State | tagTypes (cache invalidation concept), **providesTags/invalidatesTags pattern, transformResponse** |
| Tier 3 - Redux Deep | configureStore, createSlice, RTK Query (createApi, fetchBaseQuery, injectEndpoints, mutations), **baseQueryWithReauth wrapper** |
| Go - API Auth | JWT flow (access + refresh token), token refresh interceptor pattern |
| FE Optimization | **useMemo cho chart options, useRef cho DOM container, useEffect cleanup (dispose)** |
