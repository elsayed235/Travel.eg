import 'dart:io';

import 'package:flutter_tdd/core/http/generic_http/api_names.dart';
import 'package:flutter_tdd/core/http/generic_http/generic_http.dart';
import 'package:flutter_tdd/core/http/models/http_request_model.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/ai/domain/repositories/ai_repository.dart';

/// Talks to the backend AI gateway. The backend owns the LLM key, prompts,
/// rate limits and caching.
class ImplAiRepository implements AiRepository {
  @override
  Future<MyResult<StructuredRequestDomainModel>> structureRequest({
    required String text,
    required List<String> categoryIds,
    String? photoPath,
  }) {
    return GenericHttpImpl<StructuredRequestDomainModel>()(
      HttpRequestModel(
        url: ApiNames.aiStructureRequest,
        requestMethod: RequestMethod.post,
        responseType: ResType.model,
        requestBody: {
          'text': text,
          'category_ids': categoryIds,
          if (photoPath != null) 'photo': File(photoPath),
        },
        toJsonFunc: (json) =>
            StructuredRequestDomainModel.fromJson(json as Map<String, dynamic>),
      ),
    );
  }

  @override
  Future<MyResult<SmartSearchDomainModel>> parseSearch({
    required String text,
    required List<String> categoryIds,
  }) {
    return GenericHttpImpl<SmartSearchDomainModel>()(
      HttpRequestModel(
        url: ApiNames.aiParseSearch,
        requestMethod: RequestMethod.post,
        responseType: ResType.model,
        requestBody: {'text': text, 'category_ids': categoryIds},
        toJsonFunc: (json) =>
            SmartSearchDomainModel.fromJson(text, json as Map<String, dynamic>),
      ),
    );
  }

  @override
  Future<MyResult<PriceGuidanceDomainModel>> getPriceGuidance({
    required String itemLabel,
    String? categoryId,
  }) {
    final query = Uri(queryParameters: {
      'item': itemLabel,
      'category_id': ?categoryId,
    }).query;
    return GenericHttpImpl<PriceGuidanceDomainModel>()(
      HttpRequestModel(
        url: '${ApiNames.aiPriceGuidance}?$query',
        requestMethod: RequestMethod.get,
        responseType: ResType.model,
        toJsonFunc: (json) =>
            PriceGuidanceDomainModel.fromJson(json as Map<String, dynamic>),
      ),
    );
  }

  @override
  Future<MyResult<List<String>>> suggestReplies({
    required String conversationId,
    required bool isMyRequest,
    required String lastPeerMessage,
  }) {
    return GenericHttpImpl<List<String>>()(
      HttpRequestModel(
        url: ApiNames.aiSuggestReplies,
        requestMethod: RequestMethod.post,
        responseType: ResType.list,
        requestBody: {
          'conversation_id': conversationId,
          'role': isMyRequest ? 'requester' : 'owner',
        },
        toJsonFunc: (json) => (json as List<dynamic>).cast<String>(),
      ),
    );
  }

  @override
  Future<MyResult<ReviewSummaryDomainModel>> getReviewSummary(String userId) {
    return GenericHttpImpl<ReviewSummaryDomainModel>()(
      HttpRequestModel(
        url: '${ApiNames.aiReviewSummary}$userId',
        requestMethod: RequestMethod.get,
        responseType: ResType.model,
        toJsonFunc: (json) =>
            ReviewSummaryDomainModel.fromJson(json as Map<String, dynamic>),
      ),
    );
  }
}
