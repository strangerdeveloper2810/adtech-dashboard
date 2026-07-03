package domain

import (
	"encoding/json"
	"time"
)

type CampaignStatus string

const (
	CampaignDraft     CampaignStatus = "draft"
	CampaignActive    CampaignStatus = "active"
	CampaignPaused    CampaignStatus = "paused"
	CampaignCompleted CampaignStatus = "completed"
	CampaignArchived  CampaignStatus = "archived"
)

type Targeting struct {
	Countries []string `json:"countries"`
	Devices   []string `json:"devices"`
	AgeRange  [2]int   `json:"age_range"`
}

type Campaign struct {
	ID          int64           `json:"id"`
	UserID      int64           `json:"userId"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Status      CampaignStatus  `json:"status"`
	Budget      float64         `json:"budget"`
	DailyBudget *float64        `json:"dailyBudget"`
	Spent       float64         `json:"spent"`
	StartDate   time.Time       `json:"startDate"`
	EndDate     time.Time       `json:"endDate"`
	Targeting   json.RawMessage `json:"targeting"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
	DeletedAt   *time.Time      `json:"-"`
}
