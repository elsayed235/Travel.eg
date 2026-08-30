import { useMemo } from 'react';
import { api } from '../services/api';
import { useApiResource } from './useApiResource';
import { READY_TRIP_PROGRAMS, type ReadyTripProgram } from '../data/readyTripsData';

/**
 * The ready-made programmes, from the API.
 *
 * Three components render them — the carousel, the compare modal and the quick
 * start wizard — and each imported the compiled array directly, so a price or
 * a description change meant a rebuild and a deploy. They come from
 * GET /api/dahab/content/programmes now, served from
 * server/db/seeds/editorialContent.ts.
 *
 * One hook rather than three fetches: `useApiResource` is called once per
 * component that uses this, and the compiled array is the offline fallback so
 * a failed request degrades the page instead of emptying it.
 */
const fetchProgrammes = (signal: AbortSignal) => api.getReadyProgrammes(signal);

export function useReadyProgrammes(): ReadyTripProgram[] {
  const remote = useApiResource(fetchProgrammes);

  return useMemo(() => {
    const served = remote.data?.programmes;
    if (!Array.isArray(served) || served.length === 0) return READY_TRIP_PROGRAMS;
    return served as ReadyTripProgram[];
  }, [remote.data]);
}
