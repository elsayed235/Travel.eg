part of 'discover_widgets_imports.dart';

/// Wind, water and sunset as measured, then where the reading came from and
/// when. No reading, no panel — never a number nobody measured.
class BuildConditionsStrip extends StatelessWidget {
  final ConditionsRequester requester;
  final String place;

  const BuildConditionsStrip({super.key, required this.requester, required this.place});

  @override
  Widget build(BuildContext context) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeOutCubic,
      alignment: AlignmentDirectional.topStart,
      child: RequesterConsumer<ConditionsDomainModel>(
        requester: requester,
        loadingBuilder: (_) => const SizedBox(width: double.infinity),
        failureBuilder: (_, _, _) => const SizedBox(width: double.infinity),
        successBuilder: (context, c, _) => AppEntrance(child: _Panel(c: c, place: place)),
      ),
    );
  }
}

class _Panel extends StatelessWidget {
  final ConditionsDomainModel c;
  final String place;

  const _Panel({required this.c, required this.place});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final sunset = c.sunsetClock;
    final observed = c.observedClock;
    return Container(
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          IntrinsicHeight(
            child: Row(
              children: [
                _Reading(
                  icon: Icons.air_rounded,
                  tint: colors.button,
                  label: Translate.s.discover_wind,
                  value: '${c.windKnots.round()}',
                  unit: Translate.s.unit_knots,
                  detail: WindLabel.compass(c.windDirection, arabic: context.isArabic),
                ),
                VerticalDivider(width: 1, color: colors.line),
                _Reading(
                  icon: Icons.water_drop_outlined,
                  tint: colors.button,
                  label: Translate.s.discover_water,
                  value: c.waterTemperatureC == null ? '—' : '${c.waterTemperatureC!.round()}',
                  unit: c.waterTemperatureC == null ? '' : '°',
                  detail: '${Translate.s.discover_air} ${c.airTemperatureC.round()}°',
                ),
                VerticalDivider(width: 1, color: colors.line),
                _Reading(
                  icon: Icons.wb_twilight_outlined,
                  tint: colors.highlight,
                  label: Translate.s.discover_sunset,
                  value: sunset ?? '—',
                  unit: '',
                  detail: place,
                ),
              ],
            ),
          ),
          if (c.source.isNotEmpty && observed != null) ...[
            Divider(height: 1, color: colors.line),
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
              child: Row(
                children: [
                  Container(width: 6, height: 6, decoration: BoxDecoration(color: colors.green, shape: BoxShape.circle)),
                  Gaps.hGap6,
                  Expanded(
                    child: Text(Translate.s.home_live_from(c.source, observed), style: AppTextStyle.micro(color: colors.text3)),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _Reading extends StatelessWidget {
  final IconData icon;
  final Color tint;
  final String label;
  final String value;
  final String unit;
  final String detail;

  const _Reading({
    required this.icon,
    required this.tint,
    required this.label,
    required this.value,
    required this.unit,
    required this.detail,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Expanded(
      child: Padding(
        padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 14, color: tint),
                Gaps.hGap4,
                Flexible(child: Text(label, overflow: TextOverflow.ellipsis, style: AppTextStyle.caption(color: colors.text3))),
              ],
            ),
            Gaps.vGap6,
            // Numbers and units stay left-to-right inside Arabic text.
            Text.rich(
              TextSpan(
                children: [
                  TextSpan(
                    text: value,
                    style: AppTextStyle.s24_w700(color: colors.text).copyWith(fontFamily: AppFonts.display(context), height: 1),
                  ),
                  if (unit.isNotEmpty) TextSpan(text: unit == '°' ? unit : ' $unit', style: AppTextStyle.s13_w500(color: colors.text2)),
                ],
              ),
              textDirection: TextDirection.ltr,
            ),
            if (detail.isNotEmpty) ...[
              Gaps.vGap4,
              Text(detail, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyle.micro(color: colors.text3)),
            ],
          ],
        ),
      ),
    );
  }
}
