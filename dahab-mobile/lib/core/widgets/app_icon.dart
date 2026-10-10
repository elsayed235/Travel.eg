import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// The app's line icons (`assets/icons/ui`, `assets/icons/doors`): one 24px
/// grid, 1.8 stroke, tinted with [color]. Directional glyphs mirror in RTL.
/// Without [color] or [size] it follows the ambient [IconTheme], like [Icon].
class AppIcon extends StatelessWidget {
  final String asset;
  final double? size;
  final Color? color;
  final bool mirrorInRtl;

  const AppIcon(this.asset, {super.key, this.color, this.size, this.mirrorInRtl = false});

  const AppIcon.ui(String name, {super.key, this.color, this.size, this.mirrorInRtl = false})
      : asset = 'assets/icons/ui/$name.svg';

  @override
  Widget build(BuildContext context) {
    final theme = IconTheme.of(context);
    final side = size ?? theme.size ?? 20;
    Widget icon = SvgPicture.asset(
      asset,
      width: side,
      height: side,
      colorFilter: ColorFilter.mode(color ?? theme.color ?? DefaultTextStyle.of(context).style.color!, BlendMode.srcIn),
      excludeFromSemantics: true,
    );
    if (mirrorInRtl && Directionality.of(context) == TextDirection.rtl) {
      icon = Transform.flip(flipX: true, child: icon);
    }
    // Like [Icon]: tight parent constraints grow the box, never the glyph.
    return SizedBox(width: side, height: side, child: Center(child: icon));
  }
}

/// Names under `assets/icons/ui`, so call sites can't typo a path.
abstract final class AppIcons {
  static const search = 'search';
  static const sliders = 'sliders';
  static const close = 'close';
  static const chevron = 'chevron';
  static const back = 'back';
  static const check = 'check';
  static const globe = 'globe';
  static const sun = 'sun';
  static const moon = 'moon';
  static const device = 'device';
  static const user = 'user';
  static const bell = 'bell';
  static const sparkle = 'sparkle';
  static const sos = 'sos';
  static const call = 'call';
  static const mail = 'mail';
  static const chat = 'chat';
  static const clock = 'clock';
  static const pin = 'pin';
  static const question = 'question';
  static const book = 'book';
  static const info = 'info';
  static const doc = 'doc';
  static const shield = 'shield';
  static const logout = 'logout';
  static const external = 'external';
  static const compass = 'compass';
  static const wind = 'wind';
  static const calendar = 'calendar';
  static const tag = 'tag';
  static const seedling = 'seedling';
  static const hourglass = 'hourglass';
  static const wallet = 'wallet';
  static const lock = 'lock';
  static const minus = 'minus';
  static const plus = 'plus';
  static const sunset = 'sunset';
  static const mountain = 'mountain';
  static const star = 'star';
  static const starFill = 'star_fill';
  static const mic = 'mic';
  static const chevronDown = 'chevron_down';
  static const chevronUp = 'chevron_up';
  static const calendarCheck = 'calendar_check';
  static const offline = 'offline';
  static const checkCircle = 'check_circle';
  static const arrow = 'arrow';
  static const arrowUp = 'arrow_up';
  static const waves = 'waves';
  static const drop = 'drop';
  static const list = 'list';
  static const swap = 'swap';
  static const gauge = 'gauge';
  static const hike = 'hike';
  static const radioOn = 'radio_on';
  static const radioOff = 'radio_off';
  static const qr = 'qr';
  static const group = 'group';
  static const voice = 'voice';
  static const quote = 'quote';
  static const heart = 'heart';
  static const edit = 'edit';
  static const camera = 'camera';
  static const refresh = 'refresh';
  static const bank = 'bank';
  static const dive = 'dive';
  static const food = 'food';
  static const wellness = 'wellness';
}
