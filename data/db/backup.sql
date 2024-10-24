
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- id referencing auth.users(id)
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    role TEXT NOT NULL,
    gender TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    first_name TEXT,
    last_name TEXT,
);

CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,  -- id referencing profiles
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    gender TEXT,
);

CREATE TABLE IF NOT EXISTS swimmers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,  -- id referencing profiles
    group_id UUID REFERENCES swim_groups(id) ON DELETE SET NULL,  -- Optional: nullify group_id if the group is deleted
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    age_group TEXT
    gender TEXT
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    admin_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, location)  -- Prevent duplicate teams in same location
);

CREATE OR REPLACE FUNCTION public.search_teams(search_term TEXT)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    location VARCHAR,
    admin_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, t.location, t.admin_id
    FROM public.teams t
    WHERE t.name ILIKE '%' || search_term || '%'
    AND t.is_active = true
    ORDER BY t.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TABLE IF NOT EXISTS swim_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,  -- coach_id referencing coaches.id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
    group_code VARCHAR(8) UNIQUE;
);


--final handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_team_id UUID;
    v_is_admin BOOLEAN;
BEGIN
    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, first_name, last_name, role, gender)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'role',
        NEW.raw_user_meta_data->>'gender'
    );

    -- If the user is a swimmer, insert into swimmers table
    IF NEW.raw_user_meta_data->>'role' = 'swimmer' THEN
        INSERT INTO public.swimmers (id, first_name, last_name, date_of_birth, age_group, gender)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'first_name',
            NEW.raw_user_meta_data->>'last_name',
            (NEW.raw_user_meta_data->>'date_of_birth')::date,
            NEW.raw_user_meta_data->>'age_group',
            NEW.raw_user_meta_data->>'gender'
        );
    
    -- If the user is a coach, handle team creation/assignment
    ELSIF NEW.raw_user_meta_data->>'role' = 'coach' THEN
        -- Check if this coach is creating a new team (is_admin)
        v_is_admin := COALESCE((NEW.raw_user_meta_data->>'is_team_admin')::boolean, false);
        
        IF v_is_admin THEN
            -- Create new team
            INSERT INTO public.teams (name, location, admin_id)
            VALUES (
                NEW.raw_user_meta_data->>'swim_team',
                NEW.raw_user_meta_data->>'swim_team_location',
                NEW.id
            )
            RETURNING id INTO v_team_id;
        ELSE
            -- Get existing team ID
            SELECT id INTO v_team_id
            FROM public.teams
            WHERE name = NEW.raw_user_meta_data->>'swim_team'
            AND location = NEW.raw_user_meta_data->>'swim_team_location'
            AND is_active = true;
            
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Team not found: % in %', 
                    NEW.raw_user_meta_data->>'swim_team',
                    NEW.raw_user_meta_data->>'swim_team_location';
            END IF;
        END IF;

        -- Insert into coaches table
        INSERT INTO public.coaches (id, first_name, last_name, gender, team_id)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'first_name',
            NEW.raw_user_meta_data->>'last_name',
            NEW.raw_user_meta_data->>'gender',
            v_team_id
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error in handle_new_user function: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create debug_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.debug_log (
  id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create error_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.error_log (
  id SERIAL PRIMARY KEY,
  error_message TEXT,
  error_detail TEXT,
  error_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();




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


CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swim_group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    is_present BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(swim_group_id, swimmer_id, date)
);

CREATE INDEX idx_attendance_swim_group_date ON attendance(swim_group_id, date);
CREATE INDEX idx_attendance_swimmer_date ON attendance(swimmer_id, date);





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






-- Time standards and records taking into account the swimmer's age group setup


-- Swim standards table
CREATE TABLE IF NOT EXISTS swim_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_group VARCHAR(20) NOT NULL,
    gender TEXT NOT NULL,
    event VARCHAR(50) NOT NULL,
    course VARCHAR(10) NOT NULL, -- SCY, SCM, or LCM
    b_standard INTERVAL,
    bb_standard INTERVAL,
    a_standard INTERVAL,
    aa_standard INTERVAL,
    aaa_standard INTERVAL,
    aaaa_standard INTERVAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(age_group, gender, event, course)
);

-- Swim meets table
CREATE TABLE IF NOT EXISTS swim_meets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    course VARCHAR(10) NOT NULL, -- SCY, SCM, or LCM
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Swim events table
CREATE TABLE IF NOT EXISTS swim_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    distance INTEGER NOT NULL,
    stroke VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, distance, stroke),
    gender VARCHAR(10),
    age_group VARCHAR(20);
);
-- Add any necessary indexes
CREATE INDEX idx_gender ON swim_events(gender);
CREATE INDEX idx_age_group ON swim_events(age_group);


-- Swim results table
CREATE TABLE IF NOT EXISTS swim_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    meet_name VARCHAR(255) NOT NULL,
    event VARCHAR(100) NOT NULL,
    time INTERVAL NOT NULL,
    date DATE NOT NULL,
    course VARCHAR(10) NOT NULL,
    is_personal_best BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Optionally, you might want to add a check constraint to ensure valid course values
ALTER TABLE swim_results
ADD CONSTRAINT check_course CHECK (course IN ('SCY', 'SCM', 'LCM'));


CREATE OR REPLACE FUNCTION update_swimmer_age_group()
RETURNS TRIGGER AS $$
BEGIN
    NEW.age_group := CASE 
        WHEN DATE_PART('year', AGE(CURRENT_DATE, NEW.date_of_birth)) <= 10 THEN '10 & under'
        WHEN DATE_PART('year', AGE(CURRENT_DATE, NEW.date_of_birth)) BETWEEN 11 AND 12 THEN '11-12'
        WHEN DATE_PART('year', AGE(CURRENT_DATE, NEW.date_of_birth)) BETWEEN 13 AND 14 THEN '13-14'
        WHEN DATE_PART('year', AGE(CURRENT_DATE, NEW.date_of_birth)) BETWEEN 15 AND 16 THEN '15-16'
        ELSE '17-18'
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;





You're absolutely right, and I apologize for the oversight. Let's refine this to address your requirements. We'll modify the trigger to fire after insert and update, and we'll create a function to check and update age groups daily for swimmers whose birthdays match the current date.

Here's the refined version:


Refined Age Group Management
Click to open code
Here's what these changes do:

The calculate_age_group function remains the same, calculating the age group based on the current date and birth date.
The update_swimmer_age_group function is simplified to just set the age group and last update date.
The trigger is now set to fire AFTER INSERT OR UPDATE, which means it won't interfere with the initial insert process.
The check_and_update_age_groups function is modified to only update swimmers whose birthdays match the current date. This ensures that age groups are updated annually on each swimmer's birthday.
We've kept the cron job scheduling to run this function daily at midnight.
This approach addresses your requirements:

It doesn't interfere with the insert process since the trigger fires after the insert.
It updates the age group after any change to the date of birth.
It checks and updates age groups daily, but only for swimmers whose birthdays match the current date.
To implement this:

Run the SQL commands in the artifact above in your database.
Ensure that your pg_cron extension is set up correctly to run the daily job.
You may need to manually run the check_and_update_age_groups function once to update any existing records that might have outdated age groups.
This solution provides a balance between efficiency and accuracy, ensuring that age groups are always up-to-date without unnecessary daily calculations for all swimmers.

Copy
Retry


Claude can make mistakes. Please double-check responses.



No file chosen


3.5 Sonnet
Tip:
Long chats cause you to reach your usage limits faster.
Start a new chat 

Refined Age Group Management

-- Function to calculate age group
CREATE OR REPLACE FUNCTION calculate_age_group(birth_date DATE)
RETURNS VARCHAR(20) AS $$
DECLARE
    age INT;
BEGIN
    age := DATE_PART('year', AGE(CURRENT_DATE, birth_date));
    RETURN CASE 
        WHEN age <= 10 THEN '10 & under'
        WHEN age BETWEEN 11 AND 12 THEN '11-12'
        WHEN age BETWEEN 13 AND 14 THEN '13-14'
        WHEN age BETWEEN 15 AND 16 THEN '15-16'
        ELSE '17-18'
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to update swimmer's age group
CREATE OR REPLACE FUNCTION update_swimmer_age_group()
RETURNS TRIGGER AS $$
BEGIN
    NEW.age_group := calculate_age_group(NEW.date_of_birth);
    NEW.last_age_group_update := CURRENT_DATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update age group after insert or update of date_of_birth
CREATE TRIGGER update_swimmer_age_group_trigger
AFTER INSERT OR UPDATE OF date_of_birth ON swimmers
FOR EACH ROW EXECUTE FUNCTION update_swimmer_age_group();



-- Trigger to update age group on insert or update of date_of_birth
-- CREATE TRIGGER update_swimmer_age_group_trigger
-- BEFORE INSERT OR UPDATE OF date_of_birth ON swimmers
-- FOR EACH ROW EXECUTE FUNCTION update_swimmer_age_group();

-- Create new trigger only for updates
CREATE TRIGGER update_swimmer_age_group_trigger
BEFORE UPDATE OF date_of_birth ON swimmers
FOR EACH ROW EXECUTE FUNCTION public.update_swimmer_age_group();

-- Function to check and update age groups daily
CREATE OR REPLACE FUNCTION check_and_update_age_groups()
RETURNS VOID AS $$
BEGIN
    UPDATE swimmers
    SET 
        age_group = calculate_age_group(date_of_birth),
        last_age_group_update = CURRENT_DATE
    WHERE 
        DATE_PART('month', CURRENT_DATE) = DATE_PART('month', date_of_birth)
        AND DATE_PART('day', CURRENT_DATE) = DATE_PART('day', date_of_birth)
        OR last_age_group_update IS NULL
        OR last_age_group_update < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;



-- Function to update swim result and manage personal bests
-- Function to update personal bests
CREATE OR REPLACE FUNCTION update_personal_best(
    p_swimmer_id UUID,
    p_event VARCHAR(100),
    p_course VARCHAR(10),
    p_time INTERVAL,
    p_date DATE,
    p_result_id UUID
) RETURNS VOID AS $$
DECLARE
    v_current_best INTERVAL;
    v_current_best_id UUID;
BEGIN
    -- Get the current personal best for this event and course
    SELECT time, id INTO v_current_best, v_current_best_id
    FROM swim_results
    WHERE swimmer_id = p_swimmer_id 
      AND event = p_event 
      AND course = p_course 
      AND is_personal_best = TRUE;

    -- If there's no current best, or the new time is better, update
    IF v_current_best IS NULL OR p_time < v_current_best THEN
        -- Set the previous best (if any) to not be a personal best
        IF v_current_best_id IS NOT NULL THEN
            UPDATE swim_results
            SET is_personal_best = FALSE
            WHERE id = v_current_best_id;
        END IF;

        -- Set the new result as the personal best
        UPDATE swim_results
        SET is_personal_best = TRUE
        WHERE id = p_result_id;

        -- Notify clients of the change
        PERFORM pg_notify('swim_results_changed', json_build_object(
            'swimmer_id', p_swimmer_id,
            'event', p_event,
            'course', p_course,
            'new_best', p_time::text,
            'date', p_date
        )::text);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call this function after insert or update on swim_results
