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
      setFlags((prev: any) => prev); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Flag className="w-4 h-4 text-[var(--accent-secondary)]" />
          {t('cmd.flags.title')}
        </h3>
        <div className="flex items-center gap-2">
          {saving && <span className="text-[11px] text-[var(--text-muted)]">Saving…</span>}
          <button type="button" onClick={() => fetchFlags()}
            className="p-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">{t('cmd.flags.loading')}</div>
      ) : !flags ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <Flag className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.flags.noFlags')}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(flags).map(([key, value]) => {
            const isBoolean = typeof value === 'boolean';
            const isString = typeof value === 'string';
            return (
              <div key={key} className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)]">{key}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {isBoolean ? (value ? 'Enabled' : 'Disabled') : `Value: ${String(value)}`}
                  </div>
                </div>
                {isBoolean ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(key, !value)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      value ? 'bg-[var(--accent-primary)]' : 'bg-[var(--btn-util-bg)]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-[var(--surface-card)] transition-transform ${
                      value ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                ) : (
                  <select
                    value={String(value)}
                    onChange={e => handleToggle(key, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] cursor-pointer focus:outline-none"
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
