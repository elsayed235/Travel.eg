// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes

import 'package:auto_route/auto_route.dart' as _i30;
import 'package:flutter/material.dart' as _i31;
import 'package:flutter_tdd/features/account/presentation/pages/account_addresses/account_addresses_imports.dart'
    as _i1;
import 'package:flutter_tdd/features/account/presentation/pages/account_help/account_help_imports.dart'
    as _i2;
import 'package:flutter_tdd/features/account/presentation/pages/account_my_listing_detail/account_my_listing_detail_imports.dart'
    as _i3;
import 'package:flutter_tdd/features/account/presentation/pages/account_my_listings/account_my_listings_imports.dart'
    as _i4;
import 'package:flutter_tdd/features/account/presentation/pages/account_my_orders/account_my_orders_imports.dart'
    as _i5;
import 'package:flutter_tdd/features/account/presentation/pages/account_my_requests/account_my_requests_imports.dart'
    as _i6;
import 'package:flutter_tdd/features/account/presentation/pages/account_my_reviews/account_my_reviews_imports.dart'
    as _i7;
import 'package:flutter_tdd/features/account/presentation/pages/account_notifications/account_notifications_imports.dart'
    as _i8;
import 'package:flutter_tdd/features/account/presentation/pages/account_privacy/account_privacy_imports.dart'
    as _i9;
import 'package:flutter_tdd/features/account/presentation/pages/edit_profile/edit_profile_imports.dart'
    as _i14;
import 'package:flutter_tdd/features/auth/presentation/pages/active_account/active_account_imports.dart'
    as _i10;
import 'package:flutter_tdd/features/auth/presentation/pages/forget_password/forget_password_imports.dart'
    as _i15;
import 'package:flutter_tdd/features/auth/presentation/pages/login/login_imports.dart'
    as _i18;
import 'package:flutter_tdd/features/auth/presentation/pages/register/register_imports.dart'
    as _i25;
import 'package:flutter_tdd/features/auth/presentation/pages/reset_password/reset_password_imports.dart'
    as _i26;
import 'package:flutter_tdd/features/auth/presentation/pages/splash/splash_imports.dart'
    as _i27;
import 'package:flutter_tdd/features/base/presentation/pages/home/home_imports.dart'
    as _i16;
import 'package:flutter_tdd/features/base/presentation/pages/listing/listing_imports.dart'
    as _i17;
import 'package:flutter_tdd/features/base/presentation/pages/profile/profile_imports.dart'
    as _i24;
import 'package:flutter_tdd/features/chat/presentation/pages/conversation/conversation_imports.dart'
    as _i11;
import 'package:flutter_tdd/features/chat/presentation/pages/conversations/conversations_imports.dart'
    as _i12;
import 'package:flutter_tdd/features/chat/presentation/pages/user_public_profile/user_public_profile_imports.dart'
    as _i29;
import 'package:flutter_tdd/features/general/presentation/pages/terms/terms_imports.dart'
    as _i28;
import 'package:flutter_tdd/features/offers/presentation/pages/offer_details/offer_details_imports.dart'
    as _i19;
import 'package:flutter_tdd/features/offers/presentation/pages/offers/offers_imports.dart'
    as _i20;
import 'package:flutter_tdd/features/orders/presentation/pages/order_detail/order_detail_imports.dart'
    as _i21;
import 'package:flutter_tdd/features/orders/presentation/pages/orders/orders_imports.dart'
    as _i22;
import 'package:flutter_tdd/features/request/presentation/pages/create_request/create_request_imports.dart'
    as _i13;
import 'package:flutter_tdd/features/request/presentation/pages/pick_location/pick_location_imports.dart'
    as _i23;

/// generated route for
/// [_i1.AccountAddresses]
class AccountAddressesRoute extends _i30.PageRouteInfo<void> {
  const AccountAddressesRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountAddressesRoute.name, initialChildren: children);

  static const String name = 'AccountAddressesRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i1.AccountAddresses();
    },
  );
}

/// generated route for
/// [_i2.AccountHelp]
class AccountHelpRoute extends _i30.PageRouteInfo<void> {
  const AccountHelpRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountHelpRoute.name, initialChildren: children);

  static const String name = 'AccountHelpRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i2.AccountHelp();
    },
  );
}

/// generated route for
/// [_i3.AccountMyListingDetail]
class AccountMyListingDetailRoute
    extends _i30.PageRouteInfo<AccountMyListingDetailRouteArgs> {
  AccountMyListingDetailRoute({
    _i31.Key? key,
    required String listingId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         AccountMyListingDetailRoute.name,
         args: AccountMyListingDetailRouteArgs(key: key, listingId: listingId),
         initialChildren: children,
       );

  static const String name = 'AccountMyListingDetailRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<AccountMyListingDetailRouteArgs>();
      return _i3.AccountMyListingDetail(
        key: args.key,
        listingId: args.listingId,
      );
    },
  );
}

