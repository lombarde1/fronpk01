/*
  # Create games table and seed initial data

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `image_url` (text, not null)
      - `provider` (text, not null)
      - `category` (text, not null)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `games` table
    - Add policy for authenticated users to read active games
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  provider text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading active games
CREATE POLICY "Anyone can read active games"
  ON games
  FOR SELECT
  USING (is_active = true);

-- Insert initial games
INSERT INTO games (name, image_url, provider, category, is_active) VALUES
  ('Dino Rex', 'https://i.imgur.com/OciHanc.jpeg', 'Horizon777', 'Arcade', true),
  ('Piggy Bank Bills', 'https://solawins-sg0.pragmaticplay.net/game_pic/rec/325/vs9piggybank.png', 'Pragmatic Play', 'Slots', true),
  ('Fortune Tiger', 'https://i.imgur.com/lCMY74B.png', 'PG Soft', 'Slots', true),
  ('Fortune Mouse', 'https://i.imgur.com/NDp35jD.png', 'PG Soft', 'Slots', true),
  ('Fortune Ox', 'https://i.imgur.com/uWYQEcx.png', 'PG Soft', 'Slots', true),
  ('Fortune Panda', 'https://i.imgur.com/RT88no7.png', 'PG Soft', 'Slots', true),
  ('Fortune Rabbit', 'https://i.imgur.com/tfvTL5n.png', 'PG Soft', 'Slots', true),
  ('Bikini Paradise', 'https://i.imgur.com/1CEw72w.png', 'PG Soft', 'Slots', true),
  ('Hood Vs. Woolf', 'https://i.imgur.com/v10091x.png', 'PG Soft', 'Slots', true),
  ('Jack Frost', 'https://i.imgur.com/7ye5yNJ.png', 'PG Soft', 'Slots', true),
  ('Phoenix Rises', 'https://i.imgur.com/Pu9bOyU.png', 'PG Soft', 'Slots', true),
  ('Queen Of Bounty', 'https://i.imgur.com/KGMsnER.png', 'PG Soft', 'Slots', true),
  ('Songkran', 'https://i.imgur.com/gnC2ryu.png', 'PG Soft', 'Slots', true),
  ('Treasures Of Aztec', 'https://i.imgur.com/pHACDLU.png', 'PG Soft', 'Slots', true);