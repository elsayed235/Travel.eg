import 'package:rehla/core/constants/app_config.dart';

/// REHLA API paths, relative to [baseUrl] (`<host>/api/`). The website and the
/// app share one server; see server.ts and server/middleware/apiAccessPolicy.ts
/// for which of these work before sign-in.
class ApiNames {
  static String baseUrl = AppConfig.instance.baseUrl;

  // Session
  static const String login = "auth/login";
  static const String register = "auth/register";
  static const String me = "auth/me";
  static const String logout = "auth/logout";

  // Discovery (public)
  static const String conditions = "telemetry/conditions";
  static const String fxRates = "fx/rates";
  static const String programmes = "dahab/content/programmes";

  // Planning and the concierge
  static const String daygiQuery = "daygi/query";
  static const String supportMessages = "support/messages";
  static const String trips = "trips";
  /// Append the signed-in user id (`trips/user/<id>`); the server checks it.
  static const String tripsOfUser = "trips/user/";
}
