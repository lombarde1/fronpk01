/*
  # Add admin user policy

  1. Changes
    - Add policy to allow admin user to read all users' data
    - Add policy to allow admin user to update all users' data

  2. Security
    - Only admin user (username = 'admindark') can read and update all users
*/

-- Policy for admin to read all users
CREATE POLICY "Admin can read all users"
ON users
FOR SELECT
TO authenticated
USING (
  (SELECT username FROM users WHERE id = auth.uid()) = 'admindark'
);

-- Policy for admin to update all users
CREATE POLICY "Admin can update all users"
ON users
FOR UPDATE
TO authenticated
USING (
  (SELECT username FROM users WHERE id = auth.uid()) = 'admindark'
)
WITH CHECK (
  (SELECT username FROM users WHERE id = auth.uid()) = 'admindark'
);