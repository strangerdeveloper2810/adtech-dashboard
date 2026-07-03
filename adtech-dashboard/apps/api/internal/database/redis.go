package database

import (
	"context"
	"log/slog"
	"time"

	"github.com/redis/go-redis/v9"
)

func ConnectRedis(redisURL string) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:         redisURL,
		DB:           0,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     10,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		slog.Error("Failed to connect to Redis", "error", err)
		panic(err)
	}

	slog.Info("Connected to Redis", "addr", redisURL)
	return rdb
}
