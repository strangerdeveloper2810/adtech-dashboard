package dto

import "adtech/internal/domain"

type UpdateUserRoleRequest struct {
	Role domain.Role `json:"role" binding:"required,oneof=admin advertiser viewer"`
}

