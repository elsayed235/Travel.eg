import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Image, Layout, Globe, Search, Plus, Edit3, Trash2,
  Eye, EyeOff, CheckCircle2, Clock, AlertCircle, ChevronRight,
  ChevronDown, ChevronUp, GripVertical, Save, X, BookOpen, Palette, Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { readJson } from '../../../services/apiError';
import { CmsPageEditor } from './CmsPageEditor';
import { CmsDiffViewer } from './CmsDiffViewer';
import { CMS_TEMPLATES } from '../../../data/cmsTemplates';
import { ClickableCard } from '../../common/ClickableCard';

/**
 * CMS Content Management Dashboard
 *
 * Provides administrators with a UI to manage:
 * - Homepage hero section
 * - Trip programmes
 * - Gallery photos
 * - Curated stories
 * - Explore categories
 * - Navigation menus
 * - SEO metadata
 */

type CmsTab = 'overview' | 'pages' | 'media' | 'homepage' | 'navigation' | 'revisions';

interface CmsPage {
  id: string;
  slug: string;
  type: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  hero_image_url: string;
  status: string;
  sort_order: number;
  featured: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  version: number;
}

interface CmsHomepageSection {
  id: string;
  section_key: string;
  title_en: string;
  title_ar: string;
  visible: number;
  sort_order: number;
  config: Record<string, any>;
  updated_at: string;
}

const API_BASE = '/api/admin/content';

