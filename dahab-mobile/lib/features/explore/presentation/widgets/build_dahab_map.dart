part of '../explore_imports.dart';

/// A map drawn for Dahab itself: the Gulf of Aqaba coast from the Caves to
/// the Blue Lagoon, granite on the land side, depth lines on the sea side,
/// and one price pin per place — the lowest real price there, and how many
/// outings leave from it. No tiles, no key, works offline.
class BuildDahabMap extends StatefulWidget {
  final List<Experience> experiences;
  final String? selectedPlace;
  final ValueChanged<String> onPin;

  const BuildDahabMap({super.key, required this.experiences, required this.selectedPlace, required this.onPin});

  @override
  State<BuildDahabMap> createState() => _BuildDahabMapState();
}

class _BuildDahabMapState extends State<BuildDahabMap> {
  final TransformationController _transform = TransformationController();
  (Size, String)? _laidOutFor;

  static const _minLat = 28.40, _maxLat = 28.66, _minLng = 34.40, _maxLng = 34.60;

  /// Real ground proportions at this latitude (≈28.9 km tall, 19.6 km wide).
  static const _aspect = 1.47;

  static Offset project(double lat, double lng, Size world) => Offset(
        (lng - _minLng) / (_maxLng - _minLng) * world.width,
        (_maxLat - lat) / (_maxLat - _minLat) * world.height,
      );

  /// Places beyond the drawn coast (St Catherine, Nuweiba road) sit on the
  /// nearest edge rather than off the map.
  static Offset _pinAt(ExperiencePlace place, Size world) {
    final at = project(place.lat!, place.lng!, world);
    return Offset(at.dx.clamp(56.0, world.width - 56), at.dy.clamp(48.0, world.height - 8));
  }

  @override
  void dispose() {
    _transform.dispose();
    super.dispose();
  }

