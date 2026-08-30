/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Service Visual Identity Tokens & Domain Taxonomy
 */

export interface ServiceTheme {
  id: string;
  label: string;
  labelAr: string;
  color: string;
  accentColor: string;
  badgeClass: string;
  iconName: string;
  motifName: string;
  tagline: string;
  taglineAr: string;
}

export const DAHAB_SERVICES: Record<string, ServiceTheme> = {
  diving: {
    id: 'diving',
    label: 'Diving & Freediving',
    labelAr: 'الغوص والغوص الحر',
    color: '#062C35',
    accentColor: '#20A89A',
    badgeClass: 'badge-dahab-lagoon',
    iconName: 'diver',
    motifName: 'reef',
    tagline: 'World-famous drop-offs & pristine coral walls',
    taglineAr: 'أشهر مواقع الغوص العالمية والشعاب المرجانية',
  },
  safari: {
    id: 'safari',
    label: 'Desert Safaris & Canyons',
    labelAr: 'سفاري الصحراء والوديان',
    color: '#C7A56A',
    accentColor: '#E7A83B',
    badgeClass: 'badge-dahab-gold',
    iconName: 'camel',
    motifName: 'mountain',
    tagline: 'Granite canyons, Bedouin dinner & starlight',
    taglineAr: 'وديان الجرانيت، عشاء بدوي وسكون النجوم',
  },
  food: {
    id: 'food',
    label: 'Food & Fresh Seafood',
    labelAr: 'المأكولات وصيد البحر',
    color: '#D96C4F',
    accentColor: '#EA8E75',
    badgeClass: 'badge-dahab-coral',
    iconName: 'food',
    motifName: 'food',
    tagline: 'Fresh Red Sea catch & local artisan cafes',
    taglineAr: 'طازج من البحر الأحمر ومقاهي محلية أصيلة',
  },
  mobility: {
    id: 'mobility',
    label: 'Coastal Mobility & Scooters',
    labelAr: 'السكوتر والتنقل الساحلي',
    color: '#0F6F78',
    accentColor: '#52C4B7',
    badgeClass: 'badge-dahab-sea',
    iconName: 'scooter',
    motifName: 'route',
    tagline: 'Freedom along the coastal mountain roads',
    taglineAr: 'حرية التنقل بين الجبل والبحر في دهب',
  },
  stays: {
    id: 'stays',
    label: 'Eco-Camps & Boutique Stays',
    labelAr: 'المخيمات والإقامات البيئية',
    color: '#EFE8D8',
    accentColor: '#8F7242',
    badgeClass: 'badge-dahab-sand',
    iconName: 'luggage',
    motifName: 'sun',
    tagline: 'Waterfront stone rooms & serene beach camps',
    taglineAr: 'غرف حجرية على البحر ومخيمات شاطئية هادئة',
  },
  transfers: {
    id: 'transfers',
    label: 'Airport & Border Transfers',
    labelAr: 'توصيلات المطار والمعابر',
    color: '#04171D',
    accentColor: '#E7A83B',
    badgeClass: 'badge-dahab-dark-gold',
    iconName: 'transfer',
    motifName: 'compass',
    tagline: 'Direct private 4x4 rides from Sharm & Taba',
    taglineAr: 'توصيل خاص ومريح من شرم الشيخ وطابا',
  },
};

export const getServiceTheme = (serviceId: string): ServiceTheme => {
  return DAHAB_SERVICES[serviceId] || DAHAB_SERVICES.diving;
};
