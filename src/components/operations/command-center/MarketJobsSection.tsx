import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Play, RefreshCw, Clock, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function MarketJobsSection() {
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api.getMarketJobs();
      setJobs((data as any)?.policies || []);
    } catch { setJobs([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleTrigger = async (sourceId?: string) => {
    setTriggering(true);
    try {
      if (sourceId) {
        await api.triggerMarketJob({ sourceId });
      } else {
        for (const p of jobs) {
          if (p.sourceId) await api.triggerMarketJob({ sourceId: p.sourceId });
        }
      }
      await fetchJobs();
    } catch { /* best effort */ } finally { setTriggering(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          {t('cmd.jobs.title')}
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleTrigger()} disabled={triggering}
            className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            <Play className="w-3 h-3" />{triggering ? t('cmd.jobs.running') : t('cmd.jobs.runAll')}
          </button>
          <button type="button" onClick={() => fetchJobs()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">
          <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.jobs.loading')}
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <Zap className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.jobs.noJobs')}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job: any, i: number) => (
            <div key={job.id || job.type || i} className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)]">{job.sourceType || job.sourceReference || job.sourceId || 'Job'}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {job.scheduleInterval && <span>Schedule: {job.scheduleInterval} · </span>}
                    {job.lastCompletedRun && <span>Last: {new Date(job.lastCompletedRun).toLocaleString()}</span>}
                    {job.nextScheduledRun && !job.lastCompletedRun && <span>Next: {new Date(job.nextScheduledRun).toLocaleString()}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  job.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'
                }`}>{job.enabled !== false ? 'ENABLED' : 'DISABLED'}</span>
                <button type="button" onClick={() => handleTrigger(job.sourceId)} disabled={triggering}
                  className="px-2 py-1 rounded bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-[11px] font-bold cursor-pointer disabled:opacity-50">
                  {t('cmd.action.run')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
