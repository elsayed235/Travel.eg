import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertTriangle, RefreshCw, Phone } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function SmsCenter() {
  const { language, t } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ to: '', recipientName: '', recipientRole: 'TRAVELER', message: '', bookingRef: '' });
  const [sentResult, setSentResult] = useState<any>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await api.getSmsLogs(100);
      setLogs(data?.logs || []);
    } catch { setLogs([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSend = async () => {
    if (!form.to || !form.recipientName || !form.message || sending) return;
    setSending(true);
    setSentResult(null);
    try {
      const result = await api.sendOpsSmsDispatch(form);
      setSentResult({ success: true, result });
      setForm({ to: '', recipientName: '', recipientRole: 'TRAVELER', message: '', bookingRef: '' });
      await fetchLogs();
    } catch (err: any) {
      setSentResult({ success: false, error: err.message });
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--accent-secondary)]" />
          {t('cmd.sms.title')}
        </h3>
        <button type="button" onClick={() => fetchLogs()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dispatch Form */}
      <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-3">
        <h4 className="text-xs font-bold text-[var(--text-muted)]">{t('cmd.sms.sendTitle')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
            aria-label="Phone number"
            placeholder="Phone number" className="px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50" />
          <input type="text" value={form.recipientName} onChange={e => setForm(p => ({ ...p, recipientName: e.target.value }))}
            aria-label="Recipient name"
            placeholder="Recipient name" className="px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50" />
          <select value={form.recipientRole} onChange={e => setForm(p => ({ ...p, recipientRole: e.target.value }))}
            className="px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none">
            {['TRAVELER', 'DRIVER', 'DIVE_INSTRUCTOR', 'HOTEL_DESK', 'BEDOUIN_GUIDE'].map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
          <input type="text" value={form.bookingRef} onChange={e => setForm(p => ({ ...p, bookingRef: e.target.value }))}
            aria-label="Booking reference (optional)"
            placeholder="Booking ref (optional)" className="px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50" />
        </div>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          placeholder="Message body…" rows={3} className="w-full px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 resize-none focus:outline-none focus:border-[var(--accent-primary)]/50" />
        <button type="button" onClick={handleSend} disabled={!form.to || !form.recipientName || !form.message || sending}
          className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />{sending ? t('cmd.sms.sending') : t('cmd.sms.sendBtn')}
        </button>
        {sentResult && (
          <div className={`p-3 rounded-xl text-xs font-bold ${sentResult.success ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/20 border border-red-500/30 text-red-300'}`}>
            {sentResult.success ? '✓ SMS dispatched successfully' : `✗ ${sentResult.error}`}
          </div>
        )}
      </div>

      {/* SMS Logs */}
      <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--text-muted)]">
            <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
            {t('cmd.sms.loadingLogs')}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.sms.noLogs')}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">To</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Message</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.slice(0, 50).map((log: any, i: number) => (
                  <tr key={log.id || i} className="hover:bg-[var(--btn-util-bg)] transition-colors">
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '—'}</td>
                    <td className="py-2.5 px-3 text-[var(--accent-primary)]">{log.to || '—'}</td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.recipientName || '—'}</td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">{log.recipientRole?.replace(/_/g, ' ') || '—'}</td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)] max-w-[200px] truncate">{log.message || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.status === 'SENT' || log.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' : log.status === 'FAILED' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {log.status || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
