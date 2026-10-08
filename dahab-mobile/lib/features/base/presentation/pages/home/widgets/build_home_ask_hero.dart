part of 'home_widgets_imports.dart';

/// The home screen's one bold element: an "ask" surface under the headline.
/// Tapping the line opens the request form, the mic opens it already
/// listening, and an example opens it pre-filled by the smart composer.
class BuildHomeAskHero extends StatelessWidget {
  final VoidCallback onType;
  final VoidCallback onVoice;
  final ValueChanged<String> onExample;

  const BuildHomeAskHero({
    super.key,
    required this.onType,
    required this.onVoice,
    required this.onExample,
  });

  static const _radius = BorderRadius.all(Radius.circular(18));

  @override
  Widget build(BuildContext context) {
    final examples = [
      Translate.s.ai_home_example_1,
      Translate.s.ai_home_example_2,
      Translate.s.ai_home_example_3,
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          decoration: BoxDecoration(color: context.colors.surface2, borderRadius: _radius),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(
                  AppSpacing.xl,
                  AppSpacing.md,
                  AppSpacing.md,
                  AppSpacing.md,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Semantics(
                        button: true,
                        child: InkWell(
                          onTap: onType,
                          borderRadius: AppRadius.buttonAll,
                          splashFactory: NoSplash.splashFactory,
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
                            child: Text(
                              Translate.s.home_ask_placeholder,
                              style: AppTextStyle.s16_w400(color: context.colors.text2),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Gaps.hGap9,
                    _PulsingMic(onTap: onVoice, label: Translate.s.ai_voice_button),
                  ],
                ),
              ),
              Divider(height: 1, thickness: 1, color: context.colors.line),
              SizedBox(
                height: 52,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                    vertical: AppSpacing.md,
                  ),
                  itemCount: examples.length,
                  separatorBuilder: (_, _) => Gaps.hGap6,
                  itemBuilder: (context, i) => _ExampleChip(
                    label: examples[i],
                    onTap: () => onExample(examples[i]),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ExampleChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _ExampleChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.surface1,
      borderRadius: AppRadius.chipAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.chipAll,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.auto_awesome_outlined, size: 14, color: context.colors.green),
              Gaps.hGap6,
              Text(label, style: AppTextStyle.caption(color: context.colors.text)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Mic button with a soft expanding ring, so the surface reads as "tap and talk".
class _PulsingMic extends StatefulWidget {
  final VoidCallback onTap;
  final String label;

  const _PulsingMic({required this.onTap, required this.label});

  @override
  State<_PulsingMic> createState() => _PulsingMicState();
}

class _PulsingMicState extends State<_PulsingMic> with SingleTickerProviderStateMixin {
  late final AnimationController _pulse = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1800),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _pulse.stop();
    } else if (!_pulse.isAnimating) {
      _pulse.repeat();
    }
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const size = 48.0;
    return Semantics(
      button: true,
      label: widget.label,
      child: SizedBox(
        width: size + 14,
        height: size + 14,
        child: Stack(
          alignment: Alignment.center,
          children: [
            AnimatedBuilder(
              animation: _pulse,
              builder: (context, _) {
                final t = Curves.easeOut.transform(_pulse.value);
                return Container(
                  width: size + 14 * t,
                  height: size + 14 * t,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: context.colors.green.withValues(alpha: 0.28 * (1 - t)),
                  ),
                );
              },
            ),
            Material(
              color: context.colors.green,
              shape: const CircleBorder(),
              child: InkWell(
                onTap: widget.onTap,
                customBorder: const CircleBorder(),
                child: SizedBox(
                  width: size,
                  height: size,
                  child: Icon(Icons.mic_rounded, size: 24, color: context.colors.onGreen),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
