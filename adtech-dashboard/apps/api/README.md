# AdTech Dashboard — Backend

Go REST API với Gin, PostgreSQL, Redis, xác thực JWT.

Go REST API with Gin, PostgreSQL, Redis, JWT authentication.

## Yêu cầu / Prerequisites

- Go 1.22+
- Docker Desktop (cho PostgreSQL + Redis)
- [golang-migrate](https://github.com/golang-migrate/migrate) (`brew install golang-migrate`)
- [sqlc](https://sqlc.dev/) (`brew install sqlc`) — tuỳ chọn, dùng để generate lại query code

## Bắt đầu / Getting Started

```bash
# Khởi động PostgreSQL + Redis
docker compose up -d

# Chạy database migrations (tạo bảng)
make migrate-up

# Chạy dev server
make dev
# → http://localhost:8080
```

## Cấu trúc dự án / Project Structure

```
backend/
├── cmd/api/main.go              # Entry point — wire dependencies
├── config/config.go             # Load biến môi trường (.env)
├── docker-compose.yml           # PostgreSQL 16 + Redis 7
├── Makefile                     # Tất cả commands
├── migrations/                  # SQL migration files (5 bảng)
│
└── internal/                    # Code private (Go compiler-enforced)
    ├── server/                  # Gin engine + graceful shutdown
    ├── handler/                 # HTTP handlers (tầng transport)
    │   ├── auth_handler.go      # Đăng ký, Đăng nhập
    │   ├── campaign_handler.go  # CRUD campaigns
    │   ├── health_handler.go    # Health check
    │   ├── response.go          # SuccessResponse, ErrorResponse helpers
    │   └── middleware/          # Auth (JWT), CORS, RequestID, Logger
    ├── service/                 # Logic nghiệp vụ
    │   └── auth_service.go      # JWT + bcrypt
    ├── repository/              # Interface truy cập dữ liệu
    │   └── postgres/            # Implementation cho PostgreSQL
    ├── domain/                  # Kiểu dữ liệu cốt lõi (User, Campaign, Ad, Event)
    ├── dto/                     # Cấu trúc Request/Response
    └── database/                # Kết nối DB + Redis
```

## Các lệnh Make / Make Commands

```bash
make help          # Hiển thị tất cả commands
make dev           # Chạy API server
make build         # Build binary → bin/api
make test          # Chạy tất cả tests
make docker-up     # Khởi động PostgreSQL + Redis
make docker-down   # Dừng containers
make docker-reset  # Dừng + xoá volumes (reset data)
make migrate-up    # Chạy tất cả migrations
make migrate-down  # Rollback migration cuối
make sqlc          # Generate lại Go code từ SQL
```

## Biến môi trường / Environment Variables

| Biến / Variable | Mặc định / Default | Mô tả / Description |
|----------|---------|-------------|
| `PORT` | `8080` | Port server |
| `DATABASE_URL` | `postgres://adtech:adtech123@localhost:5432/adtech?sslmode=disable` | Kết nối PostgreSQL |
| `REDIS_URL` | `localhost:6379` | Kết nối Redis |
| `JWT_SECRET` | `dev-secret-key` | Khoá ký JWT (đổi khi deploy production) |

## Lược đồ Database / Database Schema

5 bảng với indexes / 5 tables with indexes:

- **users** — email (unique), mật khẩu bcrypt, vai trò (admin/advertiser/viewer)
- **campaigns** — ngân sách, ngân sách ngày, targeting (JSONB), trạng thái, khoảng ngày
- **ads** — banner/native/video, URL đích
- **ad_events** — impression/click/conversion, quốc gia, thiết bị, chi phí (khối lượng lớn)
- **campaign_metrics** — thống kê gộp theo giờ (impressions, clicks, spend)

## Kiến trúc tầng / Architecture Layers

```
Request → Middleware → Handler → Service → Repository → PostgreSQL
                         ↓
                    response.go (SuccessResponse / ErrorResponse)
```

- **Handler**: Chỉ HTTP — parse request, gọi service, trả response
- **Service**: Logic nghiệp vụ — auth, caching, validation
- **Repository**: Truy cập dữ liệu — interface + PostgreSQL implementation
- **Domain**: Struct cốt lõi, không phụ thuộc gì
- **DTO**: Cấu trúc Request/Response, tách biệt khỏi domain
