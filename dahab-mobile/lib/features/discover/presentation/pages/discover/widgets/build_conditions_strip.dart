part of 'discover_widgets_imports.dart';

/// "Right now in {place}": only what was measured. No reading, no strip —
/// never a number nobody measured.
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
        successBuilder: (context, c, _) => AppEntrance(
          child: _Strip(c: c, place: place),
        ),
      ),
    );
  }
}

class _Strip extends StatelessWidget {
  final ConditionsDomainModel c;
  final String place;

  const _Strip({required this.c, required this.place});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final sunset = c.sunsetClock;
    final observed = c.observedClock;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(Translate.s.discover_live(place), style: AppTextStyle.s13_w500(color: colors.text3)),
        Gaps.vGap8,
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            _Chip(
              icon: Icons.thermostat_outlined,
              tint: colors.highlight,
              label: Translate.s.discover_air,
              value: '${c.airTemperatureC.round()}°',
            ),
            _Chip(
              icon: Icons.air_rounded,
              tint: colors.button,
              label: Translate.s.discover_wind,
              value: '${c.windKnots.round()} kn ${c.windDirection}',
            ),
            if (c.waterTemperatureC != null)
              _Chip(
                icon: Icons.water_drop_outlined,
                tint: colors.button,
                label: Translate.s.discover_water,
                value: '${c.waterTemperatureC!.round()}°',
              ),
            if (sunset != null)
              _Chip(
                icon: Icons.wb_twilight_outlined,
                tint: colors.highlight,
                label: Translate.s.discover_sunset,
                value: sunset,
              ),
          ],
        ),
        if (c.source.isNotEmpty && observed != null) ...[
          Gaps.vGap6,
          Text(Translate.s.discover_source(c.source, observed), style: AppTextStyle.micro(color: colors.text3)),
        ],
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  final IconData icon;
  final Color tint;
  final String label;
  final String value;

  const _Chip({required this.icon, required this.tint, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.buttonAll,
        border: Border.all(color: colors.line),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: tint),
          Gaps.hGap6,
          Text(label, style: AppTextStyle.s13_w500(color: colors.text2)),
          Gaps.hGap6,
          // Numbers and units stay left-to-right inside Arabic text.
          Text(
            value,
            textDirection: TextDirection.ltr,
            style: AppTextStyle.s13_w500(color: colors.text).copyWith(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
