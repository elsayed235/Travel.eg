part of 'conversation_widgets_imports.dart';

class BuildChatDateChip extends StatelessWidget {
  final String label;

  const BuildChatDateChip({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
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
            border: Border.all(color: context.colors.line),
          ),
          child: Text(
            label,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
        ),
      ),
    );
  }
}
