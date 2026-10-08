part of 'edit_profile_imports.dart';

class EditProfileController {
  final TextEditingController firstName = TextEditingController(text: 'طارق');
  final TextEditingController lastName = TextEditingController(text: 'فودة');
  final TextEditingController email = TextEditingController(text: 'tarek@dabrha.com');
  final TextEditingController phone = TextEditingController(text: '01012345678');
  final TextEditingController city = TextEditingController(text: 'دمياط الجديدة');
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  final ObsValue<String?> photoPathObs = ObsValue.withInit(null);
  final ImagePicker _picker = ImagePicker();

  Future<void> pickPhoto(ImageSource source) async {
    final file = await _picker.pickImage(
      source: source,
      maxWidth: 1200,
      maxHeight: 1200,
      imageQuality: 85,
    );
    if (file != null) {
      photoPathObs.setValue(file.path);
    }
  }

  void removePhoto() => photoPathObs.setValue(null);

  Future<void> showPhotoSheet(BuildContext context) async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(
              AppSpacing.xl,
              AppSpacing.lg,
              AppSpacing.xl,
              AppSpacing.xl,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  Translate.s.account_photo_title,
                  style: AppTextStyle.sectionTitle(color: context.colors.text),
                  textAlign: TextAlign.center,
                ),
                Gaps.vGap18,
                AppTextButton.maxPrimary(
                  text: Translate.s.camera,
                  onPressed: () async {
                    Navigator.of(ctx).pop();
                    await pickPhoto(ImageSource.camera);
                  },
                ),
                Gaps.vGap9,
                AppTextButton.maxWhite(
                  text: Translate.s.pick,
                  onPressed: () async {
                    Navigator.of(ctx).pop();
                    await pickPhoto(ImageSource.gallery);
                  },
                ),
                if (photoPathObs.getValue() != null) ...[
                  Gaps.vGap9,
                  AppTextButton.maxWhite(
                    text: Translate.s.account_photo_remove,
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      removePhoto();
                    },
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  void save(BuildContext context) {
    if (!(formKey.currentState?.validate() ?? false)) return;
    AppSnackBar.showSimpleToast(msg: Translate.s.account_profile_saved);
    AutoRouter.of(context).maybePop();
  }

  void dispose() {
    firstName.dispose();
    lastName.dispose();
    email.dispose();
    phone.dispose();
    city.dispose();
  }
}
