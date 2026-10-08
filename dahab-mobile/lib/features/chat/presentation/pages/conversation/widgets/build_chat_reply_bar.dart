part of 'conversation_widgets_imports.dart';

class BuildChatReplyBar extends StatelessWidget {
  final ChatMessageDomainModel message;
  final VoidCallback onClose;

  const BuildChatReplyBar({
    super.key,
    required this.message,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final preview = message.kind == ChatMessageKind.image
        ? (message.text?.isNotEmpty == true
            ? '${Translate.s.chat_photo} · ${message.text}'
            : Translate.s.chat_photo)
        : (message.text ?? '');

    return Container(
      width: double.infinity,
      padding: const EdgeInsetsDirectional.fromSTEB(
        AppSpacing.xl,
        AppSpacing.md,
        AppSpacing.md,
        AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        border: Border(top: BorderSide(color: context.colors.line)),
      ),
      child: Row(
        children: [
          Container(
            width: 3,
            height: 40,
            decoration: BoxDecoration(
              color: context.colors.button,
              borderRadius: AppRadius.chipAll,
            ),
          ),
          Gaps.hGap13,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  Translate.s.chat_replying_to,
                  style: AppTextStyle.caption(color: context.colors.button),
                ),
                Gaps.vGap4,
                Text(
                  preview,
                  style: AppTextStyle.body(color: context.colors.text2),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: onClose,
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
            icon: Icon(Icons.close_rounded, size: 18, color: context.colors.text2),
          ),
        ],
      ),
    );
  }
}
