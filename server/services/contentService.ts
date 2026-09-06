import type { Database as SqliteDb } from 'better-sqlite3';
import { SqlitePersistenceAdapter } from '../db/sqlite/SqlitePersistenceAdapter';
import { db } from '../db/database';

// ============================================================================
// CMS Entity Types
// ============================================================================

export interface CmsPage {
  id: string;
  slug: string;
  type: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  body_en: string;
  body_ar: string;
  hero_image_url: string;
  hero_image_alt_en: string;
  hero_image_alt_ar: string;
  status: 'draft' | 'published' | 'archived';
  seo_title_en: string;
  seo_title_ar: string;
  seo_description_en: string;
  seo_description_ar: string;
  og_image_url: string;
  sort_order: number;
  featured: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  scheduled_at: string;
  preview_token: string;
  version: number;
}

export interface CmsBlock {
  id: string;
  page_id: string;
  type: string;
  sort_order: number;
  visible: number;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  config: string;
  created_at: string;
  updated_at: string;
}

export interface CmsMedia {
  id: string;
  filename: string;
  original_url: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  aspect_ratio: string;
  alt_en: string;
  alt_ar: string;
  caption_en: string;
  caption_ar: string;
  credit: string;
  category: string;
  tags: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CmsHomepageSection {
  id: string;
  section_key: string;
  title_en: string;
  title_ar: string;
  visible: number;
  sort_order: number;
  config: string;
  updated_at: string;
}

export interface CmsNavigation {
  id: string;
  menu_key: string;
  item_order: number;
  label_en: string;
  label_ar: string;
  route: string;
  external_url: string;
  visible: number;
  open_in_new: number;
  icon: string;
  group_label_en: string;
  group_label_ar: string;
  created_at: string;
  updated_at: string;
}

export interface CmsSeo {
  id: string;
  page_type: string;
  page_id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  og_title_en: string;
  og_title_ar: string;
  og_description_en: string;
  og_description_ar: string;
  og_image_url: string;
  canonical_url: string;
  noindex: number;
  updated_at: string;
}

export interface CmsRevision {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  payload: string;
  created_at: string;
}

// ============================================================================
// Helpers
// ============================================================================

function conn(): SqliteDb | null {
  const adapter = db.getAdapter();
  return adapter instanceof SqlitePersistenceAdapter ? adapter.connection : null;
}

function now(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${ts}-${rand}`.toUpperCase();
}

function hydrate<T>(row: unknown): T {
  const r = row as Record<string, any>;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(r)) {
    if (k === 'config' && typeof v === 'string') {
      try { out[k] = JSON.parse(v); } catch { out[k] = {}; }
    } else if (k === 'payload' && typeof v === 'string') {
      try { out[k] = JSON.parse(v); } catch { out[k] = {}; }
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

// ============================================================================
// Revision Logger
// ============================================================================

function logRevision(
  entityType: string,
  entityId: string,
  action: string,
  actorId: string,
  actorName: string,
  payload?: Record<string, any>
): void {
  const c = conn();
  if (!c) return;

  const id = generateId('REV');
  c.prepare(`
    INSERT INTO cms_revisions (id, entity_type, entity_id, action, actor_id, actor_name, payload, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, entityType, entityId, action, actorId || '', actorName || '', JSON.stringify(payload || {}), now());
}

// ============================================================================
// Pages CRUD
// ============================================================================

export const cmsPages = {
  findAll(status?: string): CmsPage[] {
    const c = conn();
    if (!c) return [];
    if (status) {
      return c.prepare('SELECT * FROM cms_pages WHERE status = ? ORDER BY sort_order, created_at DESC')
        .all(status).map(hydrate<CmsPage>);
    }
    return c.prepare('SELECT * FROM cms_pages ORDER BY sort_order, created_at DESC')
      .all().map(hydrate<CmsPage>);
  },

  findBySlug(slug: string): CmsPage | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_pages WHERE slug = ?').get(slug);
    return row ? hydrate<CmsPage>(row) : null;
  },

