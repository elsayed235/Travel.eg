import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plane, Users, MessageSquare, DollarSign, Globe, X, ArrowRight, FileText, Flag, HeartPulse, AlertTriangle, Brain } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { SectionId } from './CommandCenterShell';

interface SearchResult {
  id: string;
  type: 'trip' | 'supplier' | 'support' | 'section' | 'ledger';
  title: string;
  subtitle?: string;
  section?: SectionId;
}

// Section items are built dynamically in the component to support i18n

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const sectionItems: SearchResult[] = [
    { id: 'sec-overview', type: 'section', title: t('cmd.nav.overview'), section: 'overview' },
    { id: 'sec-trips', type: 'section', title: t('cmd.nav.trips'), section: 'trips' },
    { id: 'sec-transfers', type: 'section', title: t('cmd.nav.transfers'), section: 'transfers' },
    { id: 'sec-exceptions', type: 'section', title: t('cmd.nav.exceptions'), section: 'exceptions' },
    { id: 'sec-commerce', type: 'section', title: t('cmd.nav.commerce'), section: 'commerce' },
    { id: 'sec-suppliers', type: 'section', title: t('cmd.nav.suppliers'), section: 'suppliers' },
    { id: 'sec-intelligence', type: 'section', title: t('cmd.nav.intelligence'), section: 'intelligence' },
    { id: 'sec-opportunities', type: 'section', title: t('cmd.nav.opportunities'), section: 'opportunities' },
    { id: 'sec-knowledge', type: 'section', title: t('cmd.nav.knowledge'), section: 'knowledge' },
    { id: 'sec-support', type: 'section', title: t('cmd.nav.support'), section: 'support' },
    { id: 'sec-sms', type: 'section', title: t('cmd.nav.sms'), section: 'sms' },
    { id: 'sec-notifications', type: 'section', title: t('cmd.nav.notifications'), section: 'notifications' },
    { id: 'sec-audit', type: 'section', title: t('cmd.nav.audit'), section: 'audit' },
    { id: 'sec-flags', type: 'section', title: t('cmd.nav.flags'), section: 'flags' },
    { id: 'sec-jobs', type: 'section', title: t('cmd.nav.jobs'), section: 'jobs' },
    { id: 'sec-health', type: 'section', title: t('cmd.nav.health'), section: 'health' },
  ];

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults(sectionItems);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(sectionItems);
      return;
    }

    setLoading(true);
    const lower = q.toLowerCase();
    const matched: SearchResult[] = [];

    // Section matches
    sectionItems.forEach(item => {
      if (item.title.toLowerCase().includes(lower)) {
        matched.push(item);
      }
    });

    // Search backend
    try {
      const [suppliersData, supportData] = await Promise.allSettled([
        api.getSuppliers(),
        api.getSupportMessages(),
      ]);

      if (suppliersData.status === 'fulfilled') {
        (suppliersData.value as any)?.suppliers?.forEach((s: any) => {
          if (s.businessName?.toLowerCase().includes(lower) || s.id?.toLowerCase().includes(lower)) {
            matched.push({
              id: s.id, type: 'supplier', title: s.businessName,
              subtitle: `${s.category} · ${s.id}`,
            });
          }
        });
      }

      if (supportData.status === 'fulfilled') {
        (supportData.value as any)?.messages?.forEach((m: any) => {
          if (m.id?.toLowerCase().includes(lower) || m.message?.toLowerCase().includes(lower) || m.travelerName?.toLowerCase().includes(lower)) {
            matched.push({
              id: m.id, type: 'support', title: `Support: ${m.travelerName || m.id}`,
              subtitle: m.message?.substring(0, 60),
            });
          }
        });
      }
    } catch { /* search is best-effort */ }

    setResults(matched.length > 0 ? matched : [{ id: 'no-results', type: 'section', title: t('cmd.palette.noResults'), section: 'overview' }]);
    setSelectedIndex(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    if (result.section) {
      onNavigate(result.section);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const TYPE_ICONS: Record<string, React.ElementType> = {
    trip: Plane, supplier: Users, support: MessageSquare, section: ArrowRight, ledger: DollarSign,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('cmd.palette.search')}
            placeholder={t('cmd.palette.search')}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-white/30 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setResults(sectionItems); }}
              className="text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {loading ? (
            <div className="py-6 text-center text-xs text-[var(--text-muted)]">Searching…</div>
          ) : results.length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--text-muted)]">{t('cmd.palette.noResults')}</div>
          ) : (
            results.map((result, i) => {
              const Icon = TYPE_ICONS[result.type] || ArrowRight;
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    i === selectedIndex ? 'bg-[var(--accent-primary)]/15' : 'hover:bg-[var(--btn-util-bg)]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">{result.title}</div>
                    {result.subtitle && <div className="text-[11px] text-[var(--text-muted)] truncate">{result.subtitle}</div>}
                  </div>
                  {result.section && (
                    <span className="text-[10px] text-[var(--text-muted)] font-mono ml-auto flex-shrink-0">→</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
          <span>↑↓ {t('cmd.palette.navigate')}</span>
          <span>↵ {t('cmd.palette.select')}</span>
          <span>Esc {t('cmd.palette.close')}</span>
        </div>
      </div>
    </div>
  );
}
