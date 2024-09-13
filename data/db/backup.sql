
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- id referencing auth.users(id)
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,  -- id referencing profiles
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swimmers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,  -- id referencing profiles
    group_id UUID REFERENCES swim_groups(id) ON DELETE SET NULL,  -- Optional: nullify group_id if the group is deleted
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR,
    location VARCHAR,
    admin_id UUID REFERENCES profiles(id),  -- admin_id referencing profiles
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS swim_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,  -- coach_id referencing coaches.id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,  -- group_id referencing swim_groups
    name VARCHAR,
    type VARCHAR,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS metric_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_id UUID REFERENCES metrics(id) ON DELETE CASCADE,  -- metric_id referencing metrics
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,  -- swimmer_id referencing swimmers
    computed_score NUMERIC,
    recorded_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,  -- coach_id referencing coaches.id
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,  -- group_id referencing swim_groups.id
    workout_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS ai_training_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,  -- group_id referencing swim_groups
    training_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
