/**
 * Formatting for a trip's real dates.
 *
 * "Oct 12 – Oct 16, 2026" was written as a literal string in three places on
 * the my-trip page — the header, the trip-style panel and the timeline banner —
 * so a trip starting on any other date still displayed October. The trip
 * record carries startDate and endDate; this reads them, and says nothing when
 * they are absent rather than inventing a range.
 */
export function formatTripDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  locale: 'en' | 'ar'
): string | null {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const tag = locale === 'ar' ? 'ar-EG' : 'en-GB';
  const dayMonth = (date: Date) => date.toLocaleDateString(tag, { day: 'numeric', month: 'short' });
  const sameYear = start.getFullYear() === end.getFullYear();

  return sameYear
    ? `${dayMonth(start)} – ${dayMonth(end)}, ${end.getFullYear()}`
    : `${dayMonth(start)}, ${start.getFullYear()} – ${dayMonth(end)}, ${end.getFullYear()}`;
}
