part of 'orders_widgets_imports.dart';

class BuildOrdersEmpty extends StatelessWidget {
  const BuildOrdersEmpty({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      margin: const EdgeInsets.only(top: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: const BorderRadius.all(Radius.circular(18)),
      ),
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(color: colors.surface1, shape: BoxShape.circle),
            child: Icon(Icons.receipt_long_outlined, size: 26, color: colors.text2),
          ),
          Gaps.vGap13,
          Text(
            Translate.s.orders_empty_title,
            style: AppTextStyle.h4(color: colors.text),
            textAlign: TextAlign.center,
          ),
          Gaps.vGap6,
          Text(
            Translate.s.orders_empty_subtitle,
            style: AppTextStyle.body(color: colors.text2),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
