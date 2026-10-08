part of 'discover_widgets_imports.dart';

/// "What brings you to {place}?" — the doors into the place, as compact
/// tiles: an icon, the name, and what a tap does. Things to do open the
/// outings (or the planner, where the catalogue is not live yet) and carry a
/// solid icon; services ask DayGi and carry a soft one and its sparkle.
class BuildDiscoverDoors extends StatelessWidget {
  final RehlaDestination destination;
  final String title;
  final ValueChanged<DiscoverDoor> onOpen;

  const BuildDiscoverDoors({super.key, required this.destination, required this.title, required this.onOpen});

  @override
  Widget build(BuildContext context) {
    final doors = DiscoverContent.doors(destination);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyle.s20_w600(
            color: context.colors.text,
          ).copyWith(fontFamily: AppFonts.display(context), height: 1.2),
        ),
        Gaps.vGap13,
        LayoutBuilder(
          builder: (context, box) {
            final columns = box.maxWidth >= 600 ? 4 : 2;
            return GridView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: columns,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                mainAxisExtent: 60,
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

  // The icon's squeeze, overshoot and settle — the website's door pulse, softened.
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
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (!reduce) {
      _c.forward(from: 0);
      await Future.delayed(const Duration(milliseconds: 240));
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
            duration: const Duration(milliseconds: 140),
            padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md),
            decoration: BoxDecoration(
              color: _pressed ? colors.surface2 : colors.surface1,
              borderRadius: AppRadius.buttonAll,
              border: Border.all(color: colors.line),
            ),
            child: Row(
              children: [
                ScaleTransition(
                  scale: _pulse,
                  child: _DoorIcon(icon: widget.door.icon, soft: asks),
                ),
                Gaps.hGap10,
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.s14_w600(color: colors.text),
                      ),
                      Row(
                        children: [
                          if (asks) ...[Icon(Icons.auto_awesome, size: 11, color: colors.button), Gaps.hGap4],
                          Flexible(
                            child: Text(
                              widget.hint,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTextStyle.micro(color: asks ? colors.button : colors.text3),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A rounded square: solid and lit for things to do, a soft wash for the
/// questions DayGi answers.
class _DoorIcon extends StatelessWidget {
  final IconData icon;
  final bool soft;

  const _DoorIcon({required this.icon, required this.soft});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      width: 38,
      height: 38,
      decoration: BoxDecoration(
        borderRadius: AppRadius.buttonAll,
        color: soft ? colors.actionWash : null,
        gradient: soft
            ? null
            : LinearGradient(
                begin: AlignmentDirectional.topStart,
                end: AlignmentDirectional.bottomEnd,
                colors: [Color.lerp(colors.button, colors.onImage, 0.22)!, colors.button],
              ),
      ),
      child: Icon(icon, size: 20, color: soft ? colors.button : colors.onButton),
    );
  }
}
