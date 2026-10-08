import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/chat/data/repositories/fake_chat_repository.dart';
import 'package:flutter_tdd/features/chat/domain/models/chat_domain_model.dart';
import 'package:flutter_tdd/features/chat/domain/repositories/chat_repository.dart';

class ConversationsRequester extends Requester<List<ConversationDomainModel>> {
  ConversationsRequester({ChatRepository? repository})
      : _repository = repository ?? FakeChatRepository();

  final ChatRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await _repository.getConversations();
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }
}

class ConversationDetailRequester extends Requester<ConversationDetailDomainModel> {
  ConversationDetailRequester(this.conversationId, {ChatRepository? repository})
      : _repository = repository ?? FakeChatRepository();

  final String conversationId;
  final ChatRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await _repository.getConversation(conversationId);
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }

  void applyLocal(ConversationDetailDomainModel detail) {
    successState(detail);
  }
}

class PublicUserRequester extends Requester<PublicUserDomainModel> {
  PublicUserRequester(this.userId, {ChatRepository? repository})
      : _repository = repository ?? FakeChatRepository();

  final String userId;
  final ChatRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await _repository.getPublicUser(userId);
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }
}
