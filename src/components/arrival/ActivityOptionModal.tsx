import React from 'react';
import { 
  Coffee, 
  Waves, 
  Footprints, 
  MapPin, 
  Clock, 
  DollarSign, 
  X, 
  Check, 
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ActivityOptionModalProps {
  type: 'breakfast' | 'beach' | 'walk' | null;
  onClose: () => void;
  onSelectAction: (title: string) => void;
}

export const ActivityOptionModal: React.FC<ActivityOptionModalProps> = ({
  type,
  onClose,
  onSelectAction,
}) => {
  const { language, isRTL, t } = useLanguage();

  if (!type) return null;

  const contentMap = {
    breakfast: {
      tag: language === 'ar' ? 'فطار قريب منك' : 'Breakfast Nearby',
      title: language === 'ar' ? 'خيارات الفطار ع البحر' : 'Seaside Breakfast Options',
      icon: Coffee,
      iconBg: 'bg-[#13312B] text-[#F4C36C]',
      timeNote: language === 'ar' ? '١٥–٢٠ دقيقة · مفتوح الآن' : '15–20 min away · Open now',
      recommendations: [
        {
          name: language === 'ar' ? 'مطعم وكافيه شمس البدوي (Shams)' : 'Shams Restaurant & Bedouin Cafe',
          desc: language === 'ar' ? 'فطار مصري بلدي، لبنة، فلافل سخنة، شكشوكة وعصير رمان فريش.' : 'Fresh Egyptian breakfast, labneh, falafel, shakshuka, fresh pomegranate juice.',
          distance: language === 'ar' ? '١٥٠م · دقيقتين مشي' : '150m · 2 min walk',
          vibe: language === 'ar' ? 'شلتات مباشرة فوق المية وإطلالة ساحرة ع البحر الأحمر' : 'Cushions directly over the water with Red Sea view',
          price: language === 'ar' ? '٨٠–١٤٠ ج.م للفرد' : '80–140 EGP per person',
        },
        {
          name: language === 'ar' ? 'مخبز رالف الألماني (Ralph\'s German Bakery)' : 'Ralph\'s German Bakery',
          desc: language === 'ar' ? 'مخبوزات ساوردو طازجة، بريتزل، قهوة أوروبية وحلويات مميزة.' : 'Freshly baked sourdough, pretzels, European coffee, pastries.',
          distance: language === 'ar' ? '٣٥٠م · ٥ دقائق مشي' : '350m · 5 min walk',
          vibe: language === 'ar' ? 'حديقة مظللة رايقة جداً بالقرب من اللايتهاوس' : 'Shaded courtyard garden near Lighthouse',
          price: language === 'ar' ? '١١٠–١٨٠ ج.م للفرد' : '110–180 EGP per person',
        },
      ],
      primaryAction: language === 'ar' ? 'الذهاب إلى كافيه شمس' : 'Head to Shams Cafe',
    },
    beach: {
      tag: language === 'ar' ? 'قعدة واسترخاء ع البحر' : 'Beach Relaxation',
      title: language === 'ar' ? 'أماكن الشاطئ القريبة' : 'Nearby Beach Spots',
      icon: Waves,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
      timeNote: language === 'ar' ? 'قريب منك · ٢–٥ دقائق تمشية' : 'Nearby · 2–5 min stroll',
      recommendations: [
        {
          name: language === 'ar' ? 'شاطئ خليج اللايتهاوس' : 'Lighthouse Bay Beach',
          desc: language === 'ar' ? 'مية هادية وصافية، شلتات وشمسيات مظللة ونسيم بحر منعش.' : 'Calm water, shaded sun-beds, soft sand, gentle sea breeze.',
          distance: language === 'ar' ? '٨٠م · دقيقة واحدة' : '80m · 1 min walk',
          vibe: language === 'ar' ? 'مركز تجمع الغطاسين ومحبي السباحة والسنوركلينج' : 'Vibrant local snorkeling & swimmer hub',
          price: language === 'ar' ? 'دخول مجاني مع طلب أي مشروب' : 'Free access with drink order',
        },
        {
          name: language === 'ar' ? 'شاطئ إيل جاردن (Eel Garden)' : 'Eel Garden Beachfront',
          desc: language === 'ar' ? 'شاطئ هادي وشعاب مرجانية مع إطلالة خلابة على جبال سيناء وخليج العقبة.' : 'Quieter reef shore with stunning mountain views across the gulf.',
          distance: language === 'ar' ? '٤٠٠م · ٦ دقائق مشي' : '400m · 6 min walk',
          vibe: language === 'ar' ? 'روقان وهدوء تام في فترة الصباح' : 'Peaceful, uncrowded morning chillout',
          price: language === 'ar' ? 'دخول عام مجاني' : 'Free public access',
        },
      ],
      primaryAction: language === 'ar' ? 'اختيار شاطئ اللايتهاوس' : 'Pick Lighthouse Beach',
    },
    walk: {
      tag: language === 'ar' ? 'تمشية صباحية رايقة' : 'Relaxed Stroll',
      title: language === 'ar' ? 'أول جولة تمشية في دهب' : 'First Walk Around Dahab',
      icon: Footprints,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
      timeNote: language === 'ar' ? 'ريتم هادي · مسار ٢٠–٤٠ دقيقة' : 'Easy pace · 20–40 min loop',
      recommendations: [
        {
          name: language === 'ar' ? 'ممشى اللايتهاوس إلى المشربة' : 'Lighthouse to Mashraba Promenade',
          desc: language === 'ar' ? 'ممشى ساحلي ممتع محاط بمحلات المشغولات اليدوية والسجاد البدوي والكافيهات.' : 'Scenic seaside walkway lined with handicraft shops, Bedouin carpets, and breezy cafes.',
          distance: language === 'ar' ? 'يبدأ من مكانك مباشرة' : 'Starts right outside',
          vibe: language === 'ar' ? 'ممشى ساحلي مخصص للمشاة بدون سيارات' : 'Car-free, pedestrian-friendly coastal path',
          price: language === 'ar' ? 'مجاني' : 'Free',
        },
        {
          name: language === 'ar' ? 'فنار اللايتهاوس ورصيف المراقبة' : 'Lighthouse Beacon & Jetty Viewpoint',
          desc: language === 'ar' ? 'تمشية ١٠ دقائق للفنار التاريخي وحافة الشعاب المرجانية الساحرة.' : 'A quick 10-minute walk to the historic iron lighthouse and coastal reef drop-off.',
          distance: language === 'ar' ? 'على بعد ٢٠٠م' : '200m away',
          vibe: language === 'ar' ? 'مكان ممتاز لأول صور وصول وتأمل البحر' : 'Great spot for arrival photos and sea spotting',
          price: language === 'ar' ? 'مجاني' : 'Free',
        },
      ],
      primaryAction: language === 'ar' ? 'بدء التمشية على الممشى' : 'Start Promenade Walk',
    },
  };

  const item = contentMap[type];
  const Icon = item.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div 
        className="bg-[#0E2520] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border border-white/10 ${item.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                {item.tag}
              </span>
              <h3 className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#D2E3DE] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#52C4B7] flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{item.timeNote}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#0E2520] px-2 py-0.5 rounded-full border border-white/10">
            {language === 'ar' ? 'يناسب نافذة الساعتين و٢٠ دقيقة' : 'Fits in your 2h 20m window'}
          </span>
        </div>

        {/* Recommendations list */}
        <div className="space-y-3">
          {item.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-['Outfit',sans-serif] font-bold text-sm text-[#F7F3EA]">
                  {rec.name}
                </h4>
                <span className="text-[11px] font-bold text-[#52C4B7] bg-[#0E2520] px-2 py-0.5 rounded-full flex-shrink-0 border border-white/10 font-['Outfit',sans-serif]">
                  {rec.distance}
                </span>
              </div>
              <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                {rec.desc}
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-between text-[12px] text-[#D2E3DE]/60 border-t border-white/5 gap-2">
                <span>✨ {rec.vibe}</span>
                <span className="font-semibold text-[#F7F3EA]">{rec.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onSelectAction(item.primaryAction);
              onClose();
            }}
            className="w-full py-3.5 px-5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-['Outfit',sans-serif]"
          >
            <Check className="w-4 h-4 text-[#081714] stroke-[2.5]" />
            <span>{item.primaryAction}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

