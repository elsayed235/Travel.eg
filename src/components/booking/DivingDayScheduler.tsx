import React from 'react';
import { Calendar, Clock, AlertCircle, Sparkles, Check, Info, Sun, Utensils, Compass, Waves } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface DivingDaySchedulerProps {
  selectedDay: number; // 2, 3, or 4
  onSelectDay: (day: number) => void;
  selectedTime: string;
}

export const DivingDayScheduler: React.FC<DivingDaySchedulerProps> = ({
  selectedDay,
  onSelectDay,
  selectedTime,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const days = [
    {
      dayNumber: 2,
      label: isAr ? 'اليوم ٢' : 'Day 2',
      badge: isAr ? 'موصى به' : 'Recommended',
      isRecommended: true,
      description: isAr ? 'مجدول بعد قسط كافٍ من الراحة في يوم الوصول' : 'Scheduled after morning rest from arrival day',
    },
    {
      dayNumber: 3,
      label: isAr ? 'اليوم ٣' : 'Day 3',
      badge: isAr ? 'متاح' : 'Available',
      isRecommended: false,
      description: isAr ? 'فترة صباحية في منتصف الرحلة' : 'Mid-trip morning slot',
    },
    {
      dayNumber: 4,
      label: isAr ? 'اليوم ٤' : 'Day 4',
      badge: isAr ? 'متاح' : 'Available',
      isRecommended: false,
      description: isAr ? 'قبل موعد سفاري الصحراء في فترة ما بعد الظهر' : 'Before late afternoon desert safari',
    },
  ];

  return (
    <div
      id="diving-day-scheduler"
      className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F7F3EA]">
            {isAr ? 'متى تفضل ممارسة الغطس؟' : 'When would you like to dive?'}
          </h3>
          <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
            {isAr ? 'منسق بتوافق تام مع وتيرة برنامج رحلتك الممتد لـ ٥ أيام' : 'Coordinated with your 5-day Dahab itinerary pace'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#13312B] px-3 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#52C4B7]" />
          <span className="font-bold text-[#F7F3EA]">{isAr ? `الوقت الموصى به: ${selectedTime}` : `Recommended time: ${selectedTime}`}</span>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div>
        <label className="text-xs font-bold text-[#F7F3EA] block mb-2">
          {isAr ? 'اختر يوم النشاط في البرنامج' : 'Select itinerary day'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {days.map((d) => {
            const isDaySelected = selectedDay === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                type="button"
                id={`day-select-btn-${d.dayNumber}`}
                onClick={() => onSelectDay(d.dayNumber)}
                className={`p-4 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                  isDaySelected
                    ? 'border-[#20A89A] ring-2 ring-[#20A89A]/30 bg-[#13312B] shadow-xs'
                    : d.isRecommended
                    ? 'border-white/20 hover:border-white/40 bg-[#13312B]/70'
                    : 'border-white/10 hover:border-white/25 bg-[#13312B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F7F3EA] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#52C4B7]" />
                    <span>{d.label}</span>
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      d.isRecommended
                        ? 'bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/40'
                        : 'bg-white/10 text-[#D2E3DE]/60'
                    }`}
                  >
                    {d.badge}
                  </span>
                </div>

                <div className="text-[12px] text-[#D2E3DE]/70 leading-tight">
                  {d.description}
                </div>

                <div className="pt-1 flex items-center justify-between text-[12px]">
                  <span className="font-bold text-[#52C4B7]">{selectedTime}</span>
                  {isDaySelected && (
                    <span className="text-[#20A89A] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>{isAr ? 'تم الاختيار' : 'Selected'}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Warning if user shifts away from Day 2 */}
      {selectedDay !== 2 && (
        <div
          id="schedule-shift-warning"
          className="p-4 rounded-2xl bg-[#13312B] border border-[#F4C36C]/40 text-[#F4C36C] text-xs flex items-start gap-3 animate-in fade-in duration-150"
        >
          <AlertCircle className="w-4 h-4 text-[#F4C36C] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-[#F7F3EA]">
              {isAr ? 'قد يؤثر تعديل موعد هذا النشاط على جدول اليوم الثاني.' : 'Moving this activity may affect your Day 2 schedule.'}
            </span>
            <p className="text-[#D2E3DE]/80 text-[12px] leading-relaxed">
              {isAr
                ? `تم تخطيط الغطس في الأساس لصباح اليوم الثاني. تم نقل الموعد إلى اليوم ${selectedDay} في تمام ${selectedTime}. يمكنك مراجعة الجدول المحدث في أي وقت.`
                : `Your generated itinerary originally planned Dahab diving for Day 2 morning. We have slotted diving onto Day ${selectedDay} at ${selectedTime}. You can review the updated timeline anytime.`}
            </p>
          </div>
        </div>
      )}

      {/* Coordinated Schedule Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#13312B] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{isAr ? `برنامج اليوم ${selectedDay}` : `Your Day ${selectedDay}`}</span>
          </span>
          <span className="text-[12px] text-[#D2E3DE]/60 font-medium">
            {isAr ? 'إيقاع متوازن · دون استعجال أو ضغط' : 'Balanced pace · No rushed transfers'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* 09:00 Diving Activity */}
          <div className="p-3 rounded-xl bg-[#20A89A]/15 border border-[#20A89A]/40 text-[#F7F3EA] flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#20A89A] text-[#081714] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Waves className="w-3 h-3" />
            </span>
            <div>
              <div className="font-bold text-xs">{isAr ? '٠٩:٠٠ · الغطس' : '09:00 · Diving'}</div>
              <div className="text-[12px] text-[#D2E3DE]/80">
                {isAr ? 'جلسة غطس إرشادية واستكشاف الشعاب' : 'Guided dive session & reef discovery'}
              </div>
            </div>
          </div>

          {/* 13:00 Lunch */}
          <div className="p-3 rounded-xl bg-[#081714]/40 border border-white/10 text-[#F7F3EA] flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white/10 text-[#52C4B7] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Utensils className="w-3 h-3" />
            </span>
            <div>
              <div className="font-bold text-xs text-[#F7F3EA]">{isAr ? '١٣:٠٠ · الغداء' : '13:00 · Lunch'}</div>
              <div className="text-[12px] text-[#D2E3DE]/60">
                {isAr ? 'مأكولات بحرية طازجة على البحر' : 'Fresh seaside seafood by the bay'}
              </div>
            </div>
          </div>

          {/* 15:00 Free Time */}
          <div className="p-3 rounded-xl bg-[#081714]/40 border border-white/10 text-[#F7F3EA] flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white/10 text-[#52C4B7] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sun className="w-3 h-3" />
            </span>
            <div>
              <div className="font-bold text-xs text-[#F7F3EA]">{isAr ? '١٥:٠٠ · وقت حر' : '15:00 · Free Time'}</div>
              <div className="text-[12px] text-[#D2E3DE]/60">
                {isAr ? 'جولة في مقاهي الممشى أو استرخاء على الشاطئ' : 'Lighthouse cafe stroll or beach rest'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
