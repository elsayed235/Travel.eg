part of '../experiences_imports.dart';

/// Everything that matters before booking: a fixed facts strip, what verified
/// guests said (or that nobody has yet), the operator and how reliable they
/// have been, what is included, and the price with its real cancellation rule.
class ExperiencePage extends StatefulWidget {
  final Experience experience;

  const ExperiencePage({super.key, required this.experience});

  @override
  State<ExperiencePage> createState() => _ExperiencePageState();
}

class _ExperiencePageState extends State<ExperiencePage> {
  SupplierTrust? _trust;

  Experience get e => widget.experience;

  @override
  void initState() {
    super.initState();
    _loadTrust();
  }

  Future<void> _loadTrust() async {
    if (!RehlaApi.configured || e.bookable.supplierId.isEmpty) {
      setState(() => _trust = SupplierTrust.empty);
      return;
    }
    final trust = await TripRemote.trust(e.bookable.supplierId);
    if (mounted) setState(() => _trust = trust);
  }

  void _book() => showBookingSheet(context, e);

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final top = MediaQuery.paddingOf(context).top;
    final included = e.bookable.included(arabic);
    final description = e.bookable.description(arabic);
    return Scaffold(
      backgroundColor: colors.bg,
      body: Column(
        children: [
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 340 + top,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        RehlaPhoto(webPath: e.webPhoto, asset: e.assetPhoto),
                        DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              stops: const [0, 0.3, 1],
                              colors: [
                                colors.scrim.withValues(alpha: 0.45),
                                colors.scrim.withValues(alpha: 0),
                                colors.scrim.withValues(alpha: 0.35),
                              ],
                            ),
                          ),
                        ),
                        PositionedDirectional(
                          top: top + AppSpacing.md,
                          start: AppSpacing.screenH,
                          child: _RoundButton(
                            icon: arabic ? AppIcons.arrow : AppIcons.back,
                            label: MaterialLocalizations.of(context).backButtonTooltip,
                            onTap: () => Navigator.of(context).maybePop(),
                          ),
                        ),
                        PositionedDirectional(
                          start: AppSpacing.screenH,
                          bottom: AppSpacing.lg,
                          child: Wrap(
                            spacing: AppSpacing.sm,
                            children: [
                              if (e.bookable.cancellationHours != null)
                                XpChip(label: Translate.s.xp_free_cancel, icon: AppIcons.calendarCheck, onImage: true),
                              XpChip(label: Translate.s.xp_pay_on_arrival, icon: AppIcons.wallet, onImage: true),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.xl, AppSpacing.screenH, AppSpacing.xxl),
                  sliver: SliverList.list(
                    children: [
                      Text(
                        e.title(arabic),
                        style: AppTextStyle.s24_w700(color: colors.text).copyWith(
                          fontFamily: AppFonts.display(context),
                          fontWeight: FontWeight.w600,
                          height: 1.2,
                        ),
                      ),
                      Gaps.vGap8,
                      _RatingLine(trust: _trust, place: e.place?.name(arabic)),
                      Gaps.vGap18,
                      _FactsStrip(experience: e),
                      if (description.isNotEmpty) ...[
                        Gaps.vGap18,
                        Text(description, style: AppTextStyle.s14_w400(color: colors.text2).copyWith(height: 1.6)),
                      ],
                      Gaps.vGap24,
                      _GuestsSay(trust: _trust),
                      Gaps.vGap18,
                      _OperatorCard(experience: e, trust: _trust),
                      if (included.isNotEmpty) ...[
                        Gaps.vGap24,
                        Text(Translate.s.xp_included, style: AppTextStyle.s16_w700(color: colors.text)),
                        Gaps.vGap12,
                        for (final item in included) _Bullet(text: item, icon: AppIcons.check, tone: colors.green),
                      ],
                      if (e.prepEn.isNotEmpty || e.dependencies.isNotEmpty) ...[
                        Gaps.vGap18,
                        Text(Translate.s.xp_before, style: AppTextStyle.s16_w700(color: colors.text)),
                        Gaps.vGap12,
                        for (var i = 0; i < e.prepEn.length; i++)
                          _Bullet(text: e.prep(arabic, i), icon: AppIcons.sun, tone: colors.text3),
                        for (final need in e.dependencies)
                          _Bullet(text: need, icon: AppIcons.doc, tone: colors.text3),
                      ],
                      Gaps.vGap18,
                      Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: TextButton.icon(
                          onPressed: () {
                            Navigator.of(context).popUntil((r) => r.isFirst);
                            ShellActions.askDaygi(Translate.s.xp_ask_daygi_q(e.title(arabic)));
                          },
                          icon: AppIcon.ui(AppIcons.sparkle, size: 16, color: colors.button),
                          label: Text(Translate.s.xp_ask_daygi, style: AppTextStyle.s13_w500(color: colors.button)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          _PriceBar(experience: e, onBook: _book),
        ],
      ),
    );
  }
}

class _RoundButton extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback onTap;

  const _RoundButton({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: colors.scrim.withValues(alpha: 0.45),
            shape: BoxShape.circle,
            border: Border.all(color: colors.onImage.withValues(alpha: 0.25)),
          ),
          child: AppIcon.ui(icon, size: 20, color: colors.onImage),
        ),
      ),
    );
  }
}

