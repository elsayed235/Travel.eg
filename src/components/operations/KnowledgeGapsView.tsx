import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, FileText, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

interface KnowledgeGap { id: string; category: string; description: string; severity: string; area?: string; }
interface StaleFact { id: string; predicate: string; subject?: string; source?: string; lastVerifiedAt?: string; }

export const KnowledgeGapsView: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [staleFacts, setStaleFacts] = useState<StaleFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      api.getAdminKnowledgeGaps(controller.signal).catch(() => ({ gaps: [] })),
      api.getAdminStaleFacts(controller.signal).catch(() => ({ staleFacts: [] })),
    ]).then(([g, s]) => {
      if (!controller.signal.aborted) {
        setGaps((g.gaps as KnowledgeGap[]) || []);
        setStaleFacts((s.staleFacts as StaleFact[]) || []);
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

  const severityColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'high': case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'medium': case 'moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-[#20A89A]/20 text-[#52C4B7] border-[#20A89A]/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Gaps */}
      <div className="space-y-3">
        <h3 className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
          <AlertCircle className="w-4 h-4 text-amber-400" />
          {language === 'ar' ? 'فجوات المعرفة' : 'Knowledge Gaps'} ({gaps.length})
        </h3>
        {gaps.length === 0 ? (
          <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>
            {language === 'ar' ? 'لا توجد فجوات معرفية حالياً ✓' : 'No knowledge gaps detected ✓'}
          </p>
        ) : (
          <div className="space-y-2">
            {gaps.map((gap) => (
              <div key={gap.id} className={`p-3 rounded-2xl border text-xs ${isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{gap.category}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${severityColor(gap.severity)}`}>{gap.severity}</span>
                </div>
                <p className={`${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>{gap.description}</p>
                {gap.area && <span className={`mt-1 inline-block text-[10px] ${isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/50'}`}>Area: {gap.area}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stale Facts */}
      <div className="space-y-3">
        <h3 className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
          <Clock className="w-4 h-4 text-[#EA8E75]" />
          {language === 'ar' ? 'حقائق قديمة' : 'Stale Facts'} ({staleFacts.length})
        </h3>
        {staleFacts.length === 0 ? (
          <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>
            {language === 'ar' ? 'جميع الحقائق حديثة التحقق ✓' : 'All facts are freshly verified ✓'}
          </p>
        ) : (
          <div className="space-y-2">
            {staleFacts.slice(0, 20).map((fact) => (
              <div key={fact.id} className={`p-3 rounded-2xl border text-xs ${isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{fact.predicate}</span>
                  {fact.lastVerifiedAt && (
                    <span className={`text-[10px] ${isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/50'}`}>
                      Last verified: {new Date(fact.lastVerifiedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {fact.source && <p className={`mt-0.5 ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]/60'}`}>Source: {fact.source}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
