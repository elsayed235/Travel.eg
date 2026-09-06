import type { Database as SqliteDb } from 'better-sqlite3';
import { SqlitePersistenceAdapter } from './SqlitePersistenceAdapter';
import { db } from '../database';

/**
 * CMS Content Management System — Database Schema
 *
 * These tables are independent from TABLE_SPECS. They use proper relational
 * columns rather than the "promoted columns + JSON data blob" pattern, because
 * CMS content needs column-level queries (filter by status, sort by order,
 * search by title) that the JSON blob pattern cannot support efficiently.
 *
 * The tables are created via CREATE TABLE IF NOT EXISTS, so they are safe to
 * run on every boot alongside the existing schema.
 */

const CMS_TABLES = `
-- ============================================================================
-- CMS Content Pages — editorial pages managed through the dashboard
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'static_page',
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  subtitle_en TEXT DEFAULT '',
  subtitle_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  body_en TEXT DEFAULT '',
  body_ar TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  hero_image_alt_en TEXT DEFAULT '',
  hero_image_alt_ar TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  seo_title_en TEXT DEFAULT '',
  seo_title_ar TEXT DEFAULT '',
  seo_description_en TEXT DEFAULT '',
  seo_description_ar TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  created_by TEXT DEFAULT '',
  updated_by TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT DEFAULT '',
  scheduled_at TEXT DEFAULT '',
  preview_token TEXT DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_type ON cms_pages(type);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_sort_order ON cms_pages(sort_order);

-- ============================================================================
-- CMS Content Blocks — reusable blocks within pages
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_blocks (
  id TEXT PRIMARY KEY NOT NULL,
  page_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'rich_text',
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  title_en TEXT DEFAULT '',
  title_ar TEXT DEFAULT '',
  body_en TEXT DEFAULT '',
  body_ar TEXT DEFAULT '',
  config TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_cms_blocks_page_id ON cms_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_blocks_sort_order ON cms_blocks(sort_order);

-- ============================================================================
-- CMS Media Assets — centralized media library
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY NOT NULL,
  filename TEXT NOT NULL DEFAULT '',
  original_url TEXT DEFAULT '',
  storage_path TEXT DEFAULT '',
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  file_size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  aspect_ratio TEXT DEFAULT '',
  alt_en TEXT DEFAULT '',
  alt_ar TEXT DEFAULT '',
  caption_en TEXT DEFAULT '',
  caption_ar TEXT DEFAULT '',
  credit TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  tags TEXT DEFAULT '',
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_media_category ON cms_media(category);

-- ============================================================================
-- CMS Homepage Sections — configurable homepage composition
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_homepage_sections (
  id TEXT PRIMARY KEY NOT NULL,
  section_key TEXT UNIQUE NOT NULL,
  title_en TEXT DEFAULT '',
  title_ar TEXT DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  config TEXT DEFAULT '{}',
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_homepage_sections_sort ON cms_homepage_sections(sort_order);

-- ============================================================================
-- CMS Navigation Menus — CMS-managed navigation
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_navigation (
  id TEXT PRIMARY KEY NOT NULL,
  menu_key TEXT NOT NULL,
  item_order INTEGER NOT NULL DEFAULT 0,
  label_en TEXT NOT NULL DEFAULT '',
  label_ar TEXT NOT NULL DEFAULT '',
  route TEXT DEFAULT '',
  external_url TEXT DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 1,
  open_in_new INTEGER NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '',
  group_label_en TEXT DEFAULT '',
  group_label_ar TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_navigation_menu ON cms_navigation(menu_key);

-- ============================================================================
-- CMS SEO Metadata — SEO data per page
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_seo (
  id TEXT PRIMARY KEY NOT NULL,
  page_type TEXT NOT NULL DEFAULT 'page',
  page_id TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  title_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  og_title_en TEXT DEFAULT '',
  og_title_ar TEXT DEFAULT '',
  og_description_en TEXT DEFAULT '',
  og_description_ar TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  noindex INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  UNIQUE(page_type, page_id)
);

-- ============================================================================
-- CMS Content Revisions — audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT DEFAULT '',
  actor_name TEXT DEFAULT '',
  payload TEXT DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_entity ON cms_revisions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_created ON cms_revisions(created_at);
`;

/**
 * Get the raw SQLite connection from the persistence adapter.
 * Returns null if the adapter is not SQLite.
 */
function getSqliteConnection(): SqliteDb | null {
  const adapter = db.getAdapter();
  if (adapter instanceof SqlitePersistenceAdapter) {
    return adapter.connection;
  }
  return null;
}

/**
 * Run the CMS schema creation. Safe to call on every boot (IF NOT EXISTS).
 * Must be called after the main schema is built (which happens in the
 * SqlitePersistenceAdapter constructor).
 */
export function initializeCmsSchema(): void {
  const conn = getSqliteConnection();
  if (!conn) {
    console.warn('[CMS] Schema initialization skipped: adapter is not SQLite');
    return;
  }

  try {
    conn.exec(CMS_TABLES);
    console.log('[CMS] Content management tables initialized successfully');
  } catch (err: any) {
    console.error('[CMS] Schema initialization failed:', err.message);
  }
}
