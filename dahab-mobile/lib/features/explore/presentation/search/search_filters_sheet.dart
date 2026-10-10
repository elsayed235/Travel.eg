part of '../explore_imports.dart';

/// Edits a draft of [filters]; the button counts what the draft would show,
/// so nobody applies filters into an empty list by surprise.
Future<SearchFilters?> showSearchFiltersSheet(
  BuildContext context, {
  required SearchFilters filters,
  required List<Experience> all,
  required LiveConditions? live,
  required int Function(SearchFilters) count,
}) {
  return showModalBottomSheet<SearchFilters>(
    context: context,
    useSafeArea: true,
    isScrollControlled: true,
    showDragHandle: true,
    backgroundColor: context.colors.surface1,
    elevation: 0,
    shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
    builder: (_) => _SearchFiltersSheet(initial: filters, all: all, live: live, count: count),
  );
}

class _SearchFiltersSheet extends StatefulWidget {
  final SearchFilters initial;
  final List<Experience> all;
  final LiveConditions? live;
  final int Function(SearchFilters) count;

  const _SearchFiltersSheet({required this.initial, required this.all, required this.live, required this.count});

  @override
  State<_SearchFiltersSheet> createState() => _SearchFiltersSheetState();
}

class _SearchFiltersSheetState extends State<_SearchFiltersSheet> {
  late var _f = widget.initial;

  /// The slider runs over real prices, in steps of 100 EGP.
  late final (num, num) _priceRange = () {
    final prices = widget.all.map((e) => e.bookable.priceEgp).where((p) => p > 0).toList();
    if (prices.isEmpty) return (0, 0);
    final lo = (prices.reduce(math.min) / 100).floor() * 100;
    final hi = (prices.reduce(math.max) / 100).ceil() * 100;
    return (lo, hi);
  }();

