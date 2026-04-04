-- ═══════════════════════════════════════════════════════════
-- LLFG Portal — Supabase Database Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ═══════════════════════════════════════════════════════════

-- 1. Users table (replaces in-memory USERS object)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'financial_advisor',
  commission INTEGER DEFAULT 75,
  personal_email TEXT,
  phone TEXT,
  team TEXT,
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'admin',
  last_login TIMESTAMPTZ
);

-- Seed with existing accounts
INSERT INTO users (email, password_hash, name, role, commission, is_owner) VALUES
  ('lorenzoparenza@llfg.us', 'h_hfvuty0t', 'Lorenzo Parenza', 'admin', 140, TRUE),
  ('admin@llfg.us', 'h_hfvuty0t', 'Admin', 'admin', 140, FALSE),
  ('agent@llfg.us', 'h_herj59mb', 'Demo Agent', 'financial_advisor', 65, FALSE),
  ('jaalyn@llfg.us', 'h_herj59mb', 'Jaalyn Bowman', 'financial_advisor', 65, FALSE),
  ('manager@llfg.us', 'h_hsilt2', 'Marcus Reid', 'manager', 100, FALSE),
  ('executive@llfg.us', 'h_id3ow73', 'Sofia Lane', 'executive', 120, FALSE),
  ('partner@llfg.us', 'h_91uw7bxfh2', 'Diana Walsh', 'managing_partner', 140, FALSE)
ON CONFLICT (email) DO NOTHING;

-- 2. Deals table (replaces in-memory myDeals array)
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_email TEXT NOT NULL REFERENCES users(email),
  client_name TEXT NOT NULL,
  policy_name TEXT DEFAULT '',
  carrier TEXT DEFAULT '',
  policy_number TEXT DEFAULT '',
  monthly_premium NUMERIC NOT NULL,
  annual_premium NUMERIC GENERATED ALWAYS AS (monthly_premium * 12) STORED,
  advance_pay NUMERIC,
  agent_pay NUMERIC,
  commission_pct INTEGER DEFAULT 75,
  draft_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Calendar events table (replaces localStorage portalCalEvents)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_email TEXT NOT NULL REFERENCES users(email),
  event_type TEXT NOT NULL,
  label TEXT NOT NULL,
  guest_name TEXT,
  guest_email TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  duration INTEGER DEFAULT 60,
  location TEXT,
  notes TEXT,
  google_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Email log (replaces localStorage llfg_elog)
CREATE TABLE IF NOT EXISTS email_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Scheduled emails (replaces localStorage llfg_esched)
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Agent submissions (replaces in-memory pendingAgentQueue)
CREATE TABLE IF NOT EXISTS agent_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  npn TEXT,
  experience TEXT,
  submitted_by TEXT NOT NULL,
  submitted_by_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending_manager',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Ledger (replaces localStorage llfg_ledger)
CREATE TABLE IF NOT EXISTS ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_type TEXT NOT NULL, -- 'credit' or 'debit'
  category TEXT NOT NULL,   -- 'premium', 'commission', 'advance_pay', 'chargeback'
  agent_name TEXT NOT NULL,
  team_name TEXT,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Commission changes audit trail
CREATE TABLE IF NOT EXISTS commission_changes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_email TEXT NOT NULL,
  old_commission INTEGER,
  new_commission INTEGER,
  changed_by TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_agent ON deals(agent_email);
CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_calendar_agent ON calendar_events(agent_email);
CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_email_log_sender ON email_log(sender_email);
CREATE INDEX IF NOT EXISTS idx_ledger_date ON ledger(entry_date);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON agent_submissions(status);

-- Row Level Security (RLS) — agents can only see their own data
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Service key bypasses RLS, so Netlify Functions have full access
-- Agent-facing queries are filtered in the function code
