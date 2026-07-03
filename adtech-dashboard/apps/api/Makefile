.PHONY: dev build test lint docker-up docker-down migrate-up migrate-down sqlc clean

# ─── Development ────────────────────────────────
dev: ## Start the API server
	go run cmd/api/main.go

build: ## Build the binary
	go build -o bin/api cmd/api/main.go

test: ## Run all tests
	go test ./... -v -count=1

lint: ## Run linter
	golangci-lint run ./...

# ─── Docker ─────────────────────────────────────
docker-up: ## Start PostgreSQL + Redis
	docker compose up -d

docker-down: ## Stop containers
	docker compose down

docker-reset: ## Stop containers and remove volumes
	docker compose down -v

# ─── Database ───────────────────────────────────
migrate-up: ## Run all migrations
	migrate -path migrations -database "$(DATABASE_URL)" up

migrate-down: ## Rollback last migration
	migrate -path migrations -database "$(DATABASE_URL)" down 1

migrate-create: ## Create new migration (usage: make migrate-create NAME=create_foo)
	migrate create -ext sql -dir migrations -seq $(NAME)

# ─── Code Generation ────────────────────────────
sqlc: ## Generate Go code from SQL queries
	sqlc generate

# ─── Helpers ────────────────────────────────────
clean: ## Remove build artifacts
	rm -rf bin/

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
