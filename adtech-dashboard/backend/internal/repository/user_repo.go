package repository

import (
	"context"

	"adtech/internal/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	GetByID(ctx context.Context, id int64) (*domain.User, error)
	List(ctx context.Context, page, limit int) ([]*domain.User, int64, error)
	UpdateRole(ctx context.Context, id int64, role domain.Role) error
}
