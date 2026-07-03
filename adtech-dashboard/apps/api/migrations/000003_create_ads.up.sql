CREATE TABLE ads (
    id          BIGSERIAL    PRIMARY KEY,
    campaign_id BIGINT       NOT NULL REFERENCES campaigns(id),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    type        VARCHAR(20)  NOT NULL,
    destination VARCHAR(500) NOT NULL,
    image_url   VARCHAR(500),
    status      VARCHAR(20)  NOT NULL DEFAULT 'draft',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_ads_campaign ON ads(campaign_id) WHERE deleted_at IS NULL;
