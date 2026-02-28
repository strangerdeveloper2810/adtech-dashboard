CREATE TABLE ad_events (
    id          BIGSERIAL   PRIMARY KEY,
    ad_id       BIGINT      NOT NULL REFERENCES ads(id),
    campaign_id BIGINT      NOT NULL REFERENCES campaigns(id),
    type        VARCHAR(20) NOT NULL,
    country     VARCHAR(2),
    device      VARCHAR(20),
    cost        DECIMAL(8,4) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_campaign_time ON ad_events(campaign_id, created_at DESC);
CREATE INDEX idx_events_ad ON ad_events(ad_id, type);
CREATE INDEX idx_events_type ON ad_events(type, created_at DESC);
