package postgres

import (
	"context"
	"fmt"
	"strings"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
)

type campaignRepoPg struct {
	db *pgxpool.Pool
}

func NewCampaignRepo(db *pgxpool.Pool) repository.CampaignRepository {
	return &campaignRepoPg{db: db}
}

func (r *campaignRepoPg) Create(ctx context.Context, campaign *domain.Campaign) (*domain.Campaign, error) {
	query := `
		INSERT INTO campaigns (user_id, name, description, status, budget, daily_budget, spent, start_date, end_date, targeting)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, user_id, name, description, status, budget, daily_budget, spent, start_date, end_date, targeting, created_at, updated_at`

	var c domain.Campaign
	err := r.db.QueryRow(ctx, query,
		campaign.UserID, campaign.Name, campaign.Description, campaign.Status,
		campaign.Budget, campaign.DailyBudget, campaign.Spent,
		campaign.StartDate, campaign.EndDate, campaign.Targeting,
	).Scan(
		&c.ID, &c.UserID, &c.Name, &c.Description, &c.Status,
		&c.Budget, &c.DailyBudget, &c.Spent,
		&c.StartDate, &c.EndDate, &c.Targeting,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *campaignRepoPg) GetByID(ctx context.Context, id int64) (*domain.Campaign, error) {
	query := `
		SELECT id, user_id, name, description, status, budget, daily_budget, spent,
		       start_date, end_date, targeting, created_at, updated_at
		FROM campaigns
		WHERE id = $1 AND deleted_at IS NULL`

	var c domain.Campaign
	err := r.db.QueryRow(ctx, query, id).Scan(
		&c.ID, &c.UserID, &c.Name, &c.Description, &c.Status,
		&c.Budget, &c.DailyBudget, &c.Spent,
		&c.StartDate, &c.EndDate, &c.Targeting,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *campaignRepoPg) List(ctx context.Context, userID int64, isAdmin bool, filter dto.CampaignFilter) ([]*domain.Campaign, error) {
	var conditions []string
	var args []any
	argIdx := 1

	conditions = append(conditions, "deleted_at IS NULL")

	// RBAC: non-admin only see own campaigns
	if !isAdmin {
		conditions = append(conditions, fmt.Sprintf("user_id = $%d", argIdx))
		args = append(args, userID)
		argIdx++
	}

	// Status filter
	if filter.Status != "" {
		conditions = append(conditions, fmt.Sprintf("status = $%d", argIdx))
		args = append(args, filter.Status)
		argIdx++
	}

	// Search filter (name or description)
	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR description ILIKE $%d)", argIdx, argIdx))
		args = append(args, "%"+filter.Search+"%")
		argIdx++
	}

	where := strings.Join(conditions, " AND ")

	// Sort
	orderBy := "created_at DESC"
	switch filter.Sort {
	case "name":
		orderBy = "name ASC"
	case "spend":
		orderBy = "spent DESC"
	case "newest":
		orderBy = "created_at DESC"
	}

	// Pagination
	offset := (filter.Page - 1) * filter.Limit
	query := fmt.Sprintf(`
		SELECT id, user_id, name, description, status, budget, daily_budget, spent,
		       start_date, end_date, targeting, created_at, updated_at
		FROM campaigns
		WHERE %s
		ORDER BY %s
		LIMIT $%d OFFSET $%d`,
		where, orderBy, argIdx, argIdx+1,
	)
	args = append(args, filter.Limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var campaigns []*domain.Campaign
	for rows.Next() {
		var c domain.Campaign
		if err := rows.Scan(
			&c.ID, &c.UserID, &c.Name, &c.Description, &c.Status,
			&c.Budget, &c.DailyBudget, &c.Spent,
			&c.StartDate, &c.EndDate, &c.Targeting,
			&c.CreatedAt, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		campaigns = append(campaigns, &c)
	}
	return campaigns, nil
}

func (r *campaignRepoPg) Count(ctx context.Context, userID int64, isAdmin bool, filter dto.CampaignFilter) (int64, error) {
	var conditions []string
	var args []any
	argIdx := 1

	conditions = append(conditions, "deleted_at IS NULL")

	if !isAdmin {
		conditions = append(conditions, fmt.Sprintf("user_id = $%d", argIdx))
		args = append(args, userID)
		argIdx++
	}

	if filter.Status != "" {
		conditions = append(conditions, fmt.Sprintf("status = $%d", argIdx))
		args = append(args, filter.Status)
		argIdx++
	}

	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR description ILIKE $%d)", argIdx, argIdx))
		args = append(args, "%"+filter.Search+"%")
		argIdx++
	}

	where := strings.Join(conditions, " AND ")
	query := fmt.Sprintf("SELECT COUNT(*) FROM campaigns WHERE %s", where)

	var total int64
	err := r.db.QueryRow(ctx, query, args...).Scan(&total)
	return total, err
}

func (r *campaignRepoPg) Update(ctx context.Context, campaign *domain.Campaign) (*domain.Campaign, error) {
	query := `
		UPDATE campaigns
		SET name = $1, description = $2, budget = $3, daily_budget = $4,
		    start_date = $5, end_date = $6, targeting = $7, updated_at = NOW()
		WHERE id = $8 AND deleted_at IS NULL
		RETURNING id, user_id, name, description, status, budget, daily_budget, spent,
		          start_date, end_date, targeting, created_at, updated_at`

	var c domain.Campaign
	err := r.db.QueryRow(ctx, query,
		campaign.Name, campaign.Description, campaign.Budget, campaign.DailyBudget,
		campaign.StartDate, campaign.EndDate, campaign.Targeting,
		campaign.ID,
	).Scan(
		&c.ID, &c.UserID, &c.Name, &c.Description, &c.Status,
		&c.Budget, &c.DailyBudget, &c.Spent,
		&c.StartDate, &c.EndDate, &c.Targeting,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *campaignRepoPg) UpdateStatus(ctx context.Context, id int64, status string) error {
	query := `UPDATE campaigns SET status = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL`
	result, err := r.db.Exec(ctx, query, status, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("campaign not found")
	}
	return nil
}

func (r *campaignRepoPg) SoftDelete(ctx context.Context, id int64) error {
	query := `UPDATE campaigns SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	result, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("campaign not found")
	}
	return nil
}
