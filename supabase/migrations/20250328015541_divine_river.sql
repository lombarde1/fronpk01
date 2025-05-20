/*
  # Fix admin user policies

  1. Changes
    - Drop existing admin policies
    - Create simpler, more direct policies for admin access
    - Ensure admin can read and update all users

  2. Security
    - Maintains security by checking username = 'admindark'
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin can update all users" ON users;

-- Create new, simpler policies
CREATE POLICY "Admin can read all users"
ON users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE username = 'admindark'
  )
);

CREATE POLICY "Admin can update all users"
ON users
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE username = 'admindark'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM users WHERE username = 'admindark'
  )
);