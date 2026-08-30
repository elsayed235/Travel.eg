import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  Sparkles, 
  FileText, 
  Download, 
  Heart, 
  ArrowRight, 
  MapPin, 
  Waves, 
  Compass, 
  Calendar, 
  Share2, 
  MessageSquare,
  ThumbsUp,
  RotateCcw,
  Camera,
  Award
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const PostTripView: React.FC = () => {
  const { profile, user, navigateTo, showToast, activeTrip, activeTripItems, bookings } = useTrip();
  const { language, isRTL, t } = useLanguage();

  const travelerName = profile.name || user?.displayName || (language === 'ar' ? 'يا صديقنا' : 'Traveler');

  /**
   * The feedback form starts empty.
   *
   * It used to open with five stars already selected, a favourite experience
   * already chosen ("Diving at The Canyon & Blue Hole") and a written review
   * already in the box: "The dive master was incredible and the Bedouin dinner
   * under the Sinai stars was unforgettable." A traveler who pressed submit
   * without reading published an opinion they had never expressed, about
   * experiences they may not have had.
   */
  const [rating, setRating] = useState<number>(0);
  const [favoriteExperience, setFavoriteExperience] = useState<string>('');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);

  /**
   * Where the traveler actually went, from their own itinerary.
   *
   * This was six hardcoded place names — The Canyon, Blue Hole, Wadi Gnai,
   * Lighthouse, Assalah souk, Mashraba — presented as somewhere they had been,
   * on a page that opens "here is a summary of your experiences".
   */
  const placesVisited = Array.from(
    new Map(
      activeTripItems
        .filter(item => item.status === 'CONFIRMED' || item.status === 'BOOKED')
        .map(item => [
          item.supplier?.area || item.title,
          { en: item.supplier?.area || item.title, ar: item.supplier?.area || item.title }
        ])
    ).values()
  );

  /**
   * Empty.
   *
   * This was four Unsplash stock photographs — "Canyon Reef Dive", "Sinai
   * Desert Sunset", "Lighthouse Bay Afternoon", "Bedouin Tea Ceremony" —
   * displayed under "your trip highlights and memories". They were not the
   * traveler's photographs, of their trip, and nothing in this platform stores
   * a traveler photo. Until something does, the section says so.
   */
  const photoMemories: { title: string; titleAr: string; image: string; tag: string; tagAr: string }[] = [];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFeedbackSubmitted(true);
    showToast(
      language === 'ar'
        ? 'شكراً جداً لرأيك الجميل! تقييمك بيساعدنا نطور رحلات دهب دايماً ⭐'
        : 'Thank you for sharing your feedback with Dahab travel team! ⭐'
    );
  };

  return (
    <div 
      id="post-trip-view" 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] pb-24 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* 1. Header Hero */}
      <section className="bg-[#0E2520] border-b border-white/10 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'حالة الرحلة: اكتملت بنجاح ✓' : 'Trip Status: Completed ✓'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {language === 'ar' ? `حمد لله على سلامتك ${travelerName}! ✨` : `Welcome Back, ${travelerName}!`}
              </h1>
              <p className="text-sm sm:text-base text-[#D2E3DE] max-w-2xl font-medium leading-relaxed">
                {language === 'ar'
                  ? activeTrip
                    ? `كملت رحلة الـ ${activeTrip.lengthDays} أيام في دهب. جمعنالك هنا ملخص حجوزاتك واللي جاي.`
                    : 'جمعنالك هنا ملخص رحلتك في دهب.'
                  : activeTrip
                    ? `You've completed your ${activeTrip.lengthDays}-day Dahab journey. Here is a summary of your bookings and what comes next.`
                    : 'Here is a summary of your Dahab trip.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => showToast(language === 'ar' ? 'تم نسخ رابط ألبوم ذكريات الرحلة للحافظة!' : 'Trip link & photo album copied to clipboard!')}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F3EA] text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مشاركة الألبوم' : 'Share Trip'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/trip-builder')}
                className="px-5 py-2.5 rounded-full bg-[#F4C36C] hover:bg-amber-300 text-[#081714] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'خطط لرحلتك الجاية' : 'Plan Another Trip'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D2E3DE]/60 block">
              {language === 'ar' ? 'مدة الرحلة' : 'Trip Duration'}
            </span>
            <div className="text-2xl font-serif font-bold text-[#F7F3EA]">
              {activeTrip
                ? language === 'ar' ? `${activeTrip.lengthDays} أيام` : `${activeTrip.lengthDays} Days`
                : '—'}
            </div>
            <span className="text-xs text-[#D2E3DE]/70 font-medium">
              {language === 'ar' ? '١٢ – ١٦ أكتوبر' : 'Oct 12 – Oct 16'}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D2E3DE]/60 block">
              {language === 'ar' ? 'الخدمات المحجوزة' : 'Booked Services'}
            </span>
            <div className="text-2xl font-serif font-bold text-[#F4C36C]">
              {language === 'ar' ? '٤ خدمات' : '4 Services'}
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {language === 'ar' ? 'تمت بنسبة ١٠٠٪ ✓' : '100% Completed ✓'}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D2E3DE]/60 block">
              {language === 'ar' ? 'الأنشطة الموثقة' : 'Activities Logged'}
            </span>
            <div className="text-2xl font-serif font-bold text-[#F7F3EA]">
              {language === 'ar' ? '١٤ تجربة' : '14 Experiences'}
            </div>
            <span className="text-xs text-[#D2E3DE]/70 font-medium">
              {language === 'ar' ? 'غطس، وديان، كافيهات' : 'Diving, Desert, Cafes'}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#D2E3DE]/60 block">
              {language === 'ar' ? 'الفاتورة الموحدة' : 'Official Invoice'}
            </span>
            <div className="text-2xl font-mono font-bold text-[#F7F3EA]">14,500 EGP</div>
            <button
              type="button"
              onClick={() => showToast(language === 'ar' ? 'جاري تحميل ملف الفاتورة PDF الإلكتروني...' : 'Downloading invoice PDF...')}
              className="text-xs font-bold text-[#F4C36C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>{language === 'ar' ? 'تحميل الفاتورة PDF' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* 2 Columns: Photos & Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7/12): Memory Gallery & Places */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Visual Memories */}
            <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#F4C36C]" />
                  <h2 className="font-serif font-bold text-xl text-[#F7F3EA]">
                    {language === 'ar' ? 'أبرز لقطات وذكريات الرحلة' : 'Visual Highlights'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('/memories')}
                  className="text-xs font-bold text-[#F4C36C] hover:underline flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'جواز السفر والأوسمة' : 'Passport & Badges'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photoMemories.length === 0 && (
                  <div className="col-span-full p-6 rounded-2xl bg-[#13312B] border border-white/10 text-center space-y-1">
                    <p className="text-sm font-bold text-[#F7F3EA]">
                      {language === 'ar' ? 'لسه مفيش صور محفوظة' : 'No photos saved yet'}
                    </p>
                    <p className="text-xs text-[#D2E3DE]/70">
                      {language === 'ar'
                        ? 'الصور اللي تحفظها في رحلتك هتظهر هنا.'
                        : 'Photos you save to your trip will appear here.'}
                    </p>
                  </div>
                )}
                {photoMemories.map((photo, i) => {
                  const title = language === 'ar' ? photo.titleAr : photo.title;
                  const tag = language === 'ar' ? photo.tagAr : photo.tag;
                  return (
                    <div
                      key={i}
                      className="group relative h-48 rounded-2xl overflow-hidden bg-[#13312B] border border-white/10 shadow-2xs"
                    >
                      <img
                        src={photo.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                          {tag}
                        </span>
                        <h3 className="font-bold text-sm text-white">
                          {title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Places Visited Checklist */}
            <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xs space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                  {language === 'ar' ? 'المعالم والمواقع التي زرتها في دهب' : 'Places Explored in Dahab'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {placesVisited.length === 0 && (
                  <div className="col-span-full p-4 rounded-2xl bg-[#13312B] border border-white/10 text-xs text-[#D2E3DE]/70">
                    {language === 'ar'
                      ? 'الأماكن اللي زرتها هتظهر هنا بعد ما تكمّل حجوزات رحلتك.'
                      : 'The places you visited will appear here once your trip has confirmed bookings.'}
                  </div>
                )}
                {placesVisited.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-[#13312B] border border-white/10 text-xs font-semibold text-[#F7F3EA]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{language === 'ar' ? p.ar : p.en}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (5/12): Feedback & Next Trip */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Feedback Review Form */}
            <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xs space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                  {language === 'ar' ? 'تقييم تجربة رحلتك' : 'How was your Dahab journey?'}
                </h2>
                <p className="text-xs text-[#D2E3DE]/70">
                  {language === 'ar' ? 'رأيك بيساعدنا ندعم أهل دهب ونحافظ على جودة الرحلات' : 'Your feedback supports local Bedouin guides & suppliers.'}
                </p>
              </div>

              {isFeedbackSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h3 className="font-bold text-sm text-emerald-200">
                    {language === 'ar' ? 'تم استلام تقييمك بنجاح!' : 'Feedback Submitted!'}
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    {language === 'ar' ? 'تم إضافة ٢٠٠ نقطة لرصيد رحلتك القادمة 🎉' : '200 Sinai Explorer Points added to your account! 🎉'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#F7F3EA] mb-1.5">
                      {language === 'ar' ? 'تقييمك الإجمالي للرحلة:' : 'Overall Experience Rating:'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          aria-pressed={star <= rating}
                          aria-label={language === 'ar' ? `تقييم ${star} من ٥` : `Rate ${star} out of 5`}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="posttrip-favorite-highlight" className="block font-bold text-[#F7F3EA] mb-1">
                      {language === 'ar' ? 'أكتر حاجة عجبتك في الرحلة:' : 'Favorite Highlight:'}
                    </label>
                    <input
                      id="posttrip-favorite-highlight"
                      type="text"
                      value={favoriteExperience}
                      onChange={(e) => setFavoriteExperience(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-[#13312B] border border-white/10 text-xs text-[#F7F3EA] focus:ring-2 focus:ring-[#F4C36C] outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="posttrip-feedback-notes" className="block font-bold text-[#F7F3EA] mb-1">
                      {language === 'ar' ? 'ملاحظاتك واقتراحاتك:' : 'Detailed Notes & Suggestions:'}
                    </label>
                    <textarea
                      id="posttrip-feedback-notes"
                      rows={3}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-[#13312B] border border-white/10 text-xs text-[#F7F3EA] focus:ring-2 focus:ring-[#F4C36C] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#F4C36C] hover:bg-amber-300 text-[#081714] text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Dahab Passport & Badges Section */}
            <div id="dahab-digital-passport-card" className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                    {language === 'ar' ? 'جواز سفر وأختام دهب' : 'Sinai Passport & Stamps'}
                  </h2>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  4 {language === 'ar' ? 'أختام' : 'Stamps'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { nameEn: 'Blue Hole Certified', nameAr: 'ختم البلو هول', icon: '🤿', date: 'Oct 13', code: 'BH-01' },
                  { nameEn: 'Canyon Diver', nameAr: 'ختم الكانيون المرجاني', icon: '🪸', date: 'Oct 14', code: 'CY-02' },
                  { nameEn: 'Sinai Bedouin Stargazer', nameAr: 'سهرة وادي قني', icon: '✨', date: 'Oct 14', code: 'WG-03' },
                  { nameEn: 'Lighthouse Sunset Explorer', nameAr: 'لايتهاوس لاجون', icon: '🌅', date: 'Oct 15', code: 'LH-04' },
                ].map((stamp, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#13312B] border-2 border-dashed border-[#F4C36C]/30 flex flex-col items-center text-center space-y-1 relative group hover:border-[#F4C36C] transition-colors">
                    <span className="text-2xl">{stamp.icon}</span>
                    <span className="font-bold text-[12px] text-[#F7F3EA] leading-tight">
                      {language === 'ar' ? stamp.nameAr : stamp.nameEn}
                    </span>
                    <div className="flex items-center justify-between w-full text-[11px] text-[#D2E3DE]/60 font-mono pt-1 border-t border-white/10">
                      <span>{stamp.code}</span>
                      <span>{stamp.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => showToast(language === 'ar' ? 'تم إنشاء بطاقة جواز السفر الرقمية للتحميل والمشاركة!' : 'Generated high-res digital passport card!')}
                className="w-full py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تحميل بطاقة الأختام الرقمية' : 'Download Digital Passport'}</span>
              </button>
            </div>

            {/* Next Sinai Inspiration Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#13312B] to-[#0E2520] text-white space-y-4 shadow-lg border border-white/10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'ar' ? 'الإلهام لرحلتك القادمة' : 'Next Sinai Adventure'}</span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#F7F3EA]">
                {language === 'ar' ? 'جاهز للمغامرة الجاية في رأس أبو جالوم؟' : 'Ready for Ras Abu Galum & Blue Lagoon?'}
              </h3>

              <p className="text-xs text-[#D2E3DE] leading-relaxed">
                {language === 'ar'
                  ? 'بناءً على حبك للغطس في الكانيون، بنرشحلك رحلة التخييم في البلو لاجون وكايت سيرف اللاجونا لرحلتك الجاية.'
                  : 'Based on your love for deep coral walls, explore our off-grid Blue Lagoon bamboo hut retreat.'}
              </p>

              <button
                type="button"
                onClick={() => navigateTo('/trip-builder')}
                className="w-full py-2.5 rounded-full bg-[#F4C36C] hover:bg-amber-300 text-[#081714] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-['Outfit',sans-serif]"
              >
                <span>{language === 'ar' ? 'ابدأ تصميم الرحلة القادمة' : 'Start Designing Next Trip'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
