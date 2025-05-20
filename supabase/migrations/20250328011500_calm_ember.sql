/*
  # Update games data

  1. Changes
    - Delete existing games to avoid duplicates
    - Insert new games with updated data

  2. Security
    - No changes to security policies
*/

-- First, delete existing games to avoid duplicates
DELETE FROM games;

-- Insert updated games data
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