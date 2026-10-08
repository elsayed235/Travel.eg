part of 'conversation_widgets_imports.dart';

class BuildMessageBubble extends StatelessWidget {
  final ChatMessageDomainModel message;
  final bool isFirstInGroup;
  final bool isLastInGroup;
  final VoidCallback? onReply;
  final VoidCallback? onCopy;
  final VoidCallback? onOpenImage;

  const BuildMessageBubble({
    super.key,
    required this.message,
    required this.isFirstInGroup,
    required this.isLastInGroup,
    this.onReply,
    this.onCopy,
    this.onOpenImage,
  });

  @override
  Widget build(BuildContext context) {
    if (message.kind == ChatMessageKind.orderCard) {
      if (message.orderCard == null) return const SizedBox.shrink();
      return BuildChatOrderCard(order: message.orderCard!);
    }

    if (message.kind == ChatMessageKind.system) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        child: Center(
          child: Container(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.sm,
            ),
            decoration: BoxDecoration(
              color: context.colors.surface2,
              borderRadius: AppRadius.chipAll,
            ),
            child: Text(
              message.text ?? '',
              style: AppTextStyle.caption(color: context.colors.text2),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    }

    final top = isFirstInGroup ? AppSpacing.sm : 1.0;
    final bottom = isLastInGroup ? AppSpacing.sm : 1.0;

    return Padding(
      padding: EdgeInsets.only(top: top, bottom: bottom),
      child: GestureDetector(
        onLongPress: () => _showActions(context),
        child: message.kind == ChatMessageKind.image
            ? _ImageBubble(
                message: message,
                isLastInGroup: isLastInGroup,
                onOpenImage: onOpenImage,
              )
            : _TextBubble(
                message: message,
                isLastInGroup: isLastInGroup,
              ),
      ),
    );
  }

  void _showActions(BuildContext context) {
    if (message.kind == ChatMessageKind.orderCard) return;
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.xl,
              vertical: AppSpacing.lg,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _ActionRow(
                  icon: Icons.reply_rounded,
                  label: Translate.s.chat_reply,
                  onTap: () {
                    Navigator.pop(ctx);
                    onReply?.call();
                  },
                ),
                if (message.text != null && message.text!.trim().isNotEmpty) ...[
                  Gaps.vGap9,
                  _ActionRow(
                    icon: Icons.copy_rounded,
                    label: Translate.s.chat_copy,
                    onTap: () {
                      Navigator.pop(ctx);
                      onCopy?.call();
                    },
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ActionRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionRow({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.surface2,
      borderRadius: AppRadius.cardAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.cardAll,
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          child: Row(
            children: [
              Icon(icon, size: 20, color: context.colors.text),
              Gaps.hGap13,
              Text(label, style: AppTextStyle.itemTitle(color: context.colors.text)),
            ],
          ),
        ),
      ),
    );
  }
}

class _TextBubble extends StatelessWidget {
  final ChatMessageDomainModel message;
  final bool isLastInGroup;

  const _TextBubble({
    required this.message,
    required this.isLastInGroup,
  });

  @override
  Widget build(BuildContext context) {
    final mine = message.mine;
    return Align(
      alignment: mine ? AlignmentDirectional.centerStart : AlignmentDirectional.centerEnd,
      child: Container(
        constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.78),
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.lg,
          AppSpacing.md,
          AppSpacing.md,
          AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: mine ? context.colors.button : context.colors.surface1,
          borderRadius: _bubbleRadius(mine, isLastInGroup),
          border: mine ? null : Border.all(color: context.colors.line),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (message.replyToPreview != null) ...[
              _ReplyQuote(
                preview: message.replyToPreview!,
                mine: mine,
                replyToMine: message.replyToMine,
              ),
              Gaps.vGap9,
            ],
            Text(
              message.text ?? '',
              style: AppTextStyle.body(
                color: mine ? context.colors.onButton : context.colors.text,
              ),
            ),
            Gaps.vGap4,
            _MetaRow(message: message),
          ],
        ),
      ),
    );
  }
}

class _ImageBubble extends StatelessWidget {
  final ChatMessageDomainModel message;
  final bool isLastInGroup;
  final VoidCallback? onOpenImage;

  const _ImageBubble({
    required this.message,
    required this.isLastInGroup,
    this.onOpenImage,
  });

