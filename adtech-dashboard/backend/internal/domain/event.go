package domain

import "time"

type EventType string

const (
	EventImpression EventType = "impression"
	EventClick      EventType = "click"
	EventConversion EventType = "conversion"
)

type AdEvent struct {
	ID         int64     `json:"id"`
	AdID       int64     `json:"adId"`
	CampaignID int64     `json:"campaignId"`
	Type       EventType `json:"type"`
	Country    string    `json:"country"`
	Device     string    `json:"device"`
	Cost       float64   `json:"cost"`
	CreatedAt  time.Time `json:"createdAt"`
}

type CampaignMetrics struct {
	CampaignID  int64     `json:"campaignId"`
	Period      time.Time `json:"period"`
	Impressions int64     `json:"impressions"`
	Clicks      int64     `json:"clicks"`
	Conversions int64     `json:"conversions"`
	Spend       float64   `json:"spend"`
}

type DashboardOverview struct {
	TotalCampaigns   int64
	ActiveCampaigns  int64
	TotalEvents      int64
	TotalImpressions int64
	TotalClicks      int64
	TotalSpend       float64
	TrafficByDevice  []DeviceBreakdown
	TrafficByCountry []CountryBreakdown
}

type DeviceBreakdown struct {
	Device string
	Count  int64
}

type CountryBreakdown struct {
	Country string
	Count   int64
}
