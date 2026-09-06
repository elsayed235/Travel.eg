import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Globe, MessageSquare, Brain, Shield, Clock, RefreshCw, Eye, X } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Exception {
  id: string;
  source: 'market' | 'support' | 'knowledge' | 'review' | 'system';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  entityType?: string;
  entityId?: string;
}

const SOURCE_ICONS: Record<string, React.ElementType> = { market: Globe, support: MessageSquare, knowledge: Brain, review: Shield, system: AlertTriangle };
const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  MEDIUM: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  LOW: 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]',
};

export default function ExceptionsCenter() {
  const { language, t } = useLanguage();
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('active');
  const [selectedException, setSelectedException] = useState<Exception | null>(null);

  const fetchExceptions = useCallback(async () => {
    try {
      const [marketAlerts, supportData, reviewQueue, gaps] = await Promise.allSettled([
        api.getMarketAlerts(),
        api.getSupportMessages(),
        api.getMarketReviewQueue(),
        api.getAdminKnowledgeGaps(),
      ]);

      const items: Exception[] = [];

      if (marketAlerts.status === 'fulfilled') {
        (marketAlerts.value as any)?.alerts?.forEach((a: any) => {
          items.push({
            id: a.id, source: 'market', severity: a.severity || 'MEDIUM',
            title: a.titleEn || a.titleAr || 'Market alert',
            description: a.messageEn || a.messageAr || '',
            status: a.acknowledged ? 'acknowledged' : 'active',
            createdAt: a.createdAt, entityType: 'market', entityId: a.id,
          });
        });
      }

      if (supportData.status === 'fulfilled') {
        (supportData.value as any)?.messages?.filter((m: any) => m.status === 'OPEN').forEach((m: any) => {
          items.push({
            id: m.id, source: 'support', severity: m.urgent ? 'CRITICAL' : 'MEDIUM',
            title: `Support: ${m.category || 'General'}`,
            description: m.message?.substring(0, 200) || '',
            status: 'active', createdAt: m.createdAt,
            entityType: 'support', entityId: m.id,
          });
        });
      }

      if (reviewQueue.status === 'fulfilled') {
        (reviewQueue.value as any)?.items?.filter((r: any) => r.status === 'PENDING_REVIEW').forEach((r: any) => {
          items.push({
            id: r.id, source: 'review', severity: r.severity || 'MEDIUM',
            title: `Review: ${r.issueType?.replace(/_/g, ' ')}`,
            description: r.summaryEn || '',
            status: 'active', createdAt: r.detectedAt,
            entityType: 'review', entityId: r.id,
          });
        });
      }

      if (gaps.status === 'fulfilled') {
        (gaps.value as any)?.gaps?.forEach((g: any) => {
          items.push({
            id: g.id || `gap-${Math.random()}`, source: 'knowledge',
            severity: g.severity || 'LOW',
            title: `Knowledge Gap: ${g.category || g.description?.substring(0, 50)}`,
            description: g.description || '',
            status: 'active', createdAt: g.detectedAt || new Date().toISOString(),
          });
        });
      }

      // Sort by severity then age
      const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      items.sort((a, b) => (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3));

      setExceptions(items);
    } catch {
      setExceptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExceptions();
    const interval = setInterval(fetchExceptions, 30_000);
    return () => clearInterval(interval);
  }, [fetchExceptions]);

  const handleAcknowledge = async (id: string) => {
    // Find and acknowledge in market alerts
    try {
      await api.acknowledgeMarketAlert(id, 'Operations');
      setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'acknowledged' } : e));
    } catch { /* Alert may not be from market */ }
  };

  const filtered = filter === 'all' ? exceptions : exceptions.filter(e => e.status === filter);
  const activeCount = exceptions.filter(e => e.status === 'active').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {t('cmd.exceptions.title')}
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(['active', 'all', 'acknowledged'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filter === f ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button type="button" onClick={() => fetchExceptions()}
            className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">
          <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.exceptions.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
          <div className="text-sm font-bold text-emerald-400/80">No {filter !== 'all' ? filter : ''} exceptions</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">{t('cmd.exceptions.allSystemsNormal')}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(exc => {
            const Icon = SOURCE_ICONS[exc.source] || AlertTriangle;
            return (
              <div key={exc.id} className={`p-4 rounded-xl bg-[var(--surface-container)] border transition-all ${
                exc.status === 'acknowledged' ? 'border-[var(--border-subtle)] opacity-60' : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${SEVERITY_STYLES[exc.severity]}`}>
                          {exc.severity}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase">{exc.source}</span>
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)] mt-1">{exc.title}</div>
                      {exc.description && <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">{exc.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {Math.round((Date.now() - new Date(exc.createdAt).getTime()) / 60_000)}m ago
                    </span>
                    {exc.status === 'active' && exc.source === 'market' && (
                      <button type="button" onClick={() => handleAcknowledge(exc.id)}
                        className="px-2 py-1 rounded bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[11px] text-[var(--text-muted)] cursor-pointer">
                        Ack
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
  );
}
