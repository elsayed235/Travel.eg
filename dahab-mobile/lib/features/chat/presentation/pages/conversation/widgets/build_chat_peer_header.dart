part of 'conversation_widgets_imports.dart';

class BuildChatPeerHeader extends StatelessWidget {
  final ConversationDomainModel conversation;
  final String subtitle;
  final VoidCallback onBack;
  final VoidCallback onOpenProfile;

  const BuildChatPeerHeader({
    super.key,
    required this.conversation,
    required this.subtitle,
    required this.onBack,
    required this.onOpenProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.surface1,
      child: SafeArea(
        bottom: false,
        child: Container(
          padding: const EdgeInsetsDirectional.fromSTEB(
            AppSpacing.xs,
            AppSpacing.sm,
            AppSpacing.lg,
            AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            border: Border(bottom: BorderSide(color: context.colors.line)),
          ),
          child: Row(
            children: [
              IconButton(
                onPressed: onBack,
                splashColor: Colors.transparent,
                highlightColor: Colors.transparent,
                icon: Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 18,
                  color: context.colors.text,
                ),
              ),
              Expanded(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: onOpenProfile,
                    splashFactory: NoSplash.splashFactory,
                    child: Row(
                      children: [
                        ChatOrderAvatar(
                          orderImageUrl: conversation.orderImageUrl,
                          peerAvatarUrl: conversation.peerAvatarUrl,
                          peerInitial: conversation.peerInitial,
                          peerOnline: conversation.peerOnline,
                          size: 44,
                          peerSize: 18,
                          borderColor: context.colors.surface1,
                        ),
                        Gaps.hGap13,
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                conversation.title,
                                style: AppTextStyle.itemTitle(color: context.colors.text),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Gaps.vGap4,
                              Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      conversation.peerName,
                                      style: AppTextStyle.caption(color: context.colors.text2),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (conversation.peerVerified) ...[
                                    Gaps.hGap4,
                                    Icon(
                                      Icons.verified_rounded,
                                      size: 13,
                                      color: context.colors.amber,
                                    ),
                                  ],
                                  Text(
                                    ' · ',
                                    style: AppTextStyle.caption(color: context.colors.text3),
                                  ),
                                  Flexible(
                                    child: Text(
                                      subtitle,
                                      style: AppTextStyle.caption(
                                        color: subtitle == Translate.s.chat_typing ||
                                                subtitle == Translate.s.chat_online
                                            ? context.colors.green
                                            : context.colors.text2,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
