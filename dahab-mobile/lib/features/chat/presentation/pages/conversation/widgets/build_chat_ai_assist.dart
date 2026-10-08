part of 'conversation_widgets_imports.dart';

/// Tappable reply suggestions shown above an empty composer.
class BuildChatSmartReplies extends StatelessWidget {
  final ObsValue<List<String>> repliesObs;
  final ObsValue<bool> hasTextObs;
  final ValueChanged<String> onPick;

  const BuildChatSmartReplies({
    super.key,
    required this.repliesObs,
    required this.hasTextObs,
    required this.onPick,
  });

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: hasTextObs,
      builder: (context, hasText) {
        return ObsValueConsumer(
          observable: repliesObs,
          builder: (context, replies) {
            if (hasText || replies.isEmpty) return const SizedBox.shrink();
            return Container(
              color: context.colors.surface1,
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsetsDirectional.fromSTEB(
                  AppSpacing.md,
                  AppSpacing.sm,
                  AppSpacing.md,
                  0,
                ),
                itemCount: replies.length,
                separatorBuilder: (_, _) => Gaps.hGap6,
                itemBuilder: (context, i) {
                  return Material(
                    color: context.colors.surface2,
                    borderRadius: AppRadius.chipAll,
                    child: InkWell(
                      onTap: () => onPick(replies[i]),
                      borderRadius: AppRadius.chipAll,
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                        decoration: BoxDecoration(
                          borderRadius: AppRadius.chipAll,
                          border: Border.all(color: context.colors.line),
                        ),
                        child: Text(
                          replies[i],
                          style: AppTextStyle.caption(color: context.colors.text),
                        ),
                      ),
                    ),
                  );
                },
              ),
            );
          },
        );
      },
    );
  }
}

/// Warning shown when the other person asks to pay outside the app.
class BuildChatSafetyBanner extends StatelessWidget {
  final ObsValue<SafetyFlag?> flagObs;
  final VoidCallback onDismiss;

  const BuildChatSafetyBanner({super.key, required this.flagObs, required this.onDismiss});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: flagObs,
      builder: (context, flag) {
        if (flag == null) return const SizedBox.shrink();
        return Container(
          width: double.infinity,
          padding: const EdgeInsetsDirectional.fromSTEB(
            AppSpacing.lg,
            AppSpacing.md,
            AppSpacing.sm,
            AppSpacing.md,
          ),
          color: context.colors.amberBg,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Icon(Icons.shield_outlined, size: 18, color: context.colors.amber),
              ),
              Gaps.hGap9,
              Expanded(
                child: Text(
                  flag == SafetyFlag.advancePayment
                      ? Translate.s.ai_safety_advance
                      : Translate.s.ai_safety_peer_banner,
                  style: AppTextStyle.caption(color: context.colors.text),
                ),
              ),
              TextButton(
                onPressed: onDismiss,
                child: Text(
                  Translate.s.ai_safety_dismiss,
                  style: AppTextStyle.caption(color: context.colors.amber),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Confirmation before sending a message the safety rules flagged.
/// Pops `true` to send anyway.
class BuildChatSafetySheet extends StatelessWidget {
  final SafetyFlag flag;

  const BuildChatSafetySheet({super.key, required this.flag});

  String _message() {
    return switch (flag) {
      SafetyFlag.offPlatformPayment => Translate.s.ai_safety_off_platform,
      SafetyFlag.advancePayment => Translate.s.ai_safety_advance,
      SafetyFlag.abuse => Translate.s.ai_safety_abuse,
    };
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Icon(Icons.shield_outlined, size: 20, color: context.colors.amber),
                Gaps.hGap9,
                Text(
                  Translate.s.ai_safety_title,
                  style: AppTextStyle.sectionTitle(color: context.colors.text),
                ),
              ],
            ),
            Gaps.vGap9,
            Text(_message(), style: AppTextStyle.body(color: context.colors.text2)),
            Gaps.vGap18,
            AppTextButton.maxPrimary(
              text: Translate.s.ai_safety_edit,
              onPressed: () => Navigator.of(context).pop(false),
            ),
            Gaps.vGap9,
            AppTextButton.maxWhite(
              text: Translate.s.ai_safety_send_anyway,
              onPressed: () => Navigator.of(context).pop(true),
            ),
          ],
        ),
      ),
    );
  }
}
