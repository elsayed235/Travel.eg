part of 'create_request_widgets_imports.dart';

class BuildCreateRequestHeader extends StatelessWidget {
  final CreateRequestController controller;
  final VoidCallback onClose;

  const BuildCreateRequestHeader({
    super.key,
    required this.controller,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.stepObs,
      builder: (context, step) {
        final current = (step + 1).toArabicDigits;
        final title = step == 0
            ? Translate.s.create_request_title
            : Translate.s.create_request_step2_title;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                GestureDetector(
                  onTap: step == 0 ? onClose : controller.goToStep1,
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsetsDirectional.only(
                      end: AppSpacing.md,
                      top: AppSpacing.xs,
                      bottom: AppSpacing.xs,
                    ),
                    child: Icon(
                      step == 0 ? Icons.close : Icons.arrow_forward_ios_rounded,
                      size: step == 0 ? 22 : 14,
                      color: context.colors.text,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  Translate.s.create_request_step(current, '2'.toArabicDigits),
                  style: AppTextStyle.caption(color: context.colors.text2),
                ),
              ],
            ),
            Gaps.vGap13,
            Text(
              title,
              textAlign: TextAlign.center,
              style: AppTextStyle.screenTitle(color: context.colors.text),
            ),
            if (step == 1) ...[
              Gaps.vGap6,
              Text(
                Translate.s.create_request_step2_subtitle,
                textAlign: TextAlign.center,
                style: AppTextStyle.caption(color: context.colors.text2),
              ),
            ],
            Gaps.vGap13,
            _CreateRequestProgress(progress: step == 0 ? 0.5 : 1.0),
          ],
        );
      },
    );
  }
}

class _CreateRequestProgress extends StatelessWidget {
  final double progress;

  const _CreateRequestProgress({required this.progress});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final filled = constraints.maxWidth * progress.clamp(0.0, 1.0);
        return SizedBox(
          height: 3,
          child: Stack(
            children: [
              Container(
                width: double.infinity,
                height: 1,
                margin: const EdgeInsets.symmetric(vertical: 1),
                color: context.colors.line,
              ),
              Align(
                alignment: AlignmentDirectional.centerStart,
                child: Container(
                  width: filled,
                  height: 3,
                  decoration: BoxDecoration(
                    color: context.colors.text,
                    borderRadius: AppRadius.chipAll,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
