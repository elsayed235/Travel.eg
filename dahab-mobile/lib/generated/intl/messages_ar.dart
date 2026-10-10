// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a ar locale. All the
// messages from the main program should be duplicated here with the same
// function name.

// Ignore issues from commonly used lints in this file.
// ignore_for_file:unnecessary_brace_in_string_interps, unnecessary_new
// ignore_for_file:prefer_single_quotes,comment_references, directives_ordering
// ignore_for_file:annotate_overrides,prefer_generic_function_type_aliases
// ignore_for_file:unused_import, file_names, avoid_escaping_inner_quotes
// ignore_for_file:unnecessary_string_interpolations, unnecessary_string_escapes

import 'package:intl/intl.dart';
import 'package:intl/message_lookup_by_library.dart';

final messages = new MessageLookup();

typedef String MessageIfAbsent(String messageStr, List<dynamic> args);

class MessageLookup extends MessageLookupByLibrary {
  String get localeName => 'ar';

  static String m0(count) => "${count} عناوين";

  static String m1(deal, category, date) => "${deal} · ${category} · ${date}";

  static String m2(count, city) => "${count} طلبات واردة · ${city}";

  static String m3(qty, city) => "${qty} · ${city}";

  static String m4(km) => "${km} كم";

  static String m5(qty, date, budget) =>
      "${qty} · ${date} · ميزانية ${budget} ج";

  static String m6(count, km) => "${count} عروض · نطاق ${km} كم";

  static String m7(name) => "عرض ${name} هو الأنسب لطلبك.";

  static String m8(name, reasons) => "عرض ${name} هو الأنسب لطلبك: ${reasons}.";

  static String m9(title) => "العنوان: ${title}";

  static String m10(price) => "استخدم ${price}";

  static String m11(count) => "بناءً على ${count} عرض متقبّل";

  static String m12(min, max, currency) =>
      "السعر المعتاد لطلبات زي دي قريب منك: ${min}–${max} ${currency}";

  static String m13(min, max, currency) =>
      "السعر المقترح: ${min}–${max} ${currency}";

  static String m14(count) => "ملخّص من ${count} تقييم";

  static String m15(time) => "تقدر تطلب كود جديد بعد ${time}";

  static String m16(phone) => "دخل الكود اللي وصل على ${phone}";

  static String m17(current, total) => "خطوة ${current} من ${total}";

  static String m18(n) => "فاضل ${n}";

  static String m19(time) => "آخر ظهور ${time}";

  static String m20(count) => "${count} جديد";

  static String m21(date) => "الطلب هيتقفل تلقائي يوم ${date} لو مفيش قبول.";

  static String m22(percent, amount) => "نسبة المنصة ${percent} · ${amount}";

  static String m23(payer, amount) => "يدفعه ${payer} · ${amount}";

  static String m24(percent, amount) => "نسبة المنصة ${percent} · ${amount}";

  static String m25(amount) => "يساوي ${amount}";

  static String m26(place, km) => "${place} - ${km} كم";

  static String m27(km) => "${km} كم";

  static String m28(count, date) =>
      "طلبك هيوصل لـ ${count} صاحب حاجة مطابقة، وهيتقفل تلقائي يوم ${date}.";

  static String m29(current, total) => "${current} من ${total}";

  static String m30(qty, date) => "${qty} • ${date}";

  static String m31(day) => "ضيف لليوم ${day}";

  static String m32(n) => "اليوم ${n}";

  static String m33(n) =>
      "${Intl.plural(n, one: 'يوم', two: 'يومين', few: '${n} أيام', other: '${n} يوم')}";

  static String m34(n) =>
      "${Intl.plural(n, one: 'دي طلعة واحدة تتحجز ومناسبة.', two: 'دول طلعتين يتحجزوا ومناسبين.', few: 'دول ${n} طلعات يتحجزوا ومناسبين.', other: 'دول ${n} طلعة يتحجزوا ومناسبين.')}";

  static String m35(day) => "خطتك · اليوم ${day}";

  static String m36(source) =>
      "الأسعار من الموردين مباشرة · الهوا من ${source}";

  static String m37(place) => "نساعدك في إيه في ${place}؟";

  static String m38(place) =>
      "${place} لسه بتفتح على رحلة: الخطط الأول، والحجز قريب.";

  static String m39(place) => "استكشف ${place}";

  static String m40(place) => "دلوقتي في ${place}";

  static String m41(place) => "حاجات تستاهل في ${place}";

  static String m42(place) => "رحلات جاهزة في ${place}";

  static String m43(source, time) => "${source} · الساعة ${time}";

  static String m44(place) =>
      "صور تقريبية لحد ما صورنا الخاصة بـ${place} تخلص.";

  static String m45(place) => "${place} في كام صورة";

  static String m46(km) => "مفيش طلبات في نطاق ${km} كم";

  static String m47(km) => "وسّع النطاق لـ ${km} كم";

  static String m48(count) => "${count} طلب";

  static String m49(place) => "حاجات قريبة من ${place}";

  static String m50(time) => "صالح لمدة ${time}";

  static String m51(date) => "متاح يوم ${date}";

  static String m52(n) =>
      "${Intl.plural(n, one: 'فاضل يوم على رحلتك', two: 'فاضل يومين على رحلتك', few: 'فاضل ${n} أيام على رحلتك', other: 'فاضل ${n} يوم على رحلتك')}";

  static String m53(km) => "${km} كم";

  static String m54(days) => "خلال ${days} يوم";

  static String m55(greeting, name) => "${greeting} يا ${name}";

  static String m56(hello, name) => "${hello} يا ${name}";

  static String m57(source, time) => "مباشر من ${source} · آخر تحديث ${time}";

  static String m58(place, km) => "${place} ${km} كم";

  static String m59(date) => "محتاجها ${date}";

  static String m60(km) => "${km} كم";

  static String m61(count, km) =>
      "${count} جار في نطاق ${km} كم ممكن يوفّرولك اللي محتاجه";

  static String m62(count) => "يوصل لـ ${count} شخص في نطاقك";

  static String m63(place) => "النهارده في ${place}";

  static String m64(day) => "اليوم ${day} من رحلتك";

  static String m65(count) => "عرض الكل (${count})";

  static String m66(month) => "التوافر — ${month}";

  static String m67(count) => "احجز ${count} كرسي";

  static String m68(min, insurance) =>
      "الحد الأدنى للطلب ${min} · التأمين المتوقع ${insurance} ج";

  static String m69(min) => "الكمية لازم تكون على الأقل ${min}";

  static String m70(unit) => "الكمية (${unit})";

  static String m71(min, insurance) =>
      "الحد الأدنى ${min} · التأمين المتوقع ${insurance} ج";

  static String m72(count) => "${count} كرسي";

  static String m73(count) => "(${count} تقييم)";

  static String m74(available, total) => "${available} من ${total}";

  static String m75(n, day) =>
      "${Intl.plural(n, zero: 'مفيش حاجة متاحة يوم ${day}', one: 'تجربة واحدة متاحة يوم ${day}', two: 'تجربتين متاحين يوم ${day}', few: '${n} تجارب متاحة يوم ${day}', other: '${n} تجربة متاحة يوم ${day}')}";

  static String m76(n) =>
      "${Intl.plural(n, zero: 'مفيش حاجة متاحة النهارده', one: 'تجربة واحدة متاحة النهارده', two: 'تجربتين متاحين النهارده', few: '${n} تجارب متاحة النهارده', other: '${n} تجربة متاحة النهارده')}";

  static String m77(time) => "يلتزم بالتسليم قبل ${time}";

  static String m78(count) => "قارن الـ${count}";

  static String m79(count) => "${count} صفقة";

  static String m80(km) => "${km} كم";

  static String m81(minutes) => "آخر عرض منذ ${minutes} د";

  static String m82(count) => "${count} عروض جديدة";

  static String m83(qty, date, budget) =>
      "${qty} • ${date} • ميزانية ${budget} ج";

  static String m84(minutes) => "${minutes} دقيقة";

  static String m85(count) => "${count} عروض على طلبك";

  static String m86(current, total) => "${current} من ${total}";

  static String m87(date, qty) => "محتاجها ${date} · ${qty}";

  static String m88(count) => "${count} طلب مستني منك خطوة الاستلام";

  static String m89(provider, qty) => "${provider} · ${qty}";

  static String m90(when) => "إلغاء مجاني لحد ${when}";

  static String m91(supplier) =>
      "هتدفع لـ${supplier} كاش يوم الطلعة. مفيش حاجة هتتخصم دلوقتي.";

  static String m92(usd) => "حوالي ${usd}\$ · الدفع بالجنيه";

  static String m93(n) =>
      "${Intl.plural(n, one: 'فرد واحد', two: 'فردين', few: '${n} أفراد', other: '${n} فرد')}";

  static String m94(amount) =>
      "سعر المورّد بقى ${amount}. راجع الإجمالي وأكّد تاني.";

  static String m95(ref) => "اتحجز · رقم ${ref}";

  static String m96(supplier) => "مستنيين ${supplier} يأكّد";

  static String m97(n) => "${n} أيام";

  static String m98(n) => "${n}% وقت فاضي";

  static String m99(n) => "اليوم ${n}";

  static String m100(place) =>
      "${place} لسه جديدة على رحلة. الأسعار تقديرية، اطلب الخطة وفريقنا هيأكدها مع أهل المكان.";

  static String m101(days) => "مدتها مناسبة: ${days} أيام";

  static String m102(matched, asked) =>
      "فيها ${matched} من ${asked} حاجات بتحبها";

  static String m103(place) => "كل الخطط في ${place}";

  static String m104(score) => "الأنسب ليك · ${score}%";

  static String m105(score) => "مناسبة ${score}%";

  static String m106(count) => "لقيتلك ${count} خطط على مقاسك";

  static String m107(n, total) => "خطوة ${n} من ${total}";

  static String m108(n) => "${n} ليالي";

  static String m109(n) => "خططك (${n})";

  static String m110(language) => "اللغة والعرض، ${language}";

  static String m111(query) => "اسأل DayGi عن «${query}»";

  static String m112(count) => "الفلاتر · ${count}";

  static String m113(price) => "لحد ${price}";

  static String m114(count) => "${count} طلعة";

  static String m115(count) => "اعرض ${count} طلعة";

  static String m116(MB, files) =>
      "يجب أن تكون حجم الملفات التالية أقل من ${MB} ميحابيت, ${files}";

  static String m117(name) => "كلّم ${name}";

  static String m118(day, days) => "اليوم ${day} من ${days}";

  static String m119(h, m) => "بعد ${h} س ${m} د";

  static String m120(m) => "بعد ${m} دقيقة";

  static String m121(slot) =>
      "اتنقلت للساعة ${slot}. المورّد عنده المعاد الجديد.";

  static String m122(kn) => "هوا ${kn} عقدة";

  static String m123(wind, title, max) =>
      "الهوا ${wind} عقدة دلوقتي. ${title} بتشتغل تحت ${max} عقدة.";

  static String m124(title) => "الدنيا هوا. أعمل إيه بدل ${title}؟";

  static String m125(slot, day) =>
      "أول طلعة للمورّد: الساعة ${slot} يوم ${day}.";

  static String m126(n) =>
      "${Intl.plural(n, one: 'فاضل يوم', two: 'فاضل يومين', few: 'فاضل ${n} أيام', other: 'فاضل ${n} يوم')}";

  static String m127(usd) => "حوالي ${usd}\$";

  static String m128(title) => "${title} مناسبة ليا؟";

  static String m129(clock) => "المغرب النهارده الساعة ${clock}";

  static String m130(wind, max) =>
      "الهوا ${wind} عقدة النهارده، والمورّد بيشغّلها تحت ${max} عقدة";

  static String m131(wind) => "الهوا ${wind} عقدة، جوه حدود المورّد";

  static String m132(hours) => "إلغاء مجاني لحد ${hours} ساعة قبلها";

  static String m133(h) => "${h} ساعات";

  static String m134(m) => "${m} دقيقة";

  static String m135(n) =>
      "${Intl.plural(n, one: 'الالتزام محسوب من رحلة واحدة', two: 'الالتزام محسوب من رحلتين', few: 'الالتزام محسوب من ${n} رحلات', other: 'الالتزام محسوب من ${n} رحلة')}";

  static String m136(count) =>
      "${Intl.plural(count, one: 'من تقييم واحد موثّق', two: 'من تقييمين موثّقين', few: 'من ${count} تقييمات موثّقة', other: 'من ${count} تقييم موثّق')}";

  static String m137(date) => " · آخر واحد ${date}";

