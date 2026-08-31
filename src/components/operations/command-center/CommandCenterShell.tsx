import React, { useState, useEffect, useCallback, Suspense } from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  DollarSign,
  Users,
  Globe,
  Brain,
  HelpCircle,
  FileText,
  Flag,
  HeartPulse,
  Search,
  Radio,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Plane,
  ShieldCheck,
  Clock,
  Package,
  MessageSquare,
  TrendingUp,
  Database,
  Bell,
  Car,
  Lightbulb,
} from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { api } from '../../../services/api';

// ─── Section definitions ────────────────────────────────────────────────────
export type SectionId =
  | 'overview'
  | 'trips'
  | 'transfers'
  | 'exceptions'
  | 'commerce'
  | 'suppliers'
  | 'intelligence'
  | 'opportunities'
  | 'knowledge'
  | 'support'
  | 'sms'
  | 'notifications'
  | 'audit'
  | 'flags'
  | 'jobs'
  | 'health';

interface NavSection {
  id: SectionId;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  badge?: number;
  group: 'core' | 'domain' | 'system';
}

const NAV_SECTIONS: NavSection[] = [
  { id: 'overview', label: 'Overview', labelAr: 'نظرة عامة', icon: LayoutDashboard, group: 'core' },
  { id: 'trips', label: 'Live Trips', labelAr: 'الرحلات الحية', icon: Plane, group: 'core' },
  { id: 'transfers', label: 'Transfers', labelAr: 'النقل', icon: Car, group: 'core' },
  { id: 'exceptions', label: 'Exceptions', labelAr: 'الاستثناءات', icon: AlertTriangle, group: 'core' },
  { id: 'commerce', label: 'Commerce', labelAr: 'التجارة', icon: DollarSign, group: 'domain' },
  { id: 'suppliers', label: 'Suppliers', labelAr: 'الموردين', icon: Users, group: 'domain' },
  { id: 'intelligence', label: 'Intelligence', labelAr: 'الاستخبارات', icon: Globe, group: 'domain' },
  { id: 'opportunities', label: 'Opportunities', labelAr: 'الفرص', icon: Lightbulb, group: 'domain' },
  { id: 'knowledge', label: 'Knowledge', labelAr: 'المعرفة', icon: Brain, group: 'domain' },
  { id: 'support', label: 'Support', labelAr: 'الدعم', icon: MessageSquare, group: 'domain' },
  { id: 'sms', label: 'SMS Center', labelAr: 'الرسائل', icon: MessageSquare, group: 'domain' },
  { id: 'notifications', label: 'Notifications', labelAr: 'الإشعارات', icon: Bell, group: 'domain' },
  { id: 'audit', label: 'Audit Log', labelAr: 'سجل التدقيق', icon: FileText, group: 'system' },
  { id: 'flags', label: 'Feature Flags', labelAr: 'أعلام الميزات', icon: Flag, group: 'system' },
  { id: 'jobs', label: 'Market Jobs', labelAr: 'الوظائف', icon: Zap, group: 'system' },
  { id: 'health', label: 'System Health', labelAr: 'صحة النظام', icon: HeartPulse, group: 'system' },
];

// ─── Lazy section views ─────────────────────────────────────────────────────
const Overview = React.lazy(() => import('./Overview'));
const LiveTripRadar = React.lazy(() => import('./LiveTripRadar'));
const TransfersSection = React.lazy(() => import('./TransfersSection'));
const ExceptionsCenter = React.lazy(() => import('./ExceptionsCenter'));
const CommerceControl = React.lazy(() => import('./CommerceControl'));
const SupplierCommand = React.lazy(() => import('./SupplierCommand'));
const IntelligenceCommand = React.lazy(() => import('./IntelligenceCommand'));
const OpportunitiesSection = React.lazy(() => import('./OpportunitiesSection'));
const KnowledgeOps = React.lazy(() => import('./KnowledgeOps'));
const SupportCenter = React.lazy(() => import('./SupportCenter'));
const SmsCenter = React.lazy(() => import('./SmsCenter'));
const NotificationsCenter = React.lazy(() => import('./NotificationsCenter'));
const AuditCenter = React.lazy(() => import('./AuditCenter'));
const FeatureFlagsView = React.lazy(() => import('./FeatureFlagsView'));
const MarketJobsSection = React.lazy(() => import('./MarketJobsSection'));
const SystemHealth = React.lazy(() => import('./SystemHealth'));
const CommandPalette = React.lazy(() => import('./CommandPalette'));

