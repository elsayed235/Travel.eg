part of 'splash_widgets_imports.dart';

class BuildSplashProgress extends StatelessWidget {
  final double progress;
  final double trustFade;

  const BuildSplashProgress({
    super.key,
    required this.progress,
    required this.trustFade,
  });

  @override
  Widget build(BuildContext context) {
    final p = progress.clamp(0.0, 1.0);
    return Column(
      children: [
        // Quiet commitment cue — progress without urgency anxiety
        ClipRRect(
          borderRadius: AppRadius.chipAll,
          child: SizedBox(
            height: 2,
            width: double.infinity,
            child: Stack(
              children: [
                ColoredBox(color: context.colors.line),
                FractionallySizedBox(
                  widthFactor: p,
                  alignment: AlignmentDirectional.centerStart,
                  child: ColoredBox(color: context.colors.button),
                ),
              ],
            ),
          ),
        ),
        Gaps.vGap13,
        Opacity(
          opacity: (p * 1.35).clamp(0.0, trustFade.clamp(0.0, 1.0)),
          child: Text(
            Translate.s.loadingText,
            style: AppTextStyle.micro(color: context.colors.text3),
          ),
        ),
      ],
    );
  }
}
