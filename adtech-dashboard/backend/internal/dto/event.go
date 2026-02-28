package dto

type AdEventRequest struct {
	AdID       int64   `json:"adId" binding:"required"`
	CampaignID int64   `json:"campaignId" binding:"required"`
	Type       string  `json:"type" binding:"required,oneof=impression click conversion"`
	Country    string  `json:"country" binding:"omitempty,len=2"`
	Device     string  `json:"device" binding:"omitempty,oneof=mobile desktop tablet"`
	Cost       float64 `json:"cost" binding:"min=0"`
}
