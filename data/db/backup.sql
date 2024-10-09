
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
    group_code VARCHAR(8) UNIQUE;
);

CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,  -- group_id referencing swim_groups
    name VARCHAR,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    category  varchar,	
    details  JSONB,
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


CREATE TABLE IF NOT EXISTS invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.swim_groups(id),
    email TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Supabase database is set up to handle text search on the 'focus' field of the workout_data JSONB column. You might need to create a GIN index
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CREATE INDEX workout_data_focus_idx ON workouts USING GIN ((workout_data->>'focus') gin_trgm_ops);

-- Table for different types of goals
CREATE TABLE IF NOT EXISTS goal_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    measurement_unit VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for individual swimmer goals
CREATE TABLE IF NOT EXISTS swimmer_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    goal_type_id UUID REFERENCES goal_types(id) ON DELETE CASCADE,
    target_value NUMERIC,
    initial_time INTERVAL,
    start_date DATE,
    end_date DATE,
    status VARCHAR DEFAULT 'in_progress',
    progress NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for goal progress updates
CREATE TABLE IF NOT EXISTS goal_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES swimmer_goals(id) ON DELETE CASCADE,
    update_value TYPE TEXT,
    update_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    achieved_date DATE,
    icon VARCHAR,
    related_goal_id UUID REFERENCES swimmer_goals(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some common goal types
INSERT INTO goal_types (name, description, measurement_unit) VALUES
('Time Improvement', 'Improve time for a specific distance and stroke', 'seconds'),
('Distance Goal', 'Swim a target distance for a target period', 'meters'),
-- ('Technique Mastery', 'Master a specific swimming technique', 'proficiency level'),
('Competition Placement', 'Achieve a specific place in a competition', 'place'),
('Attendance Goal', 'Attend a target number of practice sessions', 'sessions');




-- Function to set a new goal


-- Update set_swimmer_goal function
CREATE OR REPLACE FUNCTION set_swimmer_goal(
  p_swimmer_id UUID,
  p_goal_type_id UUID,
  p_target_value NUMERIC,
  p_initial_time INTERVAL,
  p_target_time INTERVAL,
  p_event VARCHAR(50),
  p_start_date DATE,
  p_end_date DATE
) RETURNS UUID AS $$
DECLARE
  v_goal_id UUID;
BEGIN
  INSERT INTO swimmer_goals (
    swimmer_id, goal_type_id, target_value, initial_time, target_time, event, start_date, end_date, status, progress
  ) VALUES (
    p_swimmer_id, p_goal_type_id, p_target_value, p_initial_time, p_target_time, p_event, p_start_date, p_end_date, 'in_progress', 0
  ) RETURNING id INTO v_goal_id;
  
  RETURN v_goal_id;
END;
$$ LANGUAGE plpgsql;

-- Update update_goal_progress function

-- Now, create the new function with the updated return type
CREATE OR REPLACE FUNCTION update_goal_progress(
    p_goal_id UUID,
    p_update_value TEXT,
    p_update_date DATE,
    p_notes TEXT
) RETURNS JSON AS $$
DECLARE
    v_goal swimmer_goals;
    v_goal_type_id UUID;
    v_target_value NUMERIC;
    v_initial_time INTERVAL;
    v_target_time INTERVAL;
    v_new_progress NUMERIC;
BEGIN
    -- Get goal information
    SELECT * INTO v_goal
    FROM swimmer_goals 
    WHERE id = p_goal_id;

    -- Insert the update
    INSERT INTO goal_updates (goal_id, update_value, update_date, notes)
    VALUES (p_goal_id, p_update_value, p_update_date, p_notes);

    -- Calculate new progress based on goal type
    IF v_goal.goal_type_id = (SELECT id FROM goal_types WHERE name = 'Time Improvement') THEN
        v_new_progress := calculate_time_progress(v_goal.initial_time, v_goal.target_time, p_update_value::INTERVAL);
    ELSE
        -- For numeric goals, calculate progress
        v_new_progress := LEAST(100, (p_update_value::NUMERIC / v_goal.target_value) * 100);
    END IF;

    -- Update the goal progress
    UPDATE swimmer_goals
    SET progress = v_new_progress,
        status = CASE 
            WHEN v_new_progress >= 100 THEN 'completed'
            WHEN CURRENT_DATE > end_date THEN 'expired'
            ELSE 'in_progress'
        END
    WHERE id = p_goal_id
    RETURNING * INTO v_goal;

    -- If goal is completed, create an achievement
    IF v_goal.status = 'completed' THEN
        INSERT INTO achievements (swimmer_id, title, description, achieved_date, related_goal_id)
        SELECT v_goal.swimmer_id,
               gt.name || ' Achieved',
               'Completed goal: ' || gt.description,
               CURRENT_DATE,
               v_goal.id
        FROM goal_types gt
        WHERE gt.id = v_goal.goal_type_id;
    END IF;

    RETURN row_to_json(v_goal);
END;
$$ LANGUAGE plpgsql;


-- Update calculate_time_progress function
CREATE OR REPLACE FUNCTION calculate_time_progress(
  initial_time INTERVAL,
  target_time INTERVAL,
  actual_time INTERVAL
) RETURNS NUMERIC AS $$
DECLARE
  total_improvement INTERVAL;
  current_improvement INTERVAL;
BEGIN
  total_improvement := initial_time - target_time;
  current_improvement := initial_time - actual_time;
  RETURN LEAST(100, (EXTRACT(EPOCH FROM current_improvement) / EXTRACT(EPOCH FROM total_improvement)) * 100);
END;
$$ LANGUAGE plpgsql;