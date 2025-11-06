/*
  # Add Advanced Task Features
  
  ## Overview
  Adds priority levels, tags, and categories to tasks for better organization and filtering.
  
  ## Changes
  
  1. New Columns in tasks table
    - `priority` (text) - Task priority level: 'baixa', 'media', 'alta', 'urgente'
    - `tags` (jsonb) - Array of tag strings for categorization
    - `category` (text) - Task category/type
    - `color` (text) - Custom color for visual organization
  
  2. Default Values
    - priority defaults to 'media' (medium priority)
    - tags defaults to empty array
    - category defaults to 'geral'
    - color defaults to null
  
  ## Notes
  - All existing tasks will get default values
  - No data loss occurs
  - RLS policies remain unchanged
*/

-- Add new columns to tasks table
DO $$
BEGIN
  -- Add priority column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'priority'
  ) THEN
    ALTER TABLE tasks ADD COLUMN priority text DEFAULT 'media';
  END IF;
  
  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'tags'
  ) THEN
    ALTER TABLE tasks ADD COLUMN tags jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'category'
  ) THEN
    ALTER TABLE tasks ADD COLUMN category text DEFAULT 'geral';
  END IF;
  
  -- Add color column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'color'
  ) THEN
    ALTER TABLE tasks ADD COLUMN color text DEFAULT NULL;
  END IF;
  
  -- Add order column for drag and drop
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE tasks ADD COLUMN order_index integer DEFAULT 0;
  END IF;
END $$;

-- Create index for ordering tasks
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(project_id, status, order_index);

-- Add check constraint for priority values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_priority_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
      CHECK (priority IN ('baixa', 'media', 'alta', 'urgente'));
  END IF;
END $$;
