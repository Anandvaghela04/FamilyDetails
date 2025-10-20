/*
  # Family Records Management System

  1. New Tables
    - `family_records`
      - `id` (uuid, primary key) - Unique identifier for each family record
      - `head_name` (text) - Name of family head
      - `head_photo_url` (text) - URL to stored photo
      - `head_dob` (date) - Date of birth
      - `address` (text) - Family address
      - `mobile` (text) - Mobile number
      - `education` (text) - Education details
      - `occupation` (text) - Occupation details
      - `marital_status` (text) - married or unmarried
      - `wife_details` (jsonb) - Wife information if married
      - `children` (jsonb) - Array of children details
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `family_records` table
    - Add policy for public read access (for display)
    - Add policy for public insert access (for form submission)
*/

CREATE TABLE IF NOT EXISTS family_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  head_name text NOT NULL,
  head_photo_url text,
  head_dob date NOT NULL,
  address text NOT NULL,
  mobile text NOT NULL,
  education text DEFAULT '',
  occupation text DEFAULT '',
  marital_status text NOT NULL,
  wife_details jsonb DEFAULT '{}'::jsonb,
  children jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE family_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON family_records
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON family_records
  FOR INSERT
  TO anon
  WITH CHECK (true);