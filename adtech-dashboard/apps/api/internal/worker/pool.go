package worker

import (
	"context"
	"encoding/json"
	"log/slog"
	"sync"
	"time"

	"adtech/internal/domain"
	"adtech/internal/repository"
	"adtech/internal/websocket"
)

type EventJob struct {
	Events []domain.AdEvent
}

type Pool struct {
	jobs      chan EventJob
	eventRepo repository.EventRepository
	hub       *websocket.Hub
	workers   int
	wg        sync.WaitGroup
}

func NewPool(workers int, eventRepo repository.EventRepository, hub *websocket.Hub) *Pool {
	return &Pool{
		jobs:      make(chan EventJob, 1000),
		eventRepo: eventRepo,
		hub:       hub,
		workers:   workers,
	}
}

func (p *Pool) Start(ctx context.Context) {
	for i := range p.workers {
		p.wg.Add(1)
		go p.worker(ctx, i)
	}
	slog.Info("Worker pool started", "workers", p.workers)
}

func (p *Pool) Stop() {
	close(p.jobs)
	p.wg.Wait()
	slog.Info("Worker pool stopped")
}

func (p *Pool) Submit(job EventJob) {
	select {
	case p.jobs <- job:
	default:
		slog.Warn("Worker pool job queue full, dropping job", "events", len(job.Events))
	}
}

func (p *Pool) worker(ctx context.Context, id int) {
	defer p.wg.Done()
	slog.Info("Worker started", "worker_id", id)

	for job := range p.jobs {
		start := time.Now()

		if err := p.eventRepo.BatchInsert(ctx, job.Events); err != nil {
			slog.Error("Worker failed to insert events",
				"worker_id", id,
				"events", len(job.Events),
				"error", err,
			)
			continue
		}

		// Broadcast metrics update via WebSocket
		if p.hub != nil && p.hub.ClientCount() > 0 {
			// Count by type
			var impressions, clicks, conversions int
			for _, e := range job.Events {
				switch e.Type {
				case domain.EventImpression:
					impressions++
				case domain.EventClick:
					clicks++
				case domain.EventConversion:
					conversions++
				}
			}

			update := map[string]any{
				"type":        "events_processed",
				"count":       len(job.Events),
				"impressions": impressions,
				"clicks":      clicks,
				"conversions": conversions,
				"timestamp":   time.Now().Unix(),
			}
			if data, err := json.Marshal(update); err == nil {
				p.hub.Broadcast(data)
			}
		}

		slog.Debug("Worker processed events",
			"worker_id", id,
			"events", len(job.Events),
			"duration_ms", time.Since(start).Milliseconds(),
		)
	}
}
