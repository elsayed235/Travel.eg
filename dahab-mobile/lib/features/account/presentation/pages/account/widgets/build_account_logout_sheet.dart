part of 'account_widgets_imports.dart';

class BuildAccountLogoutSheet extends StatelessWidget {
  final VoidCallback onConfirm;
  final VoidCallback onCancel;

  const BuildAccountLogoutSheet({
    super.key,
    required this.onConfirm,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xl, AppSpacing.sm, AppSpacing.xl, AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(color: colors.red.withValues(alpha: 0.12), shape: BoxShape.circle),
                alignment: Alignment.center,
                child: AppIcon.ui(AppIcons.logout, size: 22, color: colors.red, mirrorInRtl: true),
              ),
            ),
            Gaps.vGap16,
            Text(
              Translate.s.account_logout_title,
              style: AppTextStyle.s18_w500(color: colors.text),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap8,
            Text(
              Translate.s.account_logout_subtitle,
              style: AppTextStyle.body(color: colors.text2),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap24,
            SizedBox(
              height: 50,
              child: FilledButton(
                onPressed: onConfirm,
                style: FilledButton.styleFrom(
                  backgroundColor: colors.red,
                  foregroundColor: colors.onImage,
                  shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                ),
                child: Text(Translate.s.label_logout, style: AppTextStyle.s16_w500(color: colors.onImage)),
              ),
            ),
            Gaps.vGap10,
            SizedBox(
              height: 50,
              child: TextButton(
                onPressed: onCancel,
                style: TextButton.styleFrom(
                  foregroundColor: colors.text,
                  shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                ),
                child: Text(Translate.s.cancel, style: AppTextStyle.s16_w500(color: colors.text)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
