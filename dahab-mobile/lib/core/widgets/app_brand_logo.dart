import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/res.dart';

/// Brand assets for دبّرها — always pick light/dark from the active theme.
class AppBrandAssets {
  const AppBrandAssets._();

  static const lightLogo = Res.logoLight;
  static const darkLogo = Res.logoDark;

  static bool isDark(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark;
  }

  static String logoOf(BuildContext context) => isDark(context) ? darkLogo : lightLogo;

  static List<String> get all => const [lightLogo, darkLogo];
}

enum AppBrandLogoSize { compact, regular, hero }

/// Theme-aware دبّرها logo lockup.
class AppBrandLogo extends StatelessWidget {
  final AppBrandLogoSize size;
  final bool framed;
  final BoxFit fit;

  const AppBrandLogo({
    super.key,
    this.size = AppBrandLogoSize.regular,
    this.framed = true,
    this.fit = BoxFit.contain,
  });

  const AppBrandLogo.hero({super.key, this.framed = true})
      : size = AppBrandLogoSize.hero,
        fit = BoxFit.contain;

  const AppBrandLogo.compact({super.key, this.framed = false})
      : size = AppBrandLogoSize.compact,
        fit = BoxFit.contain;

  double get _side {
    switch (size) {
      case AppBrandLogoSize.compact:
        return 56;
      case AppBrandLogoSize.regular:
        return 148;
      case AppBrandLogoSize.hero:
        return 228;
    }
  }

  @override
  Widget build(BuildContext context) {
    final asset = AppBrandAssets.logoOf(context);
    final image = Image.asset(
      asset,
      width: _side,
      height: _side,
      fit: fit,
      filterQuality: FilterQuality.high,
      gaplessPlayback: true,
    );

    if (!framed) {
      return SizedBox(width: _side, height: _side, child: image);
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOutCubic,
      width: _side,
      height: _side,
      decoration: BoxDecoration(
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      clipBehavior: Clip.antiAlias,
      child: image,
    );
  }
}
