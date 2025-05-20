/*
  # Create custom authentication system

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on users table
    - Add policies for secure access
    - Add function to hash passwords
*/

-- Create extension for UUID generation and password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to register new user
CREATE OR REPLACE FUNCTION register_user(
  p_username TEXT,
  p_password TEXT,
  p_full_name TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Validate username format
  IF NOT (p_username ~ '^[a-zA-Z0-9_]{3,30}$') THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Insert new user
  INSERT INTO users (username, password_hash, full_name)
  VALUES (
    p_username,
    crypt(p_password, gen_salt('bf')),
    p_full_name
  )
  RETURNING id INTO v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(
  p_username TEXT,
  p_password TEXT
) RETURNS TABLE (
  user_id UUID,
  username TEXT,
  full_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, u.username, u.full_name
  FROM users u
  WHERE u.username = p_username
  AND u.password_hash = crypt(p_password, u.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;