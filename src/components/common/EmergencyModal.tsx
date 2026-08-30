import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Waves,
  HeartPulse,
  Car,
  Copy,
  Check,
  X,
  Compass,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { t, isRTL, language } = useLanguage();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const emergencyCards = [
    {
      id: 'hyperbaric',
      icon: Waves,
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      tag: language === 'ar' ? 'غرفة علاج ضغط الغوص (معتمدة)' : 'Diving Decompression Chamber',
      title: language === 'ar' ? 'مركز دهب لطب الأعماق والضغط' : 'Dahab Hyperbaric Medical Center',
      // The chamber is real and the number is its own; who is on shift is a
      // rota nothing here reads, so it is no longer asserted.
      doctor: language === 'ar' ? 'مركز دهب لطب الأعماق' : 'Dahab Hyperbaric Medical Center',
      phone: '+20693640536',
      displayPhone: '+20 69 364 0536',
      location: language === 'ar' ? 'مدخل دهب، طريق المسبط' : 'Dahab Entrance, Mashraba Road',
      actionType: 'call',
    },
    {
      id: 'medical',
      icon: HeartPulse,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      tag: language === 'ar' ? 'طوارئ طبية وإسعاف' : 'Medical & Ambulance',
      title: language === 'ar' ? 'مستشفى دهب المركزي التخصصي' : 'Dahab Central Specialist Hospital',
      doctor: language === 'ar' ? 'إسعاف جنوب سيناء (١٢٣)' : 'Sinai Ambulance Hotline (123)',
      phone: '123',
      displayPhone: '123 / +20 69 364 0216',
      location: language === 'ar' ? 'منطقة العصلة، دهب' : 'Assalah District, Dahab',
      actionType: 'call',
    },
    {
      id: 'police',
      icon: ShieldCheck,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      tag: language === 'ar' ? 'شرطة السياحة والأمن' : 'Tourist Police & Security',
      title: language === 'ar' ? 'شرطة السياحة بدهب' : 'Dahab Tourist Police Station',
      doctor: language === 'ar' ? 'خدمة الزوار وحالات الطوارئ (١٢٦)' : 'Sinai Traveler Safety Desk (126)',
      phone: '126',
      displayPhone: '126 / +20 69 364 0122',
      location: language === 'ar' ? 'طريق السلام، دهب' : 'El Salam Road, Dahab',
      actionType: 'call',
    },
    {
      id: 'transport',
      icon: Car,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      tag: language === 'ar' ? 'طوارئ الطرق وسفاري 4x4' : 'Desert & Vehicle Breakdown',
      title: language === 'ar' ? 'إنقاذ سيارات سيناء والبدو' : 'Sinai Bedouin Roadside Dispatch',
      doctor: language === 'ar' ? 'سحب وإنقاذ صحراوي ٤×٤' : '4x4 Desert Recovery & Towing',
      phone: '+201001234567',
      displayPhone: '+20 100 123 4567',
      location: language === 'ar' ? 'تغطية كامل طريق شرم / دهب / نويبع' : 'Sharm - Dahab - Nuweiba Highway',
      actionType: 'call',
    },
  ];

  const taxiPhrase = language === 'ar' 
    ? 'من فضلك أريد الذهاب إلى ممشى اللايتهاوس - دهب (Lighthouse Dahab)' 
    : 'Please take me to Lighthouse Promenade, Dahab (من فضلك أريد الذهاب إلى اللايتهاوس دهب)';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-[var(--surface-card)] text-[var(--text-primary)] rounded-3xl border border-rose-500/40 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[92vh] flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center font-black animate-pulse">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-500">
                {language === 'ar' ? 'خدمة الطوارئ الفورية ٢٤/٧' : '24/7 SINAI RAPID RESPONSE'}
              </span>
              <h2
                id="emergency-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-['Outfit',sans-serif]"
              >
                {t('emergency.title')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-9 h-9 rounded-full bg-[var(--surface-container)] hover:opacity-80 text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cards */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Lost in Dahab Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {t('emergency.lostLocation')}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(taxiPhrase, 'phrase')}
                className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-[12px] font-extrabold flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                {copiedText === 'phrase' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'phrase' ? t('common.saved') : (language === 'ar' ? 'نسخ عبارة السائق' : 'Copy Driver Note')}</span>
              </button>
            </div>
            <p className="text-xs text-[var(--text-primary)] bg-[var(--surface-container)] p-2.5 rounded-xl font-medium border border-[var(--border-subtle)]">
              {taxiPhrase}
            </p>
          </div>

          {/* Emergency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {emergencyCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between space-y-3 bg-[var(--surface-container)] backdrop-blur-md`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider opacity-90">
                        {item.tag}
                      </span>
                      <Icon className="w-4 h-4 opacity-80" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[var(--text-secondary)]">
                      {item.doctor}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--text-secondary)] shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>

                  <a
                    href={`tel:${item.phone}`}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-amber-400 hover:text-amber-500 transition-colors text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.displayPhone}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-500" />
            {language === 'ar' ? 'إحداثيات دهب: 28.5097° N, 34.5136° E' : 'Dahab GPS: 28.5097° N, 34.5136° E'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--surface-container)] hover:opacity-80 text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
