import 'package:auto_route/auto_route.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';

var baseRoute = [
  AutoRoute(page: ProfileRoute.page),
  AutoRoute(page: ListingRoute.page),
  AutoRoute(page: CreateRequestRoute.page),
  AutoRoute(page: PickLocationRoute.page),
  AutoRoute(page: OffersRoute.page),
  AutoRoute(page: OfferDetailsRoute.page),
  AutoRoute(page: OrdersRoute.page),
  AutoRoute(page: OrderDetailRoute.page),
  AutoRoute(page: EditProfileRoute.page),
  AutoRoute(page: AccountAddressesRoute.page),
  AutoRoute(page: AccountNotificationsRoute.page),
  AutoRoute(page: AccountHelpRoute.page),
  AutoRoute(page: AccountPrivacyRoute.page),
  AutoRoute(page: AccountMyOrdersRoute.page),
  AutoRoute(page: AccountMyListingsRoute.page),
  AutoRoute(page: AccountMyListingDetailRoute.page),
  AutoRoute(page: AccountMyRequestsRoute.page),
  AutoRoute(page: AccountMyReviewsRoute.page),
  AutoRoute(page: ConversationsRoute.page),
  AutoRoute(page: ConversationRoute.page),
  AutoRoute(page: UserPublicProfileRoute.page),
];
