package dto

type MetricsFilter struct {
	CampaignID  int64  `form:"campaignId" binding:"required"`
	From        string `form:"from" binding:"required"`
	To          string `form:"to" binding:"required"`
	Granularity string `form:"granularity,default=daily" binding:"oneof=hourly daily weekly"`
}

type MetricsResponse struct {
	Period      string  `json:"period"`
	Impressions int64   `json:"impressions"`
	Clicks      int64   `json:"clicks"`
	Conversions int64   `json:"conversions"`
	Spend       float64 `json:"spend"`
	CTR         float64 `json:"ctr"`
	CPC         float64 `json:"cpc"`
}

type DashboardOverview struct {
	TotalCampaigns   int64              `json:"totalCampaigns"`
	ActiveCampaigns  int64              `json:"activeCampaigns"`
	TotalImpressions int64              `json:"totalImpressions"`
	TotalClicks      int64              `json:"totalClicks"`
	TotalSpend       float64            `json:"totalSpend"`
	AverageCTR       float64            `json:"averageCtr"`
	TrafficByDevice  []DeviceBreakdown  `json:"trafficByDevice"`
	TrafficByCountry []CountryBreakdown `json:"trafficByCountry"`
}

type DeviceBreakdown struct {
	Device string `json:"device"`
	Count  int64  `json:"count"`
}

type CountryBreakdown struct {
	Country string `json:"country"`
	Count   int64  `json:"count"`
}

type PaginatedResponse[T any] struct {
	Data []T  `json:"data"`
	Meta Meta `json:"meta"`
}

type Meta struct {
	Total      int64 `json:"total"`
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	TotalPages int64 `json:"totalPages"`
}
