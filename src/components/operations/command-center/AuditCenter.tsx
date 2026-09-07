import React, { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle2, User, Clock, Shield, RefreshCw, Download, Filter } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Pagination, usePagination } from './Pagination';

export default function AuditCenter() {
  const { language, t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.getAuditEvents(200);
      setEvents(data?.events || data?.auditEvents || []);
    } catch { setEvents([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEvents(); const i = setInterval(fetchEvents, 30_000); return () => clearInterval(i); }, [fetchEvents]);

  const filtered = events.filter(e => {
    if (actionFilter && !e.action?.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (entityFilter && !e.entityType?.toLowerCase().includes(entityFilter.toLowerCase())) return false;
    if (actorFilter && !e.actor?.toLowerCase().includes(actorFilter.toLowerCase())) return false;
    return true;
  });

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } = usePagination(filtered, 50);

  const uniqueActions = [...new Set(events.map(e => e.action).filter(Boolean))].slice(0, 20);
  const uniqueEntities = [...new Set(events.map(e => e.entityType).filter(Boolean))].slice(0, 20);

  const exportCSV = () => {
    const headers = ['Time', 'Actor', 'Actor Role', 'Action', 'Entity Type', 'Entity ID', 'Payload'];
    const rows = filtered.map(e => [
      e.timestamp || '',
      e.actor || '',
      e.actorRole || '',
      e.action || '',
      e.entityType || '',
      e.entityId || '',
      JSON.stringify(e.payload || {}),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--text-muted)]" />
          {t('cmd.audit.title')}
          <span className="text-[11px] text-[var(--text-muted)] font-mono">({filtered.length}/{events.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCSV} className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-medium flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />Export
          </button>
          <button type="button" onClick={() => fetchEvents()} className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          aria-label="Filter by action"
          placeholder="Filter action…" className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50 w-40" />
        <input type="text" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
          aria-label="Filter by entity"
          placeholder="Filter entity…" className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50 w-40" />
        <input type="text" value={actorFilter} onChange={e => setActorFilter(e.target.value)}
          aria-label="Filter by actor"
          placeholder="Filter actor…" className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]/50 w-40" />
        {(actionFilter || entityFilter || actorFilter) && (
          <button type="button" onClick={() => { setActionFilter(''); setEntityFilter(''); setActorFilter(''); }}
            className="px-2 py-1 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-[11px] cursor-pointer">Clear</button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">{t('cmd.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm font-bold text-[var(--text-muted)]">{(actionFilter || entityFilter || actorFilter) ? t('cmd.audit.noEventsMatching') : t('cmd.audit.noEvents')}</div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedItems.map((event: any) => (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-[var(--btn-util-bg)] transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}>
                      <td className="py-2.5 px-3 text-[var(--text-muted)]">{event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-[var(--text-muted)]">{event.actor || '—'}</div>
                        <div className="text-[var(--text-muted)] text-[10px]">{event.actorRole || ''}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-[10px] font-bold">{event.action || '—'}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--accent-primary)]">{event.entityType || '—'} · {event.entityId || '—'}</td>
                      <td className="py-2.5 px-3 text-[var(--text-muted)] max-w-[200px] truncate">{event.payload ? JSON.stringify(event.payload).substring(0, 60) : '—'}</td>
                    </tr>
                    {expandedId === event.id && (
                      <tr>
                        <td colSpan={5} className="px-3 pb-3">
                          <div className="p-3 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-[11px] space-y-1">
                            <div><span className="text-[var(--text-muted)]">ID:</span> <span className="text-[var(--text-muted)]">{event.id}</span></div>
                            <div><span className="text-[var(--text-muted)]">Signature:</span> <span className="text-[var(--text-muted)]">{event.signature || '—'}</span></div>
                            {event.payload && <div><span className="text-[var(--text-muted)]">Payload:</span> <pre className="text-[var(--text-muted)] whitespace-pre-wrap mt-1">{JSON.stringify(event.payload, null, 2)}</pre></div>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
            <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
