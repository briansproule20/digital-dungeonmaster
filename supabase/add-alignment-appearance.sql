-- Add alignment and appearance fields to the heroes table
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS alignment TEXT;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS appearance TEXT;
