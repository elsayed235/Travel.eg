import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { HomepageContent, CmsContentPage, CmsPageWithBlocks, NavigationItemWire } from '../services/api';

/**
 * CMS Content Hook — fetches published content from the CMS API
 * with automatic fallback to compiled static data when the API is unavailable.
 *
 * Only hooks with a real consumer live here. The gallery, stories rail and
 * photo showcase read their own /api/dahab/content/* feeds; hooks without a
 * consumer were deleted rather than kept as dead abstractions (a hook nobody
 * calls is a second source of truth waiting to drift — the homepage hero sat
 * unwired for weeks because of exactly that).
 *
 * Usage:
 *   const { data } = useHomepageContent();      // hero config in V2HomeCockpit
 *   const { data } = useContentPage('about');   // CmsStaticPage
 *   const { data } = useNavigation('header');   // V2Navbar
 */

interface UseCmsResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fromCMS: boolean;
}

/**
 * Generic hook to fetch CMS data with fallback.
 */
function useCmsFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  fallback: T
): UseCmsResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fromCMS, setFromCMS] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchFn(controller.signal);
        setData(result);
        setFromCMS(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[CMS] API unavailable, using fallback:', err.message);
          setData(fallback);
          setFromCMS(false);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  return { data: data ?? fallback, loading, error, fromCMS };
}

// ============================================================================
// Homepage Content
// ============================================================================

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: null,
  sections: [],
  featuredPrograms: [],
  featuredGallery: [],
  featuredStories: [],
};

export function useHomepageContent(): UseCmsResult<HomepageContent> {
  return useCmsFetch<HomepageContent>(
    async (signal) => {
      const data = await api.getCmsHomepage(signal);
      return data;
    },
    DEFAULT_HOMEPAGE
  );
}

// ============================================================================
// Trip Programmes — consumed by useReadyProgrammes (featured reordering),
// which the ready-trips carousel, compare modal and programme detail read.
// ============================================================================

export function useTripProgrammes(): UseCmsResult<CmsContentPage[]> {
  return useCmsFetch<CmsContentPage[]>(
    async (signal) => {
      const data = await api.getCmsProgrammes(signal);
      return data.programmes || [];
    },
    []
  );
}

// ============================================================================
// Content Page by Slug (with blocks)
// ============================================================================

export function useContentPage(slug: string): UseCmsResult<CmsPageWithBlocks> {
  return useCmsFetch<CmsPageWithBlocks>(
    async (signal) => {
      const data = await api.getCmsPage(slug, signal);
      return data;
    },
    { page: null, blocks: [] }
  );
}

// ============================================================================
// Navigation
// ============================================================================

type NavigationItem = NavigationItemWire;

export function useNavigation(menuKey: string): UseCmsResult<NavigationItem[]> {
  return useCmsFetch<NavigationItem[]>(
    async (signal) => {
      const data = await api.getCmsNavigation(menuKey, signal);
      return data.items || [];
    },
    []
  );
}
