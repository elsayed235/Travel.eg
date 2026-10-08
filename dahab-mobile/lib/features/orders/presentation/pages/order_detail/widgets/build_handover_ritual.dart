part of 'order_detail_widgets_imports.dart';

/// Full-screen pickup code ritual — large Arabic digits + show-to-provider mode.
class BuildHandoverRitual extends StatefulWidget {
  final String code;
  final String title;
  final VoidCallback onCopy;

  const BuildHandoverRitual({
    super.key,
    required this.code,
    required this.title,
    required this.onCopy,
  });

  static Future<void> open(
    BuildContext context, {
    required String code,
    required String title,
    required VoidCallback onCopy,
  }) {
    return Navigator.of(context).push(
      PageRouteBuilder<void>(
        opaque: true,
        pageBuilder: (_, animation, secondaryAnimation) => BuildHandoverRitual(
          code: code,
          title: title,
          onCopy: onCopy,
        ),
        transitionsBuilder: (_, anim, secondaryAnimation, child) {
          return FadeTransition(opacity: anim, child: child);
        },
      ),
    );
  }

  @override
  State<BuildHandoverRitual> createState() => _BuildHandoverRitualState();
}

class _BuildHandoverRitualState extends State<BuildHandoverRitual> {
  static const _ttl = Duration(minutes: 15);
  late DateTime _expiresAt;
  Timer? _timer;
  Duration _remaining = _ttl;

  @override
  void initState() {
    super.initState();
    _expiresAt = DateTime.now().add(_ttl);
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      final left = _expiresAt.difference(DateTime.now());
      setState(() => _remaining = left.isNegative ? Duration.zero : left);
    });
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  }

  @override
  void dispose() {
    _timer?.cancel();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  String get _clock {
    final m = _remaining.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = _remaining.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s'.toArabicDigits;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsetsDirectional.all(AppSpacing.xl),
          child: Column(
            children: [
              Align(
                alignment: AlignmentDirectional.centerStart,
                child: IconButton(
                  onPressed: () => Navigator.of(context).maybePop(),
                  icon: Icon(Icons.close, color: context.colors.text),
                ),
              ),
              Gaps.vGap18,
              Text(
                Translate.s.handover_show_title,
                style: AppTextStyle.caption(color: context.colors.text2),
              ),
              Gaps.vGap9,
              Text(
                widget.title,
                style: AppTextStyle.sectionTitle(color: context.colors.text),
                textAlign: TextAlign.center,
              ),
              const Spacer(),
              Text(
                widget.code.toArabicDigits,
                style: AppTextStyle.screenTitle(color: context.colors.text).copyWith(
                  fontSize: 48,
                  letterSpacing: 10,
                  height: 1.1,
                ),
                textAlign: TextAlign.center,
              ),
              Gaps.vGap18,
              Text(
                Translate.s.handover_countdown(_clock),
                style: AppTextStyle.body(color: context.colors.text2),
              ),
              Gaps.vGap9,
              Text(
                Translate.s.handover_show_hint,
                style: AppTextStyle.caption(color: context.colors.text3),
                textAlign: TextAlign.center,
              ),
              const Spacer(),
              AppTextButton.maxCustom(
                text: Translate.s.order_detail_code_copy,
                onPressed: widget.onCopy,
                bgColor: context.colors.surface2,
                txtColor: context.colors.text,
              ),
              Gaps.vGap13,
              AppTextButton.maxPrimary(
                text: Translate.s.handover_done,
                onPressed: () => Navigator.of(context).maybePop(),
              ),
              Gaps.vGap18,
            ],
          ),
        ),
      ),
    );
  }
}
