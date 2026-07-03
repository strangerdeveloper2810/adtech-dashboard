package repository

import (
	"context"
	"time"

	"adtech/internal/domain"
)

type EventRepository interface {
	BatchInsert(ctx context.Context, events []domain.AdEvent) error
	GetMetrics(ctx context.Context, campaignID int64, from, to time.Time, granularity string) ([]*domain.CampaignMetrics, error)
	GetDashboardOverview(ctx context.Context, userID int64, isAdmin bool) (*domain.DashboardOverview, error)
}
