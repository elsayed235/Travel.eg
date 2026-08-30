import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Sun,
  Waves,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Clock,
  CheckCircle2,
  X,
  Compass,
  User,
  Globe
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { AppRoute } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AppTopBarProps {
  onToggleSidebar?: () => void;
  onOpenMobileMenu?: () => void;
  onOpenHelp?: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onToggleSidebar,
  onOpenMobileMenu,
  onOpenHelp,
}) => {
  const { currentRoute, navigateTo, profile } = useTrip();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showNotifications) {
        setShowNotifications(false);
        notifButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNotifications]);

  // Derive contextual title with high contrast & bilingual support
  const getContextualTitle = (route: AppRoute) => {
    switch (route) {
      case '/home':
        return {
          title: isAr ? 'لوحة تحكم دهب' : 'Dahab Dashboard',
          subtitle: isAr ? 'اليوم ٢ من ٥ · ساحل البحر الأحمر وسيناء' : 'Day 2 of 5 · Red Sea & Sinai Coast',
        };
      case '/explore':
        return {
          title: isAr ? 'استكشف واكتشف دهب' : 'Explore & Discover',
          subtitle: isAr ? 'أماكن الغوص، الوديان والكنوز الساحلية' : 'Places, Dive Sites & Coastal Gems',
        };
      case '/my-trip':
      case '/my-trip/day':
      case '/my-trip/activity':
        return {
          title: isAr ? 'برنامج رحلتي' : 'My Trip Itinerary',
          subtitle: isAr ? '١٢ – ١٦ أكتوبر · تجربة ٥ أيام في دهب' : 'Oct 12 – 16 · 5-Day Dahab Experience',
        };
      case '/bookings':
        return {
          title: isAr ? 'الحجوزات المؤكدة' : 'Confirmed Reservations',
          subtitle: isAr ? '٤ حجوزات نشطة · كود: DHB-2026-OCT-894' : '4 Active Bookings · Ref: DHB-2026-OCT-894',
        };
      case '/food':
        return {
          title: isAr ? 'طلب الطعام وتوصيل الشاطئ' : 'Food Now & Beach Delivery',
          subtitle: isAr ? 'مطاعم محلية وطلبات مباشرة لمكانك' : 'Contextual Dining & Real-time Orders',
        };
      case '/change-recovery':
        return {
          title: isAr ? 'التعديل والمرونة الذكية' : 'Change & Recovery',
          subtitle: isAr ? 'خطط بديلة وتكيف مع تقلبات الطقس' : 'Adaptive Plans & Weather Shifts',
        };
      case '/help':
        return {
          title: isAr ? 'المساعدة والدعم المباشر' : 'Help Me Now',
          subtitle: isAr ? 'دعم محلي على مدار الساعة ومساعدة طارئة' : '24/7 Local Support & Urgent Assistance',
        };
      case '/departure':
        return {
          title: isAr ? 'إجراءات المغادرة' : 'Departure Mode',
          subtitle: isAr ? 'تسجيل الخروج، التنقلات وتوقيت المطار' : 'Checkout, Transfers & Airport Buffer',
        };
      case '/post-trip':
        return {
          title: isAr ? 'ذكريات ما بعد الرحلة' : 'Post-Trip & Memories',
          subtitle: isAr ? 'ملخص الرحلة، الذكريات والفواتير' : 'Trip Summary, Highlights & Receipts',
        };
      case '/profile':
        return {
          title: isAr ? 'الملف الشخصي للمسافر' : 'Traveler Profile',
          subtitle: isAr ? 'التفضيلات، الوثائق والإعدادات' : 'Preferences, Documents & Settings',
        };
      case '/trip-builder':
      case '/trip-preview':
        return {
          title: isAr ? 'مخطط الرحلة الذكي' : 'Trip Planner',
          subtitle: isAr ? 'صمم برنامج رحلتك المثالي في دهب' : 'Tailor Your Perfect Dahab Itinerary',
        };
      default:
        return {
          title: isAr ? 'منصة دهب الرقمية' : 'Dahab Digital Travel',
          subtitle: isAr ? 'جنوب سيناء، مصر' : 'South Sinai, Egypt',
        };
    }
  };

  const context = getContextualTitle(currentRoute);

  const notifications = [
    {
      id: 'notif-1',
      title: isAr ? 'تم تأكيد مرشد الغوص' : 'Dive Guide Confirmed',
      desc: isAr ? 'الكابتن يوسف جهز أسطوانات الغوص لموقع الكانيون الساعة ٠٩:٠٠ صباحاً.' : 'Captain Youssef has prepped your 2-tank gear for 09:00 AM at The Canyon.',
      time: isAr ? 'منذ ١٥ دقيقة' : '15 mins ago',
      type: 'dive',
    },
    {
      id: 'notif-2',
      title: isAr ? 'طلب الغداء في الطريق إليك' : 'Lunch Delivery En Route',
      desc: isAr ? 'مندوب مطعم الفنار في طريقه إلى برجولة اللايتهاوس رقم ٤.' : 'Al Fanar rider is cycling to Lighthouse Palapa #4. ETA ~15 mins.',
      time: isAr ? 'منذ ٣٥ دقيقة' : '35 mins ago',
      type: 'food',
    },
    {
      id: 'notif-3',
      title: isAr ? 'أجواء بحرية ممتازة للغوص' : 'Optimal Reef Conditions',
      desc: isAr ? 'وضوح الرؤية في اللايتهاوس والكانيون يتجاوز ٢٥ متراً مع أمواج هادئة.' : 'Lighthouse & Canyon visibility exceeds 25m with calm sea swells.',
      time: isAr ? 'منذ ساعة' : '1 hour ago',
      type: 'weather',
    },
  ];

  return (
    <header
      id="app-main-topbar"
      role="banner"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 transition-all shadow-xs"
    >
      {/* 1. Left: Mobile Menu Toggle & Contextual Title */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Mobile Hamburger */}
        <button
          type="button"
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          aria-label={isAr ? 'فتح قائمة التنقل' : 'Open Navigation Menu Drawer'}
          className="md:hidden p-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Brand mark on mobile */}
        <button 
          type="button"
          onClick={() => navigateTo('/home')}
          aria-label={isAr ? 'الانتقال إلى الرئيسية' : 'Go to Home Dashboard'}
          className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs cursor-pointer"
        >
          D
        </button>

        {/* Title & Subtitle */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate font-['Plus_Jakarta_Sans',sans-serif]">
              {context.title}
            </h1>
            <span className="hidden lg:inline-flex items-center gap-1 text-[12px] font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
              {isAr ? 'اليوم ٢ من ٥' : 'Day 2 of 5'}
            </span>
          </div>
          <p className="text-[12px] text-slate-600 truncate hidden sm:block font-medium">
            {context.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Right: Language, Weather Pill, Assistance, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Language Switcher */}
        <button
          type="button"
          id="topbar-lang-toggle"
          onClick={toggleLanguage}
          aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-[#F6F0E6] hover:bg-[#EADDC9] px-2.5 py-1.5 rounded-full border border-amber-900/15 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-700" />
          <span className="text-[12px] uppercase">{language === 'en' ? 'عربي' : 'EN'}</span>
        </button>

        {/* Real-time Weather & Sea Pill with full accessibility label */}
        <div 
          aria-label="Weather: 28°C sunny, Water temperature 24°C, Calm conditions"
          className="hidden xl:flex items-center gap-2 bg-[#F6F0E6]/90 border border-amber-900/15 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-2xs backdrop-blur-md"
        >
          <Sun className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>28°C</span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <Waves className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span className="text-slate-800">{isAr ? 'البحر ٢٤°م · هادئ' : 'Water 24°C · Calm'}</span>
        </div>

        {/* Assistance Quick Button */}
        <button
          type="button"
          id="topbar-quick-help-btn"
          onClick={() => (onOpenHelp ? onOpenHelp() : navigateTo('/help'))}
          aria-label={isAr ? 'فتح المساعدة المحلية المباشرة' : 'Open 24/7 Help Desk & Emergency Support'}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 transition-all cursor-pointer border border-teal-300 shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{isAr ? 'دعم ٢٤/٧' : 'Help 24/7'}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={notifButtonRef}
            type="button"
            id="topbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-expanded={showNotifications}
            aria-haspopup="dialog"
            aria-label={isAr ? `تحديثات وإشعارات الرحلة (${notifications.length} جديدة)` : `Trip updates and notifications (${notifications.length} new)`}
            className="p-2 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer relative"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" aria-hidden="true" />
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div
              id="topbar-notifications-dropdown"
              role="dialog"
              aria-modal="true"
              aria-label={isAr ? 'تنبيهات وإشعارات الرحلة' : 'Trip Updates Notifications'}
              className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-92 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit',sans-serif]">
                    {isAr ? 'تحديثات الرحلة' : 'Trip Updates'}
                  </h2>
                  <span className="text-[11px] font-black bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                    {isAr ? '٣ جديدة' : '3 New'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label={isAr ? 'إغلاق الإشعارات' : 'Close notifications panel'}
                  className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="py-2 divide-y divide-slate-100 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="pt-2 first:pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                      <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-700 mt-0.5 leading-relaxed font-medium">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigateTo('/my-trip');
                  }}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 underline underline-offset-2 cursor-pointer"
                >
                  {isAr ? 'عرض جدول اليوم ٢ بالكامل ←' : 'View Full Day 2 Timeline →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Traveler Profile / Avatar Pill */}
        <button
          type="button"
          id="topbar-profile-btn"
          onClick={() => navigateTo('/profile')}
          aria-label={`Open traveler profile for ${profile.name}`}
          className="flex items-center gap-2 bg-[#F6F0E6]/90 hover:bg-[#EADDC9] border border-amber-900/15 pl-1.5 pr-3 py-1 rounded-full transition-all cursor-pointer shadow-2xs group backdrop-blur-md"
        >
          <div 
            className="w-7 h-7 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-xs"
            aria-hidden="true"
          >
            {profile.name.charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900 transition-colors leading-none">
              {profile.name}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 leading-tight">
              {isAr ? 'مسافر' : 'Traveler'}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