class AccountMyListingDetailRouteArgs {
  const AccountMyListingDetailRouteArgs({this.key, required this.listingId});

  final _i31.Key? key;

  final String listingId;

  @override
  String toString() {
    return 'AccountMyListingDetailRouteArgs{key: $key, listingId: $listingId}';
  }
}

/// generated route for
/// [_i4.AccountMyListings]
class AccountMyListingsRoute extends _i30.PageRouteInfo<void> {
  const AccountMyListingsRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountMyListingsRoute.name, initialChildren: children);

  static const String name = 'AccountMyListingsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i4.AccountMyListings();
    },
  );
}

/// generated route for
/// [_i5.AccountMyOrders]
class AccountMyOrdersRoute extends _i30.PageRouteInfo<void> {
  const AccountMyOrdersRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountMyOrdersRoute.name, initialChildren: children);

  static const String name = 'AccountMyOrdersRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i5.AccountMyOrders();
    },
  );
}

/// generated route for
/// [_i6.AccountMyRequests]
class AccountMyRequestsRoute extends _i30.PageRouteInfo<void> {
  const AccountMyRequestsRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountMyRequestsRoute.name, initialChildren: children);

  static const String name = 'AccountMyRequestsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i6.AccountMyRequests();
    },
  );
}

/// generated route for
/// [_i7.AccountMyReviews]
class AccountMyReviewsRoute extends _i30.PageRouteInfo<void> {
  const AccountMyReviewsRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountMyReviewsRoute.name, initialChildren: children);

  static const String name = 'AccountMyReviewsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i7.AccountMyReviews();
    },
  );
}

/// generated route for
/// [_i8.AccountNotifications]
class AccountNotificationsRoute extends _i30.PageRouteInfo<void> {
  const AccountNotificationsRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountNotificationsRoute.name, initialChildren: children);

  static const String name = 'AccountNotificationsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i8.AccountNotifications();
    },
  );
}

/// generated route for
/// [_i9.AccountPrivacy]
class AccountPrivacyRoute extends _i30.PageRouteInfo<void> {
  const AccountPrivacyRoute({List<_i30.PageRouteInfo>? children})
    : super(AccountPrivacyRoute.name, initialChildren: children);

  static const String name = 'AccountPrivacyRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i9.AccountPrivacy();
    },
  );
}

/// generated route for
/// [_i10.ActiveAccount]
class ActiveAccountRoute extends _i30.PageRouteInfo<ActiveAccountRouteArgs> {
  ActiveAccountRoute({
    _i31.Key? key,
    String? phone,
    bool isRegister = false,
    String? fullName,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         ActiveAccountRoute.name,
         args: ActiveAccountRouteArgs(
           key: key,
           phone: phone,
           isRegister: isRegister,
           fullName: fullName,
         ),
         initialChildren: children,
       );

  static const String name = 'ActiveAccountRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<ActiveAccountRouteArgs>(
        orElse: () => const ActiveAccountRouteArgs(),
      );
      return _i10.ActiveAccount(
        key: args.key,
        phone: args.phone,
        isRegister: args.isRegister,
        fullName: args.fullName,
      );
    },
  );
}

class ActiveAccountRouteArgs {
  const ActiveAccountRouteArgs({
    this.key,
    this.phone,
    this.isRegister = false,
    this.fullName,
  });

  final _i31.Key? key;

  final String? phone;

  final bool isRegister;

  final String? fullName;

  @override
  String toString() {
    return 'ActiveAccountRouteArgs{key: $key, phone: $phone, isRegister: $isRegister, fullName: $fullName}';
  }
}

/// generated route for
/// [_i11.Conversation]
class ConversationRoute extends _i30.PageRouteInfo<ConversationRouteArgs> {
  ConversationRoute({
    _i31.Key? key,
    required String conversationId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         ConversationRoute.name,
         args: ConversationRouteArgs(key: key, conversationId: conversationId),
         initialChildren: children,
       );

  static const String name = 'ConversationRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<ConversationRouteArgs>();
      return _i11.Conversation(
        key: args.key,
        conversationId: args.conversationId,
      );
    },
  );
}

class ConversationRouteArgs {
  const ConversationRouteArgs({this.key, required this.conversationId});

  final _i31.Key? key;

  final String conversationId;

  @override
  String toString() {
    return 'ConversationRouteArgs{key: $key, conversationId: $conversationId}';
  }
}

/// generated route for
/// [_i12.Conversations]
class ConversationsRoute extends _i30.PageRouteInfo<void> {
  const ConversationsRoute({List<_i30.PageRouteInfo>? children})
    : super(ConversationsRoute.name, initialChildren: children);

