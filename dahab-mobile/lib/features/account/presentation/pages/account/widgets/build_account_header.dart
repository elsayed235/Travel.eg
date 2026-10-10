part of 'account_widgets_imports.dart';

class BuildAccountHeader extends StatelessWidget {
  final AccountProfileDomainModel profile;
  final VoidCallback onEdit;

  const BuildAccountHeader({
    super.key,
    required this.profile,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: context.colors.actionWash,
              borderRadius: AppRadius.buttonAll,
              border: Border.all(color: context.colors.line),
            ),
            alignment: Alignment.center,
            child: Text(
              profile.initials,
              style: AppTextStyle.s18_w600(color: context.colors.button).copyWith(fontFamily: AppFonts.display(context)),
            ),
          ),
          Gaps.hGap13,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        profile.fullName,
                        style: AppTextStyle.s18_w600(color: context.colors.text).copyWith(fontFamily: AppFonts.display(context)),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (profile.verified) ...[
                      Gaps.hGap6,
                      AppChip(label: Translate.s.account_verified, kind: AppChipKind.verified),
                    ],
                  ],
                ),
                Gaps.vGap4,
                Text(
                  profile.phone.toArabicDigits,
                  style: AppTextStyle.body(color: context.colors.text2),
                ),
                Gaps.vGap4,
                Text(
                  '${profile.email} · ${profile.city}',
                  style: AppTextStyle.caption(color: context.colors.text3),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Gaps.hGap9,
          Semantics(
            button: true,
            label: Translate.s.account_edit_profile,
            excludeSemantics: true,
            child: InkResponse(
              onTap: onEdit,
              radius: 22,
              child: SizedBox.square(
                dimension: 44,
                child: Center(
                  child: AppIcon.ui(AppIcons.chevron, size: 18, color: context.colors.text3, mirrorInRtl: true),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
