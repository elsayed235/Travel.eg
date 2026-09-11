import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/correlationMiddleware';
import { db } from '../db/database';
import { stringParam, enumListParam, stringListParam } from '../middleware/queryParams';
import { requiredString, InvalidRequestBodyError } from '../middleware/bodyParams';
import { AccommodationSearchFilters } from '../db/schema';
import {
  PROPERTY_TYPES,
  ACCOMMODATION_CATEGORIES,
  ACCOMMODATION_PRICE_BANDS,
  searchAccommodations,
  toAccommodationView,
  getAreaGuide,
  getAccommodationCatalogueMeta,
  listSources
} from '../services/accommodationService';
import { parseAccommodationSearchIntent } from '../services/geminiReasoningService';
import * as longStayService from '../services/longStayService';
import {
  applyAccommodationOverlay,
  applyAccommodationViewOverlays,
  applySkuOverlay,
  applySupplierOverlay,
  getPublishedOverlays,
} from '../services/catalogContentService';

export const accommodationRouter = Router();

function sendError(res: Response, err: any) {
  const status = err.status || 400;
  res.status(status).json({ error: err.message });
}

function filtersFromQuery(req: AuthenticatedRequest): AccommodationSearchFilters {
  const minRating = req.query.minRating != null ? Number(req.query.minRating) : undefined;
  const maxPerNightEGP = req.query.maxPerNightEGP != null ? Number(req.query.maxPerNightEGP) : undefined;
  const guests = req.query.guests != null ? Number(req.query.guests) : undefined;

  return {
    q: stringParam(req.query.q, 'q'),
    propertyTypes: enumListParam(req.query.propertyType, PROPERTY_TYPES, 'propertyType'),
    categories: enumListParam(req.query.category, ACCOMMODATION_CATEGORIES, 'category'),
    priceBands: enumListParam(req.query.priceBand, ACCOMMODATION_PRICE_BANDS, 'priceBand'),
    areaIds: stringListParam(req.query.areaId, 'areaId'),
    minRating: Number.isFinite(minRating) ? minRating : undefined,
    maxPerNightEGP: Number.isFinite(maxPerNightEGP) ? maxPerNightEGP : undefined,
    guests: Number.isFinite(guests) ? guests : undefined,
    mustHaveAmenities: stringListParam(req.query.mustHaveAmenities, 'mustHaveAmenities'),
    sort: enumListParam(req.query.sort, ['relevance', 'rating', 'price_asc', 'price_desc'] as const, 'sort')?.[0]
  };
}

/** Browsing the full catalogue: filters, stats and editorial chrome. */
accommodationRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = filtersFromQuery(req);
    const results = searchAccommodations(filters);
    const meta = getAccommodationCatalogueMeta();

    const stats = {
      total: results.length,
      averageRating: results.length
        ? Math.round((results.reduce((sum, a) => sum + a.rating, 0) / results.length) * 10) / 10
        : 0,
      totalReviews: results.reduce((sum, a) => sum + a.reviewCount, 0),
      updatedLabel: meta.updatedLabel
    };

    res.json({
      accommodations: applyAccommodationViewOverlays(results.map(toAccommodationView)),
      areas: getAreaGuide(db.accommodations.filter(a => a.active)),
      stats,
      disclaimer: meta.disclaimer,
      filters: {
        propertyTypes: PROPERTY_TYPES,
        categories: ACCOMMODATION_CATEGORIES,
        priceBands: ACCOMMODATION_PRICE_BANDS
      }
    });
  } catch (err: any) {
    sendError(res, err);
  }
});

/** Natural-language search intent, parsed into the same AccommodationSearchFilters
 *  structured search uses. The model only ever produces a filter object — the
 *  GET / query above remains the single source of truth for results. */
accommodationRouter.post('/search-intent', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = requiredString(req.body?.query, 'query', 500);
    const language = req.body?.language === 'ar' ? 'ar' : 'en';
    const result = await parseAccommodationSearchIntent(query, language);
    res.json(result);
  } catch (err: any) {
    if (err instanceof InvalidRequestBodyError) return sendError(res, err);
    sendError(res, { status: 500, message: 'Could not parse search intent.' });
  }
});

/** Public: list accommodations offering long-stay (weekly/monthly) pricing.
 *  Registered BEFORE /:slug — Express matches in registration order, so a
 *  later registration would be swallowed by the slug handler (404, because
 *  `long-stay` is not an accommodation slug). */
accommodationRouter.get('/long-stay', (req: AuthenticatedRequest, res: Response) => {
  const areaId = typeof req.query.areaId === 'string' ? req.query.areaId : undefined;
  const results = longStayService.getLongStayAccommodations(areaId);
  res.json({ accommodations: results });
});

/** A single property: full detail plus the availability contract and any
 *  admin-curated external reference links. */
accommodationRouter.get('/:slug', (req: AuthenticatedRequest, res: Response) => {
  try {
    const slug = req.params.slug?.toLowerCase().trim();
    const accommodation = db.accommodations.find(a => a.slug === slug && a.active);
    if (!accommodation) return res.status(404).json({ error: 'Accommodation not found.' });

    const sku = db.productSkus.find(s => s.id === accommodation.skuId);
    const supplier = db.suppliers.find(s => s.id === sku?.supplierId);
    const areaGuide = getAreaGuide([accommodation]).find(a => a.id === accommodation.areaId) || null;
    const meta = getAccommodationCatalogueMeta();

    // Published CMS copy/imagery overrides (no-op when nothing is published).
    const overlayMap = getPublishedOverlays('accommodation', [accommodation.id]);
    const skuMap = getPublishedOverlays('sku', sku ? [sku.id] : []);
    const supplierMap = getPublishedOverlays('supplier', supplier ? [supplier.id] : []);

    res.json({
      accommodation: applyAccommodationOverlay(toAccommodationView(accommodation), overlayMap[accommodation.id] ?? null),
      sku: sku
        ? applySkuOverlay({ id: sku.id, title: sku.title, titleAr: sku.titleAr, basePriceEGP: sku.basePriceEGP, maxCapacityPerSlot: sku.maxCapacityPerSlot, active: sku.active, serviceType: sku.serviceType }, skuMap[sku.id] ?? null)
        : null,
      supplier: supplier
        ? applySupplierOverlay({ id: supplier.id, businessName: supplier.businessName, businessNameAr: supplier.businessNameAr, area: supplier.area, city: supplier.city, coordinates: supplier.coordinates, rating: supplier.rating, reviewCount: supplier.reviewCount }, supplierMap[supplier.id] ?? null)
        : null,
      areaGuide,
      sources: listSources(accommodation.id),
      disclaimer: meta.disclaimer
    });
  } catch (err: any) {
    sendError(res, err);
  }
});
