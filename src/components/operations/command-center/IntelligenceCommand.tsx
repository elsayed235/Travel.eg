import React, { useState, useEffect, useCallback } from 'react';
import { Globe, RefreshCw, AlertTriangle, CheckCircle2, TrendingUp, Clock, Database, Zap, Shield, Lightbulb, BarChart3 } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function IntelligenceCommand() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'alerts' | 'refresh' | 'opportunities' | 'features' | 'price-history'>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [refreshResult, setRefreshResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actingOpp, setActingOpp] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [ovData, srcData, alertData, oppData, featData, phData] = await Promise.allSettled([
        api.getMarketOpsOverview(),
        api.getMarketSourceHealth(),
        api.getMarketAlerts(),
        api.getIntelligenceOpportunities(),
        api.getIntelligenceFeatures(),
        api.getMarketPriceHistory(),
      ]);
      if (ovData.status === 'fulfilled') setOverview(ovData.value);
      if (srcData.status === 'fulfilled') setSources((srcData.value as any)?.health || (srcData.value as any)?.sources || []);
      if (alertData.status === 'fulfilled') setAlerts((alertData.value as any)?.alerts || []);
      if (oppData.status === 'fulfilled') setOpportunities((oppData.value as any)?.opportunities || oppData.value || []);
      if (featData.status === 'fulfilled') setFeatures((featData.value as any)?.features || featData.value || []);
      if (phData.status === 'fulfilled') setPriceHistory((phData.value as any)?.observations || []);
    } catch { /* Non-critical */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30_000); return () => clearInterval(i); }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await api.refreshMarketIntelligence();
      setRefreshResult(result);
      await fetchData();
    } catch (err: any) { setRefreshResult({ status: 'FAILURE', message: err.message }); } finally { setRefreshing(false); }
  };

  const handleAckAlert = async (id: string) => {
    try { await api.acknowledgeMarketAlert(id, 'Operations'); setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)); } catch {}
  };

  const handleOppAction = async (id: string, action: 'accept' | 'reject' | 'defer') => {
    if (!confirm(` ${action} this opportunity?`)) return;
    setActingOpp(id);
    try {
      await api.actOnOpportunity(id, action);
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: action === 'accept' ? 'ACCEPTED' : action === 'reject' ? 'REJECTED' : 'DEFERRED' } : o));
    } catch (err: any) { alert(`Failed: ${err.message}`); } finally { setActingOpp(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
          {t('cmd.intel.title')}
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {(['overview', 'sources', 'alerts', 'opportunities', 'features', 'price-history', 'refresh'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${activeTab === tab ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {loading ? <div className="py-12 text-center text-sm text-[var(--text-muted)]">{t('cmd.loading')}</div> : (
            <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold text-[var(--text-muted)] mb-3">{t('cmd.intel.status')}</h4>
              {overview ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Active Sources', value: overview?.overview?.activeSourcesCount ?? overview?.activeSourcesCount ?? '—' },
                    { label: 'Observations', value: overview?.overview?.totalPriceObservations ?? overview?.totalPriceObservations ?? '—' },
                    { label: 'Changes Detected', value: overview?.overview?.recentChangeEventsCount ?? overview?.recentChangeEventsCount ?? '—' },
                    { label: 'Alerts', value: alerts.filter(a => !a.acknowledged).length },
                  ].map((stat, i) => (
                    <div key={i}><div className="text-lg font-bold text-[var(--accent-primary)] font-mono">{stat.value}</div><div className="text-[11px] text-[var(--text-muted)]">{stat.label}</div></div>
                  ))}
                </div>
              ) : <div className="text-xs text-[var(--text-muted)]">{t('cmd.loading')}</div>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="space-y-2">
          {sources.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <Database className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm text-[var(--text-muted)]">{t('cmd.intel.noSources')}</div>
            </div>
          ) : sources.map((src: any, i: number) => (
            <div key={src.id || i} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{src.sourceReference || src.sourceId}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{src.sourceType}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--text-muted)] font-mono">{src.totalRuns || 0} runs · {src.successfulRuns || 0} ok</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  src.healthStatus === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-300' :
                  src.healthStatus === 'DEGRADED' ? 'bg-amber-500/20 text-amber-300' :
                  src.healthStatus === 'FAILING' ? 'bg-red-500/20 text-red-300' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'
                }`}>{src.healthStatus || 'UNKNOWN'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
              <div className="text-sm font-bold text-emerald-400/80">{t('cmd.intel.noAlerts')}</div>
            </div>
          ) : alerts.map((alert: any) => (
            <div key={alert.id} className={`p-3 rounded-xl border flex items-center justify-between ${alert.acknowledged ? 'bg-[var(--surface-container)]/60 border-[var(--border-subtle)] opacity-60' : 'bg-[var(--surface-container)] border-[var(--border-subtle)]'}`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-4 h-4 ${alert.severity === 'CRITICAL' ? 'text-red-400' : alert.severity === 'HIGH' ? 'text-amber-400' : 'text-[var(--text-muted)]'}`} />
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{alert.titleEn || alert.titleAr}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{alert.alertType} · {alert.severity}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!alert.acknowledged && <button type="button" onClick={() => handleAckAlert(alert.id)} className="px-2 py-1 rounded bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[11px] text-[var(--text-muted)] cursor-pointer">Ack</button>}
                <span className="text-[11px] text-[var(--text-muted)] font-mono">{Math.round((Date.now() - new Date(alert.createdAt).getTime()) / 60_000)}m</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-3">
          {opportunities.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <Lightbulb className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.intel.noOpportunities')}</div>
            </div>
          ) : opportunities.map((opp: any) => {
            const isDecided = opp.status === 'ACCEPTED' || opp.status === 'REJECTED' || opp.status === 'DEFERRED';
            return (
              <div key={opp.id} className={`p-4 rounded-xl bg-[var(--surface-container)] border transition-[background-color,border-color,color,box-shadow,transform,opacity] ${isDecided ? 'border-[var(--border-subtle)] opacity-60' : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {opp.category && <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300">{opp.category}</span>}
                      {isDecided && <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${opp.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300' : opp.status === 'REJECTED' ? 'bg-red-500/20 text-red-300' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'}`}>{opp.status}</span>}
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mt-1">{opp.title || opp.description || 'Opportunity'}</div>
                  </div>
                  {!isDecided && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button type="button" onClick={() => handleOppAction(opp.id, 'accept')} disabled={actingOpp === opp.id} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold cursor-pointer disabled:opacity-50">Accept</button>
                      <button type="button" onClick={() => handleOppAction(opp.id, 'defer')} disabled={actingOpp === opp.id} className="px-2 py-0.5 rounded bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-[11px] font-bold cursor-pointer disabled:opacity-50">Defer</button>
                      <button type="button" onClick={() => handleOppAction(opp.id, 'reject')} disabled={actingOpp === opp.id} className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[11px] font-bold cursor-pointer disabled:opacity-50">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-2">
          {features.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <BarChart3 className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.intel.noFeatures')}</div>
            </div>
          ) : features.map((f: any, i: number) => (
            <div key={f.id || i} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{f.name || f.feature || f.id}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{f.description?.substring(0, 100) || f.category || ''}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : f.status === 'PLANNED' ? 'bg-sky-500/20 text-sky-300' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'}`}>
                {f.status || f.state || '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'price-history' && (
        <div className="space-y-2">
          {priceHistory.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <TrendingUp className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.intel.noPriceHistory')}</div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {priceHistory.slice(0, 30).map((ph: any, i: number) => (
                      <tr key={i} className="hover:bg-[var(--btn-util-bg)] transition-colors">
                        <td className="py-2.5 px-3 text-[var(--accent-primary)]">{ph.offerId || ph.itemName || '—'}</td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)]">{ph.supplierId || ph.supplierName || '—'}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--accent-secondary)]">{ph.priceEGP?.toLocaleString() || ph.price || '—'} EGP</td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)]">{ph.observedAt ? new Date(ph.observedAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'refresh' && (
        <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">{t('cmd.intel.refreshTitle')}</h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{t('cmd.intel.refreshDesc')}</p>
            </div>
            <button type="button" onClick={handleRefresh} disabled={refreshing}
              className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />{refreshing ? t('cmd.intel.refreshing') : t('cmd.intel.refreshBtn')}
            </button>
          </div>
          {refreshResult && (
            <div className={`p-4 rounded-xl border ${refreshResult.refreshStatus === 'SUCCESS' || refreshResult.status === 'success' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-red-950/20 border-red-500/30 text-red-300'}`}>
              <div className="text-xs font-bold">{refreshResult.refreshStatus === 'SUCCESS' || refreshResult.status === 'success' ? `Refreshed · ${refreshResult.changesDetectedCount ?? 0} changes detected ✓` : `Failed: ${refreshResult.message || 'Unknown error'}`}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
