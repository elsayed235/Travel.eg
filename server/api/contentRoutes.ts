import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/correlationMiddleware';
import { cmsPages, cmsBlocks, cmsHomepage, cmsNavigation, cmsMedia } from '../services/contentService';

/**
 * Public Content API — serves published CMS content to the website.
 *
 * These endpoints are read-only and return only status='published' content.
 * They fall back to empty results when the CMS database is unavailable,
 * allowing the frontend to use its compiled fallback data.
 */
export const contentRouter = Router();

/**
 * GET /api/content/homepage
 * Homepage configuration: hero section, featured items, section ordering.
 */
contentRouter.get('/homepage', (req: AuthenticatedRequest, res: Response) => {
  try {
    const sections = cmsHomepage.findAll()
      .filter(s => s.visible);

    const featuredPrograms = cmsPages.findPublishedByType('trip_program')
      .filter(p => p.featured)
      .slice(0, 6);

    const featuredGallery = cmsPages.findPublishedByType('gallery')
      .filter(p => p.featured)
      .slice(0, 8);

    const featuredStories = cmsPages.findPublishedByType('curated_story')
      .filter(p => p.featured)
      .slice(0, 4);

    // Hero section config
    const heroSection = sections.find(s => s.section_key === 'hero');

    res.json({
      status: 'success',
      hero: heroSection ? {
        title_en: heroSection.title_en,
        title_ar: heroSection.title_ar,
        config: typeof heroSection.config === 'string'
          ? (() => { try { return JSON.parse(heroSection.config); } catch { return {}; } })()
          : heroSection.config
      } : null,
      sections,
      featuredPrograms,
      featuredGallery,
      featuredStories,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load homepage content',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/pages/:slug
 * Individual page content by slug with all its published blocks.
 */
contentRouter.get('/pages/:slug', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.findBySlug(req.params.slug);
    if (!page || page.status !== 'published') {
      return res.status(404).json({
        status: 'error',
        message: `Page '${req.params.slug}' not found or not published`,
        correlationId: req.correlationId
      });
    }

    const includeBlocks = req.query.include_blocks === 'true';
    const blocks = includeBlocks ? cmsBlocks.findByPageId(page.id) : [];

    res.json({
      status: 'success',
      page,
      blocks,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load page',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/explore-categories
 * Published explore category pages.
 */
contentRouter.get('/explore-categories', (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = cmsPages.findPublishedByType('explore_category')
      .sort((a, b) => a.sort_order - b.sort_order);
    res.json({
      status: 'success',
      count: categories.length,
      categories,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load explore categories',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/gallery
 * Published gallery photos.
 */
contentRouter.get('/gallery', (req: AuthenticatedRequest, res: Response) => {
  try {
    const photos = cmsPages.findPublishedByType('gallery');
    res.json({
      status: 'success',
      count: photos.length,
      photos,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load gallery',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/programmes
 * Published trip programmes.
 */
contentRouter.get('/programmes', (req: AuthenticatedRequest, res: Response) => {
  try {
    const programmes = cmsPages.findPublishedByType('trip_program');
    res.json({
      status: 'success',
      count: programmes.length,
      programmes,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load programmes',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/stories
 * Published curated stories.
 */
contentRouter.get('/stories', (req: AuthenticatedRequest, res: Response) => {
  try {
    const stories = cmsPages.findPublishedByType('curated_story');
    res.json({
      status: 'success',
      count: stories.length,
      stories,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load stories',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/navigation/:menuKey
 * Published navigation items for header/footer/mobile.
 */
contentRouter.get('/navigation/:menuKey', (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = cmsNavigation.findByMenu(req.params.menuKey);
    res.json({
      status: 'success',
      menuKey: req.params.menuKey,
      count: items.length,
      items,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load navigation',
      correlationId: req.correlationId
    });
  }
});

/**
 * GET /api/content/preview/:token
 * Draft preview — allows viewing unpublished content via a unique preview token.
 * No authentication required (the token itself is the access control).
 */
contentRouter.get('/preview/:token', (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = cmsPages.findByPreviewToken(req.params.token);
    if (!page) {
      return res.status(404).json({
        status: 'error',
        message: 'Preview not found or expired',
        correlationId: req.correlationId
      });
    }
    const blocks = cmsBlocks.findByPageId(page.id);
    res.json({
      status: 'success',
      page,
      blocks,
      correlationId: req.correlationId
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to load preview',
      correlationId: req.correlationId
    });
  }
});
