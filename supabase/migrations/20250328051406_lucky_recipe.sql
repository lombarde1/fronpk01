/*
  # Add game management policies

  1. Changes
    - Add policies for admin to manage games
    - Allow admin to insert, update, and delete games
    - Maintain existing public read access for active games

  2. Security
    - Only admin (admindark) can manage games
    - Public users can only read active games
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read active games" ON games;
DROP POLICY IF EXISTS "Admin can manage games" ON games;

-- Policy for public to read active games
CREATE POLICY "Anyone can read active games"
ON games
FOR SELECT
TO public
USING (is_active = true);

-- Policy for admin to manage all games
CREATE POLICY "Admin can manage games"
ON games
FOR ALL
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