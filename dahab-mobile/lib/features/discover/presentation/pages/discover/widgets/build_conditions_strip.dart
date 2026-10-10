part of 'discover_widgets_imports.dart';

/// What it is like there right now, on frosted glass over the hero (the
/// website's live strip): air, wind, water and sunset as measured, then who
/// measured it and when. No reading, no panel — never a number nobody
/// measured. While the reading loads, the glass holds its place.
class BuildHeroConditions extends StatelessWidget {
  final ConditionsRequester requester;
  final String place;

  const BuildHeroConditions({super.key, required this.requester, required this.place});

  @override
  Widget build(BuildContext context) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeOutCubic,
      alignment: AlignmentDirectional.topStart,
      child: RequesterConsumer<ConditionsDomainModel>(
        requester: requester,
        loadingBuilder: (_) => const _Glass(child: _Readings(c: null)),
        failureBuilder: (_, _, _) => const SizedBox(width: double.infinity),
        successBuilder: (context, c, _) => AppEntrance(
          offsetY: 8,
          child: _Glass(child: _Readings(c: c)),
        ),
      ),
    );
  }
}

class _Glass extends StatelessWidget {
  final Widget child;

  const _Glass({required this.child});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ClipRRect(
      borderRadius: const BorderRadius.all(Radius.circular(18)),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: colors.scrim.withValues(alpha: 0.26),
            borderRadius: const BorderRadius.all(Radius.circular(18)),
            border: Border.all(color: colors.onImage.withValues(alpha: 0.16)),
          ),
          child: child,
        ),
      ),
    );
  }
}

class _Readings extends StatelessWidget {
  /// Null while loading: the cells keep their shape with a dash.
  final ConditionsDomainModel? c;

  const _Readings({required this.c});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final c = this.c;
    final arabic = context.isArabic;
    final observed = c?.observedClock;
    final divider = Container(width: 1, height: 30, color: colors.onImage.withValues(alpha: 0.14));
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xs, AppSpacing.md, AppSpacing.xs, AppSpacing.sm),
          child: Row(
            children: [
              _Cell(
                icon: AppIcons.sun,
                label: Translate.s.discover_air,
                value: c == null ? '—' : '${c.airTemperatureC.round()}°',
              ),
              divider,
              _Cell(
                icon: AppIcons.wind,
                label: c == null || c.windDirection.isEmpty
                    ? Translate.s.discover_wind
                    : '${Translate.s.discover_wind} · ${WindLabel.compass(c.windDirection, arabic: arabic)}',
                value: c == null ? '—' : '${c.windKnots.round()} ${Translate.s.unit_knots}',
                // "4 knots" / "٤ عقدة" reads in the language's own order.
                ltr: false,
              ),
              divider,
              _Cell(
                icon: AppIcons.drop,
                label: Translate.s.discover_water,
                value: c?.waterTemperatureC == null ? '—' : '${c!.waterTemperatureC!.round()}°',
              ),
              divider,
              _Cell(icon: AppIcons.sunset, label: Translate.s.discover_sunset, value: c?.sunsetClock ?? '—'),
            ],
          ),
        ),
        Container(height: 1, color: colors.onImage.withValues(alpha: 0.1)),
        Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm - 1),
          child: Row(
            children: [
              _LiveDot(active: c != null),
              Gaps.hGap6,
              Expanded(
                child: Text(
                  c != null && c.source.isNotEmpty && observed != null
                      ? Translate.s.home_live_from(c.source, observed)
                      : Translate.s.home_live,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyle.micro(color: colors.onImage.withValues(alpha: 0.78)),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Cell extends StatelessWidget {
  final String icon;
  final String label;
  final String value;

  /// Degrees and clock times stay left-to-right inside Arabic text.
  final bool ltr;

  const _Cell({required this.icon, required this.label, required this.value, this.ltr = true});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Expanded(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              AppIcon.ui(icon, size: 14, color: colors.highlight),
              Gaps.hGap4,
              Flexible(
                child: Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.fade,
                  softWrap: false,
                  textDirection: ltr ? TextDirection.ltr : null,
                  style: AppTextStyle.s16_w500(
                    color: colors.onImage,
                  ).copyWith(fontFamily: AppFonts.display(context), fontWeight: FontWeight.w700, height: 1.1),
                ),
              ),
            ],
          ),
          Gaps.vGap4,
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: AppTextStyle.micro(color: colors.onImage.withValues(alpha: 0.72)),
          ),
        ],
      ),
    );
  }
}

/// A small green light that breathes while the reading is live.
class _LiveDot extends StatefulWidget {
  final bool active;

  const _LiveDot({required this.active});

  @override
  State<_LiveDot> createState() => _LiveDotState();
}

class _LiveDotState extends State<_LiveDot> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (reduce) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final color = widget.active ? colors.green : colors.onImage.withValues(alpha: 0.5);
    return SizedBox(
      width: 12,
      height: 12,
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          final t = widget.active ? _c.value : 0.0;
          return Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 6 + 6 * t,
                height: 6 + 6 * t,
                decoration: BoxDecoration(shape: BoxShape.circle, color: color.withValues(alpha: 0.45 * (1 - t))),
              ),
              Container(width: 6, height: 6, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
            ],
          );
        },
      ),
    );
  }
}
