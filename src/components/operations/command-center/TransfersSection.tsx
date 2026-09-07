import React, { useState, useEffect, useCallback } from 'react';
import { Car, CheckCircle2, AlertTriangle, Clock, RefreshCw, MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  DISPATCHED: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  AT_AIRPORT: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  PASSENGER_PICKED_UP: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  COMPLETED: 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]',
};

export default function TransfersSection() {
  const { language, t } = useLanguage();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [typeFilter, setTypeFilter] = useState<'all' | 'within_dahab' | 'anywhere'>('all');

  const fetchTransfers = useCallback(async () => {
    try {
      const data = await api.getOperationsTransfers();
      setTransfers(data?.transfers || []);
      setLastUpdated(new Date());
    } catch { setTransfers([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTransfers(); const i = setInterval(fetchTransfers, 30_000); return () => clearInterval(i); }, [fetchTransfers]);

  const filtered = (filter === 'all' ? transfers : filter === 'active' ? transfers.filter(t => t.supplierState !== 'COMPLETED') : transfers.filter(t => t.supplierState === 'COMPLETED'))
    .filter(t => typeFilter === 'all' || t.transferType === typeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-400" />
            {t('cmd.transfers.title')}
          </h3>
          {lastUpdated && <span className="text-[11px] text-[var(--text-muted)] font-mono">Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>}
        </div>
        <div className="flex items-center gap-2">
          {(['within_dahab', 'anywhere', 'all'] as const).map(k => (
            <button key={k} type="button" onClick={() => setTypeFilter(k)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${typeFilter === k ? 'bg-[var(--accent-secondary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {k === 'within_dahab' ? 'Inside' : k === 'anywhere' ? 'Egypt' : 'All types'}
            </button>
          ))}
          {(['active', 'all', 'completed'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${filter === f ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button type="button" onClick={() => fetchTransfers()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">
          <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.transfers.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <Car className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm font-bold text-[var(--text-muted)]">No {filter !== 'all' ? filter : ''} transfers</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className={`p-4 rounded-xl bg-[var(--surface-container)] border transition-[background-color,border-color,color,box-shadow,transform,opacity] ${t.supplierState === 'COMPLETED' ? 'border-[var(--border-subtle)] opacity-60' : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-[var(--accent-primary)]">{t.bookingRef}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${STATUS_COLORS[t.supplierState] || 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]'}`}>
                        {t.supplierState?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mt-1">{t.driverName || 'Driver not assigned'}</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5 space-x-3">
                      {t.vehiclePlate && <span>🚗 {t.vehiclePlate}</span>}
                      {t.driverPhone && <span>📞 {t.driverPhone}</span>}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1 space-x-3">
                      {t.pickupLocation && <span>📍 {t.pickupLocation}</span>}
                      {t.dropoffLocation && <span>→ {t.dropoffLocation}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    {t.lastTelemetryAt ? `${Math.round((Date.now() - new Date(t.lastTelemetryAt).getTime()) / 60_000)}m ago` : 'No telemetry'}
                  </div>
                  {t.supplierState !== 'COMPLETED' && t.driverPhone && (
                    <a href={`tel:${t.driverPhone}`} className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[11px] font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity]">
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
