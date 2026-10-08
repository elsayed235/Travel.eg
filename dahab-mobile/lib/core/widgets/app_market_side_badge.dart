import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';

/// Distinct badge: معروض (supply) vs مطلوب (demand).
class AppMarketSideBadge extends StatelessWidget {
  final MarketplaceSide side;
  final bool compact;
  final bool expanded;

  const AppMarketSideBadge({
    super.key,
    required this.side,
    this.compact = false,
    this.expanded = false,
  });

  bool get _isOffer => side == MarketplaceSide.offer;

  @override
  Widget build(BuildContext context) {
    final bg = _isOffer ? context.colors.greenBg : context.colors.amberBg;
    final fg = _isOffer ? context.colors.green : context.colors.amber;
    final icon = _isOffer ? Icons.storefront_outlined : Icons.search_outlined;
    final label = _isOffer
        ? (compact ? Translate.s.market_side_offer_short : Translate.s.market_side_offer)
        : (compact ? Translate.s.market_side_request_short : Translate.s.market_side_request);
    final hint = _isOffer
        ? Translate.s.market_side_offer_hint
        : Translate.s.market_side_request_hint;

    final badge = Container(
      padding: EdgeInsetsDirectional.symmetric(
        horizontal: compact ? AppSpacing.sm : AppSpacing.md,
        vertical: compact ? AppSpacing.xs : AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.chipAll,
        border: Border.all(color: fg.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: compact ? 12 : 14, color: fg),
          Gaps.hGap4,
          Text(label, style: AppTextStyle.micro(color: fg)),
        ],
      ),
    );

    if (!expanded) return badge;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: fg.withValues(alpha: 0.35)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: fg),
          Gaps.hGap9,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: AppTextStyle.sectionTitle(color: fg)),
                Gaps.vGap4,
                Text(hint, style: AppTextStyle.caption(color: context.colors.text2)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
