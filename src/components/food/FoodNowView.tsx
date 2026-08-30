import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Coffee, 
  Bike, 
  Heart, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  Plus, 
  Minus,
  Navigation,
  Star,
  ShoppingBag,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TravelerNav } from '../mytrip/TravelerNav';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { buildDiningOptions } from '../../services/diningMapper';

interface FoodNowViewProps {
  onBackToMyTrip: () => void;
  onBackToCompanion?: () => void;
  onExploreClick?: () => void;
  onOpenHelp?: () => void;
  onMealAddedToTrip?: (meal: {
    title: string;
    time: string;
    duration: string;
    location: string;
    mode: 'dine-in' | 'delivery';
  }) => void;
}

// These moved to src/shared/types/food.ts. A service needed them
// (diningMapper), and importing a component from a service is a cycle: Vite's
// module graph broke and the whole app fell into its ErrorBoundary. Re-exported
// here so existing importers are unaffected.
export type { FoodCategory, FoodOption } from '../../shared/types/food';
import type { FoodCategory, FoodOption } from '../../shared/types/food';

/** Stable so useApiResource does not re-request on every render. */
const fetchDiningVenues = (signal: AbortSignal) => api.getDahabDining(signal);

export const FoodNowView: React.FC<FoodNowViewProps> = ({
  onBackToMyTrip,
  onBackToCompanion,
  onExploreClick,
  onOpenHelp,
  onMealAddedToTrip,
}) => {
  const { language, isRTL, t } = useLanguage();
  // The greeting and the party line used to name "Ahmed" outright, in both
  // languages, for every traveler. The name comes from the session; with no
  // name the greeting is simply neutral rather than borrowed.
  const { profile, user, activeTrip, sessionUser } = useTrip();
  // First name only: a greeting reads as a greeting, not as a record
  // lookup. "جعان يا Ahmed Mansour؟" is not how anyone is addressed.
  const travelerName = (profile.name || user?.displayName || sessionUser?.name || '').trim().split(/\s+/)[0] || '';
  const partySize = activeTrip?.travelersCount ?? profile.travelersCount ?? 1;
  const [activeTab, setActiveTab] = useState<'home' | 'mytrip' | 'explore' | 'bookings' | 'profile'>('mytrip');

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');

  // Selected Restaurant for focused modal/screen
  const [selectedRestaurant, setSelectedRestaurant] = useState<FoodOption | null>(null);

  // Selected fulfillment mode inside modal: 'eat-here' | 'delivery'
  const [fulfillmentMode, setFulfillmentMode] = useState<'eat-here' | 'delivery'>('eat-here');

  // Full menu modal open state
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);

  // Delivery order workflow state: 'none' | 'confirm' | 'tracking'
  const [deliveryWorkflow, setDeliveryWorkflow] = useState<'none' | 'confirm' | 'tracking'>('none');
  
  // Order items for delivery
  const [orderCart, setOrderCart] = useState<Record<string, number>>({
    'dish-1': 1,
    'dish-2': 1,
    'dish-3': 2,
  });

  // Delivery Tracking Status: 'preparing' | 'picked_up' | 'on_the_way' | 'delivered'
  const [deliveryStatus, setDeliveryStatus] = useState<'preparing' | 'picked_up' | 'on_the_way' | 'delivered'>('preparing');

  // Delivery Schedule conflict simulation state
  const [isDeliveryDelayed, setIsDeliveryDelayed] = useState(false);
  const [scheduleCoordinationState, setScheduleCoordinationState] = useState<'normal' | 'activity_shifted' | 'order_cancelled'>('normal');

  // Eat here Added To Trip state
  const [addedEatHereMeal, setAddedEatHereMeal] = useState<{
    restaurantName: string;
    estimatedTime: string;
  } | null>(null);

  // Empty / No suitable food state simulation toggle
  const [isNoFoodAvailableMode, setIsNoFoodAvailableMode] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3 Primary Curated Recommendations
  const recommendedOptions: FoodOption[] = [
    {
      id: 'rec-1',
      name: 'Al Fanar Local Kitchen',
      nameAr: 'مطعم ومطبخ الفنار البلدي',
      category: 'breakfast',
      categoryTag: 'Local Kitchen',
      categoryTagAr: 'أكل بلدي وشعبي',
      title: 'Authentic Sinai Breakfast & Mezze',
      titleAr: 'فطار ومقبلات سيناوية طازة',
      description: 'A relaxed local spot with freshly baked baladi bread, organic eggs, tahini, and authentic Bedouin tea.',
      descriptionAr: 'قعدة مريحة ع الممشى، عيش بلدي سخن من الفرن، فول مدمس بالزيت الحار، وفلافل مقرمشة بالسمسم مع شاي حبق.',
      distance: '0.6 km',
      distanceAr: '٦٠٠ متر',
      distanceKm: '0.6 km',
      estimatedTime: '45–60 min',
      estimatedTimeAr: '٤٥–٦٠ دقيقة',
      priceLevel: 'Low–Moderate',
      priceEstimate: 'EGP 120–250 per person',
      priceEstimateAr: '١٢٠–٢٥٠ ج.م للفرد',
      badge: 'Best fit',
      badgeAr: 'أنسب اختيار',
      cuisine: 'Egyptian · Bedouin · Coastal Breakfast',
      cuisineAr: 'مصري · بدوي · فطار ع البحر',
      openingStatus: 'Open now · Kitchen active',
      openingStatusAr: 'مفتوح دلوقتي · المطبخ شغال',
      diningDuration: '45–60 min',
      diningDurationAr: '٤٥–٦٠ دقيقة',
      deliveryTime: '35–45 min',
      deliveryTimeAr: '٣٥–٤٥ دقيقة',
      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      popularDishes: [
        {
          id: 'dish-1',
          name: 'Egyptian Deluxe Breakfast',
          nameAr: 'صينية الفطار المصري الديلوكس',
          description: 'Authentic ful medames, crispy falafel, tahini, fresh warm baladi bread, and pickled vegetables.',
          descriptionAr: 'فول مدمس، فلافل مقرمشة بالسمسم، جبنة بالطماطم وزيت الزيتون، عيش سخن ومخلل بلدي.',
          price: 180,
        },
        {
          id: 'dish-2',
          name: 'Charcoal Grilled Half Chicken',
          nameAr: 'نصف فرخة مشوية ع الفحم',
          description: 'Charcoal grilled half-chicken served with herb-infused spiced rice, garlic toum, and salad.',
          descriptionAr: 'دجاج بلدي مشوي بتتبيلة الأعشاب مع أرز مبهر، ثومية، وسلطة بلدي خضرا.',
          price: 320,
        },
        {
          id: 'dish-3',
          name: 'Fresh Sinai Mango & Lemon Mint',
          nameAr: 'عصير مانجو أو ليمون نعناع فريش',
          description: 'Freshly pressed Sinai mango, guava, or iced lemon-mint cooler.',
          descriptionAr: 'مانجو طبيعي فريش أو ليمون نعناع مثلج منعش للشمس.',
          price: 90,
        },
      ],
    },
    {
      id: 'rec-2',
      name: 'Shams Falafel & Grill Express',
      nameAr: 'مطعم شمس للفلافل والمشاوي السريعة',
      category: 'quick',
      categoryTag: 'Quick Lunch',
      categoryTagAr: 'غداء سريع وعصري',
      title: 'Fast & Casual Coastal Wraps',
      titleAr: 'سندوتشات ومشاوي سريعة ع الممشى',
      description: 'A casual option nearby when you want something flavorful without spending too much time.',
      descriptionAr: 'اختيار سريع ولذيذ قريب منك جداً، مناسب لوقتك قبل النشاط بدون أي تعطيل.',
      distance: '0.9 km',
      distanceAr: '٩٠٠ متر',
      distanceKm: '0.9 km',
      estimatedTime: '30–45 min',
      estimatedTimeAr: '٣٠–٤٥ دقيقة',
      priceLevel: 'Moderate',
      priceEstimate: 'EGP 150–280 per person',
      priceEstimateAr: '١٥٠–٢٨٠ ج.م للفرد',
      badge: 'Quick',
      badgeAr: 'سريع وخفيف',
      cuisine: 'Fast Casual · Wraps & Mezze',
      cuisineAr: 'وجبات سريعة · لفائف ومقبلات',
      openingStatus: 'Open now · Fast service',
      openingStatusAr: 'مفتوح دلوقتي · خدمة فورية',
      diningDuration: '30–45 min',
      diningDurationAr: '٣٠–٤٥ دقيقة',
      deliveryTime: '25–35 min',
      deliveryTimeAr: '٢٥–٣٥ دقيقة',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      popularDishes: [
        {
          id: 'dish-2-1',
          name: 'Sesame Falafel & Halloumi Wrap',
          nameAr: 'سندوتش فلافل بحلوم مشوي',
          description: 'Hot falafel patties, grilled halloumi, arugula, tahini sauce in toasted pita.',
          descriptionAr: 'فلافل سمسم سخنة، جبنة حلوم مشوية، جرجير فريش وصوص طحينة في عيش محمص.',
          price: 140,
        },
        {
          id: 'dish-2-2',
          name: 'Kofta & Spiced Fries Plate',
          nameAr: 'طبق كفتة مشوية وبطاطس متبلة',
          description: 'Grilled lamb & beef skewers with golden spiced wedges and sumac salad.',
          descriptionAr: 'سيخين كفتة بلدي مشوية مع بطاطس مقلية متبلة وسلطة بصل بالسماق.',
          price: 290,
        },
        {
          id: 'dish-2-3',
          name: 'Iced Hibiscus Karkadeh',
          nameAr: 'كركديه أسواني مثلج بالنعناع',
          description: 'Chilled sweet Sinai hibiscus tea infused with fresh mint.',
          descriptionAr: 'كركديه بلدي مثلج مروق للدم مع لمسة نعناع فريش.',
          price: 65,
        },
      ],
    },
    {
      id: 'rec-3',
      name: 'Blue Beach Bayfront Lounge',
      nameAr: 'لاونج ومطعم بلو بيتش ع البحر',
      category: 'datenight',
      categoryTag: 'Sea View Lunch',
      categoryTagAr: 'غداء رايق ع الشاطئ',
      title: 'Fresh Catch with Azure Views',
      titleAr: 'سمك طازة وقعدة استجمام ع البحر',
      description: 'A slower lunch with a sea view if you want to relax and soak up the breeze before your afternoon.',
      descriptionAr: 'قعدة مريحة وممتدة ع البحر للاستمتاع بنسيم البحر الأحمر والسمك الطازة المشوي.',
      distance: '1.2 km',
      distanceAr: '١.٢ كم',
      distanceKm: '1.2 km',
      estimatedTime: '60–75 min',
      estimatedTimeAr: '٦٠–٧٥ دقيقة',
      priceLevel: 'Moderate',
      priceEstimate: 'EGP 220–400 per person',
      priceEstimateAr: '٢٢٠–٤٠٠ ج.م للفرد',
      badge: 'Relaxed',
      badgeAr: 'روقان ع البحر',
      cuisine: 'Red Sea Fresh Seafood · Mediterranean',
      cuisineAr: 'سي فود البحر الأحمر · متوسطي',
      openingStatus: 'Open now · Waterfront seating',
      openingStatusAr: 'مفتوح دلوقتي · طاولات شاطئية',
      diningDuration: '60–75 min',
      diningDurationAr: '٦٠–٧٥ دقيقة',
      deliveryTime: '40–50 min',
      deliveryTimeAr: '٤٠–٥٠ دقيقة',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      popularDishes: [
        {
          id: 'dish-3-1',
          name: 'Catch of the Day (Grilled Seabass)',
          nameAr: 'سمكة قاروص مشوية ع الفحم (صيد اليوم)',
          description: 'Fresh local reef seabass chargrilled with lemon, olive oil, sayadieh rice, and cumin tahina.',
          descriptionAr: 'سمكة قاروص طازة مشوية بالزيت والليمون مع أرز صيادية وطحينة بالكمون.',
          price: 390,
        },
        {
          id: 'dish-3-2',
          name: 'Bedouin Mezze Platter',
          nameAr: 'مقبلات ومزة بدوية مشكلة',
          description: 'Smoked baba ghanoush, labneh with zaatar, hummus, stuffed vine leaves, and warm flatbread.',
          descriptionAr: 'بابا غنوج مدخن، لبنة بالزعتر البري، حمص بالكمون، ورق عنب وعيش صاج.',
          price: 240,
        },
        {
          id: 'dish-3-3',
          name: 'Sinai Mint Tea Pot',
          nameAr: 'براد شاي حبق بدوي ع الفحم',
          description: 'Traditional habak desert herb brewed tea served with date biscuits.',
          descriptionAr: 'شاي سيناوي بالأعشاب الطبيعية يقدم مع بسكويت التمر التراثي.',
          price: 75,
        },
      ],
    },
  ];

  // 5 Intent-Based Categories
  const categories: {
    id: FoodCategory;
    icon: string;
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
  }[] = [
    {
      id: 'breakfast',
      icon: '🍳',
      title: 'Breakfast',
      titleAr: 'فطار وروقان',
      subtitle: 'Light & local starters',
      subtitleAr: 'فول وفلافل وعيش سخن',
    },
    {
      id: 'quick',
      icon: '🍔',
      title: 'Quick Bite',
      titleAr: 'سريع وخفيف',
      subtitle: 'Fast & casual wraps',
      subtitleAr: 'سندوتشات سريعة قبل النشاط',
    },
    {
      id: 'local',
      icon: '🍝',
      title: 'Local',
      titleAr: 'أكل بدوي وسي فود',
      subtitle: 'Dahab authentic taste',
      subtitleAr: 'سمك ع الفحم ومطبخ سيناوي',
    },
    {
      id: 'datenight',
      icon: '✨',
      title: 'Sea View',
      titleAr: 'قعدة ع البحر',
      subtitle: 'Relaxed waterfront dining',
      subtitleAr: 'طاولات ممتدة ع الشاطئ',
    },
    {
      id: 'delivery',
      icon: '🛵',
      title: 'Beach Delivery',
      titleAr: 'دليفري ع الشط',
      subtitle: 'Delivered to your shade',
      subtitleAr: 'يوصل لشلتتك أو فندقك',
    },
  ];

  /**
   * The three curated venues plus the ten the destination corpus holds.
   *
   * The curated three are kept rather than replaced because they carry the
   * menus the ordering flow needs; the corpus has none. The corpus venues are
   * appended, deduplicated by name — Ralph's German Bakery is in both — so the
   * page finally shows the real list instead of three hand-written cards.
   */
  const dining = useApiResource(fetchDiningVenues);

  const allOptions = React.useMemo(() => {
    if (!dining.data?.venues?.length) return recommendedOptions;
    const seen = new Set(recommendedOptions.map(o => o.name.toLowerCase().replace(/[^a-z]/g, '')));
    const fromCorpus = buildDiningOptions(dining.data.venues).filter(
      option => !seen.has(option.name.toLowerCase().replace(/[^a-z]/g, ''))
    );
    return [...recommendedOptions, ...fromCorpus];
  }, [dining.data]);

  // Filtered options based on category
  const filteredOptions = selectedCategory === 'all'
    ? allOptions
    : allOptions.filter(o => o.category === selectedCategory || (selectedCategory === 'local' && o.cuisine.toLowerCase().includes('bedouin')));

  // Helper calculations for cart
  const calculateCartTotals = (restaurant: FoodOption) => {
    let subtotal = 0;
    restaurant.popularDishes.forEach(dish => {
      const qty = orderCart[dish.id] || 0;
      subtotal += dish.price * qty;
    });
    const deliveryFee = 30; // standard EGP delivery in Dahab
    const total = subtotal > 0 ? subtotal + deliveryFee : 0;
    return { subtotal, deliveryFee, total };
  };

  const handleUpdateQty = (dishId: string, delta: number) => {
    setOrderCart(prev => {
      const current = prev[dishId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [dishId]: next };
    });
  };

  const handleOpenRestaurant = (option: FoodOption) => {
    setSelectedRestaurant(option);
    setFulfillmentMode('eat-here');
    setDeliveryWorkflow('none');
  };

  const handleProceedToDelivery = (option: FoodOption) => {
    setSelectedRestaurant(option);
    setFulfillmentMode('delivery');
    setDeliveryWorkflow('confirm');
  };

  const handlePlaceDeliveryOrder = () => {
    setDeliveryWorkflow('tracking');
    setDeliveryStatus('preparing');
    showToast(
      language === 'ar'
        ? `تم تأكيد طلبك من ${selectedRestaurant?.nameAr || selectedRestaurant?.name} وبيتحضر دلوقتي 🛵`
        : `Order placed at ${selectedRestaurant?.name}! Kitchen is preparing your meal 🛵`
    );
  };

  const handleAddEatHereToTrip = (restaurant: FoodOption) => {
    setAddedEatHereMeal({
      restaurantName: language === 'ar' ? restaurant.nameAr : restaurant.name,
      estimatedTime: '01:00 PM – 02:00 PM',
    });

    if (onMealAddedToTrip) {
      onMealAddedToTrip({
        title: `Lunch at ${restaurant.name}`,
        time: '01:00 PM',
        duration: '1 hr',
        location: restaurant.name,
        mode: 'dine-in',
      });
    }

    showToast(
      language === 'ar'
        ? `تمت إضافة الغداء في "${restaurant.nameAr}" لجدول اليوم ٢ بنجاح ✓`
        : `Lunch at ${restaurant.name} added to your Day 2 schedule ✓`
    );
  };

  const handleShiftActivity = () => {
    setScheduleCoordinationState('activity_shifted');
    setIsDeliveryDelayed(false);
    showToast(
      language === 'ar'
        ? 'تم ترحيل نشاط الساعة ٣:٠٠ عصراً إلى ٣:٤٥ عصراً تلقائياً. جدولك آمن ومحمي ✓'
        : 'Updated: 03:00 PM activity shifted to 03:45 PM. Schedule is clear ✓'
    );
  };

  const handleCancelDelivery = () => {
    setScheduleCoordinationState('order_cancelled');
    setDeliveryWorkflow('none');
    setIsDeliveryDelayed(false);
    showToast(
      language === 'ar'
        ? 'تم إلغاء الطلب بدون أي رسوم. جدولك كما هو.'
        : 'Order cancelled. No charges applied.'
    );
  };

  const handleNavigate = (tab: 'home' | 'mytrip' | 'explore' | 'bookings' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home' || tab === 'mytrip') {
      onBackToMyTrip();
    } else if (tab === 'explore' && onExploreClick) {
      onExploreClick();
    } else if (tab === 'bookings') {
      onBackToMyTrip();
    } else if (tab === 'profile') {
      showToast(
        sessionUser
          ? `Signed in as ${sessionUser.name || sessionUser.email}`
          : language === 'ar'
            ? 'مش مسجّل دخول'
            : 'Not signed in'
      );
    }
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/20"
    >
      {/* 1. TRAVELER TOP NAVIGATION */}
      <TravelerNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenHelp={onOpenHelp}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        
        {/* Top Breadcrumb & Prototype State Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="back-to-mytrip-btn"
              onClick={onBackToCompanion || onBackToMyTrip}
              className="inline-flex items-center gap-1.5 py-3.5 -my-2 text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{language === 'ar' ? 'الرجوع للمرافق اليومي (اليوم ٢)' : 'Back to Daily Companion (Day 2)'}</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              id="full-itinerary-link"
              onClick={onBackToMyTrip}
              className="text-xs font-bold text-[#52C4B7] hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'الجدول الكامل' : 'Full Itinerary'}
            </button>
          </div>

          {/* Prototype Switcher: Normal Food Options vs No Suitable Options Fallback */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 bg-[#13312B] p-0.5 rounded-full text-[12px] font-semibold text-[#D2E3DE] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsNoFoodAvailableMode(false);
                  showToast(language === 'ar' ? 'عرض ترشيحات الغداء الساعة ٠١:٠٠ م' : 'Showing personalized options for 01:00 PM');
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${!isNoFoodAvailableMode ? 'bg-[#F4C36C] text-[#081714] font-bold shadow-xs' : 'hover:text-[#F7F3EA]'}`}
              >
                {language === 'ar' ? 'خيارات متاحة (Normal)' : 'Food Available'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNoFoodAvailableMode(true);
                  showToast(language === 'ar' ? 'حالة: الوقت لا يكفي لمطعم' : 'Mode: No nearby food fits schedule');
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${isNoFoodAvailableMode ? 'bg-[#F4C36C] text-[#081714] font-bold shadow-xs' : 'hover:text-[#F7F3EA]'}`}
              >
                {language === 'ar' ? 'الوقت ضيق (Fallback)' : 'No Nearby Food State'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. PAGE HEADER with Decision Pills */}
        <div className="space-y-4 mb-8">
          
          {/* Header Context Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-['Outfit',sans-serif]">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E2520] text-[#52C4B7] border border-white/10 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#52C4B7]" />
                <span>{language === 'ar' ? '📍 موقعك: ممشى اللايتهاوس، دهب' : '📍 Near you (Near Dahab Lighthouse)'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E2520] text-[#F7F3EA] border border-white/10 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
                <span>{language === 'ar' ? '🕐 الوقت: ٠١:٠٠ ظهراً' : '🕐 01:00 PM'}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#13312B] text-[#F4C36C] text-xs font-bold border border-[#F4C36C]/30 shadow-xs font-['Outfit',sans-serif]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{language === 'ar' ? '⏱ الوقت المتاح قبل نشاطك القادم: ساعتين' : '⏱ Before your next activity: 2h'}</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F7F3EA] tracking-tight flex items-center gap-3">
              <span>
                {language === 'ar'
                  ? travelerName
                    ? `جعان يا ${travelerName}؟ 🍽️`
                    : 'جعان؟ 🍽️'
                  : travelerName
                    ? `Hungry, ${travelerName}? 🍽️`
                    : 'Hungry? 🍽️'}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#D2E3DE]/80 max-w-3xl font-normal leading-relaxed">
              {language === 'ar'
                ? 'جمعنالك أفضل خيارات أكل قريبة منك في دهب، محسوبة بالدقيقة علشان تناسب وقتك وميزانيتك بدون أي تأخير عن نشاطك القادم.'
                : "We've found a few good options near you that fit the time you have, keeping your afternoon relaxed and protected."}
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW BODY: NORMAL OPTIONS vs NO NEARBY FOOD STATE           */}
        {/* ============================================================ */}

        {isNoFoodAvailableMode ? (
          /* ------------------------------------------------------------ */
          /* NO NEARBY FOOD STATE (< 30 min window or remote location)    */
          /* ------------------------------------------------------------ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-[#0E2520] rounded-3xl p-7 sm:p-9 border border-amber-500/30 shadow-xl space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-2xl shadow-xs">
                  🍽️
                </div>

                <div className="space-y-2 text-start">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar'
                      ? 'الوقت ضيق على قعدة مطعم قبل ميعادك الجاي.'
                      : 'Nothing nearby fits your schedule right now.'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#D2E3DE]/80 leading-relaxed">
                    {language === 'ar'
                      ? 'قعدة المطعم وتحضير الأكل في منطقتك حالياً هياخد وقت ويدخل في ميعاد نشاطك الساعة ٣:٠٠ عصراً. دي ٣ بدايل سريعة ومريحة:'
                      : 'Dine-in kitchens in your immediate radius would cut too close to your 03:00 PM activity. Here are 3 alternative solutions:'}
                  </p>
                </div>

                {/* 3 Alternative Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNoFoodAvailableMode(false);
                      handleProceedToDelivery(recommendedOptions[0]);
                    }}
                    className="text-start p-5 rounded-2xl bg-[#13312B] hover:bg-[#1a4038] border border-white/10 hover:border-[#F4C36C]/50 transition-all space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛵</span>
                      <h3 className="font-bold text-sm text-[#F7F3EA] group-hover:text-[#F4C36C]">
                        {language === 'ar' ? 'دليفري لمكانك' : 'Delivery'}
                      </h3>
                    </div>
                    <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                      {language === 'ar'
                        ? 'اطلب دليفري يوصل لشلتتك أو فندقك في ٣٠–٤٠ دقيقة وأنت مريح.'
                        : 'Order directly to your spot. Arrives in 30–40 min while you relax.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(language === 'ar' ? 'فتحنا اللوكيشن لكافيه شمس (١٢٠ متر منك)' : 'Directions to Shams Coffee (120m away) opened.');
                    }}
                    className="text-start p-5 rounded-2xl bg-[#13312B] hover:bg-[#1a4038] border border-white/10 hover:border-[#F4C36C]/50 transition-all space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">☕</span>
                      <h3 className="font-bold text-sm text-[#F7F3EA] group-hover:text-[#F4C36C]">
                        {language === 'ar' ? 'قهوة وسناكس' : 'Coffee & Snack'}
                      </h3>
                    </div>
                    <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                      {language === 'ar'
                        ? 'خدلك آيس كوفي أو شاي بالحبق مع حاجة خفيفة ع السريع في اللايتهاوس.'
                        : 'Grab an iced espresso or mint tea with a pastry right at the lighthouse.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(language === 'ar' ? 'ظبطنالك تذكير بعشاء رايق الساعة ٥:٣٠ بعد نشاطك ✓' : 'Dinner reservation reminder set for 05:30 PM after your activity ✓');
                    }}
                    className="text-start p-5 rounded-2xl bg-[#13312B] hover:bg-[#1a4038] border border-white/10 hover:border-[#F4C36C]/50 transition-all space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⏳</span>
                      <h3 className="font-bold text-sm text-[#F7F3EA] group-hover:text-[#F4C36C]">
                        {language === 'ar' ? 'أجّل الأكلة لبعدين' : 'Wait until later'}
                      </h3>
                    </div>
                    <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                      {language === 'ar'
                        ? 'اتغدى عشاء رايق ومبسوط بعد ما تخلص نشاطك الساعة ٣:٠٠ عصراً.'
                        : 'Have a great dinner right after your 03:00 PM activity finishes.'}
                    </p>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#D2E3DE]/60 font-mono">
                    {language === 'ar'
                      ? travelerName
                        ? `محسوبة لـ${travelerName} · نافذة ساعتين`
                        : 'محسوبة على نافذة ساعتين'
                      : travelerName
                        ? `Calculated for ${travelerName} · 2h window`
                        : 'Calculated for a 2h window'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNoFoodAvailableMode(false)}
                    className="text-xs font-bold text-[#F4C36C] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? '← ارجع للاقتراحات المتاحة' : 'Switch back to 3 food recommendations →'}
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar Context */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'محددات الجدول اللحظي' : 'Context Parameters'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F4C36C]">01:00 PM</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#D2E3DE]">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'الموقع الحالي:' : 'Location:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'اللايتهاوس، دهب' : 'Near Dahab Lighthouse'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'النشاط القادم:' : 'Next Activity:'}</span>
                    <span className="font-bold text-emerald-400">03:00 PM (Safaris)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'إيقاع اليوم:' : 'Pace:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'متوازن ومريح' : 'Balanced & Relaxed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (

          /* ------------------------------------------------------------ */
          /* STANDARD FOOD NOW VIEW (Desktop 7/12 vs 5/12)                */
          /* ------------------------------------------------------------ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ============================================================ */}
            {/* MAIN COLUMN (7/12): CATEGORIES + 3 RECOMMENDATIONS + MODAL  */}
            {/* ============================================================ */}
            <div className="lg:col-span-7 space-y-8">

              {/* A. EAT HERE ADDED CONFIRMATION BANNER */}
              {addedEatHereMeal && (
                <div 
                  id="meal-added-success-banner"
                  className="bg-emerald-950/70 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
                        ✓
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block font-['Outfit',sans-serif]">
                          {language === 'ar' ? 'تم تحديث جدول الرحلة' : 'Trip Updated'}
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                          {language === 'ar' ? 'تمت الإضافة لجدول رحلتك ✓' : 'Added to your trip ✓'}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAddedEatHereMeal(null)}
                      className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed font-medium">
                    {language === 'ar'
                      ? `تمت جدولة غدائك في ${addedEatHereMeal.restaurantName} بنجاح ضمن تسلسل اليوم الثاني.`
                      : `Your meal at ${addedEatHereMeal.restaurantName} has been integrated into your live trip schedule.`}
                  </p>

                  {/* Updated Timeline Preview */}
                  <div className="p-3.5 rounded-2xl bg-[#0E2520] border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#F7F3EA] font-bold">
                      <span className="font-mono text-[#F4C36C]">01:00 PM</span>
                      <span>🍽️ {language === 'ar' ? `غداء في ${addedEatHereMeal.restaurantName}` : `Lunch at ${addedEatHereMeal.restaurantName}`}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span className="font-mono">02:00 PM</span>
                      <span>{language === 'ar' ? 'إنهاء الغداء ومشي خفيف ع الممشى' : 'Finish lunch & relaxed walk'}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-bold border-t border-white/10 pt-1.5">
                      <span className="font-mono">03:00 PM</span>
                      <span>⭐ {language === 'ar' ? 'نشاط السفاري (محمي بدون أي تعارض)' : 'Next Activity (Protected)'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onBackToCompanion || onBackToMyTrip}
                      className="px-4 py-2 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {language === 'ar' ? 'عرض في المرافق اليومي ←' : 'View in Daily Companion →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddedEatHereMeal(null)}
                      className="text-xs font-semibold text-[#D2E3DE] hover:text-[#F4C36C] hover:underline cursor-pointer"
                    >
                      {language === 'ar' ? 'اختيار مطعم آخر' : 'Choose another restaurant'}
                    </button>
                  </div>
                </div>
              )}

              {/* B. FOOD CATEGORIES (Intent-Based, Visually Simple) */}
              <section
                id="food-categories-section"
                aria-label={language === 'ar' ? 'تصنيفات الأكل' : 'Food categories'}
                className="space-y-3"
              >
                {/* The section carried an eyebrow and a hint but no heading, so
                    the category names below jumped from the page h1 to h4. */}
                <h2 className="sr-only">
                  {language === 'ar' ? 'تصنيفات الأكل حسب المود' : 'Intent-based food categories'}
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'تصنيفات الأكل حسب المود' : 'Intent-Based Food Categories'}
                  </span>
                  <span className="text-xs text-[#D2E3DE]/60 font-medium">
                    {language === 'ar' ? 'اختار مودك' : 'Select your mood'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        id={`category-btn-${cat.id}`}
                        onClick={() => {
                          setSelectedCategory(isSelected ? 'all' : cat.id);
                          if (cat.id === 'delivery') {
                            handleProceedToDelivery(recommendedOptions[0]);
                          } else {
                            showToast(language === 'ar' ? `تمت التصفية حسب: ${cat.titleAr}` : `Filtered by ${cat.title}`);
                          }
                        }}
                        className={`p-3.5 rounded-2xl text-left rtl:text-right border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#13312B] border-2 border-[#F4C36C] text-[#F7F3EA] shadow-[0_0_15px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                            : 'bg-[#0E2520] hover:bg-[#13312B] text-[#F7F3EA] border-white/10 shadow-xs hover:border-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-1.5">{cat.icon}</div>
                        <div className="space-y-0.5">
                          <h3 className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-[#F4C36C]' : 'text-[#F7F3EA]'}`}>
                            {language === 'ar' ? cat.titleAr : cat.title}
                          </h3>
                          <p className={`text-[11px] leading-tight ${isSelected ? 'text-[#D2E3DE]' : 'text-[#D2E3DE]/60'}`}>
                            {language === 'ar' ? cat.subtitleAr : cat.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* C. RECOMMENDED FOR YOU (Exactly 3 Curated Options) */}
              <section id="recommended-for-you-section" className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'ترشيحات مختارة لك' : 'Recommended for you'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#D2E3DE]/70 font-medium">
                    {language === 'ar'
                      ? 'مطاعم قريبة، مضمونة الجودة، وتناسب وقتك وميزانيتك.'
                      : 'These options fit your time, location, and budget perfectly.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredOptions.map((option) => {
                    return (
                      <div
                        key={option.id}
                        id={`food-card-${option.id}`}
                        className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl hover:border-[#F4C36C]/40 hover:shadow-2xl transition-all space-y-4"
                      >
                        {/* Top Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                              option.badge === 'Best fit'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : option.badge === 'Quick'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}>
                              {language === 'ar' ? option.badgeAr : option.badge}
                            </span>
                            <span className="text-xs font-bold text-[#F7F3EA]">
                              {language === 'ar' ? option.nameAr : option.name}
                            </span>
                            <span className="text-[11px] bg-[#13312B] text-[#52C4B7] font-semibold px-2 py-0.5 rounded border border-white/10">
                              {language === 'ar' ? 'موثوق ✓' : 'VERIFIED'}
                            </span>
                          </div>

                          {typeof option.rating === 'number' && (
                            <div className="flex items-center gap-1.5 text-xs text-[#D2E3DE]/80 font-medium">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-[#F7F3EA]">{option.rating}</span>
                              {typeof option.reviewCount === 'number' && (
                                <span className="text-[#D2E3DE]/50">({option.reviewCount})</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Content & Thumbnail */}
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="w-full sm:w-28 h-28 sm:h-24 rounded-2xl overflow-hidden bg-[#13312B] flex-shrink-0 relative border border-white/10">
                            {/* Corpus venues carry no photograph; a stock
                                image would imply one exists. */}
                            {option.imageUrl ? (
                              <img
                                src={option.imageUrl}
                                alt={option.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#13312B] to-[#081714]" />
                            )}
                            <div className="absolute top-1.5 left-1.5 rtl:right-1.5 rtl:left-auto px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
                              {language === 'ar' ? option.distanceAr : option.distance}
                            </div>
                          </div>

                          <div className="space-y-1.5 flex-1">
                            <h3 className="font-serif font-bold text-lg text-[#F7F3EA]">
                              {language === 'ar' ? option.titleAr : option.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed">
                              {language === 'ar' ? option.descriptionAr : option.description}
                            </p>

                            {/* 3 Metric Pills */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                              <span className="px-2.5 py-1 rounded-xl bg-[#13312B] border border-white/10 text-[#D2E3DE] font-medium">
                                📍 <strong>{language === 'ar' ? option.distanceAr : option.distance}</strong>
                              </span>
                              <span className="px-2.5 py-1 rounded-xl bg-[#13312B] border border-white/10 text-[#F4C36C] font-bold">
                                ⏱ <strong>{language === 'ar' ? option.estimatedTimeAr : option.estimatedTime}</strong>
                              </span>
                              <span className="px-2.5 py-1 rounded-xl bg-[#13312B] border border-white/10 text-[#D2E3DE] font-medium">
                                💰 <strong>{language === 'ar' ? option.priceEstimateAr : option.priceLevel}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>
                              {language === 'ar'
                                ? 'يترك أكثر من ٤٥ دقيقة راحة قبل نشاطك الساعة ٣:٠٠ عصراً'
                                : 'Leaves >45 min before your 3:00 PM activity'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              id={`view-btn-${option.id}`}
                              onClick={() => handleOpenRestaurant(option)}
                              className="px-5 py-2 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                            >
                              <span>{language === 'ar' ? 'عرض التفاصيل والمنيو' : 'View'}</span>
                              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>

              {/* D. WHY THESE OPTIONS? CONTEXTUAL EXPLANATION */}
              <section 
                id="why-these-options-box"
                className="p-5 sm:p-6 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xl space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4C36C]" />
                  <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'ليه اخترنالك الأماكن دي بالذات؟' : 'Why these options?'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed font-medium">
                  {language === 'ar'
                    ? 'الأماكن دي قريبة منك، ملتزمة بمعايير النظافة وسرعة التحضير، ومحسوبة بالدقيقة قبل نشاطك القادم.'
                    : "They're close to you, fit your budget, and leave ample buffer before your next activity."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-[#D2E3DE]">
                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                    <span className="font-bold text-[#F4C36C] block">
                      📍 {language === 'ar' ? 'قريبة من موقعك' : 'Location Aware'}
                    </span>
                    <p className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'على بعد ٦٠٠م–١.٢ كم من اللايتهاوس لتوفير وقت المواصلات.' : 'Within 0.6–1.2 km of Lighthouse so you don’t waste time.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                    <span className="font-bold text-[#F4C36C] block">
                      💰 {language === 'ar' ? 'مطابقة لميزانيتك' : 'Budget Aligned'}
                    </span>
                    <p className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'متوافقة مع تفضيل ميزانية متوسطة لفردين.' : 'Matches your Moderate budget preference for 2 adults.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                    <span className="font-bold text-emerald-400 block">
                      ⏱ {language === 'ar' ? 'جدولك محمي' : 'Time Protected'}
                    </span>
                    <p className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'تنتهي من الغداء بحلول ٢:٠٠–٢:١٥ م بدون أي استعجال.' : 'Finishes by 02:00–02:15 PM, leaving zero stress.'}
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* ============================================================ */}
            {/* SECONDARY COLUMN (5/12): CONTEXT CARD + TIMELINE PROTECTION */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. CURRENT CONTEXT CARD */}
              <div 
                id="current-food-context-card"
                className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                      {language === 'ar' ? 'السياق والمحددات الحالية' : 'Current Context'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F4C36C] bg-[#F4C36C]/10 px-2.5 py-0.5 rounded-full border border-[#F4C36C]/30">
                    01:00 PM
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#D2E3DE]">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'المسافر:' : 'Traveler:'}</span>
                    <span className="font-bold text-[#F7F3EA]">
                      {[travelerName, `${partySize} ${language === 'ar' ? (partySize === 1 ? 'بالغ' : 'بالغين') : partySize === 1 ? 'adult' : 'adults'}`]
                        .filter(Boolean)
                        .join(language === 'ar' ? ' · ' : ' · ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'الموقع الحالي:' : 'Location:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'ممشى اللايتهاوس' : 'Near Dahab Lighthouse'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'الوقت المتاح:' : 'Available time:'}</span>
                    <span className="font-bold text-[#F4C36C]">{language === 'ar' ? 'حوالي ١.٥ – ٢ ساعة' : 'Approx. 1.5–2 hours'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'الميزانية:' : 'Budget:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'متوسطة (Moderate)' : 'Moderate'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">{language === 'ar' ? 'الاهتمامات والإيقاع:' : 'Interests & Pace:'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'طعام محلي · مغامرة · روقان' : 'Food · Adventure · Balanced'}</span>
                  </div>
                </div>

                <p className="text-[12px] text-[#D2E3DE]/60 leading-relaxed italic text-center pt-1">
                  {language === 'ar'
                    ? 'الترشيحات تستثني الأماكن المزدحمة جداً والمطابخ البطيئة علشان تحافظ على هدوء وسلامة جدولك.'
                    : 'Recommendations filter out overcrowded tourist traps and long-cook kitchens so you stay relaxed.'}
                </p>
              </div>

              {/* 2. NEXT PLANNED ACTIVITY (Protected) */}
              <div 
                id="next-activity-protection-card"
                className="bg-[#0E2520] rounded-3xl p-6 border-2 border-emerald-500/40 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                      {language === 'ar' ? 'النشاط القادم في جدولك' : 'Next Planned Activity'}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {language === 'ar' ? 'محمي بالكامل ✓' : 'Protected'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-[#F4C36C]">
                      {language === 'ar' ? '٠٣:٠٠ عصراً (بعد ساعتين)' : '03:00 PM (in 2 hours)'}
                    </span>
                    <h4 className="font-bold text-sm text-[#F7F3EA]">
                      {language === 'ar' ? 'رحلة سفاري البيتش باجي في الصحراء' : 'Desert Quad Excursion / Coastal Tour'}
                    </h4>
                    <p className="text-xs text-[#D2E3DE]/65">
                      {language === 'ar' ? 'نقطة التجمع: مركز سفاري دهب' : 'Meeting point: Dahab Safari Hub'}
                    </p>
                  </div>
                  <span className="text-2xl">🏜️</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#081714] border border-white/10 text-xs text-[#D2E3DE] space-y-1">
                  <span className="font-bold text-[#F4C36C]">
                    {language === 'ar' ? 'ضمان الوقت الكافي:' : 'Time Safe Guarantee:'}
                  </span>
                  <p>
                    {language === 'ar'
                      ? 'سواء قعدت في المطعم أو طلبت دليفري، هتخلص أكلك قبل ٠٢:١٥ م مع وقت كافي جداً للتنقل.'
                      : 'Whether you eat in or order delivery, you will finish dining before 02:15 PM with ample transfer buffer.'}
                  </p>
                </div>
              </div>

              {/* 3. QUICK DELIVERY SHORTCUT */}
              <div 
                id="quick-delivery-card"
                className="bg-gradient-to-br from-[#13312B] to-[#0E2520] border border-[#F4C36C]/30 text-white rounded-3xl p-6 shadow-xl space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4C36C]/20 text-[#F4C36C] text-[11px] font-bold uppercase tracking-wider border border-[#F4C36C]/30">
                    <Bike className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'خدمة توصيل شاطئية' : 'Bedouin Delivery'}</span>
                  </div>
                  <span className="text-xs font-mono text-[#D2E3DE] font-bold">35–45 min</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'حبيت تفضل في مكانك ع الشط؟' : 'Want to stay where you are?'}
                  </h4>
                  <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                    {language === 'ar'
                      ? 'اطلب عيش طازة، مشاوي سخنة ع الفحم، وعصائر مثلجة توصل مباشرة لشلتتك أو فندقك في دهب.'
                      : 'Have hot flatbreads, skewers, and chilled juices delivered directly to your shade spot at Lighthouse.'}
                  </p>
                </div>

                <button
                  type="button"
                  id="order-delivery-shortcut-btn"
                  onClick={() => handleProceedToDelivery(recommendedOptions[0])}
                  className="w-full py-2.5 px-4 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Bike className="w-3.5 h-3.5 text-[#081714]" />
                  <span>{language === 'ar' ? 'اطلب دليفري لمكاني دلوقتي' : 'Order Delivery to My Spot'}</span>
                </button>
              </div>

            </div>

          </div>

        )}

      </main>

      {/* ============================================================ */}
      {/* RESTAURANT DETAIL MODAL / FOCUSED VIEW                       */}
      {/* ============================================================ */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-2xl w-full my-8 border border-white/15 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header & Hero Image */}
            <div className="relative h-48 sm:h-56 w-full bg-[#13312B] flex-shrink-0">
              {selectedRestaurant.imageUrl ? (
                <img
                  src={selectedRestaurant.imageUrl}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#13312B] to-[#081714]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E2520] via-black/40 to-black/20" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRestaurant(null);
                  setDeliveryWorkflow('none');
                }}
                className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-extrabold shadow-xs">
                  {language === 'ar' ? selectedRestaurant.badgeAr : selectedRestaurant.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold backdrop-blur-xs border border-white/20">
                  {language === 'ar' ? selectedRestaurant.openingStatusAr : selectedRestaurant.openingStatus}
                </span>
              </div>

              {/* Title & Info on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                  <span>{language === 'ar' ? selectedRestaurant.cuisineAr : selectedRestaurant.cuisine}</span>
                  {typeof selectedRestaurant.rating === 'number' && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">{selectedRestaurant.rating}</span>
                        {typeof selectedRestaurant.reviewCount === 'number' && (
                          <span className="text-white/70">({selectedRestaurant.reviewCount})</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {language === 'ar' ? selectedRestaurant.nameAr : selectedRestaurant.name}
                </h2>
              </div>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-grow text-[#D2E3DE]">
              
              {/* Short description */}
              <p className="text-sm text-[#D2E3DE] leading-relaxed font-medium">
                {language === 'ar' ? selectedRestaurant.descriptionAr : selectedRestaurant.description}
              </p>

              {/* IMPORTANT TIMING INFORMATION (Key Highlight Requirement) */}
              <div 
                id="restaurant-timing-banner"
                className="p-4 sm:p-5 rounded-2xl bg-[#13312B] border border-emerald-500/40 space-y-2 text-xs sm:text-sm text-[#F7F3EA]"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'معلومات التوقيت وضمان الجدول' : 'Important Timing Information'}</span>
                </div>

                <div className="space-y-1 text-xs text-[#D2E3DE] font-medium">
                  <p>• <strong>{language === 'ar' ? 'لديك حوالي ساعتين قبل نشاطك القادم.' : 'You have about 2 hours before your next activity.'}</strong></p>
                  <p>• <strong>{language === 'ar' ? `متوسط وقت تناول الوجبة: ${selectedRestaurant.diningDurationAr}` : `Estimated meal time: ${selectedRestaurant.diningDuration}`}</strong></p>
                  <p className="text-emerald-300 font-bold">
                    ✓ {language === 'ar' ? 'سيكون لديك متسع كافي من الوقت للوصول لنشاطك القادم.' : "You'll still have enough time to get to your next activity."}
                  </p>
                </div>
              </div>

              {/* 4 Metric Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                  <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/60 block">{language === 'ar' ? 'المسافة' : 'Distance'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? selectedRestaurant.distanceAr : selectedRestaurant.distance}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                  <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/60 block">{language === 'ar' ? 'وقت القعدة' : 'Dine-in Time'}</span>
                  <span className="font-bold text-[#F4C36C]">{language === 'ar' ? selectedRestaurant.diningDurationAr : selectedRestaurant.diningDuration}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                  <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/60 block">{language === 'ar' ? 'الميزانية' : 'Price Range'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? selectedRestaurant.priceEstimateAr : selectedRestaurant.priceLevel}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                  <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/60 block">{language === 'ar' ? 'وقت التوصيل' : 'Delivery Est.'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? selectedRestaurant.deliveryTimeAr : selectedRestaurant.deliveryTime}</span>
                </div>
              </div>

              {/* A venue from the destination corpus has no menu, and every one
                  of them is WALK_IN — the platform cannot take an order for
                  them. Showing an empty basket would be an offer it cannot
                  honour, so the panel says what the traveler can actually do. */}
              {selectedRestaurant.popularDishes.length === 0 && (
                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                  <p className="font-bold text-[#F7F3EA] text-sm">
                    {language === 'ar' ? 'الطلب أونلاين مش متاح هنا' : 'No online ordering here'}
                  </p>
                  <p className="text-xs text-[#D2E3DE]/75 leading-relaxed">
                    {language === 'ar'
                      ? 'المكان ده بيستقبل الزباين على الطبيعة. روح في مواعيد الفتح فوق.'
                      : 'This place takes walk-ins. Go during the opening hours shown above.'}
                  </p>
                </div>
              )}

              {/* MENU PREVIEW (Small Selection of Popular Dishes) */}
              {selectedRestaurant.popularDishes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'أشهر الأطباق والطلبات' : 'Popular Dishes'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFullMenuOpen(true)}
                    className="text-xs font-bold text-[#F4C36C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'عرض المنيو الكامل' : 'View full menu'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedRestaurant.popularDishes.map((dish) => {
                    const qty = orderCart[dish.id] || 0;
                    return (
                      <div 
                        key={dish.id}
                        className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <h4 className="font-bold text-sm text-[#F7F3EA]">
                              {language === 'ar' ? dish.nameAr : dish.name}
                            </h4>
                            <span className="text-xs font-bold text-[#F4C36C]">EGP {dish.price}</span>
                          </div>
                          <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                            {language === 'ar' ? dish.descriptionAr : dish.description}
                          </p>
                        </div>

                        {fulfillmentMode === 'delivery' && (
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              className="w-7 h-7 rounded-full bg-[#081714] border border-white/20 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-[#F7F3EA] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-[#F4C36C]">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              className="w-7 h-7 rounded-full bg-[#F4C36C] text-[#081714] hover:bg-[#E5B55D] flex items-center justify-center text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {/* ORDER OPTIONS: "Eat here" vs "Delivery" */}
              {selectedRestaurant.popularDishes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'طريقة الاستمتاع بالوجبة' : 'Choose Fulfillment'}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* Eat Here Button Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMode('eat-here');
                      setDeliveryWorkflow('none');
                    }}
                    className={`p-4 rounded-2xl text-left rtl:text-right border transition-all cursor-pointer space-y-1 ${
                      fulfillmentMode === 'eat-here'
                        ? 'border-2 border-[#F4C36C] bg-[#13312B] shadow-[0_0_15px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                        : 'border-white/10 bg-[#0E2520] hover:bg-[#13312B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F7F3EA] flex items-center gap-1.5">
                        <span>🍽️</span>
                        <span>{language === 'ar' ? 'قعدة في المطعم' : 'Eat here'}</span>
                      </span>
                      {fulfillmentMode === 'eat-here' && (
                        <Check className="w-4 h-4 text-[#F4C36C]" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'مشي خفيف · ٤٥–٦٠ دقيقة' : 'Walk to restaurant · 45–60 min'}
                    </p>
                  </button>

                  {/* Delivery Button Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMode('delivery');
                    }}
                    className={`p-4 rounded-2xl text-left rtl:text-right border transition-all cursor-pointer space-y-1 ${
                      fulfillmentMode === 'delivery'
                        ? 'border-2 border-[#F4C36C] bg-[#13312B] shadow-[0_0_15px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                        : 'border-white/10 bg-[#0E2520] hover:bg-[#13312B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F7F3EA] flex items-center gap-1.5">
                        <span>🛵</span>
                        <span>{language === 'ar' ? 'دليفري لمكانك' : 'Delivery'}</span>
                      </span>
                      {fulfillmentMode === 'delivery' && (
                        <Check className="w-4 h-4 text-[#F4C36C]" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'يوصل لشلتتك · ٣٥–٤٥ دقيقة' : 'Delivered to your spot · 35–45 min'}
                    </p>
                  </button>
                </div>

                {/* Specific Fulfillment Explanation & Primary Action */}
                {fulfillmentMode === 'eat-here' ? (
                  <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-3">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-emerald-300 block text-sm">
                        {language === 'ar' ? 'اختيار ممتاز ومناسب لجدولك اليومي.' : 'Good choice for your schedule.'}
                      </span>
                      <p className="text-[#D2E3DE]">
                        {language === 'ar'
                          ? `الوقت المقدر لتناول الوجبة: ${selectedRestaurant.diningDurationAr} · المسافة: ${selectedRestaurant.distanceAr}`
                          : `Estimated dining time: ${selectedRestaurant.diningDuration} · Distance: ${selectedRestaurant.distance}`}
                      </p>
                      <p className="text-[#D2E3DE]/70">
                        {language === 'ar'
                          ? 'يتبقى أكثر من ساعة استجمام مريحة قبل نشاط الساعة ٠٣:٠٠ عصراً.'
                          : 'Leaves over an hour of relaxed transition before your 03:00 PM activity.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      id="add-to-my-trip-meal-btn"
                      onClick={() => {
                        handleAddEatHereToTrip(selectedRestaurant);
                        setSelectedRestaurant(null);
                      }}
                      className="w-full py-3 px-4 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تأكيد وإضافة الغداء لجدول رحلتي' : 'Add to My Trip'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-3">
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-emerald-300 block text-sm">
                        {language === 'ar' ? 'الدليفري يناسب وقتك ويوصلك وأنت مريح.' : 'Delivery fits your schedule.'}
                      </span>
                      <p className="text-[#D2E3DE]">
                        {language === 'ar'
                          ? `وقت التوصيل المقدر: ${selectedRestaurant.deliveryTimeAr} · الإجمالي المقدر: ${calculateCartTotals(selectedRestaurant).total} ج.م`
                          : `Estimated delivery: ${selectedRestaurant.deliveryTime} · Estimated total: EGP ${calculateCartTotals(selectedRestaurant).total}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      id="proceed-to-delivery-btn"
                      onClick={() => {
                        setDeliveryWorkflow('confirm');
                      }}
                      className="w-full py-3 px-4 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Bike className="w-4 h-4" />
                      <span>{language === 'ar' ? `متابعة الطلب والدليفري (${calculateCartTotals(selectedRestaurant).total} ج.م)` : `Order Delivery (EGP ${calculateCartTotals(selectedRestaurant).total})`}</span>
                    </button>
                  </div>
                )}
              </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#081714] border-t border-white/10 flex items-center justify-between text-xs text-[#D2E3DE]/70">
              <span>📍 {language === 'ar' ? 'ممشى وخليج اللايتهاوس، دهب' : 'Dahab Lighthouse District'}</span>
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="font-bold text-[#F4C36C] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELIVERY WORKFLOW: ORDER CONFIRMATION & LIVE TRACKING        */}
      {/* ============================================================ */}
      {deliveryWorkflow === 'confirm' && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/15 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#F4C36C]" />
                <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'تأكيد طلب التوصيل الشاطئي' : 'Confirm Delivery Order'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryWorkflow('none')}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order summary */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#F4C36C] uppercase block">{language === 'ar' ? 'المطعم' : 'Restaurant'}</span>
                <p className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? selectedRestaurant.nameAr : selectedRestaurant.name}</p>
                <p className="text-[#D2E3DE]/70">📍 {language === 'ar' ? 'التوصيل إلى: ممشى اللايتهاوس (مكانك الحالي)' : 'Delivering to: Near Dahab Lighthouse (Current spot)'}</p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-[#13312B] border border-white/10">
                <span className="text-[11px] font-bold text-[#F4C36C] uppercase block mb-1">{language === 'ar' ? 'الأطباق المختارة' : 'Selected Items'}</span>
                {selectedRestaurant.popularDishes.map(dish => {
                  const qty = orderCart[dish.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={dish.id} className="flex items-center justify-between text-[#F7F3EA]">
                      <span>{language === 'ar' ? dish.nameAr : dish.name} × {qty}</span>
                      <span className="font-bold font-mono text-[#F4C36C]">EGP {dish.price * qty}</span>
                    </div>
                  );
                })}
                <div className="border-t border-white/10 pt-1.5 mt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[#D2E3DE]/70">
                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="font-mono">EGP {calculateCartTotals(selectedRestaurant).subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#D2E3DE]/70">
                    <span>{language === 'ar' ? 'رسوم التوصيل' : 'Delivery fee'}</span>
                    <span className="font-mono">EGP {calculateCartTotals(selectedRestaurant).deliveryFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#F7F3EA] font-bold text-sm pt-1 border-t border-white/10">
                    <span>{language === 'ar' ? 'الإجمالي الكلي' : 'Estimated total'}</span>
                    <span className="text-[#F4C36C] font-mono">EGP {calculateCartTotals(selectedRestaurant).total}</span>
                  </div>
                </div>
              </div>

              {/* Timing assurance */}
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>⏱ {language === 'ar' ? 'وقت التوصيل المقدر:' : 'Estimated Delivery Time:'}</span>
                  <span className="font-mono">{selectedRestaurant.deliveryTime}</span>
                </div>
                <p className="text-[12px] text-emerald-300/80">
                  {language === 'ar'
                    ? 'الطلب هيوصل حوالي ٠١:٤٥ م، قبل نشاطك الساعة ٠٣:٠٠ م بوقت كافي جداً.'
                    : 'Will arrive around 01:45 PM, well ahead of your 03:00 PM activity.'}
                </p>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                id="place-delivery-order-btn"
                onClick={handlePlaceDeliveryOrder}
                className="w-full py-3 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'ar' ? `تأكيد الطلب (${calculateCartTotals(selectedRestaurant).total} ج.م)` : `Place Order (EGP ${calculateCartTotals(selectedRestaurant).total})`}</span>
              </button>

              <p className="text-[11px] text-center text-[#D2E3DE]/60">
                {language === 'ar' ? 'الدفع على حساب الغرفة / كارت الدفع المسجل بدون تطبيقات خارجية.' : 'Payment charged to room / card on file. No separate app required.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY LIVE TRACKING MODAL (Inside the trip experience) */}
      {deliveryWorkflow === 'tracking' && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/15 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#F4C36C]" />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'متابعة الدليفري الحي' : 'Active Delivery'}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? selectedRestaurant.nameAr : selectedRestaurant.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryWorkflow('none')}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Step Visual Progression */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className={deliveryStatus === 'preparing' ? 'text-[#F4C36C]' : 'text-[#D2E3DE]/50'}>
                  1. {language === 'ar' ? 'التحضير' : 'Preparing'}
                </span>
                <span className={deliveryStatus === 'picked_up' ? 'text-[#F4C36C]' : 'text-[#D2E3DE]/50'}>
                  2. {language === 'ar' ? 'استلم المندوب' : 'Picked up'}
                </span>
                <span className={deliveryStatus === 'on_the_way' ? 'text-[#F4C36C]' : 'text-[#D2E3DE]/50'}>
                  3. {language === 'ar' ? 'في الطريق' : 'On the way'}
                </span>
                <span className={deliveryStatus === 'delivered' ? 'text-emerald-400' : 'text-[#D2E3DE]/50'}>
                  4. {language === 'ar' ? 'تم الاستلام ✓' : 'Delivered ✓'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#13312B] overflow-hidden flex border border-white/10">
                <div 
                  className="h-full bg-[#F4C36C] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(244,195,108,0.5)]"
                  style={{
                    width: 
                      deliveryStatus === 'preparing' ? '25%' :
                      deliveryStatus === 'picked_up' ? '50%' :
                      deliveryStatus === 'on_the_way' ? '75%' : '100%'
                  }}
                />
              </div>

              {/* Status Simulator Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-[#D2E3DE]/50 font-semibold">{language === 'ar' ? 'محاكاة الحالة:' : 'Simulate status:'}</span>
                {(['preparing', 'picked_up', 'on_the_way', 'delivered'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setDeliveryStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                      deliveryStatus === st
                        ? 'bg-[#F4C36C] text-[#081714]'
                        : 'bg-[#13312B] hover:bg-white/10 text-[#D2E3DE] border border-white/10'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* DELIVERY STATUS CONTEXT & SCHEDULE COORDINATION */}
            <div className="space-y-3 text-xs">
              
              {/* Next activity reminder */}
              <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#D2E3DE]/60 uppercase font-bold block">{language === 'ar' ? 'النشاط القادم' : 'Next activity'}</span>
                  <span className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? '٠٣:٠٠ م · سفاري البيتش باجي' : '03:00 PM · Desert Quad Tour'}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#F4C36C]">{language === 'ar' ? 'متبقي ١س ٤٥د' : 'In 1h 45m'}</span>
              </div>

              {/* On Track vs Potential Conflict Alert */}
              {!isDeliveryDelayed ? (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">{language === 'ar' ? 'كل حاجة في ميعادها ✓' : "You're on track ✓"}</span>
                  </div>
                  <span className="text-xs text-emerald-300/80 font-mono">{language === 'ar' ? 'الوصول المتوقع: ٠١:٤٠ م' : 'Est. arrival 01:40 PM'}</span>
                </div>
              ) : (
                /* DELAYED OVERLAP WARNING & SCHEDULE COORDINATION */
                <div 
                  id="schedule-coordination-warning"
                  className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-500/50 space-y-3 text-amber-200 animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{language === 'ar' ? 'لاحظنا أن التوصيل قد يتعارض مع ميعاد نشاطك القادم.' : 'We noticed your delivery may overlap with your next activity.'}</span>
                  </div>

                  <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    {language === 'ar'
                      ? 'ضغط الطلبات في المطعم قد يؤخر وصول الوجبة إلى ٢:٤٥ م. تحب نعمل إيه؟'
                      : 'Heavy kitchen orders mean delivery might arrive around 02:45 PM. What would you like to do?'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      id="keep-delivery-btn"
                      onClick={() => {
                        setIsDeliveryDelayed(false);
                        showToast(language === 'ar' ? 'تم الإبقاء على الخطة وإشعار المندوب بالإسراع.' : 'Kept original plan. Rider notified to expedite.');
                      }}
                      className="px-3 py-2 rounded-xl bg-[#13312B] hover:bg-[#1a4038] border border-amber-500/40 text-amber-200 font-bold text-xs text-center cursor-pointer"
                    >
                      {language === 'ar' ? 'الإبقاء على الطلب' : 'Keep delivery'}
                    </button>

                    <button
                      type="button"
                      id="move-activity-btn"
                      onClick={handleShiftActivity}
                      className="px-3 py-2 rounded-xl bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs text-center cursor-pointer shadow-xs"
                    >
                      {language === 'ar' ? 'ترحيل النشاط تلقائياً' : 'Move your activity'}
                    </button>

                    <button
                      type="button"
                      id="cancel-order-btn"
                      onClick={handleCancelDelivery}
                      className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs text-center cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء الطلب' : 'Cancel order'}
                    </button>
                  </div>
                </div>
              )}

              {/* Prototype Conflict Simulation Toggle */}
              <div className="flex items-center justify-between text-[12px] text-[#D2E3DE]/60 pt-1">
                <span>{language === 'ar' ? 'نظام التنسيق الذكي للجدول' : 'Trip Coordination System'}</span>
                <button
                  type="button"
                  onClick={() => setIsDeliveryDelayed(!isDeliveryDelayed)}
                  className="font-bold text-[#F4C36C] hover:underline cursor-pointer"
                >
                  {isDeliveryDelayed ? (language === 'ar' ? 'محاكاة التوصيل في الميعاد' : 'Simulate on-time delivery') : (language === 'ar' ? 'محاكاة تنبيه تأخير الدليفري' : 'Simulate delivery delay alert')}
                </button>
              </div>
            </div>

            {/* Back to Trip CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeliveryWorkflow('none');
                  onBackToCompanion ? onBackToCompanion() : onBackToMyTrip();
                }}
                className="w-full py-2.5 rounded-full bg-[#13312B] hover:bg-[#1a4038] text-[#F7F3EA] text-xs font-bold transition-all cursor-pointer border border-white/10"
              >
                {language === 'ar' ? 'الرجوع للمرافق اليومي' : 'Return to Daily Companion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL MENU PREVIEW MODAL */}
      {isFullMenuOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/15 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'المنيو الكامل' : 'Full Menu'}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? selectedRestaurant.nameAr : selectedRestaurant.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs flex-grow pr-1">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#F4C36C] uppercase font-['Outfit',sans-serif]">{language === 'ar' ? 'الأطباق الرئيسية والمشويات' : 'Mains & Specialties'}</span>
                {selectedRestaurant.popularDishes.map((dish) => (
                  <div key={dish.id} className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? dish.nameAr : dish.name}</h4>
                      <p className="text-[#D2E3DE]/70">{language === 'ar' ? dish.descriptionAr : dish.description}</p>
                    </div>
                    <span className="font-bold font-mono text-[#F4C36C]">EGP {dish.price}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#F4C36C] uppercase font-['Outfit',sans-serif]">{language === 'ar' ? 'المقبلات والشوربة' : 'Side Mezze & Starters'}</span>
                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'طحينة بلدي وعيش بالسمسم' : 'Tahini Dip & Hot Pita'}</h4>
                    <p className="text-[#D2E3DE]/70">{language === 'ar' ? 'طحينة سمسم نقي بالثوم والليمون والكمون وزيت الزيتون' : 'Stoneground sesame tahini with cumin, garlic & olive oil'}</p>
                  </div>
                  <span className="font-bold font-mono text-[#F4C36C]">EGP 60</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'حلقات كاليماري مقلي مقرمش' : 'Fried Calamari Rings'}</h4>
                    <p className="text-[#D2E3DE]/70">{language === 'ar' ? 'كاليماري البحر الأحمر الطازة مع صوص الثوم والليمون' : 'Red sea squid tossed in sea salt with lemon garlic aioli'}</p>
                  </div>
                  <span className="font-bold font-mono text-[#F4C36C]">EGP 190</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsFullMenuOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'الرجوع لتفاصيل المطعم' : 'Back to Restaurant Details'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13312B] text-[#F7F3EA] border border-[#F4C36C]/40 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
