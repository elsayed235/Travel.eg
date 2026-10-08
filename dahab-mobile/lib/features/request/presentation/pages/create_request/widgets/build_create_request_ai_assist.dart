part of 'create_request_widgets_imports.dart';

/// Voice + "tidy it up" actions under the description, and the review banner
/// shown after the smart composer fills the form.
class BuildCreateRequestAiAssist extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestAiAssist({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ObsValueConsumer(
          observable: controller.listeningObs,
          builder: (context, listening) {
            return ObsValueConsumer(
              observable: controller.structuringObs,
              builder: (context, structuring) {
                return Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    _AiPillButton(
                      icon: listening ? Icons.stop_rounded : Icons.mic_none_rounded,
                      label: listening
                          ? Translate.s.ai_voice_stop
                          : Translate.s.ai_voice_button,
                      active: listening,
                      onTap: structuring ? null : controller.toggleVoice,
                    ),
                    _AiPillButton(
                      icon: Icons.auto_awesome_outlined,
                      label: structuring
                          ? Translate.s.ai_compose_loading
                          : Translate.s.ai_compose_button,
                      busy: structuring,
                      onTap: listening || structuring ? null : controller.structureWithAi,
                    ),
                    if (listening)
                      Text(
                        Translate.s.ai_voice_listening,
                        style: AppTextStyle.micro(color: context.colors.green),
                      ),
                  ],
                );
              },
            );
          },
        ),
        ObsValueConsumer(
          observable: controller.aiResultObs,
          builder: (context, result) {
            if (result == null) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(top: AppSpacing.md),
              child: _AiResultBanner(
                result: result,
                onUndo: controller.undoAi,
                onDismiss: controller.dismissAi,
              ),
            );
          },
        ),
      ],
    );
  }
}

class _AiPillButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final bool active;
  final bool busy;

  const _AiPillButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.active = false,
    this.busy = false,
  });

  @override
  Widget build(BuildContext context) {
    final enabled = onTap != null;
    final fg = active
        ? context.colors.green
        : enabled || busy
            ? context.colors.text
            : context.colors.text3;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.buttonAll,
        splashFactory: NoSplash.splashFactory,
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          decoration: BoxDecoration(
            color: active ? context.colors.greenBg : context.colors.surface2,
            borderRadius: AppRadius.buttonAll,
            border: Border.all(color: active ? context.colors.green : context.colors.line),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (busy)
                SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(strokeWidth: 1.6, color: fg),
                )
              else
                Icon(icon, size: 16, color: fg),
              Gaps.hGap6,
              Text(label, style: AppTextStyle.caption(color: fg)),
            ],
          ),
        ),
      ),
    );
  }
}

class _AiResultBanner extends StatelessWidget {
  final StructuredRequestDomainModel result;
  final VoidCallback onUndo;
  final VoidCallback onDismiss;

  const _AiResultBanner({
    required this.result,
    required this.onUndo,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final lowConfidence =
        result.confidence < StructuredRequestDomainModel.autoApplyThreshold;
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(
        AppSpacing.lg,
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome, size: 16, color: context.colors.green),
              Gaps.hGap6,
              Expanded(
                child: Text(
                  Translate.s.ai_compose_applied_title,
                  style: AppTextStyle.itemTitle(color: context.colors.text),
                ),
              ),
              TextButton(
                onPressed: onUndo,
                child: Text(
                  Translate.s.ai_compose_undo,
                  style: AppTextStyle.caption(color: context.colors.text),
                ),
              ),
              IconButton(
                onPressed: onDismiss,
                visualDensity: VisualDensity.compact,
                icon: Icon(Icons.close_rounded, size: 18, color: context.colors.text3),
              ),
            ],
          ),
          if (result.title != null) ...[
            Text(
              Translate.s.ai_compose_title_value(result.title!),
              style: AppTextStyle.body(color: context.colors.text),
            ),
            Gaps.vGap6,
          ],
          if (result.specs.isNotEmpty) ...[
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final spec in result.specs) AppChip(label: spec.toArabicDigits),
              ],
            ),
            Gaps.vGap6,
          ],
          Text(
            lowConfidence
                ? Translate.s.ai_compose_low_confidence
                : Translate.s.ai_compose_applied_hint,
            style: AppTextStyle.micro(
              color: lowConfidence ? context.colors.amber : context.colors.text2,
            ),
          ),
        ],
      ),
    );
  }
}
