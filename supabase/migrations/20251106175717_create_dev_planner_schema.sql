/*
  # Dev Planner Database Schema - Initial Setup

  ## Overview
  Complete database schema for Dev Planner - Academic project management platform
  using Kanban methodology for software engineering students.

  ## 1. New Tables

  ### `users` table
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email for authentication
  - `name` (text) - Full name of the user
  - `password` (text) - Hashed password
  - `created_at` (timestamptz) - Account creation timestamp

  ### `projects` table
  - `id` (uuid, primary key) - Unique project identifier
  - `user_id` (uuid, foreign key) - Owner of the project
  - `title` (text) - Project name/title
  - `description` (text) - Detailed project description
  - `columns` (jsonb) - Array of Kanban column names ["A Fazer", "Fazendo", "Feito"]
  - `created_at` (timestamptz) - Project creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ### `tasks` table
  - `id` (uuid, primary key) - Unique task identifier
  - `project_id` (uuid, foreign key) - Associated project
  - `title` (text) - Task title/name
  - `description` (text) - Task details and requirements
  - `status` (text) - Current Kanban column ("A Fazer", "Fazendo", "Feito")
  - `created_at` (timestamptz) - Task creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ## 2. Security Configuration

  ### Row Level Security (RLS)
  - All tables have RLS enabled to ensure data isolation
  - Users can only access their own data
  - Project owners can manage their projects and associated tasks

  ### RLS Policies

  #### Users Table
  - Users can read their own profile data
  - Users can update their own profile information
  - INSERT handled through auth.users integration

  #### Projects Table
  - Users can view only their own projects
  - Users can create new projects
  - Users can update their own projects
  - Users can delete their own projects

  #### Tasks Table
  - Users can view tasks from their own projects
  - Users can create tasks in their own projects
  - Users can update tasks in their own projects
  - Users can delete tasks from their own projects

  ## 3. Data Integrity

  ### Foreign Key Constraints
  - projects.user_id references users.id (CASCADE on delete)
  - tasks.project_id references projects.id (CASCADE on delete)

  ### Default Values
  - All timestamps default to current time
  - Columns field defaults to standard Kanban setup
  - Status defaults to "A Fazer" for new tasks

  ## 4. Indexes
  - Indexes on user_id columns for fast project/task queries
  - Index on project_id for efficient task lookups

  ## Important Notes
  - This schema supports the academic requirement for POO implementation
  - Compatible with JWT authentication pattern
  - Designed for single-user project ownership (not collaborative)
  - Optimized for Kanban workflow with three standard columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  columns jsonb DEFAULT '["A Fazer", "Fazendo", "Feito"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'A Fazer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies for projects table
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for tasks table
CREATE POLICY "Users can view tasks from own projects"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in own projects"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in own projects"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks from own projects"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );