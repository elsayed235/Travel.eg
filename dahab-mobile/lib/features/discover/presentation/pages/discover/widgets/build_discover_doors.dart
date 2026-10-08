part of 'discover_widgets_imports.dart';

/// "What brings you to {place}?" — the doors into the place. Each answers a
/// tap with a short squeeze-and-spring before it opens.
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
          style: AppTextStyle.screenTitle(color: context.colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
        Gaps.vGap13,
        LayoutBuilder(
          builder: (context, box) {
            // One row on tablets, two on phones; tiles keep a fixed height.
            final wide = box.maxWidth >= 600;
            final columns = doors.length > 6 ? (wide ? 8 : 4) : (wide ? 6 : 3);
            return GridView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: columns,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                mainAxisExtent: 108,
              ),
              children: [
                for (var i = 0; i < doors.length; i++)
                  AppEntrance(
                    delay: Duration(milliseconds: (40 * i * (destination.tempo.inMilliseconds / 520)).round()),
                    duration: destination.tempo,
                    child: _Door(door: doors[i], onOpen: onOpen),
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
  final ValueChanged<DiscoverDoor> onOpen;

  const _Door({required this.door, required this.onOpen});

  @override
  State<_Door> createState() => _DoorState();
}

class _DoorState extends State<_Door> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 560));

  // Squeeze, overshoot, settle — the website's door pulse.
  late final Animation<double> _scale = TweenSequence<double>([
    TweenSequenceItem(tween: Tween(begin: 1, end: 0.84), weight: 25),
    TweenSequenceItem(tween: Tween(begin: 0.84, end: 1.1), weight: 40),
    TweenSequenceItem(tween: Tween(begin: 1.1, end: 1), weight: 35),
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
      await Future.delayed(const Duration(milliseconds: 300));
    }
    if (mounted) widget.onOpen(widget.door);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(
        borderRadius: AppRadius.cardAll,
        side: BorderSide(color: colors.line),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: _tap,
        child: Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xs, vertical: AppSpacing.md),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ScaleTransition(
                scale: _scale,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(color: colors.actionWash, shape: BoxShape.circle),
                  child: Icon(widget.door.icon, color: colors.button, size: 24),
                ),
              ),
              Gaps.vGap8,
              Text(
                widget.door.label(context.isArabic),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyle.s12_w600(color: colors.text).copyWith(height: 1.25),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
