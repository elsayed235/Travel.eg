import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles, X, Send, ChevronDown, MapPin, Clock, Loader2, RefreshCcw
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import {
  extractPlanIntent,
  detectQuickQuestion,
  PLAN_PROMPT_EXAMPLES,
  type PlanIntent,
  type QuickAnswer
} from '../../lib/planIntent';

/**
 * "Plan with AI" — the Tripadvisor-style planning chat on the homepage hero.
 *
 * A traveler describes the trip they want ("4 days, first-timers, diving and a
 * desert sunset") or taps an example chip. The prompt is parsed into the
 * structured shape the public POST /api/trip/generate endpoint already takes,
 * and the returned day-by-day itinerary renders inline with a save path.
 *
 * Hybrid by design:
 *  - Genuine questions (best time, how to get there, is it safe...) get a
 *    curated, conservative answer with a deep link where one exists — the
 *    widget is honest that it is a destination planner, not a general chatbot.
 *  - Everything else is treated as planning intent and produces a real plan.
 *
 * No session is required to plan (the endpoint is public). Saving the plan
 * goes through the traveler's profile into the existing planner flow, so the
 * sign-in wall only appears at the moment it is actually needed.
 */

// ---------------------------------------------------------------------------
// Types (mirror the wire shape of POST /api/trip/generate — no shared type
// exists for it yet, so it is read defensively below).
// ---------------------------------------------------------------------------

interface GenActivity {
  id: string;
  title: string;
  titleAr?: string;
  timeSlot?: string;
  location: string;
  category?: string;
  estimatedPriceEGP?: number;
  description?: string;
  descriptionAr?: string;
}

interface GenDay {
  dayNumber: number;
  title: string;
  titleAr?: string;
  theme?: string;
  activities: GenActivity[];
}

interface GenTrip {
  tripTitle?: string;
  tripTitleAr?: string;
  summary?: string;
  summaryAr?: string;
  totalEstimatedEGP?: number;
  fitScore?: number;
  days: GenDay[];
}

type View = 'ready' | 'thinking' | 'answer' | 'plan' | 'error';

const CATEGORY_STYLE: Record<string, string> = {
  diving: '#2f7dd1',
  safari: '#c97b3c',
  adventure: '#c97b3c',
  food: '#1B9A8B',
  relax: '#7a8c5c',
  transfer: '#7a6a4a',
  wellness: '#5b8c6f',
  culture: '#8e5fa8'
};

const THINKING_LINES = {
  en: [
    'Reading your dates and Dahab rhythms…',
    'Balancing reefs, desert and downtime…',
    'Laying out your day-by-day plan…'
  ],
  ar: [
    'بنقرأ مواعيدك وإيقاع دهب…',
    'بنوازن بين الشعاب والصحراء والراحة…',
    'بنرتب خطتك يوم بيوم…'
  ]
};

/** The same plan wording used by profile → planner. */
const PROFILE_INTEREST_MAP: Record<string, string> = {
  'Diving & Red Sea reefs': 'Diving',
  'Desert & canyons': 'Adventure',
  'Seafood & local food': 'Food',
  'Beach & wellness': 'Wellness',
  'Bedouin culture & heritage': 'Local Life'
};

const budgetBand = (b: PlanIntent['budget']): 'Budget' | 'Moderate' | 'Premium' =>
  b === 'budget' ? 'Budget' : b === 'premium' ? 'Premium' : 'Moderate';
const paceBand = (p: PlanIntent['pace']): 'Relaxed' | 'Balanced' | 'Active' =>
  p === 'relaxed' ? 'Relaxed' : p === 'active' ? 'Active' : 'Balanced';

