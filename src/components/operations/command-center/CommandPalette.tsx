import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plane, Users, MessageSquare, DollarSign, Globe, X, ArrowRight, FileText, Flag, HeartPulse, AlertTriangle, Brain } from 'lucide-react';
import { api } from '../../../services/api';
import type { SectionId } from './CommandCenterShell';

interface SearchResult {
  id: string;
  type: 'trip' | 'supplier' | 'support' | 'section' | 'ledger';
  title: string;
  subtitle?: string;
  section?: SectionId;
}

const SECTION_ITEMS: SearchResult[] = [
  { id: 'sec-overview', type: 'section', title: 'Overview', section: 'overview' },
  { id: 'sec-trips', type: 'section', title: 'Live Trips', section: 'trips' },
  { id: 'sec-exceptions', type: 'section', title: 'Exceptions', section: 'exceptions' },
  { id: 'sec-commerce', type: 'section', title: 'Commerce', section: 'commerce' },
  { id: 'sec-suppliers', type: 'section', title: 'Suppliers', section: 'suppliers' },
  { id: 'sec-intelligence', type: 'section', title: 'Intelligence', section: 'intelligence' },
  { id: 'sec-knowledge', type: 'section', title: 'Knowledge', section: 'knowledge' },
  { id: 'sec-support', type: 'section', title: 'Support', section: 'support' },
  { id: 'sec-audit', type: 'section', title: 'Audit Log', section: 'audit' },
  { id: 'sec-flags', type: 'section', title: 'Feature Flags', section: 'flags' },
  { id: 'sec-health', type: 'section', title: 'System Health', section: 'health' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults(SECTION_ITEMS);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(SECTION_ITEMS);
      return;
    }

    setLoading(true);
    const lower = q.toLowerCase();
    const matched: SearchResult[] = [];

    // Section matches
    SECTION_ITEMS.forEach(item => {
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

    setResults(matched.length > 0 ? matched : [{ id: 'no-results', type: 'section', title: 'No results found', section: 'overview' }]);
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
      <div className="relative w-full max-w-lg mx-4 bg-[#062C35] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <Search className="w-4 h-4 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search trips, suppliers, sections…"
            className="flex-1 bg-transparent text-sm text-[#F7F3EA] placeholder-white/30 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setResults(SECTION_ITEMS); }}
              className="text-white/30 hover:text-white/60 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {loading ? (
            <div className="py-6 text-center text-xs text-white/40">Searching…</div>
          ) : results.length === 0 ? (
            <div className="py-6 text-center text-xs text-white/40">No results</div>
          ) : (
            results.map((result, i) => {
              const Icon = TYPE_ICONS[result.type] || ArrowRight;
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    i === selectedIndex ? 'bg-[#20A89A]/15' : 'hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F7F3EA] truncate">{result.title}</div>
                    {result.subtitle && <div className="text-[10px] text-white/40 truncate">{result.subtitle}</div>}
                  </div>
                  {result.section && (
                    <span className="text-[9px] text-white/20 font-mono ml-auto flex-shrink-0">→</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/8 flex items-center gap-4 text-[9px] text-white/30">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
