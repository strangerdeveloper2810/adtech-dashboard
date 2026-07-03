package dto

type CreateAdRequest struct {
	Title       string `json:"title" binding:"required,min=3,max=255"`
	Description string `json:"description"`
	Type        string `json:"type" binding:"required,oneof=banner native video"`
	Destination string `json:"destination" binding:"required,url"`
	ImageURL    string `json:"imageUrl" binding:"omitempty,url"`
}

type UpdateAdRequest struct {
	Title       *string `json:"title" binding:"omitempty,min=3,max=255"`
	Description *string `json:"description"`
	Type        *string `json:"type" binding:"omitempty,oneof=banner native video"`
	Destination *string `json:"destination" binding:"omitempty,url"`
	ImageURL    *string `json:"imageUrl" binding:"omitempty,url"`
	Status      *string `json:"status" binding:"omitempty,oneof=draft active paused"`
}

type AdResponse struct {
	ID          int64  `json:"id"`
	CampaignID  int64  `json:"campaignId"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	Destination string `json:"destination"`
	ImageURL    string `json:"imageUrl"`
	Status      string `json:"status"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}
