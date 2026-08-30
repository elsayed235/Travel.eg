import React, { useState } from 'react';
import {
  Download,
  Printer,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Compass,
  AlertTriangle,
  FileText,
  CheckCircle2,
  X,
  Share2,
  WifiOff,
  BatteryCharging,
  Sun,
  Flame,
  Wind,
  Info
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { buildDahabOfflineTripPack } from '../../services/dahabLocalEngine';

interface OfflineTripPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineTripPackModal: React.FC<OfflineTripPackModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const { tripBrief, tripDays, bookings, showToast } = useTrip();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'vouchers' | 'emergency' | 'checklist'>('itinerary');

  if (!isOpen) return null;

  const pack = buildDahabOfflineTripPack(tripBrief, tripDays, bookings);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pack, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Dahab_Offline_Trip_Pack_${pack.traveler.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Offline Trip Pack downloaded for remote access ✓');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn text-[#F7F3EA]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-trip-pack-modal-dialog-1-title"
    >
      <div className="bg-[#0E2520] text-[#F7F3EA] w-full max-w-4xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#081714] text-[#F7F3EA] p-6 flex items-start justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#13312B] text-[#52C4B7] border border-white/10">
                <WifiOff className="w-3.5 h-3.5 text-[#F4C36C]" />
                {language === 'ar' ? 'حزمة السفر أوفلاين المعتمدة' : 'Official Offline Trip Pack'}
              </span>
              <span className="text-xs text-[#D2E3DE]/60">
                v{pack.packageVersion}
              </span>
            </div>
            <h2 id="offline-trip-pack-modal-dialog-1-title" className="text-2xl font-bold font-['Outfit',sans-serif] tracking-tight text-[#F7F3EA]">
              {language === 'ar' ? 'دليل دهب والمحميات بدون إنترنت' : 'Dahab & Sinai Reserves Offline Pack'}
            </h2>
            <p className="text-sm text-[#D2E3DE]/80 mt-1">
              {language === 'ar'
                ? 'وثيقة رسمية كاملة لرحلتك تشمل الحجوزات، المواعيد، الإسعاف، ومعالم الطرق المعزولة.'
                : 'Authoritative offline package with full itinerary, confirmed vouchers, emergency protocols, and remote landmarks.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#D2E3DE]/70 hover:text-[#F7F3EA] rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Freshness Banner */}
        <div className="bg-[#13312B] border-b border-white/10 p-3 px-6 flex items-center gap-3 text-xs text-[#D2E3DE]">
          <Info className="w-4 h-4 text-[#F4C36C] shrink-0" />
          <div>
            <span className="font-semibold text-[#F7F3EA]">{language === 'ar' ? 'تاريخ التحديث المعتمد: ' : 'Verified Snapshot: '}</span>
            {new Date(pack.generatedAtTimestamp).toLocaleString()} ·{' '}
            <span className="text-[#D2E3DE]/80">
              {language === 'ar'
                ? 'البيانات الديناميكية (الرياح وحالة البحر) تتطلب تأكيداً محلياً مباشراً قبل مغادرة الشاطئ.'
                : 'Dynamic conditions (marine swell & wind) must be confirmed locally with dive marshals before departure.'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#081714] px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-[#F4C36C] text-[#F4C36C] font-semibold'
                : 'border-transparent text-[#D2E3DE]/60 hover:text-[#F7F3EA]'
            }`}
          >
            {language === 'ar' ? 'الجدول والمسارات' : 'Itinerary & Trails'}
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'vouchers'
                ? 'border-[#F4C36C] text-[#F4C36C] font-semibold'
                : 'border-transparent text-[#D2E3DE]/60 hover:text-[#F7F3EA]'
            }`}
          >
            {language === 'ar' ? 'كوبونات الحجز' : 'Confirmed Vouchers'} ({pack.confirmedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'emergency'
                ? 'border-[#F4C36C] text-[#F4C36C] font-semibold'
                : 'border-transparent text-[#D2E3DE]/60 hover:text-[#F7F3EA]'
            }`}
          >
            {language === 'ar' ? 'الطوارئ والإسعاف' : 'Emergency & Medical'}
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-[#F4C36C] text-[#F4C36C] font-semibold'
                : 'border-transparent text-[#D2E3DE]/60 hover:text-[#F7F3EA]'
            }`}
          >
            {language === 'ar' ? 'تجهيزات الميدان' : 'Field Prep Checklist'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Traveler Quick Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#13312B] p-4 rounded-2xl border border-white/10 text-sm">
            <div>
              <span className="text-xs text-[#D2E3DE]/60 block">{language === 'ar' ? 'المسافر' : 'Primary Traveler'}</span>
              <span className="font-semibold text-[#F7F3EA]">{pack.traveler.name} ({pack.traveler.travelersCount} Travelers)</span>
            </div>
            <div>
              <span className="text-xs text-[#D2E3DE]/60 block">{language === 'ar' ? 'الإقامة المعتمدة' : 'Accommodation'}</span>
              <span className="font-semibold text-[#F7F3EA]">{pack.accommodation.hotelName}</span>
              <span className="text-xs text-[#D2E3DE]/70 block">{pack.accommodation.receptionPhone}</span>
            </div>
            <div>
              <span className="text-xs text-[#D2E3DE]/60 block">{language === 'ar' ? 'كود مرجعي' : 'Master Trip Code'}</span>
              <span className="font-mono font-bold text-[#F4C36C]">{pack.tripId}</span>
            </div>
          </div>

          {/* Tab 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {/* Dynamic Snapshot vs Static Logistics Card */}
              {pack.dynamicConditionsSnapshot && (
                <div className="bg-[#13312B] text-[#D2E3DE] p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold uppercase tracking-wider text-[#52C4B7] flex items-center gap-1.5 font-['Outfit',sans-serif]">
                      <Wind className="w-3.5 h-3.5 text-[#52C4B7]" />
                      {language === 'ar' ? 'لقطة الظروف البحرية الديناميكية (Dynamic Snapshot)' : 'Dynamic Conditions Snapshot'}
                    </span>
                    <span className="bg-[#0E2520] px-2 py-0.5 rounded text-[12px] font-mono text-[#52C4B7] border border-white/10">
                      Observed: {new Date(pack.dynamicConditionsSnapshot.observedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({pack.dynamicConditionsSnapshot.freshness})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-[#0E2520] p-2.5 rounded-xl border border-white/10">
                      <span className="text-[#52C4B7] block text-[11px]">{language === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}</span>
                      <span className="font-bold text-sm text-[#F7F3EA]">{pack.dynamicConditionsSnapshot.windSpeedKnots} kts {pack.dynamicConditionsSnapshot.windDirection}</span>
                    </div>
                    <div className="bg-[#0E2520] p-2.5 rounded-xl border border-white/10">
                      <span className="text-[#52C4B7] block text-[11px]">{language === 'ar' ? 'حالة البحر' : 'Sea State'}</span>
                      <span className="font-bold text-sm text-[#F7F3EA]">{pack.dynamicConditionsSnapshot.seaState}</span>
                    </div>
                    <div className="bg-[#0E2520] p-2.5 rounded-xl border border-white/10">
                      <span className="text-[#52C4B7] block text-[11px]">{language === 'ar' ? 'الرؤية والحرارة' : 'Vis & Temp'}</span>
                      <span className="font-bold text-sm text-[#F7F3EA]">{pack.dynamicConditionsSnapshot.waterVisibilityMeters}m · {pack.dynamicConditionsSnapshot.waterTempC}°C</span>
                    </div>
                    <div className="bg-[#0E2520] p-2.5 rounded-xl border border-white/10">
                      <span className="text-[#52C4B7] block text-[11px]">{language === 'ar' ? 'موعد الغروب' : 'Sunset Anchor'}</span>
                      <span className="font-bold text-sm text-[#F4C36C]">{pack.dynamicConditionsSnapshot.sunsetTimeStr}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#D2E3DE]/70 pt-1">
                    *{pack.dynamicConditionsSnapshot.disclaimer}
                  </p>
                </div>
              )}

              <h3 className="font-['Outfit',sans-serif] font-bold text-lg text-[#F7F3EA]">
                {language === 'ar' ? 'تفاصيل الأيام واللوجستيات الميدانية الثابتة' : 'Static Day-by-Day Remote Logistics'}
              </h3>
              <div className="space-y-3">
                {pack.itinerarySummary.map((day) => (
                  <div key={day.dayNumber} className="border border-white/10 rounded-2xl p-4 bg-[#13312B] hover:border-white/20 transition">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0E2520] text-[#52C4B7] text-xs font-bold px-2.5 py-1 rounded-md border border-white/10">
                          Day {day.dayNumber}
                        </span>
                        <span className="font-semibold text-[#F7F3EA]">{day.theme}</span>
                      </div>
                      <span className="text-xs bg-[#0E2520] text-[#D2E3DE] px-2.5 py-1 rounded-full border border-white/10">
                        {day.intensity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#D2E3DE] mt-3 pt-3 border-t border-white/10">
                      <div>
                        <span className="font-semibold text-[#F7F3EA] block mb-1">
                          {language === 'ar' ? 'النشاط الرئيسي والوصول:' : 'Anchor & Access Method:'}
                        </span>
                        <p className="text-[#D2E3DE]/75">{day.anchor} · {day.accessMethod}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#F7F3EA] block mb-1">
                          {language === 'ar' ? 'تغطية الاتصالات:' : 'Signal & Connectivity:'}
                        </span>
                        <p className="text-[#D2E3DE]/75">{day.connectivity}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 text-xs bg-[#0E2520] p-2.5 rounded-xl border border-white/10">
                      <span className="font-semibold text-[#F4C36C] block mb-1">
                        {language === 'ar' ? 'توصيات الاستعداد الميداني:' : 'Field Preparation Notes:'}
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[#D2E3DE]/80">
                        {day.prepNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Vouchers */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              <h3 className="font-['Outfit',sans-serif] font-bold text-lg text-[#F7F3EA]">
                {language === 'ar' ? 'كوبونات الخدمات المؤكدة بدون اتصال' : 'Offline Printable Service Vouchers'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {pack.confirmedBookings.map((b, i) => (
                  <div key={i} className="border-2 border-dashed border-white/15 rounded-2xl p-5 bg-[#13312B] relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-[#F4C36C] bg-[#0E2520] px-2 py-0.5 rounded border border-white/10">
                          {b.type}
                        </span>
                        <h4 className="text-base font-bold text-[#F7F3EA] mt-1">{b.title}</h4>
                        <p className="text-xs text-[#D2E3DE]/70">
                          {b.provider} · <span className="font-semibold text-[#F7F3EA]">{b.departureTime}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#D2E3DE]/60 block">{language === 'ar' ? 'كود التأكيد' : 'Voucher Code'}</span>
                        <span className="font-mono font-bold text-base text-[#F4C36C] bg-[#0E2520] px-2 py-1 rounded border border-white/10">
                          {b.code}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D2E3DE]">
                      <div>
                        <span className="font-semibold text-[#F7F3EA]">{language === 'ar' ? 'نقطة اللقاء: ' : 'Meeting Point: '}</span>
                        {b.meetingPoint}
                      </div>
                      <div>
                        <span className="font-semibold text-[#F7F3EA]">{language === 'ar' ? 'هاتف المزود: ' : 'Direct Provider Phone: '}</span>
                        <span className="font-mono text-[#F4C36C]">{b.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Emergency */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-['Outfit',sans-serif] font-bold text-lg text-[#F7F3EA]">
                  {language === 'ar' ? 'بروتوكول الطوارئ والجهات المعتمدة بجنوب سيناء' : 'Emergency & Hyperbaric Directory (Verified)'}
                </h3>
                <span className="text-xs text-[#52C4B7] bg-[#13312B] px-2.5 py-1 rounded-md border border-white/10">
                  {language === 'ar' ? 'آخر تدقيق رسمي: ٢٥ أغسطس ٢٠٢٦' : 'Last verified: Aug 25, 2026'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {(pack.emergencyResources || []).map((resource) => (
                  <div
                    key={resource.id}
                    className={`p-4 rounded-2xl border ${
                      resource.category === 'hyperbaric'
                        ? 'border-red-500/40 bg-red-950/40 text-red-100'
                        : resource.category === 'ambulance'
                        ? 'border-amber-500/40 bg-amber-950/40 text-amber-100'
                        : 'border-white/10 bg-[#13312B] text-[#F7F3EA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          resource.category === 'hyperbaric' ? 'bg-red-900/60 text-red-300' : 'bg-[#0E2520] text-[#52C4B7]'
                        }`}>
                          {resource.category.toUpperCase()} · {resource.status}
                        </span>
                        <h4 className="font-bold text-base mt-1.5">{language === 'ar' ? resource.nameAr : resource.name}</h4>
                      </div>
                    </div>

                    <div className="mt-2 font-mono font-bold text-base text-[#F4C36C] bg-[#081714] px-2.5 py-1.5 rounded-lg border border-white/10 inline-block">
                      {resource.phone}
                    </div>

                    <p className="text-xs text-[#D2E3DE]/70 mt-2">
                      <MapPin className="w-3 h-3 inline mr-1 text-[#52C4B7]" />
                      {language === 'ar' ? resource.locationAr : resource.location}
                    </p>

                    <p className="text-xs text-[#D2E3DE] mt-1 font-medium">
                      {language === 'ar' ? resource.notesAr : resource.notes}
                    </p>

                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D2E3DE]/50">
                      <span>Authority: {resource.owner}</span>
                      <span>Verified: {new Date(resource.verifiedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#13312B] rounded-2xl border border-white/10 text-xs text-[#D2E3DE] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F4C36C] shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'تنبيه سلامة: أرقام الطوارئ تخضع لسياسة تدقيق دورية كل ٣٠ يوماً. لا تفترض صلاحية أرقام الهواتف بشكل دائم دون تأكيد سنترال دهب.'
                    : 'Notice: Emergency contact numbers are revalidated every 30 days. Never assume contacts remain permanently valid without local telecom verification.'}
                </span>
              </div>
            </div>
          )}

          {/* Tab 4: Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h3 className="font-['Outfit',sans-serif] font-bold text-lg text-[#F7F3EA]">
                {language === 'ar' ? 'قائمة الاستعداد الميداني قبل التوجه للمحميات' : 'Field Preparation & Packing Checklist'}
              </h3>
              <div className="space-y-4">
                {pack.practicalChecklist.map((sec, idx) => (
                  <div key={idx} className="bg-[#13312B] border border-white/10 rounded-2xl p-4">
                    <h4 className="font-semibold text-[#F7F3EA] text-sm mb-2 font-['Outfit',sans-serif]">{sec.category}</h4>
                    <ul className="space-y-1.5 text-xs text-[#D2E3DE]">
                      {sec.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#52C4B7] shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-[#081714] p-4 px-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-[#D2E3DE]/70">
            {language === 'ar' ? 'احفظ هذه الصفحة أو حمل الملف لاستخدامه في البلو لاجون ورأس أبو جالوم.' : 'Save this document or download JSON to access in Blue Lagoon & Ras Abu Galum.'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {language === 'ar' ? 'طباعة / PDF' : 'Print / Save PDF'}
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] shadow-md transition cursor-pointer font-['Outfit',sans-serif]"
            >
              <Download className="w-4 h-4" />
              {language === 'ar' ? 'تحميل الحزمة (JSON)' : 'Download Offline Pack'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
