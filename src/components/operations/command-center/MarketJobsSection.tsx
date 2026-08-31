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
      setJobs(data?.jobs || data || []);
    } catch { setJobs([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleTrigger = async (jobType?: string) => {
    setTriggering(true);
    try {
      await api.triggerMarketJob({ jobType });
      await fetchJobs();
    } catch { /* best effort */ } finally { setTriggering(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          {t('cmd.jobs.title')}
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleTrigger()} disabled={triggering}
            className="px-3 py-1.5 rounded-lg bg-[#20A89A]/20 hover:bg-[#20A89A]/30 text-[#52C4B7] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            <Play className="w-3 h-3" />{triggering ? 'Running…' : 'Run All'}
          </button>
          <button type="button" onClick={() => fetchJobs()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">
          <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.jobs.loading')}
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
          <Zap className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <div className="text-sm font-bold text-white/50">No market jobs configured</div>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job: any, i: number) => (
            <div key={job.id || job.type || i} className="p-4 rounded-xl bg-[#062C35] border border-white/8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#F7F3EA]">{job.type || job.name || job.jobType || 'Job'}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {job.schedule && <span>Schedule: {job.schedule} · </span>}
                    {job.lastRun && <span>Last: {new Date(job.lastRun).toLocaleString()}</span>}
                    {job.nextRun && <span>Next: {new Date(job.nextRun).toLocaleString()}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  job.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/40'
                }`}>{job.enabled !== false ? 'ENABLED' : 'DISABLED'}</span>
                <button type="button" onClick={() => handleTrigger(job.type || job.jobType)} disabled={triggering}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/50 text-[10px] font-bold cursor-pointer disabled:opacity-50">
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
