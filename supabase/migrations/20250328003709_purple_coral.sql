/*
  # Authentication Setup

  1. Security
    - Enable Row Level Security (RLS) on auth.users
    - Add policies for user data access
    - Set up profile management

  2. Changes
    - Enable RLS on auth.users table
    - Create policies for secure data access
    - Add profile management capabilities
*/

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);