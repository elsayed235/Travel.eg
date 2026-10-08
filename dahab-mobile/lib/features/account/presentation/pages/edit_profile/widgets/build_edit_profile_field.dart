part of '../edit_profile_imports.dart';

class BuildEditProfileField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final TextInputType type;
  final TextInputAction action;
  final String? Function(String?) validate;
  final int maxLines;

  const BuildEditProfileField({
    super.key,
    required this.label,
    required this.controller,
    required this.type,
    required this.action,
    required this.validate,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyle.caption(color: context.colors.text2)),
        Gaps.vGap6,
        TextFormField(
          controller: controller,
          keyboardType: type,
          textInputAction: action,
          maxLines: maxLines,
          style: AppTextStyle.body(color: context.colors.text),
          validator: validate,
          cursorColor: context.colors.button,
          decoration: InputDecoration(
            filled: true,
            fillColor: context.colors.surface2,
            contentPadding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.lg,
            ),
            border: OutlineInputBorder(
              borderRadius: AppRadius.buttonAll,
              borderSide: BorderSide(color: context.colors.line),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: AppRadius.buttonAll,
              borderSide: BorderSide(color: context.colors.line),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: AppRadius.buttonAll,
              borderSide: BorderSide(color: context.colors.button),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: AppRadius.buttonAll,
              borderSide: BorderSide(color: context.colors.red),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: AppRadius.buttonAll,
              borderSide: BorderSide(color: context.colors.red),
            ),
          ),
        ),
      ],
    );
  }
}
