import React, { useState, useEffect, useCallback } from 'react';
import { Flag, CheckCircle2, RefreshCw, Sliders } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function FeatureFlagsView() {
  const { language, t } = useLanguage();
  const [flags, setFlags] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFlags = useCallback(async () => {
    try {
      const data = await api.getDayGiBetaExperiments();
      setFlags(data?.flags || data?.experimentFlags || data);
    } catch {
      setFlags(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  const handleToggle = async (key: string, value: any) => {
    if (!flags) return;
    const updated = { ...flags, [key]: value };
    setFlags(updated);
    setSaving(true);
    try {
      await api.updateDayGiBetaExperiments(updated);
    } catch {
      setFlags(flags); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <Flag className="w-4 h-4 text-[#E7A83B]" />
          {t('cmd.flags.title')}
        </h3>
        <div className="flex items-center gap-2">
          {saving && <span className="text-[10px] text-white/40">Saving…</span>}
          <button type="button" onClick={() => fetchFlags()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">{t('cmd.flags.loading')}</div>
      ) : !flags ? (
        <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
          <Flag className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <div className="text-sm font-bold text-white/50">No feature flags available</div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(flags).map(([key, value]) => {
            const isBoolean = typeof value === 'boolean';
            const isString = typeof value === 'string';
            return (
              <div key={key} className="p-4 rounded-xl bg-[#062C35] border border-white/8 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F7F3EA]">{key}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {isBoolean ? (value ? 'Enabled' : 'Disabled') : `Value: ${String(value)}`}
                  </div>
                </div>
                {isBoolean ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(key, !value)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      value ? 'bg-[#20A89A]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      value ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                ) : (
                  <select
                    value={String(value)}
                    onChange={e => handleToggle(key, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 cursor-pointer focus:outline-none"
                  >
                    {['BALANCED', 'AGGRESSIVE', 'CONSERVATIVE', 'CONTEXT_AWARE', 'RANDOM', 'ON_DEMAND', 'ALWAYS',
                      'RICH_VERTICAL', 'COMPACT', 'MODAL_EXPLICIT', 'INLINE'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
