import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, CheckCircle2, AlertTriangle, Clock, Send, User, Phone, Mail, Bell, RefreshCw } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function SupportCenter() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'ANSWERED'>('all');
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  const fetchData = useCallback(async () => {
    try {
      const [msgData, notifData] = await Promise.allSettled([
        api.getSupportMessages(),
        api.getOperationsNotifications(),
      ]);
      if (msgData.status === 'fulfilled') setMessages((msgData.value as any)?.messages || []);
      if (notifData.status === 'fulfilled') setNotifications((notifData.value as any)?.notifications || []);
    } catch { setMessages([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30_000); return () => clearInterval(i); }, [fetchData]);

  const handleReply = async () => {
    if (!selectedMsg || !replyText.trim() || sending) return;
    setSending(true);
    try {
      await api.replyToSupportMessage(selectedMsg.id, replyText.trim());
      setMessages(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, reply: replyText.trim(), status: 'ANSWERED' } : m));
      setSelectedMsg((prev: any) => prev ? { ...prev, reply: replyText.trim(), status: 'ANSWERED' } : prev);
      setReplyText('');
    } catch (err: any) { alert(`Failed: ${err.message}`); } finally { setSending(false); }
  };

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--accent-secondary)]" />
          {t('cmd.support.title')}
        </h3>
        <div className="flex gap-2">
          {(['messages', 'notifications'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === tab ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'notifications' && unreadNotifs.length > 0 ? `(${unreadNotifs.length})` : ''}
            </button>
          ))}
          <button type="button" onClick={() => fetchData()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeTab === 'notifications' ? (
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <Bell className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.support.noNotifications')}</div>
            </div>
          ) : notifications.map((n: any) => (
            <div key={n.id} className={`p-4 rounded-xl bg-[var(--surface-container)] border transition-all ${n.read ? 'border-[var(--border-subtle)] opacity-60' : 'border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.status === 'FAILED' ? 'bg-red-500/20 border border-red-500/30' : 'bg-[var(--btn-util-bg)] border border-[var(--border-subtle)]'}`}>
                    <Bell className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{n.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.message}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono mt-1">{n.type} · {n.channel} · {n.createdAt ? `${Math.round((Date.now() - new Date(n.createdAt).getTime()) / 60_000)}m ago` : '—'}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0 ${n.status === 'SENT' || n.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' : n.status === 'FAILED' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>{n.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            {(['all', 'OPEN', 'ANSWERED'] as const).map(f => (
              <button key={f} type="button" onClick={() => { setFilter(f); setSelectedMsg(null); }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${filter === f ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
                {f === 'OPEN' ? `Open (${messages.filter(m => m.status === 'OPEN').length})` : f === 'ANSWERED' ? 'Answered' : 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">{t('cmd.support.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-2 max-h-[60vh] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--text-muted)] rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                    <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    No {filter !== 'all' ? filter.toLowerCase() : ''} messages
                  </div>
                ) : filtered.map(msg => (
                  <button key={msg.id} type="button" onClick={() => { setSelectedMsg(msg); setReplyText(''); }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedMsg?.id === msg.id ? 'bg-[var(--surface-container)] border-[var(--accent-primary)]/30' : 'bg-[var(--surface-container)] border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${msg.status === 'OPEN' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{msg.status}</span>
                      {msg.urgent && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">URGENT</span>}
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">{msg.travelerName || msg.userId}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{msg.message?.substring(0, 80)}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                      {msg.category && <span>{msg.category} · </span>}
                      {Math.round((Date.now() - new Date(msg.createdAt).getTime()) / 60_000)}m ago
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedMsg ? (
                  <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">{selectedMsg.travelerName || selectedMsg.userId}</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 space-x-3">
                          {selectedMsg.travelerPhone && <span className="flex items-center gap-1 inline-flex"><Phone className="w-3 h-3" />{selectedMsg.travelerPhone}</span>}
                          {selectedMsg.tripId && <span className="flex items-center gap-1 inline-flex">Trip: {selectedMsg.tripId}</span>}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedMsg.status === 'OPEN' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{selectedMsg.status}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)]">
                      <div className="text-xs text-[var(--text-primary)]">{selectedMsg.message}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono mt-2">{selectedMsg.createdAt}</div>
                    </div>

                    {selectedMsg.reply && (
                      <div className="p-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                        <div className="text-[11px] text-[var(--accent-primary)] font-bold mb-1">Reply ({selectedMsg.repliedBy})</div>
                        <div className="text-xs text-[var(--text-muted)]">{selectedMsg.reply}</div>
                      </div>
                    )}

                    {selectedMsg.status === 'OPEN' && (
                      <div className="border-t border-[var(--border-subtle)] pt-4">
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply…"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-white/30 resize-none focus:outline-none focus:border-[var(--accent-primary)]/50" rows={3} />
                        <button type="button" onClick={handleReply} disabled={!replyText.trim() || sending}
                          className="mt-2 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                          <Send className="w-3.5 h-3.5" />{sending ? t('cmd.support.sending') : t('cmd.support.sendReply')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                    <MessageSquare className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                    <div className="text-sm text-[var(--text-muted)]">{t('cmd.support.selectMessage')}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
