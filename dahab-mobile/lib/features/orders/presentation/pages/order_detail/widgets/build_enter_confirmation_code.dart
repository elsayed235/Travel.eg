part of 'order_detail_widgets_imports.dart';

class BuildEnterConfirmationCode extends StatelessWidget {
  final TextEditingController controller;
  final ObsValue<bool> verifyingObs;
  final VoidCallback onVerify;

  const BuildEnterConfirmationCode({
    super.key,
    required this.controller,
    required this.verifyingObs,
    required this.onVerify,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            Translate.s.order_detail_enter_code_title,
            style: AppTextStyle.sectionTitle(color: context.colors.text),
          ),
          Gaps.vGap6,
          Text(
            Translate.s.order_detail_enter_code_hint,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap13,
          GenericTextField(
            controller: controller,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.number,
            action: TextInputAction.done,
            validate: (v) => null,
            label: Translate.s.order_detail_enter_code_label,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            maxLength: 6,
            onSubmit: onVerify,
          ),
          Gaps.vGap13,
          ObsValueConsumer(
            observable: verifyingObs,
            builder: (context, verifying) {
              return AppTextButton.maxPrimary(
                text: Translate.s.order_detail_enter_code_submit,
                onPressed: verifying ? null : onVerify,
              );
            },
          ),
        ],
      ),
    );
  }
}
