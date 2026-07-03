package repository

import (
	"context"

	"adtech/internal/domain"
	"adtech/internal/dto"
)

type CampaignRepository interface {
	Create(ctx context.Context, campaign *domain.Campaign) (*domain.Campaign, error)
	GetByID(ctx context.Context, id int64) (*domain.Campaign, error)
	List(ctx context.Context, userID int64, isAdmin bool, filter dto.CampaignFilter) ([]*domain.Campaign, error)
	Count(ctx context.Context, userID int64, isAdmin bool, filter dto.CampaignFilter) (int64, error)
	Update(ctx context.Context, campaign *domain.Campaign) (*domain.Campaign, error)
	UpdateStatus(ctx context.Context, id int64, status string) error
	SoftDelete(ctx context.Context, id int64) error
}
