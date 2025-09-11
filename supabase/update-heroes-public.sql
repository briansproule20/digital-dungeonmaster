-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can insert their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can update their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can delete their own heroes" ON heroes;

-- Create new policies for public visibility
-- Anyone can view all heroes
CREATE POLICY "Anyone can view all heroes" ON heroes
    FOR SELECT USING (true);

-- Users can still only insert their own heroes
CREATE POLICY "Users can insert their own heroes" ON heroes
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Users can only update their own heroes
CREATE POLICY "Users can update their own heroes" ON heroes
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Users can only delete their own heroes
CREATE POLICY "Users can delete their own heroes" ON heroes
    FOR DELETE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');