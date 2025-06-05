/*
  # Update admin user

  1. Changes
    - Safely upsert admin user with credentials:
      - Username: admindark
      - Password: lombarde1
      - Full name: Admin
      - Admin flag: true

  2. Security
    - Uses secure password hashing
    - Updates existing user if found
*/

DO $$
BEGIN
  -- Update existing user if found, otherwise insert new admin
  UPDATE users 
  SET 
    password_hash = crypt('lombarde1', gen_salt('bf')),
    full_name = 'Admin',
    is_admin = true
  WHERE username = 'admindark';

  -- Insert only if user doesn't exist
  IF NOT FOUND THEN
    INSERT INTO users (username, password_hash, full_name, is_admin)
    VALUES (
      'admindark',
      crypt('lombarde1', gen_salt('bf')),
      'Admin',
      true
    );
  END IF;
END $$;