  static const String name = 'ConversationsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i12.Conversations();
    },
  );
}

/// generated route for
/// [_i13.CreateRequest]
class CreateRequestRoute extends _i30.PageRouteInfo<CreateRequestRouteArgs> {
  CreateRequestRoute({
    _i31.Key? key,
    String? initialText,
    bool startVoice = false,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         CreateRequestRoute.name,
         args: CreateRequestRouteArgs(
           key: key,
           initialText: initialText,
           startVoice: startVoice,
         ),
         initialChildren: children,
       );

  static const String name = 'CreateRequestRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<CreateRequestRouteArgs>(
        orElse: () => const CreateRequestRouteArgs(),
      );
      return _i13.CreateRequest(
        key: args.key,
        initialText: args.initialText,
        startVoice: args.startVoice,
      );
    },
  );
}

class CreateRequestRouteArgs {
  const CreateRequestRouteArgs({
    this.key,
    this.initialText,
    this.startVoice = false,
  });

  final _i31.Key? key;

  final String? initialText;

  final bool startVoice;

  @override
  String toString() {
    return 'CreateRequestRouteArgs{key: $key, initialText: $initialText, startVoice: $startVoice}';
  }
}

/// generated route for
/// [_i14.EditProfile]
class EditProfileRoute extends _i30.PageRouteInfo<void> {
  const EditProfileRoute({List<_i30.PageRouteInfo>? children})
    : super(EditProfileRoute.name, initialChildren: children);

  static const String name = 'EditProfileRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i14.EditProfile();
    },
  );
}

/// generated route for
/// [_i15.ForgetPassword]
class ForgetPasswordRoute extends _i30.PageRouteInfo<void> {
  const ForgetPasswordRoute({List<_i30.PageRouteInfo>? children})
    : super(ForgetPasswordRoute.name, initialChildren: children);

  static const String name = 'ForgetPasswordRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i15.ForgetPassword();
    },
  );
}

/// generated route for
/// [_i16.Home]
class HomeRoute extends _i30.PageRouteInfo<void> {
  const HomeRoute({List<_i30.PageRouteInfo>? children})
    : super(HomeRoute.name, initialChildren: children);

  static const String name = 'HomeRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i16.Home();
    },
  );
}

/// generated route for
/// [_i17.Listing]
class ListingRoute extends _i30.PageRouteInfo<ListingRouteArgs> {
  ListingRoute({
    _i31.Key? key,
    required String listingId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         ListingRoute.name,
         args: ListingRouteArgs(key: key, listingId: listingId),
         initialChildren: children,
       );

  static const String name = 'ListingRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<ListingRouteArgs>();
      return _i17.Listing(key: args.key, listingId: args.listingId);
    },
  );
}

class ListingRouteArgs {
  const ListingRouteArgs({this.key, required this.listingId});

  final _i31.Key? key;

  final String listingId;

  @override
  String toString() {
    return 'ListingRouteArgs{key: $key, listingId: $listingId}';
  }
}

/// generated route for
/// [_i18.Login]
class LoginRoute extends _i30.PageRouteInfo<void> {
  const LoginRoute({List<_i30.PageRouteInfo>? children})
    : super(LoginRoute.name, initialChildren: children);

  static const String name = 'LoginRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i18.Login();
    },
  );
}

/// generated route for
/// [_i19.OfferDetails]
class OfferDetailsRoute extends _i30.PageRouteInfo<OfferDetailsRouteArgs> {
  OfferDetailsRoute({
    _i31.Key? key,
    required String selectedOfferId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         OfferDetailsRoute.name,
         args: OfferDetailsRouteArgs(
           key: key,
           selectedOfferId: selectedOfferId,
         ),
         initialChildren: children,
       );

  static const String name = 'OfferDetailsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<OfferDetailsRouteArgs>();
      return _i19.OfferDetails(
        key: args.key,
        selectedOfferId: args.selectedOfferId,
      );
    },
  );
}

class OfferDetailsRouteArgs {
  const OfferDetailsRouteArgs({this.key, required this.selectedOfferId});

  final _i31.Key? key;

  final String selectedOfferId;

  @override
  String toString() {
    return 'OfferDetailsRouteArgs{key: $key, selectedOfferId: $selectedOfferId}';
  }
}

/// generated route for
/// [_i20.Offers]
class OffersRoute extends _i30.PageRouteInfo<void> {
  const OffersRoute({List<_i30.PageRouteInfo>? children})
    : super(OffersRoute.name, initialChildren: children);

  static const String name = 'OffersRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i20.Offers();
    },
  );
}

