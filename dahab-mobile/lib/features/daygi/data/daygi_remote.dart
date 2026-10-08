import 'package:rehla/core/http/rehla_api.dart';

/// POST /api/daygi/query — the same concierge the website talks to. The
/// server takes identity from the session; the trip id is only a hint it
/// checks against the trips the caller owns.
class DaygiRemote {
  const DaygiRemote._();

  static Future<DaygiAnswer?> ask(String prompt, {required bool arabic, String? tripId}) async {
    final reply = await RehlaApi.post('daygi/query', {
      'prompt': prompt,
      'language': arabic ? 'ar' : 'en',
      'tripId': ?tripId,
    });
    if (!reply.ok) return reply.unauthorized ? const DaygiAnswer.signedOut() : null;
    final m = reply.map;
    final text = (arabic ? m['replyTextAr'] : m['replyText']) as String? ?? m['replyText'] as String? ?? '';
    if (text.trim().isEmpty) return null;
    final why = (arabic ? m['whyThisAr'] : m['whyThis']) as String? ?? '';
    final follow = <(String, String)>[];
    final raw = m['suggestedFollowUps'];
    if (raw is List) {
      for (final f in raw.whereType<Map>()) {
        final label = (arabic ? f['textAr'] : f['textEn']) as String? ?? '';
        final query = f['query'] as String? ?? label;
        if (label.isNotEmpty) follow.add((label, query));
      }
    }
    return DaygiAnswer(text: text.trim(), why: why.trim(), followUps: follow);
  }
}

class DaygiAnswer {
  final String text;
  final String why;
  final List<(String, String)> followUps;
  final bool signedOut;

  const DaygiAnswer({required this.text, required this.why, required this.followUps}) : signedOut = false;

  const DaygiAnswer.signedOut()
      : text = '',
        why = '',
        followUps = const [],
        signedOut = true;
}
