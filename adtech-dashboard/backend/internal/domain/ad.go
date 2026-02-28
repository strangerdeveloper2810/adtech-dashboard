package domain

import "time"

type AdType string

const (
	AdBanner AdType = "banner"
	AdNative AdType = "native"
	AdVideo  AdType = "video"
)

type Ad struct {
	ID          int64      `json:"id"`
	CampaignID  int64      `json:"campaignId"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Type        AdType     `json:"type"`
	Destination string     `json:"destination"`
	ImageURL    string     `json:"imageUrl"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"-"`
}
