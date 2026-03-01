package handler

import (
	"net/http"
	"strconv"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/repository"

	"github.com/gin-gonic/gin"
)

type AdHandler struct {
	adRepo repository.AdRepository
}

func NewAdHandler(adRepo repository.AdRepository) *AdHandler {
	return &AdHandler{adRepo: adRepo}
}

func (h *AdHandler) Create(c *gin.Context) {
	campaignID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	var req dto.CreateAdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	ad := &domain.Ad{
		CampaignID:  campaignID,
		Title:       req.Title,
		Description: req.Description,
		Type:        domain.AdType(req.Type),
		Destination: req.Destination,
		ImageURL:    req.ImageURL,
		Status:      "draft",
	}

	created, err := h.adRepo.Create(c.Request.Context(), ad)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusCreated, created)
}

func (h *AdHandler) ListByCampaign(c *gin.Context) {
	campaignID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	ads, err := h.adRepo.ListByCampaign(c.Request.Context(), campaignID)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, ads)
}

func (h *AdHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	ad, err := h.adRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		NotFoundError(c, "ad")
		return
	}

	SuccessResponse(c, http.StatusOK, ad)
}

func (h *AdHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	existing, err := h.adRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		NotFoundError(c, "ad")
		return
	}

	var req dto.UpdateAdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Description != nil {
		existing.Description = *req.Description
	}
	if req.Type != nil {
		existing.Type = domain.AdType(*req.Type)
	}
	if req.Destination != nil {
		existing.Destination = *req.Destination
	}
	if req.ImageURL != nil {
		existing.ImageURL = *req.ImageURL
	}
	if req.Status != nil {
		existing.Status = *req.Status
	}

	updated, err := h.adRepo.Update(c.Request.Context(), existing)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, updated)
}

func (h *AdHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	if err := h.adRepo.SoftDelete(c.Request.Context(), id); err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, gin.H{"message": "ad deleted"})
}