  @override
  Widget build(BuildContext context) {
    final mine = message.mine;
    final path = message.imageUrl;
    final isNetwork = path != null &&
        (path.startsWith('http://') || path.startsWith('https://'));

    return Align(
      alignment: mine ? AlignmentDirectional.centerStart : AlignmentDirectional.centerEnd,
      child: Container(
        constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.68),
        padding: const EdgeInsets.all(AppSpacing.xs),
        decoration: BoxDecoration(
          color: mine ? context.colors.button : context.colors.surface1,
          borderRadius: _bubbleRadius(mine, isLastInGroup),
          border: mine ? null : Border.all(color: context.colors.line),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (message.replyToPreview != null) ...[
              Padding(
                padding: const EdgeInsets.all(AppSpacing.sm),
                child: _ReplyQuote(
                  preview: message.replyToPreview!,
                  mine: mine,
                  replyToMine: message.replyToMine,
                ),
              ),
            ],
            GestureDetector(
              onTap: onOpenImage,
              child: ClipRRect(
                borderRadius: AppRadius.imageAll,
                child: path == null
                    ? Container(
                        height: 180,
                        color: context.colors.surface3,
                        alignment: Alignment.center,
                        child: Text(
                          Translate.s.chat_image_caption,
                          style: AppTextStyle.caption(color: context.colors.text2),
                        ),
                      )
                    : isNetwork
                        ? CachedImage(
                            url: path,
                            width: double.infinity,
                            height: 220,
                            fit: BoxFit.cover,
                            borderRadius: AppRadius.imageAll,
                            bgColor: context.colors.surface3,
                          )
                        : Image.file(
                            File(path),
                            width: double.infinity,
                            height: 220,
                            fit: BoxFit.cover,
                          ),
              ),
            ),
            if (message.text != null && message.text!.isNotEmpty) ...[
              Gaps.vGap6,
              Padding(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.sm),
                child: Text(
                  message.text!,
                  style: AppTextStyle.body(
                    color: mine ? context.colors.onButton : context.colors.text,
                  ),
                ),
              ),
            ],
            Gaps.vGap4,
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.sm),
              child: _MetaRow(message: message),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReplyQuote extends StatelessWidget {
  final String preview;
  final bool mine;
  final bool replyToMine;

  const _ReplyQuote({
    required this.preview,
    required this.mine,
    required this.replyToMine,
  });

  @override
  Widget build(BuildContext context) {
    final accent = mine ? context.colors.onButton : context.colors.button;
    return Container(
      width: double.infinity,
      padding: const EdgeInsetsDirectional.fromSTEB(
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
        AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: mine
            ? context.colors.onButton.withValues(alpha: 0.12)
            : context.colors.surface2,
        borderRadius: AppRadius.imageAll,
        border: BorderDirectional(
          start: BorderSide(color: accent, width: 2.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            replyToMine ? Translate.s.chat_replying_to : Translate.s.chat_replying_to,
            style: AppTextStyle.micro(color: accent),
          ),
          Gaps.vGap4,
          Text(
            preview,
            style: AppTextStyle.caption(
              color: mine
                  ? context.colors.onButton.withValues(alpha: 0.85)
                  : context.colors.text2,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _MetaRow extends StatelessWidget {
  final ChatMessageDomainModel message;

  const _MetaRow({required this.message});

  @override
  Widget build(BuildContext context) {
    final mine = message.mine;
    final locale = Localizations.localeOf(context).toString();
    final time = DateFormat('h:mm a', locale).format(message.at).toLocaleDigits;
    final metaColor = mine
        ? context.colors.onButton.withValues(alpha: 0.72)
        : context.colors.text3;

    return Align(
      alignment: AlignmentDirectional.centerEnd,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(time, style: AppTextStyle.micro(color: metaColor)),
          if (mine) ...[
            Gaps.hGap4,
            Icon(
              _deliveryIcon(message.delivery),
              size: 14,
              color: message.delivery == ChatDeliveryStatus.read
                  ? context.colors.green
                  : metaColor,
            ),
          ],
        ],
      ),
    );
  }

  IconData _deliveryIcon(ChatDeliveryStatus status) {
    return switch (status) {
      ChatDeliveryStatus.sending => Icons.access_time_rounded,
      ChatDeliveryStatus.sent => Icons.done_rounded,
      ChatDeliveryStatus.delivered || ChatDeliveryStatus.read => Icons.done_all_rounded,
    };
  }
}

BorderRadiusDirectional _bubbleRadius(bool mine, bool isLastInGroup) {
  const r = Radius.circular(AppRadius.card);
  const tip = Radius.circular(AppRadius.image);
  if (!isLastInGroup) {
    return const BorderRadiusDirectional.all(r);
  }
  return BorderRadiusDirectional.only(
    topStart: r,
    topEnd: r,
    bottomStart: mine ? tip : r,
    bottomEnd: mine ? r : tip,
  );
}