CREATE OR REPLACE FUNCTION trigger_update_personal_best()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_personal_best(
        NEW.swimmer_id,
        NEW.event,
        NEW.course,
        NEW.time,
        NEW.date,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER swim_results_update_trigger
AFTER INSERT OR UPDATE ON swim_results
FOR EACH ROW EXECUTE FUNCTION trigger_update_personal_best();

-- Add a trigger for deletions to handle potential changes in personal bests
CREATE OR REPLACE FUNCTION handle_swim_result_deletion()
RETURNS TRIGGER AS $$
DECLARE
    v_new_best RECORD;
BEGIN
    -- If the deleted record was a personal best, find the new best
    IF OLD.is_personal_best THEN
        SELECT * INTO v_new_best
        FROM swim_results
        WHERE swimmer_id = OLD.swimmer_id
          AND event = OLD.event
          AND course = OLD.course
        ORDER BY time ASC
        LIMIT 1;

        -- If a new best is found, update it
        IF v_new_best IS NOT NULL THEN
            PERFORM update_personal_best(
                v_new_best.swimmer_id,
                v_new_best.event,
                v_new_best.course,
                v_new_best.time,
                v_new_best.date,
                v_new_best.id
            );
        ELSE
            -- If no new best is found, notify of the removal
            PERFORM pg_notify('swim_results_changed', json_build_object(
                'swimmer_id', OLD.swimmer_id,
                'event', OLD.event,
                'course', OLD.course,
                'action', 'removed'
            )::text);
        END IF;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER swim_results_delete_trigger
AFTER DELETE ON swim_results
FOR EACH ROW EXECUTE FUNCTION handle_swim_result_deletion();

-- Trigger function to handle swim result insertion
CREATE OR REPLACE FUNCTION handle_swim_result_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_current_best INTERVAL;
BEGIN
    -- Get the current personal best for this event
    SELECT time INTO v_current_best
    FROM swim_results
    WHERE swimmer_id = NEW.swimmer_id 
      AND event = NEW.event 
      AND course = NEW.course 
      AND is_personal_best = TRUE;

    -- If this is a new personal best or there's no existing best, update personal bests
    IF v_current_best IS NULL OR NEW.time < v_current_best THEN
        PERFORM update_personal_best(
            NEW.swimmer_id,
            NEW.event,
            NEW.course,
            NEW.time,
            NEW.date,
            NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger on swim_results table
DROP TRIGGER IF EXISTS swim_result_insert_trigger ON swim_results;
CREATE TRIGGER swim_result_insert_trigger
AFTER INSERT ON swim_results
FOR EACH ROW
EXECUTE FUNCTION handle_swim_result_insert();


-- Views
-- View for swimmer's personal bests
CREATE OR REPLACE VIEW swimmer_personal_bests AS
SELECT 
    swimmer_id,
    event,
    course,
    time AS best_time,
    date AS date_achieved
FROM 
    swim_results
WHERE 
    is_personal_best = TRUE;

-- View for swimmer standards
CREATE OR REPLACE VIEW swimmer_standards AS
SELECT 
    s.id AS swimmer_id,
    p.first_name,
    p.last_name,
    s.age_group,
    p.gender,
    spb.event,
    spb.course,
    spb.best_time,
    ss.b_standard,
    ss.bb_standard,
    ss.a_standard,
    ss.aa_standard,
    ss.aaa_standard,
    ss.aaaa_standard,
    CASE
        WHEN spb.best_time <= ss.aaaa_standard THEN 'AAAA'
        WHEN spb.best_time <= ss.aaa_standard THEN 'AAA'
        WHEN spb.best_time <= ss.aa_standard THEN 'AA'
        WHEN spb.best_time <= ss.a_standard THEN 'A'
        WHEN spb.best_time <= ss.bb_standard THEN 'BB'
        WHEN spb.best_time <= ss.b_standard THEN 'B'
        ELSE 'Pre-B'
    END AS achieved_standard
FROM 
    swimmers s
    JOIN profiles p ON s.id = p.id
    JOIN swimmer_personal_bests spb ON s.id = spb.swimmer_id
    JOIN swim_standards ss ON s.age_group = ss.age_group 
        AND p.gender = ss.gender 
        AND spb.event = ss.event 
        AND spb.course = ss.course;


        -- Scheduled Job: Update plans
      -- Install pgBoss extension if not already installed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job to run daily at midnight
SELECT cron.schedule('check-and-update-age-groups', '0 0 * * *', 'SELECT check_and_update_age_groups()');

-- This updated plan includes:

-- A last_age_group_update column in the swimmers table to track when the age group was last updated.
-- A trigger that updates the age group whenever a swimmer's date of birth is inserted or updated.
-- A daily scheduled job that checks for swimmers whose birthdays are today or whose age groups haven't been updated in over a year, and updates their age groups accordingly.

-- This approach ensures that:

-- Age groups are immediately updated when a swimmer's date of birth is changed.
-- Age groups are updated on a swimmer's birthday.
-- There's a fallback to update age groups at least yearly, even if for some reason the birthday update is missed.




INSERT INTO swim_standards (age_group, gender, event, course, b_standard, bb_standard, a_standard, aa_standard, aaa_standard, aaaa_standard)
VALUES
-- 10 & under Girls SCY
('10 & under', 'Female', '50 FR', 'SCY', '39.79', '35.99', '32.09', '30.89', '29.59', '28.29'),
('10 & under', 'Female', '100 FR', 'SCY', '1:30.79', '1:21.09', '1:11.49', '1:08.29', '1:04.99', '1:01.79'),
('10 & under', 'Female', '200 FR', 'SCY', '3:22.79', '3:00.59', '2:38.39', '2:30.99', '2:23.59', '2:16.19'),
('10 & under', 'Female', '500 FR', 'SCY', '8:36.69', '7:45.09', '6:53.39', '6:36.19', '6:18.99', '6:01.69'),
('10 & under', 'Female', '50 BK', 'SCY', '48.59', '43.29', '37.99', '36.19', '34.39', '32.59'),
('10 & under', 'Female', '100 BK', 'SCY', '1:45.79', '1:33.99', '1:22.29', '1:18.39', '1:14.49', '1:10.59'),
('10 & under', 'Female', '50 BR', 'SCY', '54.59', '48.69', '42.79', '40.89', '38.89', '36.89'),
('10 & under', 'Female', '100 BR', 'SCY', '2:00.29', '1:46.89', '1:33.59', '1:29.09', '1:24.69', '1:20.19'),
('10 & under', 'Female', '50 FL', 'SCY', '48.39', '42.69', '36.99', '35.09', '33.19', '31.29'),
('10 & under', 'Female', '100 FL', 'SCY', '1:56.69', '1:41.39', '1:26.09', '1:20.99', '1:15.99', '1:10.89'),
('10 & under', 'Female', '100 IM', 'SCY', '1:44.29', '1:33.19', '1:22.09', '1:18.39', '1:14.69', '1:10.99'),
('10 & under', 'Female', '200 IM', 'SCY', '3:42.09', '3:18.79', '2:55.49', '2:47.69', '2:39.99', '2:32.19'),

-- 10 & under Boys SCY
('10 & under', 'Male', '50 FR', 'SCY', '38.19', '34.59', '31.09', '29.89', '28.69', '27.49'),
('10 & under', 'Male', '100 FR', 'SCY', '1:27.99', '1:18.89', '1:09.79', '1:06.79', '1:03.79', '1:00.69'),
('10 & under', 'Male', '200 FR', 'SCY', '3:09.49', '2:50.59', '2:31.59', '2:25.29', '2:18.99', '2:12.69'),
('10 & under', 'Male', '500 FR', 'SCY', '8:24.29', '7:33.79', '6:43.39', '6:26.59', '6:09.79', '5:52.99'),
('10 & under', 'Male', '50 BK', 'SCY', '48.29', '42.89', '37.59', '35.79', '33.99', '32.19'),
('10 & under', 'Male', '100 BK', 'SCY', '1:40.69', '1:30.09', '1:19.59', '1:16.09', '1:12.49', '1:08.99'),
('10 & under', 'Male', '50 BR', 'SCY', '53.39', '47.69', '42.09', '40.19', '38.29', '36.39'),
('10 & under', 'Male', '100 BR', 'SCY', '1:54.09', '1:42.29', '1:30.59', '1:26.59', '1:22.69', '1:18.79'),
('10 & under', 'Male', '50 FL', 'SCY', '46.49', '41.29', '35.99', '34.29', '32.59', '30.79'),
('10 & under', 'Male', '100 FL', 'SCY', '1:53.49', '1:38.99', '1:24.39', '1:19.49', '1:14.59', '1:09.79'),
('10 & under', 'Male', '100 IM', 'SCY', '1:39.69', '1:29.69', '1:19.69', '1:16.39', '1:13.09', '1:09.79'),
('10 & under', 'Male', '200 IM', 'SCY', '3:38.59', '3:15.99', '2:53.49', '2:45.89', '2:38.39', '2:30.89'),

-- 10 & under Girls SCM
('10 & under', 'Female', '50 FR', 'SCM', '43.99', '39.79', '35.49', '34.09', '32.69', '31.29'),
('10 & under', 'Female', '100 FR', 'SCM', '1:40.29', '1:29.69', '1:18.99', '1:15.39', '1:11.89', '1:08.29'),
('10 & under', 'Female', '200 FR', 'SCM', '3:43.99', '3:19.49', '2:54.99', '2:46.79', '2:38.59', '2:30.39'),
('10 & under', 'Female', '400 FR', 'SCM', '7:32.19', '6:46.89', '6:01.69', '5:46.69', '5:31.59', '5:16.49'),
('10 & under', 'Female', '50 BK', 'SCM', '53.69', '47.79', '41.89', '39.99', '37.99', '36.09'),
('10 & under', 'Female', '100 BK', 'SCM', '1:56.89', '1:43.89', '1:30.89', '1:26.59', '1:22.29', '1:17.99'),
('10 & under', 'Female', '50 BR', 'SCM', '1:00.29', '53.79', '47.29', '45.09', '42.99', '40.79'),
('10 & under', 'Female', '100 BR', 'SCM', '2:12.89', '1:58.19', '1:43.39', '1:38.49', '1:33.59', '1:28.69'),
('10 & under', 'Female', '50 FL', 'SCM', '53.49', '47.19', '40.89', '38.79', '36.69', '34.59'),
('10 & under', 'Female', '100 FL', 'SCM', '2:08.89', '1:52.09', '1:35.19', '1:29.49', '1:23.89', '1:18.29'),
('10 & under', 'Female', '100 IM', 'SCM', '1:55.19', '1:42.99', '1:30.69', '1:26.59', '1:22.49', '1:18.39'),
('10 & under', 'Female', '200 IM', 'SCM', '4:05.39', '3:39.59', '3:13.89', '3:05.29', '2:56.79', '2:48.19'),

-- 10 & under Boys SCM
('10 & under', 'Male', '50 FR', 'SCM', '42.19', '38.19', '34.29', '32.99', '31.69', '30.39'),
('10 & under', 'Male', '100 FR', 'SCM', '1:37.19', '1:27.19', '1:17.09', '1:13.79', '1:10.39', '1:07.09'),
('10 & under', 'Male', '200 FR', 'SCM', '3:29.39', '3:08.49', '2:47.49', '2:40.59', '2:33.59', '2:26.59'),
('10 & under', 'Male', '400 FR', 'SCM', '7:21.19', '6:37.09', '5:52.99', '5:38.29', '5:23.59', '5:08.89'),
('10 & under', 'Male', '50 BK', 'SCM', '53.39', '47.39', '41.49', '39.59', '37.59', '35.59'),
('10 & under', 'Male', '100 BK', 'SCM', '1:51.19', '1:39.59', '1:27.89', '1:23.99', '1:20.09', '1:16.29'),
('10 & under', 'Male', '50 BR', 'SCM', '58.99', '52.79', '46.49', '44.39', '42.29', '40.19'),
('10 & under', 'Male', '100 BR', 'SCM', '2:06.09', '1:53.09', '1:40.09', '1:35.69', '1:31.39', '1:26.99'),
('10 & under', 'Male', '50 FL', 'SCM', '51.39', '45.59', '39.79', '37.89', '35.99', '33.99'),
('10 & under', 'Male', '100 FL', 'SCM', '2:05.49', '1:49.29', '1:33.19', '1:27.79', '1:22.49', '1:17.09'),
('10 & under', 'Male', '100 IM', 'SCM', '1:50.09', '1:39.09', '1:28.09', '1:24.39', '1:20.79', '1:17.09'),
('10 & under', 'Male', '200 IM', 'SCM', '4:01.59', '3:36.59', '3:11.69', '3:03.39', '2:55.09', '2:46.69'),

-- 10 & under Girls LCM
('10 & under', 'Female', '50 FR', 'LCM', '45.29', '40.89', '36.59', '35.09', '33.69', '32.19'),
('10 & under', 'Female', '100 FR', 'LCM', '1:44.09', '1:32.99', '1:21.89', '1:18.19', '1:14.49', '1:10.79'),
('10 & under', 'Female', '200 FR', 'LCM', '3:50.99', '3:25.69', '3:00.39', '2:51.99', '2:43.49', '2:35.09'),
('10 & under', 'Female', '400 FR', 'LCM', '7:48.59', '7:01.69', '6:14.89', '5:59.29', '5:43.69', '5:27.99'),
('10 & under', 'Female', '50 BK', 'LCM', '55.79', '49.69', '43.59', '41.59', '39.49', '37.49'),
('10 & under', 'Female', '100 BK', 'LCM', '2:01.59', '1:48.09', '1:34.59', '1:30.09', '1:25.59', '1:21.09'),
('10 & under', 'Female', '50 BR', 'LCM', '1:02.19', '55.49', '48.79', '46.49', '44.29', '42.09'),
('10 & under', 'Female', '100 BR', 'LCM', '2:19.39', '2:03.89', '1:48.39', '1:43.29', '1:38.09', '1:32.99'),
('10 & under', 'Female', '50 FL', 'LCM', '54.49', '48.09', '41.59', '39.49', '37.29', '35.19'),
('10 & under', 'Female', '100 FL', 'LCM', '2:12.79', '1:55.39', '1:37.99', '1:32.19', '1:26.39', '1:20.59'),
('10 & under', 'Female', '200 IM', 'LCM', '4:15.69', '3:48.89', '3:22.09', '3:13.09', '3:04.19', '2:55.29'),

-- 10 & under Boys LCM
('10 & under', 'Male', '50 FR', 'LCM', '43.89', '39.79', '35.69', '34.39', '32.99', '31.59'),
('10 & under', 'Male', '100 FR', 'LCM', '1:40.99', '1:30.59', '1:20.19', '1:16.69', '1:13.19', '1:09.79'),
('10 & under', 'Male', '200 FR', 'LCM', '3:36.69', '3:14.99', '2:53.39', '2:46.09', '2:38.89', '2:31.69'),
('10 & under', 'Male', '400 FR', 'LCM', '7:38.29', '6:52.49', '6:06.59', '5:51.39', '5:36.09', '5:20.79'),
('10 & under', 'Male', '50 BK', 'LCM', '55.39', '49.29', '43.09', '41.09', '38.99', '36.99'),
('10 & under', 'Male', '100 BK', 'LCM', '1:56.69', '1:44.49', '1:32.29', '1:28.19', '1:24.09', '1:19.99'),
('10 & under', 'Male', '50 BR', 'LCM', '1:00.89', '54.39', '47.89', '45.79', '43.59', '41.49'),
('10 & under', 'Male', '100 BR', 'LCM', '2:12.89', '1:59.19', '1:45.49', '1:40.89', '1:36.29', '1:31.69'),
('10 & under', 'Male', '50 FL', 'LCM', '52.29', '46.39', '40.59', '38.59', '36.59', '34.69'),
('10 & under', 'Male', '100 FL', 'LCM', '2:09.49', '1:52.89', '1:36.19', '1:30.69', '1:25.09', '1:19.59'),
('10 & under', 'Male', '200 IM', 'LCM', '4:09.49', '3:43.69', '3:17.89', '3:09.39', '3:00.79', '2:52.19'),

-- 11-12 Girls SCY
('11-12', 'Female', '50 FR', 'SCY', '33.99', '31.69', '29.29', '28.09', '26.99', '25.79'),
('11-12', 'Female', '100 FR', 'SCY', '1:14.69', '1:09.39', '1:03.99', '1:01.39', '58.69', '55.99'),
('11-12', 'Female', '200 FR', 'SCY', '2:42.59', '2:30.89', '2:19.29', '2:13.49', '2:07.69', '2:01.89'),
('11-12', 'Female', '500 FR', 'SCY', '7:16.89', '6:45.69', '6:14.49', '5:58.89', '5:43.29', '5:27.69'),
('11-12', 'Female', '1000 FR', 'SCY', '15:02.69', '13:58.19', '12:53.79', '12:21.49', '11:49.29', '11:16.99'),
('11-12', 'Female', '1650 FR', 'SCY', '25:07.39', '23:19.69', '21:32.09', '20:38.19', '19:44.39', '18:50.59'),
('11-12', 'Female', '50 BK', 'SCY', '38.79', '35.99', '33.19', '31.79', '30.49', '29.09'),
('11-12', 'Female', '100 BK', 'SCY', '1:26.59', '1:19.79', '1:12.99', '1:09.59', '1:06.19', '1:02.69'),
('11-12', 'Female', '200 BK', 'SCY', '2:59.49', '2:46.69', '2:33.89', '2:27.49', '2:20.99', '2:14.59'),
('11-12', 'Female', '50 BR', 'SCY', '43.99', '40.89', '37.69', '36.19', '34.59', '32.99'),
('11-12', 'Female', '100 BR', 'SCY', '1:36.49', '1:29.29', '1:22.19', '1:18.59', '1:15.09', '1:11.49'),
('11-12', 'Female', '200 BR', 'SCY', '3:25.69', '3:10.99', '2:56.29', '2:48.99', '2:41.69', '2:34.29'),
('11-12', 'Female', '50 FL', 'SCY', '36.89', '34.29', '31.59', '30.29', '28.99', '27.69'),
('11-12', 'Female', '100 FL', 'SCY', '1:25.79', '1:18.89', '1:12.09', '1:08.59', '1:05.19', '1:01.79'),
('11-12', 'Female', '200 FL', 'SCY', '3:03.39', '2:50.29', '2:37.19', '2:30.59', '2:24.09', '2:17.59'),
('11-12', 'Female', '100 IM', 'SCY', '1:25.19', '1:19.09', '1:13.09', '1:09.99', '1:06.99', '1:03.89'),
('11-12', 'Female', '200 IM', 'SCY', '3:03.89', '2:50.69', '2:37.59', '2:30.99', '2:24.49', '2:17.89'),
('11-12', 'Female', '400 IM', 'SCY', '6:31.69', '6:03.69', '5:35.79', '5:21.79', '5:07.79', '4:53.79'),

-- 11-12 Boys SCY
('11-12', 'Male', '50 FR', 'SCY', '32.79', '30.49', '28.09', '26.99', '25.79', '24.59'),
('11-12', 'Male', '100 FR', 'SCY', '1:11.49', '1:06.39', '1:01.29', '58.69', '56.19', '53.59'),
('11-12', 'Male', '200 FR', 'SCY', '2:35.99', '2:24.89', '2:13.69', '2:08.19', '2:02.59', '1:56.99'),
('11-12', 'Male', '500 FR', 'SCY', '6:59.89', '6:29.99', '5:59.99', '5:44.99', '5:29.99', '5:14.99'),
('11-12', 'Male', '1000 FR', 'SCY', '14:43.49', '13:40.39', '12:37.29', '12:05.79', '11:34.19', '11:02.59'),
('11-12', 'Male', '1650 FR', 'SCY', '24:27.69', '22:42.89', '20:58.09', '20:05.59', '19:13.19', '18:20.79'),
('11-12', 'Male', '50 BK', 'SCY', '38.49', '35.59', '32.69', '31.19', '29.69', '28.19'),
('11-12', 'Male', '100 BK', 'SCY', '1:22.19', '1:15.69', '1:09.29', '1:05.99', '1:02.79', '59.49'),
('11-12', 'Male', '200 BK', 'SCY', '2:52.89', '2:40.49', '2:28.19', '2:21.99', '2:15.89', '2:09.69'),
('11-12', 'Male', '50 BR', 'SCY', '43.49', '40.09', '36.69', '34.99', '33.29', '31.49'),
('11-12', 'Male', '100 BR', 'SCY', '1:32.59', '1:25.49', '1:18.39', '1:14.89', '1:11.39', '1:07.79'),
('11-12', 'Male', '200 BR', 'SCY', '3:16.39', '3:02.39', '2:48.39', '2:41.39', '2:34.39', '2:27.29'),
('11-12', 'Male', '50 FL', 'SCY', '37.09', '34.19', '31.19', '29.69', '28.19', '26.69'),
('11-12', 'Male', '100 FL', 'SCY', '1:22.89', '1:16.09', '1:09.29', '1:05.89', '1:02.49', '59.09'),
('11-12', 'Male', '200 FL', 'SCY', '2:56.59', '2:43.99', '2:31.39', '2:24.99', '2:18.69', '2:12.39'),
('11-12', 'Male', '100 IM', 'SCY', '1:21.89', '1:15.89', '1:09.99', '1:06.99', '1:03.99', '1:01.09'),
('11-12', 'Male', '200 IM', 'SCY', '2:59.29', '2:45.79', '2:32.29', '2:25.59', '2:18.79', '2:12.09'),
('11-12', 'Male', '400 IM', 'SCY', '6:17.09', '5:50.09', '5:23.19', '5:09.79', '4:56.29', '4:42.79'),

-- 11-12 Girls SCM
('11-12', 'Female', '50 FR', 'SCM', '37.59', '34.99', '32.39', '31.09', '29.79', '28.49'),
('11-12', 'Female', '100 FR', 'SCM', '1:22.49', '1:16.59', '1:10.69', '1:07.79', '1:04.89', '1:01.89'),
('11-12', 'Female', '200 FR', 'SCM', '2:59.59', '2:46.79', '2:33.99', '2:27.59', '2:21.09', '2:14.69'),
('11-12', 'Female', '400 FR', 'SCM', '6:22.29', '5:54.99', '5:27.69', '5:14.09', '5:00.39', '4:46.79'),
('11-12', 'Female', '800 FR', 'SCM', '13:09.89', '12:13.49', '11:16.99', '10:48.79', '10:20.59', '9:52.39'),
('11-12', 'Female', '1500 FR', 'SCM', '24:58.39', '23:11.29', '21:24.29', '20:30.79', '19:37.29', '18:43.79'),
('11-12', 'Female', '50 BK', 'SCM', '42.79', '39.79', '36.69', '35.19', '33.59', '32.09'),
('11-12', 'Female', '100 BK', 'SCM', '1:35.69', '1:28.19', '1:20.59', '1:16.89', '1:13.09', '1:09.29'),
('11-12', 'Female', '200 BK', 'SCM', '3:18.29', '3:04.19', '2:49.99', '2:42.89', '2:35.79', '2:28.79'),
('11-12', 'Female', '50 BR', 'SCM', '48.59', '45.19', '41.69', '39.89', '38.19', '36.49'),
('11-12', 'Female', '100 BR', 'SCM', '1:46.59', '1:38.69', '1:30.79', '1:26.89', '1:22.99', '1:18.99'),
('11-12', 'Female', '200 BR', 'SCM', '3:47.29', '3:31.09', '3:14.89', '3:06.69', '2:58.59', '2:50.49'),
('11-12', 'Female', '50 FL', 'SCM', '40.79', '37.79', '34.89', '33.49', '31.99', '30.59'),
('11-12', 'Female', '100 FL', 'SCM', '1:34.79', '1:27.19', '1:19.59', '1:15.79', '1:12.09', '1:08.29'),
('11-12', 'Female', '200 FL', 'SCM', '3:22.59', '3:08.19', '2:53.69', '2:46.49', '2:39.19', '2:31.99'),
('11-12', 'Female', '100 IM', 'SCM', '1:34.19', '1:27.49', '1:20.69', '1:17.39', '1:13.99', '1:10.59'),
('11-12', 'Female', '200 IM', 'SCM', '3:23.19', '3:08.69', '2:54.19', '2:46.89', '2:39.59', '2:32.39'),
('11-12', 'Female', '400 IM', 'SCM', '7:12.79', '6:41.89', '6:10.99', '5:55.59', '5:40.09', '5:24.59'),

-- 11-12 Boys SCM
('11-12', 'Male', '50 FR', 'SCM', '36.29', '33.69', '31.09', '29.79', '28.49', '27.19'),
('11-12', 'Male', '100 FR', 'SCM', '1:18.99', '1:13.29', '1:07.69', '1:04.89', '1:02.09', '59.19'),
('11-12', 'Male', '200 FR', 'SCM', '2:52.39', '2:40.09', '2:27.79', '2:21.59', '2:15.49', '2:09.29'),
('11-12', 'Male', '400 FR', 'SCM', '6:07.49', '5:41.19', '5:14.99', '5:01.79', '4:48.69', '4:35.59'),
('11-12', 'Male', '800 FR', 'SCM', '12:53.09', '11:57.89', '11:02.59', '10:34.99', '10:07.39', '9:39.79'),
('11-12', 'Male', '1500 FR', 'SCM', '24:18.89', '22:34.69', '20:50.49', '19:58.39', '19:06.29', '18:14.19'),
('11-12', 'Male', '50 BK', 'SCM', '42.59', '39.29', '36.09', '34.49', '32.79', '31.19'),
('11-12', 'Male', '100 BK', 'SCM', '1:30.79', '1:23.69', '1:16.49', '1:12.89', '1:09.39', '1:05.79'),
('11-12', 'Male', '200 BK', 'SCM', '3:10.99', '2:57.39', '2:43.69', '2:36.89', '2:30.09', '2:23.29'),
('11-12', 'Male', '50 BR', 'SCM', '48.09', '44.29', '40.49', '38.59', '36.69', '34.89'),
('11-12', 'Male', '100 BR', 'SCM', '1:42.29', '1:34.49', '1:26.69', '1:22.79', '1:18.89', '1:14.99'),
('11-12', 'Male', '200 BR', 'SCM', '3:37.09', '3:21.59', '3:06.09', '2:58.29', '2:50.59', '2:42.79'),
('11-12', 'Male', '50 FL', 'SCM', '40.99', '37.69', '34.49', '32.79', '31.19', '29.59'),
('11-12', 'Male', '100 FL', 'SCM', '1:31.59', '1:24.09', '1:16.49', '1:12.79', '1:08.99', '1:05.29'),
('11-12', 'Male', '200 FL', 'SCM', '3:15.09', '3:01.19', '2:47.19', '2:40.29', '2:33.29', '2:26.29'),
('11-12', 'Male', '100 IM', 'SCM', '1:30.49', '1:23.89', '1:17.29', '1:13.99', '1:10.69', '1:07.49'),
('11-12', 'Male', '200 IM', 'SCM', '3:18.09', '3:03.19', '2:48.29', '2:40.89', '2:33.39', '2:25.99'),
('11-12', 'Male', '400 IM', 'SCM', '6:56.69', '6:26.89', '5:57.19', '5:42.29', '5:27.39', '5:12.49'),

-- 11-12 Girls LCM
('11-12', 'Female', '50 FR', 'LCM', '38.49', '35.89', '33.19', '31.89', '30.49', '29.19'),
('11-12', 'Female', '100 FR', 'LCM', '1:25.59', '1:19.49', '1:13.39', '1:10.29', '1:07.19', '1:04.19'),
('11-12', 'Female', '200 FR', 'LCM', '3:06.39', '2:53.09', '2:39.79', '2:33.09', '2:26.49', '2:19.79'),
('11-12', 'Female', '400 FR', 'LCM', '6:32.89', '6:04.79', '5:36.79', '5:22.79', '5:08.69', '4:54.69'),
('11-12', 'Female', '800 FR', 'LCM', '13:41.59', '12:42.89', '11:44.19', '11:14.89', '10:45.49', '10:16.19'),
('11-12', 'Female', '1500 FR', 'LCM', '26:06.89', '24:14.99', '22:22.99', '21:27.09', '20:31.09', '19:35.19'),
('11-12', 'Female', '50 BK', 'LCM', '44.79', '41.59', '38.39', '36.79', '35.19', '33.59'),
('11-12', 'Female', '100 BK', 'LCM', '1:40.59', '1:32.69', '1:24.79', '1:20.79', '1:16.89', '1:12.89'),
('11-12', 'Female', '200 BK', 'LCM', '3:28.09', '3:13.29', '2:58.39', '2:50.99', '2:43.49', '2:36.09'),
('11-12', 'Female', '50 BR', 'LCM', '49.79', '46.19', '42.69', '40.89', '39.09', '37.39'),
('11-12', 'Female', '100 BR', 'LCM', '1:50.39', '1:42.19', '1:33.99', '1:29.99', '1:25.89', '1:21.79'),
('11-12', 'Female', '200 BR', 'LCM', '3:56.79', '3:39.89', '3:22.99', '3:14.49', '3:06.09', '2:57.59'),
('11-12', 'Female', '50 FL', 'LCM', '41.79', '38.79', '35.79', '34.29', '32.89', '31.39'),
('11-12', 'Female', '100 FL', 'LCM', '1:38.29', '1:30.49', '1:22.59', '1:18.69', '1:14.79', '1:10.79'),
('11-12', 'Female', '200 FL', 'LCM', '3:31.09', '3:15.99', '3:00.89', '2:53.39', '2:45.89', '2:38.29'),
('11-12', 'Female', '200 IM', 'LCM', '3:30.59', '3:15.59', '3:00.59', '2:52.99', '2:45.49', '2:37.99'),
('11-12', 'Female', '400 IM', 'LCM', '7:28.89', '6:56.79', '6:24.79', '6:08.69', '5:52.69', '5:36.69'),

-- 11-12 Boys LCM
('11-12', 'Male', '50 FR', 'LCM', '37.39', '34.79', '32.09', '30.69', '29.39', '28.09'),
('11-12', 'Male', '100 FR', 'LCM', '1:22.09', '1:16.19', '1:10.39', '1:07.49', '1:04.49', '1:01.59'),
('11-12', 'Male', '200 FR', 'LCM', '2:59.19', '2:46.39', '2:33.59', '2:27.19', '2:20.79', '2:14.39'),
('11-12', 'Male', '400 FR', 'LCM', '6:21.09', '5:53.89', '5:26.69', '5:13.09', '4:59.49', '4:45.89'),
('11-12', 'Male', '800 FR', 'LCM', '13:20.19', '12:22.99', '11:25.89', '10:57.29', '10:28.69', '10:00.09'),
('11-12', 'Male', '1500 FR', 'LCM', '25:51.79', '24:00.99', '22:10.19', '21:14.69', '20:19.29', '19:23.89'),
('11-12', 'Male', '50 BK', 'LCM', '44.49', '41.09', '37.69', '35.99', '34.29', '32.59'),
('11-12', 'Male', '100 BK', 'LCM', '1:37.19', '1:29.59', '1:21.89', '1:18.09', '1:14.29', '1:10.39'),
('11-12', 'Male', '200 BK', 'LCM', '3:22.99', '3:08.49', '2:53.99', '2:46.69', '2:39.49', '2:32.19'),
('11-12', 'Male', '50 BR', 'LCM', '49.79', '45.89', '41.99', '39.99', '38.09', '36.09'),
('11-12', 'Male', '100 BR', 'LCM', '1:47.79', '1:39.59', '1:31.29', '1:27.19', '1:23.09', '1:18.99'),
('11-12', 'Male', '200 BR', 'LCM', '3:47.89', '3:31.59', '3:15.39', '3:07.19', '2:59.09', '2:50.99'),
('11-12', 'Male', '50 FL', 'LCM', '41.99', '38.69', '35.29', '33.59', '31.99', '30.29'),
('11-12', 'Male', '100 FL', 'LCM', '1:35.09', '1:27.29', '1:19.49', '1:15.59', '1:11.69', '1:07.79'),
('11-12', 'Male', '200 FL', 'LCM', '3:24.79', '3:10.19', '2:55.59', '2:48.29', '2:40.89', '2:33.59'),
('11-12', 'Male', '200 IM', 'LCM', '3:24.39', '3:08.99', '2:53.69', '2:45.99', '2:38.29', '2:30.59'),
('11-12', 'Male', '400 IM', 'LCM', '7:17.89', '6:46.59', '6:15.39', '5:59.69', '5:44.09', '5:28.39'),

-- 13-14 Girls SCY
('13-14', 'Female', '50 FR', 'SCY', '32.49', '30.19', '27.89', '26.69', '25.59', '24.39'),
('13-14', 'Female', '100 FR', 'SCY', '1:10.99', '1:05.89', '1:00.89', '58.29', '55.79', '53.29'),
('13-14', 'Female', '200 FR', 'SCY', '2:33.59', '2:22.69', '2:11.69', '2:06.19', '2:00.69', '1:55.29'),
('13-14', 'Female', '500 FR', 'SCY', '6:52.19', '6:22.79', '5:53.39', '5:38.59', '5:23.89', '5:09.19'),
('13-14', 'Female', '1000 FR', 'SCY', '14:11.09', '13:10.29', '12:09.49', '11:39.09', '11:08.69', '10:38.29'),
('13-14', 'Female', '1650 FR', 'SCY', '23:42.89', '22:01.19', '20:19.59', '19:28.79', '18:37.99', '17:47.19'),
('13-14', 'Female', '100 BK', 'SCY', '1:16.89', '1:11.39', '1:05.89', '1:03.19', '1:00.49', '57.69'),
('13-14', 'Female', '200 BK', 'SCY', '2:46.39', '2:34.49', '2:22.59', '2:16.69', '2:10.69', '2:04.79'),
('13-14', 'Female', '100 BR', 'SCY', '1:28.69', '1:22.29', '1:15.99', '1:12.89', '1:09.69', '1:06.49'),
('13-14', 'Female', '200 BR', 'SCY', '3:10.99', '2:57.39', '2:43.79', '2:36.89', '2:30.09', '2:23.29'),
('13-14', 'Female', '100 FL', 'SCY', '1:16.79', '1:11.29', '1:05.89', '1:03.09', '1:00.39', '57.59'),
('13-14', 'Female', '200 FL', 'SCY', '2:51.19', '2:38.99', '2:26.69', '2:20.59', '2:14.49', '2:08.39'),
('13-14', 'Female', '200 IM', 'SCY', '2:51.79', '2:39.49', '2:27.19', '2:21.09', '2:14.99', '2:08.79'),
('13-14', 'Female', '400 IM', 'SCY', '6:05.79', '5:39.69', '5:13.49', '5:00.49', '4:47.39', '4:34.29'),

-- 13-14 Boys SCY
('13-14', 'Male', '50 FR', 'SCY', '29.89', '27.69', '25.59', '24.59', '23.49', '22.39'),
('13-14', 'Male', '100 FR', 'SCY', '1:04.99', '1:00.29', '55.69', '53.39', '51.09', '48.69'),
('13-14', 'Male', '200 FR', 'SCY', '2:22.49', '2:12.29', '2:02.19', '1:57.09', '1:51.99', '1:46.89'),
('13-14', 'Male', '500 FR', 'SCY', '6:25.69', '5:58.19', '5:30.59', '5:16.89', '5:03.09', '4:49.29'),
('13-14', 'Male', '1000 FR', 'SCY', '13:17.99', '12:20.99', '11:23.99', '10:55.49', '10:26.99', '9:58.49'),
('13-14', 'Male', '1650 FR', 'SCY', '22:22.89', '20:46.99', '19:11.09', '18:23.09', '17:35.19', '16:47.19'),
('13-14', 'Male', '100 BK', 'SCY', '1:11.29', '1:06.19', '1:01.09', '58.59', '55.99', '53.49'),
('13-14', 'Male', '200 BK', 'SCY', '2:34.69', '2:23.69', '2:12.59', '2:07.09', '2:01.59', '1:55.99'),
('13-14', 'Male', '100 BR', 'SCY', '1:20.49', '1:14.79', '1:08.99', '1:06.19', '1:03.29', '1:00.39'),
('13-14', 'Male', '200 BR', 'SCY', '2:54.89', '2:42.39', '2:29.89', '2:23.59', '2:17.39', '2:11.19'),
('13-14', 'Male', '100 FL', 'SCY', '1:10.49', '1:05.49', '1:00.39', '57.89', '55.39', '52.89'),
('13-14', 'Male', '200 FL', 'SCY', '2:36.79', '2:25.59', '2:14.39', '2:08.79', '2:03.19', '1:57.59'),
('13-14', 'Male', '200 IM', 'SCY', '2:37.99', '2:26.69', '2:15.39', '2:09.79', '2:04.09', '1:58.49'),
('13-14', 'Male', '400 IM', 'SCY', '5:37.69', '5:13.59', '4:49.49', '4:37.39', '4:25.39', '4:13.29'),

-- 13-14 Girls SCM
('13-14', 'Female', '50 FR', 'SCM', '35.99', '33.39', '30.79', '29.49', '28.29', '26.99'),
('13-14', 'Female', '100 FR', 'SCM', '1:18.49', '1:12.89', '1:07.29', '1:04.49', '1:01.69', '58.89'),
('13-14', 'Female', '200 FR', 'SCM', '2:49.79', '2:37.69', '2:25.49', '2:19.49', '2:13.39', '2:07.29'),
('13-14', 'Female', '400 FR', 'SCM', '6:00.69', '5:34.99', '5:09.19', '4:56.29', '4:43.39', '4:30.59'),
('13-14', 'Female', '800 FR', 'SCM', '12:24.69', '11:31.49', '10:38.29', '10:11.69', '9:45.09', '9:18.49'),
('13-14', 'Female', '1500 FR', 'SCM', '23:34.29', '21:53.29', '20:12.29', '19:21.79', '18:31.29', '17:40.79'),
('13-14', 'Female', '100 BK', 'SCM', '1:24.99', '1:18.89', '1:12.89', '1:09.79', '1:06.79', '1:03.79'),
('13-14', 'Female', '200 BK', 'SCM', '3:03.89', '2:50.69', '2:37.59', '2:30.99', '2:24.49', '2:17.89'),
('13-14', 'Female', '100 BR', 'SCM', '1:37.99', '1:30.99', '1:23.99', '1:20.49', '1:16.99', '1:13.49'),
('13-14', 'Female', '200 BR', 'SCM', '3:31.09', '3:15.99', '3:00.89', '2:53.39', '2:45.89', '2:38.29'),
('13-14', 'Female', '100 FL', 'SCM', '1:24.89', '1:18.79', '1:12.79', '1:09.69', '1:06.69', '1:03.69'),
('13-14', 'Female', '200 FL', 'SCM', '3:09.19', '2:55.69', '2:42.19', '2:35.39', '2:28.59', '2:21.89'),
('13-14', 'Female', '200 IM', 'SCM', '3:09.79', '2:56.19', '2:42.69', '2:35.89', '2:29.09', '2:22.39'),
('13-14', 'Female', '400 IM', 'SCM', '6:44.19', '6:15.29', '5:46.39', '5:31.99', '5:17.59', '5:03.09'),

-- 13-14 Boys SCM
('13-14', 'Male', '50 FR', 'SCM', '32.99', '30.69', '28.29', '27.09', '25.89', '24.79'),
('13-14', 'Male', '100 FR', 'SCM', '1:11.79', '1:06.69', '1:01.49', '58.99', '56.39', '53.89'),
('13-14', 'Male', '200 FR', 'SCM', '2:37.49', '2:26.19', '2:14.99', '2:09.39', '2:03.69', '1:58.09'),
('13-14', 'Male', '400 FR', 'SCM', '5:37.49', '5:13.39', '4:49.29', '4:37.29', '4:25.19', '4:13.19'),
('13-14', 'Male', '800 FR', 'SCM', '11:38.19', '10:48.39', '9:58.49', '9:33.59', '9:08.59', '8:43.69'),
('13-14', 'Male', '1500 FR', 'SCM', '22:14.89', '20:39.49', '19:04.19', '18:16.49', '17:28.79', '16:41.19'),
('13-14', 'Male', '100 BK', 'SCM', '1:18.79', '1:13.09', '1:07.49', '1:04.69', '1:01.89', '59.09'),
('13-14', 'Male', '200 BK', 'SCM', '2:50.99', '2:38.69', '2:26.49', '2:20.39', '2:14.29', '2:08.19'),
('13-14', 'Male', '100 BR', 'SCM', '1:28.99', '1:22.59', '1:16.29', '1:13.09', '1:09.89', '1:06.79'),
('13-14', 'Male', '200 BR', 'SCM', '3:13.19', '2:59.39', '2:45.59', '2:38.69', '2:31.79', '2:24.89'),
('13-14', 'Male', '100 FL', 'SCM', '1:17.89', '1:12.29', '1:06.79', '1:03.99', '1:01.19', '58.39'),
('13-14', 'Male', '200 FL', 'SCM', '2:53.29', '2:40.89', '2:28.49', '2:22.39', '2:16.19', '2:09.99'),
('13-14', 'Male', '200 IM', 'SCM', '2:54.49', '2:42.09', '2:29.59', '2:23.39', '2:17.09', '2:10.89'),
('13-14', 'Male', '400 IM', 'SCM', '6:13.19', '5:46.49', '5:19.89', '5:06.49', '4:53.19', '4:39.89'),

-- 13-14 Girls LCM
('13-14', 'Female', '50 FR', 'LCM', '37.19', '34.59', '31.89', '30.59', '29.29', '27.89'),
('13-14', 'Female', '100 FR', 'LCM', '1:21.19', '1:15.39', '1:09.59', '1:06.69', '1:03.79', '1:00.89'),
('13-14', 'Female', '200 FR', 'LCM', '2:55.29', '2:42.79', '2:30.29', '2:23.99', '2:17.79', '2:11.49'),
('13-14', 'Female', '400 FR', 'LCM', '6:08.09', '5:41.79', '5:15.49', '5:02.39', '4:49.19', '4:36.09'),
('13-14', 'Female', '800 FR', 'LCM', '12:45.49', '11:50.79', '10:56.09', '10:28.79', '10:01.49', '9:34.09'),
('13-14', 'Female', '1500 FR', 'LCM', '24:28.39', '22:43.49', '20:58.59', '20:06.19', '19:13.69', '18:21.29'),
('13-14', 'Female', '100 BK', 'LCM', '1:29.69', '1:23.29', '1:16.89', '1:13.69', '1:10.49', '1:07.29'),
('13-14', 'Female', '200 BK', 'LCM', '3:13.29', '2:59.49', '2:45.69', '2:38.79', '2:31.89', '2:24.99'),
('13-14', 'Female', '100 BR', 'LCM', '1:42.39', '1:34.99', '1:27.69', '1:24.09', '1:20.39', '1:16.79'),
('13-14', 'Female', '200 BR', 'LCM', '3:40.29', '3:24.59', '3:08.89', '3:00.99', '2:53.09', '2:45.29'),
('13-14', 'Female', '100 FL', 'LCM', '1:27.19', '1:20.99', '1:14.79', '1:11.69', '1:08.59', '1:05.39'),
('13-14', 'Female', '200 FL', 'LCM', '3:15.69', '3:01.69', '2:47.79', '2:40.79', '2:33.79', '2:26.79'),
('13-14', 'Female', '200 IM', 'LCM', '3:17.19', '3:03.09', '2:48.99', '2:41.99', '2:34.89', '2:27.89'),
('13-14', 'Female', '400 IM', 'LCM', '6:57.99', '6:28.19', '5:58.29', '5:43.39', '5:28.39', '5:13.49'),

-- 13-14 Boys LCM
('13-14', 'Male', '50 FR', 'LCM', '34.29', '31.79', '29.39', '28.19', '26.89', '25.69'),
('13-14', 'Male', '100 FR', 'LCM', '1:15.09', '1:09.79', '1:04.39', '1:01.69', '58.99', '56.39'),
('13-14', 'Male', '200 FR', 'LCM', '2:43.99', '2:32.29', '2:20.59', '2:14.69', '2:08.89', '2:02.99'),
('13-14', 'Male', '400 FR', 'LCM', '5:48.39', '5:23.49', '4:58.69', '4:46.19', '4:33.79', '4:21.29'),
('13-14', 'Male', '800 FR', 'LCM', '12:00.59', '11:09.19', '10:17.69', '9:51.99', '9:26.19', '9:00.49'),
('13-14', 'Male', '1500 FR', 'LCM', '23:04.59', '21:25.69', '19:46.79', '18:57.39', '18:07.89', '17:18.49'),
('13-14', 'Male', '100 BK', 'LCM', '1:23.69', '1:17.69', '1:11.69', '1:08.69', '1:05.79', '1:02.79'),
('13-14', 'Male', '200 BK', 'LCM', '3:01.79', '2:48.79', '2:35.79', '2:29.29', '2:22.79', '2:16.29'),
('13-14', 'Male', '100 BR', 'LCM', '1:33.79', '1:27.09', '1:20.39', '1:16.99', '1:13.69', '1:10.29'),
('13-14', 'Male', '200 BR', 'LCM', '3:22.79', '3:08.29', '2:53.79', '2:46.59', '2:39.39', '2:32.09'),
('13-14', 'Male', '100 FL', 'LCM', '1:20.29', '1:14.59', '1:08.89', '1:05.99', '1:03.09', '1:00.29'),
('13-14', 'Male', '200 FL', 'LCM', '2:59.69', '2:46.79', '2:33.99', '2:27.59', '2:21.19', '2:14.79'),
('13-14', 'Male', '200 IM', 'LCM', '3:02.89', '2:49.79', '2:36.69', '2:30.19', '2:23.69', '2:17.19'),
('13-14', 'Male', '400 IM', 'LCM', '6:30.69', '6:02.79', '5:34.89', '5:20.89', '5:06.99', '4:52.99'),

-- 15-16 Girls SCY
('15-16', 'Female', '50 FR', 'SCY', '31.79', '29.49', '27.29', '26.09', '24.99', '23.89'),
('15-16', 'Female', '100 FR', 'SCY', '1:08.79', '1:03.79', '58.89', '56.49', '53.99', '51.59'),
('15-16', 'Female', '200 FR', 'SCY', '2:28.99', '2:18.39', '2:07.69', '2:02.39', '1:57.09', '1:51.79'),
('15-16', 'Female', '500 FR', 'SCY', '6:40.99', '6:12.39', '5:43.69', '5:29.39', '5:15.09', '5:00.79'),
('15-16', 'Female', '1000 FR', 'SCY', '13:52.89', '12:53.49', '11:53.99', '11:24.19', '10:54.49', '10:24.69'),
('15-16', 'Female', '1650 FR', 'SCY', '23:15.89', '21:36.19', '19:56.49', '19:06.69', '18:16.79', '17:26.89'),
('15-16', 'Female', '100 BK', 'SCY', '1:14.69', '1:09.39', '1:04.09', '1:01.39', '58.69', '56.09'),
('15-16', 'Female', '200 BK', 'SCY', '2:42.19', '2:30.59', '2:19.09', '2:13.29', '2:07.49', '2:01.69'),
('15-16', 'Female', '100 BR', 'SCY', '1:25.89', '1:19.79', '1:13.69', '1:10.59', '1:07.49', '1:04.49'),
('15-16', 'Female', '200 BR', 'SCY', '3:05.99', '2:52.69', '2:39.39', '2:32.79', '2:26.19', '2:19.49'),
('15-16', 'Female', '100 FL', 'SCY', '1:14.39', '1:09.09', '1:03.79', '1:01.09', '58.39', '55.79'),
('15-16', 'Female', '200 FL', 'SCY', '2:45.79', '2:33.99', '2:22.09', '2:16.19', '2:10.29', '2:04.39'),
('15-16', 'Female', '200 IM', 'SCY', '2:46.19', '2:34.29', '2:22.39', '2:16.49', '2:10.59', '2:04.59'),
('15-16', 'Female', '400 IM', 'SCY', '5:54.99', '5:29.69', '5:04.29', '4:51.59', '4:38.99', '4:26.29'),

-- 15-16 Boys SCY
('15-16', 'Male', '50 FR', 'SCY', '28.29', '26.29', '24.19', '23.19', '22.19', '21.19'),
('15-16', 'Male', '100 FR', 'SCY', '1:01.99', '57.59', '53.19', '50.99', '48.79', '46.49'),
('15-16', 'Male', '200 FR', 'SCY', '2:15.99', '2:06.29', '1:56.59', '1:51.79', '1:46.89', '1:41.99'),
('15-16', 'Male', '500 FR', 'SCY', '6:08.39', '5:42.09', '5:15.79', '5:02.69', '4:49.49', '4:36.29'),
('15-16', 'Male', '1000 FR', 'SCY', '12:51.79', '11:56.69', '11:01.59', '10:33.99', '10:06.39', '9:38.89'),
('15-16', 'Male', '1650 FR', 'SCY', '21:26.59', '19:54.69', '18:22.79', '17:36.89', '16:50.89', '16:04.99'),
('15-16', 'Male', '100 BK', 'SCY', '1:07.49', '1:02.69', '57.89', '55.49', '53.09', '50.69'),
('15-16', 'Male', '200 BK', 'SCY', '2:27.59', '2:17.09', '2:06.59', '2:01.29', '1:55.99', '1:50.69'),
('15-16', 'Male', '100 BR', 'SCY', '1:16.89', '1:11.39', '1:05.89', '1:03.19', '1:00.39', '57.69'),
('15-16', 'Male', '200 BR', 'SCY', '2:47.09', '2:35.19', '2:23.19', '2:17.29', '2:11.29', '2:05.29'),
('15-16', 'Male', '100 FL', 'SCY', '1:07.19', '1:02.39', '57.59', '55.19', '52.79', '50.39'),
('15-16', 'Male', '200 FL', 'SCY', '2:30.19', '2:19.49', '2:08.79', '2:03.39', '1:58.09', '1:52.69'),
('15-16', 'Male', '200 IM', 'SCY', '2:30.89', '2:20.19', '2:09.39', '2:03.99', '1:58.59', '1:53.19'),
('15-16', 'Male', '400 IM', 'SCY', '5:22.19', '4:59.19', '4:36.19', '4:24.69', '4:13.19', '4:01.59'),

-- 15-16 Girls SCM
('15-16', 'Female', '50 FR', 'SCM', '35.09', '32.59', '30.09', '28.89', '27.59', '26.39'),
('15-16', 'Female', '100 FR', 'SCM', '1:15.99', '1:10.49', '1:05.09', '1:02.39', '59.69', '56.99'),
('15-16', 'Female', '200 FR', 'SCM', '2:44.69', '2:32.89', '2:21.19', '2:15.29', '2:09.39', '2:03.49'),
('15-16', 'Female', '400 FR', 'SCM', '5:50.89', '5:25.79', '5:00.79', '4:48.19', '4:35.69', '4:23.19'),
('15-16', 'Female', '800 FR', 'SCM', '12:08.79', '11:16.79', '10:24.69', '9:58.69', '9:32.69', '9:06.59'),
('15-16', 'Female', '1500 FR', 'SCM', '23:07.49', '21:28.39', '19:49.29', '18:59.79', '18:10.19', '17:20.69'),
('15-16', 'Female', '100 BK', 'SCM', '1:22.59', '1:16.69', '1:10.79', '1:07.79', '1:04.89', '1:01.99'),
('15-16', 'Female', '200 BK', 'SCM', '2:59.29', '2:46.49', '2:33.69', '2:27.29', '2:20.89', '2:14.49'),
('15-16', 'Female', '100 BR', 'SCM', '1:34.99', '1:28.19', '1:21.39', '1:17.99', '1:14.59', '1:11.19'),
('15-16', 'Female', '200 BR', 'SCM', '3:25.49', '3:10.89', '2:56.19', '2:48.79', '2:41.49', '2:34.19'),
('15-16', 'Female', '100 FL', 'SCM', '1:22.19', '1:16.29', '1:10.39', '1:07.49', '1:04.59', '1:01.59'),
('15-16', 'Female', '200 FL', 'SCM', '3:03.19', '2:50.09', '2:37.09', '2:30.49', '2:23.99', '2:17.39'),
('15-16', 'Female', '200 IM', 'SCM', '3:03.59', '2:50.49', '2:37.39', '2:30.79', '2:24.29', '2:17.69'),
('15-16', 'Female', '400 IM', 'SCM', '6:32.29', '6:04.29', '5:36.29', '5:22.29', '5:08.19', '4:54.19'),

-- 15-16 Boys SCM
('15-16', 'Male', '50 FR', 'SCM', '31.19', '28.99', '26.79', '25.69', '24.59', '23.39'),
('15-16', 'Male', '100 FR', 'SCM', '1:08.49', '1:03.69', '58.79', '56.29', '53.89', '51.39'),
('15-16', 'Male', '200 FR', 'SCM', '2:30.29', '2:19.59', '2:08.89', '2:03.49', '1:58.09', '1:52.79'),
('15-16', 'Male', '400 FR', 'SCM', '5:22.39', '4:59.39', '4:36.29', '4:24.79', '4:13.29', '4:01.79'),
('15-16', 'Male', '800 FR', 'SCM', '11:15.29', '10:27.09', '9:38.89', '9:14.79', '8:50.59', '8:26.49'),
('15-16', 'Male', '1500 FR', 'SCM', '21:18.89', '19:47.59', '18:16.19', '17:30.49', '16:44.89', '15:59.19'),
('15-16', 'Male', '100 BK', 'SCM', '1:14.59', '1:09.29', '1:03.99', '1:01.29', '58.59', '55.99'),
('15-16', 'Male', '200 BK', 'SCM', '2:43.09', '2:31.49', '2:19.79', '2:13.99', '2:08.19', '2:02.39'),
('15-16', 'Male', '100 BR', 'SCM', '1:24.99', '1:18.89', '1:12.79', '1:09.79', '1:06.79', '1:03.69'),
('15-16', 'Male', '200 BR', 'SCM', '3:04.59', '2:51.39', '2:38.29', '2:31.69', '2:25.09', '2:18.49'),
('15-16', 'Male', '100 FL', 'SCM', '1:14.29', '1:08.99', '1:03.69', '1:00.99', '58.39', '55.69'),
('15-16', 'Male', '200 FL', 'SCM', '2:45.99', '2:34.19', '2:22.29', '2:16.39', '2:10.39', '2:04.49'),
('15-16', 'Male', '200 IM', 'SCM', '2:46.79', '2:34.89', '2:22.99', '2:16.99', '2:11.09', '2:05.09'),
('15-16', 'Male', '400 IM', 'SCM', '5:55.99', '5:30.59', '5:05.19', '4:52.39', '4:39.69', '4:26.99'),

-- 15-16 Girls LCM
('15-16', 'Female', '50 FR', 'LCM', '36.09', '33.49', '30.89', '29.59', '28.29', '27.09'),
('15-16', 'Female', '100 FR', 'LCM', '1:18.39', '1:12.79', '1:07.19', '1:04.39', '1:01.59', '58.79'),
('15-16', 'Female', '200 FR', 'LCM', '2:49.19', '2:37.09', '2:25.09', '2:18.99', '2:12.99', '2:06.89'),
('15-16', 'Female', '400 FR', 'LCM', '5:55.19', '5:29.89', '5:04.49', '4:51.79', '4:39.09', '4:26.39'),
('15-16', 'Female', '800 FR', 'LCM', '12:17.79', '11:25.09', '10:32.39', '10:05.99', '9:39.69', '9:13.29'),
('15-16', 'Female', '1500 FR', 'LCM', '23:33.49', '21:52.49', '20:11.59', '19:21.09', '18:30.59', '17:40.09'),
('15-16', 'Female', '100 BK', 'LCM', '1:26.89', '1:20.69', '1:14.49', '1:11.39', '1:08.29', '1:05.19'),
('15-16', 'Female', '200 BK', 'LCM', '3:06.79', '2:53.39', '2:40.09', '2:33.39', '2:26.79', '2:20.09'),
('15-16', 'Female', '100 BR', 'LCM', '1:38.59', '1:31.59', '1:24.49', '1:20.99', '1:17.49', '1:13.99'),
('15-16', 'Female', '200 BR', 'LCM', '3:32.49', '3:17.29', '3:02.09', '2:54.49', '2:46.99', '2:39.39'),
('15-16', 'Female', '100 FL', 'LCM', '1:24.29', '1:18.29', '1:12.29', '1:09.29', '1:06.29', '1:03.29'),
('15-16', 'Female', '200 FL', 'LCM', '3:07.79', '2:54.39', '2:40.99', '2:34.29', '2:27.59', '2:20.89'),
('15-16', 'Female', '200 IM', 'LCM', '3:11.19', '2:57.49', '2:43.89', '2:36.99', '2:30.19', '2:23.39'),
('15-16', 'Female', '400 IM', 'LCM', '6:44.69', '6:15.79', '5:46.89', '5:32.49', '5:17.99', '5:03.59'),

-- 15-16 Boys LCM
('15-16', 'Male', '50 FR', 'LCM', '32.89', '30.59', '28.19', '26.99', '25.89', '24.69'),
('15-16', 'Male', '100 FR', 'LCM', '1:11.79', '1:06.69', '1:01.49', '58.99', '56.39', '53.79'),
('15-16', 'Male', '200 FR', 'LCM', '2:36.59', '2:25.39', '2:14.29', '2:08.69', '2:03.09', '1:57.49'),
('15-16', 'Male', '400 FR', 'LCM', '5:34.09', '5:10.19', '4:46.39', '4:34.39', '4:22.49', '4:10.59'),
('15-16', 'Male', '800 FR', 'LCM', '11:33.99', '10:44.39', '9:54.79', '9:29.99', '9:05.29', '8:40.49'),
('15-16', 'Male', '1500 FR', 'LCM', '22:08.29', '20:33.39', '18:58.49', '18:11.09', '17:23.59', '16:36.19'),
('15-16', 'Male', '100 BK', 'LCM', '1:19.39', '1:13.69', '1:07.99', '1:05.19', '1:02.39', '59.49'),
('15-16', 'Male', '200 BK', 'LCM', '2:52.29', '2:39.99', '2:27.69', '2:21.49', '2:15.39', '2:09.19'),
('15-16', 'Male', '100 BR', 'LCM', '1:29.49', '1:23.09', '1:16.69', '1:13.49', '1:10.29', '1:07.09'),
('15-16', 'Male', '200 BR', 'LCM', '3:14.49', '3:00.59', '2:46.69', '2:39.79', '2:32.79', '2:25.89'),
('15-16', 'Male', '100 FL', 'LCM', '1:16.79', '1:11.29', '1:05.79', '1:03.09', '1:00.29', '57.59'),
('15-16', 'Male', '200 FL', 'LCM', '2:51.69', '2:39.49', '2:27.19', '2:21.09', '2:14.89', '2:08.79'),
('15-16', 'Male', '200 IM', 'LCM', '2:56.19', '2:43.59', '2:30.99', '2:24.69', '2:18.39', '2:12.09'),
('15-16', 'Male', '400 IM', 'LCM', '6:14.69', '5:47.99', '5:21.19', '5:07.79', '4:54.39', '4:41.09'),

-- 17-18 Girls SCY
('17-18', 'Female', '50 FR', 'SCY', '31.39', '29.09', '26.89', '25.79', '24.69', '23.49'),
('17-18', 'Female', '100 FR', 'SCY', '1:08.09', '1:03.19', '58.39', '55.89', '53.49', '51.09'),
('17-18', 'Female', '200 FR', 'SCY', '2:27.19', '2:16.69', '2:06.19', '2:00.89', '1:55.69', '1:50.39'),
('17-18', 'Female', '500 FR', 'SCY', '6:36.49', '6:08.19', '5:39.89', '5:25.69', '5:11.59', '4:57.39'),
('17-18', 'Female', '1000 FR', 'SCY', '13:46.09', '12:47.09', '11:48.09', '11:18.59', '10:49.09', '10:19.59'),
('17-18', 'Female', '1650 FR', 'SCY', '22:47.19', '21:09.59', '19:31.89', '18:43.09', '17:54.29', '17:05.39'),
('17-18', 'Female', '100 BK', 'SCY', '1:13.39', '1:08.09', '1:02.89', '1:00.29', '57.69', '54.99'),
('17-18', 'Female', '200 BK', 'SCY', '2:38.79', '2:27.39', '2:16.09', '2:10.39', '2:04.79', '1:59.09'),
('17-18', 'Female', '100 BR', 'SCY', '1:24.79', '1:18.79', '1:12.69', '1:09.69', '1:06.69', '1:03.59'),
('17-18', 'Female', '200 BR', 'SCY', '3:04.69', '2:51.49', '2:38.29', '2:31.69', '2:25.09', '2:18.49'),
('17-18', 'Female', '100 FL', 'SCY', '1:13.59', '1:08.29', '1:03.09', '1:00.39', '57.79', '55.19'),
('17-18', 'Female', '200 FL', 'SCY', '2:42.79', '2:31.19', '2:19.49', '2:13.69', '2:07.89', '2:02.09'),
('17-18', 'Female', '200 IM', 'SCY', '2:43.59', '2:31.89', '2:20.19', '2:14.39', '2:08.49', '2:02.69'),
('17-18', 'Female', '400 IM', 'SCY', '5:50.69', '5:25.59', '5:00.59', '4:47.99', '4:35.49', '4:22.99'),

-- 17-18 Boys SCY
('17-18', 'Male', '50 FR', 'SCY', '27.59', '25.59', '23.59', '22.59', '21.69', '20.69'),
('17-18', 'Male', '100 FR', 'SCY', '1:00.29', '55.99', '51.69', '49.59', '47.39', '45.29'),
('17-18', 'Male', '200 FR', 'SCY', '2:13.59', '2:03.99', '1:54.49', '1:49.69', '1:44.99', '1:40.19'),
('17-18', 'Male', '500 FR', 'SCY', '6:03.19', '5:37.29', '5:11.39', '4:58.39', '4:45.39', '4:32.39'),
('17-18', 'Male', '1000 FR', 'SCY', '12:40.19', '11:45.89', '10:51.59', '10:24.49', '9:57.29', '9:30.19'),
('17-18', 'Male', '1650 FR', 'SCY', '21:08.99', '19:38.39', '18:07.69', '17:22.39', '16:37.09', '15:51.79'),
('17-18', 'Male', '100 BK', 'SCY', '1:05.19', '1:00.59', '55.89', '53.59', '51.29', '48.89'),
('17-18', 'Male', '200 BK', 'SCY', '2:23.89', '2:13.59', '2:03.29', '1:58.19', '1:53.09', '1:47.89'),
('17-18', 'Male', '100 BR', 'SCY', '1:14.69', '1:09.39', '1:03.99', '1:01.39', '58.69', '55.99'),
('17-18', 'Male', '200 BR', 'SCY', '2:42.29', '2:30.69', '2:19.09', '2:13.29', '2:07.49', '2:01.69'),
('17-18', 'Male', '100 FL', 'SCY', '1:05.39', '1:00.79', '56.09', '53.69', '51.39', '49.09'),
('17-18', 'Male', '200 FL', 'SCY', '2:26.39', '2:15.99', '2:05.49', '2:00.29', '1:55.09', '1:49.79'),
('17-18', 'Male', '200 IM', 'SCY', '2:27.39', '2:16.89', '2:06.39', '2:01.09', '1:55.89', '1:50.59'),
('17-18', 'Male', '400 IM', 'SCY', '5:17.39', '4:54.69', '4:31.99', '4:20.69', '4:09.39', '3:57.99'),

-- 17-18 Girls SCM
('17-18', 'Female', '50 FR', 'SCM', '34.69', '32.19', '29.69', '28.49', '27.19', '25.99'),
('17-18', 'Female', '100 FR', 'SCM', '1:15.19', '1:09.89', '1:04.49', '1:01.79', '59.09', '56.39'),
('17-18', 'Female', '200 FR', 'SCM', '2:42.69', '2:31.09', '2:19.39', '2:13.59', '2:07.79', '2:01.99'),
('17-18', 'Female', '400 FR', 'SCM', '5:46.89', '5:22.19', '4:57.39', '4:44.99', '4:32.59', '4:20.19'),
('17-18', 'Female', '800 FR', 'SCM', '12:02.79', '11:11.19', '10:19.59', '9:53.69', '9:27.89', '9:02.09'),
('17-18', 'Female', '1500 FR', 'SCM', '22:38.99', '21:01.99', '19:24.89', '18:36.39', '17:47.79', '16:59.29'),
('17-18', 'Female', '100 BK', 'SCM', '1:21.09', '1:15.29', '1:09.49', '1:06.59', '1:03.69', '1:00.79'),
('17-18', 'Female', '200 BK', 'SCM', '2:55.39', '2:42.89', '2:30.39', '2:24.09', '2:17.79', '2:11.59'),
('17-18', 'Female', '100 BR', 'SCM', '1:33.69', '1:27.09', '1:20.39', '1:16.99', '1:13.69', '1:10.29'),
('17-18', 'Female', '200 BR', 'SCM', '3:24.09', '3:09.49', '2:54.89', '2:47.59', '2:40.39', '2:33.09'),
('17-18', 'Female', '100 FL', 'SCM', '1:21.29', '1:15.49', '1:09.69', '1:06.79', '1:03.89', '1:00.99'),
('17-18', 'Female', '200 FL', 'SCM', '2:59.89', '2:46.99', '2:34.19', '2:27.69', '2:21.29', '2:14.89'),
('17-18', 'Female', '200 IM', 'SCM', '3:00.69', '2:47.79', '2:34.89', '2:28.49', '2:21.99', '2:15.59'),
('17-18', 'Female', '400 IM', 'SCM', '6:27.49', '5:59.79', '5:32.09', '5:18.29', '5:04.49', '4:50.59'),

-- 17-18 Boys SCM
('17-18', 'Male', '50 FR', 'SCM', '30.39', '28.29', '26.09', '24.99', '23.89', '22.79'),
('17-18', 'Male', '100 FR', 'SCM', '1:06.69', '1:01.89', '57.19', '54.79', '52.39', '49.99'),
('17-18', 'Male', '200 FR', 'SCM', '2:27.59', '2:17.09', '2:06.49', '2:01.29', '1:55.99', '1:50.69'),
('17-18', 'Male', '400 FR', 'SCM', '5:17.79', '4:55.09', '4:32.39', '4:21.09', '4:09.69', '3:58.39'),
('17-18', 'Male', '800 FR', 'SCM', '11:05.19', '10:17.69', '9:30.19', '9:06.39', '8:42.69', '8:18.89'),
('17-18', 'Male', '1500 FR', 'SCM', '21:01.39', '19:31.29', '18:01.19', '17:16.19', '16:31.09', '15:46.09'),
('17-18', 'Male', '100 BK', 'SCM', '1:12.09', '1:06.89', '1:01.79', '59.19', '56.59', '54.09'),
('17-18', 'Male', '200 BK', 'SCM', '2:38.99', '2:27.59', '2:16.29', '2:10.59', '2:04.89', '1:59.29'),
('17-18', 'Male', '100 BR', 'SCM', '1:22.49', '1:16.59', '1:10.69', '1:07.79', '1:04.89', '1:01.89'),
('17-18', 'Male', '200 BR', 'SCM', '2:59.29', '2:46.49', '2:33.69', '2:27.29', '2:20.89', '2:14.49'),
('17-18', 'Male', '100 FL', 'SCM', '1:12.29', '1:07.09', '1:01.99', '59.39', '56.79', '54.19'),
('17-18', 'Male', '200 FL', 'SCM', '2:41.79', '2:30.19', '2:18.69', '2:12.89', '2:07.09', '2:01.39'),
('17-18', 'Male', '200 IM', 'SCM', '2:42.89', '2:31.29', '2:19.59', '2:13.79', '2:07.99', '2:02.19'),
('17-18', 'Male', '400 IM', 'SCM', '5:50.69', '5:25.59', '5:00.59', '4:48.09', '4:35.49', '4:22.99'),

-- 17-18 Girls LCM
('17-18', 'Female', '50 FR', 'LCM', '35.89', '33.29', '30.69', '29.49', '28.19', '26.89'),
('17-18', 'Female', '100 FR', 'LCM', '1:17.69', '1:12.19', '1:06.59', '1:03.89', '1:01.09', '58.29'),
('17-18', 'Female', '200 FR', 'LCM', '2:47.69', '2:35.69', '2:23.69', '2:17.69', '2:11.69', '2:05.79'),
('17-18', 'Female', '400 FR', 'LCM', '5:53.39', '5:28.19', '5:02.99', '4:50.29', '4:37.69', '4:25.09'),
('17-18', 'Female', '800 FR', 'LCM', '12:10.29', '11:18.19', '10:25.99', '9:59.89', '9:33.79', '9:07.79'),
('17-18', 'Female', '1500 FR', 'LCM', '23:20.89', '21:40.79', '20:00.79', '19:10.79', '18:20.69', '17:30.69'),
('17-18', 'Female', '100 BK', 'LCM', '1:25.89', '1:19.79', '1:13.69', '1:10.59', '1:07.49', '1:04.49'),
('17-18', 'Female', '200 BK', 'LCM', '3:05.79', '2:52.49', '2:39.19', '2:32.59', '2:25.99', '2:19.29'),
('17-18', 'Female', '100 BR', 'LCM', '1:37.49', '1:30.49', '1:23.59', '1:20.09', '1:16.59', '1:13.09'),
('17-18', 'Female', '200 BR', 'LCM', '3:29.89', '3:14.99', '2:59.99', '2:52.49', '2:44.99', '2:37.49'),
('17-18', 'Female', '100 FL', 'LCM', '1:23.59', '1:17.69', '1:11.69', '1:08.69', '1:05.69', '1:02.69'),
('17-18', 'Female', '200 FL', 'LCM', '3:04.49', '2:51.39', '2:38.19', '2:31.59', '2:24.99', '2:18.39'),
('17-18', 'Female', '200 IM', 'LCM', '3:09.29', '2:55.79', '2:42.29', '2:35.49', '2:28.79', '2:21.99'),
('17-18', 'Female', '400 IM', 'LCM', '6:40.29', '6:11.69', '5:43.09', '5:28.79', '5:14.49', '5:00.29'),

-- 17-18 Boys LCM
('17-18', 'Male', '50 FR', 'LCM', '31.89', '29.59', '27.39', '26.19', '25.09', '23.99'),
('17-18', 'Male', '100 FR', 'LCM', '1:09.89', '1:04.89', '59.89', '57.39', '54.89', '52.39'),
('17-18', 'Male', '200 FR', 'LCM', '2:32.89', '2:21.99', '2:11.09', '2:05.59', '2:00.09', '1:54.69'),
('17-18', 'Male', '400 FR', 'LCM', '5:26.49', '5:03.09', '4:39.79', '4:28.19', '4:16.49', '4:04.89'),
('17-18', 'Male', '800 FR', 'LCM', '11:17.89', '10:29.49', '9:41.09', '9:16.89', '8:52.69', '8:28.49'),
('17-18', 'Male', '1500 FR', 'LCM', '21:45.79', '20:12.49', '18:39.29', '17:52.59', '17:05.99', '16:19.39'),
('17-18', 'Male', '100 BK', 'LCM', '1:17.49', '1:11.99', '1:06.49', '1:03.69', '1:00.89', '58.19'),
('17-18', 'Male', '200 BK', 'LCM', '2:49.19', '2:37.09', '2:24.99', '2:18.99', '2:12.89', '2:06.89'),
('17-18', 'Male', '100 BR', 'LCM', '1:26.69', '1:20.59', '1:14.39', '1:11.29', '1:08.19', '1:05.09'),
('17-18', 'Male', '200 BR', 'LCM', '3:09.19', '2:55.69', '2:42.19', '2:35.39', '2:28.59', '2:21.89'),
('17-18', 'Male', '100 FL', 'LCM', '1:14.59', '1:09.29', '1:03.99', '1:01.29', '58.69', '55.99'),
('17-18', 'Male', '200 FL', 'LCM', '2:46.99', '2:35.09', '2:23.19', '2:17.19', '2:11.29', '2:05.29'),
('17-18', 'Male', '200 IM', 'LCM', '2:51.89', '2:39.59', '2:27.39', '2:21.19', '2:15.09', '2:08.99'),
('17-18', 'Male', '400 IM', 'LCM', '6:07.59', '5:41.29', '5:15.09', '5:01.89', '4:48.79', '4:35.69');





-- Table for upcoming activities
CREATE TABLE IF NOT EXISTS upcoming_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL, -- 'meet', 'practice', 'event', etc.
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location VARCHAR(255),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for activities and groups
CREATE TABLE IF NOT EXISTS activity_groups (
    activity_id UUID REFERENCES upcoming_activities(id) ON DELETE CASCADE,
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (activity_id, group_id)
);

-- Table for swimmer activity responses
CREATE TABLE IF NOT EXISTS activity_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES upcoming_activities(id) ON DELETE CASCADE,
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    response_status VARCHAR(20) NOT NULL CHECK (response_status IN ('attending', 'interested', 'not_attending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (activity_id, swimmer_id)
);

-- Table for tracking various activities (achievements, results, etc.)
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swimmer_id UUID REFERENCES swimmers(id) ON DELETE CASCADE,
    group_id UUID REFERENCES swim_groups(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'achievement', 'swim_result', 'badge_earned', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reference_id UUID, -- ID from the source table (achievements, swim_results, etc.)
    reference_table VARCHAR(50), -- Name of the source table
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster retrieval of recent activities
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_coach_groups ON activity_feed(coach_id, group_id);