  /// Frames the pins on show (or the town when there are none) in the part
  /// of the map above the list sheet; reframes when the set of places changes.
  void _frame(Size viewport, Size world, Map<String, List<Experience>> pins) {
    final key = (viewport, (pins.keys.toList()..sort()).join(','));
    if (_laidOutFor == key) return;
    _laidOutFor = key;
    var focus = project(28.512, 34.515, world);
    if (pins.isNotEmpty) {
      final points = pins.values.map((items) => _pinAt(items.first.place!, world)).toList();
      final xs = points.map((p) => p.dx), ys = points.map((p) => p.dy);
      focus = Offset((xs.reduce(math.min) + xs.reduce(math.max)) / 2, (ys.reduce(math.min) + ys.reduce(math.max)) / 2);
    }
    final dx = (viewport.width / 2 - focus.dx).clamp(viewport.width - world.width, 0.0);
    final dy = (viewport.height * 0.36 - focus.dy).clamp(viewport.height - world.height, 0.0);
    _transform.value = Matrix4.translationValues(dx, dy, 0);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final pins = <String, List<Experience>>{};
    for (final e in widget.experiences) {
      if (e.place?.lat == null || e.place?.lng == null) continue;
      pins.putIfAbsent(e.placeId, () => []).add(e);
    }
    // Dive sites are labelled on the water, neighbourhoods and wadis inland.
    final labels = <MapLabel>[
      MapLabel(28.5722, 34.5375, Translate.s.map_blue_hole, sea: true),
      MapLabel(28.5095, 34.5245, Translate.s.map_eel_garden, sea: true),
      MapLabel(28.5027, 34.5205, Translate.s.map_lighthouse, sea: true),
      MapLabel(28.5005, 34.518, Translate.s.map_masbat),
      MapLabel(28.477, 34.5065, Translate.s.map_lagoon, sea: true),
      MapLabel(28.514, 34.5225, Translate.s.map_asala),
      MapLabel(28.618, 34.5625, Translate.s.map_abu_galum),
      MapLabel(28.435, 34.464, Translate.s.map_three_pools, sea: true),
      MapLabel(28.554, 34.5225, Translate.s.map_canyon),
    ];
    return LayoutBuilder(
      builder: (context, box) {
        final viewport = box.biggest;
        final width = math.max(viewport.width * 2.2, 760.0);
        final world = Size(width, width * _aspect);
        _frame(viewport, world, pins);
        return InteractiveViewer(
          transformationController: _transform,
          constrained: false,
          minScale: 0.7,
          maxScale: 2.6,
          boundaryMargin: const EdgeInsets.all(80),
          child: SizedBox.fromSize(
            size: world,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned.fill(
                  child: CustomPaint(
                    painter: _DahabMapPainter(
                      sea: Color.alphaBlend(colors.button.withValues(alpha: 0.10), colors.bg),
                      seaLine: colors.button,
                      land: colors.surface2,
                      landLine: colors.line2,
                      label: colors.text3,
                      gulf: colors.button.withValues(alpha: 0.55),
                      gulfText: Translate.s.map_gulf,
                      labels: labels,
                      arabic: arabic,
                      displayFont: AppFonts.display(context),
                    ),
                  ),
                ),
                for (final entry in pins.entries)
                  _positionedPin(entry.key, entry.value, world),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _positionedPin(String placeId, List<Experience> items, Size world) {
    final place = items.first.place!;
    final at = _pinAt(place, world);
    final from = items.map((e) => e.bookable.priceEgp).reduce(math.min);
    const w = 96.0, h = 40.0;
    return Positioned(
      left: at.dx - w / 2,
      top: at.dy - h,
      width: w,
      height: h,
      child: _PricePin(
        price: AppMoney.egp(from),
        count: items.length,
        selected: widget.selectedPlace == placeId,
        label: place.name(context.isArabic),
        onTap: () => widget.onPin(placeId),
      ),
    );
  }
}

class _PricePin extends StatelessWidget {
  final String price;
  final int count;
  final bool selected;
  final String label;
  final VoidCallback onTap;

  const _PricePin({required this.price, required this.count, required this.selected, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final bg = selected ? colors.button : colors.surface1;
    final fg = selected ? colors.onButton : colors.text;
    return Semantics(
      button: true,
      label: '$label, $price',
      selected: selected,
      onTap: onTap,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            AnimatedScale(
              scale: selected ? 1.08 : 1,
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOutBack,
              child: Container(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: AppRadius.chipAll,
                  border: Border.all(color: selected ? colors.button : colors.line2),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(price, textDirection: TextDirection.ltr, style: AppTextStyle.s12_w700(color: fg).copyWith(height: 1.2)),
                    if (count > 1) ...[
                      Gaps.hGap4,
                      Text('+${count - 1}', style: AppTextStyle.micro(color: selected ? colors.onButton : colors.text3)),
                    ],
                  ],
                ),
              ),
            ),
            Container(width: 2, height: 6, color: selected ? colors.button : colors.line2),
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(color: selected ? colors.button : colors.text2, shape: BoxShape.circle),
            ),
          ],
        ),
      ),
    );
  }
}

class MapLabel {
  final double lat;
  final double lng;
  final String text;
  final bool sea;

  const MapLabel(this.lat, this.lng, this.text, {this.sea = false});
}

class _DahabMapPainter extends CustomPainter {
  final Color sea;
  final Color seaLine;
  final Color land;
  final Color landLine;
  final Color label;
  final Color gulf;
  final String gulfText;
  final List<MapLabel> labels;
  final bool arabic;
  final String? displayFont;

  _DahabMapPainter({
    required this.sea,
    required this.seaLine,
    required this.land,
    required this.landLine,
    required this.label,
    required this.gulf,
    required this.gulfText,
    required this.labels,
    required this.arabic,
    required this.displayFont,
  });

  /// South to north along the shore, from the place records' own coordinates.
  static const _coast = <(double, double)>[
    (28.392, 34.441),
    (28.410, 34.449),
    (28.435, 34.464),
    (28.455, 34.479),
    (28.468, 34.491),
    (28.471, 34.499),
    (28.4735, 34.5075),
    (28.4775, 34.5065),
    (28.481, 34.501),
    (28.488, 34.506),
    (28.494, 34.5145),
    (28.5005, 34.5185),
    (28.5027, 34.5205),
    (28.5095, 34.525),
    (28.525, 34.5245),
    (28.540, 34.5225),
    (28.554, 34.5225),
    (28.566, 34.530),
    (28.5722, 34.538),
    (28.576, 34.5395),
    (28.595, 34.5485),
    (28.618, 34.5625),
    (28.630, 34.5705),
    (28.645, 34.5805),
    (28.668, 34.588),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = sea);
    final pts = [for (final c in _coast) _BuildDahabMapState.project(c.$1, c.$2, size)];

