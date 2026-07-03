package handler

import (
	"net/http"

	"adtech/internal/dto"
	"adtech/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	resp, err := h.authService.Register(c.Request.Context(), req)
	if err != nil {
		ErrorResponse(c, http.StatusConflict, "CONFLICT", err.Error())
		return
	}

	SuccessResponse(c, http.StatusCreated, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	resp, err := h.authService.Login(c.Request.Context(), req)
	if err != nil {
		UnauthorizedError(c, "invalid email or password")
		return
	}

	SuccessResponse(c, http.StatusOK, resp)
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req dto.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationError(c, err)
		return
	}

	resp, err := h.authService.Refresh(c.Request.Context(), req.RefreshToken)
	if err != nil {
		UnauthorizedError(c, "invalid or expired refresh token")
		return
	}

	SuccessResponse(c, http.StatusOK, resp)
}
