part of 'home_widgets_imports.dart';

class BuildHomeTabPlaceholder extends StatelessWidget {
  final String icon;
  final String title;

  const BuildHomeTabPlaceholder({
    super.key,
    required this.icon,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppIcon.ui(icon, size: 40, color: context.colors.text3),
            Gaps.vGap13,
            Text(
              title,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
