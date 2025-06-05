/*
  # Update authentication settings

  1. Changes
    - Add trigger to handle username-based authentication
    - Update user creation process
    - Add function to validate username format

  2. Security
    - Maintain RLS policies
    - Ensure secure username validation
*/

-- Function to validate username format
CREATE OR REPLACE FUNCTION is_valid_username(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN username ~ '^[a-zA-Z0-9_]{3,30}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to handle username-based auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract username from email (remove @example.com)
  NEW.email := split_part(NEW.email, '@', 1);
  
  -- Validate username
  IF NOT is_valid_username(NEW.email) THEN
    RAISE EXCEPTION 'Invalid username format. Use only letters, numbers, and underscores (3-30 characters).';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (NEW.id, '', NEW.email);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;