import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';

/// All AI calls go through the backend — the app never holds an LLM key.
/// See docs/ai_backend_contract.md for the endpoint shapes.
abstract class AiRepository {
  Future<MyResult<StructuredRequestDomainModel>> structureRequest({
    required String text,
    required List<String> categoryIds,
    String? photoPath,
  });

  Future<MyResult<SmartSearchDomainModel>> parseSearch({
    required String text,
    required List<String> categoryIds,
  });

  Future<MyResult<PriceGuidanceDomainModel>> getPriceGuidance({
    required String itemLabel,
    String? categoryId,
  });

  Future<MyResult<List<String>>> suggestReplies({
    required String conversationId,
    required bool isMyRequest,
    required String lastPeerMessage,
  });

  Future<MyResult<ReviewSummaryDomainModel>> getReviewSummary(String userId);
}
