
-- Enable RLS on relevant tables
--Yet to be implemented
ALTER TABLE upcoming_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_groups ENABLE ROW LEVEL SECURITY;

-- Policy for coaches to view their own upcoming activities
CREATE POLICY coach_view_activities ON upcoming_activities
    FOR SELECT TO authenticated
    USING (
        coach_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM activity_groups ag
            JOIN swimmers s ON s.group_id = ag.group_id
            WHERE ag.activity_id = upcoming_activities.id
            AND s.id = auth.uid()
        )
    );

-- Policy for coaches to create activities
CREATE POLICY coach_create_activities ON upcoming_activities
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM coaches WHERE id = auth.uid()
        )
    );

-- Policy for coaches to update their own activities
CREATE POLICY coach_update_activities ON upcoming_activities
    FOR UPDATE TO authenticated
    USING (coach_id = auth.uid());

-- Policy for viewing activity feed items
CREATE POLICY view_activity_feed ON activity_feed
    FOR SELECT TO authenticated
    USING (
        coach_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM swim_groups sg
            WHERE sg.coach_id = activity_feed.coach_id
            AND sg.id IN (
                SELECT group_id FROM swimmers WHERE id = auth.uid()
            )
        )
    );

-- Policy for creating activity feed items
CREATE POLICY create_activity_feed ON activity_feed
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IN (SELECT id FROM coaches)
    );
