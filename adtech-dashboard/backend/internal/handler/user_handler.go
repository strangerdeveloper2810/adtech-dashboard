package handler

import (
	"net/http"
	"strconv"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/repository"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userRepo repository.UserRepository
}

func NewUserHandler(userRepo repository.UserRepository) *UserHandler {
	return &UserHandler{userRepo: userRepo}
}

// GET /users?page=1&limit=20
func (h *UserHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	users, total, err := h.userRepo.List(c.Request.Context(), page, limit)
	if err != nil {
		InternalError(c)
		return
	}

	resp := make([]dto.UserResponse, 0, len(users))
	for _, u := range users {
		resp = append(resp, toUserResponse(u))
	}

	SuccessWithMeta(c, resp, gin.H{
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

// GET /users/:id
func (h *UserHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	user, err := h.userRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		NotFoundError(c, "user")
		return
	}

	SuccessResponse(c, http.StatusOK, toUserResponse(user))
}

// PATCH /users/:id/role
func (h *UserHandler) UpdateRole(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		ValidationError(c, err)
		return
	}

	var req dto.UpdateUserRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	// Prevent admin from changing their own role
	callerID := c.GetInt64("userID")
	if callerID == id {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_OPERATION", "cannot change your own role")
		return
	}

	if err := h.userRepo.UpdateRole(c.Request.Context(), id, req.Role); err != nil {
		NotFoundError(c, "user")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func toUserResponse(u *domain.User) dto.UserResponse {
	return dto.UserResponse{
		ID:    u.ID,
		Email: u.Email,
		Name:  u.Name,
		Role:  string(u.Role),
	}
}
