import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Database, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

interface DkosHealthData {
  totalAreas?: number;
  totalPlaces?: number;
  totalActivities?: number;
  totalDiningVenues?: number;
  totalTemporalFacts?: number;
  totalEvidenceNodes?: number;
  totalConflictSets?: number;
  openConflicts?: number;
  searchLogsCount?: number;
}

export const DkosHealthView: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [health, setHealth] = useState<DkosHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.getAdminDkosHealth(controller.signal)
      .then((data) => { setHealth(data.health as DkosHealthData); setLoading(false); })
      .catch((err) => { if (!controller.signal.aborted) { setError(err?.message || 'Failed to load'); setLoading(false); } });
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-[#20A89A]" />
        <span className="ml-2 text-sm text-[#D2E3DE]/70">{language === 'ar' ? 'جاري تحميل بيانات الصحة...' : 'Loading health data...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  if (!health) return null;

  const statCards = [
    { icon: Database, label: 'Areas', value: health.totalAreas, color: 'text-[#20A89A]' },
    { icon: MapPin, label: 'Places', value: health.totalPlaces, color: 'text-[#F4C36C]' },
    { icon: Activity, label: 'Activities', value: health.totalActivities, color: 'text-[#52C4B7]' },
    { icon: TrendingUp, label: 'Temporal Facts', value: health.totalTemporalFacts, color: 'text-[#EA8E75]' },
    { icon: AlertTriangle, label: 'Open Conflicts', value: health.openConflicts, color: 'text-rose-400' },
    { icon: CheckCircle2, label: 'Evidence Nodes', value: health.totalEvidenceNodes, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className={`text-xs font-bold ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>{card.label}</span>
            </div>
            <span className={`text-2xl font-black ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{card.value ?? '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
