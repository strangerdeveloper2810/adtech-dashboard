package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var (
	baseURL  = "http://localhost:8080/api/v1"
	accounts = []string{
		"admin@adtech.io",
		"alice@adtech.io",
		"bob@adtech.io",
		"charlie@adtech.io",
		"viewer@adtech.io",
	}
	countries = []string{"US", "GB", "DE", "FR", "JP", "CA", "AU", "BR", "IN", "KR"}
	devices   = []string{"mobile", "desktop", "tablet"}
)

type loginResp struct {
	Success bool `json:"success"`
	Data    struct {
		AccessToken string `json:"accessToken"`
	} `json:"data"`
}

type event struct {
	AdID       int64   `json:"adId"`
	CampaignID int64   `json:"campaignId"`
	Type       string  `json:"type"`
	Country    string  `json:"country"`
	Device     string  `json:"device"`
	Cost       float64 `json:"cost"`
}

func main() {
	email := flag.String("email", "", "Specific account email (default: rotate all accounts)")
	pass := flag.String("password", "password123", "Account password")
	interval := flag.Int("interval", 2, "Min interval between batches in seconds")
	flag.Parse()

	log.Println("Event Simulator — sends batches to /events/track every 2-5 seconds")
	log.Println("Press Ctrl+C to stop")

	// Determine which accounts to use
	var emails []string
	if *email != "" {
		emails = []string{*email}
	} else {
		emails = accounts
	}

	// Login all accounts
	tokens := make(map[string]string)
	for _, e := range emails {
		token := login(e, *pass)
		tokens[e] = token
		log.Printf("Logged in as %s", e)
	}

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	ticker := time.NewTicker(time.Duration(*interval) * time.Second)
	defer ticker.Stop()

	batch := 0
	for {
		select {
		case <-quit:
			log.Println("Stopping simulator...")
			return
		case <-ticker.C:
			batch++

			// Pick random account
			acct := emails[rand.Intn(len(emails))]
			token := tokens[acct]

			count := 5 + rand.Intn(20) // 5-24 events per batch
			events := generateEvents(count)

			if err := sendEvents(token, events); err != nil {
				log.Printf("Batch #%d [%s] FAILED: %v", batch, acct, err)
				continue
			}

			log.Printf("Batch #%d [%s]: sent %d events", batch, acct, count)

			// Random interval
			ticker.Reset(time.Duration(*interval+rand.Intn(4)) * time.Second)
		}
	}
}

func login(email, password string) string {
	body, _ := json.Marshal(map[string]string{"email": email, "password": password})
	resp, err := http.Post(baseURL+"/auth/login", "application/json", bytes.NewReader(body))
	if err != nil {
		log.Fatalf("Login failed for %s: %v", email, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		data, _ := io.ReadAll(resp.Body)
		log.Fatalf("Login failed for %s (status %d): %s", email, resp.StatusCode, string(data))
	}

	var result loginResp
	json.NewDecoder(resp.Body).Decode(&result)
	if result.Data.AccessToken == "" {
		log.Fatalf("No access token for %s", email)
	}
	return result.Data.AccessToken
}

func generateEvents(count int) []event {
	events := make([]event, count)
	for i := range count {
		// Weighted: 70% impression, 20% click, 10% conversion
		r := rand.Float64()
		var eventType string
		var cost float64
		switch {
		case r < 0.70:
			eventType = "impression"
			cost = 0.01 + rand.Float64()*0.05
		case r < 0.90:
			eventType = "click"
			cost = 0.10 + rand.Float64()*0.50
		default:
			eventType = "conversion"
			cost = 1.0 + rand.Float64()*5.0
		}

		events[i] = event{
			AdID:       int64(1 + rand.Intn(500)),
			CampaignID: int64(1 + rand.Intn(170)),
			Type:       eventType,
			Country:    countries[rand.Intn(len(countries))],
			Device:     devices[rand.Intn(len(devices))],
			Cost:       cost,
		}
	}
	return events
}

func sendEvents(token string, events []event) error {
	body, _ := json.Marshal(events)
	req, _ := http.NewRequest("POST", baseURL+"/events/track", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 {
		data, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("status %d: %s", resp.StatusCode, string(data))
	}
	return nil
}
