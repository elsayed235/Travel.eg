import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Car,
  Hotel,
  Compass,
  FileText,
  CreditCard,
  Download,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

export const TripReadinessCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { tripReadiness, toggleReadinessItem, navigateTo, showToast } = useTrip();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transfer':
        return <Car className="w-4 h-4 text-sky-600" />;
      case 'booking':
        return <Hotel className="w-4 h-4 text-indigo-600" />;
      case 'supplier':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'documents':
      default:
        return <FileText className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <section
      id="trip-readiness-card"
      className="w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[12px] font-black uppercase tracking-wider text-emerald-300 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'جاهزية السفر والتشغيل' : 'TRIP OS OPERATIONAL READINESS'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
            {language === 'ar' ? 'مستوى الاستعداد للرحلة والانطلاق' : 'Pre-Trip Readiness Checklist'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D2E3DE]/70">
            {language === 'ar'
              ? 'متابعة حية للتأكيدات اللوجستية، تصاريح المحميات، واستلام السائقين قبل وصولك لدهب.'
              : 'Real-time validation of transfers, hotel vouchers, dive slots, and Sinai passes.'}
          </p>
        </div>

        {/* Readiness Score Pill */}
        <div className="flex items-center gap-3 bg-[#13312B] px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 self-start sm:self-center">
          <div className="text-right rtl:text-left">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#D2E3DE]/60">
              {language === 'ar' ? 'نسبة الجاهزية' : 'READINESS'}
            </div>
            <div className="text-xs font-bold text-[#F7F3EA]">
              {language === 'ar' ? tripReadiness.statusAr : tripReadiness.status}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-extrabold text-sm shadow-xs">
            {tripReadiness.overallScore}%
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tripReadiness.items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleReadinessItem(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
              item.status === 'complete'
                ? 'bg-[#13312B] border-white/10 hover:border-emerald-500/40'
                : 'bg-[#13312B] border-[#F4C36C]/30 hover:border-[#F4C36C]/60'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#081714] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              {getCategoryIcon(item.category)}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#F4C36C] transition-colors">
                  {language === 'ar' ? item.labelAr : item.label}
                </h3>
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.status === 'complete'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/30'
                  }`}
                >
                  {item.status === 'complete'
                    ? language === 'ar' ? 'مكتمل ✓' : 'Verified ✓'
                    : language === 'ar' ? 'مطلوب إجراء' : 'Action Needed'}
                </span>
              </div>

              <p className="text-[12px] text-[#D2E3DE]/60 leading-snug">
                {language === 'ar' ? item.detailAr : item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Next Action Strip */}
      {tripReadiness.nextActionRequired && (
        <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 text-[#F7F3EA] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <Download className="w-4 h-4 text-[#F4C36C] shrink-0" />
            <span className="font-bold">
              {language === 'ar'
                ? `الخطوة التالية الموصى بها: ${tripReadiness.nextActionRequired.labelAr}`
                : `Next Recommended Action: ${tripReadiness.nextActionRequired.label}`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              showToast(language === 'ar' ? 'جاري تحميل الخرائط بدون إنترنت...' : 'Caching Dahab offline satellite pack...');
              toggleReadinessItem('rc-6');
            }}
            className="px-4 py-2 rounded-xl bg-[#F4C36C] hover:bg-amber-300 text-[#081714] font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>{language === 'ar' ? 'تنزيل الحزمة الآن' : 'Download Offline Pack'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      )}
    </section>
  );
};
