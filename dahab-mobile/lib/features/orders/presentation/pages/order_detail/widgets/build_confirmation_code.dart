part of 'order_detail_widgets_imports.dart';

class BuildConfirmationCode extends StatelessWidget {
  final String code;
  final bool verified;
  final VoidCallback onCopy;
  final VoidCallback? onShowFullscreen;

  const BuildConfirmationCode({
    super.key,
    required this.code,
    required this.onCopy,
    this.verified = false,
    this.onShowFullscreen,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: context.colors.surface2,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line2),
      ),
      child: Column(
        children: [
          Text(
            Translate.s.order_detail_code_title,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap9,
          Text(
            code.toArabicDigits,
            style: AppTextStyle.screenTitle(color: context.colors.text).copyWith(
              letterSpacing: 6,
            ),
            textAlign: TextAlign.center,
          ),
          Gaps.vGap6,
          Text(
            verified
                ? Translate.s.order_detail_code_used_hint
                : Translate.s.order_detail_code_hint,
            style: AppTextStyle.micro(color: context.colors.text3),
            textAlign: TextAlign.center,
          ),
          if (!verified) ...[
            Gaps.vGap13,
            if (onShowFullscreen != null) ...[
              AppTextButton.maxPrimary(
                text: Translate.s.handover_open_ritual,
                onPressed: onShowFullscreen,
              ),
              Gaps.vGap9,
            ],
            AppTextButton.maxCustom(
              text: Translate.s.order_detail_code_copy,
              onPressed: onCopy,
              bgColor: context.colors.surface3,
              txtColor: context.colors.text,
              maxHeight: 44,
            ),
          ] else ...[
            Gaps.vGap13,
            AppChip(
              label: Translate.s.order_detail_code_verified_badge,
              kind: AppChipKind.available,
            ),
          ],
        ],
      ),
    );
  }
}
