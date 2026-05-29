-- ═══════════════════════════════════════════════════════
--  VinSite — Supabase Schema
--  Jalankan script ini di: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

-- ─── 1. Tabel pesan masuk dari form kontak ────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  company    TEXT,
  email      TEXT        NOT NULL,
  budget     TEXT,
  message    TEXT        NOT NULL,
  read       BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Tabel proyek ─────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  client      TEXT        NOT NULL,
  status      TEXT        DEFAULT 'PLANNING',
  progress    INTEGER     DEFAULT 0,
  stack       TEXT[]      DEFAULT '{}',
  start_date  TEXT,
  deadline    TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Row Level Security ────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Siapa saja boleh kirim pesan (form kontak publik)
CREATE POLICY "public_insert_messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Admin bisa baca semua pesan
CREATE POLICY "admin_select_messages" ON messages
  FOR SELECT USING (true);

-- Admin bisa update (mark as read)
CREATE POLICY "admin_update_messages" ON messages
  FOR UPDATE USING (true);

-- Siapa saja bisa lihat proyek (portofolio publik)
CREATE POLICY "public_select_projects" ON projects
  FOR SELECT USING (true);

-- Admin bisa tambah / ubah / hapus proyek
CREATE POLICY "admin_all_projects" ON projects
  FOR ALL USING (true);

-- ─── 4. Seed data awal untuk Projects ────────────────
INSERT INTO projects (name, client, status, progress, stack, start_date, deadline, description) VALUES
  ('NovaCorp Digital Hub',   'PT Nova Corporation',     'LIVE',        100, ARRAY['React','Node.js','VPS'],            'Jan 2026', 'Feb 2026', 'Corporate portal dengan CMS kustom, SEO enterprise, dan load time < 1s.'),
  ('ClinicFlow SaaS',        'Klinik Sehat Bersama',    'IN PROGRESS',  65, ARRAY['React','Claude API','MongoDB'],     'Mar 2026', 'Jun 2026', 'Aplikasi manajemen klinik dengan AI scheduling dan rekam medis digital.'),
  ('FashionBatik Store',     'Fashion Batik ID',        'IN PROGRESS',  30, ARRAY['WooCommerce','WordPress','CDN'],    'Apr 2026', 'Jul 2026', 'Platform e-commerce 500+ SKU dengan integrasi marketplace dan payment gateway.'),
  ('StartupTech Dashboard',  'StartupTech Indonesia',   'REVIEW',       90, ARRAY['React','Node.js','REST API'],       'Feb 2026', 'May 2026', 'SaaS dashboard dengan real-time analytics dan role-based access control.'),
  ('Grand Hotel Website',    'Grand Hotel Nusantara',   'PLANNING',     10, ARRAY['NEO WP','Booking API','CDN'],       'May 2026', 'Aug 2026', 'Website hotel premium dengan booking system real-time dan galeri sinematik.');
