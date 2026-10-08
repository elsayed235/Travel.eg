part of 'create_request_imports.dart';

@RoutePage(name: 'CreateRequestRoute')
class CreateRequest extends StatefulWidget {
  /// Pre-filled request text; the smart composer runs on it right away.
  final String? initialText;

  /// Start voice dictation as soon as the form is ready.
  final bool startVoice;

  const CreateRequest({super.key, this.initialText, this.startVoice = false});

  @override
  State<CreateRequest> createState() => _CreateRequestState();
}

class _CreateRequestState extends State<CreateRequest> {
  late final CreateRequestController controller = CreateRequestController(
    initialText: widget.initialText,
    startVoice: widget.startVoice,
  );

  @override
  void initState() {
    super.initState();
    controller.init(phone: context.read<UserCubit>().state.model?.phone);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      body: SafeArea(
        child: RequesterConsumer<CreateRequestPreviewDomainModel>(
          requester: controller.previewRequester,
          loadingBuilder: (_) => AppScreenShimmer.createRequest(),
          failureBuilder: (context, error, callback) => Center(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(error.message, style: AppTextStyle.body(color: context.colors.red)),
                  Gaps.vGap13,
                  TextButton(onPressed: callback, child: Text(Translate.s.retry)),
                ],
              ),
            ),
          ),
          successBuilder: (context, preview, _) {
            controller.applyPreview(preview);
            return ObsValueConsumer(
              observable: controller.stepObs,
              builder: (context, step) {
                return Column(
                  children: [
                    Expanded(
                      child: ListView(
                        padding: const EdgeInsetsDirectional.symmetric(
                          horizontal: AppSpacing.xl,
                          vertical: AppSpacing.lg,
                        ),
                        children: [
                          BuildCreateRequestHeader(
                            controller: controller,
                            onClose: () => controller.onClose(context),
                          ),
                          Gaps.vGap18,
                          if (step == 0) ...[
                            BuildCreateRequestPhoto(controller: controller),
                            Gaps.vGap13,
                            BuildCreateRequestForm(controller: controller),
                          ] else ...[
                            BuildCreateRequestStepTwo(controller: controller),
                          ],
                          Gaps.vGap24,
                        ],
                      ),
                    ),
                    BuildCreateRequestSubmit(controller: controller),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }
}
