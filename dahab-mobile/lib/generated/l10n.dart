// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(
      _current != null,
      'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.',
    );
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(
      instance != null,
      'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?',
    );
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `Try again`
  String get tryAgain {
    return Intl.message('Try again', name: 'tryAgain', desc: '', args: []);
  }

  /// `Internal server error`
  String get error_internal_server {
    return Intl.message(
      'Internal server error',
      name: 'error_internal_server',
      desc: '',
      args: [],
    );
  }

  /// `Bad request`
  String get error_BadRequest_Error {
    return Intl.message(
      'Bad request',
      name: 'error_BadRequest_Error',
      desc: '',
      args: [],
    );
  }

  /// `No results found`
  String get error_NotFound_Error {
    return Intl.message(
      'No results found',
      name: 'error_NotFound_Error',
      desc: '',
      args: [],
    );
  }

  /// `Request timed out`
  String get error_Timeout_Error {
    return Intl.message(
      'Request timed out',
      name: 'error_Timeout_Error',
      desc: '',
      args: [],
    );
  }

  /// `Unexpected error`
  String get error_general {
    return Intl.message(
      'Unexpected error',
      name: 'error_general',
      desc: '',
      args: [],
    );
  }

  /// `Unauthorized`
  String get error_Unauthorized_Error {
    return Intl.message(
      'Unauthorized',
      name: 'error_Unauthorized_Error',
      desc: '',
      args: [],
    );
  }

  /// `You don't have permission`
  String get error_forbidden_error {
    return Intl.message(
      'You don\'t have permission',
      name: 'error_forbidden_error',
      desc: '',
      args: [],
    );
  }

  /// `Network connection error`
  String get error_connection {
    return Intl.message(
      'Network connection error',
      name: 'error_connection',
      desc: '',
      args: [],
    );
  }

  /// `Connection lost`
  String get error_connection_lost {
    return Intl.message(
      'Connection lost',
      name: 'error_connection_lost',
      desc: '',
      args: [],
    );
  }

  /// `Request cancelled`
  String get error_cancel_token {
    return Intl.message(
      'Request cancelled',
      name: 'error_cancel_token',
      desc: '',
      args: [],
    );
  }

  /// `Passwords do not match`
  String get error_confirm_password {
    return Intl.message(
      'Passwords do not match',
      name: 'error_confirm_password',
      desc: '',
      args: [],
    );
  }

  /// `Please fill this field`
  String get fillField {
    return Intl.message(
      'Please fill this field',
      name: 'fillField',
      desc: '',
      args: [],
    );
  }

  /// `Enter at least 6 characters`
  String get passValidation {
    return Intl.message(
      'Enter at least 6 characters',
      name: 'passValidation',
      desc: '',
      args: [],
    );
  }

  /// `Enter a valid email`
  String get mailValidation {
    return Intl.message(
      'Enter a valid email',
      name: 'mailValidation',
      desc: '',
      args: [],
    );
  }

  /// `Enter a valid phone number`
  String get phoneValidation {
    return Intl.message(
      'Enter a valid phone number',
      name: 'phoneValidation',
      desc: '',
      args: [],
    );
  }

  /// `Passwords must match`
  String get confirmValidation {
    return Intl.message(
      'Passwords must match',
      name: 'confirmValidation',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the address`
  String get AddressValidation {
    return Intl.message(
      'Please enter the address',
      name: 'AddressValidation',
      desc: '',
      args: [],
    );
  }

  /// `Must be 8–30 characters`
  String get nameValidation {
    return Intl.message(
      'Must be 8–30 characters',
      name: 'nameValidation',
      desc: '',
      args: [],
    );
  }

  /// `Check your internet connection`
  String get error_socket {
    return Intl.message(
      'Check your internet connection',
      name: 'error_socket',
      desc: '',
      args: [],
    );
  }

  /// `Conflict error`
  String get error_conflict {
    return Intl.message(
      'Conflict error',
      name: 'error_conflict',
      desc: '',
      args: [],
    );
  }

  /// `Cancel`
  String get app_cancel {
    return Intl.message('Cancel', name: 'app_cancel', desc: '', args: []);
  }

  /// `Confirm`
  String get app_confirm {
    return Intl.message('Confirm', name: 'app_confirm', desc: '', args: []);
  }

  /// `Log out`
  String get label_logout {
    return Intl.message('Log out', name: 'label_logout', desc: '', args: []);
  }

  /// `Change language`
  String get label_change_language {
    return Intl.message(
      'Change language',
      name: 'label_change_language',
      desc: '',
      args: [],
    );
  }

  /// `Choose language`
  String get label_choose_language {
    return Intl.message(
      'Choose language',
      name: 'label_choose_language',
      desc: '',
      args: [],
    );
  }

  /// `Language`
  String get label_app_language {
    return Intl.message(
      'Language',
      name: 'label_app_language',
      desc: '',
      args: [],
    );
  }

  /// `Log in`
  String get label_Login {
    return Intl.message('Log in', name: 'label_Login', desc: '', args: []);
  }

  /// `Create account`
  String get label_register {
    return Intl.message(
      'Create account',
      name: 'label_register',
      desc: '',
      args: [],
    );
  }

  /// `Forgot password?`
  String get label_forget_pass {
    return Intl.message(
      'Forgot password?',
      name: 'label_forget_pass',
      desc: '',
      args: [],
    );
  }

  /// `Phone number`
  String get label_phone {
    return Intl.message(
      'Phone number',
      name: 'label_phone',
      desc: '',
      args: [],
    );
  }

  /// `Email`
  String get label_email {
    return Intl.message('Email', name: 'label_email', desc: '', args: []);
  }

  /// `Password`
  String get label_password {
    return Intl.message('Password', name: 'label_password', desc: '', args: []);
  }

  /// `Full name`
  String get label_full_name {
    return Intl.message(
      'Full name',
      name: 'label_full_name',
      desc: '',
      args: [],
    );
  }

  /// `Confirm password`
  String get label_confirm_password {
    return Intl.message(
      'Confirm password',
      name: 'label_confirm_password',
      desc: '',
      args: [],
    );
  }

  /// `Something went wrong`
  String get something_went_wrong {
    return Intl.message(
      'Something went wrong',
      name: 'something_went_wrong',
      desc: '',
      args: [],
    );
  }

  /// `Loading…`
  String get loadingText {
    return Intl.message('Loading…', name: 'loadingText', desc: '', args: []);
  }

  /// `Done`
  String get done {
    return Intl.message('Done', name: 'done', desc: '', args: []);
  }

  /// `Add new item`
  String get add_new_item {
    return Intl.message(
      'Add new item',
      name: 'add_new_item',
      desc: '',
      args: [],
    );
  }

  /// `Cancel`
  String get cancel {
    return Intl.message('Cancel', name: 'cancel', desc: '', args: []);
  }

  /// `Save`
  String get save {
    return Intl.message('Save', name: 'save', desc: '', args: []);
  }

  /// `Failure actions`
  String get failureActions {
    return Intl.message(
      'Failure actions',
      name: 'failureActions',
      desc: '',
      args: [],
    );
  }

  /// `Access denied`
  String get access_denied {
    return Intl.message(
      'Access denied',
      name: 'access_denied',
      desc: '',
      args: [],
    );
  }

  /// `Camera`
  String get camera {
    return Intl.message('Camera', name: 'camera', desc: '', args: []);
  }

  /// `Gallery`
  String get pick {
    return Intl.message('Gallery', name: 'pick', desc: '', args: []);
  }

  /// `Retry`
  String get retry {
    return Intl.message('Retry', name: 'retry', desc: '', args: []);
  }

  /// `These files must be under {MB} MB: {files}`
  String size_more_than_mg_error(Object MB, Object files) {
    return Intl.message(
      'These files must be under $MB MB: $files',
      name: 'size_more_than_mg_error',
      desc: '',
      args: [MB, files],
    );
  }

  /// `No internet connection`
  String get no_internet_connection {
    return Intl.message(
      'No internet connection',
      name: 'no_internet_connection',
      desc: '',
      args: [],
    );
  }

  /// `Internet connected`
  String get internet_connected {
    return Intl.message(
      'Internet connected',
      name: 'internet_connected',
      desc: '',
      args: [],
    );
  }

  /// `No results`
  String get noResults {
    return Intl.message('No results', name: 'noResults', desc: '', args: []);
  }

  /// `What do you need?`
  String get home_headline {
    return Intl.message(
      'What do you need?',
      name: 'home_headline',
      desc: '',
      args: [],
    );
  }

  /// `Browse nearby requests or post what you need`
  String get home_headline_sub {
    return Intl.message(
      'Browse nearby requests or post what you need',
      name: 'home_headline_sub',
      desc: '',
      args: [],
    );
  }

  /// `Type or say what you need. We'll sort out the details.`
  String get home_ask_placeholder {
    return Intl.message(
      'Type or say what you need. We\'ll sort out the details.',
      name: 'home_ask_placeholder',
      desc: '',
      args: [],
    );
  }

  /// `Good morning`
  String get home_greeting_morning {
    return Intl.message(
      'Good morning',
      name: 'home_greeting_morning',
      desc: '',
      args: [],
    );
  }

  /// `Good evening`
  String get home_greeting_evening {
    return Intl.message(
      'Good evening',
      name: 'home_greeting_evening',
      desc: '',
      args: [],
    );
  }

  /// `{greeting}, {name}`
  String home_greeting_named(Object greeting, Object name) {
    return Intl.message(
      '$greeting, $name',
      name: 'home_greeting_named',
      desc: '',
      args: [greeting, name],
    );
  }

  /// `{count} neighbors within {km} km could have what you need`
  String home_reach_line(Object count, Object km) {
    return Intl.message(
      '$count neighbors within $km km could have what you need',
      name: 'home_reach_line',
      desc: '',
      args: [count, km],
    );
  }

  /// `{km} km`
  String home_radius_label(Object km) {
    return Intl.message(
      '$km km',
      name: 'home_radius_label',
      desc: '',
      args: [km],
    );
  }

  /// `Notifications`
  String get home_notifications {
    return Intl.message(
      'Notifications',
      name: 'home_notifications',
      desc: '',
      args: [],
    );
  }

  /// `Needed soonest`
  String get home_featured_label {
    return Intl.message(
      'Needed soonest',
      name: 'home_featured_label',
      desc: '',
      args: [],
    );
  }

  /// `Needed today`
  String get home_due_today {
    return Intl.message(
      'Needed today',
      name: 'home_due_today',
      desc: '',
      args: [],
    );
  }

  /// `Needed tomorrow`
  String get home_due_tomorrow {
    return Intl.message(
      'Needed tomorrow',
      name: 'home_due_tomorrow',
      desc: '',
      args: [],
    );
  }

  /// `Within {days} days`
  String home_due_in_days(Object days) {
    return Intl.message(
      'Within $days days',
      name: 'home_due_in_days',
      desc: '',
      args: [days],
    );
  }

  /// `{km} km`
  String home_distance_km(Object km) {
    return Intl.message(
      '$km km',
      name: 'home_distance_km',
      desc: '',
      args: [km],
    );
  }

  /// `Make an offer`
  String get home_card_offer {
    return Intl.message(
      'Make an offer',
      name: 'home_card_offer',
      desc: '',
      args: [],
    );
  }

  /// `Clothes, electronics, groceries…`
  String get home_search_hint {
    return Intl.message(
      'Clothes, electronics, groceries…',
      name: 'home_search_hint',
      desc: '',
      args: [],
    );
  }

  /// `Categories`
  String get home_categories_title {
    return Intl.message(
      'Categories',
      name: 'home_categories_title',
      desc: '',
      args: [],
    );
  }

  /// `Rent`
  String get home_rent {
    return Intl.message('Rent', name: 'home_rent', desc: '', args: []);
  }

  /// `Buy`
  String get home_buy {
    return Intl.message('Buy', name: 'home_buy', desc: '', args: []);
  }

  /// `Nearest`
  String get home_nearest {
    return Intl.message('Nearest', name: 'home_nearest', desc: '', args: []);
  }

  /// `Request it and we'll find it`
  String get home_request_title {
    return Intl.message(
      'Request it and we\'ll find it',
      name: 'home_request_title',
      desc: '',
      args: [],
    );
  }

  /// `Reaches {count} people in your area`
  String home_request_subtitle(Object count) {
    return Intl.message(
      'Reaches $count people in your area',
      name: 'home_request_subtitle',
      desc: '',
      args: [count],
    );
  }

  /// `Available on {date}`
  String home_available_on(Object date) {
    return Intl.message(
      'Available on $date',
      name: 'home_available_on',
      desc: '',
      args: [date],
    );
  }

  /// `Nearby requests`
  String get home_requests_section {
    return Intl.message(
      'Nearby requests',
      name: 'home_requests_section',
      desc: '',
      args: [],
    );
  }

  /// `Needed {date}`
  String home_need_by_chip(Object date) {
    return Intl.message(
      'Needed $date',
      name: 'home_need_by_chip',
      desc: '',
      args: [date],
    );
  }

  /// `View all ({count})`
  String home_view_all(Object count) {
    return Intl.message(
      'View all ($count)',
      name: 'home_view_all',
      desc: '',
      args: [count],
    );
  }

  /// `No requests in this category right now`
  String get home_side_empty {
    return Intl.message(
      'No requests in this category right now',
      name: 'home_side_empty',
      desc: '',
      args: [],
    );
  }

  /// `Home`
  String get home_nav_home {
    return Intl.message('Home', name: 'home_nav_home', desc: '', args: []);
  }

  /// `Explore`
  String get home_nav_explore {
    return Intl.message(
      'Explore',
      name: 'home_nav_explore',
      desc: '',
      args: [],
    );
  }

  /// `Orders`
  String get home_nav_orders {
    return Intl.message('Orders', name: 'home_nav_orders', desc: '', args: []);
  }

  /// `Account`
  String get home_nav_account {
    return Intl.message(
      'Account',
      name: 'home_nav_account',
      desc: '',
      args: [],
    );
  }

  /// `Request`
  String get home_nav_request {
    return Intl.message(
      'Request',
      name: 'home_nav_request',
      desc: '',
      args: [],
    );
  }

  /// `/day`
  String get home_price_unit_day {
    return Intl.message(
      '/day',
      name: 'home_price_unit_day',
      desc: '',
      args: [],
    );
  }

  /// `{place} {km} km`
  String home_location_km(Object place, Object km) {
    return Intl.message(
      '$place $km km',
      name: 'home_location_km',
      desc: '',
      args: [place, km],
    );
  }

  /// `دبّرها`
  String get splash_brand {
    return Intl.message('دبّرها', name: 'splash_brand', desc: '', args: []);
  }

  /// `Ask for what you need. People nearby have it.`
  String get splash_tagline {
    return Intl.message(
      'Ask for what you need. People nearby have it.',
      name: 'splash_tagline',
      desc: '',
      args: [],
    );
  }

  /// `Your request reaches owners in your area`
  String get splash_subtitle {
    return Intl.message(
      'Your request reaches owners in your area',
      name: 'splash_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Code handover and protected payment in the app`
  String get splash_trust {
    return Intl.message(
      'Code handover and protected payment in the app',
      name: 'splash_trust',
      desc: '',
      args: [],
    );
  }

  /// `Rent`
  String get listing_rent {
    return Intl.message('Rent', name: 'listing_rent', desc: '', args: []);
  }

  /// `Buy`
  String get listing_buy {
    return Intl.message('Buy', name: 'listing_buy', desc: '', args: []);
  }

  /// `Availability — {month}`
  String listing_availability(Object month) {
    return Intl.message(
      'Availability — $month',
      name: 'listing_availability',
      desc: '',
      args: [month],
    );
  }

  /// `{available} of {total}`
  String listing_stock(Object available, Object total) {
    return Intl.message(
      '$available of $total',
      name: 'listing_stock',
      desc: '',
      args: [available, total],
    );
  }

  /// `({count} reviews)`
  String listing_reviews(Object count) {
    return Intl.message(
      '($count reviews)',
      name: 'listing_reviews',
      desc: '',
      args: [count],
    );
  }

  /// `{count} chairs`
  String listing_qty(Object count) {
    return Intl.message(
      '$count chairs',
      name: 'listing_qty',
      desc: '',
      args: [count],
    );
  }

  /// `Total for one day`
  String get listing_total_one_day {
    return Intl.message(
      'Total for one day',
      name: 'listing_total_one_day',
      desc: '',
      args: [],
    );
  }

  /// `Listed total`
  String get listing_listed_total {
    return Intl.message(
      'Listed total',
      name: 'listing_listed_total',
      desc: '',
      args: [],
    );
  }

  /// `Book {count} chairs`
  String listing_book(Object count) {
    return Intl.message(
      'Book $count chairs',
      name: 'listing_book',
      desc: '',
      args: [count],
    );
  }

  /// `Submit offer`
  String get listing_offer_cta {
    return Intl.message(
      'Submit offer',
      name: 'listing_offer_cta',
      desc: '',
      args: [],
    );
  }

  /// `Offer on this request`
  String get listing_fulfill_cta {
    return Intl.message(
      'Offer on this request',
      name: 'listing_fulfill_cta',
      desc: '',
      args: [],
    );
  }

  /// `Submit your offer on this listing`
  String get listing_offer_sheet_title {
    return Intl.message(
      'Submit your offer on this listing',
      name: 'listing_offer_sheet_title',
      desc: '',
      args: [],
    );
  }

  /// `Submit your offer to this requester`
  String get listing_fulfill_sheet_title {
    return Intl.message(
      'Submit your offer to this requester',
      name: 'listing_fulfill_sheet_title',
      desc: '',
      args: [],
    );
  }

  /// `Minimum {min} · expected insurance {insurance} EGP`
  String listing_offer_sheet_hint(Object min, Object insurance) {
    return Intl.message(
      'Minimum $min · expected insurance $insurance EGP',
      name: 'listing_offer_sheet_hint',
      desc: '',
      args: [min, insurance],
    );
  }

  /// `Request minimum {min} · expected insurance {insurance} EGP`
  String listing_fulfill_sheet_hint(Object min, Object insurance) {
    return Intl.message(
      'Request minimum $min · expected insurance $insurance EGP',
      name: 'listing_fulfill_sheet_hint',
      desc: '',
      args: [min, insurance],
    );
  }

  /// `Your offer price`
  String get listing_offer_price_label {
    return Intl.message(
      'Your offer price',
      name: 'listing_offer_price_label',
      desc: '',
      args: [],
    );
  }

  /// `Quantity ({unit})`
  String listing_offer_qty_label(Object unit) {
    return Intl.message(
      'Quantity ($unit)',
      name: 'listing_offer_qty_label',
      desc: '',
      args: [unit],
    );
  }

  /// `Send offer`
  String get listing_offer_submit {
    return Intl.message(
      'Send offer',
      name: 'listing_offer_submit',
      desc: '',
      args: [],
    );
  }

  /// `Send offer to requester`
  String get listing_fulfill_submit {
    return Intl.message(
      'Send offer to requester',
      name: 'listing_fulfill_submit',
      desc: '',
      args: [],
    );
  }

  /// `Offer sent — conversation opened`
  String get listing_offer_sent {
    return Intl.message(
      'Offer sent — conversation opened',
      name: 'listing_offer_sent',
      desc: '',
      args: [],
    );
  }

  /// `Enter an offer price`
  String get listing_offer_err_price {
    return Intl.message(
      'Enter an offer price',
      name: 'listing_offer_err_price',
      desc: '',
      args: [],
    );
  }

  /// `Quantity must be at least {min}`
  String listing_offer_err_qty(Object min) {
    return Intl.message(
      'Quantity must be at least $min',
      name: 'listing_offer_err_qty',
      desc: '',
      args: [min],
    );
  }

  /// `Listing terms`
  String get listing_offer_details_title {
    return Intl.message(
      'Listing terms',
      name: 'listing_offer_details_title',
      desc: '',
      args: [],
    );
  }

  /// `Same insurance, deposit, and late-fee terms set by the owner`
  String get listing_offer_details_hint {
    return Intl.message(
      'Same insurance, deposit, and late-fee terms set by the owner',
      name: 'listing_offer_details_hint',
      desc: '',
      args: [],
    );
  }

  /// `Request details`
  String get listing_request_details_title {
    return Intl.message(
      'Request details',
      name: 'listing_request_details_title',
      desc: '',
      args: [],
    );
  }

  /// `Someone is looking for this — insurance, deposit, and terms are shown here`
  String get listing_request_details_hint {
    return Intl.message(
      'Someone is looking for this — insurance, deposit, and terms are shown here',
      name: 'listing_request_details_hint',
      desc: '',
      args: [],
    );
  }

  /// `Owner`
  String get listing_owner_label {
    return Intl.message(
      'Owner',
      name: 'listing_owner_label',
      desc: '',
      args: [],
    );
  }

  /// `Minimum quantity`
  String get listing_min_qty_label {
    return Intl.message(
      'Minimum quantity',
      name: 'listing_min_qty_label',
      desc: '',
      args: [],
    );
  }

  /// `Listed for sale / rent`
  String get market_side_offer {
    return Intl.message(
      'Listed for sale / rent',
      name: 'market_side_offer',
      desc: '',
      args: [],
    );
  }

  /// `Listed`
  String get market_side_offer_short {
    return Intl.message(
      'Listed',
      name: 'market_side_offer_short',
      desc: '',
      args: [],
    );
  }

  /// `An owner listed this — you can submit a buy or rent offer`
  String get market_side_offer_hint {
    return Intl.message(
      'An owner listed this — you can submit a buy or rent offer',
      name: 'market_side_offer_hint',
      desc: '',
      args: [],
    );
  }

  /// `Wanted — people are looking`
  String get market_side_request {
    return Intl.message(
      'Wanted — people are looking',
      name: 'market_side_request',
      desc: '',
      args: [],
    );
  }

  /// `Wanted`
  String get market_side_request_short {
    return Intl.message(
      'Wanted',
      name: 'market_side_request_short',
      desc: '',
      args: [],
    );
  }

  /// `A requester needs this — if you have it, submit your offer`
  String get market_side_request_hint {
    return Intl.message(
      'A requester needs this — if you have it, submit your offer',
      name: 'market_side_request_hint',
      desc: '',
      args: [],
    );
  }

  /// `Requester:`
  String get market_side_requester_prefix {
    return Intl.message(
      'Requester:',
      name: 'market_side_requester_prefix',
      desc: '',
      args: [],
    );
  }

  /// `All`
  String get market_side_all {
    return Intl.message('All', name: 'market_side_all', desc: '', args: []);
  }

  /// `{current} of {total}`
  String create_request_step(Object current, Object total) {
    return Intl.message(
      '$current of $total',
      name: 'create_request_step',
      desc: '',
      args: [current, total],
    );
  }

  /// `What exactly do you need?`
  String get create_request_title {
    return Intl.message(
      'What exactly do you need?',
      name: 'create_request_title',
      desc: '',
      args: [],
    );
  }

  /// `Photo of the item or something similar`
  String get create_request_photo_title {
    return Intl.message(
      'Photo of the item or something similar',
      name: 'create_request_photo_title',
      desc: '',
      args: [],
    );
  }

  /// `Requests with a photo get 3x more offers`
  String get create_request_photo_subtitle {
    return Intl.message(
      'Requests with a photo get 3x more offers',
      name: 'create_request_photo_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Photo added`
  String get create_request_photo_added {
    return Intl.message(
      'Photo added',
      name: 'create_request_photo_added',
      desc: '',
      args: [],
    );
  }

  /// `Description`
  String get create_request_description {
    return Intl.message(
      'Description',
      name: 'create_request_description',
      desc: '',
      args: [],
    );
  }

  /// `Describe what you need`
  String get create_request_description_hint {
    return Intl.message(
      'Describe what you need',
      name: 'create_request_description_hint',
      desc: '',
      args: [],
    );
  }

  /// `Quantity`
  String get create_request_quantity {
    return Intl.message(
      'Quantity',
      name: 'create_request_quantity',
      desc: '',
      args: [],
    );
  }

  /// `Enter quantity`
  String get create_request_quantity_hint {
    return Intl.message(
      'Enter quantity',
      name: 'create_request_quantity_hint',
      desc: '',
      args: [],
    );
  }

  /// `Rent or buy`
  String get create_request_deal_type {
    return Intl.message(
      'Rent or buy',
      name: 'create_request_deal_type',
      desc: '',
      args: [],
    );
  }

  /// `When do you need it?`
  String get create_request_need_by {
    return Intl.message(
      'When do you need it?',
      name: 'create_request_need_by',
      desc: '',
      args: [],
    );
  }

  /// `Pick a date`
  String get create_request_date_hint {
    return Intl.message(
      'Pick a date',
      name: 'create_request_date_hint',
      desc: '',
      args: [],
    );
  }

  /// `Budget`
  String get create_request_budget {
    return Intl.message(
      'Budget',
      name: 'create_request_budget',
      desc: '',
      args: [],
    );
  }

  /// `Enter budget`
  String get create_request_budget_hint {
    return Intl.message(
      'Enter budget',
      name: 'create_request_budget_hint',
      desc: '',
      args: [],
    );
  }

  /// `Location`
  String get create_request_location {
    return Intl.message(
      'Location',
      name: 'create_request_location',
      desc: '',
      args: [],
    );
  }

  /// `Pick location`
  String get create_request_location_hint {
    return Intl.message(
      'Pick location',
      name: 'create_request_location_hint',
      desc: '',
      args: [],
    );
  }

  /// `{place} - {km} km`
  String create_request_location_value(Object place, Object km) {
    return Intl.message(
      '$place - $km km',
      name: 'create_request_location_value',
      desc: '',
      args: [place, km],
    );
  }

  /// `Your request will reach {count} matching owners, and will close automatically on {date}.`
  String create_request_reach(Object count, Object date) {
    return Intl.message(
      'Your request will reach $count matching owners, and will close automatically on $date.',
      name: 'create_request_reach',
      desc: '',
      args: [count, date],
    );
  }

  /// `Review my request`
  String get create_request_submit {
    return Intl.message(
      'Review my request',
      name: 'create_request_submit',
      desc: '',
      args: [],
    );
  }

  /// `Complete the request details first`
  String get create_request_validation {
    return Intl.message(
      'Complete the request details first',
      name: 'create_request_validation',
      desc: '',
      args: [],
    );
  }

  /// `Your request is live — offers are on the way`
  String get create_request_submitted {
    return Intl.message(
      'Your request is live — offers are on the way',
      name: 'create_request_submitted',
      desc: '',
      args: [],
    );
  }

  /// `Who will see your request?`
  String get create_request_step2_title {
    return Intl.message(
      'Who will see your request?',
      name: 'create_request_step2_title',
      desc: '',
      args: [],
    );
  }

  /// `Set reach and delivery before publishing`
  String get create_request_step2_subtitle {
    return Intl.message(
      'Set reach and delivery before publishing',
      name: 'create_request_step2_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Request summary`
  String get create_request_summary_title {
    return Intl.message(
      'Request summary',
      name: 'create_request_summary_title',
      desc: '',
      args: [],
    );
  }

  /// `{qty} • {date}`
  String create_request_summary_line(Object qty, Object date) {
    return Intl.message(
      '$qty • $date',
      name: 'create_request_summary_line',
      desc: '',
      args: [qty, date],
    );
  }

  /// `Edit`
  String get create_request_edit {
    return Intl.message(
      'Edit',
      name: 'create_request_edit',
      desc: '',
      args: [],
    );
  }

  /// `Reach radius`
  String get create_request_radius_title {
    return Intl.message(
      'Reach radius',
      name: 'create_request_radius_title',
      desc: '',
      args: [],
    );
  }

  /// `Tap to select a radius, tap again to clear — a wider radius reaches more people`
  String get create_request_radius_hint {
    return Intl.message(
      'Tap to select a radius, tap again to clear — a wider radius reaches more people',
      name: 'create_request_radius_hint',
      desc: '',
      args: [],
    );
  }

  /// `{km} km`
  String create_request_radius_km(Object km) {
    return Intl.message(
      '$km km',
      name: 'create_request_radius_km',
      desc: '',
      args: [km],
    );
  }

  /// `Delivery`
  String get create_request_delivery_title {
    return Intl.message(
      'Delivery',
      name: 'create_request_delivery_title',
      desc: '',
      args: [],
    );
  }

  /// `Deliver to my place`
  String get create_request_delivery_onsite {
    return Intl.message(
      'Deliver to my place',
      name: 'create_request_delivery_onsite',
      desc: '',
      args: [],
    );
  }

  /// `I'll pick up`
  String get create_request_delivery_pickup {
    return Intl.message(
      'I\'ll pick up',
      name: 'create_request_delivery_pickup',
      desc: '',
      args: [],
    );
  }

  /// `Either works`
  String get create_request_delivery_either {
    return Intl.message(
      'Either works',
      name: 'create_request_delivery_either',
      desc: '',
      args: [],
    );
  }

  /// `Verified owners only`
  String get create_request_verified_title {
    return Intl.message(
      'Verified owners only',
      name: 'create_request_verified_title',
      desc: '',
      args: [],
    );
  }

  /// `Fewer matches, higher trust`
  String get create_request_verified_hint {
    return Intl.message(
      'Fewer matches, higher trust',
      name: 'create_request_verified_hint',
      desc: '',
      args: [],
    );
  }

  /// `Request closes automatically on {date} if nothing is accepted.`
  String create_request_close_note(Object date) {
    return Intl.message(
      'Request closes automatically on $date if nothing is accepted.',
      name: 'create_request_close_note',
      desc: '',
      args: [date],
    );
  }

  /// `Has photo`
  String get create_request_photo_chip_on {
    return Intl.message(
      'Has photo',
      name: 'create_request_photo_chip_on',
      desc: '',
      args: [],
    );
  }

  /// `No photo`
  String get create_request_photo_chip_off {
    return Intl.message(
      'No photo',
      name: 'create_request_photo_chip_off',
      desc: '',
      args: [],
    );
  }

  /// `Confirm & publish`
  String get create_request_publish {
    return Intl.message(
      'Confirm & publish',
      name: 'create_request_publish',
      desc: '',
      args: [],
    );
  }

  /// `Add a clear description`
  String get create_request_err_description {
    return Intl.message(
      'Add a clear description',
      name: 'create_request_err_description',
      desc: '',
      args: [],
    );
  }

  /// `Description is too short — add more detail`
  String get create_request_err_description_short {
    return Intl.message(
      'Description is too short — add more detail',
      name: 'create_request_err_description_short',
      desc: '',
      args: [],
    );
  }

  /// `Enter a valid quantity (1+)`
  String get create_request_err_quantity {
    return Intl.message(
      'Enter a valid quantity (1+)',
      name: 'create_request_err_quantity',
      desc: '',
      args: [],
    );
  }

  /// `Enter a budget in EGP`
  String get create_request_err_budget {
    return Intl.message(
      'Enter a budget in EGP',
      name: 'create_request_err_budget',
      desc: '',
      args: [],
    );
  }

  /// `Pick the date you need it`
  String get create_request_err_date {
    return Intl.message(
      'Pick the date you need it',
      name: 'create_request_err_date',
      desc: '',
      args: [],
    );
  }

  /// `Pick a delivery location on the map`
  String get create_request_err_location {
    return Intl.message(
      'Pick a delivery location on the map',
      name: 'create_request_err_location',
      desc: '',
      args: [],
    );
  }

  /// `Change photo`
  String get create_request_change_photo {
    return Intl.message(
      'Change photo',
      name: 'create_request_change_photo',
      desc: '',
      args: [],
    );
  }

  /// `Remove`
  String get create_request_remove_photo {
    return Intl.message(
      'Remove',
      name: 'create_request_remove_photo',
      desc: '',
      args: [],
    );
  }

  /// `Category`
  String get create_request_category {
    return Intl.message(
      'Category',
      name: 'create_request_category',
      desc: '',
      args: [],
    );
  }

  /// `Pick a category`
  String get create_request_category_hint {
    return Intl.message(
      'Pick a category',
      name: 'create_request_category_hint',
      desc: '',
      args: [],
    );
  }

  /// `Rent & buy`
  String get create_request_deal_both {
    return Intl.message(
      'Rent & buy',
      name: 'create_request_deal_both',
      desc: '',
      args: [],
    );
  }

  /// `Rent insurance %`
  String get create_request_insurance_rent {
    return Intl.message(
      'Rent insurance %',
      name: 'create_request_insurance_rent',
      desc: '',
      args: [],
    );
  }

  /// `Buy insurance %`
  String get create_request_insurance_buy {
    return Intl.message(
      'Buy insurance %',
      name: 'create_request_insurance_buy',
      desc: '',
      args: [],
    );
  }

  /// `Equals {amount}`
  String create_request_insurance_amount(Object amount) {
    return Intl.message(
      'Equals $amount',
      name: 'create_request_insurance_amount',
      desc: '',
      args: [amount],
    );
  }

  /// `Late fee %`
  String get create_request_late_fee {
    return Intl.message(
      'Late fee %',
      name: 'create_request_late_fee',
      desc: '',
      args: [],
    );
  }

  /// `Minimum qty`
  String get create_request_min_qty {
    return Intl.message(
      'Minimum qty',
      name: 'create_request_min_qty',
      desc: '',
      args: [],
    );
  }

  /// `Type # to insert a category hashtag`
  String get create_request_hashtag_hint {
    return Intl.message(
      'Type # to insert a category hashtag',
      name: 'create_request_hashtag_hint',
      desc: '',
      args: [],
    );
  }

  /// `Request terms`
  String get create_request_terms_title {
    return Intl.message(
      'Request terms',
      name: 'create_request_terms_title',
      desc: '',
      args: [],
    );
  }

  /// `Pick a category first`
  String get create_request_err_category {
    return Intl.message(
      'Pick a category first',
      name: 'create_request_err_category',
      desc: '',
      args: [],
    );
  }

  /// `Minimum qty can't exceed requested qty`
  String get create_request_err_min_qty {
    return Intl.message(
      'Minimum qty can\'t exceed requested qty',
      name: 'create_request_err_min_qty',
      desc: '',
      args: [],
    );
  }

  /// `Enter a percent from 0 to 100`
  String get create_request_err_percent {
    return Intl.message(
      'Enter a percent from 0 to 100',
      name: 'create_request_err_percent',
      desc: '',
      args: [],
    );
  }

  /// `Payment method`
  String get create_request_payment_title {
    return Intl.message(
      'Payment method',
      name: 'create_request_payment_title',
      desc: '',
      args: [],
    );
  }

  /// `Choose online payment or cash on delivery`
  String get create_request_payment_hint {
    return Intl.message(
      'Choose online payment or cash on delivery',
      name: 'create_request_payment_hint',
      desc: '',
      args: [],
    );
  }

  /// `Online`
  String get create_request_payment_online {
    return Intl.message(
      'Online',
      name: 'create_request_payment_online',
      desc: '',
      args: [],
    );
  }

  /// `Cash`
  String get create_request_payment_cash {
    return Intl.message(
      'Cash',
      name: 'create_request_payment_cash',
      desc: '',
      args: [],
    );
  }

  /// `Money cycle`
  String get create_request_cycle_title {
    return Intl.message(
      'Money cycle',
      name: 'create_request_cycle_title',
      desc: '',
      args: [],
    );
  }

  /// `Insurance first, then deposit, then late fee if needed`
  String get create_request_cycle_hint {
    return Intl.message(
      'Insurance first, then deposit, then late fee if needed',
      name: 'create_request_cycle_hint',
      desc: '',
      args: [],
    );
  }

  /// `Who pays the insurance?`
  String get create_request_insurance_payer_title {
    return Intl.message(
      'Who pays the insurance?',
      name: 'create_request_insurance_payer_title',
      desc: '',
      args: [],
    );
  }

  /// `Me (requester)`
  String get create_request_insurance_payer_requester {
    return Intl.message(
      'Me (requester)',
      name: 'create_request_insurance_payer_requester',
      desc: '',
      args: [],
    );
  }

  /// `Owner`
  String get create_request_insurance_payer_owner {
    return Intl.message(
      'Owner',
      name: 'create_request_insurance_payer_owner',
      desc: '',
      args: [],
    );
  }

  /// `Insurance`
  String get create_request_cycle_insurance {
    return Intl.message(
      'Insurance',
      name: 'create_request_cycle_insurance',
      desc: '',
      args: [],
    );
  }

  /// `Paid by {payer} · {amount}`
  String create_request_cycle_insurance_sub(Object payer, Object amount) {
    return Intl.message(
      'Paid by $payer · $amount',
      name: 'create_request_cycle_insurance_sub',
      desc: '',
      args: [payer, amount],
    );
  }

  /// `Deposit`
  String get create_request_cycle_deposit {
    return Intl.message(
      'Deposit',
      name: 'create_request_cycle_deposit',
      desc: '',
      args: [],
    );
  }

  /// `Platform rate {percent} · {amount}`
  String create_request_cycle_deposit_sub(Object percent, Object amount) {
    return Intl.message(
      'Platform rate $percent · $amount',
      name: 'create_request_cycle_deposit_sub',
      desc: '',
      args: [percent, amount],
    );
  }

  /// `Late fee`
  String get create_request_cycle_late_fee {
    return Intl.message(
      'Late fee',
      name: 'create_request_cycle_late_fee',
      desc: '',
      args: [],
    );
  }

  /// `Platform rate {percent} · {amount}`
  String create_request_cycle_late_fee_sub(Object percent, Object amount) {
    return Intl.message(
      'Platform rate $percent · $amount',
      name: 'create_request_cycle_late_fee_sub',
      desc: '',
      args: [percent, amount],
    );
  }

  /// `Deposit`
  String get create_request_deposit {
    return Intl.message(
      'Deposit',
      name: 'create_request_deposit',
      desc: '',
      args: [],
    );
  }

  /// `Admin`
  String get create_request_admin_locked {
    return Intl.message(
      'Admin',
      name: 'create_request_admin_locked',
      desc: '',
      args: [],
    );
  }

  /// `Editable`
  String get create_request_editable {
    return Intl.message(
      'Editable',
      name: 'create_request_editable',
      desc: '',
      args: [],
    );
  }

  /// `Deposit and late-fee rates are set by the platform and can't be edited`
  String get create_request_admin_rates_hint {
    return Intl.message(
      'Deposit and late-fee rates are set by the platform and can\'t be edited',
      name: 'create_request_admin_rates_hint',
      desc: '',
      args: [],
    );
  }

  /// `I agree to the request terms`
  String get create_request_terms_accept {
    return Intl.message(
      'I agree to the request terms',
      name: 'create_request_terms_accept',
      desc: '',
      args: [],
    );
  }

  /// `Read terms & conditions`
  String get create_request_terms_link {
    return Intl.message(
      'Read terms & conditions',
      name: 'create_request_terms_link',
      desc: '',
      args: [],
    );
  }

  /// `Accept the terms before publishing`
  String get create_request_err_terms {
    return Intl.message(
      'Accept the terms before publishing',
      name: 'create_request_err_terms',
      desc: '',
      args: [],
    );
  }

  /// `Pick location`
  String get pick_location_title {
    return Intl.message(
      'Pick location',
      name: 'pick_location_title',
      desc: '',
      args: [],
    );
  }

  /// `Confirm location`
  String get pick_location_confirm {
    return Intl.message(
      'Confirm location',
      name: 'pick_location_confirm',
      desc: '',
      args: [],
    );
  }

  /// `My current location`
  String get pick_location_current {
    return Intl.message(
      'My current location',
      name: 'pick_location_current',
      desc: '',
      args: [],
    );
  }

  /// `Getting address…`
  String get pick_location_loading {
    return Intl.message(
      'Getting address…',
      name: 'pick_location_loading',
      desc: '',
      args: [],
    );
  }

  /// `Couldn't fetch the address`
  String get pick_location_failed {
    return Intl.message(
      'Couldn\'t fetch the address',
      name: 'pick_location_failed',
      desc: '',
      args: [],
    );
  }

  /// `My requests`
  String get offers_back {
    return Intl.message('My requests', name: 'offers_back', desc: '', args: []);
  }

  /// `{count} offers on your request`
  String offers_title(Object count) {
    return Intl.message(
      '$count offers on your request',
      name: 'offers_title',
      desc: '',
      args: [count],
    );
  }

  /// `{qty} • {date} • Budget {budget} EGP`
  String offers_request_summary(Object qty, Object date, Object budget) {
    return Intl.message(
      '$qty • $date • Budget $budget EGP',
      name: 'offers_request_summary',
      desc: '',
      args: [qty, date, budget],
    );
  }

  /// `Best`
  String get offers_best {
    return Intl.message('Best', name: 'offers_best', desc: '', args: []);
  }

  /// `New`
  String get offers_new {
    return Intl.message('New', name: 'offers_new', desc: '', args: []);
  }

  /// `Verified`
  String get offers_verified {
    return Intl.message(
      'Verified',
      name: 'offers_verified',
      desc: '',
      args: [],
    );
  }

  /// `{km} km`
  String offers_distance_km(Object km) {
    return Intl.message(
      '$km km',
      name: 'offers_distance_km',
      desc: '',
      args: [km],
    );
  }

  /// `Insurance`
  String get offers_field_insurance {
    return Intl.message(
      'Insurance',
      name: 'offers_field_insurance',
      desc: '',
      args: [],
    );
  }

  /// `Delivery`
  String get offers_field_delivery {
    return Intl.message(
      'Delivery',
      name: 'offers_field_delivery',
      desc: '',
      args: [],
    );
  }

  /// `Response`
  String get offers_field_response {
    return Intl.message(
      'Response',
      name: 'offers_field_response',
      desc: '',
      args: [],
    );
  }

  /// `Free`
  String get offers_delivery_free {
    return Intl.message(
      'Free',
      name: 'offers_delivery_free',
      desc: '',
      args: [],
    );
  }

  /// `On renter`
  String get offers_delivery_on_renter {
    return Intl.message(
      'On renter',
      name: 'offers_delivery_on_renter',
      desc: '',
      args: [],
    );
  }

  /// `{minutes} min`
  String offers_response_minutes(Object minutes) {
    return Intl.message(
      '$minutes min',
      name: 'offers_response_minutes',
      desc: '',
      args: [minutes],
    );
  }

  /// `EGP`
  String get offers_currency {
    return Intl.message('EGP', name: 'offers_currency', desc: '', args: []);
  }

  /// `Accept offer`
  String get offers_accept {
    return Intl.message(
      'Accept offer',
      name: 'offers_accept',
      desc: '',
      args: [],
    );
  }

  /// `Ask`
  String get offers_ask {
    return Intl.message('Ask', name: 'offers_ask', desc: '', args: []);
  }

  /// `Compare {count}`
  String offers_compare(Object count) {
    return Intl.message(
      'Compare $count',
      name: 'offers_compare',
      desc: '',
      args: [count],
    );
  }

  /// `Offer details`
  String get offer_details_title {
    return Intl.message(
      'Offer details',
      name: 'offer_details_title',
      desc: '',
      args: [],
    );
  }

  /// `Product details`
  String get offer_details_product {
    return Intl.message(
      'Product details',
      name: 'offer_details_product',
      desc: '',
      args: [],
    );
  }

  /// `Selected offer`
  String get offer_details_selected {
    return Intl.message(
      'Selected offer',
      name: 'offer_details_selected',
      desc: '',
      args: [],
    );
  }

  /// `Show other offers`
  String get offer_details_switch_others {
    return Intl.message(
      'Show other offers',
      name: 'offer_details_switch_others',
      desc: '',
      args: [],
    );
  }

  /// `Pick one offer`
  String get offer_details_pick_one {
    return Intl.message(
      'Pick one offer',
      name: 'offer_details_pick_one',
      desc: '',
      args: [],
    );
  }

  /// `Quantity`
  String get offer_details_quantity {
    return Intl.message(
      'Quantity',
      name: 'offer_details_quantity',
      desc: '',
      args: [],
    );
  }

  /// `Need by`
  String get offer_details_need_by {
    return Intl.message(
      'Need by',
      name: 'offer_details_need_by',
      desc: '',
      args: [],
    );
  }

  /// `Budget`
  String get offer_details_budget {
    return Intl.message(
      'Budget',
      name: 'offer_details_budget',
      desc: '',
      args: [],
    );
  }

  /// `Message`
  String get offer_details_message {
    return Intl.message(
      'Message',
      name: 'offer_details_message',
      desc: '',
      args: [],
    );
  }

  /// `Confirm selection`
  String get offer_details_confirm {
    return Intl.message(
      'Confirm selection',
      name: 'offer_details_confirm',
      desc: '',
      args: [],
    );
  }

  /// `Offer selected`
  String get offer_details_confirmed {
    return Intl.message(
      'Offer selected',
      name: 'offer_details_confirmed',
      desc: '',
      args: [],
    );
  }

  /// `My orders`
  String get orders_title {
    return Intl.message('My orders', name: 'orders_title', desc: '', args: []);
  }

  /// `Your requests and active fulfillments — no prices`
  String get orders_subtitle {
    return Intl.message(
      'Your requests and active fulfillments — no prices',
      name: 'orders_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `All`
  String get orders_filter_all {
    return Intl.message('All', name: 'orders_filter_all', desc: '', args: []);
  }

  /// `Active`
  String get orders_filter_active {
    return Intl.message(
      'Active',
      name: 'orders_filter_active',
      desc: '',
      args: [],
    );
  }

  /// `Done`
  String get orders_filter_done {
    return Intl.message('Done', name: 'orders_filter_done', desc: '', args: []);
  }

  /// `Cancelled`
  String get orders_filter_cancelled {
    return Intl.message(
      'Cancelled',
      name: 'orders_filter_cancelled',
      desc: '',
      args: [],
    );
  }

  /// `Awaiting offers`
  String get orders_status_awaiting {
    return Intl.message(
      'Awaiting offers',
      name: 'orders_status_awaiting',
      desc: '',
      args: [],
    );
  }

  /// `Offer accepted`
  String get orders_status_accepted {
    return Intl.message(
      'Offer accepted',
      name: 'orders_status_accepted',
      desc: '',
      args: [],
    );
  }

  /// `Ready for pickup`
  String get orders_status_confirmed {
    return Intl.message(
      'Ready for pickup',
      name: 'orders_status_confirmed',
      desc: '',
      args: [],
    );
  }

  /// `Pickup`
  String get orders_status_delivery {
    return Intl.message(
      'Pickup',
      name: 'orders_status_delivery',
      desc: '',
      args: [],
    );
  }

  /// `Handed over`
  String get orders_status_in_use {
    return Intl.message(
      'Handed over',
      name: 'orders_status_in_use',
      desc: '',
      args: [],
    );
  }

  /// `Completed`
  String get orders_status_completed {
    return Intl.message(
      'Completed',
      name: 'orders_status_completed',
      desc: '',
      args: [],
    );
  }

  /// `Cancelled`
  String get orders_status_cancelled {
    return Intl.message(
      'Cancelled',
      name: 'orders_status_cancelled',
      desc: '',
      args: [],
    );
  }

  /// `{provider} · {qty}`
  String orders_meta(Object provider, Object qty) {
    return Intl.message(
      '$provider · $qty',
      name: 'orders_meta',
      desc: '',
      args: [provider, qty],
    );
  }

  /// `Awaiting offers`
  String get orders_awaiting_peer {
    return Intl.message(
      'Awaiting offers',
      name: 'orders_awaiting_peer',
      desc: '',
      args: [],
    );
  }

  /// `My offer`
  String get orders_role_fulfill {
    return Intl.message(
      'My offer',
      name: 'orders_role_fulfill',
      desc: '',
      args: [],
    );
  }

  /// `See offers`
  String get orders_next_offers {
    return Intl.message(
      'See offers',
      name: 'orders_next_offers',
      desc: '',
      args: [],
    );
  }

  /// `Pickup details`
  String get orders_next_pickup {
    return Intl.message(
      'Pickup details',
      name: 'orders_next_pickup',
      desc: '',
      args: [],
    );
  }

  /// `Show pickup code`
  String get orders_next_show_code {
    return Intl.message(
      'Show pickup code',
      name: 'orders_next_show_code',
      desc: '',
      args: [],
    );
  }

  /// `Enter pickup code`
  String get orders_next_enter_code {
    return Intl.message(
      'Enter pickup code',
      name: 'orders_next_enter_code',
      desc: '',
      args: [],
    );
  }

  /// `Track order`
  String get orders_next_track {
    return Intl.message(
      'Track order',
      name: 'orders_next_track',
      desc: '',
      args: [],
    );
  }

  /// `Details`
  String get orders_next_details {
    return Intl.message(
      'Details',
      name: 'orders_next_details',
      desc: '',
      args: [],
    );
  }

  /// `{count} orders are waiting on you for pickup`
  String orders_action_needed(Object count) {
    return Intl.message(
      '$count orders are waiting on you for pickup',
      name: 'orders_action_needed',
      desc: '',
      args: [count],
    );
  }

  /// `No orders yet`
  String get orders_empty_title {
    return Intl.message(
      'No orders yet',
      name: 'orders_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `When you send a request or accept an offer, it shows up here.`
  String get orders_empty_subtitle {
    return Intl.message(
      'When you send a request or accept an offer, it shows up here.',
      name: 'orders_empty_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Explore coming soon`
  String get orders_tab_explore {
    return Intl.message(
      'Explore coming soon',
      name: 'orders_tab_explore',
      desc: '',
      args: [],
    );
  }

  /// `Account coming soon`
  String get orders_tab_account {
    return Intl.message(
      'Account coming soon',
      name: 'orders_tab_account',
      desc: '',
      args: [],
    );
  }

  /// `Order details`
  String get order_detail_title {
    return Intl.message(
      'Order details',
      name: 'order_detail_title',
      desc: '',
      args: [],
    );
  }

  /// `Order timeline`
  String get order_detail_timeline {
    return Intl.message(
      'Order timeline',
      name: 'order_detail_timeline',
      desc: '',
      args: [],
    );
  }

  /// `Needed {date} · {qty}`
  String order_detail_event(Object date, Object qty) {
    return Intl.message(
      'Needed $date · $qty',
      name: 'order_detail_event',
      desc: '',
      args: [date, qty],
    );
  }

  /// `Pay cash on pickup`
  String get order_detail_cash_note {
    return Intl.message(
      'Pay cash on pickup',
      name: 'order_detail_cash_note',
      desc: '',
      args: [],
    );
  }

  /// `Pickup code`
  String get order_detail_code_title {
    return Intl.message(
      'Pickup code',
      name: 'order_detail_code_title',
      desc: '',
      args: [],
    );
  }

  /// `Show this to the other party at pickup so they can confirm handover`
  String get order_detail_code_hint {
    return Intl.message(
      'Show this to the other party at pickup so they can confirm handover',
      name: 'order_detail_code_hint',
      desc: '',
      args: [],
    );
  }

  /// `Copy code`
  String get order_detail_code_copy {
    return Intl.message(
      'Copy code',
      name: 'order_detail_code_copy',
      desc: '',
      args: [],
    );
  }

  /// `Code copied`
  String get order_detail_code_copied {
    return Intl.message(
      'Code copied',
      name: 'order_detail_code_copied',
      desc: '',
      args: [],
    );
  }

  /// `This code was already verified and the item was received`
  String get order_detail_code_used_hint {
    return Intl.message(
      'This code was already verified and the item was received',
      name: 'order_detail_code_used_hint',
      desc: '',
      args: [],
    );
  }

  /// `Receipt confirmed`
  String get order_detail_code_verified_badge {
    return Intl.message(
      'Receipt confirmed',
      name: 'order_detail_code_verified_badge',
      desc: '',
      args: [],
    );
  }

  /// `Enter the pickup code`
  String get order_detail_code_required {
    return Intl.message(
      'Enter the pickup code',
      name: 'order_detail_code_required',
      desc: '',
      args: [],
    );
  }

  /// `Receipt confirmed successfully`
  String get order_detail_code_verified {
    return Intl.message(
      'Receipt confirmed successfully',
      name: 'order_detail_code_verified',
      desc: '',
      args: [],
    );
  }

  /// `Confirm receipt with code`
  String get order_detail_enter_code_title {
    return Intl.message(
      'Confirm receipt with code',
      name: 'order_detail_enter_code_title',
      desc: '',
      args: [],
    );
  }

  /// `Ask the other party for their code and enter it here to confirm handover`
  String get order_detail_enter_code_hint {
    return Intl.message(
      'Ask the other party for their code and enter it here to confirm handover',
      name: 'order_detail_enter_code_hint',
      desc: '',
      args: [],
    );
  }

  /// `Pickup code`
  String get order_detail_enter_code_label {
    return Intl.message(
      'Pickup code',
      name: 'order_detail_enter_code_label',
      desc: '',
      args: [],
    );
  }

  /// `Confirm receipt`
  String get order_detail_enter_code_submit {
    return Intl.message(
      'Confirm receipt',
      name: 'order_detail_enter_code_submit',
      desc: '',
      args: [],
    );
  }

  /// `Move order`
  String get order_detail_actions_title {
    return Intl.message(
      'Move order',
      name: 'order_detail_actions_title',
      desc: '',
      args: [],
    );
  }

  /// `Update the order status for this deal stage`
  String get order_detail_actions_hint {
    return Intl.message(
      'Update the order status for this deal stage',
      name: 'order_detail_actions_hint',
      desc: '',
      args: [],
    );
  }

  /// `Order status updated`
  String get order_detail_status_updated {
    return Intl.message(
      'Order status updated',
      name: 'order_detail_status_updated',
      desc: '',
      args: [],
    );
  }

  /// `Show pickup code`
  String get chat_open_code_share {
    return Intl.message(
      'Show pickup code',
      name: 'chat_open_code_share',
      desc: '',
      args: [],
    );
  }

  /// `Confirm receipt with code`
  String get chat_open_code_enter {
    return Intl.message(
      'Confirm receipt with code',
      name: 'chat_open_code_enter',
      desc: '',
      args: [],
    );
  }

  /// `Explore`
  String get explore_title {
    return Intl.message('Explore', name: 'explore_title', desc: '', args: []);
  }

  /// `Near {place}`
  String explore_subtitle(Object place) {
    return Intl.message(
      'Near $place',
      name: 'explore_subtitle',
      desc: '',
      args: [place],
    );
  }

  /// `Search chairs, backdrop, lighting…`
  String get explore_search_hint {
    return Intl.message(
      'Search chairs, backdrop, lighting…',
      name: 'explore_search_hint',
      desc: '',
      args: [],
    );
  }

  /// `All`
  String get explore_deal_all {
    return Intl.message('All', name: 'explore_deal_all', desc: '', args: []);
  }

  /// `Nearest`
  String get explore_sort_nearest {
    return Intl.message(
      'Nearest',
      name: 'explore_sort_nearest',
      desc: '',
      args: [],
    );
  }

  /// `Needed soonest`
  String get explore_sort_soonest {
    return Intl.message(
      'Needed soonest',
      name: 'explore_sort_soonest',
      desc: '',
      args: [],
    );
  }

  /// `Cheapest`
  String get explore_sort_cheapest {
    return Intl.message(
      'Cheapest',
      name: 'explore_sort_cheapest',
      desc: '',
      args: [],
    );
  }

  /// `Top rated`
  String get explore_sort_rating {
    return Intl.message(
      'Top rated',
      name: 'explore_sort_rating',
      desc: '',
      args: [],
    );
  }

  /// `Sort`
  String get explore_sort_label {
    return Intl.message('Sort', name: 'explore_sort_label', desc: '', args: []);
  }

  /// `{count} requests`
  String explore_results_count(Object count) {
    return Intl.message(
      '$count requests',
      name: 'explore_results_count',
      desc: '',
      args: [count],
    );
  }

  /// `No results in this radius`
  String get explore_empty_title {
    return Intl.message(
      'No results in this radius',
      name: 'explore_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `Widen the radius, or post a request and we'll find it.`
  String get explore_empty_subtitle {
    return Intl.message(
      'Widen the radius, or post a request and we\'ll find it.',
      name: 'explore_empty_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Request it and we'll find it`
  String get explore_empty_request {
    return Intl.message(
      'Request it and we\'ll find it',
      name: 'explore_empty_request',
      desc: '',
      args: [],
    );
  }

  /// `Widen radius`
  String get explore_empty_widen {
    return Intl.message(
      'Widen radius',
      name: 'explore_empty_widen',
      desc: '',
      args: [],
    );
  }

  /// `No requests within {km} km`
  String explore_empty_title_radius(Object km) {
    return Intl.message(
      'No requests within $km km',
      name: 'explore_empty_title_radius',
      desc: '',
      args: [km],
    );
  }

  /// `Widen to {km} km`
  String explore_empty_widen_to(Object km) {
    return Intl.message(
      'Widen to $km km',
      name: 'explore_empty_widen_to',
      desc: '',
      args: [km],
    );
  }

  /// `Account`
  String get account_title {
    return Intl.message('Account', name: 'account_title', desc: '', args: []);
  }

  /// `Verified`
  String get account_verified {
    return Intl.message(
      'Verified',
      name: 'account_verified',
      desc: '',
      args: [],
    );
  }

  /// `Orders`
  String get account_stat_orders {
    return Intl.message(
      'Orders',
      name: 'account_stat_orders',
      desc: '',
      args: [],
    );
  }

  /// `My listings`
  String get account_stat_listings {
    return Intl.message(
      'My listings',
      name: 'account_stat_listings',
      desc: '',
      args: [],
    );
  }

  /// `Requests`
  String get account_stat_requests {
    return Intl.message(
      'Requests',
      name: 'account_stat_requests',
      desc: '',
      args: [],
    );
  }

  /// `Reviews`
  String get account_stat_reviews {
    return Intl.message(
      'Reviews',
      name: 'account_stat_reviews',
      desc: '',
      args: [],
    );
  }

  /// `Activity`
  String get account_section_activity {
    return Intl.message(
      'Activity',
      name: 'account_section_activity',
      desc: '',
      args: [],
    );
  }

  /// `Account`
  String get account_section_profile {
    return Intl.message(
      'Account',
      name: 'account_section_profile',
      desc: '',
      args: [],
    );
  }

  /// `Preferences`
  String get account_section_preferences {
    return Intl.message(
      'Preferences',
      name: 'account_section_preferences',
      desc: '',
      args: [],
    );
  }

  /// `Support`
  String get account_section_support {
    return Intl.message(
      'Support',
      name: 'account_section_support',
      desc: '',
      args: [],
    );
  }

  /// `About`
  String get account_section_about {
    return Intl.message(
      'About',
      name: 'account_section_about',
      desc: '',
      args: [],
    );
  }

  /// `Edit profile`
  String get account_edit_profile {
    return Intl.message(
      'Edit profile',
      name: 'account_edit_profile',
      desc: '',
      args: [],
    );
  }

  /// `Name, phone, and email`
  String get account_edit_profile_hint {
    return Intl.message(
      'Name, phone, and email',
      name: 'account_edit_profile_hint',
      desc: '',
      args: [],
    );
  }

  /// `My addresses`
  String get account_addresses {
    return Intl.message(
      'My addresses',
      name: 'account_addresses',
      desc: '',
      args: [],
    );
  }

  /// `{count} addresses`
  String account_addresses_count(Object count) {
    return Intl.message(
      '$count addresses',
      name: 'account_addresses_count',
      desc: '',
      args: [count],
    );
  }

  /// `Saved delivery and pickup places`
  String get account_addresses_subtitle {
    return Intl.message(
      'Saved delivery and pickup places',
      name: 'account_addresses_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Default`
  String get account_address_default {
    return Intl.message(
      'Default',
      name: 'account_address_default',
      desc: '',
      args: [],
    );
  }

  /// `Notifications`
  String get account_notifications {
    return Intl.message(
      'Notifications',
      name: 'account_notifications',
      desc: '',
      args: [],
    );
  }

  /// `Control offers and order alerts`
  String get account_notifications_hint {
    return Intl.message(
      'Control offers and order alerts',
      name: 'account_notifications_hint',
      desc: '',
      args: [],
    );
  }

  /// `Appearance`
  String get account_theme {
    return Intl.message(
      'Appearance',
      name: 'account_theme',
      desc: '',
      args: [],
    );
  }

  /// `Light`
  String get account_theme_light {
    return Intl.message(
      'Light',
      name: 'account_theme_light',
      desc: '',
      args: [],
    );
  }

  /// `Dark`
  String get account_theme_dark {
    return Intl.message('Dark', name: 'account_theme_dark', desc: '', args: []);
  }

  /// `System`
  String get account_theme_system {
    return Intl.message(
      'System',
      name: 'account_theme_system',
      desc: '',
      args: [],
    );
  }

  /// `Appearance updated`
  String get account_theme_updated {
    return Intl.message(
      'Appearance updated',
      name: 'account_theme_updated',
      desc: '',
      args: [],
    );
  }

  /// `Dark mode`
  String get account_dark_mode {
    return Intl.message(
      'Dark mode',
      name: 'account_dark_mode',
      desc: '',
      args: [],
    );
  }

  /// `العربية`
  String get account_lang_ar {
    return Intl.message('العربية', name: 'account_lang_ar', desc: '', args: []);
  }

  /// `English`
  String get account_lang_en {
    return Intl.message('English', name: 'account_lang_en', desc: '', args: []);
  }

  /// `Language updated`
  String get account_language_updated {
    return Intl.message(
      'Language updated',
      name: 'account_language_updated',
      desc: '',
      args: [],
    );
  }

  /// `Help center`
  String get account_help {
    return Intl.message(
      'Help center',
      name: 'account_help',
      desc: '',
      args: [],
    );
  }

  /// `FAQs and ways to contact us`
  String get account_help_hint {
    return Intl.message(
      'FAQs and ways to contact us',
      name: 'account_help_hint',
      desc: '',
      args: [],
    );
  }

  /// `Terms & conditions`
  String get account_terms {
    return Intl.message(
      'Terms & conditions',
      name: 'account_terms',
      desc: '',
      args: [],
    );
  }

  /// `Privacy policy`
  String get account_privacy {
    return Intl.message(
      'Privacy policy',
      name: 'account_privacy',
      desc: '',
      args: [],
    );
  }

  /// `We respect your privacy and use your data only to run Dabrha and improve renting and buying.`
  String get account_privacy_body {
    return Intl.message(
      'We respect your privacy and use your data only to run Dabrha and improve renting and buying.',
      name: 'account_privacy_body',
      desc: '',
      args: [],
    );
  }

  /// `• Your location is used only to show nearby items.`
  String get account_privacy_point_1 {
    return Intl.message(
      '• Your location is used only to show nearby items.',
      name: 'account_privacy_point_1',
      desc: '',
      args: [],
    );
  }

  /// `• Your phone is shared with owners after an offer is accepted.`
  String get account_privacy_point_2 {
    return Intl.message(
      '• Your phone is shared with owners after an offer is accepted.',
      name: 'account_privacy_point_2',
      desc: '',
      args: [],
    );
  }

  /// `• You can request account deletion from support anytime.`
  String get account_privacy_point_3 {
    return Intl.message(
      '• You can request account deletion from support anytime.',
      name: 'account_privacy_point_3',
      desc: '',
      args: [],
    );
  }

  /// `App version`
  String get account_version {
    return Intl.message(
      'App version',
      name: 'account_version',
      desc: '',
      args: [],
    );
  }

  /// `Log out?`
  String get account_logout_title {
    return Intl.message(
      'Log out?',
      name: 'account_logout_title',
      desc: '',
      args: [],
    );
  }

  /// `You'll need to sign in again to track orders and offers.`
  String get account_logout_subtitle {
    return Intl.message(
      'You\'ll need to sign in again to track orders and offers.',
      name: 'account_logout_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Logged out`
  String get account_logout_done {
    return Intl.message(
      'Logged out',
      name: 'account_logout_done',
      desc: '',
      args: [],
    );
  }

  /// `Changes saved`
  String get account_profile_saved {
    return Intl.message(
      'Changes saved',
      name: 'account_profile_saved',
      desc: '',
      args: [],
    );
  }

  /// `First name`
  String get account_first_name {
    return Intl.message(
      'First name',
      name: 'account_first_name',
      desc: '',
      args: [],
    );
  }

  /// `Last name`
  String get account_last_name {
    return Intl.message(
      'Last name',
      name: 'account_last_name',
      desc: '',
      args: [],
    );
  }

  /// `City`
  String get account_city {
    return Intl.message('City', name: 'account_city', desc: '', args: []);
  }

  /// `Push notifications`
  String get account_notif_push {
    return Intl.message(
      'Push notifications',
      name: 'account_notif_push',
      desc: '',
      args: [],
    );
  }

  /// `Alerts for offers and order updates`
  String get account_notif_push_hint {
    return Intl.message(
      'Alerts for offers and order updates',
      name: 'account_notif_push_hint',
      desc: '',
      args: [],
    );
  }

  /// `New offers`
  String get account_notif_offers {
    return Intl.message(
      'New offers',
      name: 'account_notif_offers',
      desc: '',
      args: [],
    );
  }

  /// `When an owner replies to your request`
  String get account_notif_offers_hint {
    return Intl.message(
      'When an owner replies to your request',
      name: 'account_notif_offers_hint',
      desc: '',
      args: [],
    );
  }

  /// `SMS messages`
  String get account_notif_sms {
    return Intl.message(
      'SMS messages',
      name: 'account_notif_sms',
      desc: '',
      args: [],
    );
  }

  /// `Important confirmations to your phone`
  String get account_notif_sms_hint {
    return Intl.message(
      'Important confirmations to your phone',
      name: 'account_notif_sms_hint',
      desc: '',
      args: [],
    );
  }

  /// `How do I request something I can't find?`
  String get account_faq_1_q {
    return Intl.message(
      'How do I request something I can\'t find?',
      name: 'account_faq_1_q',
      desc: '',
      args: [],
    );
  }

  /// `Use Request, add description, quantity and date — it reaches matching owners in your radius.`
  String get account_faq_1_a {
    return Intl.message(
      'Use Request, add description, quantity and date — it reaches matching owners in your radius.',
      name: 'account_faq_1_a',
      desc: '',
      args: [],
    );
  }

  /// `What's the difference between rent and buy?`
  String get account_faq_2_q {
    return Intl.message(
      'What\'s the difference between rent and buy?',
      name: 'account_faq_2_q',
      desc: '',
      args: [],
    );
  }

  /// `Rent is for the event period; buy if you want to keep the item. Filter in Explore.`
  String get account_faq_2_a {
    return Intl.message(
      'Rent is for the event period; buy if you want to keep the item. Filter in Explore.',
      name: 'account_faq_2_a',
      desc: '',
      args: [],
    );
  }

  /// `How do I pick up an order?`
  String get account_faq_3_q {
    return Intl.message(
      'How do I pick up an order?',
      name: 'account_faq_3_q',
      desc: '',
      args: [],
    );
  }

  /// `After confirmation you'll see a pickup code in order details — show it to the owner.`
  String get account_faq_3_a {
    return Intl.message(
      'After confirmation you\'ll see a pickup code in order details — show it to the owner.',
      name: 'account_faq_3_a',
      desc: '',
      args: [],
    );
  }

  /// `Contact us`
  String get account_contact_title {
    return Intl.message(
      'Contact us',
      name: 'account_contact_title',
      desc: '',
      args: [],
    );
  }

  /// `Email support@dabrha.com or chat in-app after an offer is accepted.`
  String get account_contact_body {
    return Intl.message(
      'Email support@dabrha.com or chat in-app after an offer is accepted.',
      name: 'account_contact_body',
      desc: '',
      args: [],
    );
  }

  /// `My orders`
  String get account_my_orders_title {
    return Intl.message(
      'My orders',
      name: 'account_my_orders_title',
      desc: '',
      args: [],
    );
  }

  /// `My listings`
  String get account_my_listings_title {
    return Intl.message(
      'My listings',
      name: 'account_my_listings_title',
      desc: '',
      args: [],
    );
  }

  /// `Items you listed for others to rent or buy`
  String get account_my_listings_subtitle {
    return Intl.message(
      'Items you listed for others to rent or buy',
      name: 'account_my_listings_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Every listing follows: insurance → deposit → handover → late fee if delayed`
  String get account_my_listings_cycle_hint {
    return Intl.message(
      'Every listing follows: insurance → deposit → handover → late fee if delayed',
      name: 'account_my_listings_cycle_hint',
      desc: '',
      args: [],
    );
  }

  /// `No listings yet`
  String get account_listings_empty_title {
    return Intl.message(
      'No listings yet',
      name: 'account_listings_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `When you list something for rent or sale, it appears here with incoming requests and the full money cycle.`
  String get account_listings_empty_subtitle {
    return Intl.message(
      'When you list something for rent or sale, it appears here with incoming requests and the full money cycle.',
      name: 'account_listings_empty_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Listing details`
  String get account_listing_detail_title {
    return Intl.message(
      'Listing details',
      name: 'account_listing_detail_title',
      desc: '',
      args: [],
    );
  }

  /// `Listing not found`
  String get account_listing_not_found {
    return Intl.message(
      'Listing not found',
      name: 'account_listing_not_found',
      desc: '',
      args: [],
    );
  }

  /// `Listed`
  String get account_listing_status_active {
    return Intl.message(
      'Listed',
      name: 'account_listing_status_active',
      desc: '',
      args: [],
    );
  }

  /// `Incoming offers`
  String get account_listing_status_offer_received {
    return Intl.message(
      'Incoming offers',
      name: 'account_listing_status_offer_received',
      desc: '',
      args: [],
    );
  }

  /// `Insurance`
  String get account_listing_status_insurance {
    return Intl.message(
      'Insurance',
      name: 'account_listing_status_insurance',
      desc: '',
      args: [],
    );
  }

  /// `Deposit`
  String get account_listing_status_deposit {
    return Intl.message(
      'Deposit',
      name: 'account_listing_status_deposit',
      desc: '',
      args: [],
    );
  }

  /// `In use`
  String get account_listing_status_in_progress {
    return Intl.message(
      'In use',
      name: 'account_listing_status_in_progress',
      desc: '',
      args: [],
    );
  }

  /// `Late fee`
  String get account_listing_status_late_fee {
    return Intl.message(
      'Late fee',
      name: 'account_listing_status_late_fee',
      desc: '',
      args: [],
    );
  }

  /// `Completed`
  String get account_listing_status_completed {
    return Intl.message(
      'Completed',
      name: 'account_listing_status_completed',
      desc: '',
      args: [],
    );
  }

  /// `Paused`
  String get account_listing_status_paused {
    return Intl.message(
      'Paused',
      name: 'account_listing_status_paused',
      desc: '',
      args: [],
    );
  }

  /// `{deal} · {category} · {date}`
  String account_listing_meta(Object deal, Object category, Object date) {
    return Intl.message(
      '$deal · $category · $date',
      name: 'account_listing_meta',
      desc: '',
      args: [deal, category, date],
    );
  }

  /// `{count} incoming · {city}`
  String account_listing_offers(Object count, Object city) {
    return Intl.message(
      '$count incoming · $city',
      name: 'account_listing_offers',
      desc: '',
      args: [count, city],
    );
  }

  /// `{qty} · {city}`
  String account_listing_qty(Object qty, Object city) {
    return Intl.message(
      '$qty · $city',
      name: 'account_listing_qty',
      desc: '',
      args: [qty, city],
    );
  }

  /// `Insurance is editable; deposit and late fee are platform rates and locked`
  String get account_listing_cycle_hint {
    return Intl.message(
      'Insurance is editable; deposit and late fee are platform rates and locked',
      name: 'account_listing_cycle_hint',
      desc: '',
      args: [],
    );
  }

  /// `Deal path`
  String get account_listing_timeline_title {
    return Intl.message(
      'Deal path',
      name: 'account_listing_timeline_title',
      desc: '',
      args: [],
    );
  }

  /// `From publish to complete — the core app cycle`
  String get account_listing_timeline_hint {
    return Intl.message(
      'From publish to complete — the core app cycle',
      name: 'account_listing_timeline_hint',
      desc: '',
      args: [],
    );
  }

  /// `My listings`
  String get account_listings_tile {
    return Intl.message(
      'My listings',
      name: 'account_listings_tile',
      desc: '',
      args: [],
    );
  }

  /// `Items you listed for rent or sale`
  String get account_listings_tile_hint {
    return Intl.message(
      'Items you listed for rent or sale',
      name: 'account_listings_tile_hint',
      desc: '',
      args: [],
    );
  }

  /// `Search requests`
  String get account_my_requests_title {
    return Intl.message(
      'Search requests',
      name: 'account_my_requests_title',
      desc: '',
      args: [],
    );
  }

  /// `Requests you sent to matching owners`
  String get account_my_requests_subtitle {
    return Intl.message(
      'Requests you sent to matching owners',
      name: 'account_my_requests_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Reviews`
  String get account_my_reviews_title {
    return Intl.message(
      'Reviews',
      name: 'account_my_reviews_title',
      desc: '',
      args: [],
    );
  }

  /// `Reviews you wrote and reviews about you`
  String get account_my_reviews_subtitle {
    return Intl.message(
      'Reviews you wrote and reviews about you',
      name: 'account_my_reviews_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Given`
  String get account_reviews_given {
    return Intl.message(
      'Given',
      name: 'account_reviews_given',
      desc: '',
      args: [],
    );
  }

  /// `Received`
  String get account_reviews_received {
    return Intl.message(
      'Received',
      name: 'account_reviews_received',
      desc: '',
      args: [],
    );
  }

  /// `No reviews here yet`
  String get account_reviews_empty {
    return Intl.message(
      'No reviews here yet',
      name: 'account_reviews_empty',
      desc: '',
      args: [],
    );
  }

  /// `No search requests`
  String get account_requests_empty_title {
    return Intl.message(
      'No search requests',
      name: 'account_requests_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `When you post a request, it shows up here with offers.`
  String get account_requests_empty_subtitle {
    return Intl.message(
      'When you post a request, it shows up here with offers.',
      name: 'account_requests_empty_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Open`
  String get account_request_status_open {
    return Intl.message(
      'Open',
      name: 'account_request_status_open',
      desc: '',
      args: [],
    );
  }

  /// `Closed`
  String get account_request_status_closed {
    return Intl.message(
      'Closed',
      name: 'account_request_status_closed',
      desc: '',
      args: [],
    );
  }

  /// `Cancelled`
  String get account_request_status_cancelled {
    return Intl.message(
      'Cancelled',
      name: 'account_request_status_cancelled',
      desc: '',
      args: [],
    );
  }

  /// `{qty} · {date} · budget {budget} EGP`
  String account_request_meta(Object qty, Object date, Object budget) {
    return Intl.message(
      '$qty · $date · budget $budget EGP',
      name: 'account_request_meta',
      desc: '',
      args: [qty, date, budget],
    );
  }

  /// `{count} offers · {km} km radius`
  String account_request_offers(Object count, Object km) {
    return Intl.message(
      '$count offers · $km km radius',
      name: 'account_request_offers',
      desc: '',
      args: [count, km],
    );
  }

  /// `Search radius`
  String get account_radius_title {
    return Intl.message(
      'Search radius',
      name: 'account_radius_title',
      desc: '',
      args: [],
    );
  }

  /// `Default radius for Explore and your requests`
  String get account_radius_hint {
    return Intl.message(
      'Default radius for Explore and your requests',
      name: 'account_radius_hint',
      desc: '',
      args: [],
    );
  }

  /// `{km} km`
  String account_radius_value(Object km) {
    return Intl.message(
      '$km km',
      name: 'account_radius_value',
      desc: '',
      args: [km],
    );
  }

  /// `Search radius updated`
  String get account_radius_updated {
    return Intl.message(
      'Search radius updated',
      name: 'account_radius_updated',
      desc: '',
      args: [],
    );
  }

  /// `Profile photo`
  String get account_photo_title {
    return Intl.message(
      'Profile photo',
      name: 'account_photo_title',
      desc: '',
      args: [],
    );
  }

  /// `Change photo`
  String get account_photo_change {
    return Intl.message(
      'Change photo',
      name: 'account_photo_change',
      desc: '',
      args: [],
    );
  }

  /// `Remove photo`
  String get account_photo_remove {
    return Intl.message(
      'Remove photo',
      name: 'account_photo_remove',
      desc: '',
      args: [],
    );
  }

  /// `Personal details`
  String get account_edit_section_personal {
    return Intl.message(
      'Personal details',
      name: 'account_edit_section_personal',
      desc: '',
      args: [],
    );
  }

  /// `Contact & location`
  String get account_edit_section_contact {
    return Intl.message(
      'Contact & location',
      name: 'account_edit_section_contact',
      desc: '',
      args: [],
    );
  }

  /// `Home`
  String get account_address_home {
    return Intl.message(
      'Home',
      name: 'account_address_home',
      desc: '',
      args: [],
    );
  }

  /// `Work`
  String get account_address_work {
    return Intl.message(
      'Work',
      name: 'account_address_work',
      desc: '',
      args: [],
    );
  }

  /// `How do I list something I own?`
  String get account_faq_4_q {
    return Intl.message(
      'How do I list something I own?',
      name: 'account_faq_4_q',
      desc: '',
      args: [],
    );
  }

  /// `From Account → My listings you track what you published. Cycle: insurance, then deposit, then late fee if return is delayed.`
  String get account_faq_4_a {
    return Intl.message(
      'From Account → My listings you track what you published. Cycle: insurance, then deposit, then late fee if return is delayed.',
      name: 'account_faq_4_a',
      desc: '',
      args: [],
    );
  }

  /// `Contact methods`
  String get create_request_contacts_title {
    return Intl.message(
      'Contact methods',
      name: 'create_request_contacts_title',
      desc: '',
      args: [],
    );
  }

  /// `Choose what the other user can see once chat starts on this request`
  String get create_request_contacts_hint {
    return Intl.message(
      'Choose what the other user can see once chat starts on this request',
      name: 'create_request_contacts_hint',
      desc: '',
      args: [],
    );
  }

  /// `Show phone number`
  String get create_request_share_phone {
    return Intl.message(
      'Show phone number',
      name: 'create_request_share_phone',
      desc: '',
      args: [],
    );
  }

  /// `Visible on your profile and in chat when enabled`
  String get create_request_share_phone_hint {
    return Intl.message(
      'Visible on your profile and in chat when enabled',
      name: 'create_request_share_phone_hint',
      desc: '',
      args: [],
    );
  }

  /// `Show WhatsApp`
  String get create_request_share_whatsapp {
    return Intl.message(
      'Show WhatsApp',
      name: 'create_request_share_whatsapp',
      desc: '',
      args: [],
    );
  }

  /// `They can message you on WhatsApp directly`
  String get create_request_share_whatsapp_hint {
    return Intl.message(
      'They can message you on WhatsApp directly',
      name: 'create_request_share_whatsapp_hint',
      desc: '',
      args: [],
    );
  }

  /// `Same as phone`
  String get create_request_whatsapp_same {
    return Intl.message(
      'Same as phone',
      name: 'create_request_whatsapp_same',
      desc: '',
      args: [],
    );
  }

  /// `Use the phone number for WhatsApp`
  String get create_request_whatsapp_same_hint {
    return Intl.message(
      'Use the phone number for WhatsApp',
      name: 'create_request_whatsapp_same_hint',
      desc: '',
      args: [],
    );
  }

  /// `Phone number`
  String get create_request_phone_label {
    return Intl.message(
      'Phone number',
      name: 'create_request_phone_label',
      desc: '',
      args: [],
    );
  }

  /// `WhatsApp number`
  String get create_request_whatsapp_label {
    return Intl.message(
      'WhatsApp number',
      name: 'create_request_whatsapp_label',
      desc: '',
      args: [],
    );
  }

  /// `My chats`
  String get chat_conversations_title {
    return Intl.message(
      'My chats',
      name: 'chat_conversations_title',
      desc: '',
      args: [],
    );
  }

  /// `Chats tied to your orders`
  String get chat_conversations_tile_hint {
    return Intl.message(
      'Chats tied to your orders',
      name: 'chat_conversations_tile_hint',
      desc: '',
      args: [],
    );
  }

  /// `Every chat is tied to an order — product first`
  String get chat_conversations_subtitle {
    return Intl.message(
      'Every chat is tied to an order — product first',
      name: 'chat_conversations_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `No chats yet`
  String get chat_conversations_empty_title {
    return Intl.message(
      'No chats yet',
      name: 'chat_conversations_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `When you accept an offer or ask about an order, the chat opens here on that order.`
  String get chat_conversations_empty_subtitle {
    return Intl.message(
      'When you accept an offer or ask about an order, the chat opens here on that order.',
      name: 'chat_conversations_empty_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Chat`
  String get chat_conversation_title {
    return Intl.message(
      'Chat',
      name: 'chat_conversation_title',
      desc: '',
      args: [],
    );
  }

  /// `Order details`
  String get chat_order_card_title {
    return Intl.message(
      'Order details',
      name: 'chat_order_card_title',
      desc: '',
      args: [],
    );
  }

  /// `Order`
  String get chat_order_card_badge {
    return Intl.message(
      'Order',
      name: 'chat_order_card_badge',
      desc: '',
      args: [],
    );
  }

  /// `Quantity`
  String get chat_order_qty {
    return Intl.message('Quantity', name: 'chat_order_qty', desc: '', args: []);
  }

  /// `Need by`
  String get chat_order_need_by {
    return Intl.message(
      'Need by',
      name: 'chat_order_need_by',
      desc: '',
      args: [],
    );
  }

  /// `Offer from`
  String get chat_order_provider {
    return Intl.message(
      'Offer from',
      name: 'chat_order_provider',
      desc: '',
      args: [],
    );
  }

  /// `Status`
  String get chat_order_status {
    return Intl.message(
      'Status',
      name: 'chat_order_status',
      desc: '',
      args: [],
    );
  }

  /// `Price`
  String get chat_order_price {
    return Intl.message('Price', name: 'chat_order_price', desc: '', args: []);
  }

  /// `Write a message…`
  String get chat_composer_hint {
    return Intl.message(
      'Write a message…',
      name: 'chat_composer_hint',
      desc: '',
      args: [],
    );
  }

  /// `Attach photo`
  String get chat_attach_image {
    return Intl.message(
      'Attach photo',
      name: 'chat_attach_image',
      desc: '',
      args: [],
    );
  }

  /// `Camera`
  String get chat_attach_camera {
    return Intl.message(
      'Camera',
      name: 'chat_attach_camera',
      desc: '',
      args: [],
    );
  }

  /// `Gallery`
  String get chat_attach_gallery {
    return Intl.message(
      'Gallery',
      name: 'chat_attach_gallery',
      desc: '',
      args: [],
    );
  }

  /// `Photo`
  String get chat_image_caption {
    return Intl.message(
      'Photo',
      name: 'chat_image_caption',
      desc: '',
      args: [],
    );
  }

  /// `Online`
  String get chat_online {
    return Intl.message('Online', name: 'chat_online', desc: '', args: []);
  }

  /// `typing…`
  String get chat_typing {
    return Intl.message('typing…', name: 'chat_typing', desc: '', args: []);
  }

  /// `Last seen {time}`
  String chat_last_seen(Object time) {
    return Intl.message(
      'Last seen $time',
      name: 'chat_last_seen',
      desc: '',
      args: [time],
    );
  }

  /// `Today`
  String get chat_today {
    return Intl.message('Today', name: 'chat_today', desc: '', args: []);
  }

  /// `Yesterday`
  String get chat_yesterday {
    return Intl.message(
      'Yesterday',
      name: 'chat_yesterday',
      desc: '',
      args: [],
    );
  }

  /// `Reply`
  String get chat_reply {
    return Intl.message('Reply', name: 'chat_reply', desc: '', args: []);
  }

  /// `Replying to`
  String get chat_replying_to {
    return Intl.message(
      'Replying to',
      name: 'chat_replying_to',
      desc: '',
      args: [],
    );
  }

  /// `Copy`
  String get chat_copy {
    return Intl.message('Copy', name: 'chat_copy', desc: '', args: []);
  }

  /// `Photo`
  String get chat_photo {
    return Intl.message('Photo', name: 'chat_photo', desc: '', args: []);
  }

  /// `Message copied`
  String get chat_copied {
    return Intl.message(
      'Message copied',
      name: 'chat_copied',
      desc: '',
      args: [],
    );
  }

  /// `My request`
  String get chat_role_my_request {
    return Intl.message(
      'My request',
      name: 'chat_role_my_request',
      desc: '',
      args: [],
    );
  }

  /// `My listing`
  String get chat_role_my_listing {
    return Intl.message(
      'My listing',
      name: 'chat_role_my_listing',
      desc: '',
      args: [],
    );
  }

  /// `Offer accepted`
  String get chat_status_accepted {
    return Intl.message(
      'Offer accepted',
      name: 'chat_status_accepted',
      desc: '',
      args: [],
    );
  }

  /// `Insurance paid`
  String get chat_status_insurance {
    return Intl.message(
      'Insurance paid',
      name: 'chat_status_insurance',
      desc: '',
      args: [],
    );
  }

  /// `Deposit paid`
  String get chat_status_deposit {
    return Intl.message(
      'Deposit paid',
      name: 'chat_status_deposit',
      desc: '',
      args: [],
    );
  }

  /// `Delivery`
  String get chat_status_delivery {
    return Intl.message(
      'Delivery',
      name: 'chat_status_delivery',
      desc: '',
      args: [],
    );
  }

  /// `In use`
  String get chat_status_in_use {
    return Intl.message(
      'In use',
      name: 'chat_status_in_use',
      desc: '',
      args: [],
    );
  }

  /// `Completed`
  String get chat_status_completed {
    return Intl.message(
      'Completed',
      name: 'chat_status_completed',
      desc: '',
      args: [],
    );
  }

  /// `{count} new`
  String chat_unread(Object count) {
    return Intl.message(
      '$count new',
      name: 'chat_unread',
      desc: '',
      args: [count],
    );
  }

  /// `User profile`
  String get chat_user_profile_title {
    return Intl.message(
      'User profile',
      name: 'chat_user_profile_title',
      desc: '',
      args: [],
    );
  }

  /// `Completed deals`
  String get chat_user_completed_deals {
    return Intl.message(
      'Completed deals',
      name: 'chat_user_completed_deals',
      desc: '',
      args: [],
    );
  }

  /// `Listings`
  String get chat_user_listings_count {
    return Intl.message(
      'Listings',
      name: 'chat_user_listings_count',
      desc: '',
      args: [],
    );
  }

  /// `Contacts`
  String get chat_user_contacts_title {
    return Intl.message(
      'Contacts',
      name: 'chat_user_contacts_title',
      desc: '',
      args: [],
    );
  }

  /// `Visibility follows the user's privacy settings`
  String get chat_user_contacts_hint {
    return Intl.message(
      'Visibility follows the user\'s privacy settings',
      name: 'chat_user_contacts_hint',
      desc: '',
      args: [],
    );
  }

  /// `This user hid their contacts for now`
  String get chat_user_contacts_hidden {
    return Intl.message(
      'This user hid their contacts for now',
      name: 'chat_user_contacts_hidden',
      desc: '',
      args: [],
    );
  }

  /// `Phone`
  String get chat_contact_phone {
    return Intl.message(
      'Phone',
      name: 'chat_contact_phone',
      desc: '',
      args: [],
    );
  }

  /// `WhatsApp`
  String get chat_contact_whatsapp {
    return Intl.message(
      'WhatsApp',
      name: 'chat_contact_whatsapp',
      desc: '',
      args: [],
    );
  }

  /// `Their listings`
  String get chat_user_listings_title {
    return Intl.message(
      'Their listings',
      name: 'chat_user_listings_title',
      desc: '',
      args: [],
    );
  }

  /// `Nearest`
  String get offers_why_nearest {
    return Intl.message(
      'Nearest',
      name: 'offers_why_nearest',
      desc: '',
      args: [],
    );
  }

  /// `Fastest`
  String get offers_why_fastest {
    return Intl.message(
      'Fastest',
      name: 'offers_why_fastest',
      desc: '',
      args: [],
    );
  }

  /// `Top rated`
  String get offers_why_top_rated {
    return Intl.message(
      'Top rated',
      name: 'offers_why_top_rated',
      desc: '',
      args: [],
    );
  }

  /// `Lowest price`
  String get offers_why_cheapest {
    return Intl.message(
      'Lowest price',
      name: 'offers_why_cheapest',
      desc: '',
      args: [],
    );
  }

  /// `Commits to deliver before {time}`
  String offers_commit_before(Object time) {
    return Intl.message(
      'Commits to deliver before $time',
      name: 'offers_commit_before',
      desc: '',
      args: [time],
    );
  }

  /// `Tight timing`
  String get offers_late_risk {
    return Intl.message(
      'Tight timing',
      name: 'offers_late_risk',
      desc: '',
      args: [],
    );
  }

  /// `{count} deals`
  String offers_deals_count(Object count) {
    return Intl.message(
      '$count deals',
      name: 'offers_deals_count',
      desc: '',
      args: [count],
    );
  }

  /// `Deals`
  String get offers_field_deals {
    return Intl.message(
      'Deals',
      name: 'offers_field_deals',
      desc: '',
      args: [],
    );
  }

  /// `Pickup`
  String get offers_delivery_pickup {
    return Intl.message(
      'Pickup',
      name: 'offers_delivery_pickup',
      desc: '',
      args: [],
    );
  }

  /// `Compare offers`
  String get offers_compare_title {
    return Intl.message(
      'Compare offers',
      name: 'offers_compare_title',
      desc: '',
      args: [],
    );
  }

  /// `Price · distance · rating · response`
  String get offers_compare_subtitle {
    return Intl.message(
      'Price · distance · rating · response',
      name: 'offers_compare_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `{count} new offers`
  String offers_nudge_new(Object count) {
    return Intl.message(
      '$count new offers',
      name: 'offers_nudge_new',
      desc: '',
      args: [count],
    );
  }

  /// `Last offer {minutes}m ago`
  String offers_nudge_last(Object minutes) {
    return Intl.message(
      'Last offer ${minutes}m ago',
      name: 'offers_nudge_last',
      desc: '',
      args: [minutes],
    );
  }

  /// `Continue from chat and your order`
  String get offer_details_confirmed_hint {
    return Intl.message(
      'Continue from chat and your order',
      name: 'offer_details_confirmed_hint',
      desc: '',
      args: [],
    );
  }

  /// `Confirm time`
  String get chat_action_confirm_time {
    return Intl.message(
      'Confirm time',
      name: 'chat_action_confirm_time',
      desc: '',
      args: [],
    );
  }

  /// `Send location`
  String get chat_action_send_location {
    return Intl.message(
      'Send location',
      name: 'chat_action_send_location',
      desc: '',
      args: [],
    );
  }

  /// `Pickup code`
  String get chat_action_pickup_code {
    return Intl.message(
      'Pickup code',
      name: 'chat_action_pickup_code',
      desc: '',
      args: [],
    );
  }

  /// `Can we confirm the pickup time?`
  String get chat_quick_confirm_time_msg {
    return Intl.message(
      'Can we confirm the pickup time?',
      name: 'chat_quick_confirm_time_msg',
      desc: '',
      args: [],
    );
  }

  /// `Sending you my location now`
  String get chat_quick_location_msg {
    return Intl.message(
      'Sending you my location now',
      name: 'chat_quick_location_msg',
      desc: '',
      args: [],
    );
  }

  /// `Posted`
  String get lifecycle_published {
    return Intl.message(
      'Posted',
      name: 'lifecycle_published',
      desc: '',
      args: [],
    );
  }

  /// `Offers`
  String get lifecycle_offers {
    return Intl.message('Offers', name: 'lifecycle_offers', desc: '', args: []);
  }

  /// `Chosen`
  String get lifecycle_chosen {
    return Intl.message('Chosen', name: 'lifecycle_chosen', desc: '', args: []);
  }

  /// `Handover`
  String get lifecycle_handover {
    return Intl.message(
      'Handover',
      name: 'lifecycle_handover',
      desc: '',
      args: [],
    );
  }

  /// `Done`
  String get lifecycle_done {
    return Intl.message('Done', name: 'lifecycle_done', desc: '', args: []);
  }

  /// `Show this code to the provider`
  String get handover_show_title {
    return Intl.message(
      'Show this code to the provider',
      name: 'handover_show_title',
      desc: '',
      args: [],
    );
  }

  /// `Keep the screen clear for the other party`
  String get handover_show_hint {
    return Intl.message(
      'Keep the screen clear for the other party',
      name: 'handover_show_hint',
      desc: '',
      args: [],
    );
  }

  /// `Valid for {time}`
  String handover_countdown(Object time) {
    return Intl.message(
      'Valid for $time',
      name: 'handover_countdown',
      desc: '',
      args: [time],
    );
  }

  /// `Done showing`
  String get handover_done {
    return Intl.message(
      'Done showing',
      name: 'handover_done',
      desc: '',
      args: [],
    );
  }

  /// `Full-screen code`
  String get handover_open_ritual {
    return Intl.message(
      'Full-screen code',
      name: 'handover_open_ritual',
      desc: '',
      args: [],
    );
  }

  /// `I need`
  String get market_mode_requester {
    return Intl.message(
      'I need',
      name: 'market_mode_requester',
      desc: '',
      args: [],
    );
  }

  /// `I fulfill`
  String get market_mode_fulfiller {
    return Intl.message(
      'I fulfill',
      name: 'market_mode_fulfiller',
      desc: '',
      args: [],
    );
  }

  /// `Nearby requests you can fulfill`
  String get home_headline_fulfiller {
    return Intl.message(
      'Nearby requests you can fulfill',
      name: 'home_headline_fulfiller',
      desc: '',
      args: [],
    );
  }

  /// `Browse needs and send your offer`
  String get home_headline_fulfiller_sub {
    return Intl.message(
      'Browse needs and send your offer',
      name: 'home_headline_fulfiller_sub',
      desc: '',
      args: [],
    );
  }

  /// `No active fulfillments`
  String get orders_empty_fulfiller_title {
    return Intl.message(
      'No active fulfillments',
      name: 'orders_empty_fulfiller_title',
      desc: '',
      args: [],
    );
  }

  /// `When you start fulfilling a request, it shows here`
  String get orders_empty_fulfiller_subtitle {
    return Intl.message(
      'When you start fulfilling a request, it shows here',
      name: 'orders_empty_fulfiller_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Welcome back`
  String get auth_login_title {
    return Intl.message(
      'Welcome back',
      name: 'auth_login_title',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to request and track deals with confidence`
  String get auth_login_subtitle {
    return Intl.message(
      'Sign in to request and track deals with confidence',
      name: 'auth_login_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Sign in`
  String get auth_login_cta {
    return Intl.message('Sign in', name: 'auth_login_cta', desc: '', args: []);
  }

  /// `You're signed in`
  String get auth_login_success {
    return Intl.message(
      'You\'re signed in',
      name: 'auth_login_success',
      desc: '',
      args: [],
    );
  }

  /// `Ready to continue your requests`
  String get auth_login_success_hint {
    return Intl.message(
      'Ready to continue your requests',
      name: 'auth_login_success_hint',
      desc: '',
      args: [],
    );
  }

  /// `Don't have an account?`
  String get auth_no_account {
    return Intl.message(
      'Don\'t have an account?',
      name: 'auth_no_account',
      desc: '',
      args: [],
    );
  }

  /// `Create account`
  String get auth_create_account {
    return Intl.message(
      'Create account',
      name: 'auth_create_account',
      desc: '',
      args: [],
    );
  }

  /// `Already have an account?`
  String get auth_have_account {
    return Intl.message(
      'Already have an account?',
      name: 'auth_have_account',
      desc: '',
      args: [],
    );
  }

  /// `Browse without an account`
  String get auth_browse_guest {
    return Intl.message(
      'Browse without an account',
      name: 'auth_browse_guest',
      desc: '',
      args: [],
    );
  }

  /// `You can browse requests — sign in to request or fulfill`
  String get auth_guest_hint {
    return Intl.message(
      'You can browse requests — sign in to request or fulfill',
      name: 'auth_guest_hint',
      desc: '',
      args: [],
    );
  }

  /// `Create account`
  String get auth_register_title {
    return Intl.message(
      'Create account',
      name: 'auth_register_title',
      desc: '',
      args: [],
    );
  }

  /// `One account to request and fulfill`
  String get auth_register_subtitle {
    return Intl.message(
      'One account to request and fulfill',
      name: 'auth_register_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Continue`
  String get auth_register_cta {
    return Intl.message(
      'Continue',
      name: 'auth_register_cta',
      desc: '',
      args: [],
    );
  }

  /// `Account ready`
  String get auth_register_success {
    return Intl.message(
      'Account ready',
      name: 'auth_register_success',
      desc: '',
      args: [],
    );
  }

  /// `By continuing you agree to the terms and privacy`
  String get auth_register_terms {
    return Intl.message(
      'By continuing you agree to the terms and privacy',
      name: 'auth_register_terms',
      desc: '',
      args: [],
    );
  }

  /// `Forgot password?`
  String get auth_forget_title {
    return Intl.message(
      'Forgot password?',
      name: 'auth_forget_title',
      desc: '',
      args: [],
    );
  }

  /// `Enter your phone and we'll send a confirmation code`
  String get auth_forget_subtitle {
    return Intl.message(
      'Enter your phone and we\'ll send a confirmation code',
      name: 'auth_forget_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Send code`
  String get auth_forget_cta {
    return Intl.message(
      'Send code',
      name: 'auth_forget_cta',
      desc: '',
      args: [],
    );
  }

  /// `Confirmation code`
  String get auth_otp_title {
    return Intl.message(
      'Confirmation code',
      name: 'auth_otp_title',
      desc: '',
      args: [],
    );
  }

  /// `Enter the code sent to {phone}`
  String auth_otp_subtitle(Object phone) {
    return Intl.message(
      'Enter the code sent to $phone',
      name: 'auth_otp_subtitle',
      desc: '',
      args: [phone],
    );
  }

  /// `For testing: any 6 digits`
  String get auth_otp_hint {
    return Intl.message(
      'For testing: any 6 digits',
      name: 'auth_otp_hint',
      desc: '',
      args: [],
    );
  }

  /// `Confirm`
  String get auth_otp_cta {
    return Intl.message('Confirm', name: 'auth_otp_cta', desc: '', args: []);
  }

  /// `Enter the full confirmation code`
  String get auth_otp_required {
    return Intl.message(
      'Enter the full confirmation code',
      name: 'auth_otp_required',
      desc: '',
      args: [],
    );
  }

  /// `New password`
  String get auth_reset_title {
    return Intl.message(
      'New password',
      name: 'auth_reset_title',
      desc: '',
      args: [],
    );
  }

  /// `Choose a strong password for your account`
  String get auth_reset_subtitle {
    return Intl.message(
      'Choose a strong password for your account',
      name: 'auth_reset_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Save password`
  String get auth_reset_cta {
    return Intl.message(
      'Save password',
      name: 'auth_reset_cta',
      desc: '',
      args: [],
    );
  }

  /// `Password updated`
  String get auth_reset_success {
    return Intl.message(
      'Password updated',
      name: 'auth_reset_success',
      desc: '',
      args: [],
    );
  }

  /// `Sign in with your new password`
  String get auth_reset_success_hint {
    return Intl.message(
      'Sign in with your new password',
      name: 'auth_reset_success_hint',
      desc: '',
      args: [],
    );
  }

  /// `User`
  String get auth_default_name {
    return Intl.message('User', name: 'auth_default_name', desc: '', args: []);
  }

  /// `Sign in to continue`
  String get auth_gate_title {
    return Intl.message(
      'Sign in to continue',
      name: 'auth_gate_title',
      desc: '',
      args: [],
    );
  }

  /// `Requests, offers, and chat need an account`
  String get auth_gate_subtitle {
    return Intl.message(
      'Requests, offers, and chat need an account',
      name: 'auth_gate_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Your account`
  String get auth_guest_account_title {
    return Intl.message(
      'Your account',
      name: 'auth_guest_account_title',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to see your requests and deals`
  String get auth_guest_account_subtitle {
    return Intl.message(
      'Sign in to see your requests and deals',
      name: 'auth_guest_account_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Sign in`
  String get auth_guest_login_cta {
    return Intl.message(
      'Sign in',
      name: 'auth_guest_login_cta',
      desc: '',
      args: [],
    );
  }

  /// `or`
  String get auth_or {
    return Intl.message('or', name: 'auth_or', desc: '', args: []);
  }

  /// `Clearer deals · Trusted chat · Code handover`
  String get auth_trust_line {
    return Intl.message(
      'Clearer deals · Trusted chat · Code handover',
      name: 'auth_trust_line',
      desc: '',
      args: [],
    );
  }

  /// `Code handover`
  String get auth_trust_code {
    return Intl.message(
      'Code handover',
      name: 'auth_trust_code',
      desc: '',
      args: [],
    );
  }

  /// `Protected payment`
  String get auth_trust_payment {
    return Intl.message(
      'Protected payment',
      name: 'auth_trust_payment',
      desc: '',
      args: [],
    );
  }

  /// `Real reviews`
  String get auth_trust_reviews {
    return Intl.message(
      'Real reviews',
      name: 'auth_trust_reviews',
      desc: '',
      args: [],
    );
  }

  /// `Step {current} of {total}`
  String auth_step(Object current, Object total) {
    return Intl.message(
      'Step $current of $total',
      name: 'auth_step',
      desc: '',
      args: [current, total],
    );
  }

  /// `01xxxxxxxxx`
  String get auth_hint_phone {
    return Intl.message(
      '01xxxxxxxxx',
      name: 'auth_hint_phone',
      desc: '',
      args: [],
    );
  }

  /// `First and last name`
  String get auth_hint_name {
    return Intl.message(
      'First and last name',
      name: 'auth_hint_name',
      desc: '',
      args: [],
    );
  }

  /// `••••••••`
  String get auth_hint_password {
    return Intl.message(
      '••••••••',
      name: 'auth_hint_password',
      desc: '',
      args: [],
    );
  }

  /// `8+ characters`
  String get auth_pw_rule_length {
    return Intl.message(
      '8+ characters',
      name: 'auth_pw_rule_length',
      desc: '',
      args: [],
    );
  }

  /// `Upper and lower case (Aa)`
  String get auth_pw_rule_case {
    return Intl.message(
      'Upper and lower case (Aa)',
      name: 'auth_pw_rule_case',
      desc: '',
      args: [],
    );
  }

  /// `A number`
  String get auth_pw_rule_number {
    return Intl.message(
      'A number',
      name: 'auth_pw_rule_number',
      desc: '',
      args: [],
    );
  }

  /// `A symbol like ! @ #`
  String get auth_pw_rule_symbol {
    return Intl.message(
      'A symbol like ! @ #',
      name: 'auth_pw_rule_symbol',
      desc: '',
      args: [],
    );
  }

  /// `Resend code`
  String get auth_otp_resend {
    return Intl.message(
      'Resend code',
      name: 'auth_otp_resend',
      desc: '',
      args: [],
    );
  }

  /// `You can request a new code in {time}`
  String auth_otp_resend_in(Object time) {
    return Intl.message(
      'You can request a new code in $time',
      name: 'auth_otp_resend_in',
      desc: '',
      args: [time],
    );
  }

  /// `We sent you a new code`
  String get auth_otp_resent {
    return Intl.message(
      'We sent you a new code',
      name: 'auth_otp_resent',
      desc: '',
      args: [],
    );
  }

  /// `Tidy it up`
  String get ai_compose_button {
    return Intl.message(
      'Tidy it up',
      name: 'ai_compose_button',
      desc: '',
      args: [],
    );
  }

  /// `Organizing your request…`
  String get ai_compose_loading {
    return Intl.message(
      'Organizing your request…',
      name: 'ai_compose_loading',
      desc: '',
      args: [],
    );
  }

  /// `Type or say your request first`
  String get ai_compose_empty {
    return Intl.message(
      'Type or say your request first',
      name: 'ai_compose_empty',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't find enough details. Fill them in yourself.`
  String get ai_compose_nothing {
    return Intl.message(
      'We couldn\'t find enough details. Fill them in yourself.',
      name: 'ai_compose_nothing',
      desc: '',
      args: [],
    );
  }

  /// `We filled in your request`
  String get ai_compose_applied_title {
    return Intl.message(
      'We filled in your request',
      name: 'ai_compose_applied_title',
      desc: '',
      args: [],
    );
  }

  /// `Check the fields and change anything that's off.`
  String get ai_compose_applied_hint {
    return Intl.message(
      'Check the fields and change anything that\'s off.',
      name: 'ai_compose_applied_hint',
      desc: '',
      args: [],
    );
  }

  /// `We're not sure about every detail. Please check them carefully.`
  String get ai_compose_low_confidence {
    return Intl.message(
      'We\'re not sure about every detail. Please check them carefully.',
      name: 'ai_compose_low_confidence',
      desc: '',
      args: [],
    );
  }

  /// `Title: {title}`
  String ai_compose_title_value(Object title) {
    return Intl.message(
      'Title: $title',
      name: 'ai_compose_title_value',
      desc: '',
      args: [title],
    );
  }

  /// `Undo`
  String get ai_compose_undo {
    return Intl.message('Undo', name: 'ai_compose_undo', desc: '', args: []);
  }

  /// `Speak`
  String get ai_voice_button {
    return Intl.message('Speak', name: 'ai_voice_button', desc: '', args: []);
  }

  /// `Stop`
  String get ai_voice_stop {
    return Intl.message('Stop', name: 'ai_voice_stop', desc: '', args: []);
  }

  /// `Listening… speak naturally`
  String get ai_voice_listening {
    return Intl.message(
      'Listening… speak naturally',
      name: 'ai_voice_listening',
      desc: '',
      args: [],
    );
  }

  /// `The microphone isn't available. Allow microphone access in Settings.`
  String get ai_voice_unavailable {
    return Intl.message(
      'The microphone isn\'t available. Allow microphone access in Settings.',
      name: 'ai_voice_unavailable',
      desc: '',
      args: [],
    );
  }

  /// `Our pick`
  String get ai_best_offer_title {
    return Intl.message(
      'Our pick',
      name: 'ai_best_offer_title',
      desc: '',
      args: [],
    );
  }

  /// `{name}'s offer fits your request best: {reasons}.`
  String ai_best_offer_reason(Object name, Object reasons) {
    return Intl.message(
      '$name\'s offer fits your request best: $reasons.',
      name: 'ai_best_offer_reason',
      desc: '',
      args: [name, reasons],
    );
  }

  /// `{name}'s offer fits your request best.`
  String ai_best_offer_no_reason(Object name) {
    return Intl.message(
      '$name\'s offer fits your request best.',
      name: 'ai_best_offer_no_reason',
      desc: '',
      args: [name],
    );
  }

  /// `View offer`
  String get ai_best_offer_view {
    return Intl.message(
      'View offer',
      name: 'ai_best_offer_view',
      desc: '',
      args: [],
    );
  }

  /// `, `
  String get ai_list_separator {
    return Intl.message(', ', name: 'ai_list_separator', desc: '', args: []);
  }

  /// `Typical price for similar requests nearby: {min}–{max} {currency}`
  String ai_price_range(Object min, Object max, Object currency) {
    return Intl.message(
      'Typical price for similar requests nearby: $min–$max $currency',
      name: 'ai_price_range',
      desc: '',
      args: [min, max, currency],
    );
  }

  /// `Based on {count} accepted offers`
  String ai_price_based_on(Object count) {
    return Intl.message(
      'Based on $count accepted offers',
      name: 'ai_price_based_on',
      desc: '',
      args: [count],
    );
  }

  /// `Suggested price: {min}–{max} {currency}`
  String ai_price_suggest(Object min, Object max, Object currency) {
    return Intl.message(
      'Suggested price: $min–$max $currency',
      name: 'ai_price_suggest',
      desc: '',
      args: [min, max, currency],
    );
  }

  /// `Use {price}`
  String ai_price_apply(Object price) {
    return Intl.message(
      'Use $price',
      name: 'ai_price_apply',
      desc: '',
      args: [price],
    );
  }

  /// `Be careful`
  String get ai_safety_title {
    return Intl.message(
      'Be careful',
      name: 'ai_safety_title',
      desc: '',
      args: [],
    );
  }

  /// `Paying outside Dbrha cancels your insurance protection. Pay inside the app.`
  String get ai_safety_off_platform {
    return Intl.message(
      'Paying outside Dbrha cancels your insurance protection. Pay inside the app.',
      name: 'ai_safety_off_platform',
      desc: '',
      args: [],
    );
  }

  /// `Don't pay a deposit or in advance before you receive the item and confirm with the code.`
  String get ai_safety_advance {
    return Intl.message(
      'Don\'t pay a deposit or in advance before you receive the item and confirm with the code.',
      name: 'ai_safety_advance',
      desc: '',
      args: [],
    );
  }

  /// `This message may come across as abusive. Edit it before sending?`
  String get ai_safety_abuse {
    return Intl.message(
      'This message may come across as abusive. Edit it before sending?',
      name: 'ai_safety_abuse',
      desc: '',
      args: [],
    );
  }

  /// `Edit message`
  String get ai_safety_edit {
    return Intl.message(
      'Edit message',
      name: 'ai_safety_edit',
      desc: '',
      args: [],
    );
  }

  /// `Send anyway`
  String get ai_safety_send_anyway {
    return Intl.message(
      'Send anyway',
      name: 'ai_safety_send_anyway',
      desc: '',
      args: [],
    );
  }

  /// `The other person asked to pay outside the app. Pay inside Dbrha to keep your money protected.`
  String get ai_safety_peer_banner {
    return Intl.message(
      'The other person asked to pay outside the app. Pay inside Dbrha to keep your money protected.',
      name: 'ai_safety_peer_banner',
      desc: '',
      args: [],
    );
  }

  /// `OK`
  String get ai_safety_dismiss {
    return Intl.message('OK', name: 'ai_safety_dismiss', desc: '', args: []);
  }

  /// `What people say`
  String get ai_review_summary_title {
    return Intl.message(
      'What people say',
      name: 'ai_review_summary_title',
      desc: '',
      args: [],
    );
  }

  /// `Summary of {count} reviews`
  String ai_review_summary_based_on(Object count) {
    return Intl.message(
      'Summary of $count reviews',
      name: 'ai_review_summary_based_on',
      desc: '',
      args: [count],
    );
  }

  /// `AI`
  String get ai_badge {
    return Intl.message('AI', name: 'ai_badge', desc: '', args: []);
  }

  /// `Try smart search`
  String get ai_search_try_title {
    return Intl.message(
      'Try smart search',
      name: 'ai_search_try_title',
      desc: '',
      args: [],
    );
  }

  /// `Anyone need chairs for a wedding?`
  String get ai_search_example_1 {
    return Intl.message(
      'Anyone need chairs for a wedding?',
      name: 'ai_search_example_1',
      desc: '',
      args: [],
    );
  }

  /// `Electronics requests near me`
  String get ai_search_example_2 {
    return Intl.message(
      'Electronics requests near me',
      name: 'ai_search_example_2',
      desc: '',
      args: [],
    );
  }

  /// `Winter clothes`
  String get ai_search_example_3 {
    return Intl.message(
      'Winter clothes',
      name: 'ai_search_example_3',
      desc: '',
      args: [],
    );
  }

  /// `Showing results for`
  String get ai_search_understood {
    return Intl.message(
      'Showing results for',
      name: 'ai_search_understood',
      desc: '',
      args: [],
    );
  }

  /// `Understanding your search…`
  String get ai_search_loading {
    return Intl.message(
      'Understanding your search…',
      name: 'ai_search_loading',
      desc: '',
      args: [],
    );
  }

  /// `Clear`
  String get ai_search_clear {
    return Intl.message('Clear', name: 'ai_search_clear', desc: '', args: []);
  }

  /// `Say what you need`
  String get ai_home_title {
    return Intl.message(
      'Say what you need',
      name: 'ai_home_title',
      desc: '',
      args: [],
    );
  }

  /// `Tap the mic and talk. We'll fill in the request.`
  String get ai_home_subtitle {
    return Intl.message(
      'Tap the mic and talk. We\'ll fill in the request.',
      name: 'ai_home_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Or try`
  String get ai_home_or_try {
    return Intl.message('Or try', name: 'ai_home_or_try', desc: '', args: []);
  }

  /// `20 chairs for a wedding on Thursday`
  String get ai_home_example_1 {
    return Intl.message(
      '20 chairs for a wedding on Thursday',
      name: 'ai_home_example_1',
      desc: '',
      args: [],
    );
  }

  /// `A light laptop for work for a week`
  String get ai_home_example_2 {
    return Intl.message(
      'A light laptop for work for a week',
      name: 'ai_home_example_2',
      desc: '',
      args: [],
    );
  }

  /// `An evening dress, size M, tomorrow`
  String get ai_home_example_3 {
    return Intl.message(
      'An evening dress, size M, tomorrow',
      name: 'ai_home_example_3',
      desc: '',
      args: [],
    );
  }

  /// `Discover`
  String get home_nav_discover {
    return Intl.message(
      'Discover',
      name: 'home_nav_discover',
      desc: '',
      args: [],
    );
  }

  /// `Plan`
  String get home_nav_plan {
    return Intl.message('Plan', name: 'home_nav_plan', desc: '', args: []);
  }

  /// `Trip`
  String get home_nav_trip {
    return Intl.message('Trip', name: 'home_nav_trip', desc: '', args: []);
  }

  /// `Today`
  String get home_nav_today {
    return Intl.message('Today', name: 'home_nav_today', desc: '', args: []);
  }

  /// `DayGi`
  String get home_nav_daygi {
    return Intl.message('DayGi', name: 'home_nav_daygi', desc: '', args: []);
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'ar'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
