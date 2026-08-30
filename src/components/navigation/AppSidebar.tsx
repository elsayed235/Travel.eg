import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Waves
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { AppRoute, JourneyStage } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  route: AppRoute;
  stageOverride?: JourneyStage;
  badge?: string;
  badgeType?: 'active' | 'counter' | 'alert' | 'neutral';
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectSpecialStage?: (stage: JourneyStage) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onSelectSpecialStage,
}) => {
  const { currentRoute, navigateTo, bookings, activeFoodOrder } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const sections: SidebarSection[] = [
    {
      title: isAr ? 'الرئيسية' : 'MAIN',
      items: [
        {
          id: 'home',
          label: isAr ? 'الرئيسية' : 'Home',
          icon: LayoutDashboard,
          route: '/home',
        },
        {
          id: 'explore',
          label: isAr ? 'استكشاف دهب' : 'Explore',
          icon: Compass,
          route: '/explore',
        },
        {
          id: 'mytrip',
          label: isAr ? 'برنامج الرحلة' : 'My Trip',
          icon: Luggage,
          route: '/my-trip',
          badge: isAr ? 'اليوم ٢' : 'Day 2',
          badgeType: 'active',
        },
        {
          id: 'bookings',
          label: isAr ? 'الحجوزات' : 'Bookings',
          icon: CalendarCheck,
          route: '/bookings',
          badge: `${bookings.length}`,
          badgeType: 'counter',
        },
      ],
    },
    {
      title: isAr ? 'أثناء السفر' : 'TRAVEL',
      items: [
        {
          id: 'companion',
          label: isAr ? 'المرافق اليومي' : 'Daily Companion',
          icon: SunMedium,
          route: '/my-trip',
          stageOverride: 'experience',
          badge: isAr ? 'مباشر' : 'Live',
          badgeType: 'active',
        },
        {
          id: 'food',
          label: isAr ? 'طلب الطعام' : 'Food Now',
          icon: UtensilsCrossed,
          route: '/food',
          badge: activeFoodOrder ? (isAr ? 'طلب نشط' : '1 Order') : undefined,
          badgeType: 'neutral',
        },
        {
          id: 'nearme',
          label: isAr ? 'بالقرب مني' : 'Near Me',
          icon: MapPin,
          route: '/explore',
          badge: isAr ? 'اللايتهاوس' : 'Lighthouse',
          badgeType: 'neutral',
        },
      ],
    },
    {
      title: isAr ? 'المساعدة والدعم' : 'ASSISTANCE',
      items: [
        {
          id: 'help',
          label: isAr ? 'المساعدة الفورية' : 'Help Me Now',
          icon: HelpCircle,
          route: '/help',
          badge: '24/7',
          badgeType: 'alert',
        },
        {
          id: 'recovery',
          label: isAr ? 'التعديل والمرونة' : 'Change & Recovery',
          icon: RefreshCw,
          route: '/change-recovery',
        },
      ],
    },
    {
      title: isAr ? 'الرحلة' : 'TRIP',
      items: [
        {
          id: 'departure',
          label: isAr ? 'المغادرة' : 'Departure',
          icon: PlaneTakeoff,
          route: '/departure',
          badge: isAr ? '١٦ أكتوبر' : 'Oct 16',
          badgeType: 'neutral',
        },
        {
          id: 'posttrip',
          label: isAr ? 'الذكريات والتقييم' : 'Post-Trip',
          icon: Award,
          route: '/post-trip',
        },
      ],
    },
    {
      title: isAr ? 'الحساب' : 'ACCOUNT',
      items: [
        {
          id: 'profile',
          label: isAr ? 'الملف الشخصي' : 'Profile',
          icon: User,
          route: '/profile',
        },
      ],
    },
  ];

  const handleItemClick = (item: SidebarItem) => {
    if (item.stageOverride && onSelectSpecialStage) {
      onSelectSpecialStage(item.stageOverride);
    }
    navigateTo(item.route);
  };

  const isItemActive = (item: SidebarItem) => {
    if (item.route === currentRoute) {
      return true;
    }
    if (item.route === '/my-trip' && (currentRoute === '/my-trip/day' || currentRoute === '/my-trip/activity')) {
      return true;
    }
    return false;
  };

  return (
    <aside
      id="app-smart-sidebar"
      aria-label="Main Navigation Sidebar"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`hidden md:flex flex-col flex-shrink-0 bg-[#091B1F]/95 backdrop-blur-2xl text-white ${isRTL ? 'border-l' : 'border-r'} border-white/12 transition-all duration-300 ease-in-out relative z-30 select-none shadow-xl ${
        isCollapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      {/* 1. Header / Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigateTo('/home')}
          aria-label={isAr ? 'الانتقال للرئيسية' : 'Go to Home Dashboard'}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1"
        >
          <div 
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
            aria-hidden="true"
          >
            D
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200 text-left">
              <span className="text-xs font-black tracking-widest uppercase text-amber-300 font-['Outfit',sans-serif]">
                {isAr ? 'دهـب' : 'DAHAB'}
              </span>
              <span className="text-[12px] font-medium text-slate-300 truncate -mt-0.5">
                {isAr ? 'المرافق الرقمي الذكي' : 'Travel Companion'}
              </span>
            </div>
          )}
        </button>

        {/* Toggle Collapse Button */}
        <button
          type="button"
          id="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
          ) : (
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* 2. Navigation List */}
      <nav 
        aria-label="Main Menu"
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 no-scrollbar"
      >
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {/* Section Header Label */}
            {!isCollapsed ? (
              <h2 className="px-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 font-['Outfit',sans-serif]">
                {section.title}
              </h2>
            ) : (
              <div className="h-px bg-white/10 mx-2 my-2" aria-hidden="true" />
            )}

            {/* Section Items */}
            <div className="space-y-1" role="list">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <div
                    key={item.id}
                    className="relative"
                    role="listitem"
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                  >
                    <button
                      type="button"
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      aria-current={active ? 'page' : undefined}
                      aria-label={`${item.label}${item.badge ? `, ${item.badge}` : ''}`}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer relative group ${
                        active
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                          : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {/* Active Indicator */}
                      {active && (
                        <span className={`absolute ${isRTL ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'} top-1/2 -translate-y-1/2 w-1.5 h-5 bg-amber-400 shadow-sm`} aria-hidden="true" />
                      )}

                      {/* Icon */}
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          active
                            ? 'text-amber-300'
                            : 'text-slate-300 group-hover:text-white'
                        }`}
                        aria-hidden="true"
                      />

                      {/* Label & Badges (Expanded Mode) */}
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>

                          {item.badge && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                                item.badgeType === 'active'
                                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                                  : item.badgeType === 'alert'
                                  ? 'bg-rose-500/25 text-rose-200 border border-rose-400/40'
                                  : item.badgeType === 'counter'
                                  ? 'bg-amber-400/25 text-amber-200 font-black border border-amber-400/40'
                                  : 'bg-white/15 text-slate-100 border border-white/20'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Tooltip in Collapsed Mode */}
                    {isCollapsed && hoveredItemId === item.id && (
                      <div 
                        role="tooltip"
                        className={`absolute ${isRTL ? 'right-full mr-2.5' : 'left-full ml-2.5'} top-1/2 -translate-y-1/2 z-50 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xl whitespace-nowrap border border-white/20 flex items-center gap-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150`}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[11px] font-black px-1.5 py-0.5 rounded-full bg-amber-400/30 text-amber-300 border border-amber-400/40">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Smart Context Trip Status Footer Card (when expanded) */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('/my-trip')}
            aria-label="View Active Journey Day 2 of 5: Ahmed's Dahab Escape. Next: Canyon Dive at 09:00 AM"
            className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-['Outfit',sans-serif]">
                  {isAr ? 'الرحلة النشطة' : 'Active Journey'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-300">{isAr ? 'اليوم ٢ من ٥' : 'Day 2 of 5'}</span>
            </div>

            <div className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors truncate">
              {isAr ? 'رحلة دهب الساحرة' : "Ahmed's Dahab Escape"}
            </div>
            
            <div className="flex items-center gap-1.5 text-[12px] text-slate-300 mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{isAr ? 'التالي: غوص الكانيون · ٠٩:٠٠ ص' : 'Next: Canyon Dive · 09:00 AM'}</span>
            </div>

            {/* Subtle Progress Bar */}
            <div 
              role="progressbar"
              aria-valuenow={40}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Trip progress: Day 2 of 5 (40%)"
              className="w-full bg-white/20 h-1.5 rounded-full mt-2.5 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[40%] rounded-full" />
            </div>
          </button>
        </div>
      )}
    </aside>
  );
};

