import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/core/widgets/CachedImage.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';

/// Days until [needBy], counted in calendar days.
int _daysLeft(DateTime needBy) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final due = DateTime(needBy.year, needBy.month, needBy.day);
  return due.difference(today).inDays;
}

/// The request needed soonest, shown large at the top of the list.
class AppFeaturedRequestCard extends StatelessWidget {
  final ListingDomainModel listing;
  final VoidCallback onOpen;

  const AppFeaturedRequestCard({super.key, required this.listing, required this.onOpen});

  static const _radius = BorderRadius.all(Radius.circular(18));

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(borderRadius: _radius, side: BorderSide(color: colors.line)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onOpen,
        splashFactory: NoSplash.splashFactory,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(
              height: 168,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  _RequestPhoto(listing: listing),
                  PositionedDirectional(
                    top: AppSpacing.md,
                    start: AppSpacing.md,
                    child: _ImageTag(
                      label: Translate.s.home_featured_label,
                      background: colors.button,
                      foreground: colors.onButton,
                    ),
                  ),
                  PositionedDirectional(
                    top: AppSpacing.md,
                    end: AppSpacing.md,
                    child: _DistanceTag(km: listing.distanceKm),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _DueBadge(needBy: listing.needBy),
                  Gaps.vGap6,
                  Text(
                    listing.title,
                    style: AppTextStyle.h4(color: colors.text),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Gaps.vGap4,
                  Text(
                    '${listing.requesterName} · ${listing.categoryName}',
                    style: AppTextStyle.caption(color: colors.text2),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Gaps.vGap13,
                  Row(
                    children: [
                      _QuantityTag(listing: listing),
                      const Spacer(),
                      _OfferButton(onTap: onOpen, prominent: true),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Standard request card (home list, explore results).
class AppRequestCard extends StatelessWidget {
  final ListingDomainModel listing;
  final VoidCallback onOpen;

  const AppRequestCard({super.key, required this.listing, required this.onOpen});

  static const _radius = BorderRadius.all(Radius.circular(14));

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(borderRadius: _radius, side: BorderSide(color: colors.line)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onOpen,
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: AppRadius.cardAll,
                child: SizedBox(
                  width: 96,
                  height: 104,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      _RequestPhoto(listing: listing),
                      PositionedDirectional(
                        bottom: AppSpacing.sm,
                        start: AppSpacing.sm,
                        child: _DistanceTag(km: listing.distanceKm),
                      ),
                    ],
                  ),
                ),
              ),
              Gaps.hGap13,
              Expanded(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 104),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _DueBadge(needBy: listing.needBy),
                      Gaps.vGap4,
                      Text(
                        listing.title,
                        style: AppTextStyle.s14_w500(color: colors.text),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        '${listing.requesterName} · ${listing.categoryName}',
                        style: AppTextStyle.micro(color: colors.text2),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Gaps.vGap9,
                      Row(
                        children: [
                          _QuantityTag(listing: listing),
                          const Spacer(),
                          _OfferButton(onTap: onOpen),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RequestPhoto extends StatelessWidget {
  final ListingDomainModel listing;

  const _RequestPhoto({required this.listing});

  @override
  Widget build(BuildContext context) {
    final bg = Color(listing.placeholderColor ?? 0xFFECECEA);
    if (listing.imageUrl == null) return ColoredBox(color: bg);
    return CachedImage(url: listing.imageUrl!, fit: BoxFit.cover, bgColor: bg);
  }
}

/// Countdown to the need-by date; amber once it is 3 days or less away.
class _DueBadge extends StatelessWidget {
  final DateTime needBy;

  const _DueBadge({required this.needBy});

  @override
  Widget build(BuildContext context) {
    final days = _daysLeft(needBy);
    final urgent = days <= 3;
    final label = days <= 0
        ? Translate.s.home_due_today
        : days == 1
            ? Translate.s.home_due_tomorrow
            : Translate.s.home_due_in_days(days.toArabicDigits);
    final color = urgent ? context.colors.amber : context.colors.text2;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.schedule_rounded, size: 13, color: color),
        Gaps.hGap4,
        Text(
          label,
          style: AppTextStyle.micro(color: color).copyWith(
            fontWeight: urgent ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ],
    );
  }
}

class _QuantityTag extends StatelessWidget {
  final ListingDomainModel listing;

  const _QuantityTag({required this.listing});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 3),
      decoration: BoxDecoration(color: context.colors.surface2, borderRadius: AppRadius.chipAll),
      child: Text(
        '${listing.quantity.toArabicDigits} ${listing.quantityUnit}',
        style: AppTextStyle.micro(color: context.colors.text),
      ),
    );
  }
}

class _OfferButton extends StatelessWidget {
  final VoidCallback onTap;
  final bool prominent;

  const _OfferButton({required this.onTap, this.prominent = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: prominent ? colors.button : colors.surface1,
      shape: StadiumBorder(side: BorderSide(color: prominent ? colors.button : colors.line2)),
      child: InkWell(
        onTap: onTap,
        customBorder: const StadiumBorder(),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: prominent ? AppSpacing.xl : AppSpacing.lg,
            vertical: prominent ? AppSpacing.md : AppSpacing.sm,
          ),
          child: Text(
            Translate.s.home_card_offer,
            style: AppTextStyle.s12_w600(color: prominent ? colors.onButton : colors.text),
          ),
        ),
      ),
    );
  }
}

/// Small label on top of a photo; dark scrim so it reads on any image.
class _DistanceTag extends StatelessWidget {
  final double km;

  const _DistanceTag({required this.km});

  @override
  Widget build(BuildContext context) {
    return _ImageTag(
      icon: Icons.near_me_rounded,
      label: Translate.s.home_distance_km(km.toStringAsFixed(1).toArabicDigits),
      background: Colors.black.withValues(alpha: 0.55),
      foreground: Colors.white,
    );
  }
}

class _ImageTag extends StatelessWidget {
  final String label;
  final IconData? icon;
  final Color background;
  final Color foreground;

  const _ImageTag({
    required this.label,
    required this.background,
    required this.foreground,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 3),
      decoration: BoxDecoration(
        color: background,
        borderRadius: const BorderRadius.all(Radius.circular(20)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 11, color: foreground),
            Gaps.hGap4,
          ],
          Text(label, style: AppTextStyle.micro(color: foreground)),
        ],
      ),
    );
  }
}