  findById(id: string): CmsPage | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_pages WHERE id = ?').get(id);
    return row ? hydrate<CmsPage>(row) : null;
  },

  findPublishedByType(type: string): CmsPage[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_pages WHERE type = ? AND status = ? ORDER BY sort_order, created_at')
      .all(type, 'published').map(hydrate<CmsPage>);
  },

  findPublishedFeatured(): CmsPage[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_pages WHERE status = ? AND featured = 1 ORDER BY sort_order')
      .all('published').map(hydrate<CmsPage>);
  },

  create(data: Partial<CmsPage>, actorId?: string, actorName?: string): CmsPage {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');
    const id = generateId('CMS');
    const ts = now();
    const page: CmsPage = {
      id,
      slug: data.slug || id.toLowerCase(),
      type: data.type || 'static_page',
      title_en: data.title_en || '',
      title_ar: data.title_ar || '',
      subtitle_en: data.subtitle_en || '',
      subtitle_ar: data.subtitle_ar || '',
      description_en: data.description_en || '',
      description_ar: data.description_ar || '',
      body_en: data.body_en || '',
      body_ar: data.body_ar || '',
      hero_image_url: data.hero_image_url || '',
      hero_image_alt_en: data.hero_image_alt_en || '',
      hero_image_alt_ar: data.hero_image_alt_ar || '',
      status: data.status || 'draft',
      seo_title_en: data.seo_title_en || '',
      seo_title_ar: data.seo_title_ar || '',
      seo_description_en: data.seo_description_en || '',
      seo_description_ar: data.seo_description_ar || '',
      og_image_url: data.og_image_url || '',
      sort_order: data.sort_order || 0,
      featured: data.featured || 0,
      created_by: actorId || '',
      updated_by: actorId || '',
      created_at: ts,
      updated_at: ts,
      published_at: '',
      scheduled_at: data.scheduled_at || '',
      preview_token: generateId('PREV'),
      version: 1,
    };

    c.prepare(`
      INSERT INTO cms_pages (id, slug, type, title_en, title_ar, subtitle_en, subtitle_ar,
        description_en, description_ar, body_en, body_ar, hero_image_url,
        hero_image_alt_en, hero_image_alt_ar, status, seo_title_en, seo_title_ar,
        seo_description_en, seo_description_ar, og_image_url, sort_order, featured,
        created_by, updated_by, created_at, updated_at, published_at, scheduled_at,
        preview_token, version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      page.id, page.slug, page.type, page.title_en, page.title_ar,
      page.subtitle_en, page.subtitle_ar, page.description_en, page.description_ar,
      page.body_en, page.body_ar, page.hero_image_url,
      page.hero_image_alt_en, page.hero_image_alt_ar, page.status,
      page.seo_title_en, page.seo_title_ar, page.seo_description_en, page.seo_description_ar,
      page.og_image_url, page.sort_order, page.featured,
      page.created_by, page.updated_by, page.created_at, page.updated_at,
      page.published_at, page.scheduled_at, page.preview_token, page.version
    );

    logRevision('page', id, 'create', actorId || '', actorName || '', { slug: page.slug });
    return page;
  },

  update(id: string, data: Partial<CmsPage>, actorId?: string, actorName?: string): CmsPage | null {
    const c = conn();
    if (!c) return null;
    const existing = this.findById(id);
    if (!existing) return null;

    const ts = now();
    const updated = { ...existing, ...data, updated_at: ts, version: existing.version + 1 };

    c.prepare(`
      UPDATE cms_pages SET
        slug = ?, type = ?, title_en = ?, title_ar = ?, subtitle_en = ?, subtitle_ar = ?,
        description_en = ?, description_ar = ?, body_en = ?, body_ar = ?,
        hero_image_url = ?, hero_image_alt_en = ?, hero_image_alt_ar = ?,
        status = ?, seo_title_en = ?, seo_title_ar = ?,
        seo_description_en = ?, seo_description_ar = ?, og_image_url = ?,
        sort_order = ?, featured = ?, updated_by = ?, updated_at = ?, published_at = ?,
        scheduled_at = ?, preview_token = ?, version = ?
      WHERE id = ?
    `).run(
      updated.slug, updated.type, updated.title_en, updated.title_ar,
      updated.subtitle_en, updated.subtitle_ar, updated.description_en, updated.description_ar,
      updated.body_en, updated.body_ar, updated.hero_image_url,
      updated.hero_image_alt_en, updated.hero_image_alt_ar, updated.status,
      updated.seo_title_en, updated.seo_title_ar, updated.seo_description_en, updated.seo_description_ar,
      updated.og_image_url, updated.sort_order, updated.featured,
      actorId || '', updated.updated_at, updated.published_at, updated.scheduled_at, updated.preview_token, updated.version, id
    );

    logRevision('page', id, 'update', actorId || '', actorName || '', { fields: Object.keys(data) });
    return updated;
  },

  publish(id: string, actorId?: string, actorName?: string): CmsPage | null {
    return this.update(id, { status: 'published', published_at: now(), scheduled_at: '' }, actorId, actorName);
  },

  archive(id: string, actorId?: string, actorName?: string): CmsPage | null {
    return this.update(id, { status: 'archived' }, actorId, actorName);
  },

  /**
   * Schedule a page to be published at a specific time.
   * The page stays in 'draft' status until the scheduled time.
   */
  schedule(id: string, scheduledAt: string, actorId?: string, actorName?: string): CmsPage | null {
    return this.update(id, { scheduled_at: scheduledAt }, actorId, actorName);
  },

  /**
   * Rollback a page to a previous revision.
   * Finds the revision with the given ID and restores the page fields from its payload.
   */
  rollback(id: string, revisionId: string, actorId?: string, actorName?: string): CmsPage | null {
    const c = conn();
    if (!c) return null;

    const revision = c.prepare('SELECT * FROM cms_revisions WHERE id = ? AND entity_type = ? AND entity_id = ?')
      .get(revisionId, 'page', id) as Record<string, any> | undefined;
    if (!revision) return null;

    let payload: Record<string, any> = {};
    try { payload = JSON.parse(revision.payload || '{}'); } catch { return null; }

    // Only rollback if payload contains page fields
    if (!payload.fields && !payload.slug) return null;

    // Extract the full page state from the revision if available
    const restoreData: Partial<CmsPage> = {};
    const pageFields = ['title_en', 'title_ar', 'subtitle_en', 'subtitle_ar', 'description_en', 'description_ar',
      'body_en', 'body_ar', 'hero_image_url', 'sort_order', 'featured', 'status'] as const;
    for (const field of pageFields) {
      if (field in payload) {
        (restoreData as any)[field] = payload[field];
      }
    }

    return this.update(id, restoreData, actorId, actorName);
  },

  /**
   * Find a page by its preview token (for draft preview).
   */
  findByPreviewToken(token: string): CmsPage | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_pages WHERE preview_token = ?').get(token);
    return row ? hydrate<CmsPage>(row) : null;
  },

  /**
   * Check for scheduled pages and publish them if their scheduled time has passed.
   */
  checkScheduled(): CmsPage[] {
    const c = conn();
    if (!c) return [];
    const ts = now();
    // Use a generous lookback window to catch any scheduled pages
    const scheduled = c.prepare(
      `SELECT * FROM cms_pages WHERE scheduled_at != '' AND status != 'published'`
    ).all() as any[];

    const published: CmsPage[] = [];
    for (const row of scheduled) {
      // Compare timestamps: only publish if scheduled_at is in the past
      if (row.scheduled_at > ts) continue;

      const result = c.prepare(
        `UPDATE cms_pages SET status = 'published', published_at = ?, scheduled_at = '' WHERE id = ?`
      ).run(ts, row.id);
      if (result.changes > 0) {
        logRevision('page', row.id, 'scheduled_publish', 'system', 'System', { scheduled_at: row.scheduled_at });
        const updated = this.findById(row.id);
        if (updated) published.push(updated);
      }
    }
    return published;
  },

  remove(id: string): boolean {
    const c = conn();
    if (!c) return false;
    const result = c.prepare('DELETE FROM cms_pages WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// ============================================================================
// Blocks CRUD
// ============================================================================

export const cmsBlocks = {
  findByPageId(pageId: string): CmsBlock[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_blocks WHERE page_id = ? ORDER BY sort_order')
      .all(pageId).map(hydrate<CmsBlock>);
  },

  findById(id: string): CmsBlock | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_blocks WHERE id = ?').get(id);
    return row ? hydrate<CmsBlock>(row) : null;
  },

  create(data: Partial<CmsBlock>, actorId?: string, actorName?: string): CmsBlock {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');
    const id = generateId('BLK');
    const ts = now();
    const block: CmsBlock = {
      id,
      page_id: data.page_id || '',
      type: data.type || 'rich_text',
      sort_order: data.sort_order || 0,
      visible: data.visible ?? 1,
      title_en: data.title_en || '',
      title_ar: data.title_ar || '',
      body_en: data.body_en || '',
      body_ar: data.body_ar || '',
      config: typeof data.config === 'object' ? JSON.stringify(data.config) : (data.config || '{}'),
      created_at: ts,
      updated_at: ts,
    };

    c.prepare(`
      INSERT INTO cms_blocks (id, page_id, type, sort_order, visible, title_en, title_ar,
        body_en, body_ar, config, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(block.id, block.page_id, block.type, block.sort_order, block.visible,
      block.title_en, block.title_ar, block.body_en, block.body_ar,
      block.config, block.created_at, block.updated_at);

    logRevision('block', id, 'create', actorId || '', actorName || '', { page_id: block.page_id, type: block.type });
    return block;
  },

  update(id: string, data: Partial<CmsBlock>, actorId?: string, actorName?: string): CmsBlock | null {
    const c = conn();
    if (!c) return null;
    const existing = this.findById(id);
    if (!existing) return null;

    const ts = now();
    const updated = { ...existing, ...data, updated_at: ts };
    const configStr = typeof updated.config === 'object' ? JSON.stringify(updated.config) : updated.config;

    c.prepare(`
      UPDATE cms_blocks SET page_id = ?, type = ?, sort_order = ?, visible = ?,
        title_en = ?, title_ar = ?, body_en = ?, body_ar = ?, config = ?, updated_at = ?
      WHERE id = ?
    `).run(updated.page_id, updated.type, updated.sort_order, updated.visible,
      updated.title_en, updated.title_ar, updated.body_en, updated.body_ar,
      configStr, updated.updated_at, id);

    logRevision('block', id, 'update', actorId || '', actorName || '', { fields: Object.keys(data) });
    return updated;
  },

  remove(id: string): boolean {
    const c = conn();
    if (!c) return false;
    const result = c.prepare('DELETE FROM cms_blocks WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// ============================================================================
// Media CRUD
// ============================================================================

export const cmsMedia = {
  findAll(category?: string): CmsMedia[] {
    const c = conn();
    if (!c) return [];
    if (category) {
      return c.prepare('SELECT * FROM cms_media WHERE category = ? ORDER BY created_at DESC')
        .all(category).map(hydrate<CmsMedia>);
    }
    return c.prepare('SELECT * FROM cms_media ORDER BY created_at DESC')
      .all().map(hydrate<CmsMedia>);
  },

  findById(id: string): CmsMedia | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_media WHERE id = ?').get(id);
    return row ? hydrate<CmsMedia>(row) : null;
  },

  create(data: Partial<CmsMedia>, actorId?: string, actorName?: string): CmsMedia {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');
    const id = generateId('MED');
    const ts = now();
    const media: CmsMedia = {
      id,
      filename: data.filename || '',
      original_url: data.original_url || '',
      storage_path: data.storage_path || '',
      mime_type: data.mime_type || 'image/jpeg',
      file_size: data.file_size || 0,
      width: data.width || 0,
      height: data.height || 0,
      aspect_ratio: data.aspect_ratio || '',
      alt_en: data.alt_en || '',
      alt_ar: data.alt_ar || '',
      caption_en: data.caption_en || '',
      caption_ar: data.caption_ar || '',
      credit: data.credit || '',
      category: data.category || 'general',
      tags: data.tags || '',
      usage_count: 0,
      created_at: ts,
      updated_at: ts,
    };

    c.prepare(`
      INSERT INTO cms_media (id, filename, original_url, storage_path, mime_type,
        file_size, width, height, aspect_ratio, alt_en, alt_ar, caption_en, caption_ar,
        credit, category, tags, usage_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(media.id, media.filename, media.original_url, media.storage_path, media.mime_type,
      media.file_size, media.width, media.height, media.aspect_ratio,
      media.alt_en, media.alt_ar, media.caption_en, media.caption_ar,
      media.credit, media.category, media.tags, media.usage_count,
      media.created_at, media.updated_at);

    logRevision('media', id, 'create', actorId || '', actorName || '');
    return media;
  },

  update(id: string, data: Partial<CmsMedia>, actorId?: string, actorName?: string): CmsMedia | null {
    const c = conn();
    if (!c) return null;
    const existing = this.findById(id);
    if (!existing) return null;

    const ts = now();
    const updated = { ...existing, ...data, updated_at: ts };

    c.prepare(`
      UPDATE cms_media SET filename = ?, original_url = ?, storage_path = ?, mime_type = ?,
        file_size = ?, width = ?, height = ?, aspect_ratio = ?,
        alt_en = ?, alt_ar = ?, caption_en = ?, caption_ar = ?,
        credit = ?, category = ?, tags = ?, updated_at = ?
      WHERE id = ?
    `).run(updated.filename, updated.original_url, updated.storage_path, updated.mime_type,
      updated.file_size, updated.width, updated.height, updated.aspect_ratio,
      updated.alt_en, updated.alt_ar, updated.caption_en, updated.caption_ar,
      updated.credit, updated.category, updated.tags, updated.updated_at, id);

    logRevision('media', id, 'update', actorId || '', actorName || '', { fields: Object.keys(data) });
    return updated;
  },

  remove(id: string): boolean {
    const c = conn();
    if (!c) return false;
    const result = c.prepare('DELETE FROM cms_media WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// ============================================================================
// Homepage Sections CRUD
// ============================================================================

export const cmsHomepage = {
  findAll(): CmsHomepageSection[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_homepage_sections ORDER BY sort_order')
      .all().map(hydrate<CmsHomepageSection>);
  },

  findByKey(key: string): CmsHomepageSection | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_homepage_sections WHERE section_key = ?').get(key);
    return row ? hydrate<CmsHomepageSection>(row) : null;
  },

  upsert(data: Partial<CmsHomepageSection>, actorId?: string, actorName?: string): CmsHomepageSection {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');

    const existing = this.findByKey(data.section_key || '');
    const ts = now();
    const configStr: string = typeof data.config === 'object' ? JSON.stringify(data.config) : String(data.config || '{}');

    if (existing) {
      c.prepare(`
        UPDATE cms_homepage_sections SET title_en = ?, title_ar = ?, visible = ?,
          sort_order = ?, config = ?, updated_at = ?
        WHERE section_key = ?
      `).run(
        data.title_en ?? existing.title_en,
        data.title_ar ?? existing.title_ar,
        data.visible ?? existing.visible,
        data.sort_order ?? existing.sort_order,
        configStr, ts, data.section_key
      );
      logRevision('homepage_section', existing.id, 'update', actorId || '', actorName || '', { section_key: data.section_key });
      return { ...existing, ...data, config: configStr, updated_at: ts } as CmsHomepageSection;
    }

    const id = generateId('HSEC');
    c.prepare(`
      INSERT INTO cms_homepage_sections (id, section_key, title_en, title_ar, visible, sort_order, config, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.section_key || '', data.title_en || '', data.title_ar || '',
      data.visible ?? 1, data.sort_order ?? 0, configStr, ts);

    logRevision('homepage_section', id, 'create', actorId || '', actorName || '', { section_key: data.section_key });
    return {
      id, section_key: data.section_key || '', title_en: data.title_en || '', title_ar: data.title_ar || '',
      visible: data.visible ?? 1, sort_order: data.sort_order ?? 0, config: configStr, updated_at: ts
    };
  },

  remove(sectionKey: string): boolean {
    const c = conn();
    if (!c) return false;
    const result = c.prepare('DELETE FROM cms_homepage_sections WHERE section_key = ?').run(sectionKey);
    return result.changes > 0;
  }
};

// ============================================================================
// Navigation CRUD
// ============================================================================

export const cmsNavigation = {
  findByMenu(menuKey: string): CmsNavigation[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_navigation WHERE menu_key = ? AND visible = 1 ORDER BY item_order')
      .all(menuKey).map(hydrate<CmsNavigation>);
  },

  findAllByMenu(menuKey: string): CmsNavigation[] {
    const c = conn();
    if (!c) return [];
    return c.prepare('SELECT * FROM cms_navigation WHERE menu_key = ? ORDER BY item_order')
      .all(menuKey).map(hydrate<CmsNavigation>);
  },

  findById(id: string): CmsNavigation | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_navigation WHERE id = ?').get(id);
    return row ? hydrate<CmsNavigation>(row) : null;
  },

  create(data: Partial<CmsNavigation>, actorId?: string, actorName?: string): CmsNavigation {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');
    const id = generateId('NAV');
    const ts = now();

    c.prepare(`
      INSERT INTO cms_navigation (id, menu_key, item_order, label_en, label_ar, route,
        external_url, visible, open_in_new, icon, group_label_en, group_label_ar, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.menu_key || '', data.item_order || 0,
      data.label_en || '', data.label_ar || '', data.route || '',
      data.external_url || '', data.visible ?? 1, data.open_in_new ?? 0,
      data.icon || '', data.group_label_en || '', data.group_label_ar || '', ts, ts);

    logRevision('navigation', id, 'create', actorId || '', actorName || '', { menu_key: data.menu_key });
    return { ...data, id, created_at: ts, updated_at: ts } as CmsNavigation;
  },

  update(id: string, data: Partial<CmsNavigation>, actorId?: string, actorName?: string): CmsNavigation | null {
    const c = conn();
    if (!c) return null;
    const existing = this.findById(id);
    if (!existing) return null;

    const ts = now();
    const updated = { ...existing, ...data, updated_at: ts };

    c.prepare(`
      UPDATE cms_navigation SET menu_key = ?, item_order = ?, label_en = ?, label_ar = ?,
        route = ?, external_url = ?, visible = ?, open_in_new = ?, icon = ?,
        group_label_en = ?, group_label_ar = ?, updated_at = ?
      WHERE id = ?
    `).run(updated.menu_key, updated.item_order, updated.label_en, updated.label_ar,
      updated.route, updated.external_url, updated.visible, updated.open_in_new,
      updated.icon, updated.group_label_en, updated.group_label_ar, updated.updated_at, id);

    logRevision('navigation', id, 'update', actorId || '', actorName || '', { fields: Object.keys(data) });
    return updated;
  },

  remove(id: string): boolean {
    const c = conn();
    if (!c) return false;
    const result = c.prepare('DELETE FROM cms_navigation WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// ============================================================================
// SEO CRUD
// ============================================================================

export const cmsSeo = {
  find(pageType: string, pageId: string): CmsSeo | null {
    const c = conn();
    if (!c) return null;
    const row = c.prepare('SELECT * FROM cms_seo WHERE page_type = ? AND page_id = ?').get(pageType, pageId);
    return row ? hydrate<CmsSeo>(row) : null;
  },

  upsert(data: Partial<CmsSeo>, actorId?: string, actorName?: string): CmsSeo {
    const c = conn();
    if (!c) throw new Error('CMS database unavailable');
    const ts = now();

    const existing = this.find(data.page_type || '', data.page_id || '');

    if (existing) {
      c.prepare(`
        UPDATE cms_seo SET title_en = ?, title_ar = ?, description_en = ?, description_ar = ?,
          og_title_en = ?, og_title_ar = ?, og_description_en = ?, og_description_ar = ?,
          og_image_url = ?, canonical_url = ?, noindex = ?, updated_at = ?
        WHERE page_type = ? AND page_id = ?
      `).run(
        data.title_en ?? existing.title_en, data.title_ar ?? existing.title_ar,
        data.description_en ?? existing.description_en, data.description_ar ?? existing.description_ar,
        data.og_title_en ?? existing.og_title_en, data.og_title_ar ?? existing.og_title_ar,
        data.og_description_en ?? existing.og_description_en, data.og_description_ar ?? existing.og_description_ar,
        data.og_image_url ?? existing.og_image_url, data.canonical_url ?? existing.canonical_url,
        data.noindex ?? existing.noindex, ts,
        data.page_type, data.page_id
      );
      return { ...existing, ...data, updated_at: ts } as CmsSeo;
    }

    const id = generateId('SEO');
    c.prepare(`
      INSERT INTO cms_seo (id, page_type, page_id, title_en, title_ar, description_en, description_ar,
        og_title_en, og_title_ar, og_description_en, og_description_ar, og_image_url,
        canonical_url, noindex, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.page_type || '', data.page_id || '',
      data.title_en || '', data.title_ar || '', data.description_en || '', data.description_ar || '',
      data.og_title_en || '', data.og_title_ar || '', data.og_description_en || '', data.og_description_ar || '',
      data.og_image_url || '', data.canonical_url || '', data.noindex ?? 0, ts);

    return { id, ...data, updated_at: ts } as CmsSeo;
  }
};

// ============================================================================
// Revisions
// ============================================================================

export const cmsRevisions = {
  findAll(entityType?: string, entityId?: string, limit = 50): CmsRevision[] {
    const c = conn();
    if (!c) return [];

    if (entityType && entityId) {
      return c.prepare('SELECT * FROM cms_revisions WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ?')
        .all(entityType, entityId, limit).map(hydrate<CmsRevision>);
    }
    if (entityType) {
      return c.prepare('SELECT * FROM cms_revisions WHERE entity_type = ? ORDER BY created_at DESC LIMIT ?')
        .all(entityType, limit).map(hydrate<CmsRevision>);
    }
    return c.prepare('SELECT * FROM cms_revisions ORDER BY created_at DESC LIMIT ?')
      .all(limit).map(hydrate<CmsRevision>);
  }
};
