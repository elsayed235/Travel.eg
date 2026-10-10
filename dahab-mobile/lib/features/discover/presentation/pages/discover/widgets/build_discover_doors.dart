part of 'discover_widgets_imports.dart';

/// "How can we help in {place}?": the doors into the place as the website
/// draws them — a card with a dimensional pictogram over its name that
/// answers a tap with a one-shot spring. Things to do open the outings (or
/// the planner where the catalogue is not live); services, marked with
/// DayGi's sparkle, ask DayGi.
class BuildDiscoverDoors extends StatelessWidget {
  final RehlaDestination destination;
  final String title;
  final ValueChanged<DiscoverDoor> onOpen;
  final VoidCallback? onSeeAll;

  const BuildDiscoverDoors({
    super.key,
    required this.destination,
    required this.title,
    required this.onOpen,
    this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final doors = DiscoverContent.doors(destination);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: AppTextStyle.s20_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context), height: 1.2),
              ),
            ),
            if (onSeeAll != null)
              TextButton(
                onPressed: onSeeAll,
                style: TextButton.styleFrom(
                  foregroundColor: colors.button,
                  minimumSize: const Size(44, 44),
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(Translate.s.home_doors_see_all, style: AppTextStyle.s14_w500(color: colors.button)),
                    Gaps.hGap4,
                    AppIcon.ui(AppIcons.chevron, size: 16, color: colors.button, mirrorInRtl: true),
                  ],
                ),
              ),
          ],
        ),
        Gaps.vGap12,
        LayoutBuilder(
          builder: (context, box) {
            final columns = box.maxWidth >= 600 ? 8 : 4;
            return GridView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: columns,
                mainAxisSpacing: AppSpacing.sm + 2,
                crossAxisSpacing: AppSpacing.sm + 2,
                mainAxisExtent: 86,
              ),
              children: [
                for (var i = 0; i < doors.length; i++)
                  AppEntrance(
                    delay: Duration(milliseconds: (30 * i * (destination.tempo.inMilliseconds / 520)).round()),
                    duration: destination.tempo,
                    child: _Door(
                      door: doors[i],
                      hint: doors[i].asksDaygi
                          ? Translate.s.home_door_ask
                          : destination.liveCatalogue
                              ? Translate.s.home_door_browse
                              : Translate.s.home_door_plan,
                      onOpen: onOpen,
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }
}

class _Door extends StatefulWidget {
  final DiscoverDoor door;
  final String hint;
  final ValueChanged<DiscoverDoor> onOpen;

  const _Door({required this.door, required this.hint, required this.onOpen});

  @override
  State<_Door> createState() => _DoorState();
}

class _DoorState extends State<_Door> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
  bool _pressed = false;

  // The website's door spring: squeeze, overshoot with a little tilt, settle.
  static const _spring = Cubic(0.34, 1.3, 0.64, 1);
  late final Animation<double> _scale = TweenSequence<double>([
    TweenSequenceItem(tween: Tween(begin: 1, end: 0.82), weight: 30),
    TweenSequenceItem(tween: Tween(begin: 0.82, end: 1.12), weight: 35),
    TweenSequenceItem(tween: Tween(begin: 1.12, end: 1), weight: 35),
  ]).animate(CurvedAnimation(parent: _c, curve: _spring));
  late final Animation<double> _turn = TweenSequence<double>([
    TweenSequenceItem(tween: Tween(begin: 0, end: -6 / 360), weight: 30),
    TweenSequenceItem(tween: Tween(begin: -6 / 360, end: 3 / 360), weight: 35),
    TweenSequenceItem(tween: Tween(begin: 3 / 360, end: 0), weight: 35),
  ]).animate(CurvedAnimation(parent: _c, curve: Curves.easeOut));

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  Future<void> _tap() async {
    HapticFeedback.selectionClick();
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (!reduce) {
      _c.forward(from: 0);
      await Future.delayed(const Duration(milliseconds: 320));
    }
    if (mounted) widget.onOpen(widget.door);
  }

  void _press(bool down) {
    if (_pressed != down) setState(() => _pressed = down);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final asks = widget.door.asksDaygi;
    final label = widget.door.label(context.isArabic);
    return Semantics(
      button: true,
      label: '$label, ${widget.hint}',
      onTap: _tap,
      excludeSemantics: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) => _press(true),
        onTapCancel: () => _press(false),
        onTapUp: (_) => _press(false),
        onTap: _tap,
        child: AnimatedScale(
          scale: _pressed ? 0.97 : 1,
          duration: const Duration(milliseconds: 140),
          curve: Curves.easeOut,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: colors.surface1,
              borderRadius: const BorderRadius.all(Radius.circular(18)),
              border: Border.all(color: _pressed ? colors.line2 : colors.line),
              boxShadow: [
                BoxShadow(
                  color: colors.scrim.withValues(alpha: _pressed ? 0.1 : 0.05),
                  blurRadius: _pressed ? 14 : 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xs, AppSpacing.sm + 2, AppSpacing.xs, AppSpacing.sm - 1),
                  child: Column(
                    children: [
                      RotationTransition(
                        turns: _turn,
                        child: ScaleTransition(
                          scale: _scale,
                          child: SvgPicture.asset(widget.door.pictogram, width: 36, height: 36, excludeFromSemantics: true),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        label,
                        maxLines: 2,
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.s12_w500(color: colors.text).copyWith(height: 1.2),
                      ),
                    ],
                  ),
                ),
                if (asks)
                  PositionedDirectional(
                    top: AppSpacing.sm,
                    end: AppSpacing.sm,
                    child: AppIcon.ui(AppIcons.sparkle, size: 12, color: colors.button),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
