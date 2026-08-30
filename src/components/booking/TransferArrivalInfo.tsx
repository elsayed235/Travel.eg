import React from 'react';
import { Plane, MapPin, Users, Info, Luggage, UserCheck, Navigation, ShieldCheck } from 'lucide-react';
import { HotelOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface TransferArrivalInfoProps {
  selectedHotel: HotelOption | null;
  flightNumber: string;
  onFlightNumberChange: (value: string) => void;
}

export const TransferArrivalInfo: React.FC<TransferArrivalInfoProps> = ({
  selectedHotel,
  flightNumber,
  onFlightNumberChange,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const hotelName = selectedHotel ? (isAr && selectedHotel.nameAr ? selectedHotel.nameAr : selectedHotel.name) : (isAr ? 'فندق خليج دهب' : 'Dahab Bay Hotel');
  const hotelLoc = selectedHotel ? (isAr && selectedHotel.locationAr ? selectedHotel.locationAr : selectedHotel.location) : (isAr ? 'منطقة اللايتهاوس، دهب' : 'Lighthouse Area, Dahab');

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. Your Arrival Details Card */}
      <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F7F3EA]">
              {isAr ? 'تفاصيل وصولك' : 'Your arrival'}
            </h3>
            <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
              {isAr ? 'مسار الرحلة المنسق من شرم الشيخ إلى دهب' : 'Trip route coordinated from Sharm El Sheikh to Dahab'}
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-1 rounded-full">
            {isAr ? 'استقبال منسق' : 'Coordinated Pickup'}
          </span>
        </div>

        {/* Coordinated Trip Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Origin Airport */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-1.5">
            <span className="text-[12px] font-bold text-[#D2E3DE]/50 uppercase tracking-wider block">
              {isAr ? 'المطار' : 'Airport'}
            </span>
            <div className="flex items-start gap-2 text-[#F7F3EA] font-bold text-sm">
              <Plane className="w-4 h-4 text-[#52C4B7] flex-shrink-0 mt-0.5" />
              <span>{isAr ? 'مطار شرم الشيخ الدولي' : 'Sharm El Sheikh International Airport'}</span>
            </div>
            <p className="text-[12px] text-[#D2E3DE]/60 font-normal">
              {isAr ? 'صالة الوصول الرئيسية (SSH)' : 'Main arrival terminal (SSH)'}
            </p>
          </div>

          {/* Destination Hotel */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-1.5">
            <span className="text-[12px] font-bold text-[#D2E3DE]/50 uppercase tracking-wider block">
              {isAr ? 'وجهة الوصول' : 'Destination'}
            </span>
            <div className="flex items-start gap-2 text-[#F7F3EA] font-bold text-sm">
              <MapPin className="w-4 h-4 text-[#20A89A] flex-shrink-0 mt-0.5" />
              <span>{hotelName}</span>
            </div>
            <p className="text-[12px] text-[#D2E3DE]/60 font-normal">
              {hotelLoc}
            </p>
          </div>

          {/* Travelers */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-1.5">
            <span className="text-[12px] font-bold text-[#D2E3DE]/50 uppercase tracking-wider block">
              {isAr ? 'المسافرون' : 'Travelers'}
            </span>
            <div className="flex items-center gap-2 text-[#F7F3EA] font-bold text-sm">
              <Users className="w-4 h-4 text-[#52C4B7] flex-shrink-0" />
              <span>{isAr ? 'فردين بالغين' : '2 adults'}</span>
            </div>
            <p className="text-[12px] text-[#D2E3DE]/60 font-normal">
              {isAr ? 'أصدقاء · ميزانية متوازنة' : 'Friends · Moderate budget'}
            </p>
          </div>
        </div>

        {/* Optional Flight Number Field */}
        <div className="pt-2 border-t border-white/10">
          <label
            htmlFor="flight-number-input"
            className="block text-xs font-bold text-[#F7F3EA] mb-1.5"
          >
            {isAr ? 'رقم الرحلة الجوية' : 'Flight number'} <span className="text-[#D2E3DE]/40 font-normal">({isAr ? 'اختياري' : 'Optional'})</span>
          </label>
          <div className="max-w-xs">
            <input
              id="flight-number-input"
              type="text"
              value={flightNumber}
              onChange={(e) => onFlightNumberChange(e.target.value)}
              placeholder={isAr ? 'مثال: MS123' : 'e.g. MS123'}
              className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-[#13312B] text-sm text-[#F7F3EA] placeholder-[#D2E3DE]/35 focus:outline-none focus:ring-2 focus:ring-[#20A89A]/50 focus:border-[#20A89A] transition-all font-mono"
            />
          </div>
          <p className="text-[12px] text-[#D2E3DE]/60 mt-1.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#52C4B7] flex-shrink-0" />
            <span>{isAr ? 'اختياري — يساعد السائق في تتبع موعد وصول الطائرة بدقة وأي تأخير محتمل.' : 'Optional — helps the driver track your arrival and flight delays.'}</span>
          </p>
        </div>
      </div>

      {/* 2. Pickup Instructions (When you arrive) */}
      <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xs space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F7F3EA]">
              {isAr ? 'عند وصولك للمطار' : 'When you arrive'}
            </h3>
            <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
              {isAr ? '٣ خطوات سهلة للاستقبال في مطار شرم الشيخ' : 'Simple 3-step arrival coordination at Sharm El Sheikh Airport'}
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#52C4B7]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-[#20A89A] text-[#081714] text-xs font-bold flex items-center justify-center">
                01
              </span>
              <Luggage className="w-4 h-4 text-[#52C4B7]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F7F3EA] mb-0.5">
                {isAr ? 'استلام الحقائب والأمتعة' : 'Collect your luggage'}
              </h4>
              <p className="text-[12px] text-[#D2E3DE]/70 leading-relaxed font-normal">
                {isAr ? 'استلم حقائبك وتوجه مباشرة نحو بوابة الخروج بصالة الوصول.' : 'Clear baggage claim and proceed through the arrival exit.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-[#20A89A] text-[#081714] text-xs font-bold flex items-center justify-center">
                02
              </span>
              <UserCheck className="w-4 h-4 text-[#52C4B7]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F7F3EA] mb-0.5">
                {isAr ? 'مقابلة سائقك الخاص' : 'Meet your driver at arrival'}
              </h4>
              <p className="text-[12px] text-[#D2E3DE]/70 leading-relaxed font-normal">
                {isAr ? 'سيكون سائقك بانتظارك بصالة الوصول حاملاً لافتة باسمك.' : 'Your driver will be waiting in the arrival hall holding a sign with your name.'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-[#20A89A] text-[#081714] text-xs font-bold flex items-center justify-center">
                03
              </span>
              <Navigation className="w-4 h-4 text-[#52C4B7]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F7F3EA] mb-0.5">
                {isAr ? 'الانطلاق المباشر لفندقك' : 'Direct to your hotel'}
              </h4>
              <p className="text-[12px] text-[#D2E3DE]/70 leading-relaxed font-normal">
                {isAr ? 'ينقلك السائق مباشرة لفندقك في دهب (حوالي ساعة في طريق ساحلي آمن).' : 'Your driver takes you directly to your hotel in Dahab (~1 hour drive).'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

