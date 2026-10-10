part of '../edit_profile_imports.dart';

class BuildEditProfileAvatar extends StatelessWidget {
  final EditProfileController controller;

  const BuildEditProfileAvatar({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.photoPathObs,
      builder: (context, path) {
        return Center(
          child: Column(
            children: [
              GestureDetector(
                onTap: () => controller.showPhotoSheet(context),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        color: context.colors.surface3,
                        borderRadius: AppRadius.cardAll,
                        border: Border.all(color: context.colors.line),
                        image: path != null
                            ? DecorationImage(
                                image: FileImage(File(path)),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      alignment: Alignment.center,
                      child: path == null
                          ? Text(
                              '${controller.firstName.text.isNotEmpty ? controller.firstName.text.substring(0, 1) : ''}${controller.lastName.text.isNotEmpty ? controller.lastName.text.substring(0, 1) : ''}',
                              style: AppTextStyle.sectionTitle(color: context.colors.text),
                            )
                          : null,
                    ),
                    PositionedDirectional(
                      end: -4,
                      bottom: -4,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: context.colors.button,
                          borderRadius: AppRadius.buttonAll,
                          border: Border.all(color: context.colors.bg, width: 2),
                        ),
                        child: AppIcon.ui(
                          AppIcons.camera,
                          size: 16,
                          color: context.colors.onButton,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Gaps.vGap13,
              GestureDetector(
                onTap: () => controller.showPhotoSheet(context),
                child: Text(
                  Translate.s.account_photo_change,
                  style: AppTextStyle.body(color: context.colors.text2),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
