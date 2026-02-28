package server

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"adtech/config"
	"adtech/internal/handler"
	"adtech/internal/handler/middleware"

	"github.com/gin-gonic/gin"
)

type Server struct {
	cfg         *config.Config
	authHandler *handler.AuthHandler
	campaignHandler *handler.CampaignHandler
}

func New(cfg *config.Config, authHandler *handler.AuthHandler, campaignHandler *handler.CampaignHandler) *Server {
	return &Server{
		cfg:         cfg,
		authHandler: authHandler,
		campaignHandler: campaignHandler,
	}
}

func (s *Server) Run() {
	r := gin.Default()

	// Global middleware
	r.Use(middleware.CORS())
	r.Use(middleware.RequestID())
	r.Use(middleware.Logger())

	// Health check
	r.GET("/health", handler.HealthCheck)

	// Public routes
	public := r.Group("/api/v1")
	{
		public.POST("/auth/register", s.authHandler.Register)
		public.POST("/auth/login", s.authHandler.Login)
	}

	// Protected routes
	api := r.Group("/api/v1")
	api.Use(middleware.Auth(s.cfg.JWTSecret))

	// Campaigns
	if s.campaignHandler != nil {
		api.GET("/campaigns", s.campaignHandler.List)
		api.GET("/campaigns/:id", s.campaignHandler.GetByID)
		api.PATCH("/campaigns/:id/status", s.campaignHandler.UpdateStatus)
		api.DELETE("/campaigns/:id", s.campaignHandler.Delete)
	}

	// Graceful shutdown
	srv := &http.Server{
		Addr:         ":" + s.cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  30 * time.Second,
	}

	go func() {
		slog.Info("Server starting", "port", s.cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	slog.Info("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("Server forced to shutdown", "error", err)
	}

	slog.Info("Server stopped")
}
