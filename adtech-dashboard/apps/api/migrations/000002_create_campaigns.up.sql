CREATE TABLE campaigns (
    id           BIGSERIAL     PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users(id),
    name         VARCHAR(255)  NOT NULL,
    description  TEXT,
    status       VARCHAR(20)   NOT NULL DEFAULT 'draft',
    budget       DECIMAL(12,2) NOT NULL DEFAULT 0,
    daily_budget DECIMAL(10,2),
    spent        DECIMAL(12,2) NOT NULL DEFAULT 0,
    start_date   DATE          NOT NULL,
    end_date     DATE          NOT NULL,
    targeting    JSONB         DEFAULT '{}',
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_campaigns_user ON campaigns(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_campaigns_status ON campaigns(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_targeting ON campaigns USING gin(targeting);