// ─── Section Badge Polling ──────────────────────────────────────────────────
function useSectionBadges() {
  const [badges, setBadges] = useState<Partial<Record<SectionId, number>>>({});

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const [support, opsOverview, marketAlerts] = await Promise.allSettled([
          api.getSupportMessages(),
          api.getOperationsOverview(),
          api.getMarketAlerts(),
        ]);

        if (cancelled) return;
        const next: Partial<Record<SectionId, number>> = {};

        if (support.status === 'fulfilled' && support.value.openCount > 0) {
          next.support = support.value.openCount;
        }
        if (opsOverview.status === 'fulfilled') {
          const ov = opsOverview.value as any;
          const pending = ov?.pendingSupplierConfirmations || ov?.pendingBookings || 0;
          if (pending > 0) next.trips = pending;
        }
        if (marketAlerts.status === 'fulfilled') {
          const alerts = (marketAlerts.value as any)?.alerts || [];
          const unack = alerts.filter((a: any) => !a.acknowledged).length;
          if (unack > 0) next.exceptions = unack;
        }

        setBadges(next);
      } catch {
        // Non-critical — badges just stay at 0
      }
    };

    poll();
    const interval = setInterval(poll, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return badges;
}

// ─── Section Content Router ─────────────────────────────────────────────────
function SectionContent({ section, onNavigate }: { section: SectionId; onNavigate: (s: SectionId) => void }) {
  switch (section) {
    case 'overview':
      return <Overview onNavigate={onNavigate} />;
    case 'trips':
      return <LiveTripRadar />;
    case 'transfers':
      return <TransfersSection />;
    case 'exceptions':
      return <ExceptionsCenter />;
    case 'commerce':
      return <CommerceControl />;
    case 'suppliers':
      return <SupplierCommand />;
    case 'intelligence':
      return <IntelligenceCommand />;
    case 'opportunities':
      return <OpportunitiesSection />;
    case 'knowledge':
      return <KnowledgeOps />;
    case 'support':
      return <SupportCenter />;
    case 'sms':
      return <SmsCenter />;
    case 'notifications':
      return <NotificationsCenter />;
    case 'audit':
      return <AuditCenter />;
    case 'flags':
      return <FeatureFlagsView />;
    case 'jobs':
      return <MarketJobsSection />;
    case 'health':
      return <SystemHealth />;
    default:
      return <Overview onNavigate={onNavigate} />;
  }
}

// ─── Loading fallback for sections ──────────────────────────────────────────
function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-sm text-white/50">
        <span className="w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin" />
        <span>Loading…</span>
      </div>
    </div>
  );
}

// ─── Main Shell ─────────────────────────────────────────────────────────────
export const CommandCenterShell: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 1280);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const badges = useSectionBadges();

  // Auto-collapse sidebar when viewport shrinks below 1280px
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1280px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setSidebarCollapsed(true);
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Cmd+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
      // Escape closes palette
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [paletteOpen]);

  const handleNavigate = useCallback((section: SectionId) => {
    setActiveSection(section);
  }, []);

  const groupedSections = {
    core: NAV_SECTIONS.filter(s => s.group === 'core'),
    domain: NAV_SECTIONS.filter(s => s.group === 'domain'),
    system: NAV_SECTIONS.filter(s => s.group === 'system'),
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[#04171D] text-[#F7F3EA] font-['Plus_Jakarta_Sans',sans-serif] flex">
      {/* ─── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`flex-shrink-0 border-r border-white/8 bg-[#062C35]/80 flex flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo area */}
        <div className="px-3 py-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#20A89A]/20 border border-[#20A89A]/40 flex items-center justify-center text-[#52C4B7] flex-shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F7F3EA] truncate font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'مركز القيادة' : 'Command Center'}
                </div>
                <div className="text-[10px] text-white/40 truncate">Dahab Operations</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-1">
          {(['core', 'domain', 'system'] as const).map(group => (
            <div key={group}>
              {!sidebarCollapsed && (
                <div className="px-2 pt-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-white/30">
                  {group === 'core' ? 'Live Ops' : group === 'domain' ? 'Domains' : 'System'}
                </div>
              )}
              {groupedSections[group].map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const badgeCount = badges[section.id];
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleNavigate(section.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#20A89A]/20 text-[#52C4B7] border border-[#20A89A]/30'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent'
                    }`}
                    title={sidebarCollapsed ? (language === 'ar' ? section.labelAr : section.label) : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{language === 'ar' ? section.labelAr : section.label}</span>
                        {badgeCount && badgeCount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold min-w-[18px] text-center">
                            {badgeCount}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-2 border-t border-white/8">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="flex-shrink-0 h-12 border-b border-white/8 bg-[#062C35]/40 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
              {NAV_SECTIONS.find(s => s.id === activeSection)
                ? (language === 'ar' ? NAV_SECTIONS.find(s => s.id === activeSection)!.labelAr : NAV_SECTIONS.find(s => s.id === activeSection)!.label)
                : 'Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 text-xs transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-white/10 text-white/40 font-mono">⌘K</kbd>
            </button>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<SectionLoading />}>
              <SectionContent section={activeSection} onNavigate={handleNavigate} />
            </Suspense>
          </div>
        </main>
      </div>

      {/* ─── Command Palette ──────────────────────────────────────────── */}
      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}
    </div>
  );
};
