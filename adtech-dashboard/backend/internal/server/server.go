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
	"adtech/internal/websocket"

	"github.com/gin-gonic/gin"
)

type Server struct {
	cfg             *config.Config
	authHandler     *handler.AuthHandler
	campaignHandler *handler.CampaignHandler
	adHandler       *handler.AdHandler
	metricsHandler  *handler.MetricsHandler
	uploadHandler   *handler.UploadHandler
	wsHub           *websocket.Hub
}

func New(
	cfg *config.Config,
	authHandler *handler.AuthHandler,
	campaignHandler *handler.CampaignHandler,
	adHandler *handler.AdHandler,
	metricsHandler *handler.MetricsHandler,
	uploadHandler *handler.UploadHandler,
	wsHub *websocket.Hub,
) *Server {
	return &Server{
		cfg:             cfg,
		authHandler:     authHandler,
		campaignHandler: campaignHandler,
		adHandler:       adHandler,
		metricsHandler:  metricsHandler,
		uploadHandler:   uploadHandler,
		wsHub:           wsHub,
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
		public.POST("/auth/refresh", s.authHandler.Refresh)
	}

	// Protected routes
	api := r.Group("/api/v1")
	api.Use(middleware.Auth(s.cfg.JWTSecret))

	// Campaigns
	if s.campaignHandler != nil {
		api.POST("/campaigns", s.campaignHandler.Create)
		api.GET("/campaigns", s.campaignHandler.List)
		api.GET("/campaigns/:id", s.campaignHandler.GetByID)
		api.PATCH("/campaigns/:id/status", s.campaignHandler.UpdateStatus)
		api.DELETE("/campaigns/:id", s.campaignHandler.Delete)
	}

	// Ads
	if s.adHandler != nil {
		api.POST("/campaigns/:id/ads", s.adHandler.Create)
		api.GET("/campaigns/:id/ads", s.adHandler.ListByCampaign)
		api.GET("/ads/:id", s.adHandler.GetByID)
		api.PATCH("/ads/:id", s.adHandler.Update)
		api.DELETE("/ads/:id", s.adHandler.Delete)
	}

	// Metrics & Dashboard
	if s.metricsHandler != nil {
		api.GET("/dashboard/overview", s.metricsHandler.GetDashboardOverview)
		api.GET("/metrics", s.metricsHandler.GetMetrics)
		api.POST("/events/track", s.metricsHandler.TrackEvent)
	}

	// File upload
	if s.uploadHandler != nil {
		api.POST("/upload", s.uploadHandler.Upload)
		api.POST("/upload/multiple", s.uploadHandler.UploadMultiple)
	}

	// WebSocket (real-time metrics)
	if s.wsHub != nil {
		r.GET("/ws/metrics", s.wsHub.HandleWebSocket)
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
