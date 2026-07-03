package postgres

import (
	"context"
	"fmt"
	"strings"
	"time"

	"adtech/internal/domain"
	"adtech/internal/repository"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type eventRepoPg struct {
	db *pgxpool.Pool
}

func NewEventRepo(db *pgxpool.Pool) repository.EventRepository {
	return &eventRepoPg{db: db}
}

// BatchInsert inserts multiple ad events in a single multi-row INSERT statement.
// This is more efficient than inserting one row at a time.
func (r *eventRepoPg) BatchInsert(ctx context.Context, events []domain.AdEvent) error {
	if len(events) == 0 {
		return nil
	}

	// Build multi-value INSERT: INSERT INTO ad_events (...) VALUES ($1,$2,...), ($8,$9,...), ...
	const cols = 7 // ad_id, campaign_id, type, country, device, cost, created_at
	valueGroups := make([]string, 0, len(events))
	args := make([]any, 0, len(events)*cols)

	for i, e := range events {
		base := i * cols
		valueGroups = append(valueGroups, fmt.Sprintf(
			"($%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			base+1, base+2, base+3, base+4, base+5, base+6, base+7,
		))
		args = append(args,
			e.AdID,
			e.CampaignID,
			string(e.Type),
			e.Country,
			e.Device,
			e.Cost,
			e.CreatedAt,
		)
	}

	query := fmt.Sprintf(`
		INSERT INTO ad_events (ad_id, campaign_id, type, country, device, cost, created_at)
		VALUES %s`, strings.Join(valueGroups, ", "))

	_, err := r.db.Exec(ctx, query, args...)
	return err
}

// GetMetrics aggregates ad_events for a given campaign within a time range.
// Granularity: hourly, daily, weekly, monthly, yearly.
func (r *eventRepoPg) GetMetrics(ctx context.Context, campaignID int64, from, to time.Time, granularity string) ([]*domain.CampaignMetrics, error) {
	// Map granularity to PostgreSQL date_trunc interval
	trunc := "day"
	switch granularity {
	case "hourly":
		trunc = "hour"
	case "weekly":
		trunc = "week"
	case "monthly":
		trunc = "month"
	case "yearly":
		trunc = "year"
	}

	query := fmt.Sprintf(`
		SELECT
			campaign_id,
			date_trunc('%s', created_at) AS period,
			COUNT(*) FILTER (WHERE type = 'impression') AS impressions,
			COUNT(*) FILTER (WHERE type = 'click')      AS clicks,
			COUNT(*) FILTER (WHERE type = 'conversion')  AS conversions,
			COALESCE(SUM(cost), 0)                        AS spend
		FROM ad_events
		WHERE campaign_id = $1
		  AND created_at >= $2
		  AND created_at < $3
		GROUP BY campaign_id, date_trunc('%s', created_at)
		ORDER BY period ASC`, trunc, trunc)

	rows, err := r.db.Query(ctx, query, campaignID, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var metrics []*domain.CampaignMetrics
	for rows.Next() {
		var m domain.CampaignMetrics
		if err := rows.Scan(
			&m.CampaignID,
			&m.Period,
			&m.Impressions,
			&m.Clicks,
			&m.Conversions,
			&m.Spend,
		); err != nil {
			return nil, err
		}
		metrics = append(metrics, &m)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return metrics, nil
}

// GetDashboardOverview returns an aggregate summary across all campaigns.
// Non-admin users only see stats for their own campaigns.
func (r *eventRepoPg) GetDashboardOverview(ctx context.Context, userID int64, isAdmin bool) (*domain.DashboardOverview, error) {
	// Step 1: Get campaign counts
	var campaignArgs []any
	argIdx := 1

	campaignWhere := "deleted_at IS NULL"
	if !isAdmin {
		campaignWhere += fmt.Sprintf(" AND user_id = $%d", argIdx)
		campaignArgs = append(campaignArgs, userID)
		argIdx++
	}

	campaignQuery := fmt.Sprintf(`
		SELECT
			COUNT(*)                                      AS total_campaigns,
			COUNT(*) FILTER (WHERE status = 'active')     AS active_campaigns
		FROM campaigns
		WHERE %s`, campaignWhere)

	overview := &domain.DashboardOverview{}
	overview.TrafficByDevice = []domain.DeviceBreakdown{}
	overview.TrafficByCountry = []domain.CountryBreakdown{}
	err := r.db.QueryRow(ctx, campaignQuery, campaignArgs...).Scan(
		&overview.TotalCampaigns,
		&overview.ActiveCampaigns,
	)
	if err != nil {
		return nil, err
	}

	// Step 2: Get event aggregates by joining ad_events with campaigns
	var eventArgs []any
	eventArgIdx := 1

	eventWhere := "c.deleted_at IS NULL"
	if !isAdmin {
		eventWhere += fmt.Sprintf(" AND c.user_id = $%d", eventArgIdx)
		eventArgs = append(eventArgs, userID)
		eventArgIdx++
		_ = eventArgIdx // suppress unused warning
	}

	eventQuery := fmt.Sprintf(`
		SELECT
			COUNT(*)                                        AS total_events,
			COUNT(*) FILTER (WHERE e.type = 'impression') AS total_impressions,
			COUNT(*) FILTER (WHERE e.type = 'click')      AS total_clicks,
			COALESCE(SUM(e.cost), 0)                       AS total_spend
		FROM ad_events e
		INNER JOIN campaigns c ON c.id = e.campaign_id
		WHERE %s`, eventWhere)

	// Use pgx.NullFloat64-like scanning — COALESCE ensures no NULL for spend
	err = r.db.QueryRow(ctx, eventQuery, eventArgs...).Scan(
		&overview.TotalEvents,
		&overview.TotalImpressions,
		&overview.TotalClicks,
		&overview.TotalSpend,
	)
	if err != nil {
		// If no events exist, pgx returns pgx.ErrNoRows — treat as zero values
		if err == pgx.ErrNoRows {
			return overview, nil
		}
		return nil, err
	}

	// Step 3: Traffic by device
	deviceQuery := fmt.Sprintf(`
		SELECT e.device, COUNT(*) AS count
		FROM ad_events e
		INNER JOIN campaigns c ON c.id = e.campaign_id
		WHERE %s AND e.device IS NOT NULL AND e.device != ''
		GROUP BY e.device
		ORDER BY count DESC`, eventWhere)

	deviceRows, err := r.db.Query(ctx, deviceQuery, eventArgs...)
	if err != nil {
		return nil, err
	}
	defer deviceRows.Close()

	for deviceRows.Next() {
		var d domain.DeviceBreakdown
		if err := deviceRows.Scan(&d.Device, &d.Count); err != nil {
			return nil, err
		}
		overview.TrafficByDevice = append(overview.TrafficByDevice, d)
	}

	// Step 4: Traffic by country (top 10)
	countryQuery := fmt.Sprintf(`
		SELECT e.country, COUNT(*) AS count
		FROM ad_events e
		INNER JOIN campaigns c ON c.id = e.campaign_id
		WHERE %s AND e.country IS NOT NULL AND e.country != ''
		GROUP BY e.country
		ORDER BY count DESC
		LIMIT 10`, eventWhere)

	countryRows, err := r.db.Query(ctx, countryQuery, eventArgs...)
	if err != nil {
		return nil, err
	}
	defer countryRows.Close()

	for countryRows.Next() {
		var cb domain.CountryBreakdown
		if err := countryRows.Scan(&cb.Country, &cb.Count); err != nil {
			return nil, err
		}
		overview.TrafficByCountry = append(overview.TrafficByCountry, cb)
	}

	return overview, nil
}
