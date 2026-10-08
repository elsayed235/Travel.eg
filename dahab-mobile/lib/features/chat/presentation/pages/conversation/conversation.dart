part of 'conversation_imports.dart';

@RoutePage(name: 'ConversationRoute')
class Conversation extends StatefulWidget {
  final String conversationId;

  const Conversation({super.key, required this.conversationId});

  @override
  State<Conversation> createState() => _ConversationState();
}

class _ConversationState extends State<Conversation> {
  late final ConversationController controller;

  @override
  void initState() {
    super.initState();
    controller = ConversationController(widget.conversationId);
    controller.init();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      body: RequesterConsumer<ConversationDetailDomainModel>(
        requester: controller.detailRequester,
        loadingBuilder: (_) => Scaffold(
          backgroundColor: context.colors.bg,
          appBar: DefaultAppBar(title: Translate.s.chat_conversation_title),
          body: AppScreenShimmer.list(),
        ),
        failureBuilder: (context, error, callback) => Scaffold(
          backgroundColor: context.colors.bg,
          appBar: DefaultAppBar(title: Translate.s.chat_conversation_title),
          body: Center(
            child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
          ),
        ),
        successBuilder: (context, detail, _) {
          final timeline = controller.buildTimeline(detail.messages);
          controller.onMessagesRendered();
          return Column(
            children: [
              ObsValueConsumer(
                observable: controller.peerTypingObs,
                builder: (context, _) {
                  return BuildChatPeerHeader(
                    conversation: detail.conversation,
                    subtitle: controller.presenceLabel(context, detail.conversation),
                    onBack: () => AutoRouter.of(context).maybePop(),
                    onOpenProfile: () => controller.openPeerProfile(
                      context,
                      detail.conversation.peerUserId,
                    ),
                  );
                },
              ),
              Expanded(
                child: ColoredBox(
                  color: context.colors.bg,
                  child: ListView.builder(
                    controller: controller.scrollController,
                    padding: const EdgeInsetsDirectional.fromSTEB(
                      AppSpacing.lg,
                      AppSpacing.md,
                      AppSpacing.lg,
                      AppSpacing.md,
                    ),
                    itemCount: timeline.length + 1,
                    itemBuilder: (context, index) {
                      if (index == timeline.length) {
                        return ObsValueConsumer(
                          observable: controller.peerTypingObs,
                          builder: (context, typing) {
                            if (!typing) return const SizedBox.shrink();
                            return const BuildChatTypingBubble();
                          },
                        );
                      }
                      final item = timeline[index];
                      if (item is ChatTimelineDate) {
                        return BuildChatDateChip(
                          label: controller.dateLabel(context, item.day),
                        );
                      }
                      final row = item as ChatTimelineMessage;
                      return BuildMessageBubble(
                        message: row.message,
                        isFirstInGroup: row.isFirstInGroup,
                        isLastInGroup: row.isLastInGroup,
                        onReply: () => controller.setReply(row.message),
                        onCopy: () => controller.copyMessage(context, row.message),
                        onOpenImage: row.message.imageUrl == null
                            ? null
                            : () => controller.openImage(context, row.message.imageUrl!),
                      );
                    },
                  ),
                ),
              ),
              ObsValueConsumer(
                observable: controller.replyToObs,
                builder: (context, reply) {
                  if (reply == null) return const SizedBox.shrink();
                  return BuildChatReplyBar(
                    message: reply,
                    onClose: controller.clearReply,
                  );
                },
              ),
              BuildChatSafetyBanner(
                flagObs: controller.peerSafetyFlagObs,
                onDismiss: controller.dismissPeerWarning,
              ),
              BuildChatSmartReplies(
                repliesObs: controller.smartRepliesObs,
                hasTextObs: controller.hasTextObs,
                onPick: controller.useSmartReply,
              ),
              BuildChatComposer(
                controller: controller.messageController,
                sendingObs: controller.sendingObs,
                hasTextObs: controller.hasTextObs,
                onSend: () => controller.send(context),
                onAttach: () => controller.openAttachSheet(context),
                onCamera: () => controller.sendImage(context, ImageSource.camera),
              ),
            ],
          );
        },
      ),
    );
  }
}
