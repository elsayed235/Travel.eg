import React, { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle2, User, Clock, Shield, RefreshCw, Download, Filter } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Pagination, usePagination } from './Pagination';

export default function AuditCenter() {
  const { language } = useLanguage();
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
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/60" />
          {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
          <span className="text-[10px] text-white/30 font-mono">({filtered.length}/{events.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />Export
          </button>
          <button type="button" onClick={() => fetchEvents()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          placeholder="Filter action…" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50 w-40" />
        <input type="text" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
          placeholder="Filter entity…" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50 w-40" />
        <input type="text" value={actorFilter} onChange={e => setActorFilter(e.target.value)}
          placeholder="Filter actor…" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 placeholder-white/30 focus:outline-none focus:border-[#20A89A]/50 w-40" />
        {(actionFilter || entityFilter || actorFilter) && (
          <button type="button" onClick={() => { setActionFilter(''); setEntityFilter(''); setActorFilter(''); }}
            className="px-2 py-1 rounded-lg bg-white/5 text-white/40 text-[10px] cursor-pointer">Clear</button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">Loading audit events…</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
          <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <div className="text-sm font-bold text-white/50">No audit events{(actionFilter || entityFilter || actorFilter) ? ' matching filters' : ''}</div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#062C35] border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-white/5 text-white/50 uppercase tracking-wider border-b border-white/8">
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
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}>
                      <td className="py-2.5 px-3 text-white/40">{event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-white/70">{event.actor || '—'}</div>
                        <div className="text-white/30 text-[9px]">{event.actorRole || ''}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/70 text-[9px] font-bold">{event.action || '—'}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#52C4B7]">{event.entityType || '—'} · {event.entityId || '—'}</td>
                      <td className="py-2.5 px-3 text-white/40 max-w-[200px] truncate">{event.payload ? JSON.stringify(event.payload).substring(0, 60) : '—'}</td>
                    </tr>
                    {expandedId === event.id && (
                      <tr>
                        <td colSpan={5} className="px-3 pb-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] space-y-1">
                            <div><span className="text-white/40">ID:</span> <span className="text-white/70">{event.id}</span></div>
                            <div><span className="text-white/40">Signature:</span> <span className="text-white/70">{event.signature || '—'}</span></div>
                            {event.payload && <div><span className="text-white/40">Payload:</span> <pre className="text-white/70 whitespace-pre-wrap mt-1">{JSON.stringify(event.payload, null, 2)}</pre></div>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 border-t border-white/5">
            <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
