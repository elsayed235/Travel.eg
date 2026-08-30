import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  CreditCard,
  Building,
  Car,
  Waves,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ConfirmedBookingItem } from '../../types';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: 'diving' | 'safari' | 'transfer' | 'hotel';
}

const SERVICE_OPTIONS = [
  {
    type: 'diving' as const,
    labelEn: 'Diving',
    labelAr: 'غوص',
    title: 'Blue Hole & Canyon 2-Tank Dive Package',
    titleAr: 'باقة غطستين للبلو هول والكانيون',
    subtitle: 'Guided Coral Rift Dive with Master Instructor',
    subtitleAr: 'غطس بصحبة مرشد غوص محترف في أجمل شعاب دهب',
    basePriceEGP: 2200,
    icon: Waves,
    provider: 'Dahab Blue Divers Club',
    providerAr: 'نادي بلو دايفرز دهب',
    location: 'Lighthouse Bay Center',
    locationAr: 'مركز خليج اللايتهاوس',
    included: ['All tank fills & weights', 'Certified divemaster guide', 'Jeep transport to site', 'Reef reserve fees'],
    includedAr: ['أسطوانات الهواء والأوزان', 'مرشد غوص معتمد', 'توصيل جيب للموقع', 'رسوم المحميات الطبيعية'],
  },
  {
    type: 'safari' as const,
    labelEn: 'Safari',
    labelAr: 'سفاري',
    title: 'Wadi Gnai 4x4 Stargazing & Bedouin Campfire',
    titleAr: 'سفاري وادي قني 4x4 ورصد النجوم مع عشاء بدوي',
    subtitle: 'Desert Canyon Dinner & Acoustic Oud Music',
    subtitleAr: 'عشاء وادي صحراوي وموسيقى عود بدوية تحت النجوم',
    basePriceEGP: 1800,
    icon: Compass,
    provider: 'Sinai Bedouin Expeditions',
    providerAr: 'رحلات بدو سيناء',
    location: 'Wadi Gnai Canyon',
    locationAr: 'وادي قني',
    included: ['4x4 Land Cruiser pickup', 'Bedouin grilled BBQ dinner', 'Habak mountain tea', 'Stargazing telescope'],
    includedAr: ['انتقال سيارات لاندكروزر 4x4', 'عشاء مشويات بدوي طازج', 'شاي حبق جبلي ع الفحم', 'تلسكوب لرصد النجوم'],
  },
  {
    type: 'transfer' as const,
    labelEn: 'Transfer',
    labelAr: 'توصيل',
    title: 'Private Airport Transfer (Sharm SSH ⇄ Dahab)',
    titleAr: 'توصيل خاص من وإلى مطار شرم الشيخ ⇄ دهب',
    subtitle: 'Chauffeured Modern Air-Conditioned Vehicle',
    subtitleAr: 'سيارة حديثة ومكيفة مع سائق محترف وخدمة استقبال',
    basePriceEGP: 1400,
    icon: Car,
    provider: 'Sinai Coastal Fleet',
    providerAr: 'أسطول ساحل سيناء',
    location: 'Sharm Airport Gate 2',
    locationAr: 'مطار شرم الشيخ بوابة ٢',
    included: ['Meet & greet inside terminal', 'Luggage assistance', 'Toll fees & permits', 'Cold bottled water'],
    includedAr: ['استقبال بلافتة داخل الصالة', 'مساعدة في الحقائب', 'رسوم الطرق والتصاريح', 'مياه معدنية باردة'],
  },
  {
    type: 'hotel' as const,
    labelEn: 'Hotel',
    labelAr: 'فندق',
    title: 'Dahab Bay Hotel (Sea View Deluxe Room)',
    titleAr: 'فندق دهب باي (غرفة ديلوكس بإطلالة بانورامية ع البحر)',
    subtitle: 'Boutique Beachfront Stay on Lighthouse Bay',
    subtitleAr: 'إقامة بوتيك راقية على شاطئ خليج اللايتهاوس',
    basePriceEGP: 4200,
    icon: Building,
    provider: 'Dahab Bay Eco Lodges',
    providerAr: 'منتجعات دهب باي البيئية',
    location: 'Lighthouse Promenade',
    locationAr: 'ممشى اللايتهاوس',
    included: ['Ocean view terrace', 'Daily fresh breakfast buffet', 'Private beach palapa access', 'High-speed Wi-Fi'],
    includedAr: ['تراس خاص بإطلالة ع البحر', 'بوفيه إفطار طازج يومياً', 'دخول شاطئ خاص وجلسات', 'واي فاي سريع مجاني'],
  },
];

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'diving',
}) => {
  const { setBookings, showToast, navigateTo } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [selectedType, setSelectedType] = useState<'diving' | 'safari' | 'transfer' | 'hotel'>(initialService);
  const [selectedDate, setSelectedDate] = useState('2026-10-14');
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [travelersCount, setTravelersCount] = useState(2);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!isOpen) return null;

  const currentService = SERVICE_OPTIONS.find((s) => s.type === selectedType) || SERVICE_OPTIONS[0];
  const totalPrice = currentService.basePriceEGP * travelersCount;

  const handleConfirmBooking = () => {
    const code = `DHB-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedCode(code);

    const newBooking: ConfirmedBookingItem = {
      id: `book-${Date.now()}`,
      serviceType: currentService.type,
      title: isAr ? currentService.titleAr : currentService.title,
      subtitle: isAr ? currentService.subtitleAr : currentService.subtitle,
      details: isAr
        ? `${travelersCount} مسافرين · التاريخ: ${selectedDate} في ${selectedTime}`
        : `${travelersCount} Guests · Date: ${selectedDate} at ${selectedTime}`,
      datesOrTime: `${selectedDate} · ${selectedTime}`,
      priceEGP: totalPrice,
      provider: isAr ? currentService.providerAr : currentService.provider,
      confirmationCode: code,
      status: 'Confirmed ✓',
      location: isAr ? currentService.locationAr : currentService.location,
      iconType: currentService.type === 'hotel' ? 'building' : currentService.type === 'transfer' ? 'car' : currentService.type === 'diving' ? 'waves' : 'compass',
      phone: '+20 100 882 1920',
      included: isAr ? currentService.includedAr : currentService.included,
      cancellationPolicy: isAr ? 'إلغاء مجاني حتى ٢٤ ساعة قبل الموعد' : 'Free cancellation up to 24h before scheduled start',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setIsSuccess(true);
    showToast(isAr ? `تم تأكيد الحجز بكود ${code} بنجاح!` : `Booking ${code} confirmed successfully!`);
  };

  const handleViewBookings = () => {
    onClose();
    navigateTo('/bookings');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'حجز تجارب دهب السريع' : 'Book Sinai Experience'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-white text-slate-950 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#071417] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-['Outfit',sans-serif]">
                {isAr ? 'كونسيرج سيناء المباشر' : 'Direct Sinai Concierge'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              {isSuccess
                ? (isAr ? 'تم تأكيد الحجز بنجاح' : 'Reservation Confirmed')
                : (isAr ? 'حجز فوري ومضمون' : 'Instant Verified Booking')}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close modal'}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-950 font-['Outfit',sans-serif]">
                {isAr ? 'جاهز لرحلتك في دهب!' : "You're All Set in Dahab!"}
              </h4>
              <p className="text-sm text-slate-600">
                {isAr
                  ? 'قسيمة الحجز جاهزة وتمت مزامنتها مع جدول الرحلة ومحفظة الحجوزات.'
                  : 'Your reservation voucher is ready and synced with your itinerary.'}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 text-start space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">{isAr ? 'قسيمة التأكيد' : 'Confirmation Voucher'}</span>
                <span className="text-sm font-black text-teal-800 font-mono tracking-wider">
                  #{generatedCode}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {isAr ? currentService.titleAr : currentService.title}
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedDate} {isAr ? 'الساعة' : 'at'} {selectedTime}</span>
              </div>
              <div className="text-xs text-slate-600">
                {travelersCount} {isAr ? 'مسافرين' : 'Travelers'} · {isAr ? 'المجموع:' : 'Total Paid:'} <strong>{totalPrice.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleViewBookings}
                className="flex-1 py-3.5 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'عرض في حجوزاتي' : 'View in My Bookings'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                {isAr ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Service Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isAr ? 'اختر الخدمة' : 'Select Service'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SERVICE_OPTIONS.map((srv) => {
                  const active = selectedType === srv.type;
                  const Icon = srv.icon;
                  return (
                    <button
                      key={srv.type}
                      type="button"
                      onClick={() => setSelectedType(srv.type)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        active
                          ? 'bg-slate-950 text-white border-slate-950 shadow-md font-bold'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="text-[12px]">{isAr ? srv.labelAr : srv.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Service Card */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-950 font-['Outfit',sans-serif]">
                    {isAr ? currentService.titleAr : currentService.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {isAr ? currentService.subtitleAr : currentService.subtitle}
                  </p>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="text-base font-black text-slate-950 font-['Outfit',sans-serif]">
                    {currentService.basePriceEGP} {isAr ? 'جنيه' : 'EGP'}
                  </div>
                  <div className="text-[11px] text-slate-500">{isAr ? 'للفرد' : 'per person'}</div>
                </div>
              </div>

              {/* What's included */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-1.5 text-[12px] text-slate-700">
                {(isAr ? currentService.includedAr : currentService.included).map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-teal-700 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Guests Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {isAr ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {isAr ? 'الوقت' : 'Time'}
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="08:30 AM">{isAr ? '٠٨:٣٠ ص (غطس الصباح الباكر)' : '08:30 AM (Morning Reef)'}</option>
                  <option value="11:30 AM">{isAr ? '١١:٣٠ ص (منتصف النهار)' : '11:30 AM (Midday)'}</option>
                  <option value="03:30 PM">{isAr ? '٠٣:٣٠ م (بعد الظهر)' : '03:30 PM (Afternoon)'}</option>
                  <option value="05:30 PM">{isAr ? '٠٥:٣٠ م (وقت الغروب)' : '05:30 PM (Sunset)'}</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {isAr ? 'عدد المسافرين' : 'Guests'}
                </label>
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900">{travelersCount}</span>
                  <button
                    type="button"
                    onClick={() => setTravelersCount(travelersCount + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total & Confirm Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[12px] text-slate-500 block">{isAr ? 'المجموع الكلي (جنيه)' : 'Total Amount (EGP)'}</span>
                <span className="text-xl font-black text-slate-950 font-['Outfit',sans-serif]">
                  {totalPrice.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                className="py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وإصدار القسيمة' : 'Confirm & Issue Voucher'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

