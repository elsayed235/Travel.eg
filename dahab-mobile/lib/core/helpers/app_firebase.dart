import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';

/// Firebase is optional: the phone builds use it (crash reports, push,
/// analytics), the web preview and any build without a Firebase config run
/// without it instead of crashing at startup.
///
/// NOTE: android/app/google-services.json still belongs to the template's
/// previous app. REHLA needs its own Firebase project before release.
class AppFirebase {
  const AppFirebase._();

  static bool enabled = false;

  static Future<void> init() async {
    if (kIsWeb) return;
    try {
      await Firebase.initializeApp();
      FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
      enabled = true;
    } catch (e) {
      debugPrint('Firebase unavailable, continuing without it: $e');
    }
  }
}
