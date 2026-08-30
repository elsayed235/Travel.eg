import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Heart,
  Ban,
  Save
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { TripConstraint } from '../../types/tripOs';

interface TripBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripBriefModal: React.FC<TripBriefModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const { tripBrief, updateTripBrief, showToast } = useTrip();

  const [travelerName, setTravelerName] = useState(tripBrief.travelerName);
  const [durationDays, setDurationDays] = useState(tripBrief.durationDays);
  const [travelersCount, setTravelersCount] = useState(tripBrief.travelersCount);
  const [budgetTier, setBudgetTier] = useState(tripBrief.budgetTier);
  const [estimatedBudgetEGP, setEstimatedBudgetEGP] = useState(tripBrief.estimatedBudgetEGP);
  const [pace, setPace] = useState(tripBrief.pace);
  const [comfortLevel, setComfortLevel] = useState(tripBrief.comfortLevel);

  const [mustHaves, setMustHaves] = useState<TripConstraint[]>(tripBrief.mustHaves);
  const [preferences, setPreferences] = useState<TripConstraint[]>(tripBrief.preferences);
  const [avoidances, setAvoidances] = useState<TripConstraint[]>(tripBrief.avoidances);

  const [newConstraintText, setNewConstraintText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'must_have' | 'prefer' | 'avoid'>('must_have');

  if (!isOpen) return null;

  const handleAddConstraint = () => {
    if (!newConstraintText.trim()) return;
    const newConstraint: TripConstraint = {
      id: `custom-c-${Date.now()}`,
      type: selectedCategory,
      category: 'comfort',
      label: newConstraintText.trim(),
      labelAr: newConstraintText.trim(),
      description: 'Custom traveler constraint added directly in Trip OS.',
      descriptionAr: 'شرط مخصص أضافه المسافر مباشرة في نظام الرحلة.',
    };

    if (selectedCategory === 'must_have') {
      setMustHaves((prev) => [...prev, newConstraint]);
    } else if (selectedCategory === 'prefer') {
      setPreferences((prev) => [...prev, newConstraint]);
    } else {
      setAvoidances((prev) => [...prev, newConstraint]);
    }
    setNewConstraintText('');
  };

  const handleRemoveConstraint = (id: string, type: 'must_have' | 'prefer' | 'avoid') => {
    if (type === 'must_have') {
      setMustHaves((prev) => prev.filter((c) => c.id !== id));
    } else if (type === 'prefer') {
      setPreferences((prev) => prev.filter((c) => c.id !== id));
    } else {
      setAvoidances((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSaveAndApply = () => {
    updateTripBrief({
      travelerName,
      durationDays,
      travelersCount,
      budgetTier,
      estimatedBudgetEGP,
      pace,
      comfortLevel,
      mustHaves,
      preferences,
      avoidances,
    });
    showToast(
      language === 'ar'
        ? 'تم تحديث محددات الرحلة وإعادة احتساب توافق المخطط بنجاح!'
        : 'Trip Brief updated and itinerary re-aligned!'
    );
    onClose();
  };

  return (
    <div
      id="modal-trip-brief-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-brief-modal-dialog-1-title"
    >
      <div
        id="modal-trip-brief-container"
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#0E252C] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[12px] font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
                {language === 'ar' ? 'محرر محددات الرحلة الذكي' : 'TRIP OS BRIEF ENGINE'}
              </span>
            </div>
            <h2 id="trip-brief-modal-dialog-1-title" className="text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'تعديل أهداف ومحددات الرحلة' : 'Refine Trip Constraints & Goals'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Basic Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'اسم المسافر / المجموعة' : 'Traveler Name'}
              </label>
              <input
                type="text"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#C49756]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'عدد الأيام' : 'Duration (Days)'}
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#C49756]"
              >
                <option value={3}>3 Days (Weekend Escape)</option>
                <option value={4}>4 Days (Standard Dahab)</option>
                <option value={5}>5 Days (Recommended)</option>
                <option value={6}>6 Days (Deep Diving & Canyons)</option>
                <option value={7}>7 Days (Full Sinai Immersion)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'عدد المسافرين' : 'Traveler Count'}
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#C49756]"
              >
                <option value={1}>1 Solo Traveler</option>
                <option value={2}>2 Couple / Friends</option>
                <option value={3}>3 Small Group</option>
                <option value={4}>4 Friends / Family</option>
              </select>
            </div>
          </div>

          {/* Section 2: Pace & Budget Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'إيقاع الرحلة والنشاط' : 'Pace & Intensity'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Relaxed', 'Balanced', 'Active'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      pace === p
                        ? 'bg-[#0E252C] text-amber-300 border-[#0E252C]'
                        : 'bg-[#FAF8F5] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'ar'
                      ? p === 'Relaxed' ? 'رايق' : p === 'Balanced' ? 'متوازن' : 'نشيط'
                      : p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'فئة الميزانية' : 'Budget Tier'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Budget', 'Moderate', 'Premium'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBudgetTier(b);
                      setEstimatedBudgetEGP(b === 'Budget' ? 9500 : b === 'Moderate' ? 16800 : 26000);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      budgetTier === b
                        ? 'bg-[#C49756] text-white border-[#C49756]'
                        : 'bg-[#FAF8F5] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'ar'
                      ? b === 'Budget' ? 'اقتصادي' : b === 'Moderate' ? 'متوسط' : 'فاخر'
                      : b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Add Custom Constraint */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">
                {language === 'ar' ? 'إضافة شرط أو رغبة جديدة:' : 'Add Custom Trip Constraint:'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('must_have')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedCategory === 'must_have' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Must-Have
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('prefer')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedCategory === 'prefer' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Preference
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('avoid')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    selectedCategory === 'avoid' ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Avoidance
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newConstraintText}
                onChange={(e) => setNewConstraintText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                placeholder={
                  language === 'ar'
                    ? 'مثال: "وجبات نباتية فقط"، "غرفة بفيو مباشر للبحر"...'
                    : 'e.g. "Vegetarian meals only", "Ground floor seafront room"...'
                }
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#C49756]"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section 4: Current Active Lists with Delete Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'القائمة الحالية للمحددات' : 'Current Active Constraints'}
            </h4>

            {/* Must Haves */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Must-Haves ({mustHaves.length})</span>
              </div>
              <div className="space-y-1.5">
                {mustHaves.map((mh) => (
                  <div
                    key={mh.id}
                    className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-emerald-950">
                      {language === 'ar' ? mh.labelAr : mh.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveConstraint(mh.id, 'must_have')}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-600" />
                <span>Preferences ({preferences.length})</span>
              </div>
              <div className="space-y-1.5">
                {preferences.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-amber-950">
                      {language === 'ar' ? p.labelAr : p.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveConstraint(p.id, 'prefer')}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoidances */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-rose-600" />
                <span>Avoidances ({avoidances.length})</span>
              </div>
              <div className="space-y-1.5">
                {avoidances.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-rose-950">
                      {language === 'ar' ? a.labelAr : a.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveConstraint(a.id, 'avoid')}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-6 py-2.5 rounded-2xl bg-[#0E252C] hover:bg-black text-amber-300 font-extrabold text-xs shadow-lg cursor-pointer transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'حفظ وتحديث نظام الرحلة' : 'Save & Re-Align Trip OS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
