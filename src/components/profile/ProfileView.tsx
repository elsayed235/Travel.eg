import React, { useState, useMemo } from 'react';
import { 
  User, 
  MapPin, 
  Heart, 
  Calendar, 
  Clock, 
  Check, 
  ShieldCheck, 
  Settings, 
  Compass, 
  Luggage, 
  Phone, 
  Mail, 
  Globe, 
  Bell, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Edit3,
  Save,
  DollarSign,
  LogOut
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatTripDateRange } from '../../utils/tripDates';
import type { TripEntity } from '../../shared';
import { useLanguage } from '../../i18n/LanguageContext';
import { NEAR_ME_DATA } from '../explore/ExploreView';

export const ProfileView: React.FC = () => {
  const { profile, setProfile, savedItems, toggleSaveItem, navigateTo, showToast, sessionUser, isSignedIn, allTrips, activeTrip, bookings, signOut } = useTrip();
  const { language, isRTL, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'history' | 'settings'>('profile');
  const [currency, setCurrency] = useState<'EGP' | 'USD' | 'EUR'>('EGP');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Removed: a check for 'ahmed' in the email or name that, when it matched,
  // filled in an emergency contact ("+20 111 234 5678 (Nour Mansour - Sister)")
  // and a passport number ("A28941092") the account had never supplied. A
  // passport number and a next-of-kin are the two most consequential fields on
  // this page; inventing them for anyone whose name happens to contain "ahmed"
  // is not a placeholder, it is a false record. Both now show only what the
  // traveler entered.
  const displayName = profile.name || sessionUser?.name || '';

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    emergencyContact: profile.emergencyContact || '',
    passportNumber: profile.passportNumber || '',
    pace: profile.pace,
    budget: profile.budget,
  });

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email,
      emergencyContact: editForm.emergencyContact,
      passportNumber: editForm.passportNumber,
      pace: editForm.pace,
      budget: editForm.budget,
    });
    setIsEditing(false);
    showToast(language === 'ar' ? 'تم حفظ التعديلات في ملفك الشخصي بنجاح! ✨' : 'Profile updated successfully! ✨');
  };

  const savedPlacesList = NEAR_ME_DATA.filter((p) => savedItems.includes(p.id));

  /**
   * The traveler's own finished trips.
   *
   * This was two fabricated entries — "Autumn Wind & Reef Escape, Nov 04–09
   * 2024, EGP 11,200" and a 2023 PADI certification trip — rendered under
   * "Past Sinai Journeys" as this reader's history, down to what they had
   * spent. GET /api/trips/user/:userId returns their real trips and has
   * enforced ownership since the IDOR on it was closed.
   *
   * A trip counts as past when it is COMPLETED or its end date has gone by.
   */
  const pastTrips = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return allTrips
      .filter(trip => {
        if (trip.id === activeTrip?.id) return false;
        if (trip.status === 'COMPLETED') return true;
        return Boolean(trip.endDate && trip.endDate < today);
      })
      .sort((a, b) => (b.endDate || b.updatedAt).localeCompare(a.endDate || a.updatedAt));
  }, [allTrips, activeTrip]);

  /** The hotel and the next activity on the active trip, from its bookings. */
  const accommodation = bookings.find(b => b.serviceType === 'hotel')?.subtitle;
  const nextScheduled = bookings.find(b => b.serviceType !== 'hotel')?.subtitle;

  /** "04 Nov – 09 Nov 2024 (5 days)" from the trip's own dates. */
  const tripDateLabel = (trip: TripEntity): string => {
    const range = formatTripDateRange(trip.startDate, trip.endDate, language === 'ar' ? 'ar' : 'en');
    const days = language === 'ar' ? `${trip.lengthDays} أيام` : `${trip.lengthDays} days`;
    return range ? `${range} · ${days}` : days;
  };

  return (
    <div 
      id="traveler-profile-view" 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FDFBF7] text-[#142126] pb-24 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* 1. Header Banner */}
      <section className="bg-[#062C35] text-[#F7F3EA] border-b border-[#20A89A]/20 pt-10 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E7A83B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#20A89A]/20 border border-[#20A89A]/40 text-[#52C4B7] font-['Outfit',sans-serif] font-bold text-2xl flex items-center justify-center shadow-md">
                {/* Was a literal 'A' when there was no name — the demo
                    persona's initial, shown to every anonymous visitor. */}
                {displayName ? displayName.charAt(0).toUpperCase() : '·'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* Rendered an empty <h1> for anyone not signed in: the page
                      had no accessible name and no title at all. */}
                  <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
                    {displayName || (language === 'ar' ? 'ملفك الشخصي' : 'Your profile')}
                  </h1>
                  {/* Claimed "Active Traveler ✓" even when signed out. */}
                  {isSignedIn && (
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {language === 'ar' ? 'مسافر نشط في دهب ✓' : 'Active Traveler ✓'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#E7D3AE]/70 font-medium">
                  {[profile.email || sessionUser?.email, profile.phone || sessionUser?.phone]
                    .filter(Boolean)
                    .join(' · ') || (language === 'ar' ? 'سجّل الدخول عشان تشوف بياناتك' : 'Sign in to see your details')}
                </p>
              </div>
            </div>

            {/* Quick Trip Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('/my-trip')}
                className="px-4 py-2.5 rounded-full bg-[#E7A83B] hover:bg-[#F4C36C] text-[#04171D] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Luggage className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رحلتي الحالية في دهب' : 'Active Dahab Trip'}</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10 overflow-x-auto">
            {([
              { 
                id: 'profile', 
                label: language === 'ar' ? 'الملف وتفضيلات السفر' : 'Traveler Profile & Preferences' 
              },
              { 
                id: 'saved', 
                label: language === 'ar' ? `الأماكن المحفوظة (${savedItems.length})` : `Saved Experiences (${savedItems.length})` 
              },
              { 
                id: 'history', 
                // Was a hardcoded "(2)", matching the two invented entries.
                label: language === 'ar' ? `الرحلات السابقة (${pastTrips.length})` : `Past Trips (${pastTrips.length})` 
              },
              { 
                id: 'settings', 
                label: language === 'ar' ? 'الإعدادات والعملة' : 'Preferences & Currency' 
              },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#20A89A] text-[#04171D] shadow-2xs font-extrabold'
                    : 'text-[#E7D3AE]/80 hover:text-[#F7F3EA] hover:bg-white/10 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Tab Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Card (7/12) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#142126]/10 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#142126]/8 pb-4">
                <div>
                  <h2 className="font-bold text-lg text-[#142126] font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'تفضيلات السفر وأسلوب الرحلة' : 'Travel Preferences'}
                  </h2>
                  <span className="text-xs text-[#0F6F78] font-bold">
                    {language === 'ar' ? 'مخصصة لتجربة دهب الحالية' : 'Personalized for Dahab'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isEditing 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-stone-100 hover:bg-stone-200 text-[#142126]'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}</span>
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#142126] mb-1">{language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-[#0F6F78]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#142126] mb-1">{language === 'ar' ? 'رقم الموبايل:' : 'Phone:'}</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#142126] mb-1">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#142126] mb-1">{language === 'ar' ? 'جهة اتصال الطوارئ:' : 'Emergency Contact:'}</label>
                      <input
                        type="text"
                        value={editForm.emergencyContact}
                        onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#142126] mb-1">{language === 'ar' ? 'رقم الباسبور / البطاقة:' : 'ID / Passport Number:'}</label>
                      <input
                        type="text"
                        value={editForm.passportNumber}
                        onChange={(e) => setEditForm({ ...editForm, passportNumber: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-mono font-medium"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[#1A1A1A]/50 block mb-1">{language === 'ar' ? 'ريتم ونمط الرحلة:' : 'Travel Style & Pace:'}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                        {profile.pace === 'Balanced' ? (language === 'ar' ? 'متوازن (نشاط أو نشاطين في اليوم + قعدة بحر وريلاكس)' : 'Balanced (1-2 main activities/day + flexible seaside downtime)') : profile.pace}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#1A1A1A]/50 block mb-1">{language === 'ar' ? 'مستوى الميزانية:' : 'Budget Tier:'}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-stone-100 font-bold text-[#1A1A1A]">
                        {profile.budget === 'Moderate' ? (language === 'ar' ? 'متوسطة مميزة (توازن بين المخيمات البدوية الأصيلة والفنادق المريحة)' : 'Moderate Tier (Balance of authentic local camps & boutique comfort)') : profile.budget}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#142126]/50 block mb-1.5">{language === 'ar' ? 'اهتماماتك في دهب:' : 'Core Travel Interests:'}</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#062C35]/10 text-[#062C35] font-bold border border-[#062C35]/20 text-xs"
                        >
                          ✓ {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Security & Logistics */}
                  <div className="pt-4 border-t border-[#142126]/8 space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#142126]/60 font-['Outfit',sans-serif]">
                      {language === 'ar' ? 'بيانات الأمان وتصاريح كمائن سيناء' : 'Sinai Travel Permits & Security Data'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#142126]/6">
                        <span className="text-[#142126]/50 block text-[11px]">{language === 'ar' ? 'رقم الإثبات / الباسبور:' : 'Passport Document:'}</span>
                        <span className="font-mono font-bold text-[#142126]">{profile.passportNumber}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#142126]/6">
                        <span className="text-[#142126]/50 block text-[11px]">{language === 'ar' ? 'جهة اتصال الطوارئ:' : 'Emergency Contact:'}</span>
                        <span className="font-bold text-[#142126]">{profile.emergencyContact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Card (5/12): Current Trip Snapshot */}
            <div className="md:col-span-5 bg-[#062C35] text-[#F7F3EA] rounded-3xl p-6 sm:p-7 shadow-lg border border-[#20A89A]/30 space-y-4 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04171D]/60 border border-[#20A89A]/30 text-[#E7A83B] text-xs font-bold uppercase tracking-wider font-['Outfit',sans-serif]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الرحلة النشطة الآن' : 'Active Journey'}</span>
              </div>

              {/*
                The active trip card. Was entirely fixed: "5 Days in Dahab",
                "October 12 – October 16 · 2 Travelers · Balanced Pace",
                "Dahab Bay Hotel (4 nights)" and "The Canyon Coral Dive" as the
                next scheduled activity — shown under the heading "Active
                Journey" to every traveler.
              */}
              <div className="space-y-1">
                <h2 className="font-bold text-xl text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {activeTrip?.title || (language === 'ar' ? 'لسه مفيش رحلة نشطة' : 'No active trip yet')}
                </h2>
                <p className="text-xs text-[#E7D3AE]/80">
                  {activeTrip
                    ? [
                        tripDateLabel(activeTrip),
                        `${activeTrip.travelersCount} ${language === 'ar' ? 'مسافرين' : 'travellers'}`,
                        activeTrip.pace
                      ].join(' · ')
                    : language === 'ar'
                      ? 'ابدأ رحلة عشان تظهر هنا'
                      : 'Start a trip and it will appear here'}
                </p>
              </div>

              {activeTrip && (
                <div className="p-4 rounded-2xl bg-[#04171D]/60 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#E7D3AE]/70">{language === 'ar' ? 'الإقامة:' : 'Accommodations:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{accommodation || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E7D3AE]/70">{language === 'ar' ? 'النشاط القادم:' : 'Next Scheduled:'}</span>
                    <span className="font-bold text-[#E7A83B]">{nextScheduled || '—'}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigateTo('/my-trip')}
                className="w-full py-3 rounded-full bg-[#E7A83B] hover:bg-[#F4C36C] text-[#04171D] text-xs font-bold transition-all shadow-xs cursor-pointer font-['Outfit',sans-serif]"
              >
                {language === 'ar' ? 'الانتقال لجدول الرحلة الذكي ←' : 'Go to My Trip Hub →'}
              </button>
            </div>

            {/*
              Signing out.

              Also reachable from the account menu in the header, but this is
              where people look for it — and until now the platform had no way
              out at all: a traveler could sign in and never sign out, which on
              a shared device leaves the next person holding their bookings,
              their payment history and their passport field.
            */}
            {isSignedIn && (
              <div className="rounded-3xl p-6 border border-[#142126]/10 bg-white space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#142126] font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                  </h3>
                  <p className="text-xs text-[#142126]/70 leading-relaxed mt-1">
                    {language === 'ar'
                      ? 'هينهي الجلسة على الجهاز ده. رحلتك وحجوزاتك محفوظة وهتلاقيها لما ترجع تدخل.'
                      : 'Ends your session on this device. Your trip and bookings are saved and will be here when you sign back in.'}
                  </p>
                </div>
                <button
                  type="button"
                  id="profile-signout-btn"
                  onClick={() => void signOut()}
                  className="min-h-[44px] px-5 rounded-full border border-[#C0553C]/40 text-[#C0553C] hover:bg-[#C0553C]/10 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Saved Experiences */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-[#142126] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'قائمة الأماكن المفضلة في دهب' : 'Your Saved Dahab Bucket List'}
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('/explore')}
                className="text-xs font-bold text-[#0F6F78] hover:underline"
              >
                {language === 'ar' ? '+ استكشف أماكن أكتر' : '+ Explore More Spots'}
              </button>
            </div>

            {savedPlacesList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#142126]/10 space-y-3">
                <Heart className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-medium">
                  {language === 'ar' 
                    ? 'لسة مفيش أماكن محفوظة. افتح صفحة استكشف واضغط على علامة القلب على أي كافيه أو شاطئ يعجبك!' 
                    : 'No places saved yet. Explore Dahab and tap the heart icon on any cafe, reef, or camp!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlacesList.map((place) => {
                  const title = language === 'ar' && place.nameAr ? place.nameAr : place.name;
                  const tag = language === 'ar' && place.tagAr ? place.tagAr : place.tag;
                  const desc = language === 'ar' && place.descriptionAr ? place.descriptionAr : place.description;

                  return (
                    <div
                      key={place.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#142126]/10 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                          <img
                            src={place.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSaveItem(place.id)}
                            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer`}
                          >
                            <Heart className="w-4 h-4 fill-white" />
                          </button>
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F6F78] font-['Outfit',sans-serif] block">
                            {tag}
                          </span>
                          <h3 className="font-bold text-base text-[#142126] font-['Outfit',sans-serif]">
                            {title}
                          </h3>
                          <p className="text-xs text-[#142126]/70 line-clamp-2">
                            {desc}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-[#142126]/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F6F78]">
                          {place.distance} {language === 'ar' ? 'عن موقعك' : 'away'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            showToast(language === 'ar' ? `تم فتح تفاصيل ${title}` : `Opened ${place.name} details`);
                            navigateTo('/explore');
                          }}
                          className="text-xs font-bold text-[#062C35] hover:text-[#20A89A]"
                        >
                          {language === 'ar' ? 'عرض في الاستكشاف ←' : 'View in Explore →'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Past Trips */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-bold text-xl text-[#142126] font-['Outfit',sans-serif]">
              {language === 'ar' ? 'تاريخ رحلاتك السابقة في سيناء' : 'Past Sinai Journeys'}
            </h2>

            <div className="space-y-4">
              {pastTrips.length === 0 && (
                <div className="bg-white rounded-3xl p-6 border border-[#142126]/10 text-sm text-[#142126]/70">
                  {language === 'ar'
                    ? 'لسه مفيش رحلات سابقة. أول رحلة تخلّصها هتظهر هنا.'
                    : 'No past trips yet. Your first completed trip will appear here.'}
                </div>
              )}
              {pastTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl p-6 border border-[#142126]/10 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#142126]/6 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-[#142126] font-['Outfit',sans-serif]">
                        {trip.title}
                      </h3>
                      <p className="text-xs text-[#142126]/60 font-medium">
                        {tripDateLabel(trip)}
                      </p>
                    </div>
                    {/* What was actually paid, from the trip record. Was a
                        written "EGP 11,200". */}
                    <span className="font-mono text-xs font-bold text-[#0F6F78]">
                      {trip.totalPaidEGP > 0 ? `EGP ${trip.totalPaidEGP.toLocaleString()}` : '—'}
                    </span>
                  </div>

                  {trip.interests.length > 0 && (
                    <p className="text-xs text-[#142126]/75">
                      <strong>{language === 'ar' ? 'الاهتمامات:' : 'Interests:'}</strong>{' '}
                      {trip.interests.join(language === 'ar' ? '، ' : ', ')}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-700 font-semibold">
                      {trip.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(language === 'ar' ? 'تم تجهيز تفاصيل مشابهة في مصمم الرحلات!' : 'Re-booking itinerary options loaded in Trip Builder!');
                        navigateTo('/trip-builder');
                      }}
                      className="text-xs font-bold text-[#062C35] hover:text-[#20A89A] cursor-pointer"
                    >
                      {language === 'ar' ? 'حجز رحلة مشابهة ←' : 'Re-book similar trip →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142126]/10 shadow-xs max-w-2xl space-y-6">
            <div className="border-b border-[#142126]/8 pb-4">
              <h2 className="font-bold text-lg text-[#142126] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'تفضيلات الحساب والعملة المعروضة' : 'Traveler Preferences & Currency'}
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-[#142126] block mb-2 font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'عملة عرض الأسعار' : 'Display Currency'}
                </label>
                <div className="flex items-center gap-2">
                  {(['EGP', 'USD', 'EUR'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        showToast(language === 'ar' ? `تم تغيير عملة العرض إلى ${curr}` : `Currency updated to ${curr}`);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        currency === curr
                          ? 'bg-[#062C35] text-[#F7F3EA] shadow-2xs'
                          : 'bg-[#F7F3EA] text-[#142126]/70 border border-[#142126]/10'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#142126]/6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[#142126] font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'إشعارات الرحلة وتنبيهات الطقس والرياح' : 'Live Trip Notifications & Weather Alerts'}
                  </h3>
                  <p className="text-[12px] text-[#142126]/60">
                    {language === 'ar' ? 'استلام رسائل صباحية بحالة البحر ومواعيد التحرك للأنشطة' : 'Receive timely morning sea conditions and schedule update reminders'}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => {
                    setNotificationsEnabled(e.target.checked);
                    showToast(e.target.checked ? (language === 'ar' ? 'تم تفعيل التنبيهات' : 'Notifications enabled') : (language === 'ar' ? 'تم كتم التنبيهات' : 'Notifications muted'));
                  }}
                  className="w-5 h-5 accent-[#062C35] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
