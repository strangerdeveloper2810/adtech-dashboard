package dto

import "encoding/json"

type CreateCampaignRequest struct {
	Name        string          `json:"name" binding:"required,min=3,max=255"`
	Description string          `json:"description"`
	Budget      float64         `json:"budget" binding:"required,gt=0"`
	DailyBudget *float64        `json:"dailyBudget" binding:"omitempty,gt=0"`
	StartDate   string          `json:"startDate" binding:"required"`
	EndDate     string          `json:"endDate" binding:"required"`
	Targeting   json.RawMessage `json:"targeting"`
}

type UpdateCampaignRequest struct {
	Name        *string          `json:"name" binding:"omitempty,min=3,max=255"`
	Description *string          `json:"description"`
	Budget      *float64         `json:"budget" binding:"omitempty,gt=0"`
	DailyBudget *float64         `json:"dailyBudget" binding:"omitempty,gt=0"`
	StartDate   *string          `json:"startDate"`
	EndDate     *string          `json:"endDate"`
	Targeting   *json.RawMessage `json:"targeting"`
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=draft active paused completed archived"`
}

type CampaignFilter struct {
	Status string `form:"status"`
	Search string `form:"search"`
	Sort   string `form:"sort" binding:"omitempty,oneof=newest spend ctr name"`
	Page   int    `form:"page,default=1" binding:"min=1"`
	Limit  int    `form:"limit,default=10" binding:"min=1,max=100"`
}

type CampaignResponse struct {
	ID               int64           `json:"id"`
	UserID           int64           `json:"userId"`
	Name             string          `json:"name"`
	Description      string          `json:"description"`
	Status           string          `json:"status"`
	Budget           float64         `json:"budget"`
	DailyBudget      *float64        `json:"dailyBudget"`
	Spent            float64         `json:"spent"`
	StartDate        string          `json:"startDate"`
	EndDate          string          `json:"endDate"`
	Targeting        json.RawMessage `json:"targeting"`
	TotalImpressions int64           `json:"totalImpressions"`
	TotalClicks      int64           `json:"totalClicks"`
	TotalSpend       float64         `json:"totalSpend"`
	CTR              float64         `json:"ctr"`
	CreatedAt        string          `json:"createdAt"`
	UpdatedAt        string          `json:"updatedAt"`
}
