import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, MapPin, MoveRight, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useTrip } from '../../../context/TripContext';
import { getActivityIcon } from '../tripActivityIcon';

interface TripTimelineTabProps {
  selectedDayFilter: 'all' | number;
  onDayFilter: (filter: 'all' | number) => void;
  expandedDays: Record<number, boolean>;
  onToggleDay: (dayNum: number) => void;
}

export const TripTimelineTab: React.FC<TripTimelineTabProps> = ({
  selectedDayFilter,
  onDayFilter,
  expandedDays,
  onToggleDay,
}) => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const { tripDays, navigateTo, removeActivityFromDay, shiftActivityBetweenDays, showToast } = useTrip();

  // Shift day selector state (for moving an activity)
  const [shiftingActivity, setShiftingActivity] = useState<{ id: string; fromDay: number } | null>(null);

  // Filtered days list
  const displayedDays = selectedDayFilter === 'all'
    ? tripDays
    : tripDays.filter(d => d.dayNumber === selectedDayFilter);

  return (
    <div className="space-y-6">
      
      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          id="filter-day-all-btn"
          onClick={() => onDayFilter('all')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedDayFilter === 'all'
              ? 'bg-[var(--accent-secondary)] text-[var(--surface-container)] shadow-md'
              : isDark
              ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)] border border-white/5'
              : 'bg-[var(--surface-card)] text-[#122420] hover:bg-stone-100 border border-[#122420]/10'
          }`}
        >
          {t('myTrip.allDays')} ({tripDays.length})
        </button>

        {tripDays.map(day => (
          <button
            key={day.dayNumber}
            type="button"
            id={`filter-day-${day.dayNumber}-btn`}
            onClick={() => onDayFilter(day.dayNumber)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDayFilter === day.dayNumber
                ? 'bg-[var(--accent-secondary)] text-[var(--surface-container)] shadow-md'
                : isDark
                ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)] border border-white/5'
                : 'bg-[var(--surface-card)] text-[#122420] hover:bg-stone-100 border border-[#122420]/10'
            }`}
          >
            {t('myTrip.dayZero', { dayNumber: day.dayNumber })}
          </button>
        ))}
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {displayedDays.map(day => {
          const isExpanded = expandedDays[day.dayNumber] ?? true;

          return (
            <div
              key={day.dayNumber}
              id={`timeline-day-${day.dayNumber}-card`}
              className={`rounded-3xl border shadow-xl overflow-hidden transition-all ${
                isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)]' : 'bg-[var(--surface-card)] border-[#122420]/10 text-[#122420]'
              }`}
            >
              {/* Day Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => onToggleDay(day.dayNumber)}
                className={`w-full p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors cursor-pointer text-start ${
                  isDark ? 'hover:bg-[var(--surface-container)]/60' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center font-bold text-sm font-serif shadow-xs">
                    {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight">
                      {day.title}
                    </h3>
                    <span className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                      {day.dateStr} · {day.activities.length} {t('myTrip.activities')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--accent-primary)] hidden sm:inline">
                    {isExpanded ? t('myTrip.collapseAll') : t('myTrip.expandAll')}
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                    isDark ? 'border-[var(--border-subtle)]' : 'border-[#122420]/10'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Day Activities Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 space-y-4 border-t border-current/10">
                  {day.activities.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                        {t('myTrip.emptyDay')}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigateTo('/explore')}
                        className="px-5 py-2.5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--surface-container)] text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4 text-[var(--surface-container)]" />
                        <span>{t('myTrip.exploreSpots')}</span>
                      </button>
                    </div>
                  ) : (
                    day.activities.map((act, actIdx) => (
                      <div
                        key={act.id || actIdx}
                        id={`activity-row-${act.id}`}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isDark ? 'bg-[var(--surface-container)]/70 border-white/5 hover:border-white/20' : 'bg-[#FAF8F5] border-[#122420]/10 hover:border-[#122420]/20'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-9 h-9 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            {getActivityIcon(act.type, act.title)}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-[var(--accent-secondary)]">
                                {act.time}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--surface-card)]/10 text-current">
                                {act.type}
                              </span>
                              {act.status && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                  {act.status}
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-serif font-bold text-current">
                              {act.title}
                            </h4>

                            <div className={`flex flex-wrap items-center gap-3 text-xs ${
                              isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'
                            }`}>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                                <span>{act.location}</span>
                              </span>
                              {act.notes && (
                                <>
                                  <span className="opacity-30">•</span>
                                  <span>{act.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Activity Row Interactive Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-current/10 w-full sm:w-auto justify-end">
                          
                          {/* Shift Day Selector */}
                          {shiftingActivity?.id === act.id ? (
                            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                              <span className="text-[10px] font-bold">{t('myTrip.shiftDay')}:</span>
                              {[1, 2, 3, 4, 5].map(d => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => {
                                    shiftActivityBetweenDays(act.id, day.dayNumber, d);
                                    setShiftingActivity(null);
showToast(
                                    t('myTrip.movedActivityToDay', { title: act.title, day: d })
                                  );
                                  }}
                                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    d === day.dayNumber
                                      ? 'bg-stone-500 text-[var(--text-primary)]'
                                      : 'bg-[var(--accent-secondary)] text-[var(--surface-container)] hover:scale-110'
                                  }`}
                                >
                                  {d}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => setShiftingActivity(null)}
                                className="text-xs text-rose-400 px-1 hover:underline cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              id={`shift-act-btn-${act.id}`}
                              onClick={() => setShiftingActivity({ id: act.id, fromDay: day.dayNumber })}
                              title={t('myTrip.shiftDay')}
                              className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                                isDark ? 'bg-[var(--surface-card)] hover:bg-[#1a4038] text-[var(--text-secondary)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] hover:bg-stone-100 text-[#122420] border-[#122420]/10'
                              }`}
                            >
                              <MoveRight className="w-3.5 h-3.5 rtl:rotate-180" />
                            </button>
                          )}

                          {/* View Experience Detail Page */}
                          <button
                            type="button"
                            id={`view-details-act-btn-${act.id}`}
                            onClick={() => {
                              // Search for matching experience slug
                              const slug = act.title.toLowerCase().includes('blue hole')
                                ? 'near-blue-hole'
                                : act.title.toLowerCase().includes('light')
                                ? 'near-lighthouse-reef'
                                : act.title.toLowerCase().includes('ralph')
                                ? 'near-ralphs'
                                : act.title.toLowerCase().includes('ali')
                                ? 'near-ali-baba'
                                : 'near-blue-hole';
                              navigateTo('/experiences', { experienceSlug: slug });
                            }}
                            title={t('myTrip.viewDetails')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              isDark ? 'bg-[var(--surface-card)] hover:bg-[#1a4038] text-[var(--accent-primary)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] hover:bg-stone-100 text-[#0F6F78] border-[#122420]/10'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('myTrip.viewDetails')}</span>
                          </button>

                          {/* Remove Activity */}
                          <button
                            type="button"
                            id={`remove-act-btn-${act.id}`}
                            onClick={() => {
                              removeActivityFromDay(day.dayNumber, act.id);
                              showToast(
                                t('myTrip.removedActivityFromDay', { title: act.title, day: day.dayNumber })
                              );
                            }}
                            title={t('myTrip.remove')}
                            className="p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Experience to This Specific Day */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id={`add-to-day-${day.dayNumber}-btn`}
                      onClick={() => navigateTo('/explore')}
                      className={`w-full py-3 rounded-2xl border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isDark
                          ? 'border-white/15 text-[var(--accent-primary)] hover:bg-[var(--surface-card)]/5 hover:border-[var(--accent-primary)]'
                          : 'border-[#122420]/15 text-[#0F6F78] hover:bg-stone-50 hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('myTrip.addExperienceToDay', { day: day.dayNumber })}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};