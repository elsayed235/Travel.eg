import React, { useState, useEffect } from 'react';
import { GitMerge, UserCheck, RefreshCw, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

interface ReviewQueueItem { id: string; type: string; title: string; description?: string; status: string; severity?: string; createdAt?: string; }

export const EntityResolutionView: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [conflicts, setConflicts] = useState<Array<{ id: string; entityA: string; entityB: string; status: string; severity?: string }>>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      api.getAdminConflicts(controller.signal).catch(() => ({ conflicts: [], openCount: 0 })),
      api.getAdminReviewQueue(controller.signal).catch(() => ({ queue: [] })),
    ]).then(([c, r]) => {
      if (!controller.signal.aborted) {
        setConflicts((c.conflicts as Array<{ id: string; entityA: string; entityB: string; status: string; severity?: string }>) || []);
        setOpenCount(c.openCount || 0);
        setReviewQueue((r.queue as ReviewQueueItem[]) || []);
        setLoading(false);
      }
    });
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-[#20A89A]" />
      </div>
    );
  }

  const statusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': case 'APPROVE': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'REJECTED': case 'REJECT': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Open Conflicts */}
      <div className="space-y-3">
        <h3 className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
          <GitMerge className="w-4 h-4 text-[#F4C36C]" />
          {language === 'ar' ? 'تعارضات المعرفة' : 'Knowledge Conflicts'} ({openCount} open)
        </h3>
        {conflicts.length === 0 ? (
          <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>
            {language === 'ar' ? 'لا توجد تعارضات ✓' : 'No conflicts ✓'}
          </p>
        ) : (
          <div className="space-y-2">
            {conflicts.slice(0, 20).map((c) => (
              <div key={c.id} className={`p-3 rounded-2xl border text-xs ${isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                    {c.entityA} ↔ {c.entityB}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'OPEN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>{c.status}</span>
                </div>
                {c.severity && (
                  <span className={`text-[10px] ${isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/50'}`}>Severity: {c.severity}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Queue */}
      <div className="space-y-3">
        <h3 className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
          <UserCheck className="w-4 h-4 text-[#52C4B7]" />
          {language === 'ar' ? 'قائمة المراجعة' : 'Review Queue'} ({reviewQueue.length})
        </h3>
        {reviewQueue.length === 0 ? (
          <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>
            {language === 'ar' ? 'لا توجد عناصر للمراجعة ✓' : 'No items pending review ✓'}
          </p>
        ) : (
          <div className="space-y-2">
            {reviewQueue.map((item) => (
              <div key={item.id} className={`p-3 rounded-2xl border text-xs ${isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    {statusIcon(item.status)}
                    <span className={`text-[10px] ${isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/50'}`}>{item.status}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-[#13312B] text-[#D2E3DE]/60 border-white/5' : 'bg-stone-50 text-[#4A635D]/60 border-[#122420]/10'}`}>
                  {item.type}
                </span>
                {item.description && <p className={`mt-1 ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
