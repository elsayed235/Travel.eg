import 'package:auto_route/auto_route.dart';
import 'package:rehla/core/routes/router_imports.gr.dart';

var baseRoute = [
  AutoRoute(page: EditProfileRoute.page),
  AutoRoute(page: AccountNotificationsRoute.page),
  AutoRoute(page: AccountHelpRoute.page),
  AutoRoute(page: AccountPrivacyRoute.page),
];
