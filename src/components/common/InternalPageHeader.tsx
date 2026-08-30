import React from 'react';
import { AppRoute } from '../../types';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  /** A real route, not any string — navigateTo only accepts AppRoute. */
  to?: AppRoute;
}

export interface InternalPageHeaderProps {
  variant?: 'editorial' | 'trip' | 'utility' | 'operations';
  title: string;
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  badges?: Array<{
    text: string;
    variant?: 'gold' | 'teal' | 'sand' | 'emerald' | 'amber' | 'rose';
    icon?: React.ReactNode;
  }>;
  actions?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const InternalPageHeader: React.FC<InternalPageHeaderProps> = ({
  variant = 'editorial',
  title,
  eyebrow,
  eyebrowIcon,
  subtitle,
  breadcrumbs = [],
  badges = [],
  actions,
  onBack,
  showBack = false,
  className = '',
  children,
}) => {
  const { navigateTo } = useTrip();
  const { isRTL } = useLanguage();
  const isRtl = isRTL;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  // 1. EDITORIAL VARIANT (Discovery, Stories, Explore, Stays)
  if (variant === 'editorial') {
    return (
      <header
        className={`relative bg-gradient-to-b from-[#062C35] via-[#083E4B] to-[#062C35] text-[#F7F3EA] pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#20A89A]/20 overflow-hidden ${className}`}
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E7A83B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#20A89A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#E7D3AE]/80 font-medium">
              {showBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-[#E7A83B] hover:text-[#F4C36C] me-2 py-1 px-2 rounded-lg bg-white/5 border border-white/10 transition-colors"
                >
                  {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  <span>Back</span>
                </button>
              )}
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className={`w-3 h-3 text-white/30 ${isRtl ? 'rotate-180' : ''}`} />}
                  {crumb.to ? (
                    <button
                      type="button"
                      onClick={() => { if (crumb.to) navigateTo(crumb.to); }}
                      className="hover:text-[#F7F3EA] hover:underline transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[#F7F3EA] font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#04171D]/60 border border-[#20A89A]/30 text-[#E7A83B]"
                  >
                    {b.icon}
                    <span>{b.text}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Title Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
            <div className="space-y-2 max-w-3xl">
              {eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04171D]/60 border border-[#20A89A]/30 text-[#E7A83B] text-xs font-bold uppercase tracking-wider font-['Outfit',sans-serif]">
                  {eyebrowIcon}
                  <span>{eyebrow}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <div className="text-xs sm:text-sm text-[#E7D3AE]/90 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                  {subtitle}
                </div>
              )}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
          </div>

          {children && <div className="pt-2">{children}</div>}
        </div>
      </header>
    );
  }

  // 2. TRIP VARIANT (My Trip, Bookings, Wallet, Today, Memories)
  if (variant === 'trip') {
    return (
      <header
        className={`relative bg-[#062C35] text-[#F7F3EA] pt-8 pb-7 px-4 sm:px-6 lg:px-8 border-b border-[#20A89A]/25 overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#20A89A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Top meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#E7D3AE]/80 font-medium">
              {showBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-[#E7A83B] hover:text-[#F4C36C] me-2 py-1 px-2 rounded-lg bg-white/5 border border-white/10 transition-colors"
                >
                  {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  <span>Back</span>
                </button>
              )}
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className={`w-3 h-3 text-white/30 ${isRtl ? 'rotate-180' : ''}`} />}
                  {crumb.to ? (
                    <button
                      type="button"
                      onClick={() => { if (crumb.to) navigateTo(crumb.to); }}
                      className="hover:text-[#F7F3EA] hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[#F7F3EA] font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#04171D]/70 border border-[#20A89A]/40 text-[#52C4B7]"
                  >
                    {b.icon}
                    <span>{b.text}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Heading + Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              {eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#04171D]/60 border border-[#20A89A]/30 text-[#E7A83B] text-xs font-bold uppercase tracking-wider font-['Outfit',sans-serif]">
                  {eyebrowIcon}
                  <span>{eyebrow}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA] tracking-tight">
                {title}
              </h1>
              {subtitle && <div className="text-xs sm:text-sm text-[#E7D3AE]/80">{subtitle}</div>}
            </div>

            {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
          </div>

          {children && <div className="pt-2 border-t border-white/10">{children}</div>}
        </div>
      </header>
    );
  }

  // 3. UTILITY VARIANT (Forms, Checkout, Recovery, Briefing)
  if (variant === 'utility') {
    return (
      <header className={`bg-[#0E2520] border-b border-white/10 pt-6 pb-6 px-4 sm:px-6 lg:px-8 text-[#F7F3EA] ${className}`}>
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#D2E3DE]/70">
              {showBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-[#52C4B7] hover:text-[#F4C36C] me-2 py-1 px-2.5 rounded-lg bg-[#13312B] border border-white/10 font-bold transition-colors"
                >
                  {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  <span>Back</span>
                </button>
              )}
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className={`w-3 h-3 text-white/30 ${isRtl ? 'rotate-180' : ''}`} />}
                  {crumb.to ? (
                    <button
                      type="button"
                      onClick={() => { if (crumb.to) navigateTo(crumb.to); }}
                      className="hover:text-[#F7F3EA] hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[#F7F3EA] font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#13312B] text-[#52C4B7] border border-white/10"
                  >
                    {b.icon}
                    <span>{b.text}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              {eyebrow && (
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#52C4B7] font-['Outfit',sans-serif] block">
                  {eyebrow}
                </span>
              )}
              <h1 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
                {title}
              </h1>
              {subtitle && <div className="text-xs text-[#D2E3DE]/80">{subtitle}</div>}
            </div>

            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>

          {children}
        </div>
      </header>
    );
  }

  // 4. OPERATIONS VARIANT (Operations Console, Supplier Portal)
  return (
    <header className={`bg-[#04171D] text-[#F7F3EA] border-b border-cyan-500/20 py-4 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {eyebrow && (
                <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-[#E7A83B]">
                  {eyebrow}
                </span>
              )}
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300"
                >
                  {b.icon}
                  <span>{b.text}</span>
                </span>
              ))}
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-[#F7F3EA]">
              {title}
            </h1>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="max-w-7xl mx-auto pt-3 mt-2 border-t border-white/10">{children}</div>}
    </header>
  );
};
