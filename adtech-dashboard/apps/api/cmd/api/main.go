package main

import (
	"context"
	"log/slog"
	"os"

	"adtech/config"
	"adtech/internal/database"
	"adtech/internal/handler"
	"adtech/internal/repository/postgres"
	"adtech/internal/server"
	"adtech/internal/service"
	"adtech/internal/storage"
	"adtech/internal/websocket"
	"adtech/internal/worker"
)

func main() {
	// Structured logging
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})))

	// Load config
	cfg := config.Load()

	// Connect to PostgreSQL
	db := database.Connect(cfg.DatabaseURL)
	defer db.Close()

	// Connect to Redis
	rdb := database.ConnectRedis(cfg.RedisURL)
	defer rdb.Close()

	// Connect to MinIO
	minioStorage := storage.NewMinIOStorage(
		cfg.MinIOEndpoint, cfg.MinIOAccessKey, cfg.MinIOSecretKey,
		cfg.MinIOBucket, cfg.MinIOUseSSL,
	)

	// WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	// Wire layers: repository → service → handler
	userRepo := postgres.NewUserRepo(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret, rdb)
	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userRepo)

	// Campaign
	campaignRepo := postgres.NewCampaignRepo(db)
	campaignHandler := handler.NewCampaignHandler(campaignRepo)

	// Ad
	adRepo := postgres.NewAdRepo(db)
	adHandler := handler.NewAdHandler(adRepo)

	// Metrics / Events
	eventRepo := postgres.NewEventRepo(db)

	// Worker pool (5 workers for processing ad events)
	pool := worker.NewPool(5, eventRepo, hub)
	pool.Start(context.Background())
	defer pool.Stop()

	metricsHandler := handler.NewMetricsHandler(eventRepo, pool)

	// Upload
	uploadHandler := handler.NewUploadHandler(minioStorage)

	// Start server
	srv := server.New(cfg, authHandler, userHandler, campaignHandler, adHandler, metricsHandler, uploadHandler, hub)
	srv.Run()
}
