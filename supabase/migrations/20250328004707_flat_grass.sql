/*
  # Add balance and transactions support

  1. Updates
    - Add balance to users table
    
  2. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (transaction_type enum: DEPOSIT, WITHDRAWAL)
      - `amount` (numeric)
      - `status` (transaction_status enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  3. Security
    - Enable RLS on transactions table
    - Add policies for secure access
*/

-- Create transaction type enum
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- Add balance to users table
ALTER TABLE users ADD COLUMN balance NUMERIC(10,2) NOT NULL DEFAULT 0.00;

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  status transaction_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to process deposit
CREATE OR REPLACE FUNCTION process_deposit(
  p_user_id UUID,
  p_amount NUMERIC
) RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Create transaction record
  INSERT INTO transactions (user_id, type, amount, status)
  VALUES (p_user_id, 'DEPOSIT', p_amount, 'COMPLETED')
  RETURNING id INTO v_transaction_id;

  -- Update user balance
  UPDATE users
  SET balance = balance + p_amount
  WHERE id = p_user_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process withdrawal
CREATE OR REPLACE FUNCTION process_withdrawal(
  p_user_id UUID,
  p_amount NUMERIC
) RETURNS UUID AS $$
DECLARE
  v_user_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Get current balance
  SELECT balance INTO v_user_balance
  FROM users
  WHERE id = p_user_id;

  -- Check if user has sufficient balance
  IF v_user_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Create transaction record
  INSERT INTO transactions (user_id, type, amount, status)
  VALUES (p_user_id, 'WITHDRAWAL', p_amount, 'COMPLETED')
  RETURNING id INTO v_transaction_id;

  -- Update user balance
  UPDATE users
  SET balance = balance - p_amount
  WHERE id = p_user_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;