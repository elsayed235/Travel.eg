part of 'plan_widgets_imports.dart';

/// A programme's photo from the API host, falling back to the place's own
/// hero while it loads or if it is missing.
class BuildProgrammeImage extends StatelessWidget {
  final ProgrammeDomainModel programme;

  const BuildProgrammeImage({super.key, required this.programme});

  @override
  Widget build(BuildContext context) {
    final fallback = Image.asset(programme.destination.heroImagePath, fit: BoxFit.cover);
    if (programme.heroImage.isEmpty) return fallback;
    return Image.network(
      AppConfig.instance.assetUrl(programme.heroImage),
      fit: BoxFit.cover,
      frameBuilder: (context, child, frame, sync) => sync
          ? child
          : AnimatedSwitcher(duration: const Duration(milliseconds: 400), child: frame == null ? fallback : child),
      errorBuilder: (_, _, _) => fallback,
    );
  }
}
