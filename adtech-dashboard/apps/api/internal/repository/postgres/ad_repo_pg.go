package postgres

import (
	"context"
	"fmt"

	"adtech/internal/domain"
	"adtech/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
)

type adRepoPg struct {
	db *pgxpool.Pool
}

func NewAdRepo(db *pgxpool.Pool) repository.AdRepository {
	return &adRepoPg{db: db}
}

func (r *adRepoPg) Create(ctx context.Context, ad *domain.Ad) (*domain.Ad, error) {
	query := `
		INSERT INTO ads (campaign_id, title, description, type, destination, image_url, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, campaign_id, title, description, type, destination, image_url, status, created_at, updated_at`

	var a domain.Ad
	err := r.db.QueryRow(ctx, query,
		ad.CampaignID, ad.Title, ad.Description, ad.Type,
		ad.Destination, ad.ImageURL, ad.Status,
	).Scan(
		&a.ID, &a.CampaignID, &a.Title, &a.Description, &a.Type,
		&a.Destination, &a.ImageURL, &a.Status,
		&a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *adRepoPg) GetByID(ctx context.Context, id int64) (*domain.Ad, error) {
	query := `
		SELECT id, campaign_id, title, description, type, destination, image_url, status,
		       created_at, updated_at
		FROM ads
		WHERE id = $1 AND deleted_at IS NULL`

	var a domain.Ad
	err := r.db.QueryRow(ctx, query, id).Scan(
		&a.ID, &a.CampaignID, &a.Title, &a.Description, &a.Type,
		&a.Destination, &a.ImageURL, &a.Status,
		&a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *adRepoPg) ListByCampaign(ctx context.Context, campaignID int64) ([]*domain.Ad, error) {
	query := `
		SELECT id, campaign_id, title, description, type, destination, image_url, status,
		       created_at, updated_at
		FROM ads
		WHERE campaign_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC`

	rows, err := r.db.Query(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ads []*domain.Ad
	for rows.Next() {
		var a domain.Ad
		if err := rows.Scan(
			&a.ID, &a.CampaignID, &a.Title, &a.Description, &a.Type,
			&a.Destination, &a.ImageURL, &a.Status,
			&a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			return nil, err
		}
		ads = append(ads, &a)
	}
	return ads, nil
}

func (r *adRepoPg) Update(ctx context.Context, ad *domain.Ad) (*domain.Ad, error) {
	query := `
		UPDATE ads
		SET title = $1, description = $2, type = $3, destination = $4,
		    image_url = $5, status = $6, updated_at = NOW()
		WHERE id = $7 AND deleted_at IS NULL
		RETURNING id, campaign_id, title, description, type, destination, image_url, status,
		          created_at, updated_at`

	var a domain.Ad
	err := r.db.QueryRow(ctx, query,
		ad.Title, ad.Description, ad.Type, ad.Destination,
		ad.ImageURL, ad.Status,
		ad.ID,
	).Scan(
		&a.ID, &a.CampaignID, &a.Title, &a.Description, &a.Type,
		&a.Destination, &a.ImageURL, &a.Status,
		&a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *adRepoPg) SoftDelete(ctx context.Context, id int64) error {
	query := `UPDATE ads SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	result, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("ad not found")
	}
	return nil
}
