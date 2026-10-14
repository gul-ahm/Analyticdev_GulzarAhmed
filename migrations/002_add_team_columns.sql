-- Add missing columns to team_members
ALTER TABLE team_members
ADD COLUMN display_order INT DEFAULT 0,
ADD COLUMN quote TEXT,
ADD COLUMN headline VARCHAR(100);
