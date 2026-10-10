part of '../experiences_imports.dart';

/// Small pill on a photo or under a title ("Free cancellation").
class XpChip extends StatelessWidget {
  final String label;
  final String? icon;
  final bool onImage;

  const XpChip({super.key, required this.label, this.icon, this.onImage = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = onImage ? colors.onImage : colors.button;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
        color: onImage ? colors.scrim.withValues(alpha: 0.5) : colors.actionWash,
        borderRadius: AppRadius.chipAll,
        border: onImage ? Border.all(color: colors.onImage.withValues(alpha: 0.24)) : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[AppIcon.ui(icon!, size: 13, color: fg), Gaps.hGap4],
          Text(label, style: AppTextStyle.s12_w600(color: fg).copyWith(height: 1.2)),
        ],
      ),
    );
  }
}

/// "EGP 1,400 pp" — LTR amount, the unit in the reading language.
class XpPrice extends StatelessWidget {
  final Experience experience;
  final double size;

  const XpPrice({super.key, required this.experience, this.size = 16});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.baseline,
      textBaseline: TextBaseline.alphabetic,
      children: [
        Text(
          AppMoney.egp(experience.bookable.priceEgp),
          textDirection: TextDirection.ltr,
          style: AppTextStyle.price(color: colors.text).copyWith(fontSize: size),
        ),
        if (experience.bookable.perPerson) ...[
          Gaps.hGap4,
          Text(Translate.s.xp_per_person, style: AppTextStyle.priceUnit(color: colors.text3)),
        ],
      ],
    );
  }
}

/// "For you: …" in the action colour, or amber when it is a caution.
class XpFitLine extends StatelessWidget {
  final FitReason reason;

  const XpFitLine({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final tone = reason.warning ? colors.amber : colors.button;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsetsDirectional.only(top: 2),
          child: AppIcon.ui(reason.warning ? AppIcons.wind : AppIcons.sparkle, size: 14, color: tone),
        ),
        Gaps.hGap6,
        Expanded(
          child: Text.rich(
            TextSpan(
              children: [
                if (!reason.warning)
                  TextSpan(text: '${Translate.s.xp_for_you} ', style: AppTextStyle.s12_w600(color: tone)),
                TextSpan(text: reason.text, style: AppTextStyle.s12_w400(color: reason.warning ? tone : colors.text2)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// Settles on press like the website's cards; no ripple.
class XpPressable extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;

  const XpPressable({super.key, required this.child, required this.onTap});

  @override
  State<XpPressable> createState() => _XpPressableState();
}

class _XpPressableState extends State<XpPressable> {
  var _down = false;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.disableAnimationsOf(context);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) => setState(() => _down = true),
      onTapCancel: () => setState(() => _down = false),
      onTapUp: (_) => setState(() => _down = false),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _down && !reduce ? 0.98 : 1,
        duration: const Duration(milliseconds: 140),
        curve: Curves.easeOutCubic,
        child: widget.child,
      ),
    );
  }
}

/// Section heading with an optional trailing action ("See all").
class XpSectionHead extends StatelessWidget {
  final String title;
  final String? action;
  final VoidCallback? onAction;

  const XpSectionHead({super.key, required this.title, this.action, this.onAction});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Text(
            title,
            style: AppTextStyle.s20_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context), height: 1.2),
          ),
        ),
        if (action != null)
          GestureDetector(
            onTap: onAction,
            behavior: HitTestBehavior.opaque,
            child: Padding(
              padding: const EdgeInsetsDirectional.only(start: AppSpacing.md, top: AppSpacing.xs),
              child: Text(action!, style: AppTextStyle.s13_w500(color: colors.button)),
            ),
          ),
      ],
    );
  }
}
