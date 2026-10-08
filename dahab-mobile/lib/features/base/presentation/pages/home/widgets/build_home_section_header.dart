part of 'home_widgets_imports.dart';

class BuildHomeSectionHeader extends StatelessWidget {
  final int visibleCount;
  final VoidCallback onViewAll;

  const BuildHomeSectionHeader({
    super.key,
    required this.visibleCount,
    required this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            Translate.s.home_requests_section,
            style: AppTextStyle.h4(color: context.colors.text),
          ),
        ),
        TextButton(
          onPressed: onViewAll,
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
            minimumSize: const Size(0, 36),
            backgroundColor: context.colors.background
          ),
          child: Text(
            Translate.s.home_view_all(visibleCount.toArabicDigits),
            style: AppTextStyle.caption(color: context.colors.text),
          ),
        ),
      ],
    );
  }
}
