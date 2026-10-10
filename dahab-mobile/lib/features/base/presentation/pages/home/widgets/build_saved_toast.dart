part of 'home_widgets_imports.dart';

/// "Saved to your plans · See plans": rises above the bar for a few seconds
/// after a save, wherever the save happened (planner, plan sheet, Home).
/// The traveler stays where they are; the list is one tap away.
class BuildSavedToast extends StatelessWidget {
  final KeptTrip? trip;
  final VoidCallback onSee;

  const BuildSavedToast({super.key, required this.trip, required this.onSee});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final visible = trip != null;
    final reduce = MediaQuery.disableAnimationsOf(context);
    final duration = reduce ? Duration.zero : const Duration(milliseconds: 260);
    return IgnorePointer(
      ignoring: !visible,
      child: ExcludeSemantics(
        excluding: !visible,
        child: AnimatedSlide(
          offset: visible ? Offset.zero : const Offset(0, 0.6),
          duration: duration,
          curve: Curves.easeOutCubic,
          child: AnimatedOpacity(
            opacity: visible ? 1 : 0,
            duration: duration,
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
              child: Container(
                padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.md, AppSpacing.sm, AppSpacing.xs, AppSpacing.sm),
                decoration: BoxDecoration(
                  color: colors.text.withValues(alpha: 0.94),
                  borderRadius: AppRadius.cardAll,
                  boxShadow: [BoxShadow(color: colors.scrim.withValues(alpha: 0.18), blurRadius: 18, offset: const Offset(0, 6))],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(color: colors.green, shape: BoxShape.circle),
                      alignment: Alignment.center,
                      child: AppIcon.ui(AppIcons.check, size: 15, color: colors.onButton),
                    ),
                    Gaps.hGap10,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(Translate.s.plans_saved_toast, style: AppTextStyle.s13_w500(color: colors.bg).copyWith(fontWeight: FontWeight.w600)),
                          if (trip != null)
                            Text(
                              trip!.title(context.isArabic),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTextStyle.micro(color: colors.bg.withValues(alpha: 0.7)),
                            ),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: onSee,
                      style: TextButton.styleFrom(
                        foregroundColor: colors.highlight,
                        minimumSize: const Size(44, 40),
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md),
                      ),
                      child: Text(Translate.s.plans_see, style: AppTextStyle.s13_w500(color: colors.highlight).copyWith(fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
