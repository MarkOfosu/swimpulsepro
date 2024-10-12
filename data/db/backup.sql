
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


-- Create a badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a swim_group_badges table to associate badges with swim groups
CREATE TABLE swim_group_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swim_group_id UUID REFERENCES swim_groups(id),
    name VARCHAR(255) NOT NULL,
  badge_id UUID REFERENCES badges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swim_group_id, badge_id)
);

-- Create a swimmer_badges table to award badges to swimmers
CREATE TABLE swimmer_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swimmer_id UUID REFERENCES swimmers(id),
  badge_id UUID REFERENCES badges(id),
  group_id UUID REFERENCES swim_groups(id),
  name VARCHAR(255) NOT NULL,
  awarded_by UUID REFERENCES coaches(id),
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index to improve query performance
CREATE INDEX idx_swimmer_badges_group_id ON swimmer_badges(group_id);

-- Update existing records (if any) with badge names
UPDATE swimmer_badges
SET badge_name = badges.name
FROM badges
WHERE swimmer_badges.badge_id = badges.id;

-- Make badge_name NOT NULL after updating existing records
ALTER TABLE swimmer_badges
ALTER COLUMN badge_name SET NOT NULL;


-- Supabase database is set up to handle text search on the 'focus' field of the workout_data JSONB column. You might need to create a GIN index
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CREATE INDEX workout_data_focus_idx ON workouts USING GIN ((workout_data->>'focus') gin_trgm_ops);

-- Table for different types of goals
CREATE TABLE IF NOT EXISTS goal_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for individual swimmer goals
CREATE TABLE IF NOT EXISTS swimmer_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    goal_type_id UUID REFERENCES goal_types(id) ON DELETE CASCADE,
    goal_type_name VARCHAR,
    target_value NUMERIC,
    initial_time INTERVAL,
    unit VARCHAR(10) DEFAULT 'units' NOT NULL,
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
    event VARCHAR(50),
    goal_type VARCHAR(50);
    description TEXT,
    achieved_date DATE,
    target_value NUMERIC,
    target_time INTERVAL,
    unit VARCHAR(10),
    icon VARCHAR,
    related_goal_id UUID REFERENCES swimmer_goals(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
    start_date DATE,
    end_date DATE,
);

-- Insert some common goal types
INSERT INTO goal_types (name, description, measurement_unit) VALUES
('Time Improvement', 'Improve time for a specific distance and stroke'),
('Distance Goal', 'Swim a target distance for a target period'),
-- ('Technique Mastery', 'Master a specific swimming technique', 'proficiency level'),
-- ('Competition Placement', 'Achieve a specific place in a competition', 'place'),
('Attendance Goal', 'Attend a target number of practice sessions');




-- Function to set a new goal


-- Update set_swimmer_goal function to include unit
-- Update set_swimmer_goal function
-- Optionally, you might want to update the set_swimmer_goal function to use the default value
CREATE OR REPLACE FUNCTION set_swimmer_goal(
  p_swimmer_id UUID,
  p_goal_type_id UUID,
  p_target_value NUMERIC,
  p_initial_time INTERVAL,
  p_target_time INTERVAL,
  p_event VARCHAR(50),
  p_start_date DATE,
  p_end_date DATE,
  p_unit VARCHAR(10) DEFAULT 'units'
) RETURNS JSON AS $$
DECLARE
  v_goal_id UUID;
  v_goal_type_name TEXT;
BEGIN
  -- Get the goal type name
  SELECT name INTO v_goal_type_name
  FROM goal_types
  WHERE id = p_goal_type_id;

  -- Insert the new goal
  INSERT INTO swimmer_goals (
    swimmer_id, goal_type_id, target_value, initial_time, target_time, event, start_date, end_date, status, progress, unit
  ) VALUES (
    p_swimmer_id, p_goal_type_id, p_target_value, p_initial_time, p_target_time, p_event, p_start_date, p_end_date, 'in_progress', 0, p_unit
  ) RETURNING id INTO v_goal_id;
  
  -- Return the goal information as JSON
  RETURN json_build_object(
    'id', v_goal_id,
    'goal_type_name', v_goal_type_name,
    'target_value', p_target_value,
    'target_time', p_target_time,
    'unit', p_unit
  );
END;
$$ LANGUAGE plpgsql;




-- Now, create the new function with the updated return type
-- Update existing rows to populate goal_type_name


-- Update update_goal_progress function
CREATE OR REPLACE FUNCTION update_goal_progress(
    p_goal_id UUID,
    p_update_value TEXT,
    p_update_date DATE,
    p_notes TEXT
) RETURNS JSON AS $$
DECLARE
    v_goal_data swimmer_goals%ROWTYPE;
    v_goal_type_name TEXT;
    v_new_progress NUMERIC;
    v_achievement_description TEXT;
    v_formatted_event TEXT;
BEGIN
    -- Get goal information
    SELECT * INTO v_goal_data
    FROM swimmer_goals
    WHERE id = p_goal_id;

    -- Get goal type name
    SELECT name INTO v_goal_type_name
    FROM goal_types
    WHERE id = v_goal_data.goal_type_id;

    -- Insert the update
    INSERT INTO goal_updates (goal_id, update_value, update_date, notes)
    VALUES (p_goal_id, p_update_value, p_update_date, p_notes);

    -- Calculate new progress based on goal type
    IF v_goal_type_name = 'Time Improvement' THEN
        v_new_progress := calculate_time_progress(v_goal_data.initial_time, v_goal_data.target_time, p_update_value::INTERVAL);
    ELSE
        -- For numeric goals, calculate progress
        v_new_progress := LEAST(100, (p_update_value::NUMERIC / v_goal_data.target_value) * 100);
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
    RETURNING * INTO v_goal_data;

    -- If goal is completed, create an achievement
    IF v_goal_data.status = 'completed' THEN
        -- Format the event name (replace underscores with spaces)
        v_formatted_event := replace(v_goal_data.event, '_', ' ');
        
        -- Create achievement description
        v_achievement_description := v_formatted_event || ' ' || v_goal_type_name;

        INSERT INTO achievements (
            swimmer_id, title, description, achieved_date, related_goal_id, 
            event, goal_type, target_value, target_time, start_date, end_date, unit
        )
        VALUES (
            v_goal_data.swimmer_id,
            v_goal_type_name || ' Achieved',
            v_achievement_description,
            CURRENT_DATE,
            v_goal_data.id,
            v_formatted_event,
            v_goal_type_name,
            v_goal_data.target_value,
            v_goal_data.target_time,
            v_goal_data.start_date,
            v_goal_data.end_date,
            v_goal_data.unit
        );
    END IF;

    -- Return the updated goal data
    RETURN row_to_json(v_goal_data);
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