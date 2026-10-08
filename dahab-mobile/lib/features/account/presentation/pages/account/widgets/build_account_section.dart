part of 'account_widgets_imports.dart';

class BuildAccountSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const BuildAccountSection({
    super.key,
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: AppTextStyle.caption(color: context.colors.text2)),
        Gaps.vGap9,
        Container(
          decoration: BoxDecoration(
            color: context.colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: context.colors.line),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }
}
