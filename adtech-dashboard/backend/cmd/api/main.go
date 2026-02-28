package main

import (
	"log/slog"
	"os"

	"adtech/config"
	"adtech/internal/database"
	"adtech/internal/handler"
	"adtech/internal/repository/postgres"
	"adtech/internal/server"
	"adtech/internal/service"
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

	// Wire layers: repository → service → handler
	userRepo := postgres.NewUserRepo(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	// Campaign handler (placeholder — will wire repo later)
	// campaignRepo := postgres.NewCampaignRepo(db)
	// campaignHandler := handler.NewCampaignHandler(campaignRepo)

	// Start server
	srv := server.New(cfg, authHandler, nil)
	srv.Run()
}