async function cmsFetch(path: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(err.message || 'CMS API error');
  }
  return readJson(response, `CMS API call to ${path} failed.`);
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab({ onNavigate }: { onNavigate: (tab: CmsTab) => void }) {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState({ pages: 0, published: 0, draft: 0, media: 0, revisions: 0 });

  useEffect(() => {
    Promise.all([
      cmsFetch('/pages'),
      cmsFetch('/media'),
      cmsFetch('/revisions?limit=1'),
    ]).then(([pagesData, mediaData, revData]) => {
      const pages = pagesData.pages || [];
      setStats({
        pages: pages.length,
        published: pages.filter((p: CmsPage) => p.status === 'published').length,
        draft: pages.filter((p: CmsPage) => p.status === 'draft').length,
        media: (mediaData.media || []).length,
        revisions: revData.count || 0,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: t('cmd.totalPages'), value: stats.pages, icon: FileText, color: '#20A89A' },
    { label: t('cmd.published'), value: stats.published, icon: CheckCircle2, color: '#22C55E' },
    { label: t('cmd.drafts'), value: stats.draft, icon: Clock, color: '#F59E0B' },
    { label: t('cmd.media'), value: stats.media, icon: Image, color: '#8B5CF6' },
  ];

  // Content freshness analytics
  const [freshness, setFreshness] = useState<{ stalePages: number; recentlyUpdated: number; unusedMedia: number }>({ stalePages: 0, recentlyUpdated: 0, unusedMedia: 0 });

  useEffect(() => {
    Promise.all([
      cmsFetch('/pages'),
      cmsFetch('/media'),
    ]).then(([pagesData, mediaData]) => {
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const pages = pagesData.pages || [];
      const media = mediaData.media || [];
      setFreshness({
        stalePages: pages.filter((p: CmsPage) => p.status === 'published' && (now - new Date(p.updated_at).getTime()) > thirtyDays).length,
        recentlyUpdated: pages.filter((p: CmsPage) => (now - new Date(p.updated_at).getTime()) < sevenDays).length,
        unusedMedia: media.filter((m: any) => (m.usage_count || 0) === 0).length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: card.color }} />
                <span className="text-xs text-[var(--text-muted)]">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Content Freshness */}
      <div className="p-4 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] space-y-3">
        <h3 className="text-xs font-bold text-white">
          {t('cmd.contentAnalytics')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <div className="text-[11px] text-amber-400/60 font-bold">{t('cmd.staleContent30Days')}</div>
              <div className="text-sm font-bold text-amber-300">{freshness.stalePages}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <div>
              <div className="text-[11px] text-green-400/60 font-bold">{t('cmd.recentlyUpdated7Days')}</div>
              <div className="text-sm font-bold text-green-300">{freshness.recentlyUpdated}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <div>
              <div className="text-[11px] text-red-400/60 font-bold">{t('cmd.unusedMedia')}</div>
              <div className="text-sm font-bold text-red-300">{freshness.unusedMedia}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] space-y-4">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.quickAccess')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { tab: 'homepage' as CmsTab, label: t('cmd.homepageContent'), icon: Layout },
            { tab: 'pages' as CmsTab, label: t('cmd.managePages'), icon: FileText },
            { tab: 'media' as CmsTab, label: t('cmd.mediaLibrary'), icon: Image },
            { tab: 'navigation' as CmsTab, label: t('cmd.navigation'), icon: LinkIcon },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onNavigate(item.tab)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{item.label}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Pages Tab
// ============================================================================

function PagesTab({ onPageSelect }: { onPageSelect: (id: string) => void }) {
  const { language, t } = useLanguage();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cmsFetch('/pages');
      setPages(data.pages || []);
    } catch (err) {
      console.error('Failed to load pages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  const filtered = filter === 'all' ? pages : pages.filter(p => p.type === filter);
  const typeColors: Record<string, string> = {
    trip_program: '#20A89A',
    gallery: '#8B5CF6',
    curated_story: '#F59E0B',
    explore_category: '#E7A83B',
    static_page: '#3B82F6',
  };

  const typeLabels: Record<string, { en: string; ar: string }> = {
    trip_program: { en: 'Trip Program', ar: 'برنامج رحلة' },
    gallery: { en: 'Gallery Photo', ar: 'صورة معرض' },
    curated_story: { en: 'Curated Story', ar: 'قصة منتقاة' },
    explore_category: { en: 'Explore Category', ar: 'تصنيف استكشاف' },
    static_page: { en: 'Static Page', ar: 'صفحة ثابتة' },
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-500/20 text-green-300 border-green-500/30',
      draft: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      archived: 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${colors[status] || colors.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.contentPages')}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{pages.length} {t('cmd.pages')}</span>
          <button
            type="button"
            onClick={() => setShowTemplateSelector(true)}
            disabled={creating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[11px] font-bold hover:bg-[var(--accent-primary)]/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />
            {t('cmd.newPage')}
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => !creating && setShowTemplateSelector(false)}>
          <div
            className="w-full max-w-2xl rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-white">
                {t('cmd.chooseATemplate')}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {t('cmd.pickATemplateTo')}
              </p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {CMS_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  type="button"
                  disabled={creating}
                  onClick={async () => {
                    try {
                      setCreating(true);
                      const data = await cmsFetch('/pages', {
                        method: 'POST',
                        body: JSON.stringify({
                          slug: `new-page-${Date.now()}`,
                          type: 'static_page',
                          title_en: template.name,
                          title_ar: template.nameAr,
                          description_en: template.description,
                          description_ar: template.descriptionAr,
                          status: 'draft',
                        }),
                      });
                      // Add template blocks
                      for (let i = 0; i < template.blocks.length; i++) {
                        const block = template.blocks[i];
                        await cmsFetch('/blocks', {
                          method: 'POST',
                          body: JSON.stringify({
                            page_id: data.page.id,
                            type: block.type,
                            title_en: block.title_en,
                            title_ar: block.title_ar,
                            body_en: block.body_en,
                            body_ar: block.body_ar,
                            config: block.config || {},
                            sort_order: i,
                          }),
                        });
                      }
                      setShowTemplateSelector(false);
                      onPageSelect(data.page.id);
                    } catch (err: any) {
                      alert(err.message);
                      setCreating(false);
                    }
                  }}
                  className="p-4 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 text-left transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="text-xs font-bold text-white mb-1">
                    {language === 'ar' ? template.nameAr : template.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {language === 'ar' ? template.descriptionAr : template.description}
                  </div>
                  <div className="text-[10px] text-[var(--accent-primary)]/60 mt-2">
                    {template.blocks.length} {t('cmd.prebuiltBlocks')}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-[var(--border-subtle)] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateSelector(false)}
                disabled={creating}
                className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer disabled:opacity-50"
              >
                {t('intel.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: t('cmd.all') },
          { key: 'trip_program', label: t('cmd.programs') },
          { key: 'gallery', label: t('cmd.gallery') },
          { key: 'curated_story', label: t('cmd.stories') },
          { key: 'explore_category', label: t('cmd.categories') },
          { key: 'static_page', label: t('cmd.pages-2') },
        ].map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === f.key
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
          <span className="text-xs text-red-300">{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="px-2 py-1 rounded bg-[var(--btn-util-bg)] text-red-200 text-[11px] font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer"
          >
            {t('cmd.dismiss')}
          </button>
        </div>
      )}

      {/* Pages list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
          {t('cmd.noPagesFound')}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(page => (
            <div
              key={page.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)] transition-all"
            >
              {page.hero_image_url && (
                <img
                  src={page.hero_image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${typeColors[page.type] || '#666'}20`, color: typeColors[page.type] || '#999' }}
                  >
                    {typeLabels[page.type]?.[language === 'ar' ? 'ar' : 'en'] || page.type}
                  </span>
                  {statusBadge(page.status)}
                  {page.featured ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/30">
                      ★
                    </span>
                  ) : null}
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {language === 'ar' ? page.title_ar : page.title_en}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">
                  /{page.slug} · v{page.version} · {new Date(page.updated_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onPageSelect(page.id)}
                  className="p-1.5 rounded-lg hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] transition-all cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {page.status === 'draft' ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setActionError(null);
                          await cmsFetch(`/pages/${page.id}/publish`, { method: 'POST' });
                        } catch (err: any) {
                          setActionError(err?.message || 'Publish failed');
                        }
                        loadPages();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[11px] font-bold hover:bg-[var(--accent-primary)]/30 transition-all cursor-pointer"
                    >
                      {t('cmd.publish')}
                    </button>
                    <input
                      type="datetime-local"
                      onChange={async (e) => {
                        if (e.target.value) {
                          try {
                            setActionError(null);
                            const scheduledAt = new Date(e.target.value).toISOString();
                            await cmsFetch(`/pages/${page.id}/schedule`, {
                              method: 'POST',
                              body: JSON.stringify({ scheduledAt }),
                            });
                          } catch (err: any) {
                            setActionError(err?.message || 'Schedule failed');
                          }
                          loadPages();
                        }
                      }}
                      className="w-24 px-1 py-0.5 rounded text-[10px] bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] cursor-pointer"
                      title={t('cmd.schedulePublish')}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Homepage Tab — Section Editor
// ============================================================================

function HomepageTab() {
  const { language, t } = useLanguage();
  const [sections, setSections] = useState<CmsHomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<CmsHomepageSection | null>(null);
  const [editForm, setEditForm] = useState<Partial<CmsHomepageSection>>({});
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    cmsFetch('/homepage').then(d => {
      setSections(d.sections || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUpdateSection = async (sectionKey: string, data: Partial<CmsHomepageSection>) => {
    try {
      setSaving(true);
      const result = await cmsFetch(`/homepage/${sectionKey}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      setSections(prev => prev.map(s => s.section_key === sectionKey ? result.section : s));
      setEditingSection(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const persistOrder = async (newSections: CmsHomepageSection[]) => {
    try {
      for (const s of newSections) {
        await cmsFetch(`/homepage/${s.section_key}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort_order: s.sort_order }),
        });
      }
    } catch (err: any) {
      console.error('Reorder failed:', err);
    }
  };

  const handleReorder = async (sectionKey: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.section_key === sectionKey);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const newSections = [...sections];
    [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
    for (let i = 0; i < newSections.length; i++) {
      newSections[i] = { ...newSections[i], sort_order: i };
    }
    setSections(newSections);
    persistOrder(newSections);
  };

  // Drag-and-drop handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(dragIdx, 1);
    newSections.splice(idx, 0, moved);
    for (let i = 0; i < newSections.length; i++) {
      newSections[i] = { ...newSections[i], sort_order: i };
    }
    setSections(newSections);
    setDragIdx(null);
    setDragOverIdx(null);
    persistOrder(newSections);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.homepageSections')}
        </h3>
        <span className="text-[11px] text-[var(--text-muted)]">
          {t('cmd.dragToReorder')}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
          {t('cmd.noHomepageSectionsConfigured')}
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`rounded-xl bg-[var(--btn-util-bg)] border transition-all ${
                dragIdx === idx
                  ? 'opacity-50 border-[var(--accent-primary)]/50'
                  : dragOverIdx === idx
                    ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 cursor-grab" />
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${section.visible ? 'bg-[var(--accent-primary)]' : 'bg-[var(--btn-util-bg)]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">
                    {language === 'ar' ? section.title_ar : section.title_en}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {section.section_key} · {section.visible ? (t('cmd.visible')) : (t('cmd.hidden'))}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {idx > 0 && (
                    <button type="button" onClick={() => handleReorder(section.section_key, 'up')} aria-label="Move section up" className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  )}
                  {idx < sections.length - 1 && (
                    <button type="button" onClick={() => handleReorder(section.section_key, 'down')} aria-label="Move section down" className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleUpdateSection(section.section_key, { visible: section.visible ? 0 : 1 })}
                    className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer"
                  >
                    {section.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingSection(section); setEditForm(section); }}
                    className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Inline Edit */}
              {editingSection?.section_key === section.section_key && (
                <div className="px-3 pb-3 space-y-3 border-t border-[var(--border-subtle)] pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Title (EN)</span>
                      <input
                        type="text"
                        value={editForm.title_en || ''}
                        onChange={e => setEditForm({ ...editForm, title_en: e.target.value })}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Title (AR)</span>
                      <input
                        type="text"
                        value={editForm.title_ar || ''}
                        onChange={e => setEditForm({ ...editForm, title_ar: e.target.value })}
                        dir="rtl"
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Sort Order</span>
                      <input
                        type="number"
                        value={editForm.sort_order ?? 0}
                        onChange={e => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Config (JSON)</span>
                      <textarea
                        value={typeof editForm.config === 'object' ? JSON.stringify(editForm.config, null, 2) : (editForm.config || '{}')}
                        onChange={e => {
                          try {
                            setEditForm({ ...editForm, config: JSON.parse(e.target.value) });
                          } catch {}
                        }}
                        rows={3}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-[11px] text-white font-mono focus:border-[var(--accent-primary)]/50 focus:outline-none resize-y"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateSection(section.section_key, editForm)}
                      disabled={saving}
                      className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--surface-card)] text-xs font-bold hover:bg-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? '...' : (t('cmd.save'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer"
                    >
                      {t('intel.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Media Tab — Upload, Search, Edit, Replace
// ============================================================================

interface MediaAsset {
  id: string;
  filename: string;
  original_url: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  aspect_ratio: string;
  alt_en: string;
  alt_ar: string;
  caption_en: string;
  caption_ar: string;
  credit: string;
  category: string;
  tags: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

function MediaTab() {
  const { language, t } = useLanguage();
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MediaAsset>>({});
  const [saving, setSaving] = useState(false);

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cmsFetch('/media');
      setMedia(data.media || []);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const categories = [...new Set(media.map(m => m.category))];
  const filteredMedia = media.filter(m => {
    const matchesSearch = !searchQuery ||
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.alt_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMedia = async (data: Partial<MediaAsset>) => {
    try {
      setSaving(true);
      const result = await cmsFetch('/media', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setMedia(prev => [result.asset, ...prev]);
      setShowUpload(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMediaFile = async (data: { dataUrl: string; filename: string; alt_en?: string; alt_ar?: string; category?: string }) => {
    try {
      setSaving(true);
      const result = await cmsFetch('/media/upload', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setMedia(prev => [result.asset, ...prev]);
      setShowUpload(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMedia = async (id: string, data: Partial<MediaAsset>) => {
    try {
      setSaving(true);
      const result = await cmsFetch(`/media/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      setMedia(prev => prev.map(m => m.id === id ? result.asset : m));
      setSelectedAsset(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm(t('cmd.areYouSureYou'))) return;
    try {
      await cmsFetch(`/media/${id}`, { method: 'DELETE' });
      setMedia(prev => prev.filter(m => m.id !== id));
      setSelectedAsset(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.mediaLibrary')}
        </h3>
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[11px] font-bold hover:bg-[var(--accent-primary)]/30 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          {t('cmd.addMedia')}
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <MediaUploadForm
          onSave={handleAddMedia}
          onSaveFile={handleAddMediaFile}
          onCancel={() => setShowUpload(false)}
          saving={saving}
        />
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('cmd.searchMedia')}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {[{ key: 'all', label: 'All' }, ...categories.map(c => ({ key: c, label: c }))].map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilterCategory(cat.key)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                filterCategory === cat.key
                  ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                  : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
        <span>{filteredMedia.length} {t('cmd.of')} {media.length} {t('cmd.assets')}</span>
        <span>{formatFileSize(media.reduce((sum, m) => sum + m.file_size, 0))} {t('cmd.totalLower')}</span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm text-[var(--text-muted)]">
            {searchQuery || filterCategory !== 'all'
              ? (t('cmd.noMatchingAssets'))
              : (t('cmd.noMediaAssetsRegistered'))
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredMedia.map(asset => (
            <ClickableCard
              key={asset.id}
              onClick={() => { setSelectedAsset(asset); setEditForm(asset); }}
              className="rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] overflow-hidden hover:border-[var(--accent-primary)]/30 transition-all group"
            >
              {asset.original_url ? (
                <div className="relative">
                  <img src={asset.original_url} alt={asset.alt_en || ''} className="w-full h-32 object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-[var(--btn-util-bg)] flex items-center justify-center">
                  <Image className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
              )}
              <div className="p-2">
                <div className="text-[11px] font-semibold text-white truncate">{asset.filename || 'Untitled'}</div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <span>{asset.category}</span>
                  <span>{formatFileSize(asset.file_size)}</span>
                </div>
              </div>
            </ClickableCard>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedAsset && (
        <MediaEditModal
          asset={selectedAsset}
          form={editForm}
          onFormChange={setEditForm}
          onSave={() => handleUpdateMedia(selectedAsset.id, editForm)}
          onDelete={() => handleDeleteMedia(selectedAsset.id)}
          onClose={() => setSelectedAsset(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

// ============================================================================
// Media Upload Form
// ============================================================================

function MediaUploadForm({
  onSave,
  onSaveFile,
  onCancel,
  saving,
}: {
  onSave: (data: Partial<MediaAsset>) => void;
  onSaveFile: (data: { dataUrl: string; filename: string; alt_en?: string; alt_ar?: string; category?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [form, setForm] = useState({
    url: '',
    filename: '',
    alt_en: '',
    alt_ar: '',
    caption_en: '',
    caption_ar: '',
    category: 'general',
    credit: '',
    tags: '',
  });
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum: 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setForm({ ...form, filename: file.name, url: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSaveUrl = () => {
    onSave({
      original_url: form.url,
      filename: form.filename || form.url.split('/').pop() || 'upload',
      alt_en: form.alt_en,
      alt_ar: form.alt_ar,
      caption_en: form.caption_en,
      caption_ar: form.caption_ar,
      category: form.category,
      credit: form.credit,
      tags: form.tags,
      mime_type: form.url.includes('.png') ? 'image/png' : form.url.includes('.gif') ? 'image/gif' : 'image/jpeg',
    });
  };

  const handleSaveFileUpload = () => {
    if (!preview) return;
    onSaveFile({
      dataUrl: preview,
      filename: form.filename || 'upload',
      alt_en: form.alt_en,
      alt_ar: form.alt_ar,
      category: form.category,
    });
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--accent-primary)]/30 space-y-3">
      <h4 className="text-xs font-bold text-[var(--accent-primary)]">
        {t('cmd.addNewMedia')}
      </h4>

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
            mode === 'url'
              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
              : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
          }`}
        >
          {t('cmd.uRL')}
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
            mode === 'file'
              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
              : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
          }`}
        >
          {t('cmd.uploadFile')}
        </button>
      </div>

      {mode === 'url' ? (
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">URL *</span>
          <input
            type="url"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
      ) : (
        <ClickableCard
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('cms-file-input')?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragOver
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
              : preview
                ? 'border-[var(--accent-primary)]/30 bg-[var(--btn-util-bg)]'
                : 'border-[var(--border-subtle)] bg-[var(--btn-util-bg)] hover:border-[var(--accent-primary)]/50'
          }`}
        >
          <input
            id="cms-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          {preview ? (
            <img src={preview} alt="" className="max-h-32 mx-auto rounded-lg" />
          ) : (
            <>
              <Image className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <div className="text-xs text-[var(--text-muted)]">
                {t('cmd.dropImageHereOr')}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1">JPG, PNG, GIF, WebP • Max 10MB</div>
            </>
          )}
        </ClickableCard>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Filename</span>
          <input
            type="text"
            value={form.filename}
            onChange={e => setForm({ ...form, filename: e.target.value })}
            placeholder="blue-hole-dahab.jpg"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Category</span>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
          >
            {['general', 'destination', 'activity', 'gallery', 'hero', 'programme', 'story', 'ui'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Alt Text (EN)</span>
          <input
            type="text"
            value={form.alt_en}
            onChange={e => setForm({ ...form, alt_en: e.target.value })}
            placeholder="Blue Hole in Dahab, Sinai"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Alt Text (AR)</span>
          <input
            type="text"
            value={form.alt_ar}
            onChange={e => setForm({ ...form, alt_ar: e.target.value })}
            placeholder="البلو هول في دهب، سيناء"
            dir="rtl"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Caption (EN)</span>
          <input
            type="text"
            value={form.caption_en}
            onChange={e => setForm({ ...form, caption_en: e.target.value })}
            placeholder="Optional caption"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Credit</span>
          <input
            type="text"
            value={form.credit}
            onChange={e => setForm({ ...form, credit: e.target.value })}
            placeholder="Photographer name"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Tags (comma-separated)</span>
        <input
          type="text"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          placeholder="dahab, blue hole, diving, sinai"
          className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
        />
      </div>

      {mode === 'url' && form.url && (
        <img src={form.url} alt="" className="w-full h-32 object-cover rounded-lg" />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={mode === 'url' ? handleSaveUrl : handleSaveFileUpload}
          disabled={(mode === 'url' && !form.url) || (mode === 'file' && !preview) || saving}
          className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--surface-card)] text-xs font-bold hover:bg-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? '...' : (t('cmd.addMedia-2'))}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer"
        >
          {t('intel.cancel')}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Media Edit Modal
// ============================================================================

function MediaEditModal({
  asset,
  form,
  onFormChange,
  onSave,
  onDelete,
  onClose,
  saving,
}: {
  asset: MediaAsset;
  form: Partial<MediaAsset>;
  onFormChange: (f: Partial<MediaAsset>) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  const { language, t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-5 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {t('cmd.editMedia')}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview */}
        {form.original_url && (
          <img src={form.original_url} alt="" className="w-full h-48 object-cover rounded-xl" />
        )}

        {/* URL */}
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">URL</span>
          <input
            type="url"
            value={form.original_url || ''}
            onChange={e => onFormChange({ ...form, original_url: e.target.value })}
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Filename</span>
            <input
              type="text"
              value={form.filename || ''}
              onChange={e => onFormChange({ ...form, filename: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Category</span>
            <select
              value={form.category || 'general'}
              onChange={e => onFormChange({ ...form, category: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            >
              {['general', 'destination', 'activity', 'gallery', 'hero', 'programme', 'story', 'ui'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Alt Text (EN)</span>
            <input
              type="text"
              value={form.alt_en || ''}
              onChange={e => onFormChange({ ...form, alt_en: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Alt Text (AR)</span>
            <input
              type="text"
              value={form.alt_ar || ''}
              onChange={e => onFormChange({ ...form, alt_ar: e.target.value })}
              dir="rtl"
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Caption (EN)</span>
            <input
              type="text"
              value={form.caption_en || ''}
              onChange={e => onFormChange({ ...form, caption_en: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Caption (AR)</span>
            <input
              type="text"
              value={form.caption_ar || ''}
              onChange={e => onFormChange({ ...form, caption_ar: e.target.value })}
              dir="rtl"
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Credit</span>
            <input
              type="text"
              value={form.credit || ''}
              onChange={e => onFormChange({ ...form, credit: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Tags</span>
            <input
              type="text"
              value={form.tags || ''}
              onChange={e => onFormChange({ ...form, tags: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Metadata display */}
        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
          <span>ID: {asset.id}</span>
          <span>{asset.width}×{asset.height}px</span>
          <span>{asset.mime_type}</span>
          <span>Used: {asset.usage_count}x</span>
          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--surface-card)] text-xs font-bold hover:bg-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? '...' : (t('cmd.saveChanges'))}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all cursor-pointer"
          >
            {t('cmd.delete')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer ml-auto"
          >
            {t('intel.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Navigation Tab — Full CRUD Manager
// ============================================================================

interface NavItem {
  id: string;
  menu_key: string;
  item_order: number;
  label_en: string;
  label_ar: string;
  route: string;
  external_url: string;
  visible: number;
  open_in_new: number;
  icon: string;
  group_label_en: string;
  group_label_ar: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Revisions Tab — Content Change History
// ============================================================================

interface Revision {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  payload: Record<string, any>;
  created_at: string;
}

function RevisionsTab() {
  const { language, t } = useLanguage();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [diffEntity, setDiffEntity] = useState<{ entityId: string; entityType: string } | null>(null);

  useEffect(() => {
    cmsFetch('/revisions?limit=100').then(d => {
      setRevisions(d.revisions || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? revisions : revisions.filter(r => r.entity_type === filter);

  const actionColors: Record<string, string> = {
    create: 'bg-green-500/20 text-green-300',
    update: 'bg-blue-500/20 text-blue-300',
    publish: 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]',
    archive: 'bg-gray-500/20 text-gray-300',
    delete: 'bg-red-500/20 text-red-300',
    scheduled_publish: 'bg-purple-500/20 text-purple-300',
  };

  const entityLabels: Record<string, { en: string; ar: string }> = {
    page: { en: 'Page', ar: 'صفحة' },
    block: { en: 'Block', ar: 'كتلة' },
    media: { en: 'Media', ar: 'وسائط' },
    navigation: { en: 'Navigation', ar: 'تنقل' },
    seo: { en: 'SEO', ar: 'SEO' },
    homepage_section: { en: 'Homepage', ar: 'الرئيسية' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.changeHistory')}
        </h3>
        <span className="text-[11px] text-[var(--text-muted)]">{filtered.length} {t('cmd.entries')}</span>
      </div>

      {/* Filter */}
      <div className="flex gap-1 overflow-x-auto">
        {[{ key: 'all', label: 'All' }, { key: 'page', label: 'Pages' }, { key: 'block', label: 'Blocks' }, { key: 'media', label: 'Media' }, { key: 'navigation', label: 'Navigation' }, { key: 'homepage_section', label: 'Homepage' }].map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
              filter === f.key
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
          {t('cmd.noRevisionHistory')}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map(rev => (
            <div key={rev.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${actionColors[rev.action] || 'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'}`}>
                {rev.action}
              </span>
              <span className="text-[var(--text-muted)]">
                {entityLabels[rev.entity_type]?.[language === 'ar' ? 'ar' : 'en'] || rev.entity_type}
              </span>
              <span className="text-[var(--text-muted)] truncate flex-1">{rev.entity_id}</span>
              <span className="text-[var(--text-muted)] text-[11px]">
                {rev.actor_name || rev.actor_id || 'System'}
              </span>
              <span className="text-[var(--text-muted)] text-[11px]">
                {new Date(rev.created_at).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setDiffEntity({ entityId: rev.entity_id, entityType: rev.entity_type })}
                className="px-2 py-1 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 text-[10px] font-bold transition-all cursor-pointer"
              >
                {t('cmd.compare')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Diff Viewer Modal */}
      {diffEntity && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDiffEntity(null)}>
          <div
            className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] shadow-2xl p-4"
            onClick={e => e.stopPropagation()}
          >
            <CmsDiffViewer
              entityId={diffEntity.entityId}
              entityType={diffEntity.entityType}
              onClose={() => setDiffEntity(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NavigationTab() {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuKey, setMenuKey] = useState('footer');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<NavItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavItem>>({});
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cmsFetch(`/navigation/${menuKey}`);
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to load navigation:', err);
    } finally {
      setLoading(false);
    }
  }, [menuKey]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleAdd = async (data: Partial<NavItem>) => {
    try {
      setSaving(true);
      const result = await cmsFetch('/navigation', {
        method: 'POST',
        body: JSON.stringify({ ...data, menu_key: menuKey, item_order: items.length }),
      });
      setItems(prev => [...prev, result.item]);
      setShowAdd(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<NavItem>) => {
    try {
      setSaving(true);
      const result = await cmsFetch(`/navigation/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      setItems(prev => prev.map(i => i.id === id ? result.item : i));
      setEditItem(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('cmd.areYouSure'))) return;
    try {
      await cmsFetch(`/navigation/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const persistNavOrder = async (newItems: NavItem[]) => {
    try {
      for (const item of newItems) {
        await cmsFetch(`/navigation/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ item_order: item.item_order }),
        });
      }
    } catch (err: any) {
      console.error('Reorder failed:', err);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= items.length) return;

    const newItems = [...items];
    [newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]];
    for (let i = 0; i < newItems.length; i++) {
      newItems[i] = { ...newItems[i], item_order: i };
    }
    setItems(newItems);
    persistNavOrder(newItems);
  };

  // Drag-and-drop handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    for (let i = 0; i < newItems.length; i++) {
      newItems[i] = { ...newItems[i], item_order: i };
    }
    setItems(newItems);
    setDragIdx(null);
    setDragOverIdx(null);
    persistNavOrder(newItems);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const menuOptions = [
    { key: 'footer', label: t('cmd.footer') },
    { key: 'header', label: t('cmd.header') },
    { key: 'mobile', label: t('cmd.mobile') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {t('cmd.navigationManagement')}
        </h3>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[11px] font-bold hover:bg-[var(--accent-primary)]/30 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          {t('cmd.addItem')}
        </button>
      </div>

      {/* Menu selector */}
      <div className="flex gap-1">
        {menuOptions.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setMenuKey(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
              menuKey === opt.key
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--btn-util-bg)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <NavAddForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
      )}

      {/* Items List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
          {t('cmd.noNavigationItemsIn')}
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`rounded-xl bg-[var(--btn-util-bg)] border transition-all ${
                dragIdx === idx
                  ? 'opacity-50 border-[var(--accent-primary)]/50'
                  : dragOverIdx === idx
                    ? 'border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 cursor-grab" />
                <LinkIcon className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">
                    {language === 'ar' ? item.label_ar : item.label_en}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {item.route || item.external_url || '(no route)'}
                    {item.visible ? '' : ` · ${t('cmd.hidden-2')}`}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {idx > 0 && (
                    <button type="button" onClick={() => handleReorder(item.id, 'up')} aria-label="Move item up" className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  )}
                  {idx < items.length - 1 && (
                    <button type="button" onClick={() => handleReorder(item.id, 'down')} aria-label="Move item down" className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleUpdate(item.id, { visible: item.visible ? 0 : 1 })}
                    className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer"
                  >
                    {item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditItem(item); setEditForm(item); }}
                    className="p-1 rounded hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)] cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              {editItem?.id === item.id && (
                <div className="px-3 pb-3 space-y-3 border-t border-[var(--border-subtle)] pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Label (EN)</span>
                      <input
                        type="text"
                        value={editForm.label_en || ''}
                        onChange={e => setEditForm({ ...editForm, label_en: e.target.value })}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Label (AR)</span>
                      <input
                        type="text"
                        value={editForm.label_ar || ''}
                        onChange={e => setEditForm({ ...editForm, label_ar: e.target.value })}
                        dir="rtl"
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Internal Route</span>
                      <input
                        type="text"
                        value={editForm.route || ''}
                        onChange={e => setEditForm({ ...editForm, route: e.target.value })}
                        placeholder="/explore"
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">External URL</span>
                      <input
                        type="url"
                        value={editForm.external_url || ''}
                        onChange={e => setEditForm({ ...editForm, external_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id, editForm)}
                      disabled={saving}
                      className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--surface-card)] text-xs font-bold hover:bg-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? '...' : (t('cmd.save'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditItem(null)}
                      className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer"
                    >
                      {t('intel.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Navigation Add Form
// ============================================================================

function NavAddForm({
  onSave,
  onCancel,
  saving,
}: {
  onSave: (data: Partial<NavItem>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({
    label_en: '',
    label_ar: '',
    route: '',
    external_url: '',
    visible: 1,
    open_in_new: 0,
  });

  return (
    <div className="p-4 rounded-xl bg-[var(--btn-util-bg)] border border-[var(--accent-primary)]/30 space-y-3">
      <h4 className="text-xs font-bold text-[var(--accent-primary)]">
        {t('cmd.addNavigationItem')}
      </h4>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Label (EN) *</span>
          <input
            type="text"
            value={form.label_en}
            onChange={e => setForm({ ...form, label_en: e.target.value })}
            placeholder="Explore"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Label (AR) *</span>
          <input
            type="text"
            value={form.label_ar}
            onChange={e => setForm({ ...form, label_ar: e.target.value })}
            placeholder="اكتشف"
            dir="rtl"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Internal Route</span>
          <input
            type="text"
            value={form.route}
            onChange={e => setForm({ ...form, route: e.target.value })}
            placeholder="/explore"
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">External URL</span>
          <input
            type="url"
            value={form.external_url}
            onChange={e => setForm({ ...form, external_url: e.target.value })}
            placeholder="https://..."
            className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] text-xs text-white placeholder-white/30 focus:border-[var(--accent-primary)]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={form.visible === 1}
            onChange={e => setForm({ ...form, visible: e.target.checked ? 1 : 0 })}
            className="rounded"
          />
          {t('cmd.visible')}
        </label>
        <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={form.open_in_new === 1}
            onChange={e => setForm({ ...form, open_in_new: e.target.checked ? 1 : 0 })}
            className="rounded"
          />
          {t('cmd.openInNewTab')}
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(form)}
          disabled={!form.label_en || !form.label_ar || saving}
          className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--surface-card)] text-xs font-bold hover:bg-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? '...' : (t('cmd.add'))}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-bold hover:bg-[var(--btn-util-bg)] transition-all cursor-pointer"
        >
          {t('intel.cancel')}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Main Dashboard
// ============================================================================

export const CmsContentDashboard: React.FC = () => {
  const { language , t} = useLanguage();
  const [activeTab, setActiveTab] = useState<CmsTab>('overview');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const tabs = [
    { key: 'overview' as CmsTab, label: t('cmd.overview'), icon: Layout },
    { key: 'pages' as CmsTab, label: t('cmd.pages-3'), icon: FileText },
    { key: 'homepage' as CmsTab, label: t('cmd.homepage'), icon: Layout },
    { key: 'media' as CmsTab, label: t('cmd.media'), icon: Image },
    { key: 'navigation' as CmsTab, label: t('cmd.navigation'), icon: LinkIcon },
    { key: 'revisions' as CmsTab, label: t('cmd.history'), icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-muted)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Page Editor (overrides tab content when editing) */}
      {editingPageId ? (
        <CmsPageEditor
          pageId={editingPageId}
          onBack={() => setEditingPageId(null)}
        />
      ) : (
        <>
          {/* Tab content */}
          {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
          {activeTab === 'pages' && <PagesTab onPageSelect={setEditingPageId} />}
          {activeTab === 'homepage' && <HomepageTab />}
          {activeTab === 'media' && <MediaTab />}
          {activeTab === 'navigation' && <NavigationTab />}
          {activeTab === 'revisions' && <RevisionsTab />}
        </>
      )}
    </div>
  );
};
