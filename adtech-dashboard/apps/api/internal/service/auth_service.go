package service

import (
	"context"
	"fmt"
	"time"

	"adtech/internal/domain"
	"adtech/internal/dto"
	"adtech/internal/handler/middleware"
	"adtech/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  repository.UserRepository
	jwtSecret string
	rdb       *redis.Client
}

func NewAuthService(userRepo repository.UserRepository, jwtSecret string, rdb *redis.Client) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSecret: jwtSecret, rdb: rdb}
}

func (s *AuthService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
		Role:     domain.RoleAdvertiser,
	}

	created, err := s.userRepo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return s.generateAuthResponse(created)
}

func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, domain.ErrUnauthorized
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, domain.ErrUnauthorized
	}

	return s.generateAuthResponse(user)
}

func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
	// Parse and validate the refresh token
	token, err := jwt.ParseWithClaims(refreshToken, &middleware.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, domain.ErrUnauthorized
	}

	claims, ok := token.Claims.(*middleware.Claims)
	if !ok {
		return nil, domain.ErrUnauthorized
	}

	// Check if refresh token is blacklisted in Redis
	blacklistKey := fmt.Sprintf("blacklist:%s", refreshToken)
	exists, _ := s.rdb.Exists(ctx, blacklistKey).Result()
	if exists > 0 {
		return nil, domain.ErrUnauthorized
	}

	// Get fresh user data
	user, err := s.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, domain.ErrUnauthorized
	}

	// Blacklist the old refresh token (set TTL to its remaining lifetime)
	if claims.ExpiresAt != nil {
		ttl := time.Until(claims.ExpiresAt.Time)
		if ttl > 0 {
			s.rdb.Set(ctx, blacklistKey, "1", ttl)
		}
	}

	return s.generateAuthResponse(user)
}

func (s *AuthService) generateAuthResponse(user *domain.User) (*dto.AuthResponse, error) {
	accessToken, err := s.generateToken(user, 15*time.Minute)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateToken(user, 7*24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		User: dto.UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  string(user.Role),
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) generateToken(user *domain.User, expiry time.Duration) (string, error) {
	claims := middleware.Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   string(user.Role),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