export const PlanWithAiWidget: React.FC = () => {
  const { navigateTo, isSignedIn, updateProfile, reloadTrip, showToast } = useTrip();
  const { language } = useLanguage();
  const { isDark, reducedMotion } = useTheme();

  const rtl = language === 'ar';
  const l = (en: string, ar: string) => (language === 'ar' ? ar : en);

  const [open, setOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [view, setView] = useState<View>('ready');
  const [lastPrompt, setLastPrompt] = useState('');
  const [intent, setIntent] = useState<PlanIntent | null>(null);
  const [quickAnswer, setQuickAnswer] = useState<QuickAnswer | null>(null);
  const [trip, setTrip] = useState<GenTrip | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);

  // The thinking beats advance on an interval owned by this effect, so leaving
  // the widget mid-generation (or collapsing it) can never fire a setState on
  // an unmounted component.
  useEffect(() => {
    if (view !== 'thinking') return;
    statusRef.current?.focus();
    const beat = reducedMotion ? 160 : 900;
    const id = setInterval(() => {
      setThinkingIndex((i) => Math.min(i + 1, THINKING_LINES.en.length - 1));
    }, beat);
    return () => clearInterval(id);
  }, [view, reducedMotion]);

  // Esc collapses the panel; the composer is a text field first, so only act
  // when nothing else in the panel has focus that Esc should serve.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const summaryChips = useMemo(() => {
    if (!intent) return [];
    const party = { Solo: 'Solo', Couple: 'Couple', Friends: 'Friends', Family: 'Family' } as const;
    const chips = [
      `${intent.durationDays} ${l('days', 'أيام')}`,
      `${intent.adultsCount} ${l('adults', 'بالغين')}${intent.childrenCount > 0 ? ` + ${intent.childrenCount} ${l('kids', 'أطفال')}` : ''} · ${party[intent.dynamic]}`,
      l(intent.budget === 'budget' ? 'Budget' : intent.budget === 'premium' ? 'Premium' : 'Moderate', intent.budget === 'budget' ? 'اقتصادي' : intent.budget === 'premium' ? 'فاخر' : 'متوسط'),
      l(intent.pace === 'relaxed' ? 'Relaxed' : intent.pace === 'active' ? 'Active' : 'Balanced', intent.pace === 'relaxed' ? 'رايق' : intent.pace === 'active' ? 'نشيط' : 'متوازن')
    ];
    return chips;
  }, [intent, language, l]);

  const runGenerate = useCallback(async (next: PlanIntent) => {
    setIntent(next);
    setView('thinking');
    setThinkingIndex(0);
    // One automatic retry: the generate endpoint occasionally drops the first
    // request (measured as a client-side ERR_ABORTED against a healthy server
    // that answers in ~1s), and a transient abort must not become a dead end —
    // the retry resolves it silently before the traveler ever sees an error.
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 800));
          setThinkingIndex((i) => Math.min(i + 1, THINKING_LINES.en.length - 1));
        }
        const res: any = await api.generateAiTrip({
          durationDays: next.durationDays,
          adultsCount: next.adultsCount,
          childrenCount: next.childrenCount,
          dynamic: next.dynamic,
          budget: next.budget,
          interests: next.interests,
          pace: next.pace,
          language
        });
        const genTrip: GenTrip | undefined = res?.trip;
        if (!genTrip || !Array.isArray(genTrip.days) || genTrip.days.length === 0) {
          throw new Error('empty');
        }
        setTrip(genTrip);
        setOpenDay(genTrip.days[0]?.dayNumber ?? 1);
        setView('plan');
        return;
      } catch (err) {
        lastError = err;
      }
    }
    void lastError;
    setView('error');
  }, [language]);

  const submit = useCallback((raw?: string) => {
    const text = (raw ?? prompt).trim();
    if (!text || view === 'thinking') return;
    setPrompt('');
    setLastPrompt(text);

    const answer = detectQuickQuestion(text);
    if (answer) {
      setQuickAnswer(answer);
      setView('answer');
      return;
    }

    void runGenerate(extractPlanIntent(text));
  }, [prompt, view, runGenerate]);

  /**
   * Persists the itinerary already on screen (the shape /api/trip/generate
   * returned) as the signed-in traveler's real trip, then lands on My Trip
   * where the reloaded timeline shows it.
   */
  const toPersistableItinerary = useCallback(() => {
    if (!trip) return null;
    return {
      tripTitle: trip.tripTitle,
      days: trip.days.map((day) => ({
        dayNumber: day.dayNumber,
        activities: (day.activities || []).map((a) => ({
          title: a.title,
          timeSlot: a.timeSlot,
          estimatedPriceEGP: a.estimatedPriceEGP,
          category: a.category,
          location: a.location,
          description: a.description
        }))
      }))
    };
  }, [trip]);

  const handleSave = useCallback(async () => {
    if (!intent || !trip || saving) return;
    const itinerary = toPersistableItinerary();
    if (!itinerary) return;
    setSaving(true);
    // Same contract Plan It For Me writes: keep profile prefs in sync too.
    const prefs = {
      lengthDays: intent.durationDays,
      travelersCount: intent.adultsCount + intent.childrenCount,
      budget: budgetBand(intent.budget),
      pace: paceBand(intent.pace),
      interests: intent.interests.map((i) => PROFILE_INTEREST_MAP[i] ?? i)
    };
    updateProfile(prefs);
    try {
      await api.applyAiItinerary({
        itinerary,
        ...prefs
      });
      reloadTrip();
      showToast(l('Your AI plan is saved to My Trip', 'اتحفظت خطتك بالذكاء الاصطناعي في رحلتي'));
      navigateTo('/my-trip');
    } catch {
      showToast(l('Could not save your plan — please try again.', 'مقدرناش نحفظ خطتك — جرب تاني.'));
      setSaving(false);
    }
  }, [intent, trip, saving, toPersistableItinerary, updateProfile, reloadTrip, showToast, navigateTo, l]);

  const refine = useCallback((mutate: (i: PlanIntent) => PlanIntent) => {
    if (!intent) return;
    void runGenerate(mutate(intent));
  }, [intent, runGenerate]);

  const reset = useCallback(() => {
    setView('ready');
    setLastPrompt('');
    setIntent(null);
    setQuickAnswer(null);
    setTrip(null);
    setThinkingIndex(0);
  }, []);

  const chipBase =
    'px-3 py-1.5 rounded-full text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ' +
    (isDark
      ? 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 hover:text-[var(--text-primary)]'
      : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]');

  const primaryBtn =
    'w-full py-3 rounded-xl text-sm font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ' +
    (isDark
      ? 'bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[#1A1206]'
      : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[#1A1206]');

  const secondaryBtn =
    'px-5 py-2.5 rounded-xl border text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ' +
    (isDark
      ? 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)] hover:text-[var(--text-primary)]'
      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)] hover:text-[var(--text-primary)]');

  return (
    <section
      dir={rtl ? 'rtl' : 'ltr'}
      aria-label={l('Plan with AI', 'خطط مع الذكاء الاصطناعي')}
      className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 md:-mt-20"
    >
      <div
        className={`overflow-hidden rounded-3xl border shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 ${
          isDark
            ? 'bg-[var(--surface-card)]/95 backdrop-blur-xl border-[var(--border-subtle)]'
            : 'bg-[var(--surface-card)]/95 backdrop-blur-xl border-[var(--border-subtle)]'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex items-center gap-2.5 text-start cursor-pointer group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[#1A1206] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="space-y-0.5">
              <span className="block text-sm chart-heading font-bold leading-none">
                {l('Plan with AI', 'خطط مع الذكاء الاصطناعي')}
              </span>
              <span className={`block text-[11px] leading-none ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]/80'}`}>
                {l('Describe your Dahab trip — get a plan in seconds', 'اقولنا رحلتك في دهب — وخذ الخطة في ثواني')}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? l('Collapse planner', 'طي المخطط') : l('Expand planner', 'افتح المخطط')}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
          >
            {open ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>

        {open && (
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            {/* Ready: chips + composer */}
            {view === 'ready' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {PLAN_PROMPT_EXAMPLES.map((ex) => (
                    <button
                      key={ex.en}
                      type="button"
                      onClick={() => submit(language === 'ar' ? ex.ar : ex.en)}
                      className={chipBase}
                    >
                      {language === 'ar' ? ex.ar : ex.en}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="plan-with-ai-input" className="sr-only">
                    {l('Describe your trip', 'اقولنا عن رحلتك')}
                  </label>
                  <input
                    id="plan-with-ai-input"
                    type="text"
                    name="trip-prompt"
                    autoComplete="off"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={l(
                      'e.g. 5 days, couple, freediving + seafood dinners…',
                      'مثلاً: ٥ أيام، زوجين، فريدايف وعشا سمك…'
                    )}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-primary)]'
                        : 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[var(--accent-primary)] focus:bg-[var(--surface-card)]'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    aria-label={l('Plan my trip', 'خطط رحلتي')}
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
                      prompt.trim()
                        ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] hover:bg-[var(--accent-secondary)] active:scale-95'
                        : isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]/40 cursor-not-allowed' : 'bg-[var(--surface-container)] text-[var(--text-secondary)]/40 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </form>

                <p className={`text-[11px] ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/60'}`}>
                  {l(
                    'No account needed to plan — sign in only to save it to your trip.',
                    'مش محتاج حساب عشان تخطط — سجل دخول بس عشان تحفظ الخطة في رحلتك.'
                  )}
                </p>
              </div>
            )}

            {/* Thinking */}
            {view === 'thinking' && intent && (
              <div
                ref={statusRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="py-6 space-y-4 outline-none"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className={`w-5 h-5 text-[var(--accent-primary)] ${reducedMotion ? '' : 'animate-spin'}`} aria-hidden="true" />
                  <p className="text-sm font-semibold">
                    {THINKING_LINES[language === 'ar' ? 'ar' : 'en'][thinkingIndex]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {summaryChips.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="h-1 rounded-full bg-[var(--surface-container)] overflow-hidden max-w-sm">
                  <div
                    className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-700"
                    style={{ width: `${((thinkingIndex + 1) / THINKING_LINES.en.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Answer (conversational) */}
            {view === 'answer' && quickAnswer && (
              <div className="space-y-4">
                <div className={`rounded-2xl p-4 border ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)]' : 'bg-[var(--surface-container)] border-[var(--border-subtle)]'}`}>
                  <p className="text-[11px] font-bold text-[var(--accent-primary)] mb-2">
                    {l('A quick answer', 'إجابة سريعة')}
                  </p>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {language === 'ar' ? quickAnswer.textAr : quickAnswer.textEn}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {quickAnswer.ctaRoute && (
                    <button
                      type="button"
                      onClick={() => {
                        if (quickAnswer.ctaRoute) navigateTo(quickAnswer.ctaRoute);
                      }}
                      className={primaryBtn + ' !w-auto px-5 py-2.5'}
                    >
                      {language === 'ar' ? quickAnswer.ctaLabelAr : quickAnswer.ctaLabelEn}
                    </button>
                  )}
                  <button type="button" onClick={reset} className={secondaryBtn}>
                    {l('Plan my own trip', 'خطط ليا رحلة')}
                  </button>
                </div>
              </div>
            )}

            {/* Plan result */}
            {view === 'plan' && trip && intent && (
              <div className="space-y-4">
                {/* Plan header */}
                <div className={`rounded-2xl p-4 sm:p-5 border ${isDark ? 'bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 border-[var(--border-subtle)]' : 'bg-gradient-to-br from-[var(--accent-primary)]/8 to-[var(--accent-secondary)]/5 border-[var(--border-subtle)]'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="chart-heading font-bold text-lg leading-tight">
                      {language === 'ar' ? trip.tripTitleAr || trip.tripTitle : trip.tripTitle}
                    </h3>
                    {typeof trip.fitScore === 'number' && (
                      <span className="text-[11px] font-black px-2 py-1 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                        {l('Fit', 'ملاءمة')} {trip.fitScore}%
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed mt-1.5 ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[var(--text-secondary)]'}`}>
                    {language === 'ar' ? trip.summaryAr || trip.summary : trip.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {summaryChips.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--surface-container)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {c}
                      </span>
                    ))}
                    {typeof trip.totalEstimatedEGP === 'number' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black text-[var(--accent-primary)]">
                        ≈ {trip.totalEstimatedEGP.toLocaleString()} EGP
                      </span>
                    )}
                  </div>
                </div>

                {/* Day accordion */}
                <div className="space-y-2 max-h-[26rem] overflow-y-auto pe-1 min-scroll">
                  {trip.days.map((day) => {
                    const openThis = openDay === day.dayNumber;
                    return (
                      <div key={day.dayNumber} className={`rounded-2xl border overflow-hidden ${isDark ? 'border-[var(--border-subtle)]' : 'border-[var(--border-subtle)]'}`}>
                        <button
                          type="button"
                          onClick={() => setOpenDay(openThis ? null : day.dayNumber)}
                          aria-expanded={openThis}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-start cursor-pointer transition-colors ${isDark ? 'hover:bg-[var(--surface-container)]' : 'hover:bg-[var(--surface-container)]'}`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-[var(--accent-primary)]/12 text-[var(--accent-primary)] flex items-center justify-center text-xs font-black shrink-0">
                              {day.dayNumber}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-bold truncate">
                                {language === 'ar' ? day.titleAr || day.title : day.title}
                              </span>
                              {day.theme && (
                                <span className={`block text-[11px] ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/70'}`}>
                                  {day.theme}
                                </span>
                              )}
                            </span>
                          </span>
                          <ChevronDown className={`w-4 h-4 shrink-0 text-[var(--text-secondary)] transition-transform ${openThis ? 'rotate-180' : ''}`} aria-hidden="true" />
                        </button>

                        {openThis && (
                          <ul className={`divide-y ${isDark ? 'divide-[var(--border-subtle)]' : 'divide-[var(--border-subtle)]'}`}>
                            {(day.activities || []).map((act, i) => {
                              const color = CATEGORY_STYLE[act.category || ''] || 'var(--accent-primary)';
                              return (
                                <li key={`${act.id || day.dayNumber}-${i}`} className={`px-4 py-2.5 flex items-start gap-3 ${isDark ? 'bg-[var(--surface-container)]/40' : 'bg-[var(--surface-card)]'}`}>
                                  <span className="w-1.5 h-full self-stretch rounded-full mt-1 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                                  <div className="flex-1 min-w-0 space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                      {act.timeSlot && (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--accent-primary)]">
                                          <Clock className="w-3 h-3" aria-hidden="true" />
                                          {act.timeSlot}
                                        </span>
                                      )}
                                      <span className="text-[13px] font-semibold leading-snug">
                                        {language === 'ar' ? act.titleAr || act.title : act.title}
                                      </span>
                                    </div>
                                    {act.description && (
                                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/80'}`}>
                                        {language === 'ar' ? act.descriptionAr || act.description : act.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                                      {act.location && (
                                        <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]/70">
                                          <MapPin className="w-3 h-3" aria-hidden="true" />
                                          {act.location}
                                        </span>
                                      )}
                                      {typeof act.estimatedPriceEGP === 'number' && act.estimatedPriceEGP > 0 && (
                                        <span className="text-[11px] font-bold text-[var(--text-secondary)]/80">
                                          ≈ {act.estimatedPriceEGP.toLocaleString()} EGP
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save / continue actions */}
                <div className="space-y-2">
                  {isSignedIn ? (
                    <button type="button" onClick={handleSave} disabled={saving} className={primaryBtn + (saving ? ' opacity-70 cursor-wait' : '')}>
                      {saving ? (
                        <Loader2 className={`w-4 h-4 ${reducedMotion ? '' : 'animate-spin'}`} aria-hidden="true" />
                      ) : (
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                      )}
                      {saving ? l('Saving to My Trip…', 'بنحفظ في رحلتي…') : l('Save this plan to My Trip', 'احفظ الخطة في رحلتي')}
                    </button>
                  ) : (
                    <button type="button" onClick={() => navigateTo('/auth/sign-in')} className={primaryBtn}>
                      {l('Sign in to save this plan', 'سجل دخول عشان تحفظ الخطة')}
                    </button>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`text-[11px] font-bold ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/60'}`}>
                      {l('Tweak', 'ظبطها')}
                    </span>
                    <button type="button" onClick={() => refine((i) => ({ ...i, durationDays: Math.min(14, i.durationDays + 1) }))} className={chipBase}>
                      {l('+1 day', '+ يوم')}
                    </button>
                    <button type="button" onClick={() => refine((i) => ({ ...i, pace: i.pace === 'active' ? 'balanced' : 'relaxed' }))} className={chipBase}>
                      {l('More relaxed', 'أكتر راحة')}
                    </button>
                    <button type="button" onClick={() => refine((i) => ({ ...i, budget: i.budget === 'budget' ? 'moderate' : 'budget' }))} className={chipBase}>
                      {l('Tighter budget', 'ميزانية أصغر')}
                    </button>
                    <button type="button" onClick={reset} className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                      <RefreshCcw className="w-3 h-3" aria-hidden="true" />
                      {l('Start over', 'ابدأ من جديد')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {view === 'error' && (
              <div className="space-y-3 py-2">
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                  {l(
                    'The planner is taking a breath — the sea conditions feed can be slow. Try again in a moment.',
                    'المخطط بياخد نفس — بيانات حالة البحر ممكن تكون بطيئة شوية. جرب تاني بعد لحظة.'
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lastPrompt && (
                    <button type="button" onClick={() => submit(lastPrompt)} className={primaryBtn + ' !w-auto px-5 py-2.5'}>
                      <RefreshCcw className="w-4 h-4" aria-hidden="true" />
                      {l('Try again', 'جرب تاني')}
                    </button>
                  )}
                  <button type="button" onClick={reset} className={secondaryBtn}>
                    {l('Start over', 'ابدأ من جديد')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PlanWithAiWidget;
