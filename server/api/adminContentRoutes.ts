import { Router, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import { AuthenticatedRequest } from '../middleware/correlationMiddleware';
import {
  cmsPages, cmsBlocks, cmsMedia, cmsHomepage, cmsNavigation, cmsSeo, cmsRevisions
} from '../services/contentService';
import {
  validateImageUpload,
  filenameFrom,
  MediaUploadError,
  ALLOWED_IMAGE_MIME_TYPES,
} from '../services/mediaUpload';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Admin Content API — manages CMS content.
 *
 * All routes require authentication. Write operations require Operations or Admin.
 * Product role can create and edit drafts but cannot publish.
 */
export const adminContentRouter = Router();

// Apply auth and role check to all routes
adminContentRouter.use(requireAuth);
adminContentRouter.use(requireRole('Operations', 'Admin', 'Product'));

// ============================================================================
// Pages
// ============================================================================

adminContentRouter.get('/pages', (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const pages = cmsPages.findAll(status);
    res.json({ status: 'success', count: pages.length, pages, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.get('/pages/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.findById(req.params.id);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    const blocks = cmsBlocks.findByPageId(page.id);
    const seo = cmsSeo.find('page', page.id);
    res.json({ status: 'success', page, blocks, seo, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/pages', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.create(req.body, req.user!.userId, req.user!.name);
    res.status(201).json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/pages/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.update(req.params.id, req.body, req.user!.userId, req.user!.name);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    res.json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/pages/:id/publish', (req: AuthenticatedRequest, res: Response) => {
  try {
    // Only Operations and Admin can publish
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot publish content', correlationId: req.correlationId });
    }
    const page = cmsPages.publish(req.params.id, req.user!.userId, req.user!.name);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    res.json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/pages/:id/archive', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot archive content', correlationId: req.correlationId });
    }
    const page = cmsPages.archive(req.params.id, req.user!.userId, req.user!.name);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    res.json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.delete('/pages/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ status: 'error', message: 'Only Admin can delete pages', correlationId: req.correlationId });
    }
    const removed = cmsPages.remove(req.params.id);
    if (!removed) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    res.json({ status: 'success', message: 'Page deleted', correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Blocks
// ============================================================================

adminContentRouter.get('/blocks/:pageId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const blocks = cmsBlocks.findByPageId(req.params.pageId);
    res.json({ status: 'success', count: blocks.length, blocks, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/blocks', (req: AuthenticatedRequest, res: Response) => {
  try {
    const block = cmsBlocks.create(req.body, req.user!.userId, req.user!.name);
    res.status(201).json({ status: 'success', block, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/blocks/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const block = cmsBlocks.update(req.params.id, req.body, req.user!.userId, req.user!.name);
    if (!block) return res.status(404).json({ status: 'error', message: 'Block not found', correlationId: req.correlationId });
    res.json({ status: 'success', block, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.delete('/blocks/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const removed = cmsBlocks.remove(req.params.id);
    if (!removed) return res.status(404).json({ status: 'error', message: 'Block not found', correlationId: req.correlationId });
    res.json({ status: 'success', message: 'Block deleted', correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Media
// ============================================================================

adminContentRouter.get('/media', (req: AuthenticatedRequest, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const media = cmsMedia.findAll(category);
    res.json({ status: 'success', count: media.length, media, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/media', (req: AuthenticatedRequest, res: Response) => {
  try {
    const asset = cmsMedia.create(req.body, req.user!.userId, req.user!.name);
    res.status(201).json({ status: 'success', asset, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/media/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const asset = cmsMedia.update(req.params.id, req.body, req.user!.userId, req.user!.name);
    if (!asset) return res.status(404).json({ status: 'error', message: 'Media asset not found', correlationId: req.correlationId });
    res.json({ status: 'success', asset, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.delete('/media/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const removed = cmsMedia.remove(req.params.id);
    if (!removed) return res.status(404).json({ status: 'error', message: 'Media asset not found', correlationId: req.correlationId });
    res.json({ status: 'success', message: 'Media asset deleted', correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Media Upload — accepts base64 data URLs, saves to local disk
// ============================================================================

const MEDIA_UPLOAD_DIR = path.join(process.cwd(), 'data', 'cms-media');

// Ensure upload directory exists
function ensureMediaDir(): void {
  if (!fs.existsSync(MEDIA_UPLOAD_DIR)) {
    fs.mkdirSync(MEDIA_UPLOAD_DIR, { recursive: true });
  }
}

/**
 * POST /media/upload
 * Upload a file as base64 data URL. The client converts the file to base64
 * and sends it in the request body. The server saves it to disk and creates
 * a media asset record.
 */
adminContentRouter.post('/media/upload', (req: AuthenticatedRequest, res: Response) => {
  try {
    ensureMediaDir();
    const { dataUrl, filename, alt_en, alt_ar, caption_en, caption_ar, category, credit, tags } = req.body;

    const parsed = validateImageUpload(dataUrl);
    const buffer = parsed.buffer;
    const mimeType = parsed.mimeType;

    // The stored filename is server-determined: the extension comes from the
    // byte-sniffed MIME (never the client's `filename`), and the stem is
    // sanitized to [a-zA-Z0-9_-] (dots removed) and capped at 60 chars. The
    // client's original filename is preserved as a display-only field.
    const { stored, display } = filenameFrom(parsed.mimeType, filename || `upload-${Date.now()}`);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${stored}`;
    const filePath = path.join(MEDIA_UPLOAD_DIR, uniqueName);

    // Write file to disk (full buffer was already validated against the
    // allow-list, size cap, magic-body check, and MIME-vs-bytes match).
    fs.writeFileSync(filePath, buffer);

// Create media asset record. `filename` is the original client filename
    // (display only); the sanitized safe stem (extension from the sniffed MIME)
    // already lives in `uniqueName`, so `storage_path` is authoritative on disk.
    const asset = cmsMedia.create({
      filename: display,
      original_url: `/api/media/${uniqueName}`,
      storage_path: filePath,
      mime_type: mimeType,
      file_size: buffer.length,
      width: parsed.width,
      height: parsed.height,
      aspect_ratio: parsed.width && parsed.height ? `${parsed.width}/${parsed.height}` : '',
      alt_en: alt_en || '',
      alt_ar: alt_ar || '',
      caption_en: caption_en || '',
      caption_ar: caption_ar || '',
      credit: credit || '',
      category: category || 'general',
      tags: tags || '',
    }, req.user!.userId, req.user!.name);

    res.status(201).json({ status: 'success', asset, correlationId: req.correlationId });
  } catch (err: any) {
    const status = err && (err.statusCode || (err instanceof MediaUploadError ? 400 : 500));
    res.status(status).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Homepage Sections
// ============================================================================

adminContentRouter.get('/homepage', (req: AuthenticatedRequest, res: Response) => {
  try {
    const sections = cmsHomepage.findAll();
    res.json({ status: 'success', count: sections.length, sections, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/homepage/:sectionKey', (req: AuthenticatedRequest, res: Response) => {
  try {
    const section = cmsHomepage.upsert(
      { ...req.body, section_key: req.params.sectionKey },
      req.user!.userId,
      req.user!.name
    );
    res.json({ status: 'success', section, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Navigation
// ============================================================================

adminContentRouter.get('/navigation/:menuKey', (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = cmsNavigation.findAllByMenu(req.params.menuKey);
    res.json({ status: 'success', count: items.length, items, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/navigation', (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = cmsNavigation.create(req.body, req.user!.userId, req.user!.name);
    res.status(201).json({ status: 'success', item, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/navigation/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = cmsNavigation.update(req.params.id, req.body, req.user!.userId, req.user!.name);
    if (!item) return res.status(404).json({ status: 'error', message: 'Navigation item not found', correlationId: req.correlationId });
    res.json({ status: 'success', item, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.delete('/navigation/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ status: 'error', message: 'Only Admin can delete navigation items', correlationId: req.correlationId });
    }
    const removed = cmsNavigation.remove(req.params.id);
    if (!removed) return res.status(404).json({ status: 'error', message: 'Navigation item not found', correlationId: req.correlationId });
    res.json({ status: 'success', message: 'Navigation item deleted', correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// SEO
// ============================================================================

adminContentRouter.get('/seo/:pageType/:pageId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const seo = cmsSeo.find(req.params.pageType, req.params.pageId);
    res.json({ status: 'success', seo: seo || null, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.patch('/seo/:pageType/:pageId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const seo = cmsSeo.upsert(
      { ...req.body, page_type: req.params.pageType, page_id: req.params.pageId },
      req.user!.userId,
      req.user!.name
    );
    res.json({ status: 'success', seo, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Schedule Publishing
// ============================================================================

adminContentRouter.post('/pages/:id/schedule', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot schedule publishing', correlationId: req.correlationId });
    }
    const { scheduledAt } = req.body;
    if (!scheduledAt) {
      return res.status(400).json({ status: 'error', message: 'scheduledAt is required', correlationId: req.correlationId });
    }
    const page = cmsPages.schedule(req.params.id, scheduledAt, req.user!.userId, req.user!.name);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found', correlationId: req.correlationId });
    res.json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Rollback
// ============================================================================

adminContentRouter.post('/pages/:id/rollback', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot rollback content', correlationId: req.correlationId });
    }
    const { revisionId } = req.body;
    if (!revisionId) {
      return res.status(400).json({ status: 'error', message: 'revisionId is required', correlationId: req.correlationId });
    }
    const page = cmsPages.rollback(req.params.id, revisionId, req.user!.userId, req.user!.name);
    if (!page) return res.status(404).json({ status: 'error', message: 'Page or revision not found', correlationId: req.correlationId });
    res.json({ status: 'success', page, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Preview (Draft Preview by Token)
// ============================================================================

adminContentRouter.get('/preview/:token', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.findByPreviewToken(req.params.token);
    if (!page) return res.status(404).json({ status: 'error', message: 'Preview not found', correlationId: req.correlationId });
    const blocks = cmsBlocks.findByPageId(page.id);
    const seo = cmsSeo.find('page', page.id);
    res.json({ status: 'success', page, blocks, seo, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Bulk Operations
// ============================================================================

adminContentRouter.post('/pages/bulk-publish', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot publish content', correlationId: req.correlationId });
    }
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'error', message: 'ids array is required', correlationId: req.correlationId });
    }
    const results: { id: string; success: boolean; error?: string }[] = [];
    for (const id of ids) {
      try {
        const page = cmsPages.publish(id, req.user!.userId, req.user!.name);
        results.push({ id, success: !!page });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }
    res.json({ status: 'success', results, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/pages/bulk-archive', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role === 'Product') {
      return res.status(403).json({ status: 'error', message: 'Product role cannot archive content', correlationId: req.correlationId });
    }
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'error', message: 'ids array is required', correlationId: req.correlationId });
    }
    const results: { id: string; success: boolean; error?: string }[] = [];
    for (const id of ids) {
      try {
        const page = cmsPages.archive(id, req.user!.userId, req.user!.name);
        results.push({ id, success: !!page });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }
    res.json({ status: 'success', results, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

adminContentRouter.post('/pages/bulk-delete', (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ status: 'error', message: 'Only Admin can delete pages', correlationId: req.correlationId });
    }
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'error', message: 'ids array is required', correlationId: req.correlationId });
    }
    const results: { id: string; success: boolean; error?: string }[] = [];
    for (const id of ids) {
      try {
        const removed = cmsPages.remove(id);
        results.push({ id, success: removed });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }
    res.json({ status: 'success', results, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Scheduled Publishing Check (Admin trigger)
// ============================================================================

adminContentRouter.post('/pages/check-scheduled', (req: AuthenticatedRequest, res: Response) => {
  try {
    const published = cmsPages.checkScheduled();
    res.json({ status: 'success', published: published.length, pages: published, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});

// ============================================================================
// Revisions
// ============================================================================

adminContentRouter.get('/revisions', (req: AuthenticatedRequest, res: Response) => {
  try {
    const entityType = req.query.entityType as string | undefined;
    const entityId = req.query.entityId as string | undefined;
    const limit = Number(req.query.limit) || 50;
    const revisions = cmsRevisions.findAll(entityType, entityId, limit);
    res.json({ status: 'success', count: revisions.length, revisions, correlationId: req.correlationId });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, correlationId: req.correlationId });
  }
});
