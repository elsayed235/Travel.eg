import 'package:rehla/core/constants/app_config.dart';

class ApiNames{
  static String baseUrl = AppConfig.instance.baseUrl;

  // auth routes
  static const String login = "auth";
  static const String refreshToken = "auth";
  static const String savePublicKey = "users/";
  static const String updateUser = "users/";
  static const String register = "auth/create_account";
  static const String activeAccount = "otp/verify";
  static const String resendCode = "ResendCode";
  static const String switchNotify = "SwitchNotify";
  static const String forgetPassword = "cabaf46ee69d7b8445a5d791";
  static const String resetPassword = "A2q4mG84Z9rE2B38In4HALSWTwt9eQ5Slzq56Cod";

  // AI gateway (see docs/ai_backend_contract.md)
  static const String aiStructureRequest = "ai/structure-request";
  static const String aiParseSearch = "ai/parse-search";
  static const String aiPriceGuidance = "ai/price-guidance";
  static const String aiSuggestReplies = "ai/suggest-replies";
  static const String aiReviewSummary = "ai/review-summary/";




}