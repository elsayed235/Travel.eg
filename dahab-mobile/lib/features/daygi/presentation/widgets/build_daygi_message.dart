part of '../daygi_imports.dart';

class BuildDaygiMessage extends StatelessWidget {
  final DgMessage message;
  final DaygiController controller;

  const BuildDaygiMessage({super.key, required this.message, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final m = message;
    if (m.fromUser) {
      return Padding(
        padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.lg),
        child: DgBubble(
          fromUser: true,
          child: Text(m.text, style: AppTextStyle.s14_w400(color: colors.onButton).copyWith(height: 1.5)),
        ),
      );
    }
    if (m.pending) {
      return Padding(
        padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.lg),
        child: DgBubble(fromUser: false, child: const _Typing()),
      );
    }
    final live = ExperienceCatalogue.instance.live;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DgBubble(
            fromUser: false,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(m.text, style: AppTextStyle.s14_w400(color: colors.text).copyWith(height: 1.55)),
                if (m.why.isNotEmpty) ...[
                  Gaps.vGap6,
                  Text(m.why, style: AppTextStyle.caption(color: colors.text3)),
                ],
              ],
            ),
          ),
          if (m.cards.isNotEmpty) ...[
            Gaps.vGap8,
            ObsValueConsumer(
              observable: controller.planObs,
              builder: (context, plan) => Column(
                children: [
                  for (final e in m.cards)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
                      child: _DgCard(
                        experience: e,
                        added: plan.has(e.id),
                        day: controller.dayObs.getValue(),
                        onAdd: () => controller.addToPlan(e),
                      ),
                    ),
                ],
              ),
            ),
            Text(
              live != null && live.source.isNotEmpty ? Translate.s.dg_sources(live.source) : Translate.s.dg_sources_prices,
              style: AppTextStyle.micro(color: colors.text3),
            ),
          ],
          if (m.note != null) ...[
            Gaps.vGap6,
            Text(m.note!, style: AppTextStyle.caption(color: colors.text3)),
          ],
          if (m.followUps.isNotEmpty) ...[
            Gaps.vGap8,
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final f in m.followUps) DgSuggestion(label: f.$1, onTap: () => controller.send(context, f.$2)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class DgBubble extends StatelessWidget {
  final bool fromUser;
  final Widget child;

  const DgBubble({super.key, required this.fromUser, required this.child});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    const r = Radius.circular(AppRadius.card);
    const tight = Radius.circular(6);
    return Align(
      alignment: fromUser ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.82),
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
          decoration: BoxDecoration(
            color: fromUser ? colors.button : colors.surface1,
            border: fromUser ? null : Border.all(color: colors.line),
            borderRadius: BorderRadiusDirectional.only(
              topStart: r,
              topEnd: r,
              bottomStart: fromUser ? r : tight,
              bottomEnd: fromUser ? tight : r,
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}

class DgSuggestion extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const DgSuggestion({super.key, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: colors.actionWash,
          borderRadius: AppRadius.chipAll,
        ),
        child: Text(label, style: AppTextStyle.s12_w600(color: colors.button)),
      ),
    );
  }
}

/// A bookable reply card: photo, title, real price, and "Add to day N".
class _DgCard extends StatelessWidget {
  final Experience experience;
  final bool added;
  final int day;
  final VoidCallback onAdd;

  const _DgCard({required this.experience, required this.added, required this.day, required this.onAdd});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final e = experience;
    return XpPressable(
      onTap: () => openExperience(context, e),
      child: Container(
        padding: const EdgeInsetsDirectional.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: colors.surface1,
          borderRadius: AppRadius.cardAll,
          border: Border.all(color: colors.line),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: AppRadius.imageAll,
              child: SizedBox(width: 64, height: 64, child: RehlaPhoto(webPath: e.webPhoto, asset: e.assetPhoto)),
            ),
            Gaps.hGap10,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(e.title(arabic), maxLines: 2, overflow: TextOverflow.ellipsis, style: AppTextStyle.s13_w500(color: colors.text)),
                  Gaps.vGap4,
                  Row(
                    children: [
                      XpPrice(experience: e, size: 13),
                      if (e.bookable.durationMinutes > 0) ...[
                        Text('  ·  ', style: AppTextStyle.micro(color: colors.text3)),
                        Flexible(
                          child: Text(
                            ExperienceFit.duration(e.bookable.durationMinutes),
                            overflow: TextOverflow.ellipsis,
                            style: AppTextStyle.caption(color: colors.text3),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            Gaps.hGap8,
            GestureDetector(
              onTap: added ? null : onAdd,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 220),
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                decoration: BoxDecoration(
                  color: added ? colors.greenBg : colors.actionWash,
                  borderRadius: AppRadius.chipAll,
                ),
                child: Text(
                  added ? Translate.s.dg_added : Translate.s.dg_add_to_day(day),
                  style: AppTextStyle.s12_w600(color: added ? colors.green : colors.button),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Typing extends StatefulWidget {
  const _Typing();

  @override
  State<_Typing> createState() => _TypingState();
}

class _TypingState extends State<_Typing> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1100))..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return SizedBox(
      height: 18,
      width: 40,
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) => Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (var i = 0; i < 3; i++)
              Opacity(
                opacity: 0.3 + 0.7 * (1 - ((_c.value * 3 - i) % 3).clamp(0.0, 1.0)),
                child: Container(width: 7, height: 7, decoration: BoxDecoration(color: colors.text3, shape: BoxShape.circle)),
              ),
          ],
        ),
      ),
    );
  }
}
