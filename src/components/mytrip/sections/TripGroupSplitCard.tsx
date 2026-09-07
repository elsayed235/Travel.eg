import React from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';

interface TripGroupSplitCardProps {
  travelersCount: number;
  onShare: () => void;
}

export const TripGroupSplitCard: React.FC<TripGroupSplitCardProps> = ({ travelersCount, onShare }) => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
      isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)]'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base chart-heading font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--accent-primary)]" />
          <span>{t('myTrip.groupTravel')}</span>
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]">
          {travelersCount} {t('myTrip.travelers')}
        </span>
      </div>

      <p className={`text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
        {t('myTrip.shareAnInviteLink')}
      </p>

      <button
        type="button"
        onClick={onShare}
        className="w-full py-3 rounded-2xl bg-[var(--accent-secondary)] hover:brightness-110 text-[#1A1206] text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-[background-color,border-color,color,box-shadow,transform,opacity] active:scale-98"
      >
        <Users className="w-3.5 h-3.5 text-[var(--surface-container)]" />
        <span>{t('myTrip.inviteFriend')}</span>
      </button>
    </div>
  );
};