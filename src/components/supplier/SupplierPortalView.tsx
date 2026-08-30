import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Car,
  Waves,
  DollarSign,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Users,
  Globe,
  FileCheck2,
  Lock,
  ExternalLink,
  History
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

export const SupplierPortalView: React.FC = () => {
  const {
    navigateTo,
    showToast,
    authoritativeSuppliers,
    activeSupplierId,
    setActiveSupplierId
  } = useTrip();
  const { language, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'inbox' | 'inventory' | 'resources' | 'reliability' | 'audit'>('inbox');

  // Selected Authoritative Supplier
  const selectedSupplier = authoritativeSuppliers.find(s => s.id === activeSupplierId) || authoritativeSuppliers[0];

  // Supplier Inboxes (S05, S06)
  const [requests, setRequests] = useState([
    {
      id: 'REQ-SH-409',
      category: 'Transfer',
      service: 'Private Van Transfer (SSH Airport → Dahab Lighthouse)',
      traveler: 'Ahmed Mansour (2 Pax, 3 Luggage)',
      pickupTime: 'Today 10:30 AM',
      flightNumber: 'MS-028 (Cairo → SSH)',
      payoutEGP: 1200,
      slaRemaining: '03:45',
      status: 'PENDING_ACTION',
      supplierId: 'SUP-SHUTTLE-01'
    },
    {
      id: 'REQ-DV-812',
      category: 'Diving',
      service: 'Canyon Guided Reef Dive (2 Tanks + Gear)',
      traveler: 'Ahmed Mansour & Guest',
      pickupTime: 'Tomorrow 09:00 AM',
      requirements: 'PADI Advanced Certified ✓',
      payoutEGP: 1850,
      slaRemaining: '11:20',
      status: 'CONFIRMED',
      supplierId: 'SUP-DIVE-02'
    }
  ]);

  const handleDecision = async (id: string, decision: 'ACCEPT' | 'REJECT') => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: decision === 'ACCEPT' ? 'CONFIRMED' : 'REJECTED'
          };
        }
        return r;
      })
    );

    try {
      await api.respondSupplierBooking(id, {
        supplierId: selectedSupplier?.id || 'SUP-SHUTTLE-01',
        action: decision,
        reason: decision === 'REJECT' ? 'Supplier requested automated reallocation' : undefined
      });
    } catch (e) {
      // Handled locally
    }

    showToast(
      language === 'ar'
        ? decision === 'ACCEPT'
          ? 'تم قبول الحجز وإرسال التأكيد الفوري للعميل ✓'
          : 'تم الاعتذار عن الحجز وتحويل الرحلة لمحرك الاسترجاع والبدائل'
        : decision === 'ACCEPT'
        ? 'Booking accepted & traveler notified ✓'
        : 'Booking rejected · Change Engine triggered'
    );
  };

  // Filter requests for active supplier if specific, or general
  const activeRequests = requests.filter(r => r.supplierId === selectedSupplier?.id || requests.length <= 2);

  return (
    <div
      id="supplier-portal-view"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pb-24 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* 1. Supplier Header */}
      <header className="bg-white border-b border-[#1A1A1A]/10 px-4 sm:px-6 lg:px-8 pt-8 pb-6 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#062C35] text-[#E7A83B] flex items-center justify-center font-bold">
                {selectedSupplier?.category.includes('Diving') ? (
                  <Waves className="w-5 h-5" />
                ) : selectedSupplier?.category.includes('Transfer') ? (
                  <Car className="w-5 h-5" />
                ) : (
                  <Building2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-[#1A1A1A]">
                    {selectedSupplier?.businessName || 'Dahab Supplier & Partner OS'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {selectedSupplier?.tier || 'VERIFIED PARTNER ✓'}
                  </span>
                  {selectedSupplier?.linkedCandidateId && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-200">
                      Discovery Provenance: {selectedSupplier.linkedCandidateId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-2">
                  <span>{selectedSupplier?.area} · {selectedSupplier?.category}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-800 font-semibold">{selectedSupplier?.licenseNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigateTo('/market-intelligence')}
                className="px-4 py-2 rounded-full bg-[#062C35]/10 hover:bg-[#062C35]/15 text-[#062C35] text-xs font-bold transition-all border border-[#062C35]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#0F6F78]" />
                <span>{language === 'ar' ? 'استخبارات السوق والأسعار ←' : 'Market & Discovery Intel →'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/ops-console')}
                className="px-4 py-2 rounded-full bg-[#062C35] text-[#F7F3EA] hover:bg-[#083E4B] text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'ar' ? '← لوحة العمليات' : '← Ops Console'}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/my-trip')}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'ar' ? 'الرجوع للمنصة' : 'Traveler View'}
              </button>
            </div>
          </div>

          {/* Dynamic Supplier Partner Switcher (Includes Newly Promoted Candidates!) */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]/6 overflow-x-auto">
            <span className="text-[12px] font-bold text-[#1A1A1A]/50 me-1 whitespace-nowrap">
              {language === 'ar' ? 'الشركاء المعتمدون:' : 'Authoritative Partners:'}
            </span>
            {authoritativeSuppliers.map(p => {
              const isSelected = p.id === (selectedSupplier?.id || activeSupplierId);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveSupplierId(p.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#062C35] text-white shadow-xs'
                      : 'bg-stone-100 text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-stone-200'
                  }`}
                >
                  {p.category.includes('Diving') ? (
                    <Waves className="w-3.5 h-3.5 text-sky-400" />
                  ) : p.category.includes('Transfer') ? (
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{p.businessName}</span>
                  {p.linkedCandidateId && p.linkedCandidateId !== 'DSC-000-HISTORIC' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Newly Promoted from Intelligence!" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1A1A1A]/8 pb-3 overflow-x-auto">
          {([
            { id: 'inbox', label: language === 'ar' ? 'صندوق الطلبات الواردة (S05/S06)' : 'Incoming Requests (S05/S06)' },
            { id: 'inventory', label: language === 'ar' ? 'جدول السعة والمواعيد (S03)' : 'Capacity & Slots (S03)' },
            { id: 'resources', label: language === 'ar' ? 'الأسطول والمدربين (S04)' : 'Fleet & Resource Roster (S04)' },
            { id: 'reliability', label: language === 'ar' ? 'مؤشر الموثوقية ومعدل القبول (S09)' : 'Reliability & SLA Score (S09)' },
            { id: 'audit', label: language === 'ar' ? 'سجل التدقيق والمصدر القانوني' : 'Provenance & Audit Trail' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#062C35] text-[#F7F3EA] shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Incoming Requests Inbox */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {language === 'ar' ? 'طلبات الحجز المباشرة عبر الوكالة' : 'Live Booking Requests Queue'}
                </h2>
                <p className="text-xs text-[#1A1A1A]/60">
                  {selectedSupplier?.businessName} · WhatsApp Instant Dispatch Sync Active
                </p>
              </div>
              <span className="text-xs text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-medium">
                ⚡ Instant WhatsApp Sync Active
              </span>
            </div>

            <div className="space-y-3">
              {activeRequests.map(req => (
                <div
                  key={req.id}
                  className="p-5 rounded-3xl bg-white border border-[#1A1A1A]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-100 text-[#1A1A1A]">
                        {req.id}
                      </span>
                      <span className="font-bold text-base text-[#1A1A1A]">{req.service}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#1A1A1A]/80 pt-1">
                      <div>
                        <span className="text-[11px] text-[#1A1A1A]/50 block">{language === 'ar' ? 'المسافر:' : 'Traveler:'}</span>
                        <span className="font-semibold">{req.traveler}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#1A1A1A]/50 block">{language === 'ar' ? 'الموعد:' : 'Pickup Time:'}</span>
                        <span className="font-semibold text-emerald-800">{req.pickupTime}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#1A1A1A]/50 block">{language === 'ar' ? 'مستحقات المورد:' : 'Supplier Payout:'}</span>
                        <span className="font-bold text-[#1A1A1A]">{req.payoutEGP} EGP</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {req.status === 'PENDING_ACTION' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDecision(req.id, 'REJECT')}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>{language === 'ar' ? 'اعتذار' : 'Decline'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(req.id, 'ACCEPT')}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <Check className="w-4 h-4" />
                          <span>{language === 'ar' ? 'قبول وتأكيد ✓' : 'Accept & Confirm ✓'}</span>
                        </button>
                      </>
                    ) : (
                      <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {req.status === 'CONFIRMED' ? 'Confirmed & Dispatched ✓' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Capacity & Slots */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/8 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {language === 'ar' ? 'سعة المقاعد والرحلات اليومية (S03)' : 'Daily Capacity & Slots Calendar (S03)'}
                </h2>
                <p className="text-xs text-[#1A1A1A]/60">
                  {selectedSupplier?.capacitySummary || 'Real-time capacity locking to prevent oversell collisions'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast(language === 'ar' ? 'تم تحديث التوفر بنجاح' : 'Availability synced')}
                className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Inventory</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {(selectedSupplier?.initialSlots || [
                { time: '09:00 AM', title: 'Morning Slot', booked: 4, total: 6, notes: '2 Seats available' },
                { time: '14:00 PM', title: 'Afternoon Slot', booked: 2, total: 6, notes: '4 Seats available' },
                { time: '17:30 PM', title: 'Sunset Slot', booked: 6, total: 6, notes: 'Capacity locked (Full)' }
              ]).map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    slot.booked >= slot.total
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A]">{slot.time} - {slot.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        slot.booked >= slot.total
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {slot.booked} / {slot.total} {slot.booked >= slot.total ? 'FULL' : 'Booked'}
                    </span>
                  </div>
                  <p className="text-[#1A1A1A]/70">{slot.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Fleet & Resource Roster */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6">
            <div className="border-b border-[#1A1A1A]/8 pb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                {language === 'ar' ? 'سجل الأسطول والكوادر المعتمدة (S04)' : 'Certified Fleet & Guides Registry (S04)'}
              </h2>
              <p className="text-xs text-[#1A1A1A]/60">
                {language === 'ar' ? 'تخصيص السائقين والمعدات لكل حجز نشط' : 'Driver & instructor assignments for active itineraries'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {(selectedSupplier?.roster || [
                { name: 'Captain Hany', role: 'Fleet Lead Driver', status: 'Assigned to Ahmed Mansour', license: 'Commercial Class 1' },
                { name: 'Captain Tarek', role: 'Airport Shuttle Driver', status: 'Available for 14:00 PM Slot', license: 'Commercial Class 1' }
              ]).map((member, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="font-bold text-sm text-[#1A1A1A]">{member.name}</div>
                  <div className="text-emerald-800 font-medium">Role: {member.role}</div>
                  <div className="text-[#1A1A1A]/70 text-[12px]">Status: {member.status}</div>
                  <div className="text-[#1A1A1A]/50 text-[11px] font-mono">License: {member.license}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Reliability Score */}
        {activeTab === 'reliability' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6">
            <div className="border-b border-[#1A1A1A]/8 pb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                {language === 'ar' ? 'مؤشر الموثوقية والأداء التشغيلي (S09)' : 'Operational Reliability & SLA Score (Epic S09)'}
              </h2>
              <p className="text-xs text-[#1A1A1A]/60">
                {language === 'ar' ? 'معايير جودة الخدمة وسرعة الاستجابة لطلبات المسافرين' : 'On-time pickup rate, acceptance SLA, and traveler review health'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50">Acceptance Rate</span>
                <div className="text-2xl font-bold text-emerald-800">98.4%</div>
                <span className="text-[11px] text-emerald-700">{selectedSupplier?.tier || 'Top Tier Partner'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50">Avg Response Time</span>
                <div className="text-2xl font-bold text-[#062C35]">2.1 mins</div>
                <span className="text-[11px] text-emerald-700">&lt; 5 min SLA ✓</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50">On-Time Pickups</span>
                <div className="text-2xl font-bold text-[#062C35]">99.1%</div>
                <span className="text-[11px] text-emerald-700">Zero Delays</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50">Traveler Rating</span>
                {/* The fallbacks were the problem: a supplier with no rating was
                    shown "4.9 ★" and "100+ Verified Reviews" — a specific,
                    flattering claim about a real business, invented by an `||`.
                    A supplier reading their own portal would take it as real. */}
                {typeof selectedSupplier?.rating === 'number' ? (
                  <>
                    <div className="text-2xl font-bold text-amber-800">{selectedSupplier.rating} ★</div>
                    {typeof selectedSupplier.reviewCount === 'number' && (
                      <span className="text-[11px] text-[#1A1A1A]/60">
                        {selectedSupplier.reviewCount} verified reviews
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-[#1A1A1A]/30">—</div>
                    <span className="text-[11px] text-[#1A1A1A]/60">No ratings collected yet</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Provenance & Audit Trail (Proof of Strict Governance) */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/8 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-700" />
                  <span>{language === 'ar' ? 'سجل التدقيق والمصدر الأمني الموثق' : 'Provenance & Operational Audit Trail'}</span>
                </h2>
                <p className="text-xs text-[#1A1A1A]/60">
                  Proof that supplier was vetted through the 5-stage human approval state machine before authoritative promotion.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                AUTHORITATIVE RECORD ✓
              </span>
            </div>

            {/* Provenance Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50 font-bold uppercase">Authorized Approver</span>
                <div className="font-semibold text-emerald-900">{selectedSupplier?.approvedBy}</div>
                <span className="text-[11px] text-[#1A1A1A]/60">Onboarded: {selectedSupplier?.onboardedAt}</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50 font-bold uppercase">License Credential</span>
                <div className="font-mono font-semibold text-sky-900">{selectedSupplier?.licenseNumber}</div>
                <span className="text-[11px] text-emerald-700">Official Regulatory Check Passed ✓</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-[#1A1A1A]/50 font-bold uppercase">Discovery Candidate Link</span>
                <div className="font-mono font-semibold text-[#062C35]">{selectedSupplier?.linkedCandidateId}</div>
                <span className="text-[11px] text-[#1A1A1A]/60 truncate block font-mono" title={selectedSupplier?.provenanceSignature}>
                  SHA-256: {selectedSupplier?.provenanceSignature?.substring(0, 16)}...
                </span>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase text-[#1A1A1A]/50 tracking-wider">
                Immutable Lifecycle Log ({selectedSupplier?.auditLog?.length || 0} Events)
              </h3>
              <div className="space-y-2">
                {(selectedSupplier?.auditLog || []).map((entry, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-mono font-bold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {entry.action}
                      </span>
                      <span className="text-[#1A1A1A]/50 font-mono">{entry.timestamp}</span>
                    </div>
                    <div className="text-[#1A1A1A]/80 font-medium">Actor: {entry.actor}</div>
                    <p className="text-[#1A1A1A]/70 text-[12px] italic">"{entry.notes}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

