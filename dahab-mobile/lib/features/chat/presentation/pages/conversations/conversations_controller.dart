part of 'conversations_imports.dart';

class ConversationsController {
  final ConversationsRequester requester = ConversationsRequester();

  void init() => requester.request();

  void openConversation(BuildContext context, String id) {
    AutoRouter.of(context).push(ConversationRoute(conversationId: id));
  }

  void dispose() {}
}
