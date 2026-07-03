package domain

import "time"

type Role string

const (
	RoleAdmin      Role = "admin"
	RoleAdvertiser Role = "advertiser"
	RoleViewer     Role = "viewer"
)

type User struct {
	ID        int64      `json:"id"`
	Email     string     `json:"email"`
	Password  string     `json:"-"`
	Name      string     `json:"name"`
	Role      Role       `json:"role"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"-"`
}
