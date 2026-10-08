part of 'account_widgets_imports.dart';

class BuildAccountTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final bool showChevron;
  final bool showDivider;

  const BuildAccountTile({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.showChevron = true,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    final isRtl = Directionality.of(context) == TextDirection.rtl;
    return Column(
      children: [
        Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            splashFactory: NoSplash.splashFactory,
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: AppSpacing.lg,
                vertical: AppSpacing.lg,
              ),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: context.colors.surface2,
                      borderRadius: AppRadius.buttonAll,
                    ),
                    child: Icon(icon, size: 18, color: context.colors.text2),
                  ),
                  Gaps.hGap13,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: AppTextStyle.body(color: context.colors.text)),
                        if (subtitle != null) ...[
                          Gaps.vGap4,
                          Text(
                            subtitle!,
                            style: AppTextStyle.caption(color: context.colors.text3),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ],
                    ),
                  ),
                  if (showChevron)
                    Icon(
                      Icons.chevron_right,
                      size: 20,
                      color: context.colors.text3,
                    ),
                ],
              ),
            ),
          ),
        ),
        if (showDivider)
          Divider(
            height: 1,
            thickness: 1,
            color: context.colors.line,
            indent: isRtl ? 0 : 67,
            endIndent: isRtl ? 67 : 0,
          ),
      ],
    );
  }
}
