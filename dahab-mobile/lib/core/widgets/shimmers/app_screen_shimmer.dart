import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/widgets/shimmers/base_shimmer_widget.dart';

/// Soft rectangle bone used inside [BaseShimmerWidget] trees.
class ShimmerBox extends StatelessWidget {
  final double? width;
  final double height;
  final BorderRadius? radius;

  const ShimmerBox({
    super.key,
    this.width,
    required this.height,
    this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: radius ?? AppRadius.buttonAll,
      ),
    );
  }
}

/// Shared screen skeletons — use these instead of [AppLoaderWidget].
class AppScreenShimmer {
  AppScreenShimmer._();

  static Widget home() => const _HomeFeedShimmer();
  static Widget explore() => const _ExploreShimmer();
  static Widget listingDetail() => const _ListingDetailShimmer();
  static Widget orders() => const _OrdersShimmer();
  static Widget orderDetail() => const _OrderDetailShimmer();
  static Widget account() => const _AccountShimmer();
  static Widget offers() => const _OffersShimmer();
  static Widget createRequest() => const _CreateRequestShimmer();
  static Widget list({int rows = 6}) => _ListRowsShimmer(rows: rows);
}

class _Pad extends StatelessWidget {
  final Widget child;

  const _Pad({required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(
        horizontal: AppSpacing.xl,
        vertical: AppSpacing.lg,
      ),
      child: child,
    );
  }
}

class _HomeFeedShimmer extends StatelessWidget {
  const _HomeFeedShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 160, height: 22),
          Gaps.vGap6,
          const ShimmerBox(width: 110, height: 12),
          Gaps.vGap13,
          const ShimmerBox(height: 48, radius: AppRadius.buttonAll),
          Gaps.vGap13,
          Row(
            children: List.generate(
              4,
              (i) => Padding(
                padding: EdgeInsetsDirectional.only(end: i == 3 ? 0 : AppSpacing.sm),
                child: const ShimmerBox(width: 72, height: 34, radius: AppRadius.chipAll),
              ),
            ),
          ),
          Gaps.vGap18,
          const ShimmerBox(height: 72, radius: AppRadius.cardAll),
          Gaps.vGap24,
          Row(
            children: [
              Expanded(child: ShimmerBox(height: 16)),
              Gaps.hGap18,
              ShimmerBox(width: 64, height: 14),
            ],
          ),
          Gaps.vGap13,
          ...List.generate(4, (_) => const _ListingRowBone()),
        ],
      ),
    );
  }
}

class _ListingRowBone extends StatelessWidget {
  const _ListingRowBone();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ShimmerBox(width: 64, height: 64, radius: AppRadius.imageAll),
          Gaps.hGap13,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: 160, height: 14),
                Gaps.vGap6,
                ShimmerBox(width: 120, height: 12),
                Gaps.vGap9,
                ShimmerBox(width: 88, height: 22, radius: AppRadius.chipAll),
              ],
            ),
          ),
          Gaps.hGap9,
          const ShimmerBox(width: 48, height: 28),
        ],
      ),
    );
  }
}

class _ExploreShimmer extends StatelessWidget {
  const _ExploreShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 120, height: 22),
          Gaps.vGap13,
          const ShimmerBox(height: 48, radius: AppRadius.buttonAll),
          Gaps.vGap13,
          SizedBox(
            height: 34,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 6,
              separatorBuilder: (_, _) => Gaps.hGap9,
              itemBuilder: (_, _) =>
                  const ShimmerBox(width: 76, height: 34, radius: AppRadius.chipAll),
            ),
          ),
          Gaps.vGap18,
          const ShimmerBox(width: 140, height: 12),
          Gaps.vGap9,
          ...List.generate(5, (_) => const _ListingRowBone()),
        ],
      ),
    );
  }
}

class _ListingDetailShimmer extends StatelessWidget {
  const _ListingDetailShimmer();

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;
    return BaseShimmerWidget(
      child: Column(
        children: [
          ShimmerBox(
            width: double.infinity,
            height: 260 + top,
            radius: BorderRadius.zero,
          ),
          Expanded(
            child: _Pad(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ShimmerBox(width: 200, height: 22),
                  Gaps.vGap9,
                  const ShimmerBox(width: 140, height: 14),
                  Gaps.vGap18,
                  Row(
                    children: [
                      Expanded(child: ShimmerBox(height: 72, radius: AppRadius.cardAll)),
                      Gaps.hGap9,
                      Expanded(child: ShimmerBox(height: 72, radius: AppRadius.cardAll)),
                    ],
                  ),
                  Gaps.vGap18,
                  const ShimmerBox(width: 160, height: 16),
                  Gaps.vGap13,
                  const ShimmerBox(height: 180, radius: AppRadius.cardAll),
                  Gaps.vGap18,
                  const ShimmerBox(width: 100, height: 16),
                  Gaps.vGap13,
                  ...List.generate(
                    4,
                    (_) => const Padding(
                      padding: EdgeInsets.only(bottom: AppSpacing.md),
                      child: ShimmerBox(height: 40, radius: AppRadius.buttonAll),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OrdersShimmer extends StatelessWidget {
  const _OrdersShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 110, height: 22),
          Gaps.vGap13,
          Row(
            children: List.generate(
              4,
              (i) => Padding(
                padding: EdgeInsetsDirectional.only(end: i == 3 ? 0 : AppSpacing.sm),
                child: const ShimmerBox(width: 64, height: 32, radius: AppRadius.chipAll),
              ),
            ),
          ),
          Gaps.vGap18,
          ...List.generate(5, (_) => const _OrderRowBone()),
        ],
      ),
    );
  }
}

class _OrderRowBone extends StatelessWidget {
  const _OrderRowBone();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: Row(
        children: [
          const ShimmerBox(width: 56, height: 56, radius: AppRadius.imageAll),
          Gaps.hGap13,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: 150, height: 14),
                Gaps.vGap6,
                ShimmerBox(width: 180, height: 12),
                Gaps.vGap9,
                ShimmerBox(width: 72, height: 22, radius: AppRadius.chipAll),
              ],
            ),
          ),
          const ShimmerBox(width: 52, height: 24),
        ],
      ),
    );
  }
}

