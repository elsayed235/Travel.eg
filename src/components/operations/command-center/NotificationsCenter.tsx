import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Clock, RefreshCw, X } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function NotificationsCenter() {
  const { language, t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getOperationsNotifications();
      setNotifications(data?.notifications || []);
      setSummary(data?.summary || null);
    } catch { setNotifications([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifications(); const i = setInterval(fetchNotifications, 30_000); return () => clearInterval(i); }, [fetchNotifications]);

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.priority === 'URGENT' || n.priority === 'HIGH');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            {t('cmd.notif.title')}
          </h3>
          {summary && summary.unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              {summary.unread} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'urgent'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${filter === f ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button type="button" onClick={() => fetchNotifications()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">
          <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.notif.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
          <div className="text-sm font-bold text-emerald-400/80">No {filter !== 'all' ? filter : ''} notifications</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">{t('cmd.notif.allCaughtUp')}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div key={n.id} className={`p-4 rounded-xl bg-[var(--surface-container)] border transition-[background-color,border-color,color,box-shadow,transform,opacity] ${n.read ? 'border-[var(--border-subtle)] opacity-60' : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.status === 'FAILED' ? 'bg-red-500/20 border border-red-500/30' : 'bg-[var(--btn-util-bg)] border border-[var(--border-subtle)]'}`}>
                    {n.status === 'FAILED' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Bell className="w-4 h-4 text-[var(--text-muted)]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{n.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.message}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono mt-1 space-x-2">
                      <span>{n.type}</span>
                      <span>·</span>
                      <span>{n.channel}</span>
                      <span>·</span>
                      <span>{n.createdAt ? `${Math.round((Date.now() - new Date(n.createdAt).getTime()) / 60_000)}m ago` : '—'}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0 ${
                  n.status === 'SENT' || n.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' :
                  n.status === 'FAILED' ? 'bg-red-500/20 text-red-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>{n.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
