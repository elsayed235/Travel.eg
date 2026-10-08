part of 'conversation_widgets_imports.dart';

class BuildChatComposer extends StatelessWidget {
  final TextEditingController controller;
  final ObsValue<bool> sendingObs;
  final ObsValue<bool> hasTextObs;
  final VoidCallback onSend;
  final VoidCallback onAttach;
  final VoidCallback onCamera;

  const BuildChatComposer({
    super.key,
    required this.controller,
    required this.sendingObs,
    required this.hasTextObs,
    required this.onSend,
    required this.onAttach,
    required this.onCamera,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
        AppSpacing.md,
      ),
      color: context.colors.surface1,
      child: SafeArea(
        top: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: Container(
                constraints: const BoxConstraints(minHeight: 44),
                padding: const EdgeInsetsDirectional.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xs,
                ),
                decoration: BoxDecoration(
                  color: context.colors.surface2,
                  borderRadius: BorderRadius.circular(AppRadius.sheet),
                  border: Border.all(color: context.colors.line),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onAttach,
                        borderRadius: AppRadius.buttonAll,
                        splashFactory: NoSplash.splashFactory,
                        child: SizedBox(
                          width: 36,
                          height: 36,
                          child: Icon(
                            Icons.add_circle_outline_rounded,
                            size: 22,
                            color: context.colors.text2,
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsetsDirectional.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: AppSpacing.sm,
                        ),
                        child: TextField(
                          controller: controller,
                          minLines: 1,
                          maxLines: 5,
                          style: AppTextStyle.body(color: context.colors.text),
                          decoration: InputDecoration.collapsed(
                            hintText: Translate.s.chat_composer_hint,
                            hintStyle: AppTextStyle.body(color: context.colors.text3),
                          ),
                          textInputAction: TextInputAction.newline,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Gaps.hGap9,
            ObsValueConsumer(
              observable: sendingObs,
              builder: (context, sending) {
                return ObsValueConsumer(
                  observable: hasTextObs,
                  builder: (context, hasText) {
                    return Material(
                      color: context.colors.button,
                      borderRadius: AppRadius.buttonAll,
                      child: InkWell(
                        onTap: sending
                            ? null
                            : hasText
                                ? onSend
                                : onCamera,
                        borderRadius: AppRadius.buttonAll,
                        splashFactory: NoSplash.splashFactory,
                        child: SizedBox(
                          width: 44,
                          height: 44,
                          child: Icon(
                            hasText ? Icons.send_rounded : Icons.camera_alt_rounded,
                            size: 18,
                            color: context.colors.onButton,
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
