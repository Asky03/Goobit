BEGIN;

CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL
        CHECK (length(trim(name)) > 0),

    type TEXT NOT NULL
        CHECK (
            type IN (
                'Running',
                'Walking',
                'Cycling',
                'Gym'
            )
        ),

    duration DOUBLE PRECISION NOT NULL
        CHECK (
            duration >= 0
            AND duration < 'Infinity'::float8
        ),

    calories DOUBLE PRECISION NOT NULL
        CHECK (
            calories >= 0
            AND calories < 'Infinity'::float8
        ),

    date TIMESTAMPTZ NOT NULL,

    distance_km DOUBLE PRECISION
        CHECK (
            distance_km >= 0
            AND distance_km < 'Infinity'::float8
        ),

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_date
ON public.activities (date DESC);

COMMIT;