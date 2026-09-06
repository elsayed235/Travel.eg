import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plane,
  DollarSign,
  MessageSquare,
  Users,
  TrendingUp,
  Zap,
  RefreshCw,
  ArrowRight,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Globe,
  ChevronRight,
  Package,
  Bell,
  Car,
  ExternalLink,
  HeartPulse,
} from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { SectionId } from './CommandCenterShell';

// ─── Types ──────────────────────────────────────────────────────────────────
interface OperationalSummary {
  activeTrips: number;
  pendingBookings: number;
  pendingSupplierConfirmations: number;
  paymentIssues: number;
  exceptions: number;
  atRiskTrips: number;
  unreadSupport: number;
  supplierIssues: number;
  activeTransfers: number;
  unreadNotifications: number;
}

interface ActionItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  entity?: string;
  entityType?: 'trip' | 'booking' | 'supplier' | 'payment' | 'support' | 'market';
  entityId?: string;
  createdAt: string;
  ageMinutes: number;
  reason: string; // WHY this priority
}

interface RecentEvent {
  id: string;
  type: string;
  title: string;
  entity?: string;
  timestamp: string;
  actor?: string;
}

interface HealthStatus {
  api: 'healthy' | 'degraded' | 'down' | 'unknown';
  db: 'healthy' | 'degraded' | 'down' | 'unknown';
  payments: 'healthy' | 'degraded' | 'down' | 'unknown';
  intelligence: 'healthy' | 'degraded' | 'down' | 'unknown';
}

// ─── Data Fetching ──────────────────────────────────────────────────────────

