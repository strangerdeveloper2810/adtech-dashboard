package postgres

import (
	"context"

	"adtech/internal/domain"
	"adtech/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
)

type userRepoPg struct {
	db *pgxpool.Pool
}

func NewUserRepo(db *pgxpool.Pool) repository.UserRepository {
	return &userRepoPg{db: db}
}

func (r *userRepoPg) Create(ctx context.Context, user *domain.User) (*domain.User, error) {
	query := `
		INSERT INTO users (email, password, name, role)
		VALUES ($1, $2, $3, $4)
		RETURNING id, email, password, name, role, created_at, updated_at`

	row := r.db.QueryRow(ctx, query, user.Email, user.Password, user.Name, user.Role)

	var u domain.User
	err := row.Scan(&u.ID, &u.Email, &u.Password, &u.Name, &u.Role, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepoPg) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `SELECT id, email, password, name, role, created_at, updated_at
	           FROM users WHERE email = $1 AND deleted_at IS NULL`

	var u domain.User
	err := r.db.QueryRow(ctx, query, email).Scan(
		&u.ID, &u.Email, &u.Password, &u.Name, &u.Role, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepoPg) GetByID(ctx context.Context, id int64) (*domain.User, error) {
	query := `SELECT id, email, password, name, role, created_at, updated_at
	           FROM users WHERE id = $1 AND deleted_at IS NULL`

	var u domain.User
	err := r.db.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.Email, &u.Password, &u.Name, &u.Role, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepoPg) List(ctx context.Context, page, limit int) ([]*domain.User, int64, error) {
	offset := (page - 1) * limit

	query := `SELECT id, email, name, role, created_at, updated_at
	           FROM users WHERE deleted_at IS NULL
	           ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		var u domain.User
		if err := rows.Scan(&u.ID, &u.Email, &u.Name, &u.Role, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, 0, err
		}
		users = append(users, &u)
	}

	var total int64
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE deleted_at IS NULL`).Scan(&total)

	return users, total, nil
}

func (r *userRepoPg) UpdateRole(ctx context.Context, id int64, role domain.Role) error {
	query := `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL`
	_, err := r.db.Exec(ctx, query, role, id)
	return err
}