  void _set(SearchFilters next) {
    HapticFeedback.selectionClick();
    setState(() => _f = next);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final today = RehlaDates.dateOnly(DateTime.now());
    final (lo, hi) = _priceRange;
    final n = widget.count(_f);
    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.86),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.xl, 0, AppSpacing.sm, AppSpacing.md),
            child: Row(
              children: [
                Expanded(child: Text(Translate.s.search_filters, style: AppTextStyle.s20_w600(color: colors.text))),
                TextButton(
                  onPressed: _f.isDefault ? null : () => _set(const SearchFilters()),
                  style: TextButton.styleFrom(foregroundColor: colors.button, minimumSize: const Size(44, 44)),
                  child: Text(Translate.s.search_reset),
                ),
              ],
            ),
          ),
          Flexible(
            child: ListView(
              shrinkWrap: true,
              padding: const EdgeInsets.fromLTRB(AppSpacing.xl, 0, AppSpacing.xl, AppSpacing.lg),
              children: [
                _Heading(Translate.s.search_when),
                Wrap(
                  spacing: AppSpacing.md,
                  runSpacing: AppSpacing.md,
                  children: [
                    _Choice(
                      label: Translate.s.search_any_day,
                      selected: _f.day == null,
                      onTap: () => _set(_f.copyWith(day: () => null)),
                    ),
                    for (var i = 0; i < 7; i++)
                      _Choice(
                        label: i == 0
                            ? Translate.s.book_today
                            : i == 1
                                ? Translate.s.book_tomorrow
                                : '${RehlaDates.weekday(today.add(Duration(days: i)), arabic)} ${today.add(Duration(days: i)).day.toLocaleDigits}',
                        selected: _f.day == i,
                        onTap: () => _set(_f.copyWith(day: () => i)),
                      ),
                  ],
                ),
                if (hi > lo) ...[
                  _Divider(),
                  Row(
                    children: [
                      Expanded(child: _Heading(Translate.s.search_price, bottom: 0)),
                      Text(
                        _f.maxPrice == null
                            ? Translate.s.search_any_price
                            : Translate.s.search_price_up_to(AppMoney.egp(_f.maxPrice!)),
                        style: AppTextStyle.s14_w500(color: colors.button),
                      ),
                    ],
                  ),
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: colors.button,
                      inactiveTrackColor: colors.surface3,
                      thumbColor: colors.button,
                      overlayColor: colors.button.withValues(alpha: 0.12),
                      trackHeight: 4,
                      tickMarkShape: SliderTickMarkShape.noTickMark,
                    ),
                    child: Slider(
                      min: lo.toDouble(),
                      max: hi.toDouble(),
                      divisions: math.max(1, ((hi - lo) / 100).round()),
                      value: (_f.maxPrice ?? hi).toDouble(),
                      onChanged: (v) => setState(() => _f = _f.copyWith(maxPrice: () => v >= hi ? null : v.round())),
                      onChangeEnd: (_) => HapticFeedback.selectionClick(),
                    ),
                  ),
                ],
                _Divider(),
                _Heading(Translate.s.search_duration),
                Wrap(
                  spacing: AppSpacing.md,
                  runSpacing: AppSpacing.md,
                  children: [
                    for (final (d, label) in [
                      (SearchDuration.any, Translate.s.search_dur_any),
                      (SearchDuration.short, Translate.s.search_dur_short),
                      (SearchDuration.half, Translate.s.search_dur_half),
                      (SearchDuration.full, Translate.s.search_dur_full),
                    ])
                      _Choice(label: label, selected: _f.duration == d, onTap: () => _set(_f.copyWith(duration: d))),
                  ],
                ),
                _Divider(),
                _Toggle(
                  icon: AppIcons.seedling,
                  label: Translate.s.search_beginner,
                  value: _f.beginner,
                  onChanged: (v) => _set(_f.copyWith(beginner: v)),
                ),
                if (widget.live?.windKnots != null)
                  _Toggle(
                    icon: AppIcons.wind,
                    label: Translate.s.search_wind_ok,
                    value: _f.windOk,
                    onChanged: (v) => _set(_f.copyWith(windOk: v)),
                  ),
                _Divider(),
                _Heading(Translate.s.search_sort),
                Wrap(
                  spacing: AppSpacing.md,
                  runSpacing: AppSpacing.md,
                  children: [
                    for (final (s, label) in [
                      (SearchSort.best, Translate.s.search_sort_best),
                      (SearchSort.priceLow, Translate.s.search_sort_price_low),
                      (SearchSort.priceHigh, Translate.s.search_sort_price_high),
                      (SearchSort.short, Translate.s.search_sort_short),
                    ])
                      _Choice(label: label, selected: _f.sort == s, onTap: () => _set(_f.copyWith(sort: s))),
                  ],
                ),
              ],
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(border: Border(top: BorderSide(color: colors.line))),
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                AppSpacing.xl,
                AppSpacing.lg,
                AppSpacing.xl,
                AppSpacing.lg + MediaQuery.paddingOf(context).bottom,
              ),
              child: SizedBox(
                height: 52,
                child: FilledButton(
                  onPressed: n == 0 ? null : () => Navigator.of(context).pop(_f),
                  style: FilledButton.styleFrom(
                    backgroundColor: colors.button,
                    foregroundColor: colors.onButton,
                    disabledBackgroundColor: colors.surface3,
                    disabledForegroundColor: colors.text3,
                    shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                  ),
                  child: Text(
                    n == 0 ? Translate.s.search_empty_title : Translate.s.search_show_results(n.toLocaleDigits),
                    style: AppTextStyle.s16_w500(color: n == 0 ? colors.text3 : colors.onButton),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Heading extends StatelessWidget {
  final String text;
  final double bottom;

  const _Heading(this.text, {this.bottom = AppSpacing.md});

  @override
  Widget build(BuildContext context) => Padding(
        padding: EdgeInsets.only(bottom: bottom),
        child: Semantics(header: true, child: Text(text, style: AppTextStyle.s16_w500(color: context.colors.text))),
      );
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.xl),
        child: Divider(height: 1, thickness: 1, color: context.colors.line),
      );
}

class _Choice extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _Choice({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      selected: selected,
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          constraints: const BoxConstraints(minHeight: 40),
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
          decoration: BoxDecoration(
            color: selected ? colors.actionWash : colors.surface1,
            borderRadius: AppRadius.chipAll,
            border: Border.all(color: selected ? colors.button : colors.line, width: selected ? 1.5 : 1),
          ),
          child: Text(
            label,
            style: AppTextStyle.s14_w400(color: selected ? colors.text : colors.text2)
                .copyWith(fontWeight: selected ? FontWeight.w600 : FontWeight.w400),
          ),
        ),
      ),
    );
  }
}

class _Toggle extends StatelessWidget {
  final String icon;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _Toggle({required this.icon, required this.label, required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return MergeSemantics(
      child: InkWell(
        onTap: () => onChanged(!value),
        splashFactory: NoSplash.splashFactory,
        child: SizedBox(
          height: 52,
          child: Row(
            children: [
              AppIcon.ui(icon, size: 20, color: colors.text2),
              Gaps.hGap12,
              Expanded(child: Text(label, style: AppTextStyle.s16_w400(color: colors.text))),
              Switch.adaptive(
                value: value,
                onChanged: onChanged,
                activeTrackColor: colors.button,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