class _RatingLine extends StatelessWidget {
  final SupplierTrust? trust;
  final String? place;

  const _RatingLine({required this.trust, required this.place});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final t = trust;
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: AppSpacing.sm,
      children: [
        if (t != null && t.count > 0) ...[
          AppIcon.ui(AppIcons.starFill, size: 16, color: colors.highlight),
          Text(t.average.toStringAsFixed(1), style: AppTextStyle.s14_w600(color: colors.text)),
          Text('(${t.count})', style: AppTextStyle.s13_w500(color: colors.text3)),
        ] else if (t != null)
          Text(Translate.s.xp_reviews_none, style: AppTextStyle.s13_w500(color: colors.text3)),
        if (place != null && place!.isNotEmpty) ...[
          if (t != null) Text('·', style: AppTextStyle.s13_w500(color: colors.text3)),
          Text(place!, style: AppTextStyle.s13_w500(color: colors.text2)),
        ],
      ],
    );
  }
}

/// The fixed facts strip: duration, where to meet, group size, level.
class _FactsStrip extends StatelessWidget {
  final Experience experience;

  const _FactsStrip({required this.experience});

  @override
  Widget build(BuildContext context) {
    final arabic = context.isArabic;
    final e = experience;
    final facts = <(String, String, String)>[
      if (e.durationMinutes > 0) (AppIcons.clock, Translate.s.xp_fact_duration, ExperienceFit.duration(e.durationMinutes)),
      if (e.bookable.meeting(arabic).isNotEmpty) (AppIcons.pin, Translate.s.xp_fact_meet, e.bookable.meeting(arabic)),
      (AppIcons.group, Translate.s.xp_fact_group, Translate.s.xp_up_to(e.bookable.maxPerSlot)),
      if (e.difficulty.isNotEmpty) (AppIcons.mountain, Translate.s.xp_fact_level, _level(e.difficulty)),
    ];
    return SizedBox(
      height: 92,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: facts.length,
        separatorBuilder: (_, _) => Gaps.hGap8,
        itemBuilder: (context, i) => _Fact(icon: facts[i].$1, label: facts[i].$2, value: facts[i].$3),
      ),
    );
  }

  static String _level(String raw) {
    switch (raw) {
      case 'Beginner':
        return Translate.s.xp_level_beginner;
      case 'Intermediate':
        return Translate.s.xp_level_intermediate;
      case 'Advanced':
        return Translate.s.xp_level_advanced;
      default:
        return Translate.s.xp_level_all;
    }
  }
}

class _Fact extends StatelessWidget {
  final String icon;
  final String label;
  final String value;

  const _Fact({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      width: 132,
      padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.buttonAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppIcon.ui(icon, size: 18, color: colors.button),
          const Spacer(),
          Text(label, style: AppTextStyle.micro(color: colors.text3)),
          Text(value, maxLines: 2, overflow: TextOverflow.ellipsis, style: AppTextStyle.s12_w600(color: colors.text).copyWith(height: 1.25)),
        ],
      ),
    );
  }
}

class _GuestsSay extends StatelessWidget {
  final SupplierTrust? trust;

