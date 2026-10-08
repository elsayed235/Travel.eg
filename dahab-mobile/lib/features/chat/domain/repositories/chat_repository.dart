import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/chat/domain/models/chat_domain_model.dart';

abstract class ChatRepository {
  Future<MyResult<List<ConversationDomainModel>>> getConversations();

  Future<MyResult<ConversationDetailDomainModel>> getConversation(String id);

  Future<MyResult<ConversationDetailDomainModel>> sendText({
    required String conversationId,
    required String text,
    String? replyToId,
    String? replyToPreview,
    bool replyToMine = false,
  });

  Future<MyResult<ConversationDetailDomainModel>> sendImage({
    required String conversationId,
    required String imagePath,
    String? caption,
    String? replyToId,
    String? replyToPreview,
    bool replyToMine = false,
  });

  Future<MyResult<String>> openConversationForOffer({
    required String offerId,
    required String providerUserId,
  });

  Future<MyResult<String>> openConversationForListingOffer({
    required String listingId,
    required String ownerUserId,
    required String listingTitle,
    required num offerPrice,
    required int quantity,
    required String quantityUnit,
    required String dealLabel,
    required num insuranceAmount,
  });

  Future<MyResult<PublicUserDomainModel>> getPublicUser(String userId);
}
