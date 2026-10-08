import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';

/// Cheap first-pass safety check that runs on the device before any LLM.
/// The backend runs the same rules plus an LLM check on flagged messages.
class ChatSafetyRules {
  ChatSafetyRules._();

  static final _offPlatform = RegExp(
    r'(فودافون|vodafone)\s*كاش|انستا\s*باي|instapay|تحويل\s*(على|ع)\s*(رقم|الموبايل|المحفظة)|محفظة|ادفع\s*(برا|بره|خارج)\s*التطبيق|من\s*غير\s*التطبيق',
    caseSensitive: false,
  );

  static final _advance = RegExp(
    r'(ابعت|حوّل|حول|ادفع)\s*\S*\s*(مقدم|عربون)|العربون\s*الأول|قبل\s*ما\s*(أسلم|اسلم|تستلم)',
  );

  static final _abuse = RegExp(r'حرامي|نصاب|يا\s*حيوان|يا\s*غبي');

  static SafetyFlag? check(String text) {
    if (text.trim().isEmpty) return null;
    if (_offPlatform.hasMatch(text)) return SafetyFlag.offPlatformPayment;
    if (_advance.hasMatch(text)) return SafetyFlag.advancePayment;
    if (_abuse.hasMatch(text)) return SafetyFlag.abuse;
    return null;
  }
}