    Path line(double dx) {
      final p = Path()..moveTo(pts.first.dx + dx, pts.first.dy);
      for (var i = 1; i < pts.length; i++) {
        final prev = pts[i - 1];
        final cur = pts[i];
        final mid = Offset((prev.dx + cur.dx) / 2 + dx, (prev.dy + cur.dy) / 2);
        p.quadraticBezierTo(prev.dx + dx, prev.dy, mid.dx, mid.dy);
      }
      p.lineTo(pts.last.dx + dx, pts.last.dy);
      return p;
    }

    // Depth lines on the sea side.
    for (final (dx, a) in [(14.0, 0.16), (34.0, 0.10), (62.0, 0.06), (98.0, 0.04)]) {
      canvas.drawPath(
        line(dx),
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1
          ..color = seaLine.withValues(alpha: a),
      );
    }

    // Land: the shore runs past both edges, so closing it on the west fills it.
    final landPath = line(0)
      ..lineTo(-2, pts.last.dy)
      ..lineTo(-2, pts.first.dy)
      ..close();
    canvas.drawPath(landPath, Paint()..color = land);

    // Granite contours inland, fading.
    for (final (dx, a) in [(-18.0, 0.55), (-44.0, 0.35), (-80.0, 0.22), (-130.0, 0.14)]) {
      canvas.drawPath(
        line(dx),
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1
          ..color = landLine.withValues(alpha: a),
      );
    }

    canvas.drawPath(
      line(0),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.6
        ..color = landLine,
    );

    // North to south per side; a label that would touch the one above it on
    // the same side moves down, and a short leader keeps it tied to its spot.
    final placed = <bool, double>{true: -1e9, false: -1e9};
    final sorted = [...labels]..sort((a, b) => b.lat.compareTo(a.lat));
    final dot = Paint()..color = label;
    final leader = Paint()
      ..color = label.withValues(alpha: 0.5)
      ..strokeWidth = 0.8;
    for (final l in sorted) {
      final at = _BuildDahabMapState.project(l.lat, l.lng, size);
      final tp = TextPainter(
        text: TextSpan(
          text: arabic ? l.text : l.text.toUpperCase(),
          style: TextStyle(color: label, fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: arabic ? 0 : 1.4),
        ),
        textDirection: arabic ? TextDirection.rtl : TextDirection.ltr,
      )..layout();
      final top = math.max(at.dy - tp.height / 2, placed[l.sea]! + 4);
      placed[l.sea] = top + tp.height;
      final x = l.sea ? at.dx + 16 : at.dx - tp.width - 16;
      final anchor = Offset(l.sea ? x - 3 : x + tp.width + 3, top + tp.height / 2);
      canvas.drawCircle(at, 2.2, dot);
      canvas.drawLine(at, anchor, leader);
      tp.paint(canvas, Offset(x, top));
    }

    final g = TextPainter(
      text: TextSpan(
        text: gulfText,
        style: TextStyle(
          color: gulf,
          fontSize: 15,
          fontFamily: displayFont,
          fontStyle: arabic ? FontStyle.normal : FontStyle.italic,
          letterSpacing: arabic ? 0 : 2,
        ),
      ),
      textDirection: arabic ? TextDirection.rtl : TextDirection.ltr,
    )..layout();
    final gulfAt = _BuildDahabMapState.project(28.535, 34.575, size);
    canvas.save();
    canvas.translate(gulfAt.dx, gulfAt.dy);
    canvas.rotate(-math.pi / 2.6);
    g.paint(canvas, Offset(-g.width / 2, -g.height / 2));
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _DahabMapPainter old) =>
      old.sea != sea || old.land != land || old.arabic != arabic || old.labels.length != labels.length || old.label != label;
}
