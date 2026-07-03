package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"time"

	"adtech/config"
	"adtech/internal/database"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg := config.Load()
	db := database.Connect(cfg.DatabaseURL)
	defer db.Close()

	ctx := context.Background()

	log.Println("Seeding database...")

	// Clean existing data (reverse FK order)
	cleanTables(ctx, db)

	// 1. Create users
	users := seedUsers(ctx, db)
	log.Printf("Created %d users", len(users))

	// 2. Create campaigns (50 per user = 100+ total)
	campaigns := seedCampaigns(ctx, db, users)
	log.Printf("Created %d campaigns", len(campaigns))

	// 3. Create ads (3-5 per campaign = 300-500 total)
	ads := seedAds(ctx, db, campaigns)
	log.Printf("Created %d ads", len(ads))

	// 4. Create ad events (100-500 per ad = 30k-250k total for optimization practice)
	eventCount := seedEvents(ctx, db, ads)
	log.Printf("Created %d ad events", eventCount)

	// 5. Aggregate into campaign_metrics
	metricsCount := seedMetrics(ctx, db, campaigns)
	log.Printf("Created %d campaign metrics rows", metricsCount)

	// 6. Update campaign spent from events
	updateCampaignSpent(ctx, db)

	log.Println("Seed complete!")
}

func cleanTables(ctx context.Context, db *pgxpool.Pool) {
	tables := []string{"campaign_metrics", "ad_events", "ads", "campaigns", "users"}
	for _, t := range tables {
		db.Exec(ctx, fmt.Sprintf("TRUNCATE TABLE %s CASCADE", t))
	}
	log.Println("Cleaned all tables")
}

type seedUser struct {
	id   int64
	role string
}

func seedUsers(ctx context.Context, db *pgxpool.Pool) []seedUser {
	password, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	users := []struct {
		email string
		name  string
		role  string
	}{
		{"admin@adtech.io", "Admin User", "admin"},
		{"alice@adtech.io", "Alice Nguyen", "advertiser"},
		{"bob@adtech.io", "Bob Tran", "advertiser"},
		{"charlie@adtech.io", "Charlie Le", "advertiser"},
		{"viewer@adtech.io", "Viewer User", "viewer"},
	}

	var result []seedUser
	for _, u := range users {
		var id int64
		err := db.QueryRow(ctx,
			`INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id`,
			u.email, string(password), u.name, u.role,
		).Scan(&id)
		if err != nil {
			log.Fatalf("Failed to create user %s: %v", u.email, err)
		}
		result = append(result, seedUser{id: id, role: u.role})
	}
	return result
}

type seedCampaign struct {
	id     int64
	userID int64
	status string
}

func seedCampaigns(ctx context.Context, db *pgxpool.Pool, users []seedUser) []seedCampaign {
	statuses := []string{"draft", "active", "paused", "completed", "archived"}
	names := []string{
		"Summer Sale", "Black Friday", "New Year Promo", "Spring Collection",
		"Back to School", "Holiday Special", "Flash Sale", "Premium Launch",
		"Brand Awareness", "Product Launch", "Retargeting", "Engagement Boost",
		"Lead Generation", "App Install", "Video Campaign", "Display Ads",
		"Social Media Push", "Email Blast", "Influencer Collab", "Seasonal Offer",
	}
	countries := [][]string{
		{"US", "CA"}, {"GB", "DE", "FR"}, {"JP", "KR"}, {"AU", "NZ"},
		{"VN", "TH", "SG"}, {"BR", "MX"}, {"IN"}, {"US", "GB", "AU"},
	}
	devices := [][]string{
		{"mobile", "desktop"}, {"mobile"}, {"desktop", "tablet"}, {"mobile", "desktop", "tablet"},
	}

	var campaigns []seedCampaign
	for _, u := range users {
		if u.role == "viewer" {
			continue
		}
		count := 30 + rand.Intn(25) // 30-54 campaigns per advertiser
		for i := 0; i < count; i++ {
			name := fmt.Sprintf("%s %d", names[rand.Intn(len(names))], rand.Intn(1000))
			status := statuses[rand.Intn(len(statuses))]
			budget := 1000 + rand.Float64()*49000  // 1k - 50k
			dailyBudget := 50 + rand.Float64()*450 // 50 - 500
			startDate := time.Now().AddDate(0, -rand.Intn(6), -rand.Intn(28))
			endDate := startDate.AddDate(0, 1+rand.Intn(3), rand.Intn(15))

			targeting, _ := json.Marshal(map[string]any{
				"countries": countries[rand.Intn(len(countries))],
				"devices":   devices[rand.Intn(len(devices))],
				"age_range": [2]int{18 + rand.Intn(10), 45 + rand.Intn(20)},
			})

			var id int64
			err := db.QueryRow(ctx,
				`INSERT INTO campaigns (user_id, name, description, status, budget, daily_budget, spent, start_date, end_date, targeting)
				 VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8, $9)
				 RETURNING id`,
				u.id, name, fmt.Sprintf("Campaign for %s", name), status,
				budget, dailyBudget, startDate, endDate, targeting,
			).Scan(&id)
			if err != nil {
				log.Fatalf("Failed to create campaign: %v", err)
			}
			campaigns = append(campaigns, seedCampaign{id: id, userID: u.id, status: status})
		}
	}
	return campaigns
}

type seedAd struct {
	id         int64
	campaignID int64
}

