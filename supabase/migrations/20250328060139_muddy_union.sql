/*
  # Add PIX Credentials and Enhance Transactions

  1. New Tables
    - `pix_credentials`
      - `id` (uuid, primary key)
      - `client_id` (text)
      - `client_secret` (text)
      - `base_url` (text)
      - `webhook_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to Existing Tables
    - `transactions`
      - Added `external_reference` (text)
      - Added `payment_method` (text)
      - Added `metadata` (jsonb)
      - Added indexes for efficient querying

  3. Security
    - Enable RLS on `pix_credentials`
    - Add admin-only policies for PIX credentials management
    - Update transaction policies
*/

-- Create PIX credentials table
CREATE TABLE IF NOT EXISTS pix_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  base_url TEXT NOT NULL DEFAULT 'https://api.a.com/v2',
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns to transactions table
DO $$
BEGIN
  -- Add external_reference if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'external_reference'
  ) THEN
    ALTER TABLE transactions ADD COLUMN external_reference TEXT;
  END IF;

  -- Add payment_method if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE transactions ADD COLUMN payment_method TEXT DEFAULT 'PIX';
  END IF;

  -- Add metadata if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'transactions' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE transactions ADD COLUMN metadata JSONB;
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_transactions_external_reference ON transactions (external_reference);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);

-- Enable RLS on pix_credentials
ALTER TABLE pix_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin to manage PIX credentials
CREATE POLICY admin_manage_pix_credentials ON pix_credentials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );