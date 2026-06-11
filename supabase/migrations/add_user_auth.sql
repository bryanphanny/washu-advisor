-- ============================================================
-- User Auth Migration
-- Run this in Supabase SQL Editor before starting the app.
-- ============================================================

-- 1. Add user_id to semesters and user_courses
ALTER TABLE semesters ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE user_courses ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. User permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id          serial primary key,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role        text NOT NULL DEFAULT 'user',   -- 'admin' | 'user'
  can_use_ai  boolean NOT NULL DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 3. Auto-create a permissions row when any new user signs up.
--    Bryan's email gets admin + AI access automatically.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_permissions (user_id, role, can_use_ai)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email = 'bryan.p@wustl.edu' THEN 'admin' ELSE 'user' END,
    CASE WHEN NEW.email = 'bryan.p@wustl.edu' THEN true  ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
