-- Temporarily disable RLS for heroes table to allow Echo auth integration
-- This allows the application to manage access control at the application level

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view all heroes" ON heroes;
DROP POLICY IF EXISTS "Users can view their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can insert their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can update their own heroes" ON heroes;
DROP POLICY IF EXISTS "Users can delete their own heroes" ON heroes;

-- Disable Row Level Security for now
ALTER TABLE heroes DISABLE ROW LEVEL SECURITY;

-- Note: Access control is now handled at the application level
-- The app verifies user authentication through Echo before allowing database operations