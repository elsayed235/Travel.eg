part of 'discover_widgets_imports.dart';

/// "What brings you to {place}?": the doors into the place as an app-style
/// grid, an icon tile over its name. Things to do carry a lit tile and open
/// the outings (or the planner where the catalogue is not live); services
/// carry a soft tile with DayGi's sparkle and ask DayGi.
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
                mainAxisSpacing: AppSpacing.lg,
                crossAxisSpacing: AppSpacing.sm,
                mainAxisExtent: 96,
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
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 480));
  bool _pressed = false;

  // The icon's squeeze, overshoot and settle: the website's door pulse, softened.
  late final Animation<double> _pulse = TweenSequence<double>([
    TweenSequenceItem(tween: Tween(begin: 1, end: 0.86), weight: 25),
    TweenSequenceItem(tween: Tween(begin: 0.86, end: 1.08), weight: 40),
    TweenSequenceItem(tween: Tween(begin: 1.08, end: 1), weight: 35),
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
      await Future.delayed(const Duration(milliseconds: 220));
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
          scale: _pressed ? 0.94 : 1,
          duration: const Duration(milliseconds: 140),
          curve: Curves.easeOut,
          child: Column(
            children: [
              ScaleTransition(
                scale: _pulse,
                child: _DoorIcon(icon: widget.door.icon, soft: asks),
              ),
              Gaps.vGap8,
              Text(
                label,
                maxLines: 2,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyle.s12_w500(color: colors.text).copyWith(height: 1.25),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A squircle: lit lagoon for things to do, a soft wash plus DayGi's
/// sparkle for the questions DayGi answers.
class _DoorIcon extends StatelessWidget {
  final String icon;
  final bool soft;

  const _DoorIcon({required this.icon, required this.soft});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return SizedBox(
      width: 58,
      height: 58,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.all(Radius.circular(18)),
              color: soft ? colors.surface1 : null,
              border: soft ? Border.all(color: colors.line) : null,
              gradient: soft
                  ? null
                  : LinearGradient(
                      begin: AlignmentDirectional.topStart,
                      end: AlignmentDirectional.bottomEnd,
                      colors: [Color.lerp(colors.button, colors.onImage, 0.22)!, colors.button],
                    ),
              boxShadow: soft
                  ? null
                  : [BoxShadow(color: colors.button.withValues(alpha: 0.28), blurRadius: 14, offset: const Offset(0, 6))],
            ),
            alignment: Alignment.center,
            child: AppIcon(icon, size: 26, color: soft ? colors.button : colors.onButton),
          ),
          if (soft)
            PositionedDirectional(
              top: -4,
              end: -4,
              child: Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: colors.button,
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.bg, width: 2),
                ),
                alignment: Alignment.center,
                child: AppIcon.ui(AppIcons.sparkle, size: 10, color: colors.onButton),
              ),
            ),
        ],
      ),
    );
  }
}
