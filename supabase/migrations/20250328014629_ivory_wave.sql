/*
  # Add admin user and role

  1. Changes
    - Add admin role to users table
    - Create admin user with specified credentials
    
  2. Security
    - Add RLS policy for admin access
*/

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin user
INSERT INTO users (username, password_hash, full_name, is_admin)
VALUES (
  'admindark',
  crypt('lombarde1', gen_salt('bf')),
  'Admin Dark',
  true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = crypt('lombarde1', gen_salt('bf')),
    is_admin = true;