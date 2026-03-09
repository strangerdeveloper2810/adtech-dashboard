package handler

import (
	"net/http"
	"strconv"
	"time"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/repository"

	"github.com/gin-gonic/gin"
)

type CampaignHandler struct {
	campaignRepo repository.CampaignRepository
}

func NewCampaignHandler(campaignRepo repository.CampaignRepository) *CampaignHandler {
	return &CampaignHandler{campaignRepo: campaignRepo}
}

func (h *CampaignHandler) Create(c *gin.Context) {
	var req dto.CreateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		ValidationError(c, err)
		return
	}
	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		ValidationError(c, err)
		return
	}

	if endDate.Before(startDate) {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "end date must be after start date")
		return
	}

	userID := c.GetInt64("userID")

	campaign := &domain.Campaign{
		UserID:      userID,
		Name:        req.Name,
		Description: req.Description,
		Status:      domain.CampaignDraft,
		Budget:      req.Budget,
		DailyBudget: req.DailyBudget,
		Spent:       0,
		StartDate:   startDate,
		EndDate:     endDate,
		Targeting:   req.Targeting,
	}

	created, err := h.campaignRepo.Create(c.Request.Context(), campaign)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusCreated, created)
}

func (h *CampaignHandler) List(c *gin.Context) {
	var filter dto.CampaignFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		ValidationError(c, err)
		return
	}

	userID := c.GetInt64("userID")
	role := c.GetString("role")
	isAdmin := role == "admin"

	campaigns, err := h.campaignRepo.List(c.Request.Context(), userID, isAdmin, filter)
	if err != nil {
		InternalError(c)
		return
	}

	total, _ := h.campaignRepo.Count(c.Request.Context(), userID, isAdmin, filter)
	totalPages := (total + int64(filter.Limit) - 1) / int64(filter.Limit)

	SuccessWithMeta(c, campaigns, dto.Meta{
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	})
}

func (h *CampaignHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	campaign, err := h.campaignRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		NotFoundError(c, "campaign")
		return
	}

	SuccessResponse(c, http.StatusOK, campaign)
}

func (h *CampaignHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	var req dto.UpdateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	// Get existing campaign
	campaign, err := h.campaignRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		NotFoundError(c, "campaign")
		return
	}

	// Update fields if provided
	if req.Name != nil {
		campaign.Name = *req.Name
	}
	if req.Description != nil {
		campaign.Description = *req.Description
	}
	if req.Budget != nil {
		campaign.Budget = *req.Budget
	}
	if req.DailyBudget != nil {
		campaign.DailyBudget = req.DailyBudget
	}
	if req.StartDate != nil {
		startDate, err := time.Parse("2006-01-02", *req.StartDate)
		if err != nil {
			ValidationError(c, err)
			return
		}
		campaign.StartDate = startDate
	}
	if req.EndDate != nil {
		endDate, err := time.Parse("2006-01-02", *req.EndDate)
		if err != nil {
			ValidationError(c, err)
			return
		}
		campaign.EndDate = endDate
	}
	if req.Targeting != nil {
		campaign.Targeting = *req.Targeting
	}

	// Validate dates
	if campaign.EndDate.Before(campaign.StartDate) {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "end date must be after start date")
		return
	}

	updated, err := h.campaignRepo.Update(c.Request.Context(), campaign)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, updated)
}

func (h *CampaignHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	var req dto.UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	if err := h.campaignRepo.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, gin.H{"message": "status updated"})
}

func (h *CampaignHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	if err := h.campaignRepo.SoftDelete(c.Request.Context(), id); err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, gin.H{"message": "campaign deleted"})
}
