part of 'discover_widgets_imports.dart';

/// Glass pill over the photograph: the current place, tap to choose another.
class BuildDestinationSwitcher extends StatelessWidget {
  final RehlaDestination current;
  final ValueChanged<RehlaDestination> onSelect;

  const BuildDestinationSwitcher({super.key, required this.current, required this.onSelect});

  Future<void> _open(BuildContext context) async {
    final colors = context.colors;
    final arabic = context.isArabic;
    final picked = await showModalBottomSheet<RehlaDestination>(
      context: context,
      backgroundColor: colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(
            AppSpacing.screenH,
            AppSpacing.xl,
            AppSpacing.screenH,
            AppSpacing.lg,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(Translate.s.discover_switch_label, style: AppTextStyle.screenTitle(color: colors.text)),
              Gaps.vGap13,
              for (final d in RehlaDestination.values)
                Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
                  child: _DestinationOption(destination: d, selected: d == current, arabic: arabic),
                ),
            ],
          ),
        ),
      ),
    );
    if (picked != null && picked != current) onSelect(picked);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      label: Translate.s.discover_switch_label,
      child: ClipRRect(
        borderRadius: AppRadius.chipAll,
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Material(
            color: colors.onImage.withValues(alpha: 0.16),
            child: InkWell(
              onTap: () => _open(context),
              child: Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(
                  AppSpacing.lg,
                  AppSpacing.sm,
                  AppSpacing.md,
                  AppSpacing.sm,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AppIcon.ui(AppIcons.pin, size: 18, color: colors.onImage),
                    Gaps.hGap6,
                    Text(current.label(context.isArabic), style: AppTextStyle.s14_w600(color: colors.onImage)),
                    Gaps.hGap4,
                    AppIcon.ui(AppIcons.chevronDown, size: 20, color: colors.onImage),
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

class _DestinationOption extends StatelessWidget {
  final RehlaDestination destination;
  final bool selected;
  final bool arabic;

  const _DestinationOption({required this.destination, required this.selected, required this.arabic});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: selected ? colors.actionWash : colors.surface2,
      borderRadius: AppRadius.cardAll,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.of(context).pop(destination),
        child: Row(
          children: [
            SizedBox(width: 92, height: 76, child: Image.asset(destination.heroImagePath, fit: BoxFit.cover)),
            Gaps.hGap13,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    destination.label(arabic),
                    style: AppTextStyle.s18_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                  ),
                  Gaps.vGap4,
                  Text(destination.tagline(arabic), style: AppTextStyle.caption(color: colors.text2), maxLines: 2),
                ],
              ),
            ),
            if (selected)
              Padding(
                padding: const EdgeInsetsDirectional.only(end: AppSpacing.lg),
                child: AppIcon.ui(AppIcons.checkCircle, color: colors.button),
              ),
          ],
        ),
      ),
    );
  }
}