func seedAds(ctx context.Context, db *pgxpool.Pool, campaigns []seedCampaign) []seedAd {
	adTypes := []string{"banner", "native", "video"}
	titles := []string{
		"Shop Now", "Limited Offer", "Free Shipping", "50% Off",
		"New Arrival", "Best Seller", "Trending Now", "Exclusive Deal",
		"Buy One Get One", "Premium Quality", "Must Have", "Top Rated",
	}

	var ads []seedAd
	for _, c := range campaigns {
		adCount := 2 + rand.Intn(4) // 2-5 ads per campaign
		for i := 0; i < adCount; i++ {
			title := fmt.Sprintf("%s - Ad %d", titles[rand.Intn(len(titles))], i+1)
			adType := adTypes[rand.Intn(len(adTypes))]
			status := "active"
			if c.status == "draft" {
				status = "draft"
			}

			var id int64
			err := db.QueryRow(ctx,
				`INSERT INTO ads (campaign_id, title, description, type, destination, image_url, status)
				 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
				c.id, title, fmt.Sprintf("Ad creative for %s", title),
				adType, fmt.Sprintf("https://example.com/landing/%d", c.id),
				fmt.Sprintf("https://picsum.photos/seed/%d/800/600", rand.Intn(10000)),
				status,
			).Scan(&id)
			if err != nil {
				log.Fatalf("Failed to create ad: %v", err)
			}
			ads = append(ads, seedAd{id: id, campaignID: c.id})
		}
	}
	return ads
}

func seedEvents(ctx context.Context, db *pgxpool.Pool, ads []seedAd) int {
	eventTypes := []string{"impression", "click", "conversion"}
	eventWeights := []int{80, 15, 5} // 80% impressions, 15% clicks, 5% conversions
	countries := []string{"US", "GB", "DE", "FR", "JP", "VN", "AU", "CA", "BR", "IN", "KR", "SG", "TH", "MX", "NZ"}
	deviceList := []string{"mobile", "desktop", "tablet"}

	totalEvents := 0
	batchSize := 1000
	var values string
	var args []any
	argIdx := 1
	batchCount := 0

	flush := func() {
		if batchCount == 0 {
			return
		}
		query := "INSERT INTO ad_events (ad_id, campaign_id, type, country, device, cost, created_at) VALUES " + values
		_, err := db.Exec(ctx, query, args...)
		if err != nil {
			log.Fatalf("Failed to insert events batch: %v", err)
		}
		totalEvents += batchCount
		values = ""
		args = nil
		argIdx = 1
		batchCount = 0
	}

	for _, ad := range ads {
		// 50-300 events per ad
		eventCount := 50 + rand.Intn(251)
		for i := 0; i < eventCount; i++ {
			// Weighted random event type
			r := rand.Intn(100)
			var eventType string
			if r < eventWeights[0] {
				eventType = eventTypes[0]
			} else if r < eventWeights[0]+eventWeights[1] {
				eventType = eventTypes[1]
			} else {
				eventType = eventTypes[2]
			}

			country := countries[rand.Intn(len(countries))]
			device := deviceList[rand.Intn(len(deviceList))]

			var cost float64
			switch eventType {
			case "impression":
				cost = 0.001 + rand.Float64()*0.01 // CPM: $1-11
			case "click":
				cost = 0.1 + rand.Float64()*2.0 // CPC: $0.1-2.1
			case "conversion":
				cost = 1.0 + rand.Float64()*20.0 // CPA: $1-21
			}

			// Random time in last 90 days
			createdAt := time.Now().Add(-time.Duration(rand.Intn(90*24)) * time.Hour)
			createdAt = createdAt.Add(-time.Duration(rand.Intn(60)) * time.Minute)

			if batchCount > 0 {
				values += ","
			}
			values += fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d,$%d)",
				argIdx, argIdx+1, argIdx+2, argIdx+3, argIdx+4, argIdx+5, argIdx+6)
			args = append(args, ad.id, ad.campaignID, eventType, country, device, cost, createdAt)
			argIdx += 7
			batchCount++

			if batchCount >= batchSize {
				flush()
			}
		}
	}
	flush()
	return totalEvents
}

func seedMetrics(ctx context.Context, db *pgxpool.Pool, campaigns []seedCampaign) int {
	// Aggregate from ad_events into campaign_metrics by day
	query := `
		INSERT INTO campaign_metrics (campaign_id, period, impressions, clicks, conversions, spend)
		SELECT
			campaign_id,
			date_trunc('day', created_at) AS period,
			COUNT(*) FILTER (WHERE type = 'impression'),
			COUNT(*) FILTER (WHERE type = 'click'),
			COUNT(*) FILTER (WHERE type = 'conversion'),
			COALESCE(SUM(cost), 0)
		FROM ad_events
		GROUP BY campaign_id, date_trunc('day', created_at)
		ON CONFLICT (campaign_id, period) DO UPDATE SET
			impressions = EXCLUDED.impressions,
			clicks = EXCLUDED.clicks,
			conversions = EXCLUDED.conversions,
			spend = EXCLUDED.spend`

	result, err := db.Exec(ctx, query)
	if err != nil {
		log.Fatalf("Failed to seed metrics: %v", err)
	}
	return int(result.RowsAffected())
}

func updateCampaignSpent(ctx context.Context, db *pgxpool.Pool) {
	query := `
		UPDATE campaigns c
		SET spent = COALESCE(sub.total_cost, 0)
		FROM (
			SELECT campaign_id, SUM(cost) as total_cost
			FROM ad_events
			GROUP BY campaign_id
		) sub
		WHERE c.id = sub.campaign_id`

	_, err := db.Exec(ctx, query)
	if err != nil {
		log.Fatalf("Failed to update campaign spent: %v", err)
	}
	log.Println("Updated campaign spent totals")
}