class _OrderDetailShimmer extends StatelessWidget {
  const _OrderDetailShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(height: 110, radius: AppRadius.cardAll),
          Gaps.vGap18,
          const ShimmerBox(height: 88, radius: AppRadius.cardAll),
          Gaps.vGap18,
          const ShimmerBox(width: 120, height: 16),
          Gaps.vGap13,
          ...List.generate(
            5,
            (_) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.lg),
              child: Row(
                children: [
                  const ShimmerBox(width: 18, height: 18, radius: AppRadius.chipAll),
                  Gaps.hGap13,
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ShimmerBox(width: 140, height: 14),
                        SizedBox(height: AppSpacing.sm),
                        ShimmerBox(width: 100, height: 12),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AccountShimmer extends StatelessWidget {
  const _AccountShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 90, height: 22),
          Gaps.vGap18,
          Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: context.colors.surface1,
                  shape: BoxShape.circle,
                ),
              ),
              Gaps.hGap13,
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(width: 140, height: 16),
                    SizedBox(height: AppSpacing.sm),
                    ShimmerBox(width: 110, height: 12),
                  ],
                ),
              ),
            ],
          ),
          Gaps.vGap18,
          Row(
            children: [
              Expanded(child: ShimmerBox(height: 64, radius: AppRadius.cardAll)),
              Gaps.hGap9,
              Expanded(child: ShimmerBox(height: 64, radius: AppRadius.cardAll)),
              Gaps.hGap9,
              Expanded(child: ShimmerBox(height: 64, radius: AppRadius.cardAll)),
            ],
          ),
          Gaps.vGap24,
          ...List.generate(
            3,
            (_) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ShimmerBox(width: 100, height: 14),
                  Gaps.vGap13,
                  const ShimmerBox(height: 120, radius: AppRadius.cardAll),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OffersShimmer extends StatelessWidget {
  const _OffersShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 80, height: 14),
          Gaps.vGap9,
          const ShimmerBox(width: 200, height: 22),
          Gaps.vGap6,
          const ShimmerBox(width: 160, height: 12),
          Gaps.vGap18,
          ...List.generate(
            3,
            (_) => const Padding(
              padding: EdgeInsets.only(bottom: AppSpacing.lg),
              child: ShimmerBox(height: 160, radius: AppRadius.cardAll),
            ),
          ),
        ],
      ),
    );
  }
}

class _CreateRequestShimmer extends StatelessWidget {
  const _CreateRequestShimmer();

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: _Pad(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Align(
              alignment: AlignmentDirectional.centerEnd,
              child: ShimmerBox(width: 48, height: 12),
            ),
            Gaps.vGap13,
            const Center(child: ShimmerBox(width: 180, height: 22)),
            Gaps.vGap13,
            const ShimmerBox(height: 3, radius: AppRadius.chipAll),
            Gaps.vGap18,
            const ShimmerBox(height: 110, radius: AppRadius.buttonAll),
            Gaps.vGap13,
            const ShimmerBox(height: 56, radius: AppRadius.buttonAll),
            Gaps.vGap9,
            Row(
              children: [
                Expanded(child: ShimmerBox(height: 56, radius: AppRadius.buttonAll)),
                Gaps.hGap9,
                Expanded(child: ShimmerBox(height: 56, radius: AppRadius.buttonAll)),
              ],
            ),
            Gaps.vGap9,
            Row(
              children: [
                Expanded(child: ShimmerBox(height: 56, radius: AppRadius.buttonAll)),
                Gaps.hGap9,
                Expanded(child: ShimmerBox(height: 56, radius: AppRadius.buttonAll)),
              ],
            ),
            Gaps.vGap9,
            const ShimmerBox(height: 56, radius: AppRadius.buttonAll),
          ],
        ),
      ),
    );
  }
}

class _ListRowsShimmer extends StatelessWidget {
  final int rows;

  const _ListRowsShimmer({required this.rows});

  @override
  Widget build(BuildContext context) {
    return BaseShimmerWidget(
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          const ShimmerBox(width: 140, height: 22),
          Gaps.vGap18,
          ...List.generate(
            rows,
            (_) => const Padding(
              padding: EdgeInsets.only(bottom: AppSpacing.lg),
              child: ShimmerBox(height: 72, radius: AppRadius.cardAll),
            ),
          ),
        ],
      ),
    );
  }
}
