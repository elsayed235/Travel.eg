part of 'create_request_widgets_imports.dart';

class BuildCreateRequestPhoto extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestPhoto({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.photoFileObs,
      builder: (context, file) {
        final hasPhoto = file != null;
        return GestureDetector(
          onTap: () => controller.pickPhoto(context),
          child: BuildDashedBorder(
            color: context.colors.line2,
            child: Container(
              width: double.infinity,
              padding: hasPhoto
                  ? EdgeInsets.zero
                  : const EdgeInsetsDirectional.symmetric(
                      horizontal: AppSpacing.xl,
                      vertical: AppSpacing.xxl,
                    ),
              decoration: BoxDecoration(
                color: hasPhoto ? context.colors.surface2 : context.colors.surface1,
                borderRadius: AppRadius.buttonAll,
              ),
              clipBehavior: Clip.antiAlias,
              child: hasPhoto
                  ? Stack(
                      children: [
                        Image.file(
                          file,
                          width: double.infinity,
                          height: 160,
                          fit: BoxFit.cover,
                        ),
                        PositionedDirectional(
                          top: AppSpacing.sm,
                          end: AppSpacing.sm,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _PhotoActionChip(
                                label: Translate.s.create_request_change_photo,
                                onTap: () => controller.pickPhoto(context),
                              ),
                              Gaps.hGap6,
                              _PhotoActionChip(
                                label: Translate.s.create_request_remove_photo,
                                onTap: controller.removePhoto,
                              ),
                            ],
                          ),
                        ),
                        PositionedDirectional(
                          start: AppSpacing.sm,
                          bottom: AppSpacing.sm,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.sm,
                              vertical: AppSpacing.xs,
                            ),
                            decoration: BoxDecoration(
                              color: context.colors.bg,
                              borderRadius: AppRadius.chipAll,
                              border: Border.all(color: context.colors.line),
                            ),
                            child: Text(
                              Translate.s.create_request_photo_added,
                              style: AppTextStyle.micro(color: context.colors.green),
                            ),
                          ),
                        ),
                      ],
                    )
                  : Column(
                      children: [
                        Icon(
                          Icons.photo_camera_outlined,
                          size: 28,
                          color: context.colors.text3,
                        ),
                        Gaps.vGap9,
                        Text(
                          Translate.s.create_request_photo_title,
                          textAlign: TextAlign.center,
                          style: AppTextStyle.body(color: context.colors.text),
                        ),
                        Gaps.vGap4,
                        Text(
                          Translate.s.create_request_photo_subtitle,
                          textAlign: TextAlign.center,
                          style: AppTextStyle.caption(color: context.colors.text2),
                        ),
                      ],
                    ),
            ),
          ),
        );
      },
    );
  }
}

class _PhotoActionChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _PhotoActionChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: context.colors.bg,
          borderRadius: AppRadius.chipAll,
          border: Border.all(color: context.colors.line),
        ),
        child: Text(label, style: AppTextStyle.micro(color: context.colors.text)),
      ),
    );
  }
}
