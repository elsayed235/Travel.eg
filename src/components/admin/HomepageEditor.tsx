import React, { useState, useEffect, useCallback } from 'react';
import { Home } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useUI } from '../../context/UIContext';
import { DahabEmptyState } from '../common/DahabEmptyState';
import { api } from '../../services/api';
import type { CmsHomepageSection } from '../../services/api';

interface HomepageEditorProps {
  onBack?: () => void;
}

const KNOWN_SECTIONS = [
  { key: 'hero', label_en: 'Hero Banner', label_ar: 'الشريط العلوي', default_title_en: 'Welcome to Dahab', default_title_ar: 'مرحباً بكم في دهب' },
  { key: 'featured_programs', label_en: 'Featured Programs', label_ar: 'البرامج المميزة', default_title_en: 'Featured Programs', default_title_ar: 'البرامج المميزة' },
  { key: 'featured_gallery', label_en: 'Gallery Highlights', label_ar: 'أبرز المعرض', default_title_en: 'Gallery Highlights', default_title_ar: 'أبرز المعرض' },
  { key: 'featured_stories', label_en: 'Dahab Stories', label_ar: 'قصص دهب', default_title_en: 'Dahab Stories', default_title_ar: 'قصص دهب' },
  { key: 'call_to_action', label_en: 'Call to Action', label_ar: 'الدعوة لاتخاذ إجراء', default_title_en: 'Book Your Adventure', default_title_ar: 'احجز مغامرتك' },
  { key: 'services_preview', label_en: 'Services Preview', label_ar: 'معاينة الخدمات', default_title_en: 'What We Offer', default_title_ar: 'ماذا نقدم' },
  { key: 'testimonials', label_en: 'Testimonials', label_ar: 'التقييمات', default_title_en: 'What Travelers Say', default_title_ar: 'ماذا يقول المسافرون' },
  { key: 'partners', label_en: 'Partners', label_ar: 'الشركاء', default_title_en: 'Our Partners', default_title_ar: 'شركاؤنا' },
];

export const HomepageEditor: React.FC<HomepageEditorProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { showToast } = useUI();
  const [sections, setSections] = useState<CmsHomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CmsHomepageSection>>({
    title_en: '',
    title_ar: '',
    visible: 1,
    sort_order: 0,
    config: {},
  });

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const json = await api.getCmsHomepageAdmin();
      setSections(json.sections || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || t('cms.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadSections(); }, [loadSections]);

  const startEdit = (section: CmsHomepageSection) => {
    setEditingKey(section.section_key);
    setEditForm({
      id: section.id,
      section_key: section.section_key,
      title_en: section.title_en,
      title_ar: section.title_ar,
      visible: section.visible,
      sort_order: section.sort_order,
      config: section.config || {},
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditForm({
      title_en: '',
      title_ar: '',
      visible: 1,
      sort_order: 0,
      config: {},
    });
  };

  const handleSave = async () => {
    if (!editingKey) return;
    if (!editForm.title_en && !editForm.title_ar) {
      showToast(t('cms.titleRequired'));
      return;
    }
    setSaving(true);
    try {
      const json = await api.updateCmsHomepage(editingKey, editForm);
      setSections(prev => prev.map(s => s.section_key === editingKey ? json.section : s));
      showToast(t('cms.sectionSaved'));
      cancelEdit();
    } catch (err: any) {
      showToast(err?.message || t('cms.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const getSectionLabel = (key: string) => {
    const known = KNOWN_SECTIONS.find(s => s.key === key);
    return known ? (language === 'ar' ? known.label_ar : known.label_en) : key;
  };

  const getSectionDefaultTitle = (key: string) => {
    const known = KNOWN_SECTIONS.find(s => s.key === key);
    return known ? (language === 'ar' ? known.default_title_ar : known.default_title_en) : '';
  };

  // Group sections by visibility
  const visibleSections = sections.filter(s => s.visible === 1);
  const hiddenSections = sections.filter(s => s.visible !== 1);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-container)]">
        <div>
          <h1 className="text-lg font-extrabold text-[var(--text-primary)]">{t('cms.homepageTitle')}</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t('cms.homepageSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {visibleSections.length} {language === 'ar' ? 'مرئي' : 'visible'} · {hiddenSections.length} {language === 'ar' ? 'مخفي' : 'hidden'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <span className="w-5 h-5 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          </div>
        )}
        {error && !loading && (
          <DahabEmptyState title={error} iconName="alert-triangle" motifName="wave-divider" />
        )}
        {!loading && !error && sections.length === 0 && (
          <DahabEmptyState
            title={t('cms.noSectionsFound')}
            description={t('cms.noSectionsDescription')}
            iconName="home"
            motifName="reef-art"
          />
        )}

        {/* Visible sections */}
        {!loading && !error && visibleSections.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
              {language === 'ar' ? 'الأقسام المرئية' : 'Visible Sections'}
            </h2>
            {visibleSections.map(section => (
              <div
                key={section.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-sm font-extrabold text-[var(--text-primary)]">
                      {getSectionLabel(section.section_key)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {t('cms.visible')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">#{section.sort_order}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(section)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] text-xs font-bold cursor-pointer hover:brightness-110 transition-colors"
                    >
                      {t('cms.edit')}
                    </button>
                  </div>
                </div>
                {editingKey === section.section_key && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">
                          {language === 'ar' ? 'العنوان (EN)' : 'Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={editForm.title_en || ''}
                          onChange={e => setEditForm(f => ({ ...f, title_en: e.target.value }))}
                          placeholder={getSectionDefaultTitle(section.section_key)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">
                          {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={editForm.title_ar || ''}
                          onChange={e => setEditForm(f => ({ ...f, title_ar: e.target.value }))}
                          placeholder={getSectionDefaultTitle(section.section_key)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--accent-primary)] dir=rtl"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.visible === 1}
                          onChange={e => setEditForm(f => ({ ...f, visible: e.target.checked ? 1 : 0 }))}
                          className="w-3.5 h-3.5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                        />
                        <span className="text-xs text-[var(--text-muted)]">{t('cms.visible')}</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.sort_order || 0}
                        onChange={e => setEditForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 rounded bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <span className="text-[10px] text-[var(--text-muted)]">{t('cms.sortOrder')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold cursor-pointer hover:brightness-110 disabled:opacity-50"
                      >
                        {saving ? t('cms.saving') : t('cms.save')}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-bold cursor-pointer hover:bg-[var(--surface-container)]"
                      >
                        {t('cms.cancel')}
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {language === 'ar'
                    ? `${section.title_ar || '—'} · ${section.title_en || '—'}`
                    : `${section.title_en || '—'} · ${section.title_ar || '—'}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Hidden sections */}
        {!loading && !error && hiddenSections.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
              {language === 'ar' ? 'الأقسام المخفية' : 'Hidden Sections'}
            </h2>
            {hiddenSections.map(section => (
              <div
                key={section.id}
                className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-container)] p-4 opacity-70"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">
                      {getSectionLabel(section.section_key)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {t('cms.hidden')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(section)}
                    className="px-2.5 py-1 rounded-lg bg-slate-500 text-white text-xs font-bold cursor-pointer hover:brightness-110 transition-colors"
                  >
                    {t('cms.edit')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero specific */}
        {!loading && !error && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 p-4">
            <h2 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-3">
              {t('cms.heroSection')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {t('cms.heroDescription')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
