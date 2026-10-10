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

  /// `Dahab`
  String get splash_brand {
    return Intl.message('Dahab', name: 'splash_brand', desc: '', args: []);
  }

  /// `Where the desert meets the sea`
  String get splash_tagline {
    return Intl.message(
      'Where the desert meets the sea',
      name: 'splash_tagline',
      desc: '',
      args: [],
    );
  }

  /// `Diving, desert mountains and slow beach days — planned around you.`
  String get splash_subtitle {
    return Intl.message(
      'Diving, desert mountains and slow beach days — planned around you.',
      name: 'splash_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `End-to-end encrypted identity & double-entry ledger`
  String get splash_trust {
    return Intl.message(
      'End-to-end encrypted identity & double-entry ledger',
      name: 'splash_trust',
      desc: '',
      args: [],
    );
  }

  /// `Dahab · Before you book, see it`
  String get splash_eyebrow {
    return Intl.message(
      'Dahab · Before you book, see it',
      name: 'splash_eyebrow',
      desc: '',
      args: [],
    );
  }

  /// `Where the desert meets the sea`
  String get splash_title {
    return Intl.message(
      'Where the desert meets the sea',
      name: 'splash_title',
      desc: '',
      args: [],
    );
  }

  /// `Enter Dahab`
  String get splash_enter {
    return Intl.message(
      'Enter Dahab',
      name: 'splash_enter',
      desc: '',
      args: [],
    );
  }

  /// `Skip`
  String get splash_skip {
    return Intl.message('Skip', name: 'splash_skip', desc: '', args: []);
  }

  /// `Scroll to enter`
  String get splash_scroll {
    return Intl.message(
      'Scroll to enter',
      name: 'splash_scroll',
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

  /// `Privacy & your data`
  String get account_privacy {
    return Intl.message(
      'Privacy & your data',
      name: 'account_privacy',
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

  /// `Your trip stays saved to your account. Sign in again to see it here.`
  String get account_logout_subtitle {
    return Intl.message(
      'Your trip stays saved to your account. Sign in again to see it here.',
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

  /// `Contact us`
  String get account_contact_title {
    return Intl.message(
      'Contact us',
      name: 'account_contact_title',
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

  /// `Welcome Back to Dahab`
  String get auth_login_title {
    return Intl.message(
      'Welcome Back to Dahab',
      name: 'auth_login_title',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to access your itinerary, ledger, and bookings`
  String get auth_login_subtitle {
    return Intl.message(
      'Sign in to access your itinerary, ledger, and bookings',
      name: 'auth_login_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Sign in`
  String get auth_login_cta {
    return Intl.message('Sign in', name: 'auth_login_cta', desc: '', args: []);
  }

  /// `Welcome back`
  String get auth_login_success {
    return Intl.message(
      'Welcome back',
      name: 'auth_login_success',
      desc: '',
      args: [],
    );
  }

  /// `Your plans and bookings are here`
  String get auth_login_success_hint {
    return Intl.message(
      'Your plans and bookings are here',
      name: 'auth_login_success_hint',
      desc: '',
      args: [],
    );
  }

  /// `Don't have an account yet?`
  String get auth_no_account {
    return Intl.message(
      'Don\'t have an account yet?',
      name: 'auth_no_account',
      desc: '',
      args: [],
    );
  }

  /// `Sign up free`
  String get auth_create_account {
    return Intl.message(
      'Sign up free',
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

  /// `Back to Dahab`
  String get auth_browse_guest {
    return Intl.message(
      'Back to Dahab',
      name: 'auth_browse_guest',
      desc: '',
      args: [],
    );
  }

  /// `You can look around — sign in to keep a trip`
  String get auth_guest_hint {
    return Intl.message(
      'You can look around — sign in to keep a trip',
      name: 'auth_guest_hint',
      desc: '',
      args: [],
    );
  }

  /// `Join the Dahab Community`
  String get auth_register_title {
    return Intl.message(
      'Join the Dahab Community',
      name: 'auth_register_title',
      desc: '',
      args: [],
    );
  }

  /// `Save your trip, and confirm bookings when you're ready`
  String get auth_register_subtitle {
    return Intl.message(
      'Save your trip, and confirm bookings when you\'re ready',
      name: 'auth_register_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Create account`
  String get auth_register_cta {
    return Intl.message(
      'Create account',
      name: 'auth_register_cta',
      desc: '',
      args: [],
    );
  }

  /// `Welcome to Dahab`
  String get auth_register_success {
    return Intl.message(
      'Welcome to Dahab',
      name: 'auth_register_success',
      desc: '',
      args: [],
    );
  }

  /// `Accounts are created as Traveler. If you are a partner or supplier, contact the operations team to have portal access enabled.`
  String get auth_register_terms {
    return Intl.message(
      'Accounts are created as Traveler. If you are a partner or supplier, contact the operations team to have portal access enabled.',
      name: 'auth_register_terms',
      desc: '',
      args: [],
    );
  }

  /// `Reset Password`
  String get auth_forget_title {
    return Intl.message(
      'Reset Password',
      name: 'auth_forget_title',
      desc: '',
      args: [],
    );
  }

  /// `Enter your email address and we will send you a reset link`
  String get auth_forget_subtitle {
    return Intl.message(
      'Enter your email address and we will send you a reset link',
      name: 'auth_forget_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Send Reset Link`
  String get auth_forget_cta {
    return Intl.message(
      'Send Reset Link',
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

  /// `Plans, bookings, and your ledger need an account`
  String get auth_gate_subtitle {
    return Intl.message(
      'Plans, bookings, and your ledger need an account',
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

  /// `Sign in to see your trip and bookings`
  String get auth_guest_account_subtitle {
    return Intl.message(
      'Sign in to see your trip and bookings',
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

  /// `or with email`
  String get auth_or {
    return Intl.message('or with email', name: 'auth_or', desc: '', args: []);
  }

  /// `End-to-end encrypted identity & double-entry ledger`
  String get auth_trust_line {
    return Intl.message(
      'End-to-end encrypted identity & double-entry ledger',
      name: 'auth_trust_line',
      desc: '',
      args: [],
    );
  }

  /// `Back to Dahab`
  String get auth_back_home {
    return Intl.message(
      'Back to Dahab',
      name: 'auth_back_home',
      desc: '',
      args: [],
    );
  }

  /// `you@email.com`
  String get auth_hint_email {
    return Intl.message(
      'you@email.com',
      name: 'auth_hint_email',
      desc: '',
      args: [],
    );
  }

  /// `Email or mobile`
  String get auth_identifier {
    return Intl.message(
      'Email or mobile',
      name: 'auth_identifier',
      desc: '',
      args: [],
    );
  }

  /// `you@email.com or 01xxxxxxxxx`
  String get auth_hint_identifier {
    return Intl.message(
      'you@email.com or 01xxxxxxxxx',
      name: 'auth_hint_identifier',
      desc: '',
      args: [],
    );
  }

  /// `Phone, if you want`
  String get auth_hint_phone_optional {
    return Intl.message(
      'Phone, if you want',
      name: 'auth_hint_phone_optional',
      desc: '',
      args: [],
    );
  }

  /// `Dahab's server isn't connected on this build, so sign-in can't complete. You can still look around.`
  String get auth_server_missing {
    return Intl.message(
      'Dahab\'s server isn\'t connected on this build, so sign-in can\'t complete. You can still look around.',
      name: 'auth_server_missing',
      desc: '',
      args: [],
    );
  }

  /// `This phone build can't send the reset email yet. Reset on the website, then sign in here.`
  String get auth_reset_unavailable {
    return Intl.message(
      'This phone build can\'t send the reset email yet. Reset on the website, then sign in here.',
      name: 'auth_reset_unavailable',
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

  /// `e.g., Ahmed Mostafa`
  String get auth_hint_name {
    return Intl.message(
      'e.g., Ahmed Mostafa',
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

  /// `Plan my trip`
  String get discover_hero_cta {
    return Intl.message(
      'Plan my trip',
      name: 'discover_hero_cta',
      desc: '',
      args: [],
    );
  }

  /// `Choose a destination`
  String get discover_switch_label {
    return Intl.message(
      'Choose a destination',
      name: 'discover_switch_label',
      desc: '',
      args: [],
    );
  }

  /// `Right now in {place}`
  String discover_live(Object place) {
    return Intl.message(
      'Right now in $place',
      name: 'discover_live',
      desc: '',
      args: [place],
    );
  }

  /// `Air`
  String get discover_air {
    return Intl.message('Air', name: 'discover_air', desc: '', args: []);
  }

  /// `Water`
  String get discover_water {
    return Intl.message('Water', name: 'discover_water', desc: '', args: []);
  }

  /// `Wind`
  String get discover_wind {
    return Intl.message('Wind', name: 'discover_wind', desc: '', args: []);
  }

  /// `Browse outings`
  String get home_door_browse {
    return Intl.message(
      'Browse outings',
      name: 'home_door_browse',
      desc: '',
      args: [],
    );
  }

  /// `Start a plan`
  String get home_door_plan {
    return Intl.message(
      'Start a plan',
      name: 'home_door_plan',
      desc: '',
      args: [],
    );
  }

  /// `Ask DayGi`
  String get home_door_ask {
    return Intl.message('Ask DayGi', name: 'home_door_ask', desc: '', args: []);
  }

  /// `kn`
  String get unit_knots {
    return Intl.message('kn', name: 'unit_knots', desc: '', args: []);
  }

  /// `N`
  String get compass_n {
    return Intl.message('N', name: 'compass_n', desc: '', args: []);
  }

  /// `NE`
  String get compass_ne {
    return Intl.message('NE', name: 'compass_ne', desc: '', args: []);
  }

  /// `E`
  String get compass_e {
    return Intl.message('E', name: 'compass_e', desc: '', args: []);
  }

  /// `SE`
  String get compass_se {
    return Intl.message('SE', name: 'compass_se', desc: '', args: []);
  }

  /// `S`
  String get compass_s {
    return Intl.message('S', name: 'compass_s', desc: '', args: []);
  }

  /// `SW`
  String get compass_sw {
    return Intl.message('SW', name: 'compass_sw', desc: '', args: []);
  }

  /// `W`
  String get compass_w {
    return Intl.message('W', name: 'compass_w', desc: '', args: []);
  }

  /// `NW`
  String get compass_nw {
    return Intl.message('NW', name: 'compass_nw', desc: '', args: []);
  }

  /// `Sunset`
  String get discover_sunset {
    return Intl.message('Sunset', name: 'discover_sunset', desc: '', args: []);
  }

  /// `{source} · {time}`
  String discover_source(Object source, Object time) {
    return Intl.message(
      '$source · $time',
      name: 'discover_source',
      desc: '',
      args: [source, time],
    );
  }

  /// `How can we help in {place}?`
  String discover_doors_title(Object place) {
    return Intl.message(
      'How can we help in $place?',
      name: 'discover_doors_title',
      desc: '',
      args: [place],
    );
  }

  /// `Worth your time in {place}`
  String discover_picks_title(Object place) {
    return Intl.message(
      'Worth your time in $place',
      name: 'discover_picks_title',
      desc: '',
      args: [place],
    );
  }

  /// `Plan around this`
  String get discover_pick_cta {
    return Intl.message(
      'Plan around this',
      name: 'discover_pick_cta',
      desc: '',
      args: [],
    );
  }

  /// `Not sure where to start?`
  String get discover_prompt_title {
    return Intl.message(
      'Not sure where to start?',
      name: 'discover_prompt_title',
      desc: '',
      args: [],
    );
  }

  /// `Tell us who's coming and what you love. We'll suggest plans and show why each one fits.`
  String get discover_prompt_body {
    return Intl.message(
      'Tell us who\'s coming and what you love. We\'ll suggest plans and show why each one fits.',
      name: 'discover_prompt_body',
      desc: '',
      args: [],
    );
  }

  /// `Start planning`
  String get discover_prompt_cta {
    return Intl.message(
      'Start planning',
      name: 'discover_prompt_cta',
      desc: '',
      args: [],
    );
  }

  /// `{place} is just opening on REHLA: plans first, bookings soon.`
  String discover_early_note(Object place) {
    return Intl.message(
      '$place is just opening on REHLA: plans first, bookings soon.',
      name: 'discover_early_note',
      desc: '',
      args: [place],
    );
  }

  /// `Ask DayGi`
  String get discover_ask_daygi {
    return Intl.message(
      'Ask DayGi',
      name: 'discover_ask_daygi',
      desc: '',
      args: [],
    );
  }

  /// `Explore {place}`
  String discover_hero_explore(Object place) {
    return Intl.message(
      'Explore $place',
      name: 'discover_hero_explore',
      desc: '',
      args: [place],
    );
  }

  /// `Verified direct bookings · Flexible cancellation · Picks from people who live there`
  String get discover_hero_note {
    return Intl.message(
      'Verified direct bookings · Flexible cancellation · Picks from people who live there',
      name: 'discover_hero_note',
      desc: '',
      args: [],
    );
  }

  /// `Ready-made trips in {place}`
  String discover_plans_title(Object place) {
    return Intl.message(
      'Ready-made trips in $place',
      name: 'discover_plans_title',
      desc: '',
      args: [place],
    );
  }

  /// `Compare`
  String get discover_plans_all {
    return Intl.message(
      'Compare',
      name: 'discover_plans_all',
      desc: '',
      args: [],
    );
  }

  /// `{place} in a few frames`
  String discover_stories_title(Object place) {
    return Intl.message(
      '$place in a few frames',
      name: 'discover_stories_title',
      desc: '',
      args: [place],
    );
  }

  /// `Representative photos until our own photography of {place} is in.`
  String discover_stories_note(Object place) {
    return Intl.message(
      'Representative photos until our own photography of $place is in.',
      name: 'discover_stories_note',
      desc: '',
      args: [place],
    );
  }

  /// `This is my trip`
  String get trip_keep {
    return Intl.message(
      'This is my trip',
      name: 'trip_keep',
      desc: '',
      args: [],
    );
  }

  /// `The days`
  String get trip_days_title {
    return Intl.message(
      'The days',
      name: 'trip_days_title',
      desc: '',
      args: [],
    );
  }

  /// `Send to the team`
  String get trip_send {
    return Intl.message(
      'Send to the team',
      name: 'trip_send',
      desc: '',
      args: [],
    );
  }

  /// `Change plan`
  String get trip_change {
    return Intl.message('Change plan', name: 'trip_change', desc: '', args: []);
  }

  /// `Not sent yet`
  String get trip_status_draft {
    return Intl.message(
      'Not sent yet',
      name: 'trip_status_draft',
      desc: '',
      args: [],
    );
  }

  /// `Sent to the team`
  String get trip_status_sent {
    return Intl.message(
      'Sent to the team',
      name: 'trip_status_sent',
      desc: '',
      args: [],
    );
  }

  /// `The team has this plan and will confirm it with local hosts.`
  String get trip_sent_note {
    return Intl.message(
      'The team has this plan and will confirm it with local hosts.',
      name: 'trip_sent_note',
      desc: '',
      args: [],
    );
  }

  /// `Your trip lives here`
  String get trip_empty_title {
    return Intl.message(
      'Your trip lives here',
      name: 'trip_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `Once a plan is confirmed, this tab becomes today: the day, the bookings, and what comes next.`
  String get trip_empty_body {
    return Intl.message(
      'Once a plan is confirmed, this tab becomes today: the day, the bookings, and what comes next.',
      name: 'trip_empty_body',
      desc: '',
      args: [],
    );
  }

  /// `Plan my trip`
  String get trip_empty_cta {
    return Intl.message(
      'Plan my trip',
      name: 'trip_empty_cta',
      desc: '',
      args: [],
    );
  }

  /// `Ask DayGi`
  String get daygi_title {
    return Intl.message('Ask DayGi', name: 'daygi_title', desc: '', args: []);
  }

  /// `Say what you need. We'll start a plan around it, and the details get confirmed with people who live there.`
  String get daygi_body {
    return Intl.message(
      'Say what you need. We\'ll start a plan around it, and the details get confirmed with people who live there.',
      name: 'daygi_body',
      desc: '',
      args: [],
    );
  }

  /// `Somewhere calm after the dive`
  String get daygi_hint {
    return Intl.message(
      'Somewhere calm after the dive',
      name: 'daygi_hint',
      desc: '',
      args: [],
    );
  }

  /// `Plan around this`
  String get daygi_send {
    return Intl.message(
      'Plan around this',
      name: 'daygi_send',
      desc: '',
      args: [],
    );
  }

  /// `Try`
  String get daygi_try {
    return Intl.message('Try', name: 'daygi_try', desc: '', args: []);
  }

  /// `Let's shape your trip`
  String get plan_title {
    return Intl.message(
      'Let\'s shape your trip',
      name: 'plan_title',
      desc: '',
      args: [],
    );
  }

  /// `A few quick questions, then plans that fit you. Change anything, any time.`
  String get plan_subtitle {
    return Intl.message(
      'A few quick questions, then plans that fit you. Change anything, any time.',
      name: 'plan_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Step {n} of {total}`
  String plan_step(Object n, Object total) {
    return Intl.message(
      'Step $n of $total',
      name: 'plan_step',
      desc: '',
      args: [n, total],
    );
  }

  /// `Back`
  String get plan_back {
    return Intl.message('Back', name: 'plan_back', desc: '', args: []);
  }

  /// `Next`
  String get plan_next {
    return Intl.message('Next', name: 'plan_next', desc: '', args: []);
  }

  /// `Show my plans`
  String get plan_showPlans {
    return Intl.message(
      'Show my plans',
      name: 'plan_showPlans',
      desc: '',
      args: [],
    );
  }

  /// `Skip, show me every plan`
  String get plan_skipToAll {
    return Intl.message(
      'Skip, show me every plan',
      name: 'plan_skipToAll',
      desc: '',
      args: [],
    );
  }

  /// `Where are you headed?`
  String get plan_q_destination {
    return Intl.message(
      'Where are you headed?',
      name: 'plan_q_destination',
      desc: '',
      args: [],
    );
  }

  /// `How long are you staying?`
  String get plan_q_when {
    return Intl.message(
      'How long are you staying?',
      name: 'plan_q_when',
      desc: '',
      args: [],
    );
  }

  /// `Nights, roughly. You can change it later.`
  String get plan_q_whenHint {
    return Intl.message(
      'Nights, roughly. You can change it later.',
      name: 'plan_q_whenHint',
      desc: '',
      args: [],
    );
  }

  /// `Not sure yet`
  String get plan_when_flexible {
    return Intl.message(
      'Not sure yet',
      name: 'plan_when_flexible',
      desc: '',
      args: [],
    );
  }

  /// `{n} nights`
  String plan_when_nights(Object n) {
    return Intl.message(
      '$n nights',
      name: 'plan_when_nights',
      desc: '',
      args: [n],
    );
  }

  /// `nights`
  String get plan_when_nightsUnit {
    return Intl.message(
      'nights',
      name: 'plan_when_nightsUnit',
      desc: '',
      args: [],
    );
  }

  /// `/ day`
  String get plan_budget_perDay {
    return Intl.message(
      '/ day',
      name: 'plan_budget_perDay',
      desc: '',
      args: [],
    );
  }

  /// `Who's coming?`
  String get plan_q_party {
    return Intl.message(
      'Who\'s coming?',
      name: 'plan_q_party',
      desc: '',
      args: [],
    );
  }

  /// `Just me`
  String get plan_party_solo {
    return Intl.message('Just me', name: 'plan_party_solo', desc: '', args: []);
  }

  /// `Your pace, your plan`
  String get plan_party_soloSub {
    return Intl.message(
      'Your pace, your plan',
      name: 'plan_party_soloSub',
      desc: '',
      args: [],
    );
  }

  /// `The two of us`
  String get plan_party_couple {
    return Intl.message(
      'The two of us',
      name: 'plan_party_couple',
      desc: '',
      args: [],
    );
  }

  /// `Quiet spots and good sunsets`
  String get plan_party_coupleSub {
    return Intl.message(
      'Quiet spots and good sunsets',
      name: 'plan_party_coupleSub',
      desc: '',
      args: [],
    );
  }

  /// `Friends`
  String get plan_party_friends {
    return Intl.message(
      'Friends',
      name: 'plan_party_friends',
      desc: '',
      args: [],
    );
  }

  /// `More to do, more to share`
  String get plan_party_friendsSub {
    return Intl.message(
      'More to do, more to share',
      name: 'plan_party_friendsSub',
      desc: '',
      args: [],
    );
  }

  /// `Family`
  String get plan_party_family {
    return Intl.message(
      'Family',
      name: 'plan_party_family',
      desc: '',
      args: [],
    );
  }

  /// `Easy days, safe for kids`
  String get plan_party_familySub {
    return Intl.message(
      'Easy days, safe for kids',
      name: 'plan_party_familySub',
      desc: '',
      args: [],
    );
  }

  /// `What do you want to feel?`
  String get plan_q_vibes {
    return Intl.message(
      'What do you want to feel?',
      name: 'plan_q_vibes',
      desc: '',
      args: [],
    );
  }

  /// `Pick as many as you like.`
  String get plan_q_vibesHint {
    return Intl.message(
      'Pick as many as you like.',
      name: 'plan_q_vibesHint',
      desc: '',
      args: [],
    );
  }

  /// `Sea & snorkel`
  String get plan_vibe_sea {
    return Intl.message(
      'Sea & snorkel',
      name: 'plan_vibe_sea',
      desc: '',
      args: [],
    );
  }

  /// `Diving`
  String get plan_vibe_diving {
    return Intl.message('Diving', name: 'plan_vibe_diving', desc: '', args: []);
  }

  /// `Adventure`
  String get plan_vibe_adventure {
    return Intl.message(
      'Adventure',
      name: 'plan_vibe_adventure',
      desc: '',
      args: [],
    );
  }

  /// `Desert`
  String get plan_vibe_desert {
    return Intl.message('Desert', name: 'plan_vibe_desert', desc: '', args: []);
  }

  /// `Healing & rest`
  String get plan_vibe_wellness {
    return Intl.message(
      'Healing & rest',
      name: 'plan_vibe_wellness',
      desc: '',
      args: [],
    );
  }

  /// `History & local life`
  String get plan_vibe_culture {
    return Intl.message(
      'History & local life',
      name: 'plan_vibe_culture',
      desc: '',
      args: [],
    );
  }

  /// `Food`
  String get plan_vibe_food {
    return Intl.message('Food', name: 'plan_vibe_food', desc: '', args: []);
  }

  /// `Unplug`
  String get plan_vibe_unplug {
    return Intl.message('Unplug', name: 'plan_vibe_unplug', desc: '', args: []);
  }

  /// `Stars at night`
  String get plan_vibe_stars {
    return Intl.message(
      'Stars at night',
      name: 'plan_vibe_stars',
      desc: '',
      args: [],
    );
  }

  /// `Hiking & nature`
  String get plan_vibe_nature {
    return Intl.message(
      'Hiking & nature',
      name: 'plan_vibe_nature',
      desc: '',
      args: [],
    );
  }

  /// `What pace suits you?`
  String get plan_q_pace {
    return Intl.message(
      'What pace suits you?',
      name: 'plan_q_pace',
      desc: '',
      args: [],
    );
  }

  /// `Slow`
  String get plan_pace_relaxed {
    return Intl.message('Slow', name: 'plan_pace_relaxed', desc: '', args: []);
  }

  /// `Lots of free time`
  String get plan_pace_relaxedSub {
    return Intl.message(
      'Lots of free time',
      name: 'plan_pace_relaxedSub',
      desc: '',
      args: [],
    );
  }

  /// `Balanced`
  String get plan_pace_balanced {
    return Intl.message(
      'Balanced',
      name: 'plan_pace_balanced',
      desc: '',
      args: [],
    );
  }

  /// `A plan with room to breathe`
  String get plan_pace_balancedSub {
    return Intl.message(
      'A plan with room to breathe',
      name: 'plan_pace_balancedSub',
      desc: '',
      args: [],
    );
  }

  /// `Full`
  String get plan_pace_active {
    return Intl.message('Full', name: 'plan_pace_active', desc: '', args: []);
  }

  /// `Something every day`
  String get plan_pace_activeSub {
    return Intl.message(
      'Something every day',
      name: 'plan_pace_activeSub',
      desc: '',
      args: [],
    );
  }

  /// `Budget per person`
  String get plan_q_budget {
    return Intl.message(
      'Budget per person',
      name: 'plan_q_budget',
      desc: '',
      args: [],
    );
  }

  /// `Easy on the pocket`
  String get plan_budget_budget {
    return Intl.message(
      'Easy on the pocket',
      name: 'plan_budget_budget',
      desc: '',
      args: [],
    );
  }

  /// `Comfortable`
  String get plan_budget_moderate {
    return Intl.message(
      'Comfortable',
      name: 'plan_budget_moderate',
      desc: '',
      args: [],
    );
  }

  /// `Treat yourself`
  String get plan_budget_premium {
    return Intl.message(
      'Treat yourself',
      name: 'plan_budget_premium',
      desc: '',
      args: [],
    );
  }

  /// `Your trip so far`
  String get plan_summary_title {
    return Intl.message(
      'Your trip so far',
      name: 'plan_summary_title',
      desc: '',
      args: [],
    );
  }

  /// `Your answers show up here as you go.`
  String get plan_summary_empty {
    return Intl.message(
      'Your answers show up here as you go.',
      name: 'plan_summary_empty',
      desc: '',
      args: [],
    );
  }

  /// `Shaping your plans`
  String get plan_building {
    return Intl.message(
      'Shaping your plans',
      name: 'plan_building',
      desc: '',
      args: [],
    );
  }

  /// `{count} plans that fit you`
  String plan_results_title(Object count) {
    return Intl.message(
      '$count plans that fit you',
      name: 'plan_results_title',
      desc: '',
      args: [count],
    );
  }

  /// `One plan that fits you`
  String get plan_results_titleOne {
    return Intl.message(
      'One plan that fits you',
      name: 'plan_results_titleOne',
      desc: '',
      args: [],
    );
  }

  /// `Best match · {score}%`
  String plan_results_best(Object score) {
    return Intl.message(
      'Best match · $score%',
      name: 'plan_results_best',
      desc: '',
      args: [score],
    );
  }

  /// `{score}% match`
  String plan_results_match(Object score) {
    return Intl.message(
      '$score% match',
      name: 'plan_results_match',
      desc: '',
      args: [score],
    );
  }

  /// `See all plans`
  String get plan_results_showAll {
    return Intl.message(
      'See all plans',
      name: 'plan_results_showAll',
      desc: '',
      args: [],
    );
  }

  /// `Every plan in {place}`
  String plan_results_allTitle(Object place) {
    return Intl.message(
      'Every plan in $place',
      name: 'plan_results_allTitle',
      desc: '',
      args: [place],
    );
  }

  /// `Back to my matches`
  String get plan_results_showMatches {
    return Intl.message(
      'Back to my matches',
      name: 'plan_results_showMatches',
      desc: '',
      args: [],
    );
  }

  /// `Change my answers`
  String get plan_results_edit {
    return Intl.message(
      'Change my answers',
      name: 'plan_results_edit',
      desc: '',
      args: [],
    );
  }

  /// `Sort plans`
  String get plan_results_sort {
    return Intl.message(
      'Sort plans',
      name: 'plan_results_sort',
      desc: '',
      args: [],
    );
  }

  /// `Best match`
  String get plan_sort_best {
    return Intl.message(
      'Best match',
      name: 'plan_sort_best',
      desc: '',
      args: [],
    );
  }

  /// `Lowest price`
  String get plan_sort_price {
    return Intl.message(
      'Lowest price',
      name: 'plan_sort_price',
      desc: '',
      args: [],
    );
  }

  /// `Shortest`
  String get plan_sort_short {
    return Intl.message(
      'Shortest',
      name: 'plan_sort_short',
      desc: '',
      args: [],
    );
  }

  /// `Calmest`
  String get plan_sort_calm {
    return Intl.message('Calmest', name: 'plan_sort_calm', desc: '', args: []);
  }

  /// `{n} days`
  String plan_card_days(Object n) {
    return Intl.message('$n days', name: 'plan_card_days', desc: '', args: [n]);
  }

  /// `Estimated price`
  String get plan_card_estimate {
    return Intl.message(
      'Estimated price',
      name: 'plan_card_estimate',
      desc: '',
      args: [],
    );
  }

  /// `{n}% free time`
  String plan_card_freeTime(Object n) {
    return Intl.message(
      '$n% free time',
      name: 'plan_card_freeTime',
      desc: '',
      args: [n],
    );
  }

  /// `Pace`
  String get plan_card_pace {
    return Intl.message('Pace', name: 'plan_card_pace', desc: '', args: []);
  }

  /// `See it day by day`
  String get plan_card_viewDays {
    return Intl.message(
      'See it day by day',
      name: 'plan_card_viewDays',
      desc: '',
      args: [],
    );
  }

  /// `Book this plan`
  String get plan_card_book {
    return Intl.message(
      'Book this plan',
      name: 'plan_card_book',
      desc: '',
      args: [],
    );
  }

  /// `Request this plan`
  String get plan_card_request {
    return Intl.message(
      'Request this plan',
      name: 'plan_card_request',
      desc: '',
      args: [],
    );
  }

  /// `Adjust with DayGi`
  String get plan_card_tweak {
    return Intl.message(
      'Adjust with DayGi',
      name: 'plan_card_tweak',
      desc: '',
      args: [],
    );
  }

  /// `What's included`
  String get plan_card_included {
    return Intl.message(
      'What\'s included',
      name: 'plan_card_included',
      desc: '',
      args: [],
    );
  }

  /// `Matches {matched} of {asked} things you want`
  String plan_reason_vibes(Object matched, Object asked) {
    return Intl.message(
      'Matches $matched of $asked things you want',
      name: 'plan_reason_vibes',
      desc: '',
      args: [matched, asked],
    );
  }

  /// `Your pace`
  String get plan_reason_pace {
    return Intl.message(
      'Your pace',
      name: 'plan_reason_pace',
      desc: '',
      args: [],
    );
  }

  /// `Within your budget`
  String get plan_reason_budget {
    return Intl.message(
      'Within your budget',
      name: 'plan_reason_budget',
      desc: '',
      args: [],
    );
  }

  /// `Right length: {days} days`
  String plan_reason_length(Object days) {
    return Intl.message(
      'Right length: $days days',
      name: 'plan_reason_length',
      desc: '',
      args: [days],
    );
  }

  /// `Easy for families`
  String get plan_reason_family {
    return Intl.message(
      'Easy for families',
      name: 'plan_reason_family',
      desc: '',
      args: [],
    );
  }

  /// `Made for two`
  String get plan_reason_couple {
    return Intl.message(
      'Made for two',
      name: 'plan_reason_couple',
      desc: '',
      args: [],
    );
  }

  /// `{place} is new on REHLA. Prices are estimates; request a plan and our team confirms it with local hosts.`
  String plan_early_note(Object place) {
    return Intl.message(
      '$place is new on REHLA. Prices are estimates; request a plan and our team confirms it with local hosts.',
      name: 'plan_early_note',
      desc: '',
      args: [place],
    );
  }

  /// `Request sent. Our team will reply on WhatsApp.`
  String get plan_request_sent {
    return Intl.message(
      'Request sent. Our team will reply on WhatsApp.',
      name: 'plan_request_sent',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't send your request. Check your connection and try again.`
  String get plan_request_failed {
    return Intl.message(
      'We couldn\'t send your request. Check your connection and try again.',
      name: 'plan_request_failed',
      desc: '',
      args: [],
    );
  }

  /// `Sign in so we can send your request`
  String get plan_request_signIn {
    return Intl.message(
      'Sign in so we can send your request',
      name: 'plan_request_signIn',
      desc: '',
      args: [],
    );
  }

  /// `No plans here yet. Try another place or see every plan.`
  String get plan_noMatches {
    return Intl.message(
      'No plans here yet. Try another place or see every plan.',
      name: 'plan_noMatches',
      desc: '',
      args: [],
    );
  }

  /// `What's included`
  String get plan_detail_included {
    return Intl.message(
      'What\'s included',
      name: 'plan_detail_included',
      desc: '',
      args: [],
    );
  }

  /// `Highlights`
  String get plan_detail_highlights {
    return Intl.message(
      'Highlights',
      name: 'plan_detail_highlights',
      desc: '',
      args: [],
    );
  }

  /// `Day by day`
  String get plan_detail_dayByDay {
    return Intl.message(
      'Day by day',
      name: 'plan_detail_dayByDay',
      desc: '',
      args: [],
    );
  }

  /// `Day {n}`
  String plan_detail_day(Object n) {
    return Intl.message('Day $n', name: 'plan_detail_day', desc: '', args: [n]);
  }

  /// `From`
  String get plan_card_from {
    return Intl.message('From', name: 'plan_card_from', desc: '', args: []);
  }

  /// `per person`
  String get plan_card_perPerson {
    return Intl.message(
      'per person',
      name: 'plan_card_perPerson',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't load the plans. Check your connection and try again.`
  String get plan_loadFailed {
    return Intl.message(
      'We couldn\'t load the plans. Check your connection and try again.',
      name: 'plan_loadFailed',
      desc: '',
      args: [],
    );
  }

  /// `Start over`
  String get plan_startOver {
    return Intl.message(
      'Start over',
      name: 'plan_startOver',
      desc: '',
      args: [],
    );
  }

  /// `Good morning`
  String get home_hello_morning {
    return Intl.message(
      'Good morning',
      name: 'home_hello_morning',
      desc: '',
      args: [],
    );
  }

  /// `Good afternoon`
  String get home_hello_afternoon {
    return Intl.message(
      'Good afternoon',
      name: 'home_hello_afternoon',
      desc: '',
      args: [],
    );
  }

  /// `Good evening`
  String get home_hello_evening {
    return Intl.message(
      'Good evening',
      name: 'home_hello_evening',
      desc: '',
      args: [],
    );
  }

  /// `{hello}, {name}`
  String home_hello_name(Object hello, Object name) {
    return Intl.message(
      '$hello, $name',
      name: 'home_hello_name',
      desc: '',
      args: [hello, name],
    );
  }

  /// `{n, plural, =1{1 day to your trip} other{{n} days to your trip}}`
  String home_days_to_trip(num n) {
    return Intl.plural(
      n,
      one: '1 day to your trip',
      other: '$n days to your trip',
      name: 'home_days_to_trip',
      desc: '',
      args: [n],
    );
  }

  /// `Day {day} of your trip`
  String home_trip_day(Object day) {
    return Intl.message(
      'Day $day of your trip',
      name: 'home_trip_day',
      desc: '',
      args: [day],
    );
  }

  /// `Ask DayGi — type or talk`
  String get home_ask_hint {
    return Intl.message(
      'Ask DayGi — type or talk',
      name: 'home_ask_hint',
      desc: '',
      args: [],
    );
  }

  /// `Live from {source} · updated {time}`
  String home_live_from(Object source, Object time) {
    return Intl.message(
      'Live from $source · updated $time',
      name: 'home_live_from',
      desc: '',
      args: [source, time],
    );
  }

  /// `Today in {place}`
  String home_today_in(Object place) {
    return Intl.message(
      'Today in $place',
      name: 'home_today_in',
      desc: '',
      args: [place],
    );
  }

  /// `See all`
  String get home_see_all {
    return Intl.message('See all', name: 'home_see_all', desc: '', args: []);
  }

  /// `Back`
  String get home_back {
    return Intl.message('Back', name: 'home_back', desc: '', args: []);
  }

  /// `Press back again to exit`
  String get home_exit_hint {
    return Intl.message(
      'Press back again to exit',
      name: 'home_exit_hint',
      desc: '',
      args: [],
    );
  }

  /// `Wind is {wind} kn today; the operator runs this below {max} kn`
  String xp_fit_wind_high(Object wind, Object max) {
    return Intl.message(
      'Wind is $wind kn today; the operator runs this below $max kn',
      name: 'xp_fit_wind_high',
      desc: '',
      args: [wind, max],
    );
  }

  /// `Wind is {wind} kn, inside the operator's limit`
  String xp_fit_wind_ok(Object wind) {
    return Intl.message(
      'Wind is $wind kn, inside the operator\'s limit',
      name: 'xp_fit_wind_ok',
      desc: '',
      args: [wind],
    );
  }

  /// `Sunset today is at {clock}`
  String xp_fit_sunset(Object clock) {
    return Intl.message(
      'Sunset today is at $clock',
      name: 'xp_fit_sunset',
      desc: '',
      args: [clock],
    );
  }

  /// `Good for a first time`
  String get xp_fit_first_time {
    return Intl.message(
      'Good for a first time',
      name: 'xp_fit_first_time',
      desc: '',
      args: [],
    );
  }

  /// `Morning departure, when the water is calmest`
  String get xp_fit_morning {
    return Intl.message(
      'Morning departure, when the water is calmest',
      name: 'xp_fit_morning',
      desc: '',
      args: [],
    );
  }

  /// `For you:`
  String get xp_for_you {
    return Intl.message('For you:', name: 'xp_for_you', desc: '', args: []);
  }

  /// `{m} min`
  String xp_minutes(Object m) {
    return Intl.message('$m min', name: 'xp_minutes', desc: '', args: [m]);
  }

  /// `1 hour`
  String get xp_hour_one {
    return Intl.message('1 hour', name: 'xp_hour_one', desc: '', args: []);
  }

  /// `1.5 hours`
  String get xp_hour_half {
    return Intl.message('1.5 hours', name: 'xp_hour_half', desc: '', args: []);
  }

  /// `2 hours`
  String get xp_hour_two {
    return Intl.message('2 hours', name: 'xp_hour_two', desc: '', args: []);
  }

  /// `{h} hours`
  String xp_hours(Object h) {
    return Intl.message('$h hours', name: 'xp_hours', desc: '', args: [h]);
  }

  /// `Free cancellation up to {hours} h before`
  String xp_free_cancel_hours(Object hours) {
    return Intl.message(
      'Free cancellation up to $hours h before',
      name: 'xp_free_cancel_hours',
      desc: '',
      args: [hours],
    );
  }

  /// `Free cancellation`
  String get xp_free_cancel {
    return Intl.message(
      'Free cancellation',
      name: 'xp_free_cancel',
      desc: '',
      args: [],
    );
  }

  /// `pp`
  String get xp_per_person {
    return Intl.message('pp', name: 'xp_per_person', desc: '', args: []);
  }

  /// `per person`
  String get xp_per_person_long {
    return Intl.message(
      'per person',
      name: 'xp_per_person_long',
      desc: '',
      args: [],
    );
  }

  /// `about ${usd}`
  String xp_about_usd(Object usd) {
    return Intl.message(
      'about \$$usd',
      name: 'xp_about_usd',
      desc: '',
      args: [usd],
    );
  }

  /// `Pay on arrival`
  String get xp_pay_on_arrival {
    return Intl.message(
      'Pay on arrival',
      name: 'xp_pay_on_arrival',
      desc: '',
      args: [],
    );
  }

  /// `No reviews yet`
  String get xp_reviews_none {
    return Intl.message(
      'No reviews yet',
      name: 'xp_reviews_none',
      desc: '',
      args: [],
    );
  }

  /// `Reviews appear here only from guests who actually went. We don't show made-up ratings.`
  String get xp_reviews_none_hint {
    return Intl.message(
      'Reviews appear here only from guests who actually went. We don\'t show made-up ratings.',
      name: 'xp_reviews_none_hint',
      desc: '',
      args: [],
    );
  }

  /// `What guests say`
  String get xp_reviews_title {
    return Intl.message(
      'What guests say',
      name: 'xp_reviews_title',
      desc: '',
      args: [],
    );
  }

  /// `{count, plural, =1{From 1 verified review} other{From {count} verified reviews}}`
  String xp_reviews_from(num count) {
    return Intl.plural(
      count,
      one: 'From 1 verified review',
      other: 'From $count verified reviews',
      name: 'xp_reviews_from',
      desc: '',
      args: [count],
    );
  }

  /// ` · latest {date}`
  String xp_reviews_latest(Object date) {
    return Intl.message(
      ' · latest $date',
      name: 'xp_reviews_latest',
      desc: '',
      args: [date],
    );
  }

  /// `Operator on REHLA`
  String get xp_operator_on {
    return Intl.message(
      'Operator on REHLA',
      name: 'xp_operator_on',
      desc: '',
      args: [],
    );
  }

  /// `{n, plural, =1{reliability from 1 trip} other{reliability from {n} trips}}`
  String xp_reliability_basis(num n) {
    return Intl.plural(
      n,
      one: 'reliability from 1 trip',
      other: 'reliability from $n trips',
      name: 'xp_reliability_basis',
      desc: '',
      args: [n],
    );
  }

  /// `new here, no track record yet`
  String get xp_reliability_new {
    return Intl.message(
      'new here, no track record yet',
      name: 'xp_reliability_new',
      desc: '',
      args: [],
    );
  }

  /// `reliable`
  String get xp_reliability {
    return Intl.message('reliable', name: 'xp_reliability', desc: '', args: []);
  }

  /// `What's included`
  String get xp_included {
    return Intl.message(
      'What\'s included',
      name: 'xp_included',
      desc: '',
      args: [],
    );
  }

  /// `Before you go`
  String get xp_before {
    return Intl.message('Before you go', name: 'xp_before', desc: '', args: []);
  }

  /// `Duration`
  String get xp_fact_duration {
    return Intl.message(
      'Duration',
      name: 'xp_fact_duration',
      desc: '',
      args: [],
    );
  }

  /// `Meeting point`
  String get xp_fact_meet {
    return Intl.message(
      'Meeting point',
      name: 'xp_fact_meet',
      desc: '',
      args: [],
    );
  }

  /// `Group`
  String get xp_fact_group {
    return Intl.message('Group', name: 'xp_fact_group', desc: '', args: []);
  }

  /// `Up to {n}`
  String xp_up_to(Object n) {
    return Intl.message('Up to $n', name: 'xp_up_to', desc: '', args: [n]);
  }

  /// `Level`
  String get xp_fact_level {
    return Intl.message('Level', name: 'xp_fact_level', desc: '', args: []);
  }

  /// `Beginner`
  String get xp_level_beginner {
    return Intl.message(
      'Beginner',
      name: 'xp_level_beginner',
      desc: '',
      args: [],
    );
  }

  /// `Intermediate`
  String get xp_level_intermediate {
    return Intl.message(
      'Intermediate',
      name: 'xp_level_intermediate',
      desc: '',
      args: [],
    );
  }

  /// `Advanced`
  String get xp_level_advanced {
    return Intl.message(
      'Advanced',
      name: 'xp_level_advanced',
      desc: '',
      args: [],
    );
  }

  /// `All levels`
  String get xp_level_all {
    return Intl.message('All levels', name: 'xp_level_all', desc: '', args: []);
  }

  /// `Choose a time`
  String get xp_book {
    return Intl.message('Choose a time', name: 'xp_book', desc: '', args: []);
  }

  /// `Ask DayGi about this`
  String get xp_ask_daygi {
    return Intl.message(
      'Ask DayGi about this',
      name: 'xp_ask_daygi',
      desc: '',
      args: [],
    );
  }

  /// `Is {title} a good fit for me?`
  String xp_ask_daygi_q(Object title) {
    return Intl.message(
      'Is $title a good fit for me?',
      name: 'xp_ask_daygi_q',
      desc: '',
      args: [title],
    );
  }

  /// `Choose your time`
  String get book_title {
    return Intl.message(
      'Choose your time',
      name: 'book_title',
      desc: '',
      args: [],
    );
  }

  /// `Date`
  String get book_date {
    return Intl.message('Date', name: 'book_date', desc: '', args: []);
  }

  /// `Guests`
  String get book_guests {
    return Intl.message('Guests', name: 'book_guests', desc: '', args: []);
  }

  /// `Departure`
  String get book_time {
    return Intl.message('Departure', name: 'book_time', desc: '', args: []);
  }

  /// `Checking live availability…`
  String get book_slots_loading {
    return Intl.message(
      'Checking live availability…',
      name: 'book_slots_loading',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't check availability.`
  String get book_slots_error {
    return Intl.message(
      'We couldn\'t check availability.',
      name: 'book_slots_error',
      desc: '',
      args: [],
    );
  }

  /// `Try again`
  String get book_retry {
    return Intl.message('Try again', name: 'book_retry', desc: '', args: []);
  }

  /// `No departures on this day. Try another date.`
  String get book_slots_none {
    return Intl.message(
      'No departures on this day. Try another date.',
      name: 'book_slots_none',
      desc: '',
      args: [],
    );
  }

  /// `{n} left`
  String book_left(Object n) {
    return Intl.message('$n left', name: 'book_left', desc: '', args: [n]);
  }

  /// `Full`
  String get book_sold_out {
    return Intl.message('Full', name: 'book_sold_out', desc: '', args: []);
  }

  /// `Gone`
  String get book_departed {
    return Intl.message('Gone', name: 'book_departed', desc: '', args: []);
  }

  /// `Mobile number for the operator`
  String get book_phone {
    return Intl.message(
      'Mobile number for the operator',
      name: 'book_phone',
      desc: '',
      args: [],
    );
  }

  /// `Add a mobile number so the operator can reach you.`
  String get book_phone_missing {
    return Intl.message(
      'Add a mobile number so the operator can reach you.',
      name: 'book_phone_missing',
      desc: '',
      args: [],
    );
  }

  /// `Total`
  String get book_total {
    return Intl.message('Total', name: 'book_total', desc: '', args: []);
  }

  /// `Hold this time`
  String get book_continue {
    return Intl.message(
      'Hold this time',
      name: 'book_continue',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to book`
  String get book_sign_in {
    return Intl.message(
      'Sign in to book',
      name: 'book_sign_in',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't hold this time. Try another departure.`
  String get book_failed {
    return Intl.message(
      'We couldn\'t hold this time. Try another departure.',
      name: 'book_failed',
      desc: '',
      args: [],
    );
  }

  /// `We hold your places for 15 minutes while you confirm. Nothing is charged.`
  String get book_hold_note {
    return Intl.message(
      'We hold your places for 15 minutes while you confirm. Nothing is charged.',
      name: 'book_hold_note',
      desc: '',
      args: [],
    );
  }

  /// `Today`
  String get book_today {
    return Intl.message('Today', name: 'book_today', desc: '', args: []);
  }

  /// `Tomorrow`
  String get book_tomorrow {
    return Intl.message('Tomorrow', name: 'book_tomorrow', desc: '', args: []);
  }

  /// `Review and confirm`
  String get pay_title {
    return Intl.message(
      'Review and confirm',
      name: 'pay_title',
      desc: '',
      args: [],
    );
  }

  /// `Held for you`
  String get pay_held {
    return Intl.message('Held for you', name: 'pay_held', desc: '', args: []);
  }

  /// `The hold ran out, so the places went back on sale. Pick a time again.`
  String get pay_expired {
    return Intl.message(
      'The hold ran out, so the places went back on sale. Pick a time again.',
      name: 'pay_expired',
      desc: '',
      args: [],
    );
  }

  /// `Pick a time again`
  String get pay_pick_again {
    return Intl.message(
      'Pick a time again',
      name: 'pay_pick_again',
      desc: '',
      args: [],
    );
  }

  /// `{n, plural, =1{1 guest} other{{n} guests}}`
  String pay_guests(num n) {
    return Intl.plural(
      n,
      one: '1 guest',
      other: '$n guests',
      name: 'pay_guests',
      desc: '',
      args: [n],
    );
  }

  /// `Total`
  String get pay_total {
    return Intl.message('Total', name: 'pay_total', desc: '', args: []);
  }

  /// `about ${usd} · charged in EGP`
  String pay_currency_note(Object usd) {
    return Intl.message(
      'about \$$usd · charged in EGP',
      name: 'pay_currency_note',
      desc: '',
      args: [usd],
    );
  }

  /// `Charged in EGP`
  String get pay_currency_note_egp {
    return Intl.message(
      'Charged in EGP',
      name: 'pay_currency_note_egp',
      desc: '',
      args: [],
    );
  }

  /// `Free cancellation until {when}`
  String pay_cancel_until(Object when) {
    return Intl.message(
      'Free cancellation until $when',
      name: 'pay_cancel_until',
      desc: '',
      args: [when],
    );
  }

  /// `How you pay`
  String get pay_method {
    return Intl.message('How you pay', name: 'pay_method', desc: '', args: []);
  }

  /// `Pay on arrival`
  String get pay_cash {
    return Intl.message('Pay on arrival', name: 'pay_cash', desc: '', args: []);
  }

  /// `Pay {supplier} in cash on the day. Nothing is charged now.`
  String pay_cash_hint(Object supplier) {
    return Intl.message(
      'Pay $supplier in cash on the day. Nothing is charged now.',
      name: 'pay_cash_hint',
      desc: '',
      args: [supplier],
    );
  }

  /// `Confirm booking`
  String get pay_confirm {
    return Intl.message(
      'Confirm booking',
      name: 'pay_confirm',
      desc: '',
      args: [],
    );
  }

  /// `The operator's price is now {amount}. Check the total and confirm again.`
  String pay_price_changed(Object amount) {
    return Intl.message(
      'The operator\'s price is now $amount. Check the total and confirm again.',
      name: 'pay_price_changed',
      desc: '',
      args: [amount],
    );
  }

  /// `Booked`
  String get pay_done_title {
    return Intl.message('Booked', name: 'pay_done_title', desc: '', args: []);
  }

  /// `Booked · ref {ref}`
  String pay_state_booked(Object ref) {
    return Intl.message(
      'Booked · ref $ref',
      name: 'pay_state_booked',
      desc: '',
      args: [ref],
    );
  }

  /// `Payment: on arrival, nothing charged yet`
  String get pay_state_payment {
    return Intl.message(
      'Payment: on arrival, nothing charged yet',
      name: 'pay_state_payment',
      desc: '',
      args: [],
    );
  }

  /// `Waiting for {supplier} to confirm`
  String pay_state_waiting(Object supplier) {
    return Intl.message(
      'Waiting for $supplier to confirm',
      name: 'pay_state_waiting',
      desc: '',
      args: [supplier],
    );
  }

  /// `Booked and operator-confirmed are separate steps. We'll show it in your trip the moment the operator confirms.`
  String get pay_state_note {
    return Intl.message(
      'Booked and operator-confirmed are separate steps. We\'ll show it in your trip the moment the operator confirms.',
      name: 'pay_state_note',
      desc: '',
      args: [],
    );
  }

  /// `Open my trip`
  String get pay_open_trip {
    return Intl.message(
      'Open my trip',
      name: 'pay_open_trip',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't confirm the booking. Your hold is still on; try again.`
  String get pay_failed {
    return Intl.message(
      'We couldn\'t confirm the booking. Your hold is still on; try again.',
      name: 'pay_failed',
      desc: '',
      args: [],
    );
  }

  /// `BLUE HOLE`
  String get map_blue_hole {
    return Intl.message('BLUE HOLE', name: 'map_blue_hole', desc: '', args: []);
  }

  /// `EEL GARDEN`
  String get map_eel_garden {
    return Intl.message(
      'EEL GARDEN',
      name: 'map_eel_garden',
      desc: '',
      args: [],
    );
  }

  /// `LIGHTHOUSE`
  String get map_lighthouse {
    return Intl.message(
      'LIGHTHOUSE',
      name: 'map_lighthouse',
      desc: '',
      args: [],
    );
  }

  /// `MASBAT`
  String get map_masbat {
    return Intl.message('MASBAT', name: 'map_masbat', desc: '', args: []);
  }

  /// `LAGOON`
  String get map_lagoon {
    return Intl.message('LAGOON', name: 'map_lagoon', desc: '', args: []);
  }

  /// `ASALA`
  String get map_asala {
    return Intl.message('ASALA', name: 'map_asala', desc: '', args: []);
  }

  /// `ABU GALUM`
  String get map_abu_galum {
    return Intl.message('ABU GALUM', name: 'map_abu_galum', desc: '', args: []);
  }

  /// `THREE POOLS`
  String get map_three_pools {
    return Intl.message(
      'THREE POOLS',
      name: 'map_three_pools',
      desc: '',
      args: [],
    );
  }

  /// `CANYON`
  String get map_canyon {
    return Intl.message('CANYON', name: 'map_canyon', desc: '', args: []);
  }

  /// `GULF OF AQABA`
  String get map_gulf {
    return Intl.message('GULF OF AQABA', name: 'map_gulf', desc: '', args: []);
  }

  /// `Dives, food, somewhere quiet…`
  String get map_search_hint {
    return Intl.message(
      'Dives, food, somewhere quiet…',
      name: 'map_search_hint',
      desc: '',
      args: [],
    );
  }

  /// `{n, plural, =0{Nothing open today} =1{1 experience open today} other{{n} experiences open today}}`
  String map_open_today(num n) {
    return Intl.plural(
      n,
      zero: 'Nothing open today',
      one: '1 experience open today',
      other: '$n experiences open today',
      name: 'map_open_today',
      desc: '',
      args: [n],
    );
  }

  /// `{n, plural, =0{Nothing open on {day}} =1{1 experience open on {day}} other{{n} experiences open on {day}}}`
  String map_open_on(num n, Object day) {
    return Intl.plural(
      n,
      zero: 'Nothing open on $day',
      one: '1 experience open on $day',
      other: '$n experiences open on $day',
      name: 'map_open_on',
      desc: '',
      args: [n, day],
    );
  }

  /// `All`
  String get map_kind_all {
    return Intl.message('All', name: 'map_kind_all', desc: '', args: []);
  }

  /// `Sea`
  String get map_kind_sea {
    return Intl.message('Sea', name: 'map_kind_sea', desc: '', args: []);
  }

  /// `Desert`
  String get map_kind_desert {
    return Intl.message('Desert', name: 'map_kind_desert', desc: '', args: []);
  }

  /// `Bedouin & culture`
  String get map_kind_culture {
    return Intl.message(
      'Bedouin & culture',
      name: 'map_kind_culture',
      desc: '',
      args: [],
    );
  }

  /// `Nothing matches. Try another day or clear the search.`
  String get map_empty {
    return Intl.message(
      'Nothing matches. Try another day or clear the search.',
      name: 'map_empty',
      desc: '',
      args: [],
    );
  }

  /// `Loading what's open…`
  String get map_loading {
    return Intl.message(
      'Loading what\'s open…',
      name: 'map_loading',
      desc: '',
      args: [],
    );
  }

  /// `We couldn't load experiences. Pull to try again.`
  String get map_failed {
    return Intl.message(
      'We couldn\'t load experiences. Pull to try again.',
      name: 'map_failed',
      desc: '',
      args: [],
    );
  }

  /// `Offline: showing the last prices saved on this phone`
  String get map_offline {
    return Intl.message(
      'Offline: showing the last prices saved on this phone',
      name: 'map_offline',
      desc: '',
      args: [],
    );
  }

  /// `Knows Dahab well`
  String get dg_subtitle {
    return Intl.message(
      'Knows Dahab well',
      name: 'dg_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `{n, plural, =1{1 day} other{{n} days}}`
  String dg_days(num n) {
    return Intl.plural(
      n,
      one: '1 day',
      other: '$n days',
      name: 'dg_days',
      desc: '',
      args: [n],
    );
  }

  /// `How many days`
  String get dg_days_pick {
    return Intl.message(
      'How many days',
      name: 'dg_days_pick',
      desc: '',
      args: [],
    );
  }

  /// `Ahlan! Tell me what you want your days to feel like. I answer with real outings you can book, and build your plan underneath.`
  String get dg_greeting {
    return Intl.message(
      'Ahlan! Tell me what you want your days to feel like. I answer with real outings you can book, and build your plan underneath.',
      name: 'dg_greeting',
      desc: '',
      args: [],
    );
  }

  /// `3 quiet days for two: snorkelling and a good sunset`
  String get dg_try_1 {
    return Intl.message(
      '3 quiet days for two: snorkelling and a good sunset',
      name: 'dg_try_1',
      desc: '',
      args: [],
    );
  }

  /// `My first dive, nothing scary`
  String get dg_try_2 {
    return Intl.message(
      'My first dive, nothing scary',
      name: 'dg_try_2',
      desc: '',
      args: [],
    );
  }

  /// `A desert day with a Bedouin dinner`
  String get dg_try_3 {
    return Intl.message(
      'A desert day with a Bedouin dinner',
      name: 'dg_try_3',
      desc: '',
      args: [],
    );
  }

  /// `Type or talk…`
  String get dg_hint {
    return Intl.message('Type or talk…', name: 'dg_hint', desc: '', args: []);
  }

  /// `Talk to DayGi`
  String get dg_voice {
    return Intl.message('Talk to DayGi', name: 'dg_voice', desc: '', args: []);
  }

  /// `Voice input isn't available on this device.`
  String get dg_voice_unavailable {
    return Intl.message(
      'Voice input isn\'t available on this device.',
      name: 'dg_voice_unavailable',
      desc: '',
      args: [],
    );
  }

  /// `Send`
  String get dg_send {
    return Intl.message('Send', name: 'dg_send', desc: '', args: []);
  }

  /// `{n, plural, =1{Here's 1 bookable outing that fits.} other{Here are {n} bookable outings that fit.}}`
  String dg_local_reply(num n) {
    return Intl.plural(
      n,
      one: 'Here\'s 1 bookable outing that fits.',
      other: 'Here are $n bookable outings that fit.',
      name: 'dg_local_reply',
      desc: '',
      args: [n],
    );
  }

  /// `Nothing bookable matches that yet. Try a kind of outing, a place, or a budget.`
  String get dg_local_none {
    return Intl.message(
      'Nothing bookable matches that yet. Try a kind of outing, a place, or a budget.',
      name: 'dg_local_none',
      desc: '',
      args: [],
    );
  }

  /// `Sign in and DayGi can also plan around your booked trip.`
  String get dg_sign_in_note {
    return Intl.message(
      'Sign in and DayGi can also plan around your booked trip.',
      name: 'dg_sign_in_note',
      desc: '',
      args: [],
    );
  }

  /// `Prices straight from operators · wind from {source}`
  String dg_sources(Object source) {
    return Intl.message(
      'Prices straight from operators · wind from $source',
      name: 'dg_sources',
      desc: '',
      args: [source],
    );
  }

  /// `Prices straight from operators`
  String get dg_sources_prices {
    return Intl.message(
      'Prices straight from operators',
      name: 'dg_sources_prices',
      desc: '',
      args: [],
    );
  }

  /// `Add to day {day}`
  String dg_add_to_day(Object day) {
    return Intl.message(
      'Add to day $day',
      name: 'dg_add_to_day',
      desc: '',
      args: [day],
    );
  }

  /// `In your plan`
  String get dg_added {
    return Intl.message('In your plan', name: 'dg_added', desc: '', args: []);
  }

  /// `Your plan · Day {day}`
  String dg_plan_day(Object day) {
    return Intl.message(
      'Your plan · Day $day',
      name: 'dg_plan_day',
      desc: '',
      args: [day],
    );
  }

  /// `Day {n}`
  String dg_day_n(Object n) {
    return Intl.message('Day $n', name: 'dg_day_n', desc: '', args: [n]);
  }

  /// `Nothing on this day yet. Tap "Add to day" on any card above.`
  String get dg_plan_empty {
    return Intl.message(
      'Nothing on this day yet. Tap "Add to day" on any card above.',
      name: 'dg_plan_empty',
      desc: '',
      args: [],
    );
  }

  /// `Empty`
  String get dg_plan_empty_short {
    return Intl.message(
      'Empty',
      name: 'dg_plan_empty_short',
      desc: '',
      args: [],
    );
  }

  /// `Why:`
  String get dg_why {
    return Intl.message('Why:', name: 'dg_why', desc: '', args: []);
  }

  /// `Swap`
  String get dg_swap {
    return Intl.message('Swap', name: 'dg_swap', desc: '', args: []);
  }

  /// `Remove`
  String get dg_remove {
    return Intl.message('Remove', name: 'dg_remove', desc: '', args: []);
  }

  /// `Your trip`
  String get trip_title {
    return Intl.message('Your trip', name: 'trip_title', desc: '', args: []);
  }

  /// `{n, plural, =1{1 day to go} other{{n} days to go}}`
  String trip_days_to_go(num n) {
    return Intl.plural(
      n,
      one: '1 day to go',
      other: '$n days to go',
      name: 'trip_days_to_go',
      desc: '',
      args: [n],
    );
  }

  /// `Today`
  String get today_title {
    return Intl.message('Today', name: 'today_title', desc: '', args: []);
  }

  /// `Day {day} of {days}`
  String today_day_of(Object day, Object days) {
    return Intl.message(
      'Day $day of $days',
      name: 'today_day_of',
      desc: '',
      args: [day, days],
    );
  }

  /// `wind {kn} kn`
  String today_wind(Object kn) {
    return Intl.message(
      'wind $kn kn',
      name: 'today_wind',
      desc: '',
      args: [kn],
    );
  }

  /// `Showing the last copy saved on this phone`
  String get today_offline {
    return Intl.message(
      'Showing the last copy saved on this phone',
      name: 'today_offline',
      desc: '',
      args: [],
    );
  }

  /// `Next`
  String get today_next {
    return Intl.message('Next', name: 'today_next', desc: '', args: []);
  }

  /// `Under way`
  String get today_under_way {
    return Intl.message(
      'Under way',
      name: 'today_under_way',
      desc: '',
      args: [],
    );
  }

  /// `in {m} min`
  String today_in_m(Object m) {
    return Intl.message('in $m min', name: 'today_in_m', desc: '', args: [m]);
  }

  /// `in {h} h {m} min`
  String today_in_hm(Object h, Object m) {
    return Intl.message(
      'in $h h $m min',
      name: 'today_in_hm',
      desc: '',
      args: [h, m],
    );
  }

  /// `Driver`
  String get today_driver {
    return Intl.message('Driver', name: 'today_driver', desc: '', args: []);
  }

  /// `Guide`
  String get today_guide {
    return Intl.message('Guide', name: 'today_guide', desc: '', args: []);
  }

  /// `Operator`
  String get today_operator {
    return Intl.message('Operator', name: 'today_operator', desc: '', args: []);
  }

  /// `The operator will share who's coming before the day.`
  String get today_no_person {
    return Intl.message(
      'The operator will share who\'s coming before the day.',
      name: 'today_no_person',
      desc: '',
      args: [],
    );
  }

  /// `Call {name}`
  String today_call(Object name) {
    return Intl.message(
      'Call $name',
      name: 'today_call',
      desc: '',
      args: [name],
    );
  }

  /// `Waiting for the operator to confirm`
  String get today_waiting_operator {
    return Intl.message(
      'Waiting for the operator to confirm',
      name: 'today_waiting_operator',
      desc: '',
      args: [],
    );
  }

  /// `Confirmed`
  String get today_step_confirmed {
    return Intl.message(
      'Confirmed',
      name: 'today_step_confirmed',
      desc: '',
      args: [],
    );
  }

  /// `Driver`
  String get today_step_driver {
    return Intl.message(
      'Driver',
      name: 'today_step_driver',
      desc: '',
      args: [],
    );
  }

  /// `On the way`
  String get today_step_way {
    return Intl.message(
      'On the way',
      name: 'today_step_way',
      desc: '',
      args: [],
    );
  }

  /// `Arrived`
  String get today_step_arrived {
    return Intl.message(
      'Arrived',
      name: 'today_step_arrived',
      desc: '',
      args: [],
    );
  }

  /// `Voucher`
  String get today_voucher {
    return Intl.message('Voucher', name: 'today_voucher', desc: '', args: []);
  }

  /// `Works offline`
  String get today_voucher_offline {
    return Intl.message(
      'Works offline',
      name: 'today_voucher_offline',
      desc: '',
      args: [],
    );
  }

  /// `Show this to the operator. It works without signal.`
  String get today_voucher_hint {
    return Intl.message(
      'Show this to the operator. It works without signal.',
      name: 'today_voucher_hint',
      desc: '',
      args: [],
    );
  }

  /// `Your booking reference. The operator's code appears once they confirm.`
  String get today_voucher_ref_hint {
    return Intl.message(
      'Your booking reference. The operator\'s code appears once they confirm.',
      name: 'today_voucher_ref_hint',
      desc: '',
      args: [],
    );
  }

  /// `Paid`
  String get today_paid {
    return Intl.message('Paid', name: 'today_paid', desc: '', args: []);
  }

  /// `Operator confirmed`
  String get today_confirmed {
    return Intl.message(
      'Operator confirmed',
      name: 'today_confirmed',
      desc: '',
      args: [],
    );
  }

  /// `Waiting for operator`
  String get today_pending {
    return Intl.message(
      'Waiting for operator',
      name: 'today_pending',
      desc: '',
      args: [],
    );
  }

  /// `Later`
  String get today_later {
    return Intl.message('Later', name: 'today_later', desc: '', args: []);
  }

  /// `Done`
  String get today_done {
    return Intl.message('Done', name: 'today_done', desc: '', args: []);
  }

  /// `Nothing booked yet`
  String get today_none_title {
    return Intl.message(
      'Nothing booked yet',
      name: 'today_none_title',
      desc: '',
      args: [],
    );
  }

  /// `Your trip is set. Book outings and they show up here with times, pickup and vouchers.`
  String get today_none_body {
    return Intl.message(
      'Your trip is set. Book outings and they show up here with times, pickup and vouchers.',
      name: 'today_none_body',
      desc: '',
      args: [],
    );
  }

  /// `Find something to book`
  String get today_none_action {
    return Intl.message(
      'Find something to book',
      name: 'today_none_action',
      desc: '',
      args: [],
    );
  }

  /// `Wind is {wind} kn now. {title} runs below {max} kn.`
  String today_wind_alert(Object wind, Object title, Object max) {
    return Intl.message(
      'Wind is $wind kn now. $title runs below $max kn.',
      name: 'today_wind_alert',
      desc: '',
      args: [wind, title, max],
    );
  }

  /// `First departure the operator runs: {slot} on {day}.`
  String today_wind_offer(Object slot, Object day) {
    return Intl.message(
      'First departure the operator runs: $slot on $day.',
      name: 'today_wind_offer',
      desc: '',
      args: [slot, day],
    );
  }

  /// `Move it`
  String get today_move_it {
    return Intl.message('Move it', name: 'today_move_it', desc: '', args: []);
  }

  /// `Moved to {slot}. The operator has the new time.`
  String today_moved(Object slot) {
    return Intl.message(
      'Moved to $slot. The operator has the new time.',
      name: 'today_moved',
      desc: '',
      args: [slot],
    );
  }

  /// `We couldn't move it. Try again or ask the operator.`
  String get today_move_failed {
    return Intl.message(
      'We couldn\'t move it. Try again or ask the operator.',
      name: 'today_move_failed',
      desc: '',
      args: [],
    );
  }

  /// `Something else`
  String get today_wind_other {
    return Intl.message(
      'Something else',
      name: 'today_wind_other',
      desc: '',
      args: [],
    );
  }

  /// `It's windy. What can I do instead of {title}?`
  String today_wind_ask(Object title) {
    return Intl.message(
      'It\'s windy. What can I do instead of $title?',
      name: 'today_wind_ask',
      desc: '',
      args: [title],
    );
  }

  /// `Emergency`
  String get today_emergency {
    return Intl.message(
      'Emergency',
      name: 'today_emergency',
      desc: '',
      args: [],
    );
  }

  /// `Dive emergency · hyperbaric chamber`
  String get today_em_hyperbaric {
    return Intl.message(
      'Dive emergency · hyperbaric chamber',
      name: 'today_em_hyperbaric',
      desc: '',
      args: [],
    );
  }

  /// `Dahab hospital ER`
  String get today_em_hospital {
    return Intl.message(
      'Dahab hospital ER',
      name: 'today_em_hospital',
      desc: '',
      args: [],
    );
  }

  /// `Tourist police`
  String get today_em_police {
    return Intl.message(
      'Tourist police',
      name: 'today_em_police',
      desc: '',
      args: [],
    );
  }

  /// `REHLA`
  String get splash_wordmark {
    return Intl.message('REHLA', name: 'splash_wordmark', desc: '', args: []);
  }

  /// `Dahab, Nuweiba & Siwa — planned around you`
  String get splash_line {
    return Intl.message(
      'Dahab, Nuweiba & Siwa — planned around you',
      name: 'splash_line',
      desc: '',
      args: [],
    );
  }

  /// `Next`
  String get onboard_next {
    return Intl.message('Next', name: 'onboard_next', desc: '', args: []);
  }

  /// `Start exploring`
  String get onboard_start {
    return Intl.message(
      'Start exploring',
      name: 'onboard_start',
      desc: '',
      args: [],
    );
  }

  /// `{current} of {total}`
  String onboard_progress(Object current, Object total) {
    return Intl.message(
      '$current of $total',
      name: 'onboard_progress',
      desc: '',
      args: [current, total],
    );
  }

  /// `Dahab · South Sinai`
  String get onboard_1_eyebrow {
    return Intl.message(
      'Dahab · South Sinai',
      name: 'onboard_1_eyebrow',
      desc: '',
      args: [],
    );
  }

  /// `Meet Dahab the way locals do`
  String get onboard_1_title {
    return Intl.message(
      'Meet Dahab the way locals do',
      name: 'onboard_1_title',
      desc: '',
      args: [],
    );
  }

  /// `Reefs, canyons and slow beach days — every outing checked against today's wind and sea.`
  String get onboard_1_body {
    return Intl.message(
      'Reefs, canyons and slow beach days — every outing checked against today\'s wind and sea.',
      name: 'onboard_1_body',
      desc: '',
      args: [],
    );
  }

  /// `DayGi · your guide`
  String get onboard_2_eyebrow {
    return Intl.message(
      'DayGi · your guide',
      name: 'onboard_2_eyebrow',
      desc: '',
      args: [],
    );
  }

  /// `Ask DayGi, like a friend who lives here`
  String get onboard_2_title {
    return Intl.message(
      'Ask DayGi, like a friend who lives here',
      name: 'onboard_2_title',
      desc: '',
      args: [],
    );
  }

  /// `Say what you're in the mood for. DayGi suggests real outings you can book and builds your plan day by day.`
  String get onboard_2_body {
    return Intl.message(
      'Say what you\'re in the mood for. DayGi suggests real outings you can book and builds your plan day by day.',
      name: 'onboard_2_body',
      desc: '',
      args: [],
    );
  }

  /// `On the day`
  String get onboard_3_eyebrow {
    return Intl.message(
      'On the day',
      name: 'onboard_3_eyebrow',
      desc: '',
      args: [],
    );
  }

  /// `Your day, quietly in your pocket`
  String get onboard_3_title {
    return Intl.message(
      'Your day, quietly in your pocket',
      name: 'onboard_3_title',
      desc: '',
      args: [],
    );
  }

  /// `Pickup time, your driver, the voucher offline and emergency numbers — all in Today.`
  String get onboard_3_body {
    return Intl.message(
      'Pickup time, your driver, the voucher offline and emergency numbers — all in Today.',
      name: 'onboard_3_body',
      desc: '',
      args: [],
    );
  }

  /// `Language & display`
  String get prefs_title {
    return Intl.message(
      'Language & display',
      name: 'prefs_title',
      desc: '',
      args: [],
    );
  }

  /// `Language`
  String get prefs_language {
    return Intl.message('Language', name: 'prefs_language', desc: '', args: []);
  }

  /// `Appearance`
  String get prefs_appearance {
    return Intl.message(
      'Appearance',
      name: 'prefs_appearance',
      desc: '',
      args: [],
    );
  }

  /// `Done`
  String get prefs_done {
    return Intl.message('Done', name: 'prefs_done', desc: '', args: []);
  }

  /// `Language and display, {language}`
  String prefs_button_label(Object language) {
    return Intl.message(
      'Language and display, $language',
      name: 'prefs_button_label',
      desc: '',
      args: [language],
    );
  }

  /// `Welcome to REHLA`
  String get account_guest_title {
    return Intl.message(
      'Welcome to REHLA',
      name: 'account_guest_title',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to keep your trip, bookings and vouchers in one place. You can explore without an account.`
  String get account_guest_body {
    return Intl.message(
      'Sign in to keep your trip, bookings and vouchers in one place. You can explore without an account.',
      name: 'account_guest_body',
      desc: '',
      args: [],
    );
  }

  /// `Plan & ask`
  String get account_section_trip {
    return Intl.message(
      'Plan & ask',
      name: 'account_section_trip',
      desc: '',
      args: [],
    );
  }

  /// `Ask DayGi`
  String get account_ask_daygi {
    return Intl.message(
      'Ask DayGi',
      name: 'account_ask_daygi',
      desc: '',
      args: [],
    );
  }

  /// `Your local guide, any question`
  String get account_ask_daygi_hint {
    return Intl.message(
      'Your local guide, any question',
      name: 'account_ask_daygi_hint',
      desc: '',
      args: [],
    );
  }

  /// `My trip`
  String get account_my_trip {
    return Intl.message('My trip', name: 'account_my_trip', desc: '', args: []);
  }

  /// `Bookings, vouchers and Today`
  String get account_my_trip_hint {
    return Intl.message(
      'Bookings, vouchers and Today',
      name: 'account_my_trip_hint',
      desc: '',
      args: [],
    );
  }

  /// `Help & safety`
  String get account_section_help {
    return Intl.message(
      'Help & safety',
      name: 'account_section_help',
      desc: '',
      args: [],
    );
  }

  /// `Emergency numbers`
  String get account_emergency {
    return Intl.message(
      'Emergency numbers',
      name: 'account_emergency',
      desc: '',
      args: [],
    );
  }

  /// `Hyperbaric chamber, hospital, tourist police`
  String get account_emergency_hint {
    return Intl.message(
      'Hyperbaric chamber, hospital, tourist police',
      name: 'account_emergency_hint',
      desc: '',
      args: [],
    );
  }

  /// `Contact us`
  String get account_contact {
    return Intl.message(
      'Contact us',
      name: 'account_contact',
      desc: '',
      args: [],
    );
  }

  /// `Phone, WhatsApp and email`
  String get account_contact_hint {
    return Intl.message(
      'Phone, WhatsApp and email',
      name: 'account_contact_hint',
      desc: '',
      args: [],
    );
  }

  /// `FAQ`
  String get account_faq {
    return Intl.message('FAQ', name: 'account_faq', desc: '', args: []);
  }

  /// `Travel guides`
  String get account_guides {
    return Intl.message(
      'Travel guides',
      name: 'account_guides',
      desc: '',
      args: [],
    );
  }

  /// `About REHLA`
  String get account_about {
    return Intl.message(
      'About REHLA',
      name: 'account_about',
      desc: '',
      args: [],
    );
  }

  /// `Couldn't load this page. Check your connection and try again.`
  String get info_load_failed {
    return Intl.message(
      'Couldn\'t load this page. Check your connection and try again.',
      name: 'info_load_failed',
      desc: '',
      args: [],
    );
  }

  /// `Nothing here yet.`
  String get info_empty {
    return Intl.message(
      'Nothing here yet.',
      name: 'info_empty',
      desc: '',
      args: [],
    );
  }

  /// `Our team answers during working hours. For anything urgent on a trip, use Emergency numbers.`
  String get contact_intro {
    return Intl.message(
      'Our team answers during working hours. For anything urgent on a trip, use Emergency numbers.',
      name: 'contact_intro',
      desc: '',
      args: [],
    );
  }

  /// `Call`
  String get contact_call {
    return Intl.message('Call', name: 'contact_call', desc: '', args: []);
  }

  /// `WhatsApp`
  String get contact_whatsapp {
    return Intl.message(
      'WhatsApp',
      name: 'contact_whatsapp',
      desc: '',
      args: [],
    );
  }

  /// `Email`
  String get contact_email {
    return Intl.message('Email', name: 'contact_email', desc: '', args: []);
  }

  /// `Address`
  String get contact_address {
    return Intl.message('Address', name: 'contact_address', desc: '', args: []);
  }

  /// `Working hours`
  String get contact_hours {
    return Intl.message(
      'Working hours',
      name: 'contact_hours',
      desc: '',
      args: [],
    );
  }

  /// `Weekdays`
  String get contact_weekdays {
    return Intl.message(
      'Weekdays',
      name: 'contact_weekdays',
      desc: '',
      args: [],
    );
  }

  /// `Weekend`
  String get contact_weekend {
    return Intl.message('Weekend', name: 'contact_weekend', desc: '', args: []);
  }

  /// `Holidays`
  String get contact_holidays {
    return Intl.message(
      'Holidays',
      name: 'contact_holidays',
      desc: '',
      args: [],
    );
  }

  /// `Follow us`
  String get contact_follow {
    return Intl.message(
      'Follow us',
      name: 'contact_follow',
      desc: '',
      args: [],
    );
  }

  /// `Our contact details aren't published yet. DayGi can answer most questions right now.`
  String get contact_unset {
    return Intl.message(
      'Our contact details aren\'t published yet. DayGi can answer most questions right now.',
      name: 'contact_unset',
      desc: '',
      args: [],
    );
  }

  /// `Tap a number to call. In a diving emergency, call the hyperbaric chamber first.`
  String get emergency_intro {
    return Intl.message(
      'Tap a number to call. In a diving emergency, call the hyperbaric chamber first.',
      name: 'emergency_intro',
      desc: '',
      args: [],
    );
  }

  /// `Offline — showing the numbers saved in the app.`
  String get emergency_saved {
    return Intl.message(
      'Offline — showing the numbers saved in the app.',
      name: 'emergency_saved',
      desc: '',
      args: [],
    );
  }

  /// `These terms cover using REHLA to discover, plan and book outings. By booking, you agree to them.`
  String get terms_intro {
    return Intl.message(
      'These terms cover using REHLA to discover, plan and book outings. By booking, you agree to them.',
      name: 'terms_intro',
      desc: '',
      args: [],
    );
  }

  /// `Who runs your outing`
  String get terms_1_title {
    return Intl.message(
      'Who runs your outing',
      name: 'terms_1_title',
      desc: '',
      args: [],
    );
  }

  /// `REHLA lists outings run by independent local operators. The operator named on each outing runs it and is responsible for it on the day.`
  String get terms_1_body {
    return Intl.message(
      'REHLA lists outings run by independent local operators. The operator named on each outing runs it and is responsible for it on the day.',
      name: 'terms_1_body',
      desc: '',
      args: [],
    );
  }

  /// `Holds, payment and confirmation`
  String get terms_2_title {
    return Intl.message(
      'Holds, payment and confirmation',
      name: 'terms_2_title',
      desc: '',
      args: [],
    );
  }

  /// `When you book, we hold your place for a short time while you pay. Paid isn't the same as confirmed: the operator confirms your booking, and you'll see its status change in Trip.`
  String get terms_2_body {
    return Intl.message(
      'When you book, we hold your place for a short time while you pay. Paid isn\'t the same as confirmed: the operator confirms your booking, and you\'ll see its status change in Trip.',
      name: 'terms_2_body',
      desc: '',
      args: [],
    );
  }

  /// `Prices`
  String get terms_3_title {
    return Intl.message('Prices', name: 'terms_3_title', desc: '', args: []);
  }

  /// `Prices are in Egyptian pounds and cover what each outing lists as included. Anything not listed isn't included.`
  String get terms_3_body {
    return Intl.message(
      'Prices are in Egyptian pounds and cover what each outing lists as included. Anything not listed isn\'t included.',
      name: 'terms_3_body',
      desc: '',
      args: [],
    );
  }

  /// `Cancellations and refunds`
  String get terms_4_title {
    return Intl.message(
      'Cancellations and refunds',
      name: 'terms_4_title',
      desc: '',
      args: [],
    );
  }

  /// `Each outing shows its cancellation terms before you pay, such as free cancellation up to 24 hours before. Refunds follow those terms and go back to your original payment method.`
  String get terms_4_body {
    return Intl.message(
      'Each outing shows its cancellation terms before you pay, such as free cancellation up to 24 hours before. Refunds follow those terms and go back to your original payment method.',
      name: 'terms_4_body',
      desc: '',
      args: [],
    );
  }

  /// `Wind, sea and safety`
  String get terms_5_title {
    return Intl.message(
      'Wind, sea and safety',
      name: 'terms_5_title',
      desc: '',
      args: [],
    );
  }

  /// `Sea and desert outings depend on conditions. If conditions make an outing unsafe, the operator may move or cancel it. Follow your guide's instructions, and bring any certification an outing asks for.`
  String get terms_5_body {
    return Intl.message(
      'Sea and desert outings depend on conditions. If conditions make an outing unsafe, the operator may move or cancel it. Follow your guide\'s instructions, and bring any certification an outing asks for.',
      name: 'terms_5_body',
      desc: '',
      args: [],
    );
  }

  /// `DayGi suggestions`
  String get terms_6_title {
    return Intl.message(
      'DayGi suggestions',
      name: 'terms_6_title',
      desc: '',
      args: [],
    );
  }

  /// `DayGi is an AI guide. Its suggestions are a starting point — check times, prices and conditions on the outing before you book.`
  String get terms_6_body {
    return Intl.message(
      'DayGi is an AI guide. Its suggestions are a starting point — check times, prices and conditions on the outing before you book.',
      name: 'terms_6_body',
      desc: '',
      args: [],
    );
  }

  /// `Your account`
  String get terms_7_title {
    return Intl.message(
      'Your account',
      name: 'terms_7_title',
      desc: '',
      args: [],
    );
  }

  /// `Keep your sign-in details private. You're responsible for bookings made from your account.`
  String get terms_7_body {
    return Intl.message(
      'Keep your sign-in details private. You\'re responsible for bookings made from your account.',
      name: 'terms_7_body',
      desc: '',
      args: [],
    );
  }

  /// `We collect only what we need to plan and run your trip.`
  String get privacy_intro {
    return Intl.message(
      'We collect only what we need to plan and run your trip.',
      name: 'privacy_intro',
      desc: '',
      args: [],
    );
  }

  /// `What we keep`
  String get privacy_1_title {
    return Intl.message(
      'What we keep',
      name: 'privacy_1_title',
      desc: '',
      args: [],
    );
  }

  /// `Your name, email or phone, your trips and bookings, and the messages you send to DayGi or our team.`
  String get privacy_1_body {
    return Intl.message(
      'Your name, email or phone, your trips and bookings, and the messages you send to DayGi or our team.',
      name: 'privacy_1_body',
      desc: '',
      args: [],
    );
  }

  /// `Who sees it`
  String get privacy_2_title {
    return Intl.message(
      'Who sees it',
      name: 'privacy_2_title',
      desc: '',
      args: [],
    );
  }

  /// `The operator of an outing you book sees your name, phone and booking details so they can meet you. We don't sell your data.`
  String get privacy_2_body {
    return Intl.message(
      'The operator of an outing you book sees your name, phone and booking details so they can meet you. We don\'t sell your data.',
      name: 'privacy_2_body',
      desc: '',
      args: [],
    );
  }

  /// `On this phone`
  String get privacy_3_title {
    return Intl.message(
      'On this phone',
      name: 'privacy_3_title',
      desc: '',
      args: [],
    );
  }

  /// `Your sign-in session, language and appearance are stored on this device. Your latest trip is saved here too, so your voucher opens without a connection.`
  String get privacy_3_body {
    return Intl.message(
      'Your sign-in session, language and appearance are stored on this device. Your latest trip is saved here too, so your voucher opens without a connection.',
      name: 'privacy_3_body',
      desc: '',
      args: [],
    );
  }

  /// `Location`
  String get privacy_4_title {
    return Intl.message(
      'Location',
      name: 'privacy_4_title',
      desc: '',
      args: [],
    );
  }

  /// `The app doesn't track your location. Maps show places, not you.`
  String get privacy_4_body {
    return Intl.message(
      'The app doesn\'t track your location. Maps show places, not you.',
      name: 'privacy_4_body',
      desc: '',
      args: [],
    );
  }

  /// `Diagnostics`
  String get privacy_5_title {
    return Intl.message(
      'Diagnostics',
      name: 'privacy_5_title',
      desc: '',
      args: [],
    );
  }

  /// `We use Firebase to count app usage and report crashes so we can fix problems. These reports don't include your messages or payment details.`
  String get privacy_5_body {
    return Intl.message(
      'We use Firebase to count app usage and report crashes so we can fix problems. These reports don\'t include your messages or payment details.',
      name: 'privacy_5_body',
      desc: '',
      args: [],
    );
  }

  /// `Payments`
  String get privacy_6_title {
    return Intl.message(
      'Payments',
      name: 'privacy_6_title',
      desc: '',
      args: [],
    );
  }

  /// `Card payments are handled by our payment provider. We never see or store your full card number.`
  String get privacy_6_body {
    return Intl.message(
      'Card payments are handled by our payment provider. We never see or store your full card number.',
      name: 'privacy_6_body',
      desc: '',
      args: [],
    );
  }

  /// `Your choices`
  String get privacy_7_title {
    return Intl.message(
      'Your choices',
      name: 'privacy_7_title',
      desc: '',
      args: [],
    );
  }

  /// `You can edit your profile any time. To delete your account and data, reach us from Contact us.`
  String get privacy_7_body {
    return Intl.message(
      'You can edit your profile any time. To delete your account and data, reach us from Contact us.',
      name: 'privacy_7_body',
      desc: '',
      args: [],
    );
  }

  /// `See all`
  String get home_doors_see_all {
    return Intl.message(
      'See all',
      name: 'home_doors_see_all',
      desc: '',
      args: [],
    );
  }

  /// `Find an outing`
  String get search_title {
    return Intl.message(
      'Find an outing',
      name: 'search_title',
      desc: '',
      args: [],
    );
  }

  /// `Filters`
  String get search_filters {
    return Intl.message('Filters', name: 'search_filters', desc: '', args: []);
  }

  /// `Filters · {count}`
  String search_filters_count(Object count) {
    return Intl.message(
      'Filters · $count',
      name: 'search_filters_count',
      desc: '',
      args: [count],
    );
  }

  /// `When`
  String get search_when {
    return Intl.message('When', name: 'search_when', desc: '', args: []);
  }

  /// `Any day`
  String get search_any_day {
    return Intl.message('Any day', name: 'search_any_day', desc: '', args: []);
  }

  /// `Price`
  String get search_price {
    return Intl.message('Price', name: 'search_price', desc: '', args: []);
  }

  /// `Up to {price}`
  String search_price_up_to(Object price) {
    return Intl.message(
      'Up to $price',
      name: 'search_price_up_to',
      desc: '',
      args: [price],
    );
  }

  /// `Any price`
  String get search_any_price {
    return Intl.message(
      'Any price',
      name: 'search_any_price',
      desc: '',
      args: [],
    );
  }

  /// `Duration`
  String get search_duration {
    return Intl.message(
      'Duration',
      name: 'search_duration',
      desc: '',
      args: [],
    );
  }

  /// `Any length`
  String get search_dur_any {
    return Intl.message(
      'Any length',
      name: 'search_dur_any',
      desc: '',
      args: [],
    );
  }

  /// `Under 3 h`
  String get search_dur_short {
    return Intl.message(
      'Under 3 h',
      name: 'search_dur_short',
      desc: '',
      args: [],
    );
  }

  /// `3–6 h`
  String get search_dur_half {
    return Intl.message('3–6 h', name: 'search_dur_half', desc: '', args: []);
  }

  /// `Full day`
  String get search_dur_full {
    return Intl.message(
      'Full day',
      name: 'search_dur_full',
      desc: '',
      args: [],
    );
  }

  /// `Good for first-timers`
  String get search_beginner {
    return Intl.message(
      'Good for first-timers',
      name: 'search_beginner',
      desc: '',
      args: [],
    );
  }

  /// `Fits today's wind`
  String get search_wind_ok {
    return Intl.message(
      'Fits today\'s wind',
      name: 'search_wind_ok',
      desc: '',
      args: [],
    );
  }

  /// `Sort by`
  String get search_sort {
    return Intl.message('Sort by', name: 'search_sort', desc: '', args: []);
  }

  /// `Best fit`
  String get search_sort_best {
    return Intl.message(
      'Best fit',
      name: 'search_sort_best',
      desc: '',
      args: [],
    );
  }

  /// `Lowest price`
  String get search_sort_price_low {
    return Intl.message(
      'Lowest price',
      name: 'search_sort_price_low',
      desc: '',
      args: [],
    );
  }

  /// `Highest price`
  String get search_sort_price_high {
    return Intl.message(
      'Highest price',
      name: 'search_sort_price_high',
      desc: '',
      args: [],
    );
  }

  /// `Shortest`
  String get search_sort_short {
    return Intl.message(
      'Shortest',
      name: 'search_sort_short',
      desc: '',
      args: [],
    );
  }

  /// `Reset`
  String get search_reset {
    return Intl.message('Reset', name: 'search_reset', desc: '', args: []);
  }

  /// `Show {count} outings`
  String search_show_results(Object count) {
    return Intl.message(
      'Show $count outings',
      name: 'search_show_results',
      desc: '',
      args: [count],
    );
  }

  /// `{count} outings`
  String search_results(Object count) {
    return Intl.message(
      '$count outings',
      name: 'search_results',
      desc: '',
      args: [count],
    );
  }

  /// `No outings match`
  String get search_empty_title {
    return Intl.message(
      'No outings match',
      name: 'search_empty_title',
      desc: '',
      args: [],
    );
  }

  /// `Try another day or fewer filters.`
  String get search_empty_body {
    return Intl.message(
      'Try another day or fewer filters.',
      name: 'search_empty_body',
      desc: '',
      args: [],
    );
  }

  /// `Clear filters`
  String get search_clear {
    return Intl.message(
      'Clear filters',
      name: 'search_clear',
      desc: '',
      args: [],
    );
  }

  /// `Ask DayGi about “{query}”`
  String search_ask_daygi(Object query) {
    return Intl.message(
      'Ask DayGi about “$query”',
      name: 'search_ask_daygi',
      desc: '',
      args: [query],
    );
  }

  /// `DayGi can help with`
  String get search_services {
    return Intl.message(
      'DayGi can help with',
      name: 'search_services',
      desc: '',
      args: [],
    );
  }

  /// `Save plan`
  String get plan_save {
    return Intl.message('Save plan', name: 'plan_save', desc: '', args: []);
  }

  /// `Saved`
  String get plan_saved {
    return Intl.message('Saved', name: 'plan_saved', desc: '', args: []);
  }

  /// `Saved to your plans`
  String get plans_saved_toast {
    return Intl.message(
      'Saved to your plans',
      name: 'plans_saved_toast',
      desc: '',
      args: [],
    );
  }

  /// `See plans`
  String get plans_see {
    return Intl.message('See plans', name: 'plans_see', desc: '', args: []);
  }

  /// `Your plans`
  String get plans_title {
    return Intl.message('Your plans', name: 'plans_title', desc: '', args: []);
  }

  /// `Kept on this phone. Compare them, then send the one you like and the team confirms it with local hosts.`
  String get plans_subtitle {
    return Intl.message(
      'Kept on this phone. Compare them, then send the one you like and the team confirms it with local hosts.',
      name: 'plans_subtitle',
      desc: '',
      args: [],
    );
  }

  /// `Your plans ({n})`
  String plans_count(Object n) {
    return Intl.message(
      'Your plans ($n)',
      name: 'plans_count',
      desc: '',
      args: [n],
    );
  }

  /// `Plan another trip`
  String get plans_new {
    return Intl.message(
      'Plan another trip',
      name: 'plans_new',
      desc: '',
      args: [],
    );
  }

  /// `Remove`
  String get plans_remove {
    return Intl.message('Remove', name: 'plans_remove', desc: '', args: []);
  }

  /// `Your plan`
  String get plans_detail_title {
    return Intl.message(
      'Your plan',
      name: 'plans_detail_title',
      desc: '',
      args: [],
    );
  }

  /// `Live`
  String get home_live {
    return Intl.message('Live', name: 'home_live', desc: '', args: []);
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
