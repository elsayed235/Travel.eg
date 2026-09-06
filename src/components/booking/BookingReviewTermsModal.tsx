import React from 'react';
import { X, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingReviewTermsModalProps {
  onClose: () => void;
}

export const BookingReviewTermsModal: React.FC<BookingReviewTermsModalProps> = ({ onClose }) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div
      id="booking-review-terms-modal"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-review-terms-modal-dialog-1-title"
    >
      <div className="bg-[var(--surface-card)] text-[#1A1A1A] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#1A1A1A]/10 flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1A1A1A]/8 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="booking-review-terms-modal-dialog-1-title" className="text-lg font-serif font-bold text-[#1A1A1A]">
                {isAr ? 'شروط وسياسات الحجز' : 'Booking Terms & Policies'}
              </h3>
              <p className="text-xs text-[#1A1A1A]/60">
                {isAr ? 'شروط مرنة وشفافة لرحلتك إلى دهب' : 'Transparent and flexible terms for your Dahab journey'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-terms-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
          {/* Section 1: Coordinated Trip Guarantee */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A5A40] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span>{isAr ? 'ضمان تنسيق الرحلة الشاملة' : 'Coordinated Trip Guarantee'}</span>
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              {isAr
                ? 'فندقك وانتقالات المطار وباقات الغطس وسفاري الصحراء محجوزة معاً كبرنامج رحلة واحد منسق. في حالة تأخر الطيران أو تغير الأحوال الجوية، يتولى فريقنا المحلي في دهب تعديل كافة المواعيد والأنشطة المرتبطة بسلاسة وتناغم تام.'
                : 'Your hotel, airport transfer, guided diving, and desert safari are booked together as one unified itinerary. If flight delays or weather conditions require shifting an activity, our local Dahab team coordinates adjustments across all related services seamlessly.'}
            </p>
          </div>

          {/* Section 2: Cancellation & Changes by Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A5A40]">
              {isAr ? 'فترات الإلغاء وتعديل المواعيد' : 'Cancellation & Rescheduling Windows'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-[#1A1A1A]/10 bg-[var(--surface-card)] space-y-1">
                <span className="font-bold text-[#1A1A1A] block">{isAr ? '٠١ الإقامة الفندقية' : '01 Hotel Accommodation'}</span>
                <p className="text-[#1A1A1A]/70">
                  {isAr ? 'إلغاء مجاني أو تعديل التاريخ حتى ٤٨ ساعة قبل موعد تسجيل الدخول.' : 'Free cancellation or date adjustment up to 48 hours prior to your scheduled check-in.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#1A1A1A]/10 bg-[var(--surface-card)] space-y-1">
                <span className="font-bold text-[#1A1A1A] block">{isAr ? '٠٢ انتقالات المطار' : '02 Airport Transfer'}</span>
                <p className="text-[#1A1A1A]/70">
                  {isAr ? 'تحديث مجاني لوقت وصول الرحلة حتى ١٢ ساعة قبل الهبوط في شرم الشيخ.' : 'Free flight arrival time updates up to 12 hours before airport landing in Sharm El Sheikh.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#1A1A1A]/10 bg-[var(--surface-card)] space-y-1">
                <span className="font-bold text-[#1A1A1A] block">{isAr ? '٠٣ رحلات الغطس الإرشادية' : '03 Guided Diving'}</span>
                <p className="text-[#1A1A1A]/70">
                  {isAr ? 'استرداد كامل أو نقل اليوم مجاناً حتى ٢٤ ساعة قبل موعد الغطس.' : 'Full refund or free day shift up to 24 hours prior to dive briefing.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#1A1A1A]/10 bg-[var(--surface-card)] space-y-1">
                <span className="font-bold text-[#1A1A1A] block">{isAr ? '٠٤ سفاري الصحراء' : '04 Desert Safari'}</span>
                <p className="text-[#1A1A1A]/70">
                  {isAr ? 'إلغاء مجاني أو إعادة جدولة بسبب الطقس حتى ٢٤ ساعة قبل التحرك.' : 'Free cancellation or weather rescheduling up to 24 hours before desert departure.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Availability Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'شفافية الأسعار والمصاريف' : 'Transparent Pricing'}</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {isAr
                ? 'الأسعار التقديرية معروضة لكامل المجموعة (فردين بالغين). يتم التحقق النهائي من التوافر وتأكيد السعر بدقة قبل خطوة الدفع النهائية. لا توجد أي رسوم إضافية مخفية أو مفاجئة.'
                : 'Estimated prices are displayed for your complete party (2 adults). Final availability and exact price confirmation are verified in the final confirmation stage before any payment is collected. No unexpected surcharge or hidden platform fee is added.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#FDFBF7] border-t border-[#1A1A1A]/8 flex items-center justify-end">
          <button
            type="button"
            id="close-terms-footer-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isAr ? 'فهمت ذلك' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};

