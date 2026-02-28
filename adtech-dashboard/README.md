# AdTech Dashboard

## Dự án này là gì? / What is this?

Một **nền tảng quản lý chiến dịch quảng cáo số** — giống Google Ads hoặc Facebook Ads Manager phiên bản đơn giản.

A **campaign management platform for digital advertising** — think a simplified Google Ads or Facebook Ads Manager.

Nhà quảng cáo dùng dashboard này để / Advertisers use this dashboard to:
- **Tạo chiến dịch quảng cáo** với ngân sách, đối tượng mục tiêu (quốc gia, thiết bị, độ tuổi), khoảng thời gian chạy
- **Quản lý các mẫu quảng cáo** trong mỗi chiến dịch (banner, native, video)
- **Theo dõi hiệu suất real-time** — bao nhiêu người xem (impressions), click vào (clicks), mua hàng (conversions)
- **Giám sát chi tiêu** — đã dùng bao nhiêu ngân sách, giá mỗi click (CPC), tỷ lệ click (CTR)
- **Xem phân tích** — biểu đồ xu hướng theo thời gian, phân tích theo quốc gia và thiết bị

Hệ thống xử lý **event khối lượng lớn**: mỗi khi ai đó xem hoặc click quảng cáo, event đó được xử lý qua worker pool (Go goroutines), lưu vào database, và stream đến dashboard qua WebSocket real-time.

The system handles **high-volume event processing**: every time someone views or clicks an ad, that event gets processed through a worker pool, stored in the database, and streamed to the dashboard via WebSocket in real-time.

### Vai trò người dùng / User Roles

| Vai trò / Role | Quyền hạn / Permissions |
|------|--------|
| **Admin** | Quản lý tất cả campaigns + users, xem metrics toàn hệ thống |
| **Advertiser** | Tạo/quản lý campaigns + ads của mình, xem metrics riêng |
| **Viewer** | Chỉ đọc, xem campaigns được gán |

### Vòng đời Campaign / Campaign Lifecycle

```
Draft → Active → Paused → Active → Completed → Archived
  ↑                                      ↑
  Tạo chiến dịch              Hết ngân sách hoặc hết hạn
  Create campaign              Budget exhausted or end date reached
```

### Luồng dữ liệu / Data Flow

```
Người dùng click quảng cáo trên website
User clicks ad on website
        ↓
POST /api/v1/events  (ad event: impression/click/conversion)
        ↓
Worker Pool (Go goroutines, buffered channel)
        ↓
   ┌────┴────┐
   ↓         ↓
Batch INSERT   Redis real-time counters
(PostgreSQL)   (HIncrBy — atomic, không race condition)
                 ↓
            Redis Pub/Sub
                 ↓
         WebSocket Hub (fan-out tới các client đang subscribe)
                 ↓
         React Dashboard (cập nhật live, không cần refresh)
```

---

## Tech Stack / Công nghệ

| Tầng / Layer | Công nghệ / Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, Recharts |
| Backend | Go 1.22+, Gin, PostgreSQL, pgx/v5, Redis, JWT, WebSocket |
| Hạ tầng / Infra | Docker Compose, Makefile |

## Cấu trúc dự án / Project Structure

```
adtech-dashboard/
├── backend/          # Go API (Go community standard layout)
│   ├── cmd/api/      # Entry point — wire dependencies, khởi tạo server
│   ├── config/       # Cấu hình môi trường / Environment config
│   ├── migrations/   # SQL schema (5 bảng / tables)
│   └── internal/     # Code private (Go compiler không cho import từ ngoài)
│       ├── handler/  # Tầng HTTP (parse request → trả response)
│       ├── service/  # Logic nghiệp vụ (auth, caching, xử lý event)
│       ├── repository/ # Truy cập dữ liệu (PostgreSQL queries)
│       ├── domain/   # Kiểu dữ liệu cốt lõi (User, Campaign, Ad, Event)
│       └── dto/      # Cấu trúc Request/Response
├── frontend/         # React SPA (Vite + Redux Toolkit)
└── README.md
```

## Bắt đầu nhanh / Quick Start

```bash
# 1. Khởi động PostgreSQL + Redis
cd backend && docker compose up -d

# 2. Chạy database migrations (tạo bảng)
make migrate-up

# 3. Chạy backend API
make dev              # → http://localhost:8080

# 4. Chạy frontend (terminal khác)
cd frontend && npm run dev   # → http://localhost:5173
```

## Tổng quan API / API Overview

| Method | Endpoint | Mô tả / Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Đăng ký (email + password) |
| POST | `/api/v1/auth/login` | Đăng nhập → JWT access + refresh tokens |
| GET | `/api/v1/campaigns` | Danh sách campaigns (lọc, sắp xếp, phân trang) |
| GET | `/api/v1/campaigns/:id` | Chi tiết campaign + metrics |
| POST | `/api/v1/campaigns` | Tạo campaign mới |
| PATCH | `/api/v1/campaigns/:id/status` | Kích hoạt / tạm dừng / lưu trữ |
| DELETE | `/api/v1/campaigns/:id` | Xoá mềm (soft delete) |
| POST | `/api/v1/events` | Nhận ad event (khối lượng lớn) |
| GET | `/api/v1/dashboard/overview` | Thống kê tổng hợp |
| WS | `/ws/metrics` | Stream metrics real-time |

Tất cả response theo format thống nhất / All responses follow a consistent format:

```json
{ "success": true, "data": { ... } }
{ "success": true, "data": [...], "meta": { "total": 42, "page": 1 } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "campaign not found" } }
```

## Lược đồ Database / Database Schema

```
users ──────── 1:N ──── campaigns ──── 1:N ──── ads ──── 1:N ──── ad_events
                              │
                              └── 1:N ──── campaign_metrics (rollup theo giờ)
```

- **users** — xác thực, phân quyền (admin/advertiser/viewer)
- **campaigns** — ngân sách, targeting (JSONB), vòng đời trạng thái
- **ads** — định dạng quảng cáo (banner/native/video)
- **ad_events** — log event khối lượng lớn (impression/click/conversion)
- **campaign_metrics** — thống kê gộp theo giờ (tránh scan hàng triệu events)
