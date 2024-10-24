-- First, create necessary indices
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_upcoming_activities_start_date ON upcoming_activities(start_date);
CREATE INDEX IF NOT EXISTS idx_activity_responses_activity ON activity_responses(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_groups_activity ON activity_groups(activity_id);
CREATE INDEX IF NOT EXISTS idx_swimmers_group ON swimmers(group_id);
CREATE INDEX IF NOT EXISTS idx_swim_groups_coach ON swim_groups(coach_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date DESC);
CREATE INDEX IF NOT EXISTS idx_swimmer_badges_group ON swimmer_badges(group_id);

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    user_id UUID,
    user_role TEXT
) RETURNS JSON AS $$
BEGIN
    -- Validate inputs
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'user_id cannot be null';
    END IF;

    IF user_role IS NULL OR user_role NOT IN ('coach', 'swimmer') THEN
        RAISE EXCEPTION 'Invalid user_role. Must be either coach or swimmer';
    END IF;

    -- Validate user exists and has correct role
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND role = user_role
    ) THEN
        RAISE EXCEPTION 'User not found or invalid role';
    END IF;

    IF user_role = 'coach' THEN
        RETURN (
            SELECT json_build_object(
                'totalSwimmers', COALESCE((
                    SELECT COUNT(*)
                    FROM swimmers s
                    JOIN swim_groups sg ON s.group_id = sg.id
                    WHERE sg.coach_id = user_id
                ), 0),
                'totalGroups', COALESCE((
                    SELECT COUNT(*)
                    FROM swim_groups
                    WHERE coach_id = user_id
                ), 0),
                'activeSwimmers', COALESCE((
                    SELECT COUNT(DISTINCT swimmer_id)
                    FROM attendance a
                    JOIN swim_groups sg ON a.swim_group_id = sg.id
                    WHERE sg.coach_id = user_id
                    AND a.date >= CURRENT_DATE - INTERVAL '30 days'
                    AND a.is_present = true
                ), 0),
                'totalBadgesAwarded', COALESCE((
                    SELECT COUNT(*)
                    FROM swimmer_badges sb
                    JOIN swim_groups sg ON sb.group_id = sg.id
                    WHERE sg.coach_id = user_id
                ), 0),
                'attendanceRate', COALESCE((
                    SELECT ROUND(
                        (COUNT(*) FILTER (WHERE is_present = true) * 100.0 / NULLIF(COUNT(*), 0))::numeric,
                        1
                    )
                    FROM attendance a
                    JOIN swim_groups sg ON a.swim_group_id = sg.id
                    WHERE sg.coach_id = user_id
                    AND a.date >= CURRENT_DATE - INTERVAL '30 days'
                ), 0)
            )
        );
    ELSE
        RETURN (
            SELECT json_build_object(
                'totalSwimmers', COALESCE((
                    SELECT COUNT(*)
                    FROM swimmers
                    WHERE group_id = (SELECT group_id FROM swimmers WHERE id = user_id)
                ), 0),
                'totalBadgesAwarded', COALESCE((
                    SELECT COUNT(*)
                    FROM swimmer_badges
                    WHERE swimmer_id = user_id
                ), 0),
                'attendanceRate', COALESCE((
                    SELECT ROUND(
                        (COUNT(*) FILTER (WHERE is_present = true) * 100.0 / NULLIF(COUNT(*), 0))::numeric,
                        1
                    )
                    FROM attendance
                    WHERE swimmer_id = user_id
                    AND date >= CURRENT_DATE - INTERVAL '30 days'
                ), 0)
            )
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in get_dashboard_metrics: %', SQLERRM;
        RETURN json_build_object(
            'error', 'Failed to fetch metrics',
            'totalSwimmers', 0,
            'totalGroups', 0,
            'activeSwimmers', 0,
            'totalBadgesAwarded', 0,
            'attendanceRate', 0
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get activity feed
CREATE OR REPLACE FUNCTION get_activity_feed(
    user_id UUID,
    user_role TEXT,
    page_number INT DEFAULT 1,
    items_per_page INT DEFAULT 5
) RETURNS TABLE (
    items JSON,
    total_count BIGINT
) AS $$
DECLARE
    offset_val INT;
BEGIN
    -- Input validation
    IF page_number < 1 OR items_per_page < 1 THEN
        RAISE EXCEPTION 'Invalid pagination parameters';
    END IF;

    offset_val := (page_number - 1) * items_per_page;
    
    RETURN QUERY
    WITH activity_data AS (
        SELECT 
            af.*,
            p.first_name,
            p.last_name,
            COUNT(*) OVER() as total_items
        FROM activity_feed af
        JOIN profiles p ON af.swimmer_id = p.id
        WHERE 
            CASE 
                WHEN user_role = 'coach' THEN
                    af.coach_id = user_id
                ELSE
                    af.group_id = (SELECT group_id FROM swimmers WHERE id = user_id)
            END
        ORDER BY af.created_at DESC
        LIMIT items_per_page
        OFFSET offset_val
    )
    SELECT 
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ad.id,
                    'type', ad.activity_type,
                    'description', ad.description,
                    'created_at', ad.created_at,
                    'swimmer', json_build_object(
                        'first_name', ad.first_name,
                        'last_name', ad.last_name
                    )
                )
            ),
            '[]'::json
        ) as items,
        MAX(ad.total_items) as total_count
    FROM activity_data ad;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming activities
