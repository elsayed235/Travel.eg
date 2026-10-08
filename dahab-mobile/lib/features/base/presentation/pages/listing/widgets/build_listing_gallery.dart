part of 'listing_widgets_imports.dart';

/// Collapsing photo header: swipe between photos, pull down to zoom,
/// collapses to a slim bar with the back button pinned.
class BuildListingGallery extends StatefulWidget {
  final ListingDetailDomainModel detail;

  const BuildListingGallery({super.key, required this.detail});

  @override
  State<BuildListingGallery> createState() => _BuildListingGalleryState();
}

class _BuildListingGalleryState extends State<BuildListingGallery> {
  final ValueNotifier<int> _page = ValueNotifier(0);

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  List<String> get _photos {
    final d = widget.detail;
    final all = [if (d.imageUrl != null) d.imageUrl!, ...d.galleryUrls];
    return all.toSet().toList();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final photos = _photos;
    final placeholder = Color(widget.detail.placeholderColor ?? 0xFFECECEA);
    return SliverAppBar(
      pinned: true,
      stretch: true,
      expandedHeight: 320,
      automaticallyImplyLeading: false,
      backgroundColor: colors.bg,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leadingWidth: 64,
      leading: Padding(
        padding: const EdgeInsetsDirectional.only(start: AppSpacing.xl),
        child: Center(
          child: _GlassButton(
            icon: Icons.arrow_back_rounded,
            tooltip: MaterialLocalizations.of(context).backButtonTooltip,
            onTap: () => AutoRouter.of(context).maybePop(),
          ),
        ),
      ),
      flexibleSpace: FlexibleSpaceBar(
        stretchModes: const [StretchMode.zoomBackground],
        collapseMode: CollapseMode.parallax,
        background: Stack(
          fit: StackFit.expand,
          children: [
            if (photos.isEmpty)
              ColoredBox(color: placeholder)
            else
              PageView.builder(
                itemCount: photos.length,
                onPageChanged: (i) => _page.value = i,
                itemBuilder: (context, i) => CachedImage(
                  url: photos[i],
                  fit: BoxFit.cover,
                  haveRadius: false,
                  bgColor: placeholder,
                ),
              ),
            // Scrim so the back button and status bar read on any photo.
            IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    stops: const [0, 0.35, 0.7, 1],
                    colors: [
                      Colors.black.withValues(alpha: 0.38),
                      Colors.black.withValues(alpha: 0),
                      Colors.black.withValues(alpha: 0),
                      Colors.black.withValues(alpha: 0.28),
                    ],
                  ),
                ),
              ),
            ),
            if (photos.length > 1)
              PositionedDirectional(
                bottom: AppSpacing.xl,
                start: 0,
                end: 0,
                child: ValueListenableBuilder<int>(
                  valueListenable: _page,
                  builder: (context, page, _) => Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (var i = 0; i < photos.length; i++)
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 220),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          width: i == page ? 18 : 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: i == page ? 1 : 0.55),
                            borderRadius: const BorderRadius.all(Radius.circular(3)),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _GlassButton extends StatelessWidget {
  final IconData icon;
  final String tooltip;
  final VoidCallback onTap;

  const _GlassButton({required this.icon, required this.tooltip, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: colors.surface1.withValues(alpha: 0.92),
        shape: CircleBorder(side: BorderSide(color: colors.line)),
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox.square(
            dimension: 42,
            child: Icon(icon, size: 20, color: colors.text),
          ),
        ),
      ),
    );
  }
}
