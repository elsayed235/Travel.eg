// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a en locale. All the
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
  String get localeName => 'en';

  static String m0(count) => "${count} addresses";

  static String m1(deal, category, date) => "${deal} · ${category} · ${date}";

  static String m2(count, city) => "${count} incoming · ${city}";

  static String m3(qty, city) => "${qty} · ${city}";

  static String m4(km) => "${km} km";

  static String m5(qty, date, budget) =>
      "${qty} · ${date} · budget ${budget} EGP";

  static String m6(count, km) => "${count} offers · ${km} km radius";

  static String m7(name) => "${name}\'s offer fits your request best.";

  static String m8(name, reasons) =>
      "${name}\'s offer fits your request best: ${reasons}.";

  static String m9(title) => "Title: ${title}";

  static String m10(price) => "Use ${price}";

  static String m11(count) => "Based on ${count} accepted offers";

  static String m12(min, max, currency) =>
      "Typical price for similar requests nearby: ${min}–${max} ${currency}";

  static String m13(min, max, currency) =>
      "Suggested price: ${min}–${max} ${currency}";

  static String m14(count) => "Summary of ${count} reviews";

  static String m15(time) => "You can request a new code in ${time}";

  static String m16(phone) => "Enter the code sent to ${phone}";

  static String m17(current, total) => "Step ${current} of ${total}";

  static String m18(time) => "Last seen ${time}";

  static String m19(count) => "${count} new";

  static String m20(date) =>
      "Request closes automatically on ${date} if nothing is accepted.";

  static String m21(percent, amount) => "Platform rate ${percent} · ${amount}";

  static String m22(payer, amount) => "Paid by ${payer} · ${amount}";

  static String m23(percent, amount) => "Platform rate ${percent} · ${amount}";

  static String m24(amount) => "Equals ${amount}";

  static String m25(place, km) => "${place} - ${km} km";

  static String m26(km) => "${km} km";

  static String m27(count, date) =>
      "Your request will reach ${count} matching owners, and will close automatically on ${date}.";

  static String m28(current, total) => "${current} of ${total}";

  static String m29(qty, date) => "${qty} • ${date}";

  static String m30(place) => "What brings you to ${place}?";

  static String m31(place) =>
      "${place} is just opening on REHLA: plans first, bookings soon.";

  static String m32(place) => "Right now in ${place}";

  static String m33(place) => "Worth your time in ${place}";

  static String m34(source, time) => "${source} · ${time}";

  static String m35(km) => "No requests within ${km} km";

  static String m36(km) => "Widen to ${km} km";

  static String m37(count) => "${count} requests";

  static String m38(place) => "Near ${place}";

  static String m39(time) => "Valid for ${time}";

  static String m40(date) => "Available on ${date}";

  static String m41(km) => "${km} km";

  static String m42(days) => "Within ${days} days";

  static String m43(greeting, name) => "${greeting}, ${name}";

  static String m44(place, km) => "${place} ${km} km";

  static String m45(date) => "Needed ${date}";

  static String m46(km) => "${km} km";

  static String m47(count, km) =>
      "${count} neighbors within ${km} km could have what you need";

  static String m48(count) => "Reaches ${count} people in your area";

  static String m49(count) => "View all (${count})";

  static String m50(month) => "Availability — ${month}";

  static String m51(count) => "Book ${count} chairs";

  static String m52(min, insurance) =>
      "Request minimum ${min} · expected insurance ${insurance} EGP";

  static String m53(min) => "Quantity must be at least ${min}";

  static String m54(unit) => "Quantity (${unit})";

  static String m55(min, insurance) =>
      "Minimum ${min} · expected insurance ${insurance} EGP";

  static String m56(count) => "${count} chairs";

  static String m57(count) => "(${count} reviews)";

  static String m58(available, total) => "${available} of ${total}";

  static String m59(time) => "Commits to deliver before ${time}";

  static String m60(count) => "Compare ${count}";

  static String m61(count) => "${count} deals";

  static String m62(km) => "${km} km";

  static String m63(minutes) => "Last offer ${minutes}m ago";

  static String m64(count) => "${count} new offers";

  static String m65(qty, date, budget) =>
      "${qty} • ${date} • Budget ${budget} EGP";

  static String m66(minutes) => "${minutes} min";

  static String m67(count) => "${count} offers on your request";

  static String m68(date, qty) => "Needed ${date} · ${qty}";

  static String m69(count) => "${count} orders are waiting on you for pickup";

  static String m70(provider, qty) => "${provider} · ${qty}";

  static String m71(MB, files) =>
      "These files must be under ${MB} MB: ${files}";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "AddressValidation": MessageLookupByLibrary.simpleMessage(
      "Please enter the address",
    ),
    "access_denied": MessageLookupByLibrary.simpleMessage("Access denied"),
    "account_address_default": MessageLookupByLibrary.simpleMessage("Default"),
    "account_address_home": MessageLookupByLibrary.simpleMessage("Home"),
    "account_address_work": MessageLookupByLibrary.simpleMessage("Work"),
    "account_addresses": MessageLookupByLibrary.simpleMessage("My addresses"),
    "account_addresses_count": m0,
    "account_addresses_subtitle": MessageLookupByLibrary.simpleMessage(
      "Saved delivery and pickup places",
    ),
    "account_city": MessageLookupByLibrary.simpleMessage("City"),
    "account_contact_body": MessageLookupByLibrary.simpleMessage(
      "Email support@dabrha.com or chat in-app after an offer is accepted.",
    ),
    "account_contact_title": MessageLookupByLibrary.simpleMessage("Contact us"),
    "account_dark_mode": MessageLookupByLibrary.simpleMessage("Dark mode"),
    "account_edit_profile": MessageLookupByLibrary.simpleMessage(
      "Edit profile",
    ),
    "account_edit_profile_hint": MessageLookupByLibrary.simpleMessage(
      "Name, phone, and email",
    ),
    "account_edit_section_contact": MessageLookupByLibrary.simpleMessage(
      "Contact & location",
    ),
    "account_edit_section_personal": MessageLookupByLibrary.simpleMessage(
      "Personal details",
    ),
    "account_faq_1_a": MessageLookupByLibrary.simpleMessage(
      "Use Request, add description, quantity and date — it reaches matching owners in your radius.",
    ),
    "account_faq_1_q": MessageLookupByLibrary.simpleMessage(
      "How do I request something I can\'t find?",
    ),
    "account_faq_2_a": MessageLookupByLibrary.simpleMessage(
      "Rent is for the event period; buy if you want to keep the item. Filter in Explore.",
    ),
    "account_faq_2_q": MessageLookupByLibrary.simpleMessage(
      "What\'s the difference between rent and buy?",
    ),
    "account_faq_3_a": MessageLookupByLibrary.simpleMessage(
      "After confirmation you\'ll see a pickup code in order details — show it to the owner.",
    ),
    "account_faq_3_q": MessageLookupByLibrary.simpleMessage(
      "How do I pick up an order?",
    ),
    "account_faq_4_a": MessageLookupByLibrary.simpleMessage(
      "From Account → My listings you track what you published. Cycle: insurance, then deposit, then late fee if return is delayed.",
    ),
    "account_faq_4_q": MessageLookupByLibrary.simpleMessage(
      "How do I list something I own?",
    ),
    "account_first_name": MessageLookupByLibrary.simpleMessage("First name"),
    "account_help": MessageLookupByLibrary.simpleMessage("Help center"),
    "account_help_hint": MessageLookupByLibrary.simpleMessage(
      "FAQs and ways to contact us",
    ),
    "account_lang_ar": MessageLookupByLibrary.simpleMessage("العربية"),
    "account_lang_en": MessageLookupByLibrary.simpleMessage("English"),
    "account_language_updated": MessageLookupByLibrary.simpleMessage(
      "Language updated",
    ),
    "account_last_name": MessageLookupByLibrary.simpleMessage("Last name"),
    "account_listing_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "Insurance is editable; deposit and late fee are platform rates and locked",
    ),
    "account_listing_detail_title": MessageLookupByLibrary.simpleMessage(
      "Listing details",
    ),
    "account_listing_meta": m1,
    "account_listing_not_found": MessageLookupByLibrary.simpleMessage(
      "Listing not found",
    ),
    "account_listing_offers": m2,
    "account_listing_qty": m3,
    "account_listing_status_active": MessageLookupByLibrary.simpleMessage(
      "Listed",
    ),
    "account_listing_status_completed": MessageLookupByLibrary.simpleMessage(
      "Completed",
    ),
    "account_listing_status_deposit": MessageLookupByLibrary.simpleMessage(
      "Deposit",
    ),
    "account_listing_status_in_progress": MessageLookupByLibrary.simpleMessage(
      "In use",
    ),
    "account_listing_status_insurance": MessageLookupByLibrary.simpleMessage(
      "Insurance",
    ),
    "account_listing_status_late_fee": MessageLookupByLibrary.simpleMessage(
      "Late fee",
    ),
    "account_listing_status_offer_received":
        MessageLookupByLibrary.simpleMessage("Incoming offers"),
    "account_listing_status_paused": MessageLookupByLibrary.simpleMessage(
      "Paused",
    ),
    "account_listing_timeline_hint": MessageLookupByLibrary.simpleMessage(
      "From publish to complete — the core app cycle",
    ),
    "account_listing_timeline_title": MessageLookupByLibrary.simpleMessage(
      "Deal path",
    ),
    "account_listings_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "When you list something for rent or sale, it appears here with incoming requests and the full money cycle.",
    ),
    "account_listings_empty_title": MessageLookupByLibrary.simpleMessage(
      "No listings yet",
    ),
    "account_listings_tile": MessageLookupByLibrary.simpleMessage(
      "My listings",
    ),
    "account_listings_tile_hint": MessageLookupByLibrary.simpleMessage(
      "Items you listed for rent or sale",
    ),
    "account_logout_done": MessageLookupByLibrary.simpleMessage("Logged out"),
    "account_logout_subtitle": MessageLookupByLibrary.simpleMessage(
      "You\'ll need to sign in again to track orders and offers.",
    ),
    "account_logout_title": MessageLookupByLibrary.simpleMessage("Log out?"),
    "account_my_listings_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "Every listing follows: insurance → deposit → handover → late fee if delayed",
    ),
    "account_my_listings_subtitle": MessageLookupByLibrary.simpleMessage(
      "Items you listed for others to rent or buy",
    ),
    "account_my_listings_title": MessageLookupByLibrary.simpleMessage(
      "My listings",
    ),
    "account_my_orders_title": MessageLookupByLibrary.simpleMessage(
      "My orders",
    ),
    "account_my_requests_subtitle": MessageLookupByLibrary.simpleMessage(
      "Requests you sent to matching owners",
    ),
    "account_my_requests_title": MessageLookupByLibrary.simpleMessage(
      "Search requests",
    ),
    "account_my_reviews_subtitle": MessageLookupByLibrary.simpleMessage(
      "Reviews you wrote and reviews about you",
    ),
    "account_my_reviews_title": MessageLookupByLibrary.simpleMessage("Reviews"),
    "account_notif_offers": MessageLookupByLibrary.simpleMessage("New offers"),
    "account_notif_offers_hint": MessageLookupByLibrary.simpleMessage(
      "When an owner replies to your request",
    ),
    "account_notif_push": MessageLookupByLibrary.simpleMessage(
      "Push notifications",
    ),
    "account_notif_push_hint": MessageLookupByLibrary.simpleMessage(
      "Alerts for offers and order updates",
    ),
    "account_notif_sms": MessageLookupByLibrary.simpleMessage("SMS messages"),
    "account_notif_sms_hint": MessageLookupByLibrary.simpleMessage(
      "Important confirmations to your phone",
    ),
    "account_notifications": MessageLookupByLibrary.simpleMessage(
      "Notifications",
    ),
    "account_notifications_hint": MessageLookupByLibrary.simpleMessage(
      "Control offers and order alerts",
    ),
    "account_photo_change": MessageLookupByLibrary.simpleMessage(
      "Change photo",
    ),
    "account_photo_remove": MessageLookupByLibrary.simpleMessage(
      "Remove photo",
    ),
    "account_photo_title": MessageLookupByLibrary.simpleMessage(
      "Profile photo",
    ),
    "account_privacy": MessageLookupByLibrary.simpleMessage("Privacy policy"),
    "account_privacy_body": MessageLookupByLibrary.simpleMessage(
      "We respect your privacy and use your data only to run Dabrha and improve renting and buying.",
    ),
    "account_privacy_point_1": MessageLookupByLibrary.simpleMessage(
      "• Your location is used only to show nearby items.",
    ),
    "account_privacy_point_2": MessageLookupByLibrary.simpleMessage(
      "• Your phone is shared with owners after an offer is accepted.",
    ),
    "account_privacy_point_3": MessageLookupByLibrary.simpleMessage(
      "• You can request account deletion from support anytime.",
    ),
    "account_profile_saved": MessageLookupByLibrary.simpleMessage(
      "Changes saved",
    ),
    "account_radius_hint": MessageLookupByLibrary.simpleMessage(
      "Default radius for Explore and your requests",
    ),
    "account_radius_title": MessageLookupByLibrary.simpleMessage(
      "Search radius",
    ),
    "account_radius_updated": MessageLookupByLibrary.simpleMessage(
      "Search radius updated",
    ),
    "account_radius_value": m4,
    "account_request_meta": m5,
    "account_request_offers": m6,
    "account_request_status_cancelled": MessageLookupByLibrary.simpleMessage(
      "Cancelled",
    ),
    "account_request_status_closed": MessageLookupByLibrary.simpleMessage(
      "Closed",
    ),
    "account_request_status_open": MessageLookupByLibrary.simpleMessage("Open"),
    "account_requests_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "When you post a request, it shows up here with offers.",
    ),
    "account_requests_empty_title": MessageLookupByLibrary.simpleMessage(
      "No search requests",
    ),
    "account_reviews_empty": MessageLookupByLibrary.simpleMessage(
      "No reviews here yet",
    ),
    "account_reviews_given": MessageLookupByLibrary.simpleMessage("Given"),
    "account_reviews_received": MessageLookupByLibrary.simpleMessage(
      "Received",
    ),
    "account_section_about": MessageLookupByLibrary.simpleMessage("About"),
    "account_section_activity": MessageLookupByLibrary.simpleMessage(
      "Activity",
    ),
    "account_section_preferences": MessageLookupByLibrary.simpleMessage(
      "Preferences",
    ),
    "account_section_profile": MessageLookupByLibrary.simpleMessage("Account"),
    "account_section_support": MessageLookupByLibrary.simpleMessage("Support"),
    "account_stat_listings": MessageLookupByLibrary.simpleMessage(
      "My listings",
    ),
    "account_stat_orders": MessageLookupByLibrary.simpleMessage("Orders"),
    "account_stat_requests": MessageLookupByLibrary.simpleMessage("Requests"),
    "account_stat_reviews": MessageLookupByLibrary.simpleMessage("Reviews"),
    "account_terms": MessageLookupByLibrary.simpleMessage("Terms & conditions"),
    "account_theme": MessageLookupByLibrary.simpleMessage("Appearance"),
    "account_theme_dark": MessageLookupByLibrary.simpleMessage("Dark"),
    "account_theme_light": MessageLookupByLibrary.simpleMessage("Light"),
    "account_theme_system": MessageLookupByLibrary.simpleMessage("System"),
    "account_theme_updated": MessageLookupByLibrary.simpleMessage(
      "Appearance updated",
    ),
    "account_title": MessageLookupByLibrary.simpleMessage("Account"),
    "account_verified": MessageLookupByLibrary.simpleMessage("Verified"),
    "account_version": MessageLookupByLibrary.simpleMessage("App version"),
    "add_new_item": MessageLookupByLibrary.simpleMessage("Add new item"),
    "ai_badge": MessageLookupByLibrary.simpleMessage("AI"),
    "ai_best_offer_no_reason": m7,
    "ai_best_offer_reason": m8,
    "ai_best_offer_title": MessageLookupByLibrary.simpleMessage("Our pick"),
    "ai_best_offer_view": MessageLookupByLibrary.simpleMessage("View offer"),
    "ai_compose_applied_hint": MessageLookupByLibrary.simpleMessage(
      "Check the fields and change anything that\'s off.",
    ),
    "ai_compose_applied_title": MessageLookupByLibrary.simpleMessage(
      "We filled in your request",
    ),
    "ai_compose_button": MessageLookupByLibrary.simpleMessage("Tidy it up"),
    "ai_compose_empty": MessageLookupByLibrary.simpleMessage(
      "Type or say your request first",
    ),
    "ai_compose_loading": MessageLookupByLibrary.simpleMessage(
      "Organizing your request…",
    ),
    "ai_compose_low_confidence": MessageLookupByLibrary.simpleMessage(
      "We\'re not sure about every detail. Please check them carefully.",
    ),
    "ai_compose_nothing": MessageLookupByLibrary.simpleMessage(
      "We couldn\'t find enough details. Fill them in yourself.",
    ),
    "ai_compose_title_value": m9,
    "ai_compose_undo": MessageLookupByLibrary.simpleMessage("Undo"),
    "ai_home_example_1": MessageLookupByLibrary.simpleMessage(
      "20 chairs for a wedding on Thursday",
    ),
    "ai_home_example_2": MessageLookupByLibrary.simpleMessage(
      "A light laptop for work for a week",
    ),
    "ai_home_example_3": MessageLookupByLibrary.simpleMessage(
      "An evening dress, size M, tomorrow",
    ),
    "ai_home_or_try": MessageLookupByLibrary.simpleMessage("Or try"),
    "ai_home_subtitle": MessageLookupByLibrary.simpleMessage(
      "Tap the mic and talk. We\'ll fill in the request.",
    ),
    "ai_home_title": MessageLookupByLibrary.simpleMessage("Say what you need"),
    "ai_list_separator": MessageLookupByLibrary.simpleMessage(", "),
    "ai_price_apply": m10,
    "ai_price_based_on": m11,
    "ai_price_range": m12,
    "ai_price_suggest": m13,
    "ai_review_summary_based_on": m14,
    "ai_review_summary_title": MessageLookupByLibrary.simpleMessage(
      "What people say",
    ),
    "ai_safety_abuse": MessageLookupByLibrary.simpleMessage(
      "This message may come across as abusive. Edit it before sending?",
    ),
    "ai_safety_advance": MessageLookupByLibrary.simpleMessage(
      "Don\'t pay a deposit or in advance before you receive the item and confirm with the code.",
    ),
    "ai_safety_dismiss": MessageLookupByLibrary.simpleMessage("OK"),
    "ai_safety_edit": MessageLookupByLibrary.simpleMessage("Edit message"),
    "ai_safety_off_platform": MessageLookupByLibrary.simpleMessage(
      "Paying outside Dbrha cancels your insurance protection. Pay inside the app.",
    ),
    "ai_safety_peer_banner": MessageLookupByLibrary.simpleMessage(
      "The other person asked to pay outside the app. Pay inside Dbrha to keep your money protected.",
    ),
    "ai_safety_send_anyway": MessageLookupByLibrary.simpleMessage(
      "Send anyway",
    ),
    "ai_safety_title": MessageLookupByLibrary.simpleMessage("Be careful"),
    "ai_search_clear": MessageLookupByLibrary.simpleMessage("Clear"),
    "ai_search_example_1": MessageLookupByLibrary.simpleMessage(
      "Anyone need chairs for a wedding?",
    ),
    "ai_search_example_2": MessageLookupByLibrary.simpleMessage(
      "Electronics requests near me",
    ),
    "ai_search_example_3": MessageLookupByLibrary.simpleMessage(
      "Winter clothes",
    ),
    "ai_search_loading": MessageLookupByLibrary.simpleMessage(
      "Understanding your search…",
    ),
    "ai_search_try_title": MessageLookupByLibrary.simpleMessage(
      "Try smart search",
    ),
    "ai_search_understood": MessageLookupByLibrary.simpleMessage(
      "Showing results for",
    ),
    "ai_voice_button": MessageLookupByLibrary.simpleMessage("Speak"),
    "ai_voice_listening": MessageLookupByLibrary.simpleMessage(
      "Listening… speak naturally",
    ),
    "ai_voice_stop": MessageLookupByLibrary.simpleMessage("Stop"),
    "ai_voice_unavailable": MessageLookupByLibrary.simpleMessage(
      "The microphone isn\'t available. Allow microphone access in Settings.",
    ),
    "app_cancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "app_confirm": MessageLookupByLibrary.simpleMessage("Confirm"),
    "auth_browse_guest": MessageLookupByLibrary.simpleMessage(
      "Browse without an account",
    ),
    "auth_create_account": MessageLookupByLibrary.simpleMessage(
      "Create account",
    ),
    "auth_default_name": MessageLookupByLibrary.simpleMessage("User"),
    "auth_forget_cta": MessageLookupByLibrary.simpleMessage("Send code"),
    "auth_forget_subtitle": MessageLookupByLibrary.simpleMessage(
      "Enter your phone and we\'ll send a confirmation code",
    ),
    "auth_forget_title": MessageLookupByLibrary.simpleMessage(
      "Forgot password?",
    ),
    "auth_gate_subtitle": MessageLookupByLibrary.simpleMessage(
      "Requests, offers, and chat need an account",
    ),
    "auth_gate_title": MessageLookupByLibrary.simpleMessage(
      "Sign in to continue",
    ),
    "auth_guest_account_subtitle": MessageLookupByLibrary.simpleMessage(
      "Sign in to see your requests and deals",
    ),
    "auth_guest_account_title": MessageLookupByLibrary.simpleMessage(
      "Your account",
    ),
    "auth_guest_hint": MessageLookupByLibrary.simpleMessage(
      "You can browse requests — sign in to request or fulfill",
    ),
    "auth_guest_login_cta": MessageLookupByLibrary.simpleMessage("Sign in"),
    "auth_have_account": MessageLookupByLibrary.simpleMessage(
      "Already have an account?",
    ),
    "auth_hint_name": MessageLookupByLibrary.simpleMessage(
      "First and last name",
    ),
    "auth_hint_password": MessageLookupByLibrary.simpleMessage("••••••••"),
    "auth_hint_phone": MessageLookupByLibrary.simpleMessage("01xxxxxxxxx"),
    "auth_login_cta": MessageLookupByLibrary.simpleMessage("Sign in"),
    "auth_login_subtitle": MessageLookupByLibrary.simpleMessage(
      "Sign in to request and track deals with confidence",
    ),
    "auth_login_success": MessageLookupByLibrary.simpleMessage(
      "You\'re signed in",
    ),
    "auth_login_success_hint": MessageLookupByLibrary.simpleMessage(
      "Ready to continue your requests",
    ),
    "auth_login_title": MessageLookupByLibrary.simpleMessage("Welcome back"),
    "auth_no_account": MessageLookupByLibrary.simpleMessage(
      "Don\'t have an account?",
    ),
    "auth_or": MessageLookupByLibrary.simpleMessage("or"),
    "auth_otp_cta": MessageLookupByLibrary.simpleMessage("Confirm"),
    "auth_otp_hint": MessageLookupByLibrary.simpleMessage(
      "For testing: any 6 digits",
    ),
    "auth_otp_required": MessageLookupByLibrary.simpleMessage(
      "Enter the full confirmation code",
    ),
    "auth_otp_resend": MessageLookupByLibrary.simpleMessage("Resend code"),
    "auth_otp_resend_in": m15,
    "auth_otp_resent": MessageLookupByLibrary.simpleMessage(
      "We sent you a new code",
    ),
    "auth_otp_subtitle": m16,
    "auth_otp_title": MessageLookupByLibrary.simpleMessage("Confirmation code"),
    "auth_pw_rule_case": MessageLookupByLibrary.simpleMessage(
      "Upper and lower case (Aa)",
    ),
    "auth_pw_rule_length": MessageLookupByLibrary.simpleMessage(
      "8+ characters",
    ),
    "auth_pw_rule_number": MessageLookupByLibrary.simpleMessage("A number"),
    "auth_pw_rule_symbol": MessageLookupByLibrary.simpleMessage(
      "A symbol like ! @ #",
    ),
    "auth_register_cta": MessageLookupByLibrary.simpleMessage("Continue"),
    "auth_register_subtitle": MessageLookupByLibrary.simpleMessage(
      "One account to request and fulfill",
    ),
    "auth_register_success": MessageLookupByLibrary.simpleMessage(
      "Account ready",
    ),
    "auth_register_terms": MessageLookupByLibrary.simpleMessage(
      "By continuing you agree to the terms and privacy",
    ),
    "auth_register_title": MessageLookupByLibrary.simpleMessage(
      "Create account",
    ),
    "auth_reset_cta": MessageLookupByLibrary.simpleMessage("Save password"),
    "auth_reset_subtitle": MessageLookupByLibrary.simpleMessage(
      "Choose a strong password for your account",
    ),
    "auth_reset_success": MessageLookupByLibrary.simpleMessage(
      "Password updated",
    ),
    "auth_reset_success_hint": MessageLookupByLibrary.simpleMessage(
      "Sign in with your new password",
    ),
    "auth_reset_title": MessageLookupByLibrary.simpleMessage("New password"),
    "auth_step": m17,
    "auth_trust_code": MessageLookupByLibrary.simpleMessage("Code handover"),
    "auth_trust_line": MessageLookupByLibrary.simpleMessage(
      "Clearer deals · Trusted chat · Code handover",
    ),
    "auth_trust_payment": MessageLookupByLibrary.simpleMessage(
      "Protected payment",
    ),
    "auth_trust_reviews": MessageLookupByLibrary.simpleMessage("Real reviews"),
    "camera": MessageLookupByLibrary.simpleMessage("Camera"),
    "cancel": MessageLookupByLibrary.simpleMessage("Cancel"),
    "chat_action_confirm_time": MessageLookupByLibrary.simpleMessage(
      "Confirm time",
    ),
    "chat_action_pickup_code": MessageLookupByLibrary.simpleMessage(
      "Pickup code",
    ),
    "chat_action_send_location": MessageLookupByLibrary.simpleMessage(
      "Send location",
    ),
    "chat_attach_camera": MessageLookupByLibrary.simpleMessage("Camera"),
    "chat_attach_gallery": MessageLookupByLibrary.simpleMessage("Gallery"),
    "chat_attach_image": MessageLookupByLibrary.simpleMessage("Attach photo"),
    "chat_composer_hint": MessageLookupByLibrary.simpleMessage(
      "Write a message…",
    ),
    "chat_contact_phone": MessageLookupByLibrary.simpleMessage("Phone"),
    "chat_contact_whatsapp": MessageLookupByLibrary.simpleMessage("WhatsApp"),
    "chat_conversation_title": MessageLookupByLibrary.simpleMessage("Chat"),
    "chat_conversations_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "When you accept an offer or ask about an order, the chat opens here on that order.",
    ),
    "chat_conversations_empty_title": MessageLookupByLibrary.simpleMessage(
      "No chats yet",
    ),
    "chat_conversations_subtitle": MessageLookupByLibrary.simpleMessage(
      "Every chat is tied to an order — product first",
    ),
    "chat_conversations_tile_hint": MessageLookupByLibrary.simpleMessage(
      "Chats tied to your orders",
    ),
    "chat_conversations_title": MessageLookupByLibrary.simpleMessage(
      "My chats",
    ),
    "chat_copied": MessageLookupByLibrary.simpleMessage("Message copied"),
    "chat_copy": MessageLookupByLibrary.simpleMessage("Copy"),
    "chat_image_caption": MessageLookupByLibrary.simpleMessage("Photo"),
    "chat_last_seen": m18,
    "chat_online": MessageLookupByLibrary.simpleMessage("Online"),
    "chat_open_code_enter": MessageLookupByLibrary.simpleMessage(
      "Confirm receipt with code",
    ),
    "chat_open_code_share": MessageLookupByLibrary.simpleMessage(
      "Show pickup code",
    ),
    "chat_order_card_badge": MessageLookupByLibrary.simpleMessage("Order"),
    "chat_order_card_title": MessageLookupByLibrary.simpleMessage(
      "Order details",
    ),
    "chat_order_need_by": MessageLookupByLibrary.simpleMessage("Need by"),
    "chat_order_price": MessageLookupByLibrary.simpleMessage("Price"),
    "chat_order_provider": MessageLookupByLibrary.simpleMessage("Offer from"),
    "chat_order_qty": MessageLookupByLibrary.simpleMessage("Quantity"),
    "chat_order_status": MessageLookupByLibrary.simpleMessage("Status"),
    "chat_photo": MessageLookupByLibrary.simpleMessage("Photo"),
    "chat_quick_confirm_time_msg": MessageLookupByLibrary.simpleMessage(
      "Can we confirm the pickup time?",
    ),
    "chat_quick_location_msg": MessageLookupByLibrary.simpleMessage(
      "Sending you my location now",
    ),
    "chat_reply": MessageLookupByLibrary.simpleMessage("Reply"),
    "chat_replying_to": MessageLookupByLibrary.simpleMessage("Replying to"),
    "chat_role_my_listing": MessageLookupByLibrary.simpleMessage("My listing"),
    "chat_role_my_request": MessageLookupByLibrary.simpleMessage("My request"),
    "chat_status_accepted": MessageLookupByLibrary.simpleMessage(
      "Offer accepted",
    ),
    "chat_status_completed": MessageLookupByLibrary.simpleMessage("Completed"),
    "chat_status_delivery": MessageLookupByLibrary.simpleMessage("Delivery"),
    "chat_status_deposit": MessageLookupByLibrary.simpleMessage("Deposit paid"),
    "chat_status_in_use": MessageLookupByLibrary.simpleMessage("In use"),
    "chat_status_insurance": MessageLookupByLibrary.simpleMessage(
      "Insurance paid",
    ),
    "chat_today": MessageLookupByLibrary.simpleMessage("Today"),
    "chat_typing": MessageLookupByLibrary.simpleMessage("typing…"),
    "chat_unread": m19,
    "chat_user_completed_deals": MessageLookupByLibrary.simpleMessage(
      "Completed deals",
    ),
    "chat_user_contacts_hidden": MessageLookupByLibrary.simpleMessage(
      "This user hid their contacts for now",
    ),
    "chat_user_contacts_hint": MessageLookupByLibrary.simpleMessage(
      "Visibility follows the user\'s privacy settings",
    ),
    "chat_user_contacts_title": MessageLookupByLibrary.simpleMessage(
      "Contacts",
    ),
    "chat_user_listings_count": MessageLookupByLibrary.simpleMessage(
      "Listings",
    ),
    "chat_user_listings_title": MessageLookupByLibrary.simpleMessage(
      "Their listings",
    ),
    "chat_user_profile_title": MessageLookupByLibrary.simpleMessage(
      "User profile",
    ),
    "chat_yesterday": MessageLookupByLibrary.simpleMessage("Yesterday"),
    "confirmValidation": MessageLookupByLibrary.simpleMessage(
      "Passwords must match",
    ),
    "create_request_admin_locked": MessageLookupByLibrary.simpleMessage(
      "Admin",
    ),
    "create_request_admin_rates_hint": MessageLookupByLibrary.simpleMessage(
      "Deposit and late-fee rates are set by the platform and can\'t be edited",
    ),
    "create_request_budget": MessageLookupByLibrary.simpleMessage("Budget"),
    "create_request_budget_hint": MessageLookupByLibrary.simpleMessage(
      "Enter budget",
    ),
    "create_request_category": MessageLookupByLibrary.simpleMessage("Category"),
    "create_request_category_hint": MessageLookupByLibrary.simpleMessage(
      "Pick a category",
    ),
    "create_request_change_photo": MessageLookupByLibrary.simpleMessage(
      "Change photo",
    ),
    "create_request_close_note": m20,
    "create_request_contacts_hint": MessageLookupByLibrary.simpleMessage(
      "Choose what the other user can see once chat starts on this request",
    ),
    "create_request_contacts_title": MessageLookupByLibrary.simpleMessage(
      "Contact methods",
    ),
    "create_request_cycle_deposit": MessageLookupByLibrary.simpleMessage(
      "Deposit",
    ),
    "create_request_cycle_deposit_sub": m21,
    "create_request_cycle_hint": MessageLookupByLibrary.simpleMessage(
      "Insurance first, then deposit, then late fee if needed",
    ),
    "create_request_cycle_insurance": MessageLookupByLibrary.simpleMessage(
      "Insurance",
    ),
    "create_request_cycle_insurance_sub": m22,
    "create_request_cycle_late_fee": MessageLookupByLibrary.simpleMessage(
      "Late fee",
    ),
    "create_request_cycle_late_fee_sub": m23,
    "create_request_cycle_title": MessageLookupByLibrary.simpleMessage(
      "Money cycle",
    ),
    "create_request_date_hint": MessageLookupByLibrary.simpleMessage(
      "Pick a date",
    ),
    "create_request_deal_both": MessageLookupByLibrary.simpleMessage(
      "Rent & buy",
    ),
    "create_request_deal_type": MessageLookupByLibrary.simpleMessage(
      "Rent or buy",
    ),
    "create_request_delivery_either": MessageLookupByLibrary.simpleMessage(
      "Either works",
    ),
    "create_request_delivery_onsite": MessageLookupByLibrary.simpleMessage(
      "Deliver to my place",
    ),
    "create_request_delivery_pickup": MessageLookupByLibrary.simpleMessage(
      "I\'ll pick up",
    ),
    "create_request_delivery_title": MessageLookupByLibrary.simpleMessage(
      "Delivery",
    ),
    "create_request_deposit": MessageLookupByLibrary.simpleMessage("Deposit"),
    "create_request_description": MessageLookupByLibrary.simpleMessage(
      "Description",
    ),
    "create_request_description_hint": MessageLookupByLibrary.simpleMessage(
      "Describe what you need",
    ),
    "create_request_edit": MessageLookupByLibrary.simpleMessage("Edit"),
    "create_request_editable": MessageLookupByLibrary.simpleMessage("Editable"),
    "create_request_err_budget": MessageLookupByLibrary.simpleMessage(
      "Enter a budget in EGP",
    ),
    "create_request_err_category": MessageLookupByLibrary.simpleMessage(
      "Pick a category first",
    ),
    "create_request_err_date": MessageLookupByLibrary.simpleMessage(
      "Pick the date you need it",
    ),
    "create_request_err_description": MessageLookupByLibrary.simpleMessage(
      "Add a clear description",
    ),
    "create_request_err_description_short":
        MessageLookupByLibrary.simpleMessage(
          "Description is too short — add more detail",
        ),
    "create_request_err_location": MessageLookupByLibrary.simpleMessage(
      "Pick a delivery location on the map",
    ),
    "create_request_err_min_qty": MessageLookupByLibrary.simpleMessage(
      "Minimum qty can\'t exceed requested qty",
    ),
    "create_request_err_percent": MessageLookupByLibrary.simpleMessage(
      "Enter a percent from 0 to 100",
    ),
    "create_request_err_quantity": MessageLookupByLibrary.simpleMessage(
      "Enter a valid quantity (1+)",
    ),
    "create_request_err_terms": MessageLookupByLibrary.simpleMessage(
      "Accept the terms before publishing",
    ),
    "create_request_hashtag_hint": MessageLookupByLibrary.simpleMessage(
      "Type # to insert a category hashtag",
    ),
    "create_request_insurance_amount": m24,
    "create_request_insurance_buy": MessageLookupByLibrary.simpleMessage(
      "Buy insurance %",
    ),
    "create_request_insurance_payer_owner":
        MessageLookupByLibrary.simpleMessage("Owner"),
    "create_request_insurance_payer_requester":
        MessageLookupByLibrary.simpleMessage("Me (requester)"),
    "create_request_insurance_payer_title":
        MessageLookupByLibrary.simpleMessage("Who pays the insurance?"),
    "create_request_insurance_rent": MessageLookupByLibrary.simpleMessage(
      "Rent insurance %",
    ),
    "create_request_late_fee": MessageLookupByLibrary.simpleMessage(
      "Late fee %",
    ),
    "create_request_location": MessageLookupByLibrary.simpleMessage("Location"),
    "create_request_location_hint": MessageLookupByLibrary.simpleMessage(
      "Pick location",
    ),
    "create_request_location_value": m25,
    "create_request_min_qty": MessageLookupByLibrary.simpleMessage(
      "Minimum qty",
    ),
    "create_request_need_by": MessageLookupByLibrary.simpleMessage(
      "When do you need it?",
    ),
    "create_request_payment_cash": MessageLookupByLibrary.simpleMessage("Cash"),
    "create_request_payment_hint": MessageLookupByLibrary.simpleMessage(
      "Choose online payment or cash on delivery",
    ),
    "create_request_payment_online": MessageLookupByLibrary.simpleMessage(
      "Online",
    ),
    "create_request_payment_title": MessageLookupByLibrary.simpleMessage(
      "Payment method",
    ),
    "create_request_phone_label": MessageLookupByLibrary.simpleMessage(
      "Phone number",
    ),
    "create_request_photo_added": MessageLookupByLibrary.simpleMessage(
      "Photo added",
    ),
    "create_request_photo_chip_off": MessageLookupByLibrary.simpleMessage(
      "No photo",
    ),
    "create_request_photo_chip_on": MessageLookupByLibrary.simpleMessage(
      "Has photo",
    ),
    "create_request_photo_subtitle": MessageLookupByLibrary.simpleMessage(
      "Requests with a photo get 3x more offers",
    ),
    "create_request_photo_title": MessageLookupByLibrary.simpleMessage(
      "Photo of the item or something similar",
    ),
    "create_request_publish": MessageLookupByLibrary.simpleMessage(
      "Confirm & publish",
    ),
    "create_request_quantity": MessageLookupByLibrary.simpleMessage("Quantity"),
    "create_request_quantity_hint": MessageLookupByLibrary.simpleMessage(
      "Enter quantity",
    ),
    "create_request_radius_hint": MessageLookupByLibrary.simpleMessage(
      "Tap to select a radius, tap again to clear — a wider radius reaches more people",
    ),
    "create_request_radius_km": m26,
    "create_request_radius_title": MessageLookupByLibrary.simpleMessage(
      "Reach radius",
    ),
    "create_request_reach": m27,
    "create_request_remove_photo": MessageLookupByLibrary.simpleMessage(
      "Remove",
    ),
    "create_request_share_phone": MessageLookupByLibrary.simpleMessage(
      "Show phone number",
    ),
    "create_request_share_phone_hint": MessageLookupByLibrary.simpleMessage(
      "Visible on your profile and in chat when enabled",
    ),
    "create_request_share_whatsapp": MessageLookupByLibrary.simpleMessage(
      "Show WhatsApp",
    ),
    "create_request_share_whatsapp_hint": MessageLookupByLibrary.simpleMessage(
      "They can message you on WhatsApp directly",
    ),
    "create_request_step": m28,
    "create_request_step2_subtitle": MessageLookupByLibrary.simpleMessage(
      "Set reach and delivery before publishing",
    ),
    "create_request_step2_title": MessageLookupByLibrary.simpleMessage(
      "Who will see your request?",
    ),
    "create_request_submit": MessageLookupByLibrary.simpleMessage(
      "Review my request",
    ),
    "create_request_submitted": MessageLookupByLibrary.simpleMessage(
      "Your request is live — offers are on the way",
    ),
    "create_request_summary_line": m29,
    "create_request_summary_title": MessageLookupByLibrary.simpleMessage(
      "Request summary",
    ),
    "create_request_terms_accept": MessageLookupByLibrary.simpleMessage(
      "I agree to the request terms",
    ),
    "create_request_terms_link": MessageLookupByLibrary.simpleMessage(
      "Read terms & conditions",
    ),
    "create_request_terms_title": MessageLookupByLibrary.simpleMessage(
      "Request terms",
    ),
    "create_request_title": MessageLookupByLibrary.simpleMessage(
      "What exactly do you need?",
    ),
    "create_request_validation": MessageLookupByLibrary.simpleMessage(
      "Complete the request details first",
    ),
    "create_request_verified_hint": MessageLookupByLibrary.simpleMessage(
      "Fewer matches, higher trust",
    ),
    "create_request_verified_title": MessageLookupByLibrary.simpleMessage(
      "Verified owners only",
    ),
    "create_request_whatsapp_label": MessageLookupByLibrary.simpleMessage(
      "WhatsApp number",
    ),
    "create_request_whatsapp_same": MessageLookupByLibrary.simpleMessage(
      "Same as phone",
    ),
    "create_request_whatsapp_same_hint": MessageLookupByLibrary.simpleMessage(
      "Use the phone number for WhatsApp",
    ),
    "discover_air": MessageLookupByLibrary.simpleMessage("Air"),
    "discover_ask_daygi": MessageLookupByLibrary.simpleMessage("Ask DayGi"),
    "discover_doors_title": m30,
    "discover_early_note": m31,
    "discover_hero_cta": MessageLookupByLibrary.simpleMessage("Plan my trip"),
    "discover_live": m32,
    "discover_pick_cta": MessageLookupByLibrary.simpleMessage(
      "Plan around this",
    ),
    "discover_picks_title": m33,
    "discover_prompt_body": MessageLookupByLibrary.simpleMessage(
      "Tell us who\'s coming and what you love. We\'ll suggest plans and show why each one fits.",
    ),
    "discover_prompt_cta": MessageLookupByLibrary.simpleMessage(
      "Start planning",
    ),
    "discover_prompt_title": MessageLookupByLibrary.simpleMessage(
      "Not sure where to start?",
    ),
    "discover_source": m34,
    "discover_sunset": MessageLookupByLibrary.simpleMessage("Sunset"),
    "discover_switch_label": MessageLookupByLibrary.simpleMessage(
      "Choose a destination",
    ),
    "discover_water": MessageLookupByLibrary.simpleMessage("Water"),
    "discover_wind": MessageLookupByLibrary.simpleMessage("Wind"),
    "done": MessageLookupByLibrary.simpleMessage("Done"),
    "error_BadRequest_Error": MessageLookupByLibrary.simpleMessage(
      "Bad request",
    ),
    "error_NotFound_Error": MessageLookupByLibrary.simpleMessage(
      "No results found",
    ),
    "error_Timeout_Error": MessageLookupByLibrary.simpleMessage(
      "Request timed out",
    ),
    "error_Unauthorized_Error": MessageLookupByLibrary.simpleMessage(
      "Unauthorized",
    ),
    "error_cancel_token": MessageLookupByLibrary.simpleMessage(
      "Request cancelled",
    ),
    "error_confirm_password": MessageLookupByLibrary.simpleMessage(
      "Passwords do not match",
    ),
    "error_conflict": MessageLookupByLibrary.simpleMessage("Conflict error"),
    "error_connection": MessageLookupByLibrary.simpleMessage(
      "Network connection error",
    ),
    "error_connection_lost": MessageLookupByLibrary.simpleMessage(
      "Connection lost",
    ),
    "error_forbidden_error": MessageLookupByLibrary.simpleMessage(
      "You don\'t have permission",
    ),
    "error_general": MessageLookupByLibrary.simpleMessage("Unexpected error"),
    "error_internal_server": MessageLookupByLibrary.simpleMessage(
      "Internal server error",
    ),
    "error_socket": MessageLookupByLibrary.simpleMessage(
      "Check your internet connection",
    ),
    "explore_deal_all": MessageLookupByLibrary.simpleMessage("All"),
    "explore_empty_request": MessageLookupByLibrary.simpleMessage(
      "Request it and we\'ll find it",
    ),
    "explore_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "Widen the radius, or post a request and we\'ll find it.",
    ),
    "explore_empty_title": MessageLookupByLibrary.simpleMessage(
      "No results in this radius",
    ),
    "explore_empty_title_radius": m35,
    "explore_empty_widen": MessageLookupByLibrary.simpleMessage("Widen radius"),
    "explore_empty_widen_to": m36,
    "explore_results_count": m37,
    "explore_search_hint": MessageLookupByLibrary.simpleMessage(
      "Search chairs, backdrop, lighting…",
    ),
    "explore_sort_cheapest": MessageLookupByLibrary.simpleMessage("Cheapest"),
    "explore_sort_label": MessageLookupByLibrary.simpleMessage("Sort"),
    "explore_sort_nearest": MessageLookupByLibrary.simpleMessage("Nearest"),
    "explore_sort_rating": MessageLookupByLibrary.simpleMessage("Top rated"),
    "explore_sort_soonest": MessageLookupByLibrary.simpleMessage(
      "Needed soonest",
    ),
    "explore_subtitle": m38,
    "explore_title": MessageLookupByLibrary.simpleMessage("Explore"),
    "failureActions": MessageLookupByLibrary.simpleMessage("Failure actions"),
    "fillField": MessageLookupByLibrary.simpleMessage("Please fill this field"),
    "handover_countdown": m39,
    "handover_done": MessageLookupByLibrary.simpleMessage("Done showing"),
    "handover_open_ritual": MessageLookupByLibrary.simpleMessage(
      "Full-screen code",
    ),
    "handover_show_hint": MessageLookupByLibrary.simpleMessage(
      "Keep the screen clear for the other party",
    ),
    "handover_show_title": MessageLookupByLibrary.simpleMessage(
      "Show this code to the provider",
    ),
    "home_ask_placeholder": MessageLookupByLibrary.simpleMessage(
      "Type or say what you need. We\'ll sort out the details.",
    ),
    "home_available_on": m40,
    "home_buy": MessageLookupByLibrary.simpleMessage("Buy"),
    "home_card_offer": MessageLookupByLibrary.simpleMessage("Make an offer"),
    "home_categories_title": MessageLookupByLibrary.simpleMessage("Categories"),
    "home_distance_km": m41,
    "home_due_in_days": m42,
    "home_due_today": MessageLookupByLibrary.simpleMessage("Needed today"),
    "home_due_tomorrow": MessageLookupByLibrary.simpleMessage(
      "Needed tomorrow",
    ),
    "home_featured_label": MessageLookupByLibrary.simpleMessage(
      "Needed soonest",
    ),
    "home_greeting_evening": MessageLookupByLibrary.simpleMessage(
      "Good evening",
    ),
    "home_greeting_morning": MessageLookupByLibrary.simpleMessage(
      "Good morning",
    ),
    "home_greeting_named": m43,
    "home_headline": MessageLookupByLibrary.simpleMessage("What do you need?"),
    "home_headline_fulfiller": MessageLookupByLibrary.simpleMessage(
      "Nearby requests you can fulfill",
    ),
    "home_headline_fulfiller_sub": MessageLookupByLibrary.simpleMessage(
      "Browse needs and send your offer",
    ),
    "home_headline_sub": MessageLookupByLibrary.simpleMessage(
      "Browse nearby requests or post what you need",
    ),
    "home_location_km": m44,
    "home_nav_account": MessageLookupByLibrary.simpleMessage("Account"),
    "home_nav_daygi": MessageLookupByLibrary.simpleMessage("DayGi"),
    "home_nav_discover": MessageLookupByLibrary.simpleMessage("Discover"),
    "home_nav_explore": MessageLookupByLibrary.simpleMessage("Explore"),
    "home_nav_home": MessageLookupByLibrary.simpleMessage("Home"),
    "home_nav_orders": MessageLookupByLibrary.simpleMessage("Orders"),
    "home_nav_plan": MessageLookupByLibrary.simpleMessage("Plan"),
    "home_nav_request": MessageLookupByLibrary.simpleMessage("Request"),
    "home_nav_today": MessageLookupByLibrary.simpleMessage("Today"),
    "home_nav_trip": MessageLookupByLibrary.simpleMessage("Trip"),
    "home_nearest": MessageLookupByLibrary.simpleMessage("Nearest"),
    "home_need_by_chip": m45,
    "home_notifications": MessageLookupByLibrary.simpleMessage("Notifications"),
    "home_price_unit_day": MessageLookupByLibrary.simpleMessage("/day"),
    "home_radius_label": m46,
    "home_reach_line": m47,
    "home_rent": MessageLookupByLibrary.simpleMessage("Rent"),
    "home_request_subtitle": m48,
    "home_request_title": MessageLookupByLibrary.simpleMessage(
      "Request it and we\'ll find it",
    ),
    "home_requests_section": MessageLookupByLibrary.simpleMessage(
      "Nearby requests",
    ),
    "home_search_hint": MessageLookupByLibrary.simpleMessage(
      "Clothes, electronics, groceries…",
    ),
    "home_side_empty": MessageLookupByLibrary.simpleMessage(
      "No requests in this category right now",
    ),
    "home_view_all": m49,
    "internet_connected": MessageLookupByLibrary.simpleMessage(
      "Internet connected",
    ),
    "label_Login": MessageLookupByLibrary.simpleMessage("Log in"),
    "label_app_language": MessageLookupByLibrary.simpleMessage("Language"),
    "label_change_language": MessageLookupByLibrary.simpleMessage(
      "Change language",
    ),
    "label_choose_language": MessageLookupByLibrary.simpleMessage(
      "Choose language",
    ),
    "label_confirm_password": MessageLookupByLibrary.simpleMessage(
      "Confirm password",
    ),
    "label_email": MessageLookupByLibrary.simpleMessage("Email"),
    "label_forget_pass": MessageLookupByLibrary.simpleMessage(
      "Forgot password?",
    ),
    "label_full_name": MessageLookupByLibrary.simpleMessage("Full name"),
    "label_logout": MessageLookupByLibrary.simpleMessage("Log out"),
    "label_password": MessageLookupByLibrary.simpleMessage("Password"),
    "label_phone": MessageLookupByLibrary.simpleMessage("Phone number"),
    "label_register": MessageLookupByLibrary.simpleMessage("Create account"),
    "lifecycle_chosen": MessageLookupByLibrary.simpleMessage("Chosen"),
    "lifecycle_done": MessageLookupByLibrary.simpleMessage("Done"),
    "lifecycle_handover": MessageLookupByLibrary.simpleMessage("Handover"),
    "lifecycle_offers": MessageLookupByLibrary.simpleMessage("Offers"),
    "lifecycle_published": MessageLookupByLibrary.simpleMessage("Posted"),
    "listing_availability": m50,
    "listing_book": m51,
    "listing_buy": MessageLookupByLibrary.simpleMessage("Buy"),
    "listing_fulfill_cta": MessageLookupByLibrary.simpleMessage(
      "Offer on this request",
    ),
    "listing_fulfill_sheet_hint": m52,
    "listing_fulfill_sheet_title": MessageLookupByLibrary.simpleMessage(
      "Submit your offer to this requester",
    ),
    "listing_fulfill_submit": MessageLookupByLibrary.simpleMessage(
      "Send offer to requester",
    ),
    "listing_listed_total": MessageLookupByLibrary.simpleMessage(
      "Listed total",
    ),
    "listing_min_qty_label": MessageLookupByLibrary.simpleMessage(
      "Minimum quantity",
    ),
    "listing_offer_cta": MessageLookupByLibrary.simpleMessage("Submit offer"),
    "listing_offer_details_hint": MessageLookupByLibrary.simpleMessage(
      "Same insurance, deposit, and late-fee terms set by the owner",
    ),
    "listing_offer_details_title": MessageLookupByLibrary.simpleMessage(
      "Listing terms",
    ),
    "listing_offer_err_price": MessageLookupByLibrary.simpleMessage(
      "Enter an offer price",
    ),
    "listing_offer_err_qty": m53,
    "listing_offer_price_label": MessageLookupByLibrary.simpleMessage(
      "Your offer price",
    ),
    "listing_offer_qty_label": m54,
    "listing_offer_sent": MessageLookupByLibrary.simpleMessage(
      "Offer sent — conversation opened",
    ),
    "listing_offer_sheet_hint": m55,
    "listing_offer_sheet_title": MessageLookupByLibrary.simpleMessage(
      "Submit your offer on this listing",
    ),
    "listing_offer_submit": MessageLookupByLibrary.simpleMessage("Send offer"),
    "listing_owner_label": MessageLookupByLibrary.simpleMessage("Owner"),
    "listing_qty": m56,
    "listing_rent": MessageLookupByLibrary.simpleMessage("Rent"),
    "listing_request_details_hint": MessageLookupByLibrary.simpleMessage(
      "Someone is looking for this — insurance, deposit, and terms are shown here",
    ),
    "listing_request_details_title": MessageLookupByLibrary.simpleMessage(
      "Request details",
    ),
    "listing_reviews": m57,
    "listing_stock": m58,
    "listing_total_one_day": MessageLookupByLibrary.simpleMessage(
      "Total for one day",
    ),
    "loadingText": MessageLookupByLibrary.simpleMessage("Loading…"),
    "mailValidation": MessageLookupByLibrary.simpleMessage(
      "Enter a valid email",
    ),
    "market_mode_fulfiller": MessageLookupByLibrary.simpleMessage("I fulfill"),
    "market_mode_requester": MessageLookupByLibrary.simpleMessage("I need"),
    "market_side_all": MessageLookupByLibrary.simpleMessage("All"),
    "market_side_offer": MessageLookupByLibrary.simpleMessage(
      "Listed for sale / rent",
    ),
    "market_side_offer_hint": MessageLookupByLibrary.simpleMessage(
      "An owner listed this — you can submit a buy or rent offer",
    ),
    "market_side_offer_short": MessageLookupByLibrary.simpleMessage("Listed"),
    "market_side_request": MessageLookupByLibrary.simpleMessage(
      "Wanted — people are looking",
    ),
    "market_side_request_hint": MessageLookupByLibrary.simpleMessage(
      "A requester needs this — if you have it, submit your offer",
    ),
    "market_side_request_short": MessageLookupByLibrary.simpleMessage("Wanted"),
    "market_side_requester_prefix": MessageLookupByLibrary.simpleMessage(
      "Requester:",
    ),
    "nameValidation": MessageLookupByLibrary.simpleMessage(
      "Must be 8–30 characters",
    ),
    "noResults": MessageLookupByLibrary.simpleMessage("No results"),
    "no_internet_connection": MessageLookupByLibrary.simpleMessage(
      "No internet connection",
    ),
    "offer_details_budget": MessageLookupByLibrary.simpleMessage("Budget"),
    "offer_details_confirm": MessageLookupByLibrary.simpleMessage(
      "Confirm selection",
    ),
    "offer_details_confirmed": MessageLookupByLibrary.simpleMessage(
      "Offer selected",
    ),
    "offer_details_confirmed_hint": MessageLookupByLibrary.simpleMessage(
      "Continue from chat and your order",
    ),
    "offer_details_message": MessageLookupByLibrary.simpleMessage("Message"),
    "offer_details_need_by": MessageLookupByLibrary.simpleMessage("Need by"),
    "offer_details_pick_one": MessageLookupByLibrary.simpleMessage(
      "Pick one offer",
    ),
    "offer_details_product": MessageLookupByLibrary.simpleMessage(
      "Product details",
    ),
    "offer_details_quantity": MessageLookupByLibrary.simpleMessage("Quantity"),
    "offer_details_selected": MessageLookupByLibrary.simpleMessage(
      "Selected offer",
    ),
    "offer_details_switch_others": MessageLookupByLibrary.simpleMessage(
      "Show other offers",
    ),
    "offer_details_title": MessageLookupByLibrary.simpleMessage(
      "Offer details",
    ),
    "offers_accept": MessageLookupByLibrary.simpleMessage("Accept offer"),
    "offers_ask": MessageLookupByLibrary.simpleMessage("Ask"),
    "offers_back": MessageLookupByLibrary.simpleMessage("My requests"),
    "offers_best": MessageLookupByLibrary.simpleMessage("Best"),
    "offers_commit_before": m59,
    "offers_compare": m60,
    "offers_compare_subtitle": MessageLookupByLibrary.simpleMessage(
      "Price · distance · rating · response",
    ),
    "offers_compare_title": MessageLookupByLibrary.simpleMessage(
      "Compare offers",
    ),
    "offers_currency": MessageLookupByLibrary.simpleMessage("EGP"),
    "offers_deals_count": m61,
    "offers_delivery_free": MessageLookupByLibrary.simpleMessage("Free"),
    "offers_delivery_on_renter": MessageLookupByLibrary.simpleMessage(
      "On renter",
    ),
    "offers_delivery_pickup": MessageLookupByLibrary.simpleMessage("Pickup"),
    "offers_distance_km": m62,
    "offers_field_deals": MessageLookupByLibrary.simpleMessage("Deals"),
    "offers_field_delivery": MessageLookupByLibrary.simpleMessage("Delivery"),
    "offers_field_insurance": MessageLookupByLibrary.simpleMessage("Insurance"),
    "offers_field_response": MessageLookupByLibrary.simpleMessage("Response"),
    "offers_late_risk": MessageLookupByLibrary.simpleMessage("Tight timing"),
    "offers_new": MessageLookupByLibrary.simpleMessage("New"),
    "offers_nudge_last": m63,
    "offers_nudge_new": m64,
    "offers_request_summary": m65,
    "offers_response_minutes": m66,
    "offers_title": m67,
    "offers_verified": MessageLookupByLibrary.simpleMessage("Verified"),
    "offers_why_cheapest": MessageLookupByLibrary.simpleMessage("Lowest price"),
    "offers_why_fastest": MessageLookupByLibrary.simpleMessage("Fastest"),
    "offers_why_nearest": MessageLookupByLibrary.simpleMessage("Nearest"),
    "offers_why_top_rated": MessageLookupByLibrary.simpleMessage("Top rated"),
    "order_detail_actions_hint": MessageLookupByLibrary.simpleMessage(
      "Update the order status for this deal stage",
    ),
    "order_detail_actions_title": MessageLookupByLibrary.simpleMessage(
      "Move order",
    ),
    "order_detail_cash_note": MessageLookupByLibrary.simpleMessage(
      "Pay cash on pickup",
    ),
    "order_detail_code_copied": MessageLookupByLibrary.simpleMessage(
      "Code copied",
    ),
    "order_detail_code_copy": MessageLookupByLibrary.simpleMessage("Copy code"),
    "order_detail_code_hint": MessageLookupByLibrary.simpleMessage(
      "Show this to the other party at pickup so they can confirm handover",
    ),
    "order_detail_code_required": MessageLookupByLibrary.simpleMessage(
      "Enter the pickup code",
    ),
    "order_detail_code_title": MessageLookupByLibrary.simpleMessage(
      "Pickup code",
    ),
    "order_detail_code_used_hint": MessageLookupByLibrary.simpleMessage(
      "This code was already verified and the item was received",
    ),
    "order_detail_code_verified": MessageLookupByLibrary.simpleMessage(
      "Receipt confirmed successfully",
    ),
    "order_detail_code_verified_badge": MessageLookupByLibrary.simpleMessage(
      "Receipt confirmed",
    ),
    "order_detail_enter_code_hint": MessageLookupByLibrary.simpleMessage(
      "Ask the other party for their code and enter it here to confirm handover",
    ),
    "order_detail_enter_code_label": MessageLookupByLibrary.simpleMessage(
      "Pickup code",
    ),
    "order_detail_enter_code_submit": MessageLookupByLibrary.simpleMessage(
      "Confirm receipt",
    ),
    "order_detail_enter_code_title": MessageLookupByLibrary.simpleMessage(
      "Confirm receipt with code",
    ),
    "order_detail_event": m68,
    "order_detail_status_updated": MessageLookupByLibrary.simpleMessage(
      "Order status updated",
    ),
    "order_detail_timeline": MessageLookupByLibrary.simpleMessage(
      "Order timeline",
    ),
    "order_detail_title": MessageLookupByLibrary.simpleMessage("Order details"),
    "orders_action_needed": m69,
    "orders_awaiting_peer": MessageLookupByLibrary.simpleMessage(
      "Awaiting offers",
    ),
    "orders_empty_fulfiller_subtitle": MessageLookupByLibrary.simpleMessage(
      "When you start fulfilling a request, it shows here",
    ),
    "orders_empty_fulfiller_title": MessageLookupByLibrary.simpleMessage(
      "No active fulfillments",
    ),
    "orders_empty_subtitle": MessageLookupByLibrary.simpleMessage(
      "When you send a request or accept an offer, it shows up here.",
    ),
    "orders_empty_title": MessageLookupByLibrary.simpleMessage("No orders yet"),
    "orders_filter_active": MessageLookupByLibrary.simpleMessage("Active"),
    "orders_filter_all": MessageLookupByLibrary.simpleMessage("All"),
    "orders_filter_cancelled": MessageLookupByLibrary.simpleMessage(
      "Cancelled",
    ),
    "orders_filter_done": MessageLookupByLibrary.simpleMessage("Done"),
    "orders_meta": m70,
    "orders_next_details": MessageLookupByLibrary.simpleMessage("Details"),
    "orders_next_enter_code": MessageLookupByLibrary.simpleMessage(
      "Enter pickup code",
    ),
    "orders_next_offers": MessageLookupByLibrary.simpleMessage("See offers"),
    "orders_next_pickup": MessageLookupByLibrary.simpleMessage(
      "Pickup details",
    ),
    "orders_next_show_code": MessageLookupByLibrary.simpleMessage(
      "Show pickup code",
    ),
    "orders_next_track": MessageLookupByLibrary.simpleMessage("Track order"),
    "orders_role_fulfill": MessageLookupByLibrary.simpleMessage("My offer"),
    "orders_status_accepted": MessageLookupByLibrary.simpleMessage(
      "Offer accepted",
    ),
    "orders_status_awaiting": MessageLookupByLibrary.simpleMessage(
      "Awaiting offers",
    ),
    "orders_status_cancelled": MessageLookupByLibrary.simpleMessage(
      "Cancelled",
    ),
    "orders_status_completed": MessageLookupByLibrary.simpleMessage(
      "Completed",
    ),
    "orders_status_confirmed": MessageLookupByLibrary.simpleMessage(
      "Ready for pickup",
    ),
    "orders_status_delivery": MessageLookupByLibrary.simpleMessage("Pickup"),
    "orders_status_in_use": MessageLookupByLibrary.simpleMessage("Handed over"),
    "orders_subtitle": MessageLookupByLibrary.simpleMessage(
      "Your requests and active fulfillments — no prices",
    ),
    "orders_tab_account": MessageLookupByLibrary.simpleMessage(
      "Account coming soon",
    ),
    "orders_tab_explore": MessageLookupByLibrary.simpleMessage(
      "Explore coming soon",
    ),
    "orders_title": MessageLookupByLibrary.simpleMessage("My orders"),
    "passValidation": MessageLookupByLibrary.simpleMessage(
      "Enter at least 6 characters",
    ),
    "phoneValidation": MessageLookupByLibrary.simpleMessage(
      "Enter a valid phone number",
    ),
    "pick": MessageLookupByLibrary.simpleMessage("Gallery"),
    "pick_location_confirm": MessageLookupByLibrary.simpleMessage(
      "Confirm location",
    ),
    "pick_location_current": MessageLookupByLibrary.simpleMessage(
      "My current location",
    ),
    "pick_location_failed": MessageLookupByLibrary.simpleMessage(
      "Couldn\'t fetch the address",
    ),
    "pick_location_loading": MessageLookupByLibrary.simpleMessage(
      "Getting address…",
    ),
    "pick_location_title": MessageLookupByLibrary.simpleMessage(
      "Pick location",
    ),
    "retry": MessageLookupByLibrary.simpleMessage("Retry"),
    "save": MessageLookupByLibrary.simpleMessage("Save"),
    "size_more_than_mg_error": m71,
    "something_went_wrong": MessageLookupByLibrary.simpleMessage(
      "Something went wrong",
    ),
    "splash_brand": MessageLookupByLibrary.simpleMessage("دبّرها"),
    "splash_subtitle": MessageLookupByLibrary.simpleMessage(
      "Your request reaches owners in your area",
    ),
    "splash_tagline": MessageLookupByLibrary.simpleMessage(
      "Ask for what you need. People nearby have it.",
    ),
    "splash_trust": MessageLookupByLibrary.simpleMessage(
      "Code handover and protected payment in the app",
    ),
    "tryAgain": MessageLookupByLibrary.simpleMessage("Try again"),
  };
}
