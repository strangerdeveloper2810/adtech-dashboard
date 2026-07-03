package handler

import (
	"fmt"
	"net/http"
	"time"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/repository"
	"adtech/internal/worker"

	"github.com/gin-gonic/gin"
)

type MetricsHandler struct {
	eventRepo repository.EventRepository
	pool      *worker.Pool
}

func NewMetricsHandler(eventRepo repository.EventRepository, pool *worker.Pool) *MetricsHandler {
	return &MetricsHandler{eventRepo: eventRepo, pool: pool}
}

// GetDashboardOverview returns aggregated dashboard stats.
// GET /dashboard/overview
func (h *MetricsHandler) GetDashboardOverview(c *gin.Context) {
	userID := c.GetInt64("userID")
	role := c.GetString("role")
	isAdmin := role == "admin"

	overview, err := h.eventRepo.GetDashboardOverview(c.Request.Context(), userID, isAdmin)
	if err != nil {
		InternalError(c)
		return
	}

	var averageCTR float64
	if overview.TotalImpressions > 0 {
		averageCTR = float64(overview.TotalClicks) / float64(overview.TotalImpressions) * 100
	}

	resp := dto.DashboardOverview{
		TotalCampaigns:   overview.TotalCampaigns,
		ActiveCampaigns:  overview.ActiveCampaigns,
		TotalEvents:      overview.TotalEvents,
		TotalImpressions: overview.TotalImpressions,
		TotalClicks:      overview.TotalClicks,
		TotalSpend:       overview.TotalSpend,
		AverageCTR:       averageCTR,
		TrafficByDevice:  mapDeviceBreakdowns(overview.TrafficByDevice),
		TrafficByCountry: mapCountryBreakdowns(overview.TrafficByCountry),
	}

	SuccessResponse(c, http.StatusOK, resp)
}

// GetMetrics returns time-series metrics for a campaign.
// GET /metrics
func (h *MetricsHandler) GetMetrics(c *gin.Context) {
	var filter dto.MetricsFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		ValidationError(c, err)
		return
	}

	from, err := time.Parse("2006-01-02", filter.From)
	if err != nil {
		ValidationError(c, fmt.Errorf("invalid 'from' date format, expected YYYY-MM-DD"))
		return
	}

	to, err := time.Parse("2006-01-02", filter.To)
	if err != nil {
		ValidationError(c, fmt.Errorf("invalid 'to' date format, expected YYYY-MM-DD"))
		return
	}

	metrics, err := h.eventRepo.GetMetrics(c.Request.Context(), filter.CampaignID, from, to, filter.Granularity)
	if err != nil {
		InternalError(c)
		return
	}

	// Format period based on granularity
	periodFormat := "2006-01-02"
	switch filter.Granularity {
	case "hourly":
		periodFormat = "2006-01-02 15:00"
	case "monthly":
		periodFormat = "2006-01"
	case "yearly":
		periodFormat = "2006"
	}

	results := make([]dto.MetricsResponse, 0, len(metrics))
	for _, m := range metrics {
		var ctr, cpc float64
		if m.Impressions > 0 {
			ctr = float64(m.Clicks) / float64(m.Impressions) * 100
		}
		if m.Clicks > 0 {
			cpc = m.Spend / float64(m.Clicks)
		}

		results = append(results, dto.MetricsResponse{
			Period:      m.Period.Format(periodFormat),
			Impressions: m.Impressions,
			Clicks:      m.Clicks,
			Conversions: m.Conversions,
			Spend:       m.Spend,
			CTR:         ctr,
			CPC:         cpc,
		})
	}

	SuccessResponse(c, http.StatusOK, results)
}

// TrackEvent ingests a batch of ad events.
// POST /events/track
func (h *MetricsHandler) TrackEvent(c *gin.Context) {
	var req []dto.AdEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	events := make([]domain.AdEvent, 0, len(req))
	for _, r := range req {
		events = append(events, domain.AdEvent{
			AdID:       r.AdID,
			CampaignID: r.CampaignID,
			Type:       domain.EventType(r.Type),
			Country:    r.Country,
			Device:     r.Device,
			Cost:       r.Cost,
		})
	}

	h.pool.Submit(worker.EventJob{Events: events})

	SuccessResponse(c, http.StatusCreated, gin.H{"message": "events tracked"})
}

func mapDeviceBreakdowns(devices []domain.DeviceBreakdown) []dto.DeviceBreakdown {
	result := make([]dto.DeviceBreakdown, len(devices))
	for i, d := range devices {
		result[i] = dto.DeviceBreakdown{Device: d.Device, Count: d.Count}
	}
	return result
}

func mapCountryBreakdowns(countries []domain.CountryBreakdown) []dto.CountryBreakdown {
	result := make([]dto.CountryBreakdown, len(countries))
	for i, c := range countries {
		result[i] = dto.CountryBreakdown{Country: c.Country, Count: c.Count}
	}
	return result
}
