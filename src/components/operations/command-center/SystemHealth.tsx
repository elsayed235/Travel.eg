import React, { useState, useEffect, useCallback } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, RefreshCw, Database, Cpu, Cloud, Zap, Clock } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

const STATUS_COLORS: Record<string, string> = {
  healthy: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  degraded: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  down: 'text-red-400 bg-red-500/20 border-red-500/30',
  ok: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  error: 'text-red-400 bg-red-500/20 border-red-500/30',
  unknown: 'text-white/40 bg-white/5 border-white/10',
};

export default function SystemHealth() {
  const { language } = useLanguage();
  const [health, setHealth] = useState<any>(null);
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'integrations'>('services');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [h, m, j, integ, w, cam] = await Promise.allSettled([
        api.getHealthData(),
        api.getMarketStatus(),
        api.getBackgroundJobsStatus(),
        api.getOperationsIntegrations(),
        api.getWeatherTelemetry(),
        api.getCameraFeeds(),
      ]);
      if (h.status === 'fulfilled') setHealth(h.value);
      if (m.status === 'fulfilled') setMarketStatus(m.value);
      if (j.status === 'fulfilled') setJobs(j.value);
      if (integ.status === 'fulfilled') setIntegrations((integ.value as any)?.integrations || []);
      if (w.status === 'fulfilled') setWeather(w.value);
      if (cam.status === 'fulfilled') setCameras((cam.value as any)?.cameras || (cam.value as any)?.feeds || []);
    } catch { /* non-critical */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 60_000); return () => clearInterval(i); }, [fetchData]);

  const services = [
    {
      name: 'API Gateway',
      status: health?.status === 'ok' ? 'healthy' : 'down',
      details: health?.service || 'Dahab Platform',
    },
    {
      name: 'Database',
      status: health?.database?.adapter ? 'healthy' : 'unknown',
      details: health?.database?.adapter || 'Unknown adapter',
      meta: health?.database ? `${health.database.users} users · ${health.database.trips} trips · ${health.database.bookings} bookings` : undefined,
    },
    {
      name: 'Payments',
      status: health?.paymentsSimulated ? 'degraded' : 'healthy',
      details: health?.paymentsSimulated ? 'Simulation mode — no real gateway' : 'Real payment gateway',
    },
    {
      name: 'Gemini AI',
      status: health?.geminiConfigured ? (health?.geminiQuota?.status === 'EXHAUSTED' ? 'degraded' : 'healthy') : 'down',
      details: health?.geminiConfigured ? `Model: ${health.geminiQuota?.model || 'unknown'}` : 'API key not configured',
      meta: health?.geminiQuota ? `Status: ${health.geminiQuota.status} · Available: ${health.geminiQuota.available}` : undefined,
    },
    {
      name: 'Firebase Auth',
      status: health?.firebaseAdminConfigured === true ? 'healthy' : health?.firebaseAdminConfigured === false ? 'degraded' : 'unknown',
      details: health?.firebaseAdminConfigured ? 'Federated sign-in available' : 'Admin credentials not configured',
    },
    {
      name: 'Ledger Integrity',
      status: health?.ledger?.valid ? 'healthy' : health?.ledger ? 'down' : 'unknown',
      details: health?.ledger ? `${health.ledger.totalEntries} entries · ${health.ledger.valid ? 'Valid' : 'INVALID'}` : 'Unknown',
      meta: health?.ledger?.chainIntact ? 'SHA-256 chain intact' : undefined,
    },
    {
      name: 'Market Intelligence',
      status: marketStatus?.autonomousStatus?.circuitBreaker === 'CLOSED' ? 'healthy' : 'unknown',
      details: marketStatus?.autonomousStatus?.circuitBreaker || 'Unknown state',
    },
    {
      name: 'Background Jobs',
      status: jobs?.status === 'ok' ? 'healthy' : 'unknown',
      details: jobs?.queue ? `Queue depth: ${jobs.queue.length}` : 'Unknown',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-400" />
          {language === 'ar' ? 'صحة النظام' : 'System Health'}
        </h3>
        <button type="button" onClick={() => fetchData()}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">Loading health data…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((svc, i) => {
            const isOk = svc.status === 'healthy' || svc.status === 'ok';
            return (
              <div key={i} className={`p-4 rounded-2xl border ${isOk ? 'bg-[#062C35] border-emerald-500/10' : 'bg-[#062C35] border-white/8'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-[#F7F3EA]">{svc.name}</div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${STATUS_COLORS[svc.status]}`}>
                    {svc.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-white/50">{svc.details}</div>
                {svc.meta && <div className="text-[10px] text-white/30 font-mono mt-1">{svc.meta}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Integrations */}
      {integrations.length > 0 && activeTab === 'services' && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white/60">Integrations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {integrations.map((integ: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-[#062C35] border border-white/8 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F7F3EA]">{integ.name}</div>
                  <div className="text-[10px] text-white/40">{integ.purpose}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 font-mono">{integ.freshness}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${STATUS_COLORS[integ.status] || STATUS_COLORS.unknown}`}>\n                    {integ.status?.toUpperCase() || 'UNKNOWN'}\n                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Telemetry */}
      {weather && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white/60">Weather Telemetry</h4>
          <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {weather?.current && (
                <>
                  <div><div className="text-lg font-bold text-sky-400 font-mono">{weather.current.temperature || weather.temperature || '—'}°C</div><div className="text-[10px] text-white/40">Temperature</div></div>
                  <div><div className="text-lg font-bold text-sky-400 font-mono">{weather.current.humidity || weather.humidity || '—'}%</div><div className="text-[10px] text-white/40">Humidity</div></div>
                  <div><div className="text-lg font-bold text-sky-400 font-mono">{weather.current.windSpeed || weather.wind || '—'} km/h</div><div className="text-[10px] text-white/40">Wind</div></div>
                  <div><div className="text-lg font-bold text-sky-400 font-mono">{weather.current.condition || weather.description || '—'}</div><div className="text-[10px] text-white/40">Condition</div></div>
                </>
              )}
              {!weather?.current && (
                <div className="col-span-4 text-xs text-white/40">Weather data: {JSON.stringify(weather).substring(0, 100)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Feeds */}
      {cameras.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white/60">Camera Feeds ({cameras.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cameras.slice(0, 4).map((cam: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-[#062C35] border border-white/8">
                <div className="text-xs font-bold text-[#F7F3EA]">{cam.name || cam.location || `Feed ${i + 1}`}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{cam.status || 'Active'} · {cam.area || cam.zone || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-center text-[10px] text-white/30">
        Last checked: {new Date().toLocaleTimeString()} · Auto-refreshes every 60s
      </div>
    </div>
  );
}