/// generated route for
/// [_i21.OrderDetail]
class OrderDetailRoute extends _i30.PageRouteInfo<OrderDetailRouteArgs> {
  OrderDetailRoute({
    _i31.Key? key,
    required String orderId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         OrderDetailRoute.name,
         args: OrderDetailRouteArgs(key: key, orderId: orderId),
         initialChildren: children,
       );

  static const String name = 'OrderDetailRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<OrderDetailRouteArgs>();
      return _i21.OrderDetail(key: args.key, orderId: args.orderId);
    },
  );
}

class OrderDetailRouteArgs {
  const OrderDetailRouteArgs({this.key, required this.orderId});

  final _i31.Key? key;

  final String orderId;

  @override
  String toString() {
    return 'OrderDetailRouteArgs{key: $key, orderId: $orderId}';
  }
}

/// generated route for
/// [_i22.Orders]
class OrdersRoute extends _i30.PageRouteInfo<void> {
  const OrdersRoute({List<_i30.PageRouteInfo>? children})
    : super(OrdersRoute.name, initialChildren: children);

  static const String name = 'OrdersRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i22.Orders();
    },
  );
}

/// generated route for
/// [_i23.PickLocation]
class PickLocationRoute extends _i30.PageRouteInfo<PickLocationRouteArgs> {
  PickLocationRoute({
    _i31.Key? key,
    required double initialLat,
    required double initialLng,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         PickLocationRoute.name,
         args: PickLocationRouteArgs(
           key: key,
           initialLat: initialLat,
           initialLng: initialLng,
         ),
         initialChildren: children,
       );

  static const String name = 'PickLocationRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<PickLocationRouteArgs>();
      return _i23.PickLocation(
        key: args.key,
        initialLat: args.initialLat,
        initialLng: args.initialLng,
      );
    },
  );
}

class PickLocationRouteArgs {
  const PickLocationRouteArgs({
    this.key,
    required this.initialLat,
    required this.initialLng,
  });

  final _i31.Key? key;

  final double initialLat;

  final double initialLng;

  @override
  String toString() {
    return 'PickLocationRouteArgs{key: $key, initialLat: $initialLat, initialLng: $initialLng}';
  }
}

/// generated route for
/// [_i24.Profile]
class ProfileRoute extends _i30.PageRouteInfo<void> {
  const ProfileRoute({List<_i30.PageRouteInfo>? children})
    : super(ProfileRoute.name, initialChildren: children);

  static const String name = 'ProfileRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i24.Profile();
    },
  );
}

/// generated route for
/// [_i25.Register]
class RegisterRoute extends _i30.PageRouteInfo<void> {
  const RegisterRoute({List<_i30.PageRouteInfo>? children})
    : super(RegisterRoute.name, initialChildren: children);

  static const String name = 'RegisterRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i25.Register();
    },
  );
}

/// generated route for
/// [_i26.ResetPassword]
class ResetPasswordRoute extends _i30.PageRouteInfo<void> {
  const ResetPasswordRoute({List<_i30.PageRouteInfo>? children})
    : super(ResetPasswordRoute.name, initialChildren: children);

  static const String name = 'ResetPasswordRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i26.ResetPassword();
    },
  );
}

/// generated route for
/// [_i27.Splash]
class SplashRoute extends _i30.PageRouteInfo<void> {
  const SplashRoute({List<_i30.PageRouteInfo>? children})
    : super(SplashRoute.name, initialChildren: children);

  static const String name = 'SplashRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i27.Splash();
    },
  );
}

/// generated route for
/// [_i28.Terms]
class TermsRoute extends _i30.PageRouteInfo<void> {
  const TermsRoute({List<_i30.PageRouteInfo>? children})
    : super(TermsRoute.name, initialChildren: children);

  static const String name = 'TermsRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      return const _i28.Terms();
    },
  );
}

/// generated route for
/// [_i29.UserPublicProfile]
class UserPublicProfileRoute
    extends _i30.PageRouteInfo<UserPublicProfileRouteArgs> {
  UserPublicProfileRoute({
    _i31.Key? key,
    required String userId,
    List<_i30.PageRouteInfo>? children,
  }) : super(
         UserPublicProfileRoute.name,
         args: UserPublicProfileRouteArgs(key: key, userId: userId),
         initialChildren: children,
       );

  static const String name = 'UserPublicProfileRoute';

  static _i30.PageInfo page = _i30.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<UserPublicProfileRouteArgs>();
      return _i29.UserPublicProfile(key: args.key, userId: args.userId);
    },
  );
}

class UserPublicProfileRouteArgs {
  const UserPublicProfileRouteArgs({this.key, required this.userId});

  final _i31.Key? key;

  final String userId;

  @override
  String toString() {
    return 'UserPublicProfileRouteArgs{key: $key, userId: $userId}';
  }
}