  const _GuestsSay({required this.trust});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final t = trust;
    final latest = (t?.reviews.isNotEmpty ?? false) ? t!.reviews.first : null;
    return Container(
      padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppIcon.ui(AppIcons.quote, size: 18, color: colors.highlight),
              Gaps.hGap6,
              Text(Translate.s.xp_reviews_title, style: AppTextStyle.s14_w600(color: colors.text)),
            ],
          ),
          Gaps.vGap8,
          if (t == null)
            Text('…', style: AppTextStyle.body(color: colors.text3))
          else if (latest == null) ...[
            Text(Translate.s.xp_reviews_none, style: AppTextStyle.body(color: colors.text)),
            Gaps.vGap4,
            Text(Translate.s.xp_reviews_none_hint, style: AppTextStyle.caption(color: colors.text3)),
          ] else ...[
            Text(latest.text(arabic), style: AppTextStyle.s14_w400(color: colors.text).copyWith(height: 1.6)),
            Gaps.vGap8,
            Text(
              Translate.s.xp_reviews_from(t.count) +
                  (latest.at != null ? Translate.s.xp_reviews_latest(RehlaDates.day(latest.at!.toLocal(), arabic)) : ''),
              style: AppTextStyle.caption(color: colors.text3),
            ),
          ],
        ],
      ),
    );
  }
}

class _OperatorCard extends StatelessWidget {
  final Experience experience;
  final SupplierTrust? trust;

  const _OperatorCard({required this.experience, required this.trust});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final name = experience.bookable.supplier(arabic);
    final initials = experience.bookable.supplierEn
        .split(RegExp(r'\s+'))
        .where((w) => w.isNotEmpty && RegExp('[A-Za-z]').hasMatch(w[0]))
        .take(2)
        .map((w) => w[0].toUpperCase())
        .join();
    final t = trust;
    final scored = t != null && t.sample > 0;
    return Container(
      padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: colors.actionWash, shape: BoxShape.circle),
            child: Text(initials, style: AppTextStyle.s14_w600(color: colors.button)),
          ),
          Gaps.hGap12,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: AppTextStyle.s14_w600(color: colors.text)),
                Gaps.vGap4,
                Text(
                  scored
                      ? '${Translate.s.xp_operator_on} · ${Translate.s.xp_reliability_basis(t.sample)}'
                      : '${Translate.s.xp_operator_on} · ${Translate.s.xp_reliability_new}',
                  style: AppTextStyle.caption(color: colors.text3),
                ),
              ],
            ),
          ),
          if (scored) ...[
            Gaps.hGap8,
            Column(
              children: [
                Text('${t.reliability}%', style: AppTextStyle.s18_w700(color: colors.green)),
                Text(Translate.s.xp_reliability, style: AppTextStyle.micro(color: colors.text3)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _Bullet extends StatelessWidget {
  final String text;
  final String icon;
  final Color tone;

  const _Bullet({required this.text, required this.icon, required this.tone});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppIcon.ui(icon, size: 18, color: tone),
          Gaps.hGap10,
          Expanded(child: Text(text, style: AppTextStyle.s14_w400(color: context.colors.text))),
        ],
      ),
    );
  }
}

/// Price per person, about how much in dollars, the cancellation rule, Book.
class _PriceBar extends StatelessWidget {
  final Experience experience;
  final VoidCallback onBook;

  const _PriceBar({required this.experience, required this.onBook});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final e = experience;
    final rate = ExperienceCatalogue.instance.usdRate;
    final usd = rate != null && rate > 0 ? (e.bookable.priceEgp / rate).round() : null;
    final unit = [
      if (e.bookable.perPerson) Translate.s.xp_per_person_long,
      if (usd != null) Translate.s.xp_about_usd(usd),
    ].join(' · ');
    final cancel = ExperienceFit.cancellation(e);
    return Container(
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.screenH,
        AppSpacing.lg,
        AppSpacing.screenH,
        AppSpacing.lg + MediaQuery.paddingOf(context).bottom,
      ),
      decoration: BoxDecoration(
        color: colors.bg,
        border: Border(top: BorderSide(color: colors.line)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppMoney.egp(e.bookable.priceEgp),
                  textDirection: TextDirection.ltr,
                  style: AppTextStyle.price(color: colors.text).copyWith(fontSize: 20),
                ),
                if (unit.isNotEmpty) Text(unit, style: AppTextStyle.caption(color: colors.text3)),
                if (cancel != null) Text(cancel, style: AppTextStyle.s12_w500(color: colors.green)),
              ],
            ),
          ),
          FilledButton(
            onPressed: onBook,
            style: FilledButton.styleFrom(
              backgroundColor: colors.button,
              foregroundColor: colors.onButton,
              minimumSize: const Size(128, 52),
              shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              textStyle: AppTextStyle.s16_w500(color: colors.onButton),
            ),
            child: Text(Translate.s.xp_book),
          ),
        ],
      ),
    );
  }
}
