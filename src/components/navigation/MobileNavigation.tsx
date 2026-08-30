import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  Luggage,
  CalendarCheck,
  SunMedium,
  UtensilsCrossed,
  MapPin,
  HelpCircle,
  RefreshCw,
  PlaneTakeoff,
  Award,
  User,
  X,
  Menu,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { AppRoute, JourneyStage } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface MobileNavigationProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  onSelectSpecialStage?: (stage: JourneyStage) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isDrawerOpen,
  onCloseDrawer,
  onOpenDrawer,
  onSelectSpecialStage,
}) => {
  const { currentRoute, navigateTo, profile, bookings, activeFoodOrder } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  // Escape key handler for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        onCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, onCloseDrawer]);

  const handleRouteClick = (route: AppRoute, stageOverride?: JourneyStage) => {
    if (stageOverride && onSelectSpecialStage) {
      onSelectSpecialStage(stageOverride);
    }
    navigateTo(route);
    onCloseDrawer();
  };

  const isMainTabActive = (route: AppRoute) => {
    if (route === currentRoute) return true;
    if (route === '/my-trip' && (currentRoute === '/my-trip/day' || currentRoute === '/my-trip/activity')) {
      return true;
    }
    return false;
  };

  const sections = [
    {
      title: isAr ? 'الرئيسية' : 'MAIN',
      items: [
        { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: LayoutDashboard, route: '/home' as AppRoute },
        { id: 'explore', label: isAr ? 'استكشاف' : 'Explore', icon: Compass, route: '/explore' as AppRoute },
        { id: 'mytrip', label: isAr ? 'رحلتي' : 'My Trip', icon: Luggage, route: '/my-trip' as AppRoute, badge: isAr ? 'اليوم ٢' : 'Day 2' },
        { id: 'bookings', label: isAr ? 'الحجوزات' : 'Bookings', icon: CalendarCheck, route: '/bookings' as AppRoute, badge: `${bookings.length}` },
      ],
    },
    {
      title: isAr ? 'أثناء السفر' : 'TRAVEL',
      items: [
        { id: 'companion', label: isAr ? 'المرافق اليومي' : 'Daily Companion', icon: SunMedium, route: '/my-trip' as AppRoute, stage: 'experience' as JourneyStage, badge: isAr ? 'مباشر' : 'Live' },
        { id: 'food', label: isAr ? 'طلب الطعام' : 'Food Now', icon: UtensilsCrossed, route: '/food' as AppRoute, badge: activeFoodOrder ? (isAr ? 'طلب نشط' : '1 Order') : undefined },
        { id: 'nearme', label: isAr ? 'بالقرب مني' : 'Near Me', icon: MapPin, route: '/explore' as AppRoute },
      ],
    },
    {
      title: isAr ? 'المساعدة والدعم' : 'ASSISTANCE',
      items: [
        { id: 'help', label: isAr ? 'المساعدة الفورية' : 'Help Me Now', icon: HelpCircle, route: '/help' as AppRoute, badge: '24/7' },
        { id: 'recovery', label: isAr ? 'التعديل والبدائل' : 'Change & Recovery', icon: RefreshCw, route: '/change-recovery' as AppRoute },
      ],
    },
    {
      title: isAr ? 'الرحلة' : 'TRIP',
      items: [
        { id: 'departure', label: isAr ? 'المغادرة' : 'Departure', icon: PlaneTakeoff, route: '/departure' as AppRoute },
        { id: 'posttrip', label: isAr ? 'الذكريات والتقييم' : 'Post-Trip', icon: Award, route: '/post-trip' as AppRoute },
      ],
    },
    {
      title: isAr ? 'الحساب' : 'ACCOUNT',
      items: [
        { id: 'profile', label: isAr ? 'الملف الشخصي' : 'Profile', icon: User, route: '/profile' as AppRoute },
      ],
    },
  ];

  return (
    <>
      {/* 1. COMPACT BOTTOM NAVIGATION BAR (Mobile only) */}
      <nav
        id="mobile-bottom-nav-bar"
        aria-label="Mobile Bottom Navigation"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-xl flex items-center justify-around"
      >
        <button
          type="button"
          id="mobile-nav-home"
          onClick={() => handleRouteClick('/home')}
          aria-current={isMainTabActive('/home') ? 'page' : undefined}
          aria-label={isAr ? 'الانتقال للرئيسية' : 'Go to Home'}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
            isMainTabActive('/home')
              ? 'text-teal-900 bg-teal-50 border border-teal-200'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" aria-hidden="true" />
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          type="button"
          id="mobile-nav-explore"
          onClick={() => handleRouteClick('/explore')}
          aria-current={isMainTabActive('/explore') ? 'page' : undefined}
          aria-label={isAr ? 'الانتقال للاستكشاف' : 'Go to Explore'}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
            isMainTabActive('/explore')
              ? 'text-teal-900 bg-teal-50 border border-teal-200'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" aria-hidden="true" />
          <span>{isAr ? 'استكشاف' : 'Explore'}</span>
        </button>

        <button
          type="button"
          id="mobile-nav-mytrip"
          onClick={() => handleRouteClick('/my-trip')}
          aria-current={isMainTabActive('/my-trip') ? 'page' : undefined}
          aria-label={isAr ? 'الانتقال لرحلتي' : 'Go to My Trip, Active Day 2'}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl text-[12px] font-bold transition-all cursor-pointer relative ${
            isMainTabActive('/my-trip')
              ? 'text-teal-950 bg-teal-100/80 font-black border border-teal-300'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <div className="relative">
            <Luggage className="w-4 h-4 mb-0.5" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
          </div>
          <span>{isAr ? 'رحلتي' : 'My Trip'}</span>
        </button>

        <button
          type="button"
          id="mobile-nav-bookings"
          onClick={() => handleRouteClick('/bookings')}
          aria-current={isMainTabActive('/bookings') ? 'page' : undefined}
          aria-label={isAr ? `الانتقال للحجوزات (${bookings.length} مؤكدة)` : `Go to Bookings (${bookings.length} confirmed)`}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
            isMainTabActive('/bookings')
              ? 'text-teal-900 bg-teal-50 border border-teal-200'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <CalendarCheck className="w-4 h-4 mb-0.5" aria-hidden="true" />
          <span>{isAr ? 'الحجوزات' : 'Bookings'}</span>
        </button>

        <button
          type="button"
          id="mobile-nav-more"
          onClick={onOpenDrawer}
          aria-expanded={isDrawerOpen}
          aria-label={isAr ? 'فتح القائمة الشاملة' : 'Open Full Navigation Menu'}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
            isDrawerOpen ? 'text-teal-950 bg-slate-100' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <Menu className="w-4 h-4 mb-0.5" aria-hidden="true" />
          <span>{isAr ? 'القائمة' : 'Menu'}</span>
        </button>
      </nav>

      {/* 2. SLIDE-OUT NAVIGATION DRAWER (Mobile) */}
      {isDrawerOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'قائمة التنقل' : 'Mobile Navigation Menu'}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="md:hidden fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseDrawer}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#091B1F]/98 backdrop-blur-2xl text-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs"
                  aria-hidden="true"
                >
                  D
                </div>
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-amber-300 block font-['Outfit',sans-serif]">
                    {isAr ? 'دهـب' : 'DAHAB'}
                  </span>
                  <span className="text-[11px] text-slate-300 block -mt-0.5 font-medium">
                    {isAr ? 'قائمة التنقل الذكية' : 'Navigation Menu'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseDrawer}
                aria-label={isAr ? 'إغلاق القائمة' : 'Close navigation menu'}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Profile Bar */}
            <button
              type="button"
              onClick={() => handleRouteClick('/profile')}
              aria-label={`View traveler profile for ${profile.name}`}
              className="p-3 mx-3 my-2 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between cursor-pointer text-left hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center"
                  aria-hidden="true"
                >
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{profile.name}</span>
                  <span className="text-[11px] text-emerald-400 block font-semibold">{isAr ? 'رحلة نشطة · اليوم ٢' : 'Active Trip · Day 2'}</span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {/* Navigation Sections */}
            <nav 
              aria-label="Drawer Sections"
              className="flex-1 overflow-y-auto p-3 space-y-4"
            >
              {sections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-['Outfit',sans-serif]">
                    {section.title}
                  </h2>

                  <div className="space-y-0.5" role="list">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = currentRoute === item.route;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleRouteClick(item.route, 'stage' in item ? item.stage : undefined)}
                          aria-current={active ? 'page' : undefined}
                          aria-label={`${item.label}${item.badge ? `, ${item.badge}` : ''}`}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            active
                              ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                              : 'text-slate-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-slate-300" aria-hidden="true" />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Urgent Support Footer */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => handleRouteClick('/help')}
                aria-label={isAr ? 'فتح أرقام الطوارئ والدعم الفوري' : 'Open 24/7 Urgent Help and Emergency Contacts'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-300 transition-colors cursor-pointer border border-amber-300"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" aria-hidden="true" />
                <span>{isAr ? 'دعم وأرقام طوارئ ٢٤/٧' : '24/7 Urgent Help & Numbers'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

