import React, { useState, useEffect, useCallback } from 'react';
import { Brain, CheckCircle2, AlertTriangle, Database, GitMerge, Shield, RefreshCw, Clock, FileText, TrendingUp } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function KnowledgeOps() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'health' | 'gaps' | 'conflicts' | 'review' | 'stale' | 'logs' | 'metrics' | 'entities'>('health');
  const [health, setHealth] = useState<any>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [staleFacts, setStaleFacts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [h, g, c, r, sf, l, m] = await Promise.allSettled([
        api.getAdminDkosHealth(),
        api.getAdminKnowledgeGaps(),
        api.getAdminConflicts(),
        api.getAdminReviewQueue(),
        api.getAdminStaleFacts(),
        api.getAdminLogs(50),
        api.getAdminExpansionMetrics(),
      ]);
      if (h.status === 'fulfilled') setHealth(h.value);
      if (g.status === 'fulfilled') setGaps((g.value as any)?.gaps || []);
      if (c.status === 'fulfilled') setConflicts((c.value as any)?.conflicts || []);
      if (r.status === 'fulfilled') setReviewQueue((r.value as any)?.queue || []);
      if (sf.status === 'fulfilled') setStaleFacts((sf.value as any)?.staleFacts || []);
      if (l.status === 'fulfilled') setLogs((l.value as any)?.logs || []);
      if (m.status === 'fulfilled') setMetrics((m.value as any)?.metrics || m.value);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleResolveConflict = async (conflictId: string) => {
    const value = prompt('Resolved value:');
    if (!value) return;
    try { await api.resolveAdminConflict(conflictId, value); fetchData(); } catch (err: any) { alert(`Failed: ${err.message}`); }
  };

  const handleResolveReview = async (itemId: string, action: string) => {
    try { await api.resolveAdminReviewQueue(itemId, action); fetchData(); } catch (err: any) { alert(`Failed: ${err.message}`); }
  };

  const TABS = ['health', 'gaps', 'conflicts', 'review', 'stale', 'logs', 'metrics', 'entities'] as const;

  const handleMergeEntities = async (primary: string, secondary: string) => {
    if (!confirm(`Merge ${secondary} into ${primary}?`)) return;
    try { await api.mergeAdminEntities({ sourceId: secondary, targetId: primary }); fetchData(); } catch (err: any) { alert(`Failed: ${err.message}`); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          {t('cmd.knowledge.title')}
        </h3>
        <div className="flex gap-1 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === tab ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">{t('cmd.knowledge.loading')}</div>
      ) : (
        <>
          {activeTab === 'health' && health && (
            <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-4">
              <h4 className="text-xs font-bold text-[var(--text-muted)]">DKOS Health</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {Object.entries(health?.health || health || {}).slice(0, 12).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <div className="text-lg font-bold text-[var(--accent-primary)] font-mono">{typeof value === 'number' ? value : typeof value === 'boolean' ? (value ? '✓' : '✗') : '—'}</div>
                    <div className="text-[11px] text-[var(--text-muted)] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="space-y-2">
              {gaps.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
                  <div className="text-sm font-bold text-emerald-400/80">{t('cmd.knowledge.noGaps')}</div>
                </div>
              ) : gaps.map((gap: any, i: number) => (
                <div key={gap.id || i} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">{gap.category || gap.type || 'Gap'}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{gap.description?.substring(0, 120)}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${gap.severity === 'HIGH' ? 'bg-red-500/20 text-red-300' : gap.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'}`}>{gap.severity || 'LOW'}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'conflicts' && (
            <div className="space-y-2">
              {conflicts.filter((c: any) => c.status === 'OPEN').length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
                  <div className="text-sm font-bold text-emerald-400/80">{t('cmd.knowledge.noConflicts')}</div>
                </div>
              ) : conflicts.filter((c: any) => c.status === 'OPEN').map((conflict: any) => (
                <div key={conflict.id} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{conflict.entityId} · {conflict.property}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conflict.classification === 'TRUE_CONFLICT' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>{conflict.classification}</span>
                      <button type="button" onClick={() => handleResolveConflict(conflict.id)} className="px-2 py-0.5 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] font-bold cursor-pointer">Resolve</button>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1">{conflict.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-2">
              {reviewQueue.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
                  <div className="text-sm font-bold text-emerald-400/80">{t('cmd.knowledge.reviewEmpty')}</div>
                </div>
              ) : reviewQueue.map((item: any) => (
                <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">{item.title || item.type || item.id}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{item.description?.substring(0, 120)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">{item.status}</span>
                    {item.status === 'PENDING_REVIEW' && (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => handleResolveReview(item.id, 'APPROVE')} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold cursor-pointer">{t('cmd.action.approve')}</button>
                        <button type="button" onClick={() => handleResolveReview(item.id, 'REJECT')} className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold cursor-pointer">{t('cmd.action.reject')}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stale' && (
            <div className="space-y-2">
              {staleFacts.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <Clock className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                  <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.knowledge.noStaleFacts')}</div>
                </div>
              ) : staleFacts.map((fact: any, i: number) => (
                <div key={fact.id || i} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                  <div className="text-xs font-bold text-[var(--text-primary)]">{fact.entityId || fact.entity} · {fact.property || fact.field}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Value: {fact.value || '—'} · Last verified: {fact.lastVerifiedAt || fact.verifiedAt || 'Never'}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] overflow-hidden">
              {logs.length === 0 ? (
                <div className="py-12 text-center"><FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" /><div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.knowledge.noLogs')}</div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-[var(--btn-util-bg)] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                      <tr><th className="py-2.5 px-3">Time</th><th className="py-2.5 px-3">Query</th><th className="py-2.5 px-3">Results</th><th className="py-2.5 px-3">Latency</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map((log: any, i: number) => (
                        <tr key={i} className="hover:bg-[var(--btn-util-bg)] transition-colors">
                          <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '—'}</td>
                          <td className="py-2.5 px-3 text-[var(--accent-primary)]">{log.query || '—'}</td>
                          <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.resultCount ?? log.results ?? '—'}</td>
                          <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.latencyMs ? `${log.latencyMs}ms` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metrics' && metrics && (
            <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold text-[var(--text-muted)] mb-3">Expansion Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {Object.entries(metrics).slice(0, 12).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <div className="text-lg font-bold text-[var(--accent-primary)] font-mono">{typeof value === 'number' ? value.toLocaleString() : value || '—'}</div>
                    <div className="text-[11px] text-[var(--text-muted)] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <h4 className="text-xs font-bold text-[var(--text-muted)] mb-2">{t('cmd.knowledge.entityResolution')}</h4>
                <p className="text-[11px] text-[var(--text-muted)]">{t('cmd.knowledge.entityResolutionDesc')}</p>
                <div className="mt-3 flex gap-2">
                  <input type="text" id="entity-primary" placeholder="Primary entity ID" className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50 flex-1" />
                  <input type="text" id="entity-secondary" placeholder="Secondary entity ID (to merge)" className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50 flex-1" />
                  <button type="button" onClick={() => {
                    const primary = (document.getElementById('entity-primary') as HTMLInputElement)?.value;
                    const secondary = (document.getElementById('entity-secondary') as HTMLInputElement)?.value;
                    if (primary && secondary) handleMergeEntities(primary, secondary);
                  }} className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-bold cursor-pointer">{t('cmd.action.merge')}</button>
                </div>
              </div>
              <div className="py-8 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <GitMerge className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                <div className="text-sm font-bold text-[var(--text-muted)]">Use the merge form above to resolve entity duplicates</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">Conflicts tab shows entities that need resolution</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
