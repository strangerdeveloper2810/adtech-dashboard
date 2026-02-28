package database

import (
	"context"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(databaseURL string) *pgxpool.Pool {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		slog.Error("Failed to parse database URL", "error", err)
		panic(err)
	}

	config.MaxConns = 25
	config.MinConns = 5
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		slog.Error("Failed to create connection pool", "error", err)
		panic(err)
	}

	if err := pool.Ping(ctx); err != nil {
		slog.Error("Failed to ping database", "error", err)
		panic(err)
	}

	slog.Info("Connected to PostgreSQL", "max_conns", config.MaxConns)
	return pool
}