CREATE OR REPLACE FUNCTION get_upcoming_activities(
    user_id UUID,
    user_role TEXT,
    limit_val INT DEFAULT 3
) RETURNS JSON AS $$
BEGIN
    -- Input validation
    IF limit_val < 1 THEN
        RAISE EXCEPTION 'Invalid limit value';
    END IF;

    RETURN COALESCE((
        SELECT json_agg(
            json_build_object(
                'id', ua.id,
                'title', ua.title,
                'description', ua.description,
                'start_date', ua.start_date,
                'end_date', ua.end_date,
                'location', ua.location,
                'groups', COALESCE((
                    SELECT json_agg(
                        json_build_object(
                            'id', sg.id,
                            'name', sg.name
                        )
                    )
                    FROM activity_groups ag
                    JOIN swim_groups sg ON ag.group_id = sg.id
                    WHERE ag.activity_id = ua.id
                ), '[]'::json),
                'responses', COALESCE((
                    SELECT json_agg(
                        json_build_object(
                            'status', ar.response_status,
                            'count', COUNT(*)
                        )
                    )
                    FROM activity_responses ar
                    WHERE ar.activity_id = ua.id
                    GROUP BY ar.response_status
                ), '[]'::json)
            )
        )
        FROM upcoming_activities ua
        WHERE CASE 
            WHEN user_role = 'coach' THEN
                ua.coach_id = user_id
            ELSE
                EXISTS (
                    SELECT 1 
                    FROM activity_groups ag
                    WHERE ag.activity_id = ua.id
                    AND ag.group_id = (SELECT group_id FROM swimmers WHERE id = user_id)
                )
        END
        AND ua.start_date > CURRENT_TIMESTAMP
        ORDER BY ua.start_date ASC
        LIMIT limit_val
    ), '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to create activity with groups
CREATE OR REPLACE FUNCTION create_activity(
    activity_data JSONB,
    coach_id UUID,
    group_ids UUID[]
) RETURNS JSONB AS $$
DECLARE
    new_activity_id UUID;
    result JSONB;
BEGIN
    -- Validate coach
    IF NOT EXISTS (
        SELECT 1 FROM coaches 
        WHERE id = coach_id
    ) THEN
        RAISE EXCEPTION 'Invalid coach_id';
    END IF;

    -- Validate group ownership
    IF EXISTS (
        SELECT 1 FROM swim_groups
        WHERE id = ANY(group_ids)
        AND coach_id != coach_id
    ) THEN
        RAISE EXCEPTION 'Coach does not have permission for all groups';
    END IF;

    -- Insert activity
    INSERT INTO upcoming_activities (
        title,
        description,
        start_date,
        end_date,
        location,
        coach_id
    )
    VALUES (
        activity_data->>'title',
        activity_data->>'description',
        (activity_data->>'start_date')::TIMESTAMPTZ,
        (activity_data->>'end_date')::TIMESTAMPTZ,
        activity_data->>'location',
        coach_id
    )
    RETURNING id INTO new_activity_id;

    -- Insert group associations
    IF array_length(group_ids, 1) > 0 THEN
        INSERT INTO activity_groups (activity_id, group_id)
        SELECT new_activity_id, unnest(group_ids);
    END IF;

    -- Get complete activity data
    SELECT jsonb_build_object(
        'id', ua.id,
        'title', ua.title,
        'description', ua.description,
        'start_date', ua.start_date,
        'end_date', ua.end_date,
        'location', ua.location,
        'coach_id', ua.coach_id,
        'groups', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', sg.id,
                    'name', sg.name
                )
            )
            FROM activity_groups ag
            JOIN swim_groups sg ON sg.id = ag.group_id
            WHERE ag.activity_id = ua.id
        ), '[]'::jsonb)
    ) INTO result
    FROM upcoming_activities ua
    WHERE ua.id = new_activity_id;

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in create_activity: %', SQLERRM;
        RETURN jsonb_build_object('error', 'Failed to create activity');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to respond to activity
CREATE OR REPLACE FUNCTION respond_to_activity(
    p_activity_id UUID,
    p_swimmer_id UUID,
    p_status TEXT
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Validate swimmer
    IF NOT EXISTS (
        SELECT 1 FROM swimmers 
        WHERE id = p_swimmer_id
    ) THEN
        RAISE EXCEPTION 'Invalid swimmer_id';
    END IF;

    -- Validate swimmer can respond to this activity
    IF NOT EXISTS (
        SELECT 1 
        FROM upcoming_activities ua
        JOIN activity_groups ag ON ua.id = ag.activity_id
        JOIN swimmers s ON ag.group_id = s.group_id
        WHERE ua.id = p_activity_id
        AND s.id = p_swimmer_id
    ) THEN
        RAISE EXCEPTION 'Swimmer not eligible to respond to this activity';
    END IF;

    -- Validate status
    IF p_status NOT IN ('attending', 'interested', 'not_attending') THEN
        RAISE EXCEPTION 'Invalid response status';
    END IF;

    -- Insert or update response and get result
    WITH upserted_response AS (
        INSERT INTO activity_responses (
            activity_id, 
            swimmer_id, 
            response_status
        )
        VALUES (
            p_activity_id,
            p_swimmer_id,
            p_status
        )
        ON CONFLICT (activity_id, swimmer_id)
        DO UPDATE SET 
            response_status = EXCLUDED.response_status,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    )
    SELECT jsonb_build_object(
        'activity_id', activity_id,
        'swimmer_id', swimmer_id,
        'status', response_status,
        'updated_at', updated_at
    ) INTO result
    FROM upserted_response;

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in respond_to_activity: %', SQLERRM;
        RETURN jsonb_build_object('error', 'Failed to record response');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;