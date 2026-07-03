package repository

import (
	"context"

	"adtech/internal/domain"
)

type AdRepository interface {
	Create(ctx context.Context, ad *domain.Ad) (*domain.Ad, error)
	GetByID(ctx context.Context, id int64) (*domain.Ad, error)
	ListByCampaign(ctx context.Context, campaignID int64) ([]*domain.Ad, error)
	Update(ctx context.Context, ad *domain.Ad) (*domain.Ad, error)
	SoftDelete(ctx context.Context, id int64) error
}
