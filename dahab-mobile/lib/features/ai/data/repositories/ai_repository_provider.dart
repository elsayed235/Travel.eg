import 'package:flutter_tdd/features/ai/data/repositories/fake_ai_repository.dart';
import 'package:flutter_tdd/features/ai/data/repositories/impl_ai_repository.dart';
import 'package:flutter_tdd/features/ai/domain/repositories/ai_repository.dart';

/// Flip with `--dart-define=AI_REMOTE=true` once the backend `ai/*`
/// endpoints are live. Until then the app runs on [FakeAiRepository].
const bool _useRemoteAi = bool.fromEnvironment('AI_REMOTE');

AiRepository defaultAiRepository() =>
    _useRemoteAi ? ImplAiRepository() : FakeAiRepository();
