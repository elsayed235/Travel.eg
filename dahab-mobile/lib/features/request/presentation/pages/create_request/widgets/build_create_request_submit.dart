part of 'create_request_widgets_imports.dart';

class BuildCreateRequestSubmit extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestSubmit({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.stepObs,
      builder: (context, step) {
        return SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(
              AppSpacing.xl,
              AppSpacing.sm,
              AppSpacing.xl,
              AppSpacing.lg,
            ),
            child: AppTextButton.maxPrimary(
              text: step == 0
                  ? Translate.s.create_request_submit
                  : Translate.s.create_request_publish,
              onPressed: () => controller.onPrimary(context),
            ),
          ),
        );
      },
    );
  }
}
