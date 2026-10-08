import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/helpers/global_context.dart';
import 'package:intl/intl.dart';
import 'package:speech_to_text/speech_to_text.dart';

/// On-device dictation (free — uses the OS recognizer, no API calls).
/// Kept behind this wrapper so the package can be swapped easily.
///
/// Recognition follows the app's language (the one chosen in the app),
/// not the phone's system language.
class SpeechInputService {
  SpeechInputService._();

  static final SpeechInputService instance = SpeechInputService._();

  /// Preferred dialect per app language. Egyptian Arabic first: that is
  /// how our users talk.
  static const _preferred = {'ar': 'ar_EG', 'en': 'en_US'};

  final SpeechToText _speech = SpeechToText();
  final Map<String, String> _resolved = {};
  void Function()? _onDone;

  bool get isListening => _speech.isListening;

  /// Returns false when the mic/speech permission is denied or the device
  /// has no recognizer. [localeId] overrides the app language when set.
  Future<bool> start({
    required void Function(String words, bool isFinal) onResult,
    void Function()? onDone,
    String? localeId,
  }) async {
    _onDone = onDone;
    final available = await _speech.initialize(
      onStatus: (status) {
        if (status == SpeechToText.doneStatus || status == SpeechToText.notListeningStatus) {
          _onDone?.call();
        }
      },
      onError: (_) => _onDone?.call(),
    );
    if (!available) return false;
    await _speech.listen(
      onResult: (result) => onResult(result.recognizedWords, result.finalResult),
      listenOptions: SpeechListenOptions(
        localeId: localeId ?? await _localeForAppLanguage(),
        listenMode: ListenMode.dictation,
        partialResults: true,
        pauseFor: const Duration(seconds: 3),
        listenFor: const Duration(seconds: 45),
      ),
    );
    return true;
  }

  Future<void> stop() async {
    await _speech.stop();
  }

  String _appLanguageCode() {
    try {
      final context = getIt<GlobalContext>().context();
      return context.read<DeviceCubit>().state.model.locale.languageCode;
    } catch (_) {
      // No app context yet (e.g. tests): fall back to the loaded translations.
      return Intl.getCurrentLocale().split(RegExp('[_-]')).first;
    }
  }

  /// Best recognizer locale on this device for the app language: the
  /// preferred dialect, else any dialect of that language, else the
  /// preferred id anyway (never the phone's own language).
  Future<String> _localeForAppLanguage() async {
    final language = _appLanguageCode();
    final cached = _resolved[language];
    if (cached != null) return cached;

    final preferred = _preferred[language] ?? language;
    String norm(String id) => id.replaceAll('-', '_').toLowerCase();

    var chosen = preferred;
    try {
      final ids = (await _speech.locales()).map((l) => l.localeId).toList();
      final exact = ids.where((id) => norm(id) == norm(preferred));
      final sameLanguage = ids.where(
        (id) => norm(id) == language || norm(id).startsWith('${language}_'),
      );
      if (exact.isNotEmpty) {
        chosen = exact.first;
      } else if (sameLanguage.isNotEmpty) {
        chosen = sameLanguage.first;
      }
    } catch (_) {}

    _resolved[language] = chosen;
    return chosen;
  }
}
