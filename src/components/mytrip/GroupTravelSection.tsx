import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';


export const GroupTravelSection: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { showToast, activeTrip, profile } = useTrip();
  const travelersCount = activeTrip?.travelersCount ?? profile.travelersCount ?? 1;
  const { isDark } = useTheme();

  return (
    <section 
      className={`rounded-3xl p-6 border shadow-lg space-y-5 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center justify-between border-b pb-4 ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold border ${
            isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-[#20A89A]/10 text-[#0E2520] border-[#20A89A]/20'
          }`}>
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-base font-bold font-['Outfit',sans-serif] ${
              isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
            }`}>
              {t('group.title')}
            </h2>
            <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              {language === 'ar'
                ? `${travelersCount} ${travelersCount === 1 ? 'مسافر' : 'مسافرين'} · تصويت ومشاركة التكاليف`
                : `${travelersCount} ${travelersCount === 1 ? 'Traveler' : 'Travelers'} · Voting & shared expenses`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast(language === 'ar' ? 'تم نسخ رابط دعوة الصديق للرحلة!' : 'Crew invite link copied!')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
              : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>{language === 'ar' ? 'دعوة صديق' : 'Invite'}</span>
        </button>
      </div>

      {/*
        This block used to show three named travelers — "Trip Crew: Ahmed,
        Omar, Sara" with matching avatars — voting on two activities, and a
        "$180 / traveler ($540 Total)" split. None of it came from anywhere:
        there is no group, member, vote or expense-split record in the backend,
        and the amounts were in dollars in a product priced in EGP. A traveler
        travelling alone was shown two strangers agreeing with them.

        The feature stays; what it shows is now the truth about it — nobody has
        been invited, and the Invite control above is how that changes.
      */}
      <div className={`p-5 rounded-2xl border text-center space-y-2 ${
        isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
      }`}>
        <p className={`text-sm font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
          {language === 'ar' ? 'لسه محدش اتدعى للرحلة' : 'No one invited yet'}
        </p>
        <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
          {language === 'ar'
            ? 'ابعت رابط الدعوة لرفاقك، وهتقدروا تصوّتوا على الأنشطة وتقسّموا التكاليف مع بعض.'
            : 'Share the invite link with the people coming with you, and you can vote on activities and split costs together.'}
        </p>
      </div>

    </section>
  );
};
