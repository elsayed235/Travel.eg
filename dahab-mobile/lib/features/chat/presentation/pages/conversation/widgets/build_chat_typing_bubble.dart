part of 'conversation_widgets_imports.dart';

class BuildChatTypingBubble extends StatefulWidget {
  const BuildChatTypingBubble({super.key});

  @override
  State<BuildChatTypingBubble> createState() => _BuildChatTypingBubbleState();
}

class _BuildChatTypingBubbleState extends State<BuildChatTypingBubble>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional.centerEnd,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.sm),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
        decoration: BoxDecoration(
          color: context.colors.surface1,
          borderRadius: const BorderRadiusDirectional.only(
            topStart: Radius.circular(AppRadius.card),
            topEnd: Radius.circular(AppRadius.card),
            bottomStart: Radius.circular(AppRadius.card),
            bottomEnd: Radius.circular(AppRadius.image),
          ),
          border: Border.all(color: context.colors.line),
        ),
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) {
                final t = (_controller.value + (i * 0.2)) % 1.0;
                final opacity = 0.35 + (0.65 * (1 - (t - 0.5).abs() * 2).clamp(0.0, 1.0));
                return Padding(
                  padding: EdgeInsetsDirectional.only(end: i == 2 ? 0 : AppSpacing.xs),
                  child: Opacity(
                    opacity: opacity,
                    child: Container(
                      width: 7,
                      height: 7,
                      decoration: BoxDecoration(
                        color: context.colors.text2,
                        borderRadius: AppRadius.chipAll,
                      ),
                    ),
                  ),
                );
              }),
            );
          },
        ),
      ),
    );
  }
}
