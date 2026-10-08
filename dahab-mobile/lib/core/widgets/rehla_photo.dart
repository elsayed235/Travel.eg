import 'package:flutter/material.dart';
import 'package:rehla/core/constants/app_config.dart';

/// A photograph from the website's library (`/images/...` on the host), with
/// a bundled photo of the same kind of place when there is no host or no
/// connection.
class RehlaPhoto extends StatelessWidget {
  final String webPath;
  final String asset;
  final BoxFit fit;

  const RehlaPhoto({super.key, required this.webPath, required this.asset, this.fit = BoxFit.cover});

  @override
  Widget build(BuildContext context) {
    final fallback = Image.asset(asset, fit: fit, gaplessPlayback: true);
    if (webPath.isEmpty || AppConfig.instance.hostUrl.trim().isEmpty) return fallback;
    return Image.network(
      AppConfig.instance.assetUrl(webPath),
      fit: fit,
      gaplessPlayback: true,
      frameBuilder: (context, child, frame, sync) {
        if (sync || frame != null) return child;
        return fallback;
      },
      errorBuilder: (_, _, _) => fallback,
    );
  }
}

/// Pages pushed from a tab (an experience, checkout): a short rise and fade,
/// nothing under reduced motion.
class RehlaPageRoute<T> extends PageRouteBuilder<T> {
  RehlaPageRoute({required WidgetBuilder builder})
      : super(
          transitionDuration: const Duration(milliseconds: 380),
          reverseTransitionDuration: const Duration(milliseconds: 260),
          pageBuilder: (context, _, _) => builder(context),
          transitionsBuilder: (context, animation, _, child) {
            if (MediaQuery.disableAnimationsOf(context)) return child;
            final curved = CurvedAnimation(parent: animation, curve: Curves.easeOutCubic, reverseCurve: Curves.easeInCubic);
            return FadeTransition(
              opacity: curved,
              child: SlideTransition(
                position: Tween(begin: const Offset(0, 0.04), end: Offset.zero).animate(curved),
                child: child,
              ),
            );
          },
        );
}