function useOperationalSummary() {
  const [summary, setSummary] = useState<OperationalSummary>({
    activeTrips: 0, pendingBookings: 0, pendingSupplierConfirmations: 0,
    paymentIssues: 0, exceptions: 0, atRiskTrips: 0,
    unreadSupport: 0, supplierIssues: 0,
    activeTransfers: 0, unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const [opsOverview, supportData, marketAlerts, transfersData, notificationsData] = await Promise.allSettled([
        api.getOperationsOverview(),
        api.getSupportMessages(),
        api.getMarketAlerts(),
        api.getOperationsTransfers(),
        api.getOperationsNotifications(),
      ]);

      const next: OperationalSummary = {
        activeTrips: 0, pendingBookings: 0, pendingSupplierConfirmations: 0,
        paymentIssues: 0, exceptions: 0, atRiskTrips: 0,
        unreadSupport: 0, supplierIssues: 0,
        activeTransfers: 0, unreadNotifications: 0,
      };

      if (transfersData.status === 'fulfilled') {
        const transfers = (transfersData.value as any)?.transfers || [];
        next.activeTransfers = transfers.filter((t: any) => t.supplierState !== 'COMPLETED').length;
      }
      if (notificationsData.status === 'fulfilled') {
        next.unreadNotifications = (notificationsData.value as any)?.summary?.unread || 0;
      }

      if (opsOverview.status === 'fulfilled') {
        const ov = opsOverview.value as any;
        const s = ov?.summary;
        next.activeTrips = s?.activeTrips ?? ov?.activeTrips ?? ov?.trips?.active ?? 0;
        next.pendingBookings = s?.pendingBookings ?? ov?.pendingBookings ?? ov?.bookings?.pending ?? 0;
        next.pendingSupplierConfirmations = s?.pendingSupplierConfirmations ?? ov?.pendingSupplierConfirmations ?? 0;
        next.paymentIssues = s?.paymentIssues ?? ov?.paymentIssues ?? ov?.payments?.failed ?? 0;
        next.atRiskTrips = s?.atRiskTrips ?? ov?.atRiskTrips ?? 0;
      }

      if (supportData.status === 'fulfilled') {
        next.unreadSupport = supportData.value.openCount ?? 0;
      }

      if (marketAlerts.status === 'fulfilled') {
        const alerts = (marketAlerts.value as any)?.alerts || [];
        next.exceptions = alerts.filter((a: any) => !a.acknowledged).length;
        next.supplierIssues = alerts.filter((a: any) =>
          a.alertType?.includes('SOURCE') || a.alertType?.includes('SUPPLIER')
        ).length;
      }

      setSummary(next);
      setLastUpdated(new Date());
    } catch {
      // Non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30_000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  return { summary, loading, lastUpdated, refresh: fetchSummary };
}

function useActionQueue() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const [supportData, marketAlerts, reviewQueue] = await Promise.allSettled([
          api.getSupportMessages(),
          api.getMarketAlerts(),
          api.getMarketReviewQueue(),
        ]);

        const items: ActionItem[] = [];

        // Support items
        if (supportData.status === 'fulfilled') {
          const msgs = supportData.value.messages || [];
          msgs.filter((m: any) => m.status === 'OPEN').forEach((m: any) => {
            const ageMin = Math.round((Date.now() - new Date(m.createdAt).getTime()) / 60_000);
            items.push({
              id: m.id,
              priority: m.urgent ? 'CRITICAL' : ageMin > 60 ? 'HIGH' : 'MEDIUM',
              category: 'support',
              title: m.urgent ? `URGENT: ${m.category || 'Support request'}` : `Support: ${m.category || 'General inquiry'}`,
              description: m.message?.substring(0, 120) || '',
              entityType: 'support',
              entityId: m.id,
              createdAt: m.createdAt,
              ageMinutes: ageMin,
              reason: m.urgent ? 'Traveler marked as urgent' : ageMin > 60 ? `Open for ${Math.round(ageMin / 60)}h — SLA risk` : 'New support message',
            });
          });
        }

        // Market alerts as exceptions
        if (marketAlerts.status === 'fulfilled') {
          const alerts = (marketAlerts.value as any)?.alerts || [];
          alerts.filter((a: any) => !a.acknowledged).forEach((a: any) => {
            const ageMin = Math.round((Date.now() - new Date(a.createdAt).getTime()) / 60_000);
            items.push({
              id: a.id,
              priority: a.severity === 'CRITICAL' ? 'CRITICAL' : a.severity === 'HIGH' ? 'HIGH' : a.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
              category: 'market',
              title: a.titleEn || a.titleAr || 'Market alert',
              description: a.messageEn || a.messageAr || '',
              entityType: 'market',
              entityId: a.id,
              createdAt: a.createdAt,
              ageMinutes: ageMin,
              reason: `Severity: ${a.severity}. Type: ${a.alertType}`,
            });
          });
        }

        // Review queue items
        if (reviewQueue.status === 'fulfilled') {
          const items_queue = (reviewQueue.value as any)?.items || [];
          items_queue.filter((r: any) => r.status === 'PENDING_REVIEW').forEach((r: any) => {
            const ageMin = Math.round((Date.now() - new Date(r.detectedAt).getTime()) / 60_000);
            items.push({
              id: r.id,
              priority: r.severity === 'CRITICAL' ? 'CRITICAL' : r.severity === 'HIGH' ? 'HIGH' : r.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
              category: 'review',
              title: `Review: ${r.issueType?.replace(/_/g, ' ')}`,
              description: r.summaryEn || r.summaryAr || '',
              entityType: 'market',
              entityId: r.id,
              createdAt: r.detectedAt,
              ageMinutes: ageMin,
              reason: `${r.issueType} requires operator review`,
            });
          });
        }

        // Sort by priority then age
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        items.sort((a, b) => {
          const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (pDiff !== 0) return pDiff;
          return b.ageMinutes - a.ageMinutes;
        });

        setActions(items.slice(0, 15));
      } catch {
        // Non-critical
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return { actions, loading };
}

function useRecentEvents() {
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getRecentEvents();
        // GET /api/events/recent returns { events: BackgroundEventPayload[] } —
        // each carries eventId, eventType, timestamp, actorId and a data blob.
        const list = (data as { events: any[] }).events || [];
        setEvents(list.slice(0, 8).map(e => ({
          id: e.eventId || e.id || `evt-${Math.random()}`,
          type: e.eventType || e.type || 'UNKNOWN',
          title: e.data?.title || e.data?.description || e.eventType || 'Event',
          entity: e.data?.entity || e.data?.entityName || e.actorId,
          timestamp: e.timestamp || new Date().toISOString(),
          actor: e.actorId,
        })));
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading };
}

