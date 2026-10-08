part of 'conversation_widgets_imports.dart';

class BuildChatAttachSheet extends StatelessWidget {
  final VoidCallback onCamera;
  final VoidCallback onGallery;

  const BuildChatAttachSheet({
    super.key,
    required this.onCamera,
    required this.onGallery,
  });

  @override
  Widget build(BuildContext context) {
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
          children: [
            Text(
              Translate.s.chat_attach_image,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
            ),
            Gaps.vGap18,
            Row(
              children: [
                Expanded(
                  child: _AttachTile(
                    icon: Icons.photo_camera_outlined,
                    label: Translate.s.chat_attach_camera,
                    onTap: onCamera,
                  ),
                ),
                Gaps.hGap13,
                Expanded(
                  child: _AttachTile(
                    icon: Icons.photo_library_outlined,
                    label: Translate.s.chat_attach_gallery,
                    onTap: onGallery,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AttachTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _AttachTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.surface2,
      borderRadius: AppRadius.cardAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.cardAll,
        splashFactory: NoSplash.splashFactory,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.xl),
          decoration: BoxDecoration(
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: context.colors.line),
          ),
          child: Column(
            children: [
              Icon(icon, size: 26, color: context.colors.text),
              Gaps.vGap9,
              Text(label, style: AppTextStyle.caption(color: context.colors.text2)),
            ],
          ),
        ),
      ),
    );
  }
}
