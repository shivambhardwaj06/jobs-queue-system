CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type VARCHAR(100) NOT NULL,

    payload JSONB NOT NULL DEFAULT '{}'::jsonb,

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    priority INTEGER NOT NULL DEFAULT 0,

    attempts INTEGER NOT NULL DEFAULT 0,

    max_attempts INTEGER NOT NULL DEFAULT 3,

    result JSONB,

    error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMPTZ
);