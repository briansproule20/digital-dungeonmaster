-- Create the Heroes table
CREATE TABLE IF NOT EXISTS heroes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    class TEXT,
    race TEXT,
    level INTEGER DEFAULT 1,
    backstory TEXT,
    personality_traits TEXT[],
    avatar_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own heroes
CREATE POLICY "Users can view their own heroes" ON heroes
    FOR SELECT USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Create policy to allow users to insert their own heroes
CREATE POLICY "Users can insert their own heroes" ON heroes
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Create policy to allow users to update their own heroes
CREATE POLICY "Users can update their own heroes" ON heroes
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Create policy to allow users to delete their own heroes
CREATE POLICY "Users can delete their own heroes" ON heroes
    FOR DELETE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heroes_user_id ON heroes(user_id);
CREATE INDEX IF NOT EXISTS idx_heroes_created_at ON heroes(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
CREATE TRIGGER update_heroes_updated_at
    BEFORE UPDATE ON heroes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();