  static String m138(n) => "لحد ${n}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "AddressValidation": MessageLookupByLibrary.simpleMessage(
      "من فضلك ادخل العنوان",
    ),
    "access_denied": MessageLookupByLibrary.simpleMessage("تم رفض الوصول"),
    "account_about": MessageLookupByLibrary.simpleMessage("عن رحلة"),
    "account_address_default": MessageLookupByLibrary.simpleMessage("افتراضي"),
    "account_address_home": MessageLookupByLibrary.simpleMessage("البيت"),
    "account_address_work": MessageLookupByLibrary.simpleMessage("الشغل"),
    "account_addresses": MessageLookupByLibrary.simpleMessage("عناويني"),
    "account_addresses_count": m0,
    "account_addresses_subtitle": MessageLookupByLibrary.simpleMessage(
      "أماكن التوصيل والاستلام المحفوظة",
    ),
    "account_ask_daygi": MessageLookupByLibrary.simpleMessage("اسأل DayGi"),
    "account_ask_daygi_hint": MessageLookupByLibrary.simpleMessage(
      "مرشدك المحلي، اسأله أي حاجة",
    ),
    "account_city": MessageLookupByLibrary.simpleMessage("المدينة"),
    "account_contact": MessageLookupByLibrary.simpleMessage("تواصل معانا"),
    "account_contact_hint": MessageLookupByLibrary.simpleMessage(
      "تليفون وواتساب وإيميل",
    ),
    "account_contact_title": MessageLookupByLibrary.simpleMessage(
      "تواصل معانا",
    ),
    "account_dark_mode": MessageLookupByLibrary.simpleMessage("الوضع الداكن"),
    "account_edit_profile": MessageLookupByLibrary.simpleMessage("تعديل الملف"),
    "account_edit_profile_hint": MessageLookupByLibrary.simpleMessage(
      "الاسم، الجوال، والإيميل",
    ),
    "account_edit_section_contact": MessageLookupByLibrary.simpleMessage(
      "التواصل والمكان",
    ),
    "account_edit_section_personal": MessageLookupByLibrary.simpleMessage(
      "البيانات الشخصية",
    ),
    "account_emergency": MessageLookupByLibrary.simpleMessage("أرقام الطوارئ"),
    "account_emergency_hint": MessageLookupByLibrary.simpleMessage(
      "غرفة الضغط، المستشفى، شرطة السياحة",
    ),
    "account_faq": MessageLookupByLibrary.simpleMessage("الأسئلة الشائعة"),
    "account_first_name": MessageLookupByLibrary.simpleMessage("الاسم الأول"),
    "account_guest_body": MessageLookupByLibrary.simpleMessage(
      "سجّل دخولك عشان رحلتك وحجوزاتك والفاوتشرات تفضل في مكان واحد. تقدر تستكشف من غير حساب.",
    ),
    "account_guest_title": MessageLookupByLibrary.simpleMessage(
      "أهلاً بيك في رحلة",
    ),
    "account_guides": MessageLookupByLibrary.simpleMessage("أدلة السفر"),
    "account_help": MessageLookupByLibrary.simpleMessage("مركز المساعدة"),
    "account_help_hint": MessageLookupByLibrary.simpleMessage(
      "أسئلة شائعة وطرق التواصل",
    ),
    "account_lang_ar": MessageLookupByLibrary.simpleMessage("العربية"),
    "account_lang_en": MessageLookupByLibrary.simpleMessage("English"),
    "account_language_updated": MessageLookupByLibrary.simpleMessage(
      "تم تغيير اللغة",
    ),
    "account_last_name": MessageLookupByLibrary.simpleMessage("اسم العائلة"),
    "account_listing_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "التأمين قابل للتعديل منك، والعربون وغرامة التأخير نسب المنصة ومقفولة",
    ),
    "account_listing_detail_title": MessageLookupByLibrary.simpleMessage(
      "تفاصيل العرض",
    ),
    "account_listing_meta": m1,
    "account_listing_not_found": MessageLookupByLibrary.simpleMessage(
      "العرض مش موجود",
    ),
    "account_listing_offers": m2,
    "account_listing_qty": m3,
    "account_listing_status_active": MessageLookupByLibrary.simpleMessage(
      "معروض",
    ),
    "account_listing_status_completed": MessageLookupByLibrary.simpleMessage(
      "مكتمل",
    ),
    "account_listing_status_deposit": MessageLookupByLibrary.simpleMessage(
      "العربون",
    ),
    "account_listing_status_in_progress": MessageLookupByLibrary.simpleMessage(
      "جاري الاستخدام",
    ),
    "account_listing_status_insurance": MessageLookupByLibrary.simpleMessage(
      "التأمين",
    ),
    "account_listing_status_late_fee": MessageLookupByLibrary.simpleMessage(
      "غرامة تأخير",
    ),
    "account_listing_status_offer_received":
        MessageLookupByLibrary.simpleMessage("عروض واردة"),
    "account_listing_status_paused": MessageLookupByLibrary.simpleMessage(
      "موقوف",
    ),
    "account_listing_timeline_hint": MessageLookupByLibrary.simpleMessage(
      "من النشر لحد الإكمال — نفس السيكل الأساسية للتطبيق",
    ),
    "account_listing_timeline_title": MessageLookupByLibrary.simpleMessage(
      "مسار الصفقة",
    ),
    "account_listings_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "لما تعرض حاجة للإيجار أو البيع، هتظهر هنا وتقدر تتابع الطلبات الواردة والسيكل كامل.",
    ),
    "account_listings_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش عروض لسه",
    ),
    "account_listings_tile": MessageLookupByLibrary.simpleMessage("عروضي"),
    "account_listings_tile_hint": MessageLookupByLibrary.simpleMessage(
      "الحاجات اللي عرضتها للبيع أو الإيجار",
    ),
    "account_logout_done": MessageLookupByLibrary.simpleMessage(
      "تم تسجيل الخروج",
    ),
    "account_logout_subtitle": MessageLookupByLibrary.simpleMessage(
      "رحلتك محفوظة على حسابك. سجّل دخول تاني عشان تشوفها هنا.",
    ),
    "account_logout_title": MessageLookupByLibrary.simpleMessage(
      "تسجيل الخروج؟",
    ),
    "account_my_listings_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "كل عرض ليه دورة كاملة: تأمين → عربون → تسليم → غرامة تأخير لو حصلت",
    ),
    "account_my_listings_subtitle": MessageLookupByLibrary.simpleMessage(
      "الحاجات اللي عرضتها وحد يقدر يطلبها أو يشتريها",
    ),
    "account_my_listings_title": MessageLookupByLibrary.simpleMessage("عروضي"),
    "account_my_orders_title": MessageLookupByLibrary.simpleMessage("طلباتي"),
    "account_my_requests_subtitle": MessageLookupByLibrary.simpleMessage(
      "الطلبات اللي بعتها لأصحاب الحاجة",
    ),
    "account_my_requests_title": MessageLookupByLibrary.simpleMessage(
      "طلبات البحث",
    ),
    "account_my_reviews_subtitle": MessageLookupByLibrary.simpleMessage(
      "تقييماتك وتقييمات أصحاب الحاجة عنك",
    ),
    "account_my_reviews_title": MessageLookupByLibrary.simpleMessage(
      "التقييمات",
    ),
    "account_my_trip": MessageLookupByLibrary.simpleMessage("رحلتي"),
    "account_my_trip_hint": MessageLookupByLibrary.simpleMessage(
      "الحجوزات والفاوتشرات والنهارده",
    ),
    "account_notif_offers": MessageLookupByLibrary.simpleMessage("عروض جديدة"),
    "account_notif_offers_hint": MessageLookupByLibrary.simpleMessage(
      "لما صاحب حاجة يرد على طلبك",
    ),
    "account_notif_push": MessageLookupByLibrary.simpleMessage(
      "إشعارات التطبيق",
    ),
    "account_notif_push_hint": MessageLookupByLibrary.simpleMessage(
      "تنبيه عند وصول عرض أو تحديث طلب",
    ),
    "account_notif_sms": MessageLookupByLibrary.simpleMessage("رسائل SMS"),
    "account_notif_sms_hint": MessageLookupByLibrary.simpleMessage(
      "تأكيدات مهمة على رقم الجوال",
    ),
    "account_notifications": MessageLookupByLibrary.simpleMessage("الإشعارات"),
    "account_notifications_hint": MessageLookupByLibrary.simpleMessage(
      "تحكم في تنبيهات العروض والطلبات",
    ),
    "account_photo_change": MessageLookupByLibrary.simpleMessage(
      "تغيير الصورة",
    ),
    "account_photo_remove": MessageLookupByLibrary.simpleMessage(
      "إزالة الصورة",
    ),
    "account_photo_title": MessageLookupByLibrary.simpleMessage("صورة الحساب"),
    "account_privacy": MessageLookupByLibrary.simpleMessage(
      "الخصوصية وبياناتك",
    ),
    "account_profile_saved": MessageLookupByLibrary.simpleMessage(
      "تم حفظ التعديلات",
    ),
    "account_radius_hint": MessageLookupByLibrary.simpleMessage(
      "النطاق الافتراضي لاستكشف وطلباتك",
    ),
    "account_radius_title": MessageLookupByLibrary.simpleMessage("نطاق البحث"),
    "account_radius_updated": MessageLookupByLibrary.simpleMessage(
      "تم تحديث نطاق البحث",
    ),
    "account_radius_value": m4,
    "account_request_meta": m5,
    "account_request_offers": m6,
    "account_request_status_cancelled": MessageLookupByLibrary.simpleMessage(
      "ملغي",
    ),
    "account_request_status_closed": MessageLookupByLibrary.simpleMessage(
      "اتقفل",
    ),
    "account_request_status_open": MessageLookupByLibrary.simpleMessage(
      "مفتوح",
    ),
    "account_requests_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "لما تبعت طلب من زر اطلب، هيظهر هنا مع العروض.",
    ),
    "account_requests_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش طلبات بحث",
    ),
    "account_reviews_empty": MessageLookupByLibrary.simpleMessage(
      "مفيش تقييمات هنا لسه",
    ),
    "account_reviews_given": MessageLookupByLibrary.simpleMessage("منّي"),
    "account_reviews_received": MessageLookupByLibrary.simpleMessage("عليّا"),
    "account_section_about": MessageLookupByLibrary.simpleMessage("عن التطبيق"),
    "account_section_activity": MessageLookupByLibrary.simpleMessage("نشاطي"),
    "account_section_help": MessageLookupByLibrary.simpleMessage(
      "المساعدة والأمان",
    ),
    "account_section_preferences": MessageLookupByLibrary.simpleMessage(
      "التفضيلات",
    ),
    "account_section_profile": MessageLookupByLibrary.simpleMessage("الحساب"),
    "account_section_support": MessageLookupByLibrary.simpleMessage("الدعم"),
    "account_section_trip": MessageLookupByLibrary.simpleMessage("خطط واسأل"),
    "account_stat_listings": MessageLookupByLibrary.simpleMessage("عروضي"),
    "account_stat_orders": MessageLookupByLibrary.simpleMessage("طلبات"),
    "account_stat_requests": MessageLookupByLibrary.simpleMessage("طلبات بحث"),
    "account_stat_reviews": MessageLookupByLibrary.simpleMessage("تقييمات"),
    "account_terms": MessageLookupByLibrary.simpleMessage("الشروط والأحكام"),
    "account_theme": MessageLookupByLibrary.simpleMessage("المظهر"),
    "account_theme_dark": MessageLookupByLibrary.simpleMessage("داكن"),
    "account_theme_light": MessageLookupByLibrary.simpleMessage("فاتح"),
    "account_theme_system": MessageLookupByLibrary.simpleMessage("حسب النظام"),
    "account_theme_updated": MessageLookupByLibrary.simpleMessage(
      "تم تحديث المظهر",
    ),
    "account_title": MessageLookupByLibrary.simpleMessage("حسابي"),
    "account_verified": MessageLookupByLibrary.simpleMessage("موثق"),
    "account_version": MessageLookupByLibrary.simpleMessage("إصدار التطبيق"),
    "add_new_item": MessageLookupByLibrary.simpleMessage("إضافة عنصر جديد"),
    "ai_badge": MessageLookupByLibrary.simpleMessage("ذكاء اصطناعي"),
    "ai_best_offer_no_reason": m7,
    "ai_best_offer_reason": m8,
    "ai_best_offer_title": MessageLookupByLibrary.simpleMessage("ترشيحنا"),
    "ai_best_offer_view": MessageLookupByLibrary.simpleMessage("شوف العرض"),
    "ai_compose_applied_hint": MessageLookupByLibrary.simpleMessage(
      "راجع الخانات وعدّل أي حاجة مش مظبوطة.",
    ),
    "ai_compose_applied_title": MessageLookupByLibrary.simpleMessage(
      "رتّبنا طلبك",
    ),
    "ai_compose_button": MessageLookupByLibrary.simpleMessage("رتّبها لي"),
    "ai_compose_empty": MessageLookupByLibrary.simpleMessage(
      "اكتب أو قول طلبك الأول",
    ),
    "ai_compose_loading": MessageLookupByLibrary.simpleMessage("بنرتّب طلبك…"),
    "ai_compose_low_confidence": MessageLookupByLibrary.simpleMessage(
      "مش متأكدين من كل التفاصيل، راجعها كويس.",
    ),
    "ai_compose_nothing": MessageLookupByLibrary.simpleMessage(
      "مقدرناش نطلّع تفاصيل كفاية. كمّل الخانات بنفسك.",
    ),
    "ai_compose_title_value": m9,
    "ai_compose_undo": MessageLookupByLibrary.simpleMessage("تراجع"),
    "ai_home_example_1": MessageLookupByLibrary.simpleMessage(
      "٢٠ كرسي لفرح يوم الخميس",
    ),
    "ai_home_example_2": MessageLookupByLibrary.simpleMessage(
      "لابتوب خفيف للشغل لمدة أسبوع",
    ),
    "ai_home_example_3": MessageLookupByLibrary.simpleMessage(
      "فستان سواريه مقاس M بكرة",
    ),
    "ai_home_or_try": MessageLookupByLibrary.simpleMessage("أو جرّب"),
    "ai_home_subtitle": MessageLookupByLibrary.simpleMessage(
      "دوس على المايك واتكلم، وإحنا نكمّل الطلب.",
    ),
    "ai_home_title": MessageLookupByLibrary.simpleMessage("قول اللي محتاجه"),
    "ai_list_separator": MessageLookupByLibrary.simpleMessage("، "),
    "ai_price_apply": m10,
    "ai_price_based_on": m11,
    "ai_price_range": m12,
    "ai_price_suggest": m13,
    "ai_review_summary_based_on": m14,
    "ai_review_summary_title": MessageLookupByLibrary.simpleMessage(
      "الناس بتقول",
    ),
    "ai_safety_abuse": MessageLookupByLibrary.simpleMessage(
      "الرسالة دي ممكن تتفهم إساءة. تحب تعدّلها قبل ما تبعت؟",
    ),
    "ai_safety_advance": MessageLookupByLibrary.simpleMessage(
      "متدفعش عربون أو مقدّم قبل ما تستلم وتأكّد بالكود.",
    ),
    "ai_safety_dismiss": MessageLookupByLibrary.simpleMessage("تمام"),
    "ai_safety_edit": MessageLookupByLibrary.simpleMessage("عدّل الرسالة"),
    "ai_safety_off_platform": MessageLookupByLibrary.simpleMessage(
      "الدفع برّه التطبيق بيلغي حماية التأمين. ادفع من جوّه التطبيق.",
    ),
    "ai_safety_peer_banner": MessageLookupByLibrary.simpleMessage(
      "الطرف التاني طلب الدفع برّه التطبيق. ادفع من جوّه التطبيق عشان فلوسك تفضل محمية.",
    ),
    "ai_safety_send_anyway": MessageLookupByLibrary.simpleMessage("ابعت برضه"),
    "ai_safety_title": MessageLookupByLibrary.simpleMessage("خلّي بالك"),
    "ai_search_clear": MessageLookupByLibrary.simpleMessage("مسح"),
    "ai_search_example_1": MessageLookupByLibrary.simpleMessage(
      "حد محتاج كراسي لفرح؟",
    ),
    "ai_search_example_2": MessageLookupByLibrary.simpleMessage(
      "طلبات إلكترونيات قريبة مني",
    ),
    "ai_search_example_3": MessageLookupByLibrary.simpleMessage("هدوم شتوي"),
    "ai_search_loading": MessageLookupByLibrary.simpleMessage("بنفهم بحثك…"),
    "ai_search_try_title": MessageLookupByLibrary.simpleMessage(
      "جرّب البحث الذكي",
    ),
    "ai_search_understood": MessageLookupByLibrary.simpleMessage(
      "بندوّر لك على",
    ),
    "ai_voice_button": MessageLookupByLibrary.simpleMessage("قول طلبك"),
    "ai_voice_listening": MessageLookupByLibrary.simpleMessage(
      "بسمعك… اتكلم براحتك",
    ),
    "ai_voice_stop": MessageLookupByLibrary.simpleMessage("إيقاف"),
    "ai_voice_unavailable": MessageLookupByLibrary.simpleMessage(
      "الميكروفون مش متاح. اسمح للتطبيق باستخدامه من الإعدادات.",
    ),
    "app_cancel": MessageLookupByLibrary.simpleMessage("إلغاء"),
    "app_confirm": MessageLookupByLibrary.simpleMessage("تأكيد"),
    "auth_back_home": MessageLookupByLibrary.simpleMessage("الرجوع إلى دهب"),
    "auth_browse_guest": MessageLookupByLibrary.simpleMessage("الرجوع إلى دهب"),
    "auth_create_account": MessageLookupByLibrary.simpleMessage("سجّل مجاناً"),
    "auth_default_name": MessageLookupByLibrary.simpleMessage("مستخدم"),
    "auth_forget_cta": MessageLookupByLibrary.simpleMessage(
      "إرسال رابط الاستعادة",
    ),
    "auth_forget_subtitle": MessageLookupByLibrary.simpleMessage(
      "أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة",
    ),
    "auth_forget_title": MessageLookupByLibrary.simpleMessage(
      "استعادة كلمة المرور",
    ),
    "auth_gate_subtitle": MessageLookupByLibrary.simpleMessage(
      "الخطط والحجوزات ودفتر الحساب محتاجين حساب",
    ),
    "auth_gate_title": MessageLookupByLibrary.simpleMessage(
      "سجّل دخول عشان تكمّل",
    ),
    "auth_guest_account_subtitle": MessageLookupByLibrary.simpleMessage(
      "سجّل دخول عشان تشوف رحلتك وحجوزاتك",
    ),
    "auth_guest_account_title": MessageLookupByLibrary.simpleMessage("حسابك"),
    "auth_guest_hint": MessageLookupByLibrary.simpleMessage(
      "تقدر تتفرج — سجّل دخولك عشان تحفظ الرحلة",
    ),
    "auth_guest_login_cta": MessageLookupByLibrary.simpleMessage(
      "تسجيل الدخول",
    ),
    "auth_have_account": MessageLookupByLibrary.simpleMessage(
      "لديك حساب بالفعل؟",
    ),
    "auth_hint_email": MessageLookupByLibrary.simpleMessage("you@email.com"),
    "auth_hint_identifier": MessageLookupByLibrary.simpleMessage(
      "you@email.com أو 01xxxxxxxxx",
    ),
    "auth_hint_name": MessageLookupByLibrary.simpleMessage("مثال: أحمد مصطفى"),
    "auth_hint_password": MessageLookupByLibrary.simpleMessage("••••••••"),
    "auth_hint_phone": MessageLookupByLibrary.simpleMessage("01xxxxxxxxx"),
    "auth_hint_phone_optional": MessageLookupByLibrary.simpleMessage(
      "الموبايل، لو حابب",
    ),
    "auth_identifier": MessageLookupByLibrary.simpleMessage(
      "الإيميل أو الموبايل",
    ),
    "auth_login_cta": MessageLookupByLibrary.simpleMessage("تسجيل الدخول"),
    "auth_login_subtitle": MessageLookupByLibrary.simpleMessage(
      "سجل دخولك لحفظ واسترجاع خططك وتجاربك",
    ),
    "auth_login_success": MessageLookupByLibrary.simpleMessage("أهلاً بيك"),
    "auth_login_success_hint": MessageLookupByLibrary.simpleMessage(
      "خططك وحجوزاتك هنا",
    ),
    "auth_login_title": MessageLookupByLibrary.simpleMessage(
      "أهلاً بيك تاني في دهب",
    ),
    "auth_no_account": MessageLookupByLibrary.simpleMessage(
      "ليس لديك حساب بعد؟",
    ),
    "auth_or": MessageLookupByLibrary.simpleMessage("أو عبر البريد الإلكتروني"),
    "auth_otp_cta": MessageLookupByLibrary.simpleMessage("تأكيد"),
    "auth_otp_hint": MessageLookupByLibrary.simpleMessage(
      "للاختبار: أي ٦ أرقام",
    ),
    "auth_otp_required": MessageLookupByLibrary.simpleMessage(
      "دخل كود التأكيد كامل",
    ),
    "auth_otp_resend": MessageLookupByLibrary.simpleMessage("ابعت الكود تاني"),
    "auth_otp_resend_in": m15,
    "auth_otp_resent": MessageLookupByLibrary.simpleMessage("بعتنالك كود جديد"),
    "auth_otp_subtitle": m16,
    "auth_otp_title": MessageLookupByLibrary.simpleMessage("كود التأكيد"),
    "auth_pw_rule_case": MessageLookupByLibrary.simpleMessage(
      "حرف كبير وصغير (Aa)",
    ),
    "auth_pw_rule_length": MessageLookupByLibrary.simpleMessage(
      "٨ حروف أو أكتر",
    ),
    "auth_pw_rule_number": MessageLookupByLibrary.simpleMessage("رقم"),
    "auth_pw_rule_symbol": MessageLookupByLibrary.simpleMessage("رمز زي ! @ #"),
    "auth_register_cta": MessageLookupByLibrary.simpleMessage("إنشاء الحساب"),
    "auth_register_subtitle": MessageLookupByLibrary.simpleMessage(
      "احفظ رحلتك واستمتع بالمرافقة الذكية وتأكيد الحجوزات",
    ),
    "auth_register_success": MessageLookupByLibrary.simpleMessage(
      "أهلاً بيك في دهب",
    ),
    "auth_register_terms": MessageLookupByLibrary.simpleMessage(
      "يتم إنشاء الحسابات كحساب مسافر. لو إنت شريك أو مورد، تواصل مع فريق التشغيل لتفعيل صلاحيات البوابة.",
    ),
    "auth_register_title": MessageLookupByLibrary.simpleMessage(
      "انضم إلى مجتمع دهب",
    ),
    "auth_reset_cta": MessageLookupByLibrary.simpleMessage("حفظ كلمة المرور"),
    "auth_reset_subtitle": MessageLookupByLibrary.simpleMessage(
      "اختَر كلمة مرور قوية لحسابك",
    ),
    "auth_reset_success": MessageLookupByLibrary.simpleMessage(
      "تم تحديث كلمة المرور",
    ),
    "auth_reset_success_hint": MessageLookupByLibrary.simpleMessage(
      "سجّل دخول بكلمة المرور الجديدة",
    ),
    "auth_reset_title": MessageLookupByLibrary.simpleMessage("كلمة مرور جديدة"),
    "auth_reset_unavailable": MessageLookupByLibrary.simpleMessage(
      "النسخة دي مش بتبعث إيميل الاستعادة. استعيد كلمة المرور من الموقع، وبعدين ادخل من هنا.",
    ),
    "auth_server_missing": MessageLookupByLibrary.simpleMessage(
      "سيرفر دهب مش متوصل في النسخة دي، فالدخول مش هيكمّل. تقدر تتفرج برضو.",
    ),
    "auth_step": m17,
    "auth_trust_code": MessageLookupByLibrary.simpleMessage("تسليم بكود"),
    "auth_trust_line": MessageLookupByLibrary.simpleMessage(
      "بياناتك ودفتر حساباتك مشفرة ومؤمّنة سحابياً",
    ),
    "auth_trust_payment": MessageLookupByLibrary.simpleMessage("دفع محمي"),
    "auth_trust_reviews": MessageLookupByLibrary.simpleMessage(
      "تقييمات حقيقية",
    ),
    "book_continue": MessageLookupByLibrary.simpleMessage("احجزلي المعاد ده"),
    "book_date": MessageLookupByLibrary.simpleMessage("اليوم"),
    "book_departed": MessageLookupByLibrary.simpleMessage("فات"),
    "book_failed": MessageLookupByLibrary.simpleMessage(
      "معرفناش نمسك المعاد ده. جرّب طلعة تانية.",
    ),
    "book_guests": MessageLookupByLibrary.simpleMessage("عدد الأفراد"),
    "book_hold_note": MessageLookupByLibrary.simpleMessage(
      "بنمسكلك الأماكن ١٥ دقيقة لحد ما تأكد. مفيش أي فلوس هتتدفع.",
    ),
    "book_left": m18,
    "book_phone": MessageLookupByLibrary.simpleMessage("رقم موبايل للمورّد"),
    "book_phone_missing": MessageLookupByLibrary.simpleMessage(
      "اكتب رقم موبايل عشان المورّد يقدر يكلّمك.",
    ),
    "book_retry": MessageLookupByLibrary.simpleMessage("جرّب تاني"),
    "book_sign_in": MessageLookupByLibrary.simpleMessage("سجّل دخول عشان تحجز"),
    "book_slots_error": MessageLookupByLibrary.simpleMessage(
      "معرفناش نشوف الأماكن المتاحة.",
    ),
    "book_slots_loading": MessageLookupByLibrary.simpleMessage(
      "بنشوف الأماكن المتاحة دلوقتي…",
    ),
    "book_slots_none": MessageLookupByLibrary.simpleMessage(
      "مفيش طلعات اليوم ده. جرّب يوم تاني.",
    ),
    "book_sold_out": MessageLookupByLibrary.simpleMessage("كامل"),
    "book_time": MessageLookupByLibrary.simpleMessage("معاد الطلعة"),
    "book_title": MessageLookupByLibrary.simpleMessage("اختار معادك"),
    "book_today": MessageLookupByLibrary.simpleMessage("النهارده"),
    "book_tomorrow": MessageLookupByLibrary.simpleMessage("بكرة"),
    "book_total": MessageLookupByLibrary.simpleMessage("الإجمالي"),
    "camera": MessageLookupByLibrary.simpleMessage("الكاميرا"),
    "cancel": MessageLookupByLibrary.simpleMessage("إلغاء"),
    "chat_action_confirm_time": MessageLookupByLibrary.simpleMessage(
      "أكد الموعد",
    ),
    "chat_action_pickup_code": MessageLookupByLibrary.simpleMessage(
      "كود الاستلام",
    ),
    "chat_action_send_location": MessageLookupByLibrary.simpleMessage(
      "أرسل الموقع",
    ),
    "chat_attach_camera": MessageLookupByLibrary.simpleMessage("الكاميرا"),
    "chat_attach_gallery": MessageLookupByLibrary.simpleMessage("المعرض"),
    "chat_attach_image": MessageLookupByLibrary.simpleMessage("إرفاق صورة"),
    "chat_composer_hint": MessageLookupByLibrary.simpleMessage("اكتب رسالة…"),
    "chat_contact_phone": MessageLookupByLibrary.simpleMessage("موبايل"),
    "chat_contact_whatsapp": MessageLookupByLibrary.simpleMessage("واتساب"),
    "chat_conversation_title": MessageLookupByLibrary.simpleMessage("محادثة"),
    "chat_conversations_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "لما تقبل عرض أو تسأل على طلب، المحادثة هتتفتح هنا على الأوردر.",
    ),
    "chat_conversations_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش محادثات لسه",
    ),
    "chat_conversations_subtitle": MessageLookupByLibrary.simpleMessage(
      "كل محادثة مربوطة بطلب — المنتج أولاً",
    ),
    "chat_conversations_tile_hint": MessageLookupByLibrary.simpleMessage(
      "محادثات مربوطة بطلباتك",
    ),
    "chat_conversations_title": MessageLookupByLibrary.simpleMessage(
      "محادثاتي",
    ),
    "chat_copied": MessageLookupByLibrary.simpleMessage("تم نسخ الرسالة"),
    "chat_copy": MessageLookupByLibrary.simpleMessage("نسخ"),
    "chat_image_caption": MessageLookupByLibrary.simpleMessage("صورة"),
    "chat_last_seen": m19,
    "chat_online": MessageLookupByLibrary.simpleMessage("متصل"),
    "chat_open_code_enter": MessageLookupByLibrary.simpleMessage(
      "تأكيد الاستلام بالكود",
    ),
    "chat_open_code_share": MessageLookupByLibrary.simpleMessage(
      "عرض كود الاستلام",
    ),
    "chat_order_card_badge": MessageLookupByLibrary.simpleMessage("طلب"),
    "chat_order_card_title": MessageLookupByLibrary.simpleMessage(
      "تفاصيل الطلب",
    ),
    "chat_order_need_by": MessageLookupByLibrary.simpleMessage("الموعد"),
    "chat_order_price": MessageLookupByLibrary.simpleMessage("السعر"),
    "chat_order_provider": MessageLookupByLibrary.simpleMessage("صاحب العرض"),
    "chat_order_qty": MessageLookupByLibrary.simpleMessage("الكمية"),
    "chat_order_status": MessageLookupByLibrary.simpleMessage("الحالة"),
    "chat_photo": MessageLookupByLibrary.simpleMessage("صورة"),
    "chat_quick_confirm_time_msg": MessageLookupByLibrary.simpleMessage(
      "ممكن نأكد موعد الاستلام؟",
    ),
    "chat_quick_location_msg": MessageLookupByLibrary.simpleMessage(
      "ببعتلك موقعي دلوقتي",
    ),
    "chat_reply": MessageLookupByLibrary.simpleMessage("رد"),
    "chat_replying_to": MessageLookupByLibrary.simpleMessage("الرد على"),
    "chat_role_my_listing": MessageLookupByLibrary.simpleMessage("عرضي"),
    "chat_role_my_request": MessageLookupByLibrary.simpleMessage("طلبي"),
    "chat_status_accepted": MessageLookupByLibrary.simpleMessage(
      "تم قبول العرض",
    ),
    "chat_status_completed": MessageLookupByLibrary.simpleMessage("مكتمل"),
    "chat_status_delivery": MessageLookupByLibrary.simpleMessage("التسليم"),
    "chat_status_deposit": MessageLookupByLibrary.simpleMessage(
      "تم دفع العربون",
    ),
    "chat_status_in_use": MessageLookupByLibrary.simpleMessage(
      "جاري الاستخدام",
    ),
    "chat_status_insurance": MessageLookupByLibrary.simpleMessage(
      "تم دفع التأمين",
    ),
    "chat_today": MessageLookupByLibrary.simpleMessage("اليوم"),
    "chat_typing": MessageLookupByLibrary.simpleMessage("يكتب…"),
    "chat_unread": m20,
    "chat_user_completed_deals": MessageLookupByLibrary.simpleMessage(
      "صفقات مكتملة",
    ),
    "chat_user_contacts_hidden": MessageLookupByLibrary.simpleMessage(
      "المستخدم مخفي وسائل التواصل دلوقتي",
    ),
    "chat_user_contacts_hint": MessageLookupByLibrary.simpleMessage(
      "الظهور حسب إعدادات الخصوصية بتاعت المستخدم",
    ),
    "chat_user_contacts_title": MessageLookupByLibrary.simpleMessage(
      "وسائل التواصل",
    ),
    "chat_user_listings_count": MessageLookupByLibrary.simpleMessage("عروض"),
    "chat_user_listings_title": MessageLookupByLibrary.simpleMessage("عروضه"),
    "chat_user_profile_title": MessageLookupByLibrary.simpleMessage(
      "حساب المستخدم",
    ),
    "chat_yesterday": MessageLookupByLibrary.simpleMessage("أمس"),
    "compass_e": MessageLookupByLibrary.simpleMessage("شرق"),
    "compass_n": MessageLookupByLibrary.simpleMessage("شمال"),
    "compass_ne": MessageLookupByLibrary.simpleMessage("شمال شرقي"),
    "compass_nw": MessageLookupByLibrary.simpleMessage("شمال غربي"),
    "compass_s": MessageLookupByLibrary.simpleMessage("جنوب"),
    "compass_se": MessageLookupByLibrary.simpleMessage("جنوب شرقي"),
    "compass_sw": MessageLookupByLibrary.simpleMessage("جنوب غربي"),
    "compass_w": MessageLookupByLibrary.simpleMessage("غرب"),
    "confirmValidation": MessageLookupByLibrary.simpleMessage(
      "من فضلك ادخل كلمة المرورمتطابق",
    ),
    "contact_address": MessageLookupByLibrary.simpleMessage("العنوان"),
    "contact_call": MessageLookupByLibrary.simpleMessage("اتصال"),
    "contact_email": MessageLookupByLibrary.simpleMessage("إيميل"),
    "contact_follow": MessageLookupByLibrary.simpleMessage("تابعنا"),
    "contact_holidays": MessageLookupByLibrary.simpleMessage("الإجازات"),
    "contact_hours": MessageLookupByLibrary.simpleMessage("مواعيد العمل"),
    "contact_intro": MessageLookupByLibrary.simpleMessage(
      "فريقنا بيرد في مواعيد العمل. لو في حاجة مستعجلة وإنت في رحلة، استخدم أرقام الطوارئ.",
    ),
    "contact_unset": MessageLookupByLibrary.simpleMessage(
      "بيانات التواصل لسه متنشرتش. DayGi يقدر يجاوبك على أغلب الأسئلة دلوقتي.",
    ),
    "contact_weekdays": MessageLookupByLibrary.simpleMessage("أيام الأسبوع"),
    "contact_weekend": MessageLookupByLibrary.simpleMessage("الويك إند"),
    "contact_whatsapp": MessageLookupByLibrary.simpleMessage("واتساب"),
    "create_request_admin_locked": MessageLookupByLibrary.simpleMessage(
      "من الأدمن",
    ),
    "create_request_admin_rates_hint": MessageLookupByLibrary.simpleMessage(
      "العربون وغرامة التأخير نسب ثابتة من المنصة ومش قابلة للتعديل",
    ),
    "create_request_budget": MessageLookupByLibrary.simpleMessage("الميزانية"),
    "create_request_budget_hint": MessageLookupByLibrary.simpleMessage(
      "حدد الميزانية",
    ),
    "create_request_category": MessageLookupByLibrary.simpleMessage("التصنيف"),
    "create_request_category_hint": MessageLookupByLibrary.simpleMessage(
      "اختار تصنيف الحاجة",
    ),
    "create_request_change_photo": MessageLookupByLibrary.simpleMessage(
      "تغيير الصورة",
    ),
    "create_request_close_note": m21,
    "create_request_contacts_hint": MessageLookupByLibrary.simpleMessage(
      "اختار إيه اللي اليوزر التاني يشوفه بعد ما يبدأ التواصل على الطلب",
    ),
    "create_request_contacts_title": MessageLookupByLibrary.simpleMessage(
      "وسائل التواصل",
    ),
    "create_request_cycle_deposit": MessageLookupByLibrary.simpleMessage(
      "العربون",
    ),
    "create_request_cycle_deposit_sub": m22,
    "create_request_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "التأمين، بعدين العربون، وبعدين غرامة التأخير لو حصلت",
    ),
    "create_request_cycle_insurance": MessageLookupByLibrary.simpleMessage(
      "التأمين",
    ),
    "create_request_cycle_insurance_sub": m23,
    "create_request_cycle_late_fee": MessageLookupByLibrary.simpleMessage(
      "غرامة التأخير",
    ),
    "create_request_cycle_late_fee_sub": m24,
    "create_request_cycle_title": MessageLookupByLibrary.simpleMessage(
      "دورة المبالغ",
    ),
    "create_request_date_hint": MessageLookupByLibrary.simpleMessage(
      "اختر التاريخ",
    ),
    "create_request_deal_both": MessageLookupByLibrary.simpleMessage(
      "إيجار وشراء",
    ),
    "create_request_deal_type": MessageLookupByLibrary.simpleMessage(
      "إيجار ولا شراء",
    ),
    "create_request_delivery_either": MessageLookupByLibrary.simpleMessage(
      "مش فارق معايا",
    ),
    "create_request_delivery_onsite": MessageLookupByLibrary.simpleMessage(
      "يوصلوا للمكان",
    ),
    "create_request_delivery_pickup": MessageLookupByLibrary.simpleMessage(
      "أنا اللي هستلم",
    ),
    "create_request_delivery_title": MessageLookupByLibrary.simpleMessage(
      "التوصيل",
    ),
    "create_request_deposit": MessageLookupByLibrary.simpleMessage("العربون"),
    "create_request_description": MessageLookupByLibrary.simpleMessage("الوصف"),
    "create_request_description_hint": MessageLookupByLibrary.simpleMessage(
      "اكتب وصف الحاجة",
    ),
    "create_request_edit": MessageLookupByLibrary.simpleMessage("تعديل"),
    "create_request_editable": MessageLookupByLibrary.simpleMessage(
      "تقدر تعدّل",
    ),
    "create_request_err_budget": MessageLookupByLibrary.simpleMessage(
      "حط ميزانية بالجنيه المصري",
    ),
    "create_request_err_category": MessageLookupByLibrary.simpleMessage(
      "اختار تصنيف الحاجة أولًا",
    ),
    "create_request_err_date": MessageLookupByLibrary.simpleMessage(
      "اختار تاريخ الاحتياج",
    ),
    "create_request_err_description": MessageLookupByLibrary.simpleMessage(
      "اكتب وصف واضح للحاجة",
    ),
    "create_request_err_description_short":
        MessageLookupByLibrary.simpleMessage(
          "الوصف قصير أوي — اكتب تفاصيل أكتر",
        ),
    "create_request_err_location": MessageLookupByLibrary.simpleMessage(
      "حدد مكان التسليم على الخريطة",
    ),
    "create_request_err_min_qty": MessageLookupByLibrary.simpleMessage(
      "الحد الأدنى أكبر من الكمية المطلوبة",
    ),
    "create_request_err_percent": MessageLookupByLibrary.simpleMessage(
      "حط نسبة من ٠ لـ ١٠٠",
    ),
    "create_request_err_quantity": MessageLookupByLibrary.simpleMessage(
      "حدد كمية صحيحة (١ فأكتر)",
    ),
    "create_request_err_terms": MessageLookupByLibrary.simpleMessage(
      "وافق على الشروط والأحكام قبل النشر",
    ),
    "create_request_hashtag_hint": MessageLookupByLibrary.simpleMessage(
      "اكتب # لاختيار هاشتاج من التصنيفات",
    ),
    "create_request_insurance_amount": m25,
    "create_request_insurance_buy": MessageLookupByLibrary.simpleMessage(
      "تأمين الشراء ٪",
    ),
    "create_request_insurance_payer_owner":
        MessageLookupByLibrary.simpleMessage("صاحب الحاجة"),
    "create_request_insurance_payer_requester":
        MessageLookupByLibrary.simpleMessage("أنا (الطالب)"),
    "create_request_insurance_payer_title":
        MessageLookupByLibrary.simpleMessage("مين هيدفع التأمين؟"),
    "create_request_insurance_rent": MessageLookupByLibrary.simpleMessage(
      "تأمين الإيجار ٪",
    ),
    "create_request_late_fee": MessageLookupByLibrary.simpleMessage(
      "غرامة التأخير ٪",
    ),
    "create_request_location": MessageLookupByLibrary.simpleMessage("المكان"),
    "create_request_location_hint": MessageLookupByLibrary.simpleMessage(
      "حدد المكان",
    ),
    "create_request_location_value": m26,
    "create_request_min_qty": MessageLookupByLibrary.simpleMessage(
      "الحد الأدنى",
    ),
    "create_request_need_by": MessageLookupByLibrary.simpleMessage(
      "محتاجها إمتى؟",
    ),
    "create_request_payment_cash": MessageLookupByLibrary.simpleMessage("كاش"),
    "create_request_payment_hint": MessageLookupByLibrary.simpleMessage(
      "اختار هتدفع أونلاين ولا كاش عند الاستلام",
    ),
    "create_request_payment_online": MessageLookupByLibrary.simpleMessage(
      "أونلاين",
    ),
    "create_request_payment_title": MessageLookupByLibrary.simpleMessage(
      "طريقة الدفع",
    ),
    "create_request_phone_label": MessageLookupByLibrary.simpleMessage(
      "رقم الموبايل",
    ),
    "create_request_photo_added": MessageLookupByLibrary.simpleMessage(
      "تم إضافة صورة",
    ),
    "create_request_photo_chip_off": MessageLookupByLibrary.simpleMessage(
      "من غير صورة",
    ),
    "create_request_photo_chip_on": MessageLookupByLibrary.simpleMessage(
      "فيها صورة",
    ),
    "create_request_photo_subtitle": MessageLookupByLibrary.simpleMessage(
      "الطلبات اللي فيها صورة بتاخد عروض أكتر ٣ مرات",
    ),
    "create_request_photo_title": MessageLookupByLibrary.simpleMessage(
      "صوّر الحاجة أو حاجة شبهها",
    ),
    "create_request_publish": MessageLookupByLibrary.simpleMessage(
      "تأكيد ونشر الطلب",
    ),
    "create_request_quantity": MessageLookupByLibrary.simpleMessage("الكمية"),
    "create_request_quantity_hint": MessageLookupByLibrary.simpleMessage(
      "حدد الكمية",
    ),
    "create_request_radius_hint": MessageLookupByLibrary.simpleMessage(
      "اضغط لاختيار النطاق، واضغط تاني لإلغاء الاختيار — كل ما النطاق أكبر، هتوصل لناس أكتر",
    ),
    "create_request_radius_km": m27,
    "create_request_radius_title": MessageLookupByLibrary.simpleMessage(
      "نطاق الوصول",
    ),
    "create_request_reach": m28,
    "create_request_remove_photo": MessageLookupByLibrary.simpleMessage(
      "إزالة",
    ),
    "create_request_share_phone": MessageLookupByLibrary.simpleMessage(
      "إظهار رقم الموبايل",
    ),
    "create_request_share_phone_hint": MessageLookupByLibrary.simpleMessage(
      "هيظهر في بروفايلك وفي الشات لو فعّلته",
    ),
    "create_request_share_whatsapp": MessageLookupByLibrary.simpleMessage(
      "إظهار واتساب",
    ),
    "create_request_share_whatsapp_hint": MessageLookupByLibrary.simpleMessage(
      "يقدر يراسلك على واتساب مباشرة",
    ),
    "create_request_step": m29,
    "create_request_step2_subtitle": MessageLookupByLibrary.simpleMessage(
      "حدد النطاق والتوصيل قبل النشر",
    ),
    "create_request_step2_title": MessageLookupByLibrary.simpleMessage(
      "مين هيشوف طلبك؟",
    ),
    "create_request_submit": MessageLookupByLibrary.simpleMessage("اعرض طلبي"),
    "create_request_submitted": MessageLookupByLibrary.simpleMessage(
      "تم نشر طلبك، هتوصلك العروض قريب",
    ),
    "create_request_summary_line": m30,
    "create_request_summary_title": MessageLookupByLibrary.simpleMessage(
      "ملخص طلبك",
    ),
    "create_request_terms_accept": MessageLookupByLibrary.simpleMessage(
      "موافق على شروط وأحكام الطلب",
    ),
    "create_request_terms_link": MessageLookupByLibrary.simpleMessage(
      "اقرأ الشروط والأحكام",
    ),
    "create_request_terms_title": MessageLookupByLibrary.simpleMessage(
      "شروط الطلب",
    ),
    "create_request_title": MessageLookupByLibrary.simpleMessage(
      "محتاج إيه بالظبط؟",
    ),
    "create_request_validation": MessageLookupByLibrary.simpleMessage(
      "كمّل بيانات الطلب الأول",
    ),
    "create_request_verified_hint": MessageLookupByLibrary.simpleMessage(
      "هيقلل العدد، بس هيرفع ثقة العروض",
    ),
    "create_request_verified_title": MessageLookupByLibrary.simpleMessage(
      "موثقين فقط",
    ),
    "create_request_whatsapp_label": MessageLookupByLibrary.simpleMessage(
      "رقم واتساب",
    ),
    "create_request_whatsapp_same": MessageLookupByLibrary.simpleMessage(
      "نفس رقم الموبايل",
    ),
    "create_request_whatsapp_same_hint": MessageLookupByLibrary.simpleMessage(
      "استخدم رقم الموبايل كواتساب",
    ),
    "daygi_body": MessageLookupByLibrary.simpleMessage(
      "قول محتاج إيه، ونبدأ خطة حواليه. التفاصيل بتتأكد مع أهل المكان.",
    ),
    "daygi_hint": MessageLookupByLibrary.simpleMessage(
      "عايز حاجة هادية بعد الغطس",
    ),
    "daygi_send": MessageLookupByLibrary.simpleMessage("خطّط حواليها"),
    "daygi_title": MessageLookupByLibrary.simpleMessage("اسأل DayGi"),
    "daygi_try": MessageLookupByLibrary.simpleMessage("جرّب"),
    "dg_add_to_day": m31,
    "dg_added": MessageLookupByLibrary.simpleMessage("في خطتك"),
    "dg_day_n": m32,
    "dg_days": m33,
    "dg_days_pick": MessageLookupByLibrary.simpleMessage("كام يوم"),
    "dg_greeting": MessageLookupByLibrary.simpleMessage(
      "أهلاً! قولّي عايز أيامك تبقى عاملة إزاي. هرد عليك بطلعات حقيقية تتحجز، وأبنيلك الخطة تحت.",
    ),
    "dg_hint": MessageLookupByLibrary.simpleMessage("اكتب أو اتكلم…"),
    "dg_local_none": MessageLookupByLibrary.simpleMessage(
      "مفيش حاجة تتحجز مطابقة لسه. جرّب نوع طلعة أو مكان أو ميزانية.",
    ),
    "dg_local_reply": m34,
    "dg_plan_day": m35,
    "dg_plan_empty": MessageLookupByLibrary.simpleMessage(
      "مفيش حاجة في اليوم ده لسه. دوس \"ضيف لليوم\" على أي كارت فوق.",
    ),
    "dg_plan_empty_short": MessageLookupByLibrary.simpleMessage("فاضية"),
    "dg_remove": MessageLookupByLibrary.simpleMessage("شيل"),
    "dg_send": MessageLookupByLibrary.simpleMessage("ابعت"),
    "dg_sign_in_note": MessageLookupByLibrary.simpleMessage(
      "سجّل دخول وDayGi يقدر كمان يخطط حوالين رحلتك المحجوزة.",
    ),
    "dg_sources": m36,
    "dg_sources_prices": MessageLookupByLibrary.simpleMessage(
      "الأسعار من الموردين مباشرة",
    ),
    "dg_subtitle": MessageLookupByLibrary.simpleMessage("عارف دهب كويس"),
    "dg_swap": MessageLookupByLibrary.simpleMessage("بدّل"),
    "dg_try_1": MessageLookupByLibrary.simpleMessage(
      "٣ أيام هادية لاتنين: سنوركل وغروب حلو",
    ),
    "dg_try_2": MessageLookupByLibrary.simpleMessage(
      "أول غطسة ليا، من غير قلق",
    ),
    "dg_try_3": MessageLookupByLibrary.simpleMessage("يوم صحرا وعشا بدوي"),
    "dg_voice": MessageLookupByLibrary.simpleMessage("كلّم DayGi"),
    "dg_voice_unavailable": MessageLookupByLibrary.simpleMessage(
      "الكلام بالصوت مش متاح على الجهاز ده.",
    ),
    "dg_why": MessageLookupByLibrary.simpleMessage("ليه:"),
    "discover_air": MessageLookupByLibrary.simpleMessage("الجو"),
    "discover_ask_daygi": MessageLookupByLibrary.simpleMessage("اسأل DayGi"),
    "discover_doors_title": m37,
    "discover_early_note": m38,
    "discover_hero_cta": MessageLookupByLibrary.simpleMessage("خطّط رحلتي"),
    "discover_hero_explore": m39,
    "discover_hero_note": MessageLookupByLibrary.simpleMessage(
      "حجز مباشر موثّق · إلغاء مرن · ترشيحات من أهل المكان",
    ),
    "discover_live": m40,
    "discover_pick_cta": MessageLookupByLibrary.simpleMessage("خطّط حواليها"),
    "discover_picks_title": m41,
    "discover_plans_all": MessageLookupByLibrary.simpleMessage("قارن"),
    "discover_plans_title": m42,
    "discover_prompt_body": MessageLookupByLibrary.simpleMessage(
      "قولنا مين جاي وبتحب إيه، ونقترح عليك خطط ونقولك كل واحدة مناسبة ليه.",
    ),
    "discover_prompt_cta": MessageLookupByLibrary.simpleMessage("يلا نخطط"),
    "discover_prompt_title": MessageLookupByLibrary.simpleMessage(
      "مش عارف تبدأ منين؟",
    ),
    "discover_source": m43,
    "discover_stories_note": m44,
    "discover_stories_title": m45,
    "discover_sunset": MessageLookupByLibrary.simpleMessage("المغرب"),
    "discover_switch_label": MessageLookupByLibrary.simpleMessage(
      "اختار المكان",
    ),
    "discover_water": MessageLookupByLibrary.simpleMessage("الميّة"),
    "discover_wind": MessageLookupByLibrary.simpleMessage("الهوا"),
    "done": MessageLookupByLibrary.simpleMessage("تم"),
    "emergency_intro": MessageLookupByLibrary.simpleMessage(
      "دوس على الرقم عشان تتصل. في طوارئ الغطس، كلّم غرفة الضغط الأول.",
    ),
    "emergency_saved": MessageLookupByLibrary.simpleMessage(
      "مفيش نت — دي الأرقام المحفوظة في التطبيق.",
    ),
    "error_BadRequest_Error": MessageLookupByLibrary.simpleMessage(
      "طلب غير صالح",
    ),
    "error_NotFound_Error": MessageLookupByLibrary.simpleMessage(
      "لم يتم العثور على نتائج",
    ),
    "error_Timeout_Error": MessageLookupByLibrary.simpleMessage("انتهت المدة"),
    "error_Unauthorized_Error": MessageLookupByLibrary.simpleMessage(
      "غير مصرح",
    ),
    "error_cancel_token": MessageLookupByLibrary.simpleMessage(
      "تم مقاطعة الاتصال",
    ),
    "error_confirm_password": MessageLookupByLibrary.simpleMessage(
      "كلمة المرور غير مطابقة",
    ),
    "error_conflict": MessageLookupByLibrary.simpleMessage("خطأ تعارض"),
    "error_connection": MessageLookupByLibrary.simpleMessage(
      "حصل خطأ اثناء اتصالك بالشبكة",
    ),
    "error_connection_lost": MessageLookupByLibrary.simpleMessage(
      "تم فقد الاتصال",
    ),
    "error_forbidden_error": MessageLookupByLibrary.simpleMessage(
      "ليس لديك الصلاحية",
    ),
    "error_general": MessageLookupByLibrary.simpleMessage("حصل خطأ غير متوقع"),
    "error_internal_server": MessageLookupByLibrary.simpleMessage(
      "حصل خطأ في السيرفر",
    ),
    "error_socket": MessageLookupByLibrary.simpleMessage(
      "تأكد من إتصالك بالانترنيت",
    ),
    "explore_deal_all": MessageLookupByLibrary.simpleMessage("الكل"),
    "explore_empty_request": MessageLookupByLibrary.simpleMessage(
      "اطلبها ونلاقيها لك",
    ),
    "explore_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "جرّب توسّع النطاق، أو اطلب الحاجة ونلاقيها لك.",
    ),
    "explore_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش نتائج في النطاق ده",
    ),
    "explore_empty_title_radius": m46,
    "explore_empty_widen": MessageLookupByLibrary.simpleMessage("وسّع النطاق"),
    "explore_empty_widen_to": m47,
    "explore_results_count": m48,
    "explore_search_hint": MessageLookupByLibrary.simpleMessage(
      "دور على كراسي، كوشة، إضاءة…",
    ),
    "explore_sort_cheapest": MessageLookupByLibrary.simpleMessage("الأرخص"),
    "explore_sort_label": MessageLookupByLibrary.simpleMessage("ترتيب النتائج"),
    "explore_sort_nearest": MessageLookupByLibrary.simpleMessage("الأقرب"),
    "explore_sort_rating": MessageLookupByLibrary.simpleMessage(
      "الأعلى تقييماً",
    ),
    "explore_sort_soonest": MessageLookupByLibrary.simpleMessage(
      "الأقرب موعدًا",
    ),
    "explore_subtitle": m49,
    "explore_title": MessageLookupByLibrary.simpleMessage("استكشف"),
    "failureActions": MessageLookupByLibrary.simpleMessage("إجراءات الفشل"),
    "fillField": MessageLookupByLibrary.simpleMessage("الرجاء ملء الحقل"),
    "handover_countdown": m50,
    "handover_done": MessageLookupByLibrary.simpleMessage("تم العرض"),
    "handover_open_ritual": MessageLookupByLibrary.simpleMessage(
      "عرض بملء الشاشة",
    ),
    "handover_show_hint": MessageLookupByLibrary.simpleMessage(
      "خلّي الشاشة واضحة قدام الطرف التاني",
    ),
    "handover_show_title": MessageLookupByLibrary.simpleMessage(
      "ورّي الكود للمزوّد",
    ),
    "home_ask_hint": MessageLookupByLibrary.simpleMessage(
      "اسأل DayGi — اكتب أو اتكلم",
    ),
    "home_ask_placeholder": MessageLookupByLibrary.simpleMessage(
      "اكتب طلبك أو قوله، وإحنا نرتّبه",
    ),
    "home_available_on": m51,
    "home_back": MessageLookupByLibrary.simpleMessage("رجوع"),
    "home_buy": MessageLookupByLibrary.simpleMessage("شراء"),
    "home_card_offer": MessageLookupByLibrary.simpleMessage("قدّم عرض"),
    "home_categories_title": MessageLookupByLibrary.simpleMessage("التصنيفات"),
    "home_days_to_trip": m52,
    "home_distance_km": m53,
    "home_door_ask": MessageLookupByLibrary.simpleMessage("اسأل DayGi"),
    "home_door_browse": MessageLookupByLibrary.simpleMessage("شوف الطلعات"),
    "home_door_plan": MessageLookupByLibrary.simpleMessage("ابدأ خطة"),
    "home_doors_see_all": MessageLookupByLibrary.simpleMessage("عرض الكل"),
    "home_due_in_days": m54,
    "home_due_today": MessageLookupByLibrary.simpleMessage("محتاجها النهارده"),
    "home_due_tomorrow": MessageLookupByLibrary.simpleMessage("محتاجها بكرة"),
    "home_exit_hint": MessageLookupByLibrary.simpleMessage(
      "دوس رجوع تاني عشان تخرج",
    ),
    "home_featured_label": MessageLookupByLibrary.simpleMessage("أقرب موعد"),
    "home_greeting_evening": MessageLookupByLibrary.simpleMessage("مساء الخير"),
    "home_greeting_morning": MessageLookupByLibrary.simpleMessage("صباح الخير"),
    "home_greeting_named": m55,
    "home_headline": MessageLookupByLibrary.simpleMessage("محتاج إيه؟"),
    "home_headline_fulfiller": MessageLookupByLibrary.simpleMessage(
      "في طلبات قريبة تقدر تنفّذها",
    ),
    "home_headline_fulfiller_sub": MessageLookupByLibrary.simpleMessage(
      "شوف الطلبات وابعث عرضك",
    ),
    "home_headline_sub": MessageLookupByLibrary.simpleMessage(
      "تصفّح الطلبات القريبة أو اطلب اللي محتاجه",
    ),
    "home_hello_afternoon": MessageLookupByLibrary.simpleMessage("نهارك سعيد"),
    "home_hello_evening": MessageLookupByLibrary.simpleMessage("مساء الفل"),
    "home_hello_morning": MessageLookupByLibrary.simpleMessage("صباح الفل"),
    "home_hello_name": m56,
    "home_live": MessageLookupByLibrary.simpleMessage("مباشر"),
    "home_live_from": m57,
    "home_location_km": m58,
    "home_nav_account": MessageLookupByLibrary.simpleMessage("حسابي"),
    "home_nav_daygi": MessageLookupByLibrary.simpleMessage("DayGi"),
    "home_nav_discover": MessageLookupByLibrary.simpleMessage("اكتشف"),
    "home_nav_explore": MessageLookupByLibrary.simpleMessage("استكشف"),
    "home_nav_home": MessageLookupByLibrary.simpleMessage("الرئيسية"),
    "home_nav_orders": MessageLookupByLibrary.simpleMessage("طلباتي"),
    "home_nav_plan": MessageLookupByLibrary.simpleMessage("خطّط"),
    "home_nav_request": MessageLookupByLibrary.simpleMessage("اطلب"),
    "home_nav_today": MessageLookupByLibrary.simpleMessage("النهارده"),
    "home_nav_trip": MessageLookupByLibrary.simpleMessage("رحلتي"),
    "home_nearest": MessageLookupByLibrary.simpleMessage("الأقرب"),
    "home_need_by_chip": m59,
    "home_notifications": MessageLookupByLibrary.simpleMessage("الإشعارات"),
    "home_price_unit_day": MessageLookupByLibrary.simpleMessage("/اليوم"),
    "home_radius_label": m60,
    "home_reach_line": m61,
    "home_rent": MessageLookupByLibrary.simpleMessage("إيجار"),
    "home_request_subtitle": m62,
    "home_request_title": MessageLookupByLibrary.simpleMessage(
      "اطلبها ونلاقيها لك",
    ),
    "home_requests_section": MessageLookupByLibrary.simpleMessage(
      "طلبات قريبة",
    ),
    "home_search_hint": MessageLookupByLibrary.simpleMessage(
      "ملابس، إلكترونيات، مواد غذائية…",
    ),
    "home_see_all": MessageLookupByLibrary.simpleMessage("شوف الكل"),
    "home_side_empty": MessageLookupByLibrary.simpleMessage(
      "مفيش طلبات في التصنيف ده دلوقتي",
    ),
    "home_today_in": m63,
    "home_trip_day": m64,
    "home_view_all": m65,
    "info_empty": MessageLookupByLibrary.simpleMessage("لسه مفيش محتوى هنا."),
    "info_load_failed": MessageLookupByLibrary.simpleMessage(
      "مقدرناش نحمّل الصفحة. اتأكد من النت وجرّب تاني.",
    ),
    "internet_connected": MessageLookupByLibrary.simpleMessage(
      "تم الاتصال بالانترنت",
    ),
    "label_Login": MessageLookupByLibrary.simpleMessage("تسجيل دخول"),
    "label_app_language": MessageLookupByLibrary.simpleMessage("اللغة"),
    "label_change_language": MessageLookupByLibrary.simpleMessage(
      "تغيير اللغة",
    ),
    "label_choose_language": MessageLookupByLibrary.simpleMessage(
      "اختيار اللغة",
    ),
    "label_confirm_password": MessageLookupByLibrary.simpleMessage(
      "تأكيد كلمة المرور",
    ),
    "label_email": MessageLookupByLibrary.simpleMessage("البريد الاكتروني"),
    "label_forget_pass": MessageLookupByLibrary.simpleMessage(
      "تغيير كلمة المرور؟",
    ),
    "label_full_name": MessageLookupByLibrary.simpleMessage("الاسم الكامل"),
    "label_logout": MessageLookupByLibrary.simpleMessage("تسجيل خروج"),
    "label_password": MessageLookupByLibrary.simpleMessage("كلمة المرور"),
    "label_phone": MessageLookupByLibrary.simpleMessage("رقم الهاتف"),
    "label_register": MessageLookupByLibrary.simpleMessage("تسجيل حساب جديد"),
    "lifecycle_chosen": MessageLookupByLibrary.simpleMessage("مختار"),
    "lifecycle_done": MessageLookupByLibrary.simpleMessage("تم"),
    "lifecycle_handover": MessageLookupByLibrary.simpleMessage("تسليم"),
    "lifecycle_offers": MessageLookupByLibrary.simpleMessage("عروض"),
    "lifecycle_published": MessageLookupByLibrary.simpleMessage("منشور"),
    "listing_availability": m66,
    "listing_book": m67,
    "listing_buy": MessageLookupByLibrary.simpleMessage("شراء"),
    "listing_fulfill_cta": MessageLookupByLibrary.simpleMessage(
      "قدّم عرضك على الطلب",
    ),
    "listing_fulfill_sheet_hint": m68,
    "listing_fulfill_sheet_title": MessageLookupByLibrary.simpleMessage(
      "قدّم عرضك للطالب ده",
    ),
    "listing_fulfill_submit": MessageLookupByLibrary.simpleMessage(
      "إرسال عرضك للطالب",
    ),
    "listing_listed_total": MessageLookupByLibrary.simpleMessage(
      "سعر العرض المعروض",
    ),
    "listing_min_qty_label": MessageLookupByLibrary.simpleMessage(
      "الحد الأدنى",
    ),
    "listing_offer_cta": MessageLookupByLibrary.simpleMessage("تقديم عرض"),
    "listing_offer_details_hint": MessageLookupByLibrary.simpleMessage(
      "نفس شروط التأمين والعربون وغرامة التأخير اللي صاحب الحاجة حاططها",
    ),
    "listing_offer_details_title": MessageLookupByLibrary.simpleMessage(
      "تفاصيل العرض المعروض",
    ),
    "listing_offer_err_price": MessageLookupByLibrary.simpleMessage(
      "اكتب سعر العرض",
    ),
    "listing_offer_err_qty": m69,
    "listing_offer_price_label": MessageLookupByLibrary.simpleMessage(
      "سعرك في العرض",
    ),
    "listing_offer_qty_label": m70,
    "listing_offer_sent": MessageLookupByLibrary.simpleMessage(
      "تم إرسال عرضك وفتحت المحادثة",
    ),
    "listing_offer_sheet_hint": m71,
    "listing_offer_sheet_title": MessageLookupByLibrary.simpleMessage(
      "قدّم عرضك على الحاجة دي",
    ),
    "listing_offer_submit": MessageLookupByLibrary.simpleMessage("إرسال العرض"),
    "listing_owner_label": MessageLookupByLibrary.simpleMessage("صاحب العرض"),
    "listing_qty": m72,
    "listing_rent": MessageLookupByLibrary.simpleMessage("إيجار"),
    "listing_request_details_hint": MessageLookupByLibrary.simpleMessage(
      "طالب بيدور على الحاجة دي — الشروط والعربون والتأمين ظاهرة هنا",
    ),
    "listing_request_details_title": MessageLookupByLibrary.simpleMessage(
      "تفاصيل الطلب المطلوب",
    ),
    "listing_reviews": m73,
    "listing_stock": m74,
    "listing_total_one_day": MessageLookupByLibrary.simpleMessage(
      "إجمالي يوم واحد",
    ),
    "loadingText": MessageLookupByLibrary.simpleMessage("تحميل…"),
    "mailValidation": MessageLookupByLibrary.simpleMessage(
      "من فضلك ادخل البريد صحيحا",
    ),
    "map_abu_galum": MessageLookupByLibrary.simpleMessage("أبو جالوم"),
    "map_asala": MessageLookupByLibrary.simpleMessage("العصلة"),
    "map_blue_hole": MessageLookupByLibrary.simpleMessage("البلو هول"),
    "map_canyon": MessageLookupByLibrary.simpleMessage("الكانيون"),
    "map_eel_garden": MessageLookupByLibrary.simpleMessage("إيل جاردن"),
    "map_empty": MessageLookupByLibrary.simpleMessage(
      "مفيش حاجة مطابقة. جرّب يوم تاني أو امسح البحث.",
    ),
    "map_failed": MessageLookupByLibrary.simpleMessage(
      "معرفناش نحمّل التجارب. اسحب وجرّب تاني.",
    ),
    "map_gulf": MessageLookupByLibrary.simpleMessage("خليج العقبة"),
    "map_kind_all": MessageLookupByLibrary.simpleMessage("الكل"),
    "map_kind_culture": MessageLookupByLibrary.simpleMessage("بدوي وثقافة"),
    "map_kind_desert": MessageLookupByLibrary.simpleMessage("صحرا"),
    "map_kind_sea": MessageLookupByLibrary.simpleMessage("بحر"),
    "map_lagoon": MessageLookupByLibrary.simpleMessage("اللاجون"),
    "map_lighthouse": MessageLookupByLibrary.simpleMessage("الفنار"),
    "map_loading": MessageLookupByLibrary.simpleMessage("بنحمّل المتاح…"),
    "map_masbat": MessageLookupByLibrary.simpleMessage("المسبط"),
    "map_offline": MessageLookupByLibrary.simpleMessage(
      "من غير نت: بنعرض آخر أسعار متسجّلة على الموبايل",
    ),
    "map_open_on": m75,
    "map_open_today": m76,
    "map_search_hint": MessageLookupByLibrary.simpleMessage(
      "غطس، أكل، مكان هادي…",
    ),
    "map_three_pools": MessageLookupByLibrary.simpleMessage("التلات بِرَك"),
    "market_mode_fulfiller": MessageLookupByLibrary.simpleMessage("أنا بعرض"),
    "market_mode_requester": MessageLookupByLibrary.simpleMessage("أنا طالب"),
    "market_side_all": MessageLookupByLibrary.simpleMessage("الكل"),
    "market_side_offer": MessageLookupByLibrary.simpleMessage(
      "معروض للبيع / الإيجار",
    ),
    "market_side_offer_hint": MessageLookupByLibrary.simpleMessage(
      "صاحب حاجة عارضها — تقدر تقدّم عرض شراء أو إيجار",
    ),
    "market_side_offer_short": MessageLookupByLibrary.simpleMessage("معروض"),
    "market_side_request": MessageLookupByLibrary.simpleMessage(
      "مطلوب — ناس بتدور عليه",
    ),
    "market_side_request_hint": MessageLookupByLibrary.simpleMessage(
      "طالب بيدور على الحاجة دي — لو عندك زيها قدّم عرضك",
    ),
    "market_side_request_short": MessageLookupByLibrary.simpleMessage("مطلوب"),
    "market_side_requester_prefix": MessageLookupByLibrary.simpleMessage(
      "طالب:",
    ),
    "nameValidation": MessageLookupByLibrary.simpleMessage(
      "يجب أن يكون أكثر من ٨ احرف واقل من ٣٠",
    ),
    "noResults": MessageLookupByLibrary.simpleMessage("لا يوجد نتائج"),
    "no_internet_connection": MessageLookupByLibrary.simpleMessage(
      "لا يوجد اتصال بالانترنت",
    ),
    "offer_details_budget": MessageLookupByLibrary.simpleMessage("الميزانية"),
    "offer_details_confirm": MessageLookupByLibrary.simpleMessage(
      "تأكيد الاختيار",
    ),
    "offer_details_confirmed": MessageLookupByLibrary.simpleMessage(
      "تم اختيار العرض",
    ),
    "offer_details_confirmed_hint": MessageLookupByLibrary.simpleMessage(
      "هتقدر تكمل من المحادثة وطلبك",
    ),
    "offer_details_message": MessageLookupByLibrary.simpleMessage("راسله"),
    "offer_details_need_by": MessageLookupByLibrary.simpleMessage("الموعد"),
    "offer_details_pick_one": MessageLookupByLibrary.simpleMessage(
      "اختَر عرض واحد",
    ),
    "offer_details_product": MessageLookupByLibrary.simpleMessage(
      "تفاصيل المنتج",
    ),
    "offer_details_quantity": MessageLookupByLibrary.simpleMessage("الكمية"),
    "offer_details_selected": MessageLookupByLibrary.simpleMessage(
      "العرض المختار",
    ),
    "offer_details_switch_others": MessageLookupByLibrary.simpleMessage(
      "عرض العروض الأخرى",
    ),
    "offer_details_title": MessageLookupByLibrary.simpleMessage("تفاصيل العرض"),
    "offers_accept": MessageLookupByLibrary.simpleMessage("اقبل العرض"),
    "offers_ask": MessageLookupByLibrary.simpleMessage("اسأله"),
    "offers_back": MessageLookupByLibrary.simpleMessage("طلباتي"),
    "offers_best": MessageLookupByLibrary.simpleMessage("الأفضل"),
    "offers_commit_before": m77,
    "offers_compare": m78,
    "offers_compare_subtitle": MessageLookupByLibrary.simpleMessage(
      "سعر · مسافة · تقييم · سرعة الرد",
    ),
    "offers_compare_title": MessageLookupByLibrary.simpleMessage("قارن العروض"),
    "offers_currency": MessageLookupByLibrary.simpleMessage("ج"),
    "offers_deals_count": m79,
    "offers_delivery_free": MessageLookupByLibrary.simpleMessage("مجاني"),
    "offers_delivery_on_renter": MessageLookupByLibrary.simpleMessage(
      "على المستأجر",
    ),
    "offers_delivery_pickup": MessageLookupByLibrary.simpleMessage("استلام"),
    "offers_distance_km": m80,
    "offers_field_deals": MessageLookupByLibrary.simpleMessage("الصفقات"),
    "offers_field_delivery": MessageLookupByLibrary.simpleMessage("التوصيل"),
    "offers_field_insurance": MessageLookupByLibrary.simpleMessage("التأمين"),
    "offers_field_response": MessageLookupByLibrary.simpleMessage("الرد"),
    "offers_late_risk": MessageLookupByLibrary.simpleMessage("وقت ضيق"),
    "offers_new": MessageLookupByLibrary.simpleMessage("جديد"),
    "offers_nudge_last": m81,
    "offers_nudge_new": m82,
    "offers_request_summary": m83,
    "offers_response_minutes": m84,
    "offers_title": m85,
    "offers_verified": MessageLookupByLibrary.simpleMessage("موثق"),
    "offers_why_cheapest": MessageLookupByLibrary.simpleMessage("أقل سعر"),
    "offers_why_fastest": MessageLookupByLibrary.simpleMessage("أسرع"),
    "offers_why_nearest": MessageLookupByLibrary.simpleMessage("أقرب"),
    "offers_why_top_rated": MessageLookupByLibrary.simpleMessage("أعلى تقييم"),
    "onboard_1_body": MessageLookupByLibrary.simpleMessage(
      "شعاب وكانيونات وأيام هادية على البحر — وكل طلعة متشافة على رياح وبحر النهارده.",
    ),
    "onboard_1_eyebrow": MessageLookupByLibrary.simpleMessage(
      "دهب · جنوب سيناء",
    ),
    "onboard_1_title": MessageLookupByLibrary.simpleMessage(
      "اكتشف دهب زي أهلها",
    ),
    "onboard_2_body": MessageLookupByLibrary.simpleMessage(
      "قول إنت عايز إيه. DayGi يقترح طلعات حقيقية تقدر تحجزها ويبنيلك خطتك يوم بيوم.",
    ),
    "onboard_2_eyebrow": MessageLookupByLibrary.simpleMessage("DayGi · مرشدك"),
    "onboard_2_title": MessageLookupByLibrary.simpleMessage(
      "اسأل DayGi زي صاحبك اللي عايش هنا",
    ),
    "onboard_3_body": MessageLookupByLibrary.simpleMessage(
      "معاد التحرك، السواق، الفاوتشر من غير نت، وأرقام الطوارئ — كله في «النهارده».",
    ),
    "onboard_3_eyebrow": MessageLookupByLibrary.simpleMessage("يوم الرحلة"),
    "onboard_3_title": MessageLookupByLibrary.simpleMessage("يومك كله في جيبك"),
    "onboard_next": MessageLookupByLibrary.simpleMessage("التالي"),
    "onboard_progress": m86,
    "onboard_start": MessageLookupByLibrary.simpleMessage("ابدأ الاستكشاف"),
    "order_detail_actions_hint": MessageLookupByLibrary.simpleMessage(
      "حدّث حالة الطلب حسب مرحلة الصفقة",
    ),
    "order_detail_actions_title": MessageLookupByLibrary.simpleMessage(
      "حرّك الطلب",
    ),
    "order_detail_cash_note": MessageLookupByLibrary.simpleMessage(
      "الدفع كاش عند الاستلام",
    ),
    "order_detail_code_copied": MessageLookupByLibrary.simpleMessage(
      "تم نسخ الكود",
    ),
    "order_detail_code_copy": MessageLookupByLibrary.simpleMessage("نسخ الكود"),
    "order_detail_code_hint": MessageLookupByLibrary.simpleMessage(
      "ورّيه للطرف التاني عند الاستلام عشان يأكد إن الحاجة اتسلّمت",
    ),
    "order_detail_code_required": MessageLookupByLibrary.simpleMessage(
      "اكتب كود الاستلام",
    ),
    "order_detail_code_title": MessageLookupByLibrary.simpleMessage(
      "كود الاستلام",
    ),
    "order_detail_code_used_hint": MessageLookupByLibrary.simpleMessage(
      "الكود اتأكد قبل كده وتم الاستلام",
    ),
    "order_detail_code_verified": MessageLookupByLibrary.simpleMessage(
      "تم تأكيد الاستلام بنجاح",
    ),
    "order_detail_code_verified_badge": MessageLookupByLibrary.simpleMessage(
      "تم تأكيد الاستلام",
    ),
    "order_detail_enter_code_hint": MessageLookupByLibrary.simpleMessage(
      "اطلب الكود من الطرف التاني واكتبه هنا عشان تأكد إن الحاجة اتسلّمت",
    ),
    "order_detail_enter_code_label": MessageLookupByLibrary.simpleMessage(
      "كود الاستلام",
    ),
    "order_detail_enter_code_submit": MessageLookupByLibrary.simpleMessage(
      "تأكيد الاستلام",
    ),
    "order_detail_enter_code_title": MessageLookupByLibrary.simpleMessage(
      "تأكيد الاستلام بالكود",
    ),
    "order_detail_event": m87,
    "order_detail_status_updated": MessageLookupByLibrary.simpleMessage(
      "تم تحديث حالة الطلب",
    ),
    "order_detail_timeline": MessageLookupByLibrary.simpleMessage("مسار الطلب"),
    "order_detail_title": MessageLookupByLibrary.simpleMessage("تفاصيل الطلب"),
    "orders_action_needed": m88,
    "orders_awaiting_peer": MessageLookupByLibrary.simpleMessage(
      "بانتظار عروض",
    ),
    "orders_empty_fulfiller_subtitle": MessageLookupByLibrary.simpleMessage(
      "لما تقبل تنفّذ طلب، هيظهر هنا",
    ),
    "orders_empty_fulfiller_title": MessageLookupByLibrary.simpleMessage(
      "مفيش عروض شغّالة دلوقتي",
    ),
    "orders_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "لما تبعت طلب أو تقبل عرض على طلب، هيظهر هنا.",
    ),
    "orders_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش طلبات هنا",
    ),
    "orders_filter_active": MessageLookupByLibrary.simpleMessage("جاري"),
    "orders_filter_all": MessageLookupByLibrary.simpleMessage("الكل"),
    "orders_filter_cancelled": MessageLookupByLibrary.simpleMessage("ملغي"),
    "orders_filter_done": MessageLookupByLibrary.simpleMessage("مكتمل"),
    "orders_meta": m89,
    "orders_next_details": MessageLookupByLibrary.simpleMessage("التفاصيل"),
    "orders_next_enter_code": MessageLookupByLibrary.simpleMessage(
      "دخّل كود الاستلام",
    ),
    "orders_next_offers": MessageLookupByLibrary.simpleMessage("شوف العروض"),
    "orders_next_pickup": MessageLookupByLibrary.simpleMessage(
      "تفاصيل الاستلام",
    ),
    "orders_next_show_code": MessageLookupByLibrary.simpleMessage(
      "ورّي كود الاستلام",
    ),
    "orders_next_track": MessageLookupByLibrary.simpleMessage("تابع الطلب"),
    "orders_role_fulfill": MessageLookupByLibrary.simpleMessage("عرضي"),
    "orders_status_accepted": MessageLookupByLibrary.simpleMessage(
      "تم قبول عرض",
    ),
    "orders_status_awaiting": MessageLookupByLibrary.simpleMessage(
      "بانتظار العروض",
    ),
    "orders_status_cancelled": MessageLookupByLibrary.simpleMessage("ملغي"),
    "orders_status_completed": MessageLookupByLibrary.simpleMessage("مكتمل"),
    "orders_status_confirmed": MessageLookupByLibrary.simpleMessage(
      "جاهز للاستلام",
    ),
    "orders_status_delivery": MessageLookupByLibrary.simpleMessage("استلام"),
    "orders_status_in_use": MessageLookupByLibrary.simpleMessage("تم التسليم"),
    "orders_subtitle": MessageLookupByLibrary.simpleMessage(
      "طلباتك والعروض اللي شغّالة عليها — من غير أسعار",
    ),
    "orders_tab_account": MessageLookupByLibrary.simpleMessage("حسابك قريباً"),
    "orders_tab_explore": MessageLookupByLibrary.simpleMessage("استكشف قريباً"),
    "orders_title": MessageLookupByLibrary.simpleMessage("طلباتي"),
    "passValidation": MessageLookupByLibrary.simpleMessage(
      "من فضلك ادخل على الاقل 6 حروف او ارقام",
    ),
    "pay_cancel_until": m90,
    "pay_cash": MessageLookupByLibrary.simpleMessage("الدفع عند الوصول"),
    "pay_cash_hint": m91,
    "pay_confirm": MessageLookupByLibrary.simpleMessage("أكّد الحجز"),
    "pay_currency_note": m92,
    "pay_currency_note_egp": MessageLookupByLibrary.simpleMessage(
      "الدفع بالجنيه المصري",
    ),
    "pay_done_title": MessageLookupByLibrary.simpleMessage("اتحجز"),
    "pay_expired": MessageLookupByLibrary.simpleMessage(
      "وقت الحجز خلص والأماكن رجعت متاحة. اختار معاد تاني.",
    ),
    "pay_failed": MessageLookupByLibrary.simpleMessage(
      "معرفناش نأكّد الحجز. المعاد لسه محجوزلك، جرّب تاني.",
    ),
    "pay_guests": m93,
    "pay_held": MessageLookupByLibrary.simpleMessage("محجوزلك"),
    "pay_method": MessageLookupByLibrary.simpleMessage("هتدفع إزاي"),
    "pay_open_trip": MessageLookupByLibrary.simpleMessage("افتح رحلتي"),
    "pay_pick_again": MessageLookupByLibrary.simpleMessage("اختار معاد تاني"),
    "pay_price_changed": m94,
    "pay_state_booked": m95,
    "pay_state_note": MessageLookupByLibrary.simpleMessage(
      "الحجز وتأكيد المورّد خطوتين منفصلين. أول ما المورّد يأكّد هتلاقيها في رحلتك.",
    ),
    "pay_state_payment": MessageLookupByLibrary.simpleMessage(
      "الدفع: عند الوصول، مفيش حاجة اتخصمت",
    ),
    "pay_state_waiting": m96,
    "pay_title": MessageLookupByLibrary.simpleMessage("راجع وأكّد"),
    "pay_total": MessageLookupByLibrary.simpleMessage("الإجمالي"),
    "phoneValidation": MessageLookupByLibrary.simpleMessage(
      "من فضلك ادخل الجوال صحيحا",
    ),
    "pick": MessageLookupByLibrary.simpleMessage("اختيار"),
    "pick_location_confirm": MessageLookupByLibrary.simpleMessage(
      "تأكيد المكان",
    ),
    "pick_location_current": MessageLookupByLibrary.simpleMessage(
      "موقعي الحالي",
    ),
    "pick_location_failed": MessageLookupByLibrary.simpleMessage(
      "مش قادرين نجيب العنوان دلوقتي",
    ),
    "pick_location_loading": MessageLookupByLibrary.simpleMessage(
      "بنجيب عنوان المكان…",
    ),
    "pick_location_title": MessageLookupByLibrary.simpleMessage("حدد المكان"),
    "plan_back": MessageLookupByLibrary.simpleMessage("رجوع"),
    "plan_budget_budget": MessageLookupByLibrary.simpleMessage("على قد الإيد"),
    "plan_budget_moderate": MessageLookupByLibrary.simpleMessage("مريح"),
    "plan_budget_perDay": MessageLookupByLibrary.simpleMessage("/ اليوم"),
    "plan_budget_premium": MessageLookupByLibrary.simpleMessage("دلّع نفسك"),
    "plan_building": MessageLookupByLibrary.simpleMessage("بنرتّبلك الخطط"),
    "plan_card_book": MessageLookupByLibrary.simpleMessage("احجز الخطة دي"),
    "plan_card_days": m97,
    "plan_card_estimate": MessageLookupByLibrary.simpleMessage("سعر تقديري"),
    "plan_card_freeTime": m98,
    "plan_card_from": MessageLookupByLibrary.simpleMessage("يبدأ من"),
    "plan_card_included": MessageLookupByLibrary.simpleMessage(
      "الخطة فيها إيه",
    ),
    "plan_card_pace": MessageLookupByLibrary.simpleMessage("الإيقاع"),
    "plan_card_perPerson": MessageLookupByLibrary.simpleMessage("للفرد"),
    "plan_card_request": MessageLookupByLibrary.simpleMessage("اطلب الخطة دي"),
    "plan_card_tweak": MessageLookupByLibrary.simpleMessage("عدّلها مع DayGi"),
    "plan_card_viewDays": MessageLookupByLibrary.simpleMessage(
      "شوفها يوم بيوم",
    ),
    "plan_detail_day": m99,
    "plan_detail_dayByDay": MessageLookupByLibrary.simpleMessage("يوم بيوم"),
    "plan_detail_highlights": MessageLookupByLibrary.simpleMessage(
      "أحلى ما فيها",
    ),
    "plan_detail_included": MessageLookupByLibrary.simpleMessage(
      "الخطة فيها إيه",
    ),
    "plan_early_note": m100,
    "plan_loadFailed": MessageLookupByLibrary.simpleMessage(
      "الخطط ماحمّلتش. اتأكد من النت وجرّب تاني.",
    ),
    "plan_next": MessageLookupByLibrary.simpleMessage("كمّل"),
    "plan_noMatches": MessageLookupByLibrary.simpleMessage(
      "لسه مفيش خطط هنا. جرّب مكان تاني أو شوف كل الخطط.",
    ),
    "plan_pace_active": MessageLookupByLibrary.simpleMessage("مليان"),
    "plan_pace_activeSub": MessageLookupByLibrary.simpleMessage(
      "كل يوم فيه حاجة",
    ),
    "plan_pace_balanced": MessageLookupByLibrary.simpleMessage("متوازن"),
    "plan_pace_balancedSub": MessageLookupByLibrary.simpleMessage(
      "برنامج وفيه مساحة",
    ),
    "plan_pace_relaxed": MessageLookupByLibrary.simpleMessage("على مهلك"),
    "plan_pace_relaxedSub": MessageLookupByLibrary.simpleMessage(
      "وقت فاضي كتير",
    ),
    "plan_party_couple": MessageLookupByLibrary.simpleMessage("إحنا الاتنين"),
    "plan_party_coupleSub": MessageLookupByLibrary.simpleMessage(
      "أماكن هادية وغروب حلو",
    ),
    "plan_party_family": MessageLookupByLibrary.simpleMessage("عيلة"),
    "plan_party_familySub": MessageLookupByLibrary.simpleMessage(
      "أيام مريحة ومناسبة للأطفال",
    ),
    "plan_party_friends": MessageLookupByLibrary.simpleMessage("أصحاب"),
    "plan_party_friendsSub": MessageLookupByLibrary.simpleMessage(
      "حاجات أكتر نعملها سوا",
    ),
    "plan_party_solo": MessageLookupByLibrary.simpleMessage("لوحدي"),
    "plan_party_soloSub": MessageLookupByLibrary.simpleMessage("على مزاجك"),
    "plan_q_budget": MessageLookupByLibrary.simpleMessage("الميزانية للفرد"),
    "plan_q_destination": MessageLookupByLibrary.simpleMessage("رايح فين؟"),
    "plan_q_pace": MessageLookupByLibrary.simpleMessage(
      "تحب الإيقاع يبقى إزاي؟",
    ),
    "plan_q_party": MessageLookupByLibrary.simpleMessage("مين جاي معاك؟"),
    "plan_q_vibes": MessageLookupByLibrary.simpleMessage("عايز تحس بإيه؟"),
    "plan_q_vibesHint": MessageLookupByLibrary.simpleMessage(
      "اختار اللي يعجبك، مش لازم واحد بس.",
    ),
    "plan_q_when": MessageLookupByLibrary.simpleMessage("قاعد قد إيه؟"),
    "plan_q_whenHint": MessageLookupByLibrary.simpleMessage(
      "عدد الليالي تقريباً، وتقدر تغيّره بعدين.",
    ),
    "plan_reason_budget": MessageLookupByLibrary.simpleMessage(
      "على قد ميزانيتك",
    ),
    "plan_reason_couple": MessageLookupByLibrary.simpleMessage("معمولة لاتنين"),
    "plan_reason_family": MessageLookupByLibrary.simpleMessage("مريحة للعيلة"),
    "plan_reason_length": m101,
    "plan_reason_pace": MessageLookupByLibrary.simpleMessage(
      "نفس الإيقاع اللي تحبه",
    ),
    "plan_reason_vibes": m102,
    "plan_request_failed": MessageLookupByLibrary.simpleMessage(
      "الطلب ماوصلش. اتأكد من النت وجرّب تاني.",
    ),
    "plan_request_sent": MessageLookupByLibrary.simpleMessage(
      "طلبك وصل، وفريقنا هيرد عليك على واتساب.",
    ),
    "plan_request_signIn": MessageLookupByLibrary.simpleMessage(
      "ادخل الأول عشان نبعت طلبك",
    ),
    "plan_results_allTitle": m103,
    "plan_results_best": m104,
    "plan_results_edit": MessageLookupByLibrary.simpleMessage("غيّر إجاباتي"),
    "plan_results_match": m105,
    "plan_results_showAll": MessageLookupByLibrary.simpleMessage(
      "اعرض كل الخطط",
    ),
    "plan_results_showMatches": MessageLookupByLibrary.simpleMessage(
      "ارجع للخطط المناسبة",
    ),
    "plan_results_sort": MessageLookupByLibrary.simpleMessage("رتّب الخطط"),
    "plan_results_title": m106,
    "plan_results_titleOne": MessageLookupByLibrary.simpleMessage(
      "لقيتلك خطة على مقاسك",
    ),
    "plan_save": MessageLookupByLibrary.simpleMessage("احفظ الخطة"),
    "plan_saved": MessageLookupByLibrary.simpleMessage("اتحفظت"),
    "plan_showPlans": MessageLookupByLibrary.simpleMessage("وريني الخطط"),
    "plan_skipToAll": MessageLookupByLibrary.simpleMessage(
      "سيبك، وريني كل الخطط",
    ),
    "plan_sort_best": MessageLookupByLibrary.simpleMessage("الأنسب"),
    "plan_sort_calm": MessageLookupByLibrary.simpleMessage("الأهدى"),
    "plan_sort_price": MessageLookupByLibrary.simpleMessage("الأرخص"),
    "plan_sort_short": MessageLookupByLibrary.simpleMessage("الأقصر"),
    "plan_startOver": MessageLookupByLibrary.simpleMessage("ابدأ من الأول"),
    "plan_step": m107,
    "plan_subtitle": MessageLookupByLibrary.simpleMessage(
      "كام سؤال سريع، وبعدها خطط على مقاسك. وتقدر تغيّر أي حاجة في أي وقت.",
    ),
    "plan_summary_empty": MessageLookupByLibrary.simpleMessage(
      "إجاباتك هتظهر هنا واحدة واحدة.",
    ),
    "plan_summary_title": MessageLookupByLibrary.simpleMessage(
      "رحلتك لحد دلوقتي",
    ),
    "plan_title": MessageLookupByLibrary.simpleMessage("يلا نظبط رحلتك"),
    "plan_vibe_adventure": MessageLookupByLibrary.simpleMessage("مغامرة"),
    "plan_vibe_culture": MessageLookupByLibrary.simpleMessage(
      "تاريخ وناس البلد",
    ),
    "plan_vibe_desert": MessageLookupByLibrary.simpleMessage("صحرا"),
    "plan_vibe_diving": MessageLookupByLibrary.simpleMessage("غطس"),
    "plan_vibe_food": MessageLookupByLibrary.simpleMessage("أكل"),
    "plan_vibe_nature": MessageLookupByLibrary.simpleMessage("مشي وطبيعة"),
    "plan_vibe_sea": MessageLookupByLibrary.simpleMessage("بحر وسنوركل"),
    "plan_vibe_stars": MessageLookupByLibrary.simpleMessage("نجوم بالليل"),
    "plan_vibe_unplug": MessageLookupByLibrary.simpleMessage("فصل عن الدنيا"),
    "plan_vibe_wellness": MessageLookupByLibrary.simpleMessage("استشفاء وراحة"),
    "plan_when_flexible": MessageLookupByLibrary.simpleMessage("لسه مش متأكد"),
    "plan_when_nights": m108,
    "plan_when_nightsUnit": MessageLookupByLibrary.simpleMessage("ليالي"),
    "plans_count": m109,
    "plans_detail_title": MessageLookupByLibrary.simpleMessage("خطتك"),
    "plans_new": MessageLookupByLibrary.simpleMessage("خطّط رحلة تانية"),
    "plans_remove": MessageLookupByLibrary.simpleMessage("شيلها"),
    "plans_saved_toast": MessageLookupByLibrary.simpleMessage("اتحفظت في خططك"),
    "plans_see": MessageLookupByLibrary.simpleMessage("شوف خططك"),
    "plans_subtitle": MessageLookupByLibrary.simpleMessage(
      "محفوظة على موبايلك. قارن بينهم، وابعت اللي عاجبك والفريق يأكدها مع أهل المكان.",
    ),
    "plans_title": MessageLookupByLibrary.simpleMessage("خططك"),
    "prefs_appearance": MessageLookupByLibrary.simpleMessage("المظهر"),
    "prefs_button_label": m110,
    "prefs_done": MessageLookupByLibrary.simpleMessage("تم"),
    "prefs_language": MessageLookupByLibrary.simpleMessage("اللغة"),
    "prefs_title": MessageLookupByLibrary.simpleMessage("اللغة والعرض"),
    "privacy_1_body": MessageLookupByLibrary.simpleMessage(
      "اسمك، وإيميلك أو تليفونك، ورحلاتك وحجوزاتك، والرسايل اللي بتبعتها لـDayGi أو لفريقنا.",
    ),
    "privacy_1_title": MessageLookupByLibrary.simpleMessage(
      "إيه اللي بنحتفظ بيه",
    ),
    "privacy_2_body": MessageLookupByLibrary.simpleMessage(
      "مشغّل الطلعة اللي بتحجزها بيشوف اسمك وتليفونك وتفاصيل الحجز عشان يقابلك. إحنا مش بنبيع بياناتك.",
    ),
    "privacy_2_title": MessageLookupByLibrary.simpleMessage("مين بيشوفها"),
    "privacy_3_body": MessageLookupByLibrary.simpleMessage(
      "جلسة الدخول واللغة والمظهر متخزنين على الجهاز ده. وآخر رحلة ليك متخزنة هنا كمان، عشان الفاوتشر يفتح من غير نت.",
    ),
    "privacy_3_title": MessageLookupByLibrary.simpleMessage("على الموبايل ده"),
    "privacy_4_body": MessageLookupByLibrary.simpleMessage(
      "التطبيق مش بيتتبع موقعك. الخرايط بتعرض الأماكن، مش إنت.",
    ),
    "privacy_4_title": MessageLookupByLibrary.simpleMessage("الموقع"),
    "privacy_5_body": MessageLookupByLibrary.simpleMessage(
      "بنستخدم Firebase عشان نعرف استخدام التطبيق ونسجل الأعطال ونصلحها. التقارير دي مفيهاش رسايلك ولا بيانات الدفع.",
    ),
    "privacy_5_title": MessageLookupByLibrary.simpleMessage("التشخيص"),
    "privacy_6_body": MessageLookupByLibrary.simpleMessage(
      "الدفع بالكارت بيتم عن طريق مزوّد الدفع. إحنا عمرنا ما بنشوف أو بنخزن رقم الكارت كامل.",
    ),
    "privacy_6_title": MessageLookupByLibrary.simpleMessage("الدفع"),
    "privacy_7_body": MessageLookupByLibrary.simpleMessage(
      "تقدر تعدّل بياناتك في أي وقت. ولو عايز تمسح حسابك وبياناتك، كلّمنا من «تواصل معانا».",
    ),
    "privacy_7_title": MessageLookupByLibrary.simpleMessage("اختياراتك"),
    "privacy_intro": MessageLookupByLibrary.simpleMessage(
      "بنجمع بس اللي محتاجينه عشان نخطط رحلتك وننفذها.",
    ),
    "retry": MessageLookupByLibrary.simpleMessage("إعادة المحاولة"),
    "save": MessageLookupByLibrary.simpleMessage("حفظ"),
    "search_any_day": MessageLookupByLibrary.simpleMessage("أي يوم"),
    "search_any_price": MessageLookupByLibrary.simpleMessage("أي سعر"),
    "search_ask_daygi": m111,
    "search_beginner": MessageLookupByLibrary.simpleMessage("مناسبة لأول مرة"),
    "search_clear": MessageLookupByLibrary.simpleMessage("امسح الفلاتر"),
    "search_dur_any": MessageLookupByLibrary.simpleMessage("أي مدة"),
    "search_dur_full": MessageLookupByLibrary.simpleMessage("يوم كامل"),
    "search_dur_half": MessageLookupByLibrary.simpleMessage("٣–٦ س"),
    "search_dur_short": MessageLookupByLibrary.simpleMessage("أقل من ٣ س"),
    "search_duration": MessageLookupByLibrary.simpleMessage("المدة"),
    "search_empty_body": MessageLookupByLibrary.simpleMessage(
      "جرّب يوم تاني أو قلّل الفلاتر.",
    ),
    "search_empty_title": MessageLookupByLibrary.simpleMessage(
      "مفيش طلعات مطابقة",
    ),
    "search_filters": MessageLookupByLibrary.simpleMessage("الفلاتر"),
    "search_filters_count": m112,
    "search_price": MessageLookupByLibrary.simpleMessage("السعر"),
    "search_price_up_to": m113,
    "search_reset": MessageLookupByLibrary.simpleMessage("إعادة ضبط"),
    "search_results": m114,
    "search_services": MessageLookupByLibrary.simpleMessage(
      "DayGi يقدر يساعدك في",
    ),
    "search_show_results": m115,
    "search_sort": MessageLookupByLibrary.simpleMessage("ترتيب حسب"),
    "search_sort_best": MessageLookupByLibrary.simpleMessage("الأنسب"),
    "search_sort_price_high": MessageLookupByLibrary.simpleMessage(
      "الأعلى سعراً",
    ),
    "search_sort_price_low": MessageLookupByLibrary.simpleMessage(
      "الأقل سعراً",
    ),
    "search_sort_short": MessageLookupByLibrary.simpleMessage("الأقصر"),
    "search_title": MessageLookupByLibrary.simpleMessage("دوّر على طلعة"),
    "search_when": MessageLookupByLibrary.simpleMessage("إمتى"),
    "search_wind_ok": MessageLookupByLibrary.simpleMessage(
      "مناسبة لرياح النهارده",
    ),
    "size_more_than_mg_error": m116,
    "something_went_wrong": MessageLookupByLibrary.simpleMessage("حدث خطأ ما"),
    "splash_brand": MessageLookupByLibrary.simpleMessage("دهب"),
    "splash_enter": MessageLookupByLibrary.simpleMessage("ادخل دهب"),
    "splash_eyebrow": MessageLookupByLibrary.simpleMessage(
      "دهب · قبل ما تحجز، شوفها",
    ),
    "splash_line": MessageLookupByLibrary.simpleMessage(
      "دهب ونويبع وسيوة — متخططة على مزاجك",
    ),
    "splash_scroll": MessageLookupByLibrary.simpleMessage("انزل للدخول"),
    "splash_skip": MessageLookupByLibrary.simpleMessage("تخطي"),
    "splash_subtitle": MessageLookupByLibrary.simpleMessage(
      "غوص وجبال صحراوية وأيام شاطئ هادية — منظمة حواليك.",
    ),
    "splash_tagline": MessageLookupByLibrary.simpleMessage(
      "حيث تلتقي الصحراء بالبحر",
    ),
    "splash_title": MessageLookupByLibrary.simpleMessage(
      "حيث تلتقي الصحراء بالبحر",
    ),
    "splash_trust": MessageLookupByLibrary.simpleMessage(
      "بياناتك ودفتر حساباتك مشفرة ومؤمّنة سحابياً",
    ),
    "splash_wordmark": MessageLookupByLibrary.simpleMessage("رحلة"),
    "terms_1_body": MessageLookupByLibrary.simpleMessage(
      "رحلة بتعرض طلعات بينظمها مشغّلين محليين مستقلين. المشغّل المكتوب اسمه على الطلعة هو اللي بينفذها ومسؤول عنها يومها.",
    ),
    "terms_1_title": MessageLookupByLibrary.simpleMessage(
      "مين اللي بينظّم طلعتك",
    ),
    "terms_2_body": MessageLookupByLibrary.simpleMessage(
      "لما تحجز، بنحجزلك مكانك لفترة قصيرة لحد ما تدفع. الدفع مش هو التأكيد: المشغّل هو اللي بيأكد الحجز، وهتشوف حالته بتتغير في «الرحلة».",
    ),
    "terms_2_title": MessageLookupByLibrary.simpleMessage(
      "الحجز المؤقت والدفع والتأكيد",
    ),
    "terms_3_body": MessageLookupByLibrary.simpleMessage(
      "الأسعار بالجنيه المصري وبتشمل اللي مكتوب إنه متضمن في كل طلعة. أي حاجة مش مكتوبة مش متضمنة.",
    ),
    "terms_3_title": MessageLookupByLibrary.simpleMessage("الأسعار"),
    "terms_4_body": MessageLookupByLibrary.simpleMessage(
      "كل طلعة بتوضح شروط الإلغاء قبل ما تدفع، زي الإلغاء المجاني لحد ٢٤ ساعة قبلها. الاسترداد بيمشي على الشروط دي وبيرجع على نفس وسيلة الدفع.",
    ),
    "terms_4_title": MessageLookupByLibrary.simpleMessage("الإلغاء والاسترداد"),
    "terms_5_body": MessageLookupByLibrary.simpleMessage(
      "طلعات البحر والصحرا بتعتمد على الظروف. لو الظروف خلت الطلعة مش آمنة، المشغّل ممكن يأجلها أو يلغيها. اتبع تعليمات المرشد، وهات أي شهادة الطلعة بتطلبها.",
    ),
    "terms_5_title": MessageLookupByLibrary.simpleMessage(
      "الرياح والبحر والأمان",
    ),
    "terms_6_body": MessageLookupByLibrary.simpleMessage(
      "DayGi مرشد بالذكاء الاصطناعي. اقتراحاته بداية — راجع المواعيد والأسعار والظروف على الطلعة قبل ما تحجز.",
    ),
    "terms_6_title": MessageLookupByLibrary.simpleMessage("اقتراحات DayGi"),
    "terms_7_body": MessageLookupByLibrary.simpleMessage(
      "خلّي بيانات الدخول بتاعتك سرية. إنت مسؤول عن الحجوزات اللي بتتعمل من حسابك.",
    ),
    "terms_7_title": MessageLookupByLibrary.simpleMessage("حسابك"),
    "terms_intro": MessageLookupByLibrary.simpleMessage(
      "الشروط دي بتغطي استخدامك لرحلة عشان تكتشف وتخطط وتحجز طلعات. لما تحجز، إنت موافق عليها.",
    ),
    "today_call": m117,
    "today_confirmed": MessageLookupByLibrary.simpleMessage("المورّد أكّد"),
    "today_day_of": m118,
    "today_done": MessageLookupByLibrary.simpleMessage("خلصت"),
    "today_driver": MessageLookupByLibrary.simpleMessage("السوّاق"),
    "today_em_hospital": MessageLookupByLibrary.simpleMessage(
      "طوارئ مستشفى دهب",
    ),
    "today_em_hyperbaric": MessageLookupByLibrary.simpleMessage(
      "طوارئ الغطس · غرفة الضغط",
    ),
    "today_em_police": MessageLookupByLibrary.simpleMessage("شرطة السياحة"),
    "today_emergency": MessageLookupByLibrary.simpleMessage("طوارئ"),
    "today_guide": MessageLookupByLibrary.simpleMessage("المرشد"),
    "today_in_hm": m119,
    "today_in_m": m120,
    "today_later": MessageLookupByLibrary.simpleMessage("بعدين"),
    "today_move_failed": MessageLookupByLibrary.simpleMessage(
      "معرفناش ننقلها. جرّب تاني أو كلّم المورّد.",
    ),
    "today_move_it": MessageLookupByLibrary.simpleMessage("انقلها"),
    "today_moved": m121,
    "today_next": MessageLookupByLibrary.simpleMessage("اللي جاي"),
    "today_no_person": MessageLookupByLibrary.simpleMessage(
      "المورّد هيبعت مين جاي قبل اليوم.",
    ),
    "today_none_action": MessageLookupByLibrary.simpleMessage(
      "دوّر على حاجة تحجزها",
    ),
    "today_none_body": MessageLookupByLibrary.simpleMessage(
      "رحلتك متسجّلة. احجز طلعات وهتلاقيها هنا بالمواعيد والتوصيل والقسايم.",
    ),
    "today_none_title": MessageLookupByLibrary.simpleMessage("لسه محجزتش حاجة"),
    "today_offline": MessageLookupByLibrary.simpleMessage(
      "بنعرض آخر نسخة متسجّلة على الموبايل",
    ),
    "today_operator": MessageLookupByLibrary.simpleMessage("المورّد"),
    "today_paid": MessageLookupByLibrary.simpleMessage("مدفوع"),
    "today_pending": MessageLookupByLibrary.simpleMessage("مستني المورّد"),
    "today_step_arrived": MessageLookupByLibrary.simpleMessage("وصل"),
    "today_step_confirmed": MessageLookupByLibrary.simpleMessage("اتأكّد"),
    "today_step_driver": MessageLookupByLibrary.simpleMessage("السوّاق"),
    "today_step_way": MessageLookupByLibrary.simpleMessage("في الطريق"),
    "today_title": MessageLookupByLibrary.simpleMessage("النهارده"),
    "today_under_way": MessageLookupByLibrary.simpleMessage("شغّالة دلوقتي"),
    "today_voucher": MessageLookupByLibrary.simpleMessage("القسيمة"),
    "today_voucher_hint": MessageLookupByLibrary.simpleMessage(
      "ورّيها للمورّد. شغّالة من غير شبكة.",
    ),
    "today_voucher_offline": MessageLookupByLibrary.simpleMessage(
      "شغّالة من غير نت",
    ),
    "today_voucher_ref_hint": MessageLookupByLibrary.simpleMessage(
      "ده رقم حجزك. كود المورّد بيظهر أول ما يأكّد.",
    ),
    "today_waiting_operator": MessageLookupByLibrary.simpleMessage(
      "مستنيين المورّد يأكّد",
    ),
    "today_wind": m122,
    "today_wind_alert": m123,
    "today_wind_ask": m124,
    "today_wind_offer": m125,
    "today_wind_other": MessageLookupByLibrary.simpleMessage("حاجة تانية"),
    "trip_change": MessageLookupByLibrary.simpleMessage("غيّر الخطة"),
    "trip_days_title": MessageLookupByLibrary.simpleMessage("الأيام"),
    "trip_days_to_go": m126,
    "trip_empty_body": MessageLookupByLibrary.simpleMessage(
      "لما الخطة تتأكد، التاب ده يبقى يومك: المواعيد، والحجوزات، واللي جاي.",
    ),
    "trip_empty_cta": MessageLookupByLibrary.simpleMessage("خطّط رحلتي"),
    "trip_empty_title": MessageLookupByLibrary.simpleMessage("رحلتك هنا"),
    "trip_keep": MessageLookupByLibrary.simpleMessage("دي رحلتي"),
    "trip_send": MessageLookupByLibrary.simpleMessage("ابعت للفريق"),
    "trip_sent_note": MessageLookupByLibrary.simpleMessage(
      "الفريق معاه الخطة، وهيأكدها مع المضيفين المحليين.",
    ),
    "trip_status_draft": MessageLookupByLibrary.simpleMessage("لسه ما اتبعتتش"),
    "trip_status_sent": MessageLookupByLibrary.simpleMessage("اتبعتت للفريق"),
    "trip_title": MessageLookupByLibrary.simpleMessage("رحلتك"),
    "tryAgain": MessageLookupByLibrary.simpleMessage("حاول مجددا"),
    "unit_knots": MessageLookupByLibrary.simpleMessage("عقدة"),
    "xp_about_usd": m127,
    "xp_ask_daygi": MessageLookupByLibrary.simpleMessage("اسأل DayGi عنها"),
    "xp_ask_daygi_q": m128,
    "xp_before": MessageLookupByLibrary.simpleMessage("قبل ما تروح"),
    "xp_book": MessageLookupByLibrary.simpleMessage("اختار معاد"),
    "xp_fact_duration": MessageLookupByLibrary.simpleMessage("المدة"),
    "xp_fact_group": MessageLookupByLibrary.simpleMessage("الجروب"),
    "xp_fact_level": MessageLookupByLibrary.simpleMessage("المستوى"),
    "xp_fact_meet": MessageLookupByLibrary.simpleMessage("مكان التجمّع"),
    "xp_fit_first_time": MessageLookupByLibrary.simpleMessage(
      "مناسبة لو أول مرة",
    ),
    "xp_fit_morning": MessageLookupByLibrary.simpleMessage(
      "طلعة الصبح، والميّة في أهدى وقت",
    ),
    "xp_fit_sunset": m129,
    "xp_fit_wind_high": m130,
    "xp_fit_wind_ok": m131,
    "xp_for_you": MessageLookupByLibrary.simpleMessage("مناسبة ليك:"),
    "xp_free_cancel": MessageLookupByLibrary.simpleMessage("إلغاء مجاني"),
    "xp_free_cancel_hours": m132,
    "xp_hour_half": MessageLookupByLibrary.simpleMessage("ساعة ونص"),
    "xp_hour_one": MessageLookupByLibrary.simpleMessage("ساعة"),
    "xp_hour_two": MessageLookupByLibrary.simpleMessage("ساعتين"),
    "xp_hours": m133,
    "xp_included": MessageLookupByLibrary.simpleMessage("إيه اللي متضمّن"),
    "xp_level_advanced": MessageLookupByLibrary.simpleMessage("متقدّم"),
    "xp_level_all": MessageLookupByLibrary.simpleMessage("كل المستويات"),
    "xp_level_beginner": MessageLookupByLibrary.simpleMessage("مبتدئ"),
    "xp_level_intermediate": MessageLookupByLibrary.simpleMessage("متوسط"),
    "xp_minutes": m134,
    "xp_operator_on": MessageLookupByLibrary.simpleMessage("مورّد على رحلة"),
    "xp_pay_on_arrival": MessageLookupByLibrary.simpleMessage(
      "الدفع عند الوصول",
    ),
    "xp_per_person": MessageLookupByLibrary.simpleMessage("للفرد"),
    "xp_per_person_long": MessageLookupByLibrary.simpleMessage("للفرد"),
    "xp_reliability": MessageLookupByLibrary.simpleMessage("التزام"),
    "xp_reliability_basis": m135,
    "xp_reliability_new": MessageLookupByLibrary.simpleMessage(
      "جديد، لسه مفيش سجل",
    ),
    "xp_reviews_from": m136,
    "xp_reviews_latest": m137,
    "xp_reviews_none": MessageLookupByLibrary.simpleMessage("لسه مفيش تقييمات"),
    "xp_reviews_none_hint": MessageLookupByLibrary.simpleMessage(
      "التقييمات بتظهر هنا بس من ناس راحت فعلاً. مش بنعرض تقييمات متألفة.",
    ),
    "xp_reviews_title": MessageLookupByLibrary.simpleMessage("الناس بتقول إيه"),
    "xp_up_to": m138,
  };
}
