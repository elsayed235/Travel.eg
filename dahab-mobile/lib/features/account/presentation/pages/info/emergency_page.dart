part of 'info_imports.dart';

/// Dahab's emergency lines from the server (dahab/emergency). When there is
/// no connection the same published numbers are kept in the app, because
/// this is the one page that must work offline.
class EmergencyPage extends StatefulWidget {
  const EmergencyPage({super.key});

  static const saved = [
    EmergencyLine('Hyperbaric Chamber Emergency', '+20 122 212 4840 / 137'),
    EmergencyLine('Dahab Central Hospital ER', '123 / +20 69 3640212'),
    EmergencyLine('Tourism Police Emergency', '126 / +20 69 3640103'),
  ];

  @override
  State<EmergencyPage> createState() => _EmergencyPageState();
}

class _EmergencyPageState extends State<EmergencyPage> {
  late final Future<List<EmergencyLine>> _load = TripRemote.emergency();

  static int _rank(String service) {
    final s = service.toLowerCase();
    if (s.contains('hyperbaric')) return 0;
    if (s.contains('hospital')) return 1;
    if (s.contains('police')) return 2;
    return 3;
  }

  static String _label(String service) {
    final s = service.toLowerCase();
    if (s.contains('hyperbaric')) return Translate.s.today_em_hyperbaric;
    if (s.contains('hospital')) return Translate.s.today_em_hospital;
    if (s.contains('police')) return Translate.s.today_em_police;
    return service;
  }

  static String _icon(String service) {
    final s = service.toLowerCase();
    if (s.contains('police')) return AppIcons.shield;
    return AppIcons.sos;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return FutureBuilder<List<EmergencyLine>>(
      future: _load,
      builder: (context, snap) {
        final done = snap.connectionState == ConnectionState.done;
        final live = snap.data ?? const <EmergencyLine>[];
        final offline = done && live.isEmpty;
        final lines = [...(offline || !done ? EmergencyPage.saved : live)]
          ..sort((a, b) => _rank(a.service).compareTo(_rank(b.service)));
        return InfoScaffold(
          title: Translate.s.account_emergency,
          intro: Translate.s.emergency_intro,
          children: [
            if (offline) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                decoration: BoxDecoration(
                  color: colors.amber.withValues(alpha: 0.12),
                  borderRadius: AppRadius.buttonAll,
                ),
                child: Row(
                  children: [
                    AppIcon.ui(AppIcons.info, size: 16, color: colors.amber),
                    Gaps.hGap8,
                    Expanded(child: Text(Translate.s.emergency_saved, style: AppTextStyle.caption(color: colors.text))),
                  ],
                ),
              ),
              Gaps.vGap16,
            ],
            for (final line in lines) ...[
              _EmergencyCard(
                icon: _icon(line.service),
                label: _label(line.service),
                numbers: line.number.split('/').map((n) => n.trim()).where((n) => n.isNotEmpty).toList(),
                primary: _rank(line.service) == 0,
              ),
              Gaps.vGap12,
            ],
          ],
        );
      },
    );
  }
}

class _EmergencyCard extends StatelessWidget {
  final String icon;
  final String label;
  final List<String> numbers;
  final bool primary;

  const _EmergencyCard({required this.icon, required this.label, required this.numbers, required this.primary});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: primary ? colors.red.withValues(alpha: 0.45) : colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: colors.red.withValues(alpha: 0.12),
                  borderRadius: const BorderRadius.all(Radius.circular(10)),
                ),
                alignment: Alignment.center,
                child: AppIcon.ui(icon, size: 18, color: colors.red),
              ),
              Gaps.hGap12,
              Expanded(child: Text(label, style: AppTextStyle.s16_w500(color: colors.text))),
            ],
          ),
          Gaps.vGap12,
          Wrap(
            spacing: AppSpacing.md,
            runSpacing: AppSpacing.md,
            children: [
              for (final (i, n) in numbers.indexed)
                _CallChip(number: n, strong: i == 0),
            ],
          ),
        ],
      ),
    );
  }
}

class _CallChip extends StatelessWidget {
  final String number;
  final bool strong;

  const _CallChip({required this.number, required this.strong});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = strong ? colors.onButton : colors.text;
    return Semantics(
      button: true,
      label: '${Translate.s.contact_call} $number',
      excludeSemantics: true,
      child: Material(
        color: strong ? colors.red : colors.surface2,
        shape: const StadiumBorder(),
        child: InkWell(
          customBorder: const StadiumBorder(),
          onTap: () => ShareServices.instance.callPhone(phone: number.replaceAll(RegExp(r'[^\d+]'), '')),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AppIcon.ui(AppIcons.call, size: 16, color: strong ? colors.onImage : fg),
                Gaps.hGap8,
                Text(
                  number,
                  textDirection: TextDirection.ltr,
                  style: AppTextStyle.s14_w500(color: strong ? colors.onImage : fg),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
