import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class FirebaseAnalyticsHelper {

  FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  /// AI feature usage, e.g. ai_request_structured, ai_reply_used.
  /// Never throws: analytics must not break a user flow.
  Future<void> logAiEvent(String name, [Map<String, Object>? parameters]) async {
    try {
      await analytics.logEvent(name: name, parameters: parameters);
    } catch (_) {}
  }


 Future<void> userLogin(String phone)async{
    await analytics.logEvent(
        name: 'user_login_click',
        parameters: {
          'user_phone': phone,
        },
    );
  }


  Future<void> userRegister(String name, String phone)async{
    await analytics.logEvent(
        name: 'user_register-click',
        parameters: {
          'user_name': name,
          "user_phone": phone,
        },
    );
  }



  Future<void> startAVideoCallEvent(String phone)async{
    await analytics.logEvent(
        name: 'forget_password_click',
        parameters: {
          'user_phone': phone,
        },
    );
  }



}