function useSystemHealth() {
  const [health, setHealth] = useState<HealthStatus>({
    api: 'unknown', db: 'unknown', payments: 'unknown', intelligence: 'unknown',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await api.getHealthData();
        const h: HealthStatus = {
          api: data?.status === 'ok' ? 'healthy' : 'degraded',
          db: data?.database?.adapter ? 'healthy' : 'unknown',
          payments: data?.paymentsSimulated ? 'degraded' : 'healthy',
          intelligence: data?.geminiConfigured ? 'healthy' : data?.geminiQuota?.status === 'EXHAUSTED' ? 'degraded' : 'unknown',
        };
        setHealth(h);
      } catch {
        setHealth({ api: 'down', db: 'unknown', payments: 'unknown', intelligence: 'unknown' });
      } finally {
        setLoading(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const HEALTH_COLORS = {
  healthy: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  degraded: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  down: 'text-red-400 bg-red-500/20 border-red-500/30',
  unknown: 'text-[var(--text-muted)] bg-[var(--btn-util-bg)] border-[var(--border-subtle)]',
};

const HEALTH_DOTS = {
  healthy: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  down: 'bg-red-400 animate-pulse',
  unknown: 'bg-[var(--btn-util-bg)]',
};

const PRIORITY_STYLES = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  MEDIUM: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  LOW: 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  support: MessageSquare,
  market: Globe,
  review: ShieldAlert,
  payment: DollarSign,
  supplier: Users,
  trip: Plane,
};

function FreshnessIndicator({ date, t }: { date: Date | null; t: (k: string) => string }) {
  if (!date) return <span className="text-[11px] text-[var(--text-muted)]">{t('cmd.loading')}</span>;
  const secondsAgo = Math.round((Date.now() - date.getTime()) / 1000);
  if (secondsAgo < 60) return <span className="text-[11px] text-emerald-400/80">Updated {secondsAgo}s ago</span>;
  if (secondsAgo < 600) return <span className="text-[11px] text-amber-400/80">Updated {Math.round(secondsAgo / 60)}m ago</span>;
  return <span className="text-[11px] text-red-400/80">Stale ({Math.round(secondsAgo / 60)}m)</span>;
}

function formatAge(minutes: number): string {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Main Overview Component ────────────────────────────────────────────────

export default function Overview({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { language, t } = useLanguage();
  const { summary, loading: summaryLoading, lastUpdated, refresh: refreshSummary } = useOperationalSummary();
  const { actions, loading: actionsLoading } = useActionQueue();
  const { events, loading: eventsLoading } = useRecentEvents();
  const { health, loading: healthLoading } = useSystemHealth();

  const isHealthy = summary.exceptions === 0 && summary.paymentIssues === 0 && summary.atRiskTrips === 0;
  const hasUrgentItems = actions.some(a => a.priority === 'CRITICAL');

  return (
    <div className="space-y-6">
      {/* ─── System Status Banner ─────────────────────────────────────── */}
      <div className={`rounded-2xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 ${
        hasUrgentItems
          ? 'bg-red-950/30 border-red-500/30'
          : isHealthy
            ? 'bg-emerald-950/20 border-emerald-500/20'
            : 'bg-amber-950/20 border-amber-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${hasUrgentItems ? 'bg-red-400 animate-pulse' : isHealthy ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {hasUrgentItems
                ? t('cmd.overview.actionRequired')
                : isHealthy
                  ? t('cmd.overview.allOperational')
                  : t('cmd.overview.needsAttention')
              }
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {t('cmd.title')} · <FreshnessIndicator date={lastUpdated} t={t} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refreshSummary()}
          className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('cmd.overview.refresh')}
        </button>
      </div>

      {/* ─── Operational Status Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('cmd.overview.activeTrips'), value: summary.activeTrips, icon: Plane, color: 'text-[var(--accent-primary)]', onClick: () => onNavigate('trips') },
          { label: t('cmd.overview.pendingBookings'), value: summary.pendingBookings, icon: Package, color: 'text-amber-400', onClick: () => onNavigate('trips') },
          { label: t('cmd.overview.supplierConfirmations'), value: summary.pendingSupplierConfirmations, icon: Users, color: 'text-sky-400', onClick: () => onNavigate('suppliers') },
          { label: t('cmd.overview.supportQueue'), value: summary.unreadSupport, icon: MessageSquare, color: 'text-[var(--accent-secondary)]', onClick: () => onNavigate('support') },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={card.onClick}
              className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:border-[var(--border-subtle)] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${card.color}`} />
                {card.value > 0 && (
                  <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--text-muted)] transition-colors">
                    →
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold font-mono ${card.value > 0 ? card.color : 'text-[var(--text-muted)]'}`}>
                {summaryLoading ? '—' : card.value}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{card.label}</div>
            </button>
          );
        })}
      </div>

      {/* ─── Exceptions & Payment Quick Stats ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('cmd.overview.exceptions'), value: summary.exceptions, icon: AlertTriangle, color: summary.exceptions > 0 ? 'text-red-400' : 'text-[var(--text-muted)]', onClick: () => onNavigate('exceptions') },
          { label: t('cmd.overview.paymentIssues'), value: summary.paymentIssues, icon: DollarSign, color: summary.paymentIssues > 0 ? 'text-red-400' : 'text-[var(--text-muted)]', onClick: () => onNavigate('commerce') },
          { label: t('cmd.overview.activeTransfers'), value: summary.activeTransfers, icon: Car, color: summary.activeTransfers > 0 ? 'text-sky-400' : 'text-[var(--text-muted)]', onClick: () => onNavigate('transfers') },
          { label: t('cmd.overview.unreadNotifications'), value: summary.unreadNotifications, icon: Bell, color: summary.unreadNotifications > 0 ? 'text-amber-400' : 'text-[var(--text-muted)]', onClick: () => onNavigate('notifications') },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={card.onClick}
              className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:border-[var(--border-subtle)] transition-all text-left cursor-pointer"
            >
              <Icon className={`w-4 h-4 ${card.color} mb-2`} />
              <div className={`text-2xl font-bold font-mono ${card.value > 0 ? card.color : 'text-[var(--text-muted)]'}`}>
                {summaryLoading ? '—' : card.value}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{card.label}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Action Queue (2/3 width) ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--accent-secondary)]" />
              {t('cmd.overview.needsAction')}
            </h3>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              {actions.length} item{actions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {actionsLoading ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              <span className="inline-block w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
              {t('cmd.loading')}
            </div>
          ) : actions.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
              <div className="text-sm font-bold text-emerald-400/80">
                {t('cmd.overview.noPendingActions')}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1">{t('cmd.overview.allClear')}</div>
            </div>
          ) : (
            <div className="space-y-2">
              {actions.map(action => {
                const Icon = CATEGORY_ICONS[action.category] || AlertTriangle;
                return (
                  <div
                    key={action.id}
                    className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:border-[var(--border-subtle)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${PRIORITY_STYLES[action.priority]}`}>
                              {action.priority}
                            </span>
                            <span className="text-xs font-bold text-[var(--text-primary)] truncate">{action.title}</span>
                          </div>
                          {action.description && (
                            <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">{action.description}</p>
                          )}
                          <p className="text-[11px] text-[var(--text-muted)] mt-1 italic">{action.reason}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] text-[var(--text-muted)] font-mono">{formatAge(action.ageMinutes)}</div>
                        {action.entityId && (
                          <button
                            type="button"
                            className="mt-1 px-2 py-1 rounded bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[11px] font-bold transition-all cursor-pointer"
                            onClick={() => {
                              if (action.entityType === 'support') onNavigate('support');
                              else if (action.entityType === 'market') onNavigate('intelligence');
                              else onNavigate('exceptions');
                            }}
                          >
                            Open →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Right Column: Health + Recent Events ──────────────────── */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              {t('cmd.overview.systemHealth')}
            </h3>
            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-3">
              {healthLoading ? (
                <div className="py-4 text-center text-xs text-[var(--text-muted)]">{t('cmd.loading')}</div>
              ) : (
                [
                  { label: 'API Gateway', status: health.api },
                  { label: 'Database', status: health.db },
                  { label: 'Payments', status: health.payments },
                  { label: 'Intelligence / AI', status: health.intelligence },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${HEALTH_DOTS[item.status]}`} />
                      <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${HEALTH_COLORS[item.status]}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
              <button
                type="button"
                onClick={() => onNavigate('health')}
                className="w-full text-center text-[11px] text-[var(--text-muted)] hover:text-[var(--text-muted)] transition-colors pt-2 border-t border-[var(--border-subtle)] cursor-pointer"
              >
                View full health →
              </button>
            </div>
          </div>

          {/* Recent Events Stream */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              {t('cmd.overview.recentEvents')}
            </h3>
            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-2.5">
              {eventsLoading ? (
                <div className="py-4 text-center text-xs text-[var(--text-muted)]">{t('cmd.loading')}</div>
              ) : events.length === 0 ? (
                <div className="py-4 text-center text-xs text-[var(--text-muted)]">{t('cmd.overview.noEvents')}</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="flex items-start gap-2.5 pb-2.5 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--btn-util-bg)] mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[var(--text-muted)] truncate">{event.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                        {event.actor && <span>{event.actor} · </span>}
                        {event.entity && <span>{event.entity} · </span>}
                        {formatAge(Math.round((Date.now() - new Date(event.timestamp).getTime()) / 60_000))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
