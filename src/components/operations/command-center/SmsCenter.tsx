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
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#E7A83B]" />
          {t('cmd.sms.title')}
        </h3>
        <button type="button" onClick={() => fetchLogs()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dispatch Form */}
      <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8 space-y-3">
        <h4 className="text-xs font-bold text-white/60">Send SMS / WhatsApp</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
            placeholder="Phone number" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50" />
          <input type="text" value={form.recipientName} onChange={e => setForm(p => ({ ...p, recipientName: e.target.value }))}
            placeholder="Recipient name" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50" />
          <select value={form.recipientRole} onChange={e => setForm(p => ({ ...p, recipientRole: e.target.value }))}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] focus:outline-none">
            {['TRAVELER', 'DRIVER', 'DIVE_INSTRUCTOR', 'HOTEL_DESK', 'BEDOUIN_GUIDE'].map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
          <input type="text" value={form.bookingRef} onChange={e => setForm(p => ({ ...p, bookingRef: e.target.value }))}
            placeholder="Booking ref (optional)" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50" />
        </div>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          placeholder="Message body…" rows={3} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7F3EA] placeholder-white/30 resize-none focus:outline-none focus:border-[#20A89A]/50" />
        <button type="button" onClick={handleSend} disabled={!form.to || !form.recipientName || !form.message || sending}
          className="px-4 py-2 rounded-xl bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />{sending ? 'Sending…' : 'Send SMS'}
        </button>
        {sentResult && (
          <div className={`p-3 rounded-xl text-xs font-bold ${sentResult.success ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/20 border border-red-500/30 text-red-300'}`}>
            {sentResult.success ? '✓ SMS dispatched successfully' : `✗ ${sentResult.error}`}
          </div>
        )}
      </div>

      {/* SMS Logs */}
      <div className="rounded-2xl bg-[#062C35] border border-white/8 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-white/40">
            <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
            {t('cmd.sms.loadingLogs')}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <div className="text-sm font-bold text-white/50">{t('cmd.sms.noLogs')}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-white/5 text-white/50 uppercase tracking-wider border-b border-white/8">
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
                  <tr key={log.id || i} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-white/40">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '—'}</td>
                    <td className="py-2.5 px-3 text-[#52C4B7]">{log.to || '—'}</td>
                    <td className="py-2.5 px-3 text-white/70">{log.recipientName || '—'}</td>
                    <td className="py-2.5 px-3 text-white/50">{log.recipientRole?.replace(/_/g, ' ') || '—'}</td>
                    <td className="py-2.5 px-3 text-white/40 max-w-[200px] truncate">{log.message || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.status === 'SENT' || log.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' : log.status === 'FAILED' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
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
