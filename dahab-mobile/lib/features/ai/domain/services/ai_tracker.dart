import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/helpers/firebase_analytics_helper.dart';

/// Events used to measure whether the AI features help (see the roadmap KPIs).
class AiTracker {
  AiTracker._();

  static void track(String name, [Map<String, Object>? parameters]) {
    try {
      getIt<FirebaseAnalyticsHelper>().logAiEvent(name, parameters);
    } catch (_) {}
  }
}
