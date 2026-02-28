CREATE TABLE campaign_metrics (
    id          BIGSERIAL     PRIMARY KEY,
    campaign_id BIGINT        NOT NULL REFERENCES campaigns(id),
    period      TIMESTAMPTZ   NOT NULL,
    impressions BIGINT        NOT NULL DEFAULT 0,
    clicks      BIGINT        NOT NULL DEFAULT 0,
    conversions BIGINT        NOT NULL DEFAULT 0,
    spend       DECIMAL(10,2) NOT NULL DEFAULT 0,
    UNIQUE(campaign_id, period)
);

CREATE INDEX idx_metrics_campaign_period ON campaign_metrics(campaign_id, period DESC);
