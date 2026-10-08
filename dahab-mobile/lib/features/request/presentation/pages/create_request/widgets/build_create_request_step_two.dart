part of 'create_request_widgets_imports.dart';

class BuildCreateRequestStepTwo extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestStepTwo({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        BuildCreateRequestSummaryCard(controller: controller),
        Gaps.vGap18,
        Text(
          Translate.s.create_request_radius_title,
          style: AppTextStyle.sectionTitle(color: context.colors.text),
        ),
        Gaps.vGap6,
        Text(
          Translate.s.create_request_radius_hint,
          style: AppTextStyle.caption(color: context.colors.text2),
        ),
        Gaps.vGap13,
        BuildCreateRequestRadiusRow(controller: controller),
        Gaps.vGap18,
        Text(
          Translate.s.create_request_delivery_title,
          style: AppTextStyle.sectionTitle(color: context.colors.text),
        ),
        Gaps.vGap13,
        BuildCreateRequestDeliveryRow(controller: controller),
        Gaps.vGap18,
        BuildCreateRequestVerifiedToggle(controller: controller),
        Gaps.vGap13,
        BuildCreateRequestContactsSection(controller: controller),
        Gaps.vGap13,
        BuildCreateRequestTermsAccept(controller: controller),
        Gaps.vGap13,
        BuildCreateRequestReachCard(controller: controller),
        Gaps.vGap13,
        BuildCreateRequestCloseNote(controller: controller),
      ],
    );
  }
}

class BuildCreateRequestSummaryCard extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestSummaryCard({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  Translate.s.create_request_summary_title,
                  style: AppTextStyle.sectionTitle(color: context.colors.text),
                ),
              ),
              GestureDetector(
                onTap: controller.goToStep1,
                child: Text(
                  Translate.s.create_request_edit,
                  style: AppTextStyle.caption(color: context.colors.text2),
                ),
              ),
            ],
          ),
          Gaps.vGap9,
          ObsValueConsumer(
            observable: controller.descriptionObs,
            builder: (context, description) {
              return Text(
                description,
                style: AppTextStyle.itemTitle(color: context.colors.text),
              );
            },
          ),
          Gaps.vGap6,
          Text(
            controller.summaryLine(),
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap6,
          Text(
            controller.locationLabel(),
            style: AppTextStyle.caption(color: context.colors.text3),
          ),
          Gaps.vGap9,
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              ObsValueConsumer(
                observable: controller.categoryObs,
                builder: (context, category) {
                  if (category == null) return const SizedBox.shrink();
                  return AppChip(label: category.name, kind: AppChipKind.verified);
                },
              ),
              ObsValueConsumer(
                observable: controller.hasPhotoObs,
                builder: (context, hasPhotoFlag) {
                  final hasPhoto =
                      hasPhotoFlag || controller.photoFileObs.getValue() != null;
                  return AppChip(
                    label: hasPhoto
                        ? Translate.s.create_request_photo_chip_on
                        : Translate.s.create_request_photo_chip_off,
                    kind: hasPhoto ? AppChipKind.available : AppChipKind.neutral,
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class BuildCreateRequestTermsAccept extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestTermsAccept({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.termsAcceptedObs,
      builder: (context, accepted) {
        return GestureDetector(
          onTap: controller.toggleTermsAccepted,
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: context.colors.surface1,
              borderRadius: AppRadius.cardAll,
              border: Border.all(color: context.colors.line),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  accepted ? Icons.check_box : Icons.check_box_outline_blank,
                  size: 22,
                  color: accepted ? context.colors.text : context.colors.text3,
                ),
                Gaps.hGap9,
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        Translate.s.create_request_terms_accept,
                        style: AppTextStyle.body(color: context.colors.text),
                      ),
                      Gaps.vGap4,
                      GestureDetector(
                        onTap: () => controller.openTerms(context),
                        child: Text(
                          Translate.s.create_request_terms_link,
                          style: AppTextStyle.caption(color: context.colors.text2).copyWith(
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class BuildCreateRequestRadiusRow extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestRadiusRow({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.radiusOptionsObs,
      builder: (context, options) {
        return ObsValueConsumer(
          observable: controller.radiusKmObs,
          builder: (context, selectedKm) {
            return Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final option in options)
                  _SelectablePill(
                    label: Translate.s.create_request_radius_km(option.km.toArabicDigits),
                    selected: option.km == selectedKm,
                    onTap: () => controller.toggleRadius(option.km),
                  ),
              ],
            );
          },
        );
      },
    );
  }
}

class BuildCreateRequestDeliveryRow extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestDeliveryRow({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.deliveryObs,
      builder: (context, selected) {
        return Column(
          children: [
            for (final pref in RequestDeliveryPref.values) ...[
              if (pref != RequestDeliveryPref.values.first) Gaps.vGap9,
              _DeliveryOptionTile(
                label: controller.deliveryLabel(pref),
                selected: pref == selected,
                onTap: () => controller.setDelivery(pref),
              ),
            ],
          ],
        );
      },
    );
  }
}

class BuildCreateRequestVerifiedToggle extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestVerifiedToggle({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.verifiedOnlyObs,
      builder: (context, enabled) {
        return GestureDetector(
          onTap: controller.toggleVerifiedOnly,
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: context.colors.surface1,
              borderRadius: AppRadius.cardAll,
              border: Border.all(color: context.colors.line),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        Translate.s.create_request_verified_title,
                        style: AppTextStyle.sectionTitle(color: context.colors.text),
                      ),
                      Gaps.vGap4,
                      Text(
                        Translate.s.create_request_verified_hint,
                        style: AppTextStyle.caption(color: context.colors.text2),
                      ),
                    ],
                  ),
                ),
                Gaps.hGap13,
                AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  width: 44,
                  height: 26,
                  padding: const EdgeInsets.all(AppSpacing.xs),
                  decoration: BoxDecoration(
                    color: enabled ? context.colors.button : context.colors.surface3,
                    borderRadius: AppRadius.buttonAll,
                  ),
                  alignment: enabled
                      ? AlignmentDirectional.centerEnd
                      : AlignmentDirectional.centerStart,
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: enabled ? context.colors.onButton : context.colors.surface1,
                      borderRadius: AppRadius.chipAll,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class BuildCreateRequestContactsSection extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestContactsSection({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            Translate.s.create_request_contacts_title,
            style: AppTextStyle.sectionTitle(color: context.colors.text),
          ),
          Gaps.vGap6,
          Text(
            Translate.s.create_request_contacts_hint,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap13,
          ObsValueConsumer(
            observable: controller.sharePhoneObs,
            builder: (context, sharePhone) {
              return Column(
                children: [
                  _ContactToggleRow(
                    title: Translate.s.create_request_share_phone,
                    subtitle: Translate.s.create_request_share_phone_hint,
                    enabled: sharePhone,
                    onTap: controller.toggleSharePhone,
                  ),
                  if (sharePhone) ...[
                    Gaps.vGap9,
                    GenericTextField(
                      controller: controller.contactPhoneController,
                      fieldTypes: FieldTypes.normal,
                      type: TextInputType.phone,
                      action: TextInputAction.next,
                      validate: (v) => null,
                      label: Translate.s.create_request_phone_label,
                      onChange: controller.onContactPhoneChanged,
                    ),
                  ],
                ],
              );
            },
          ),
          Gaps.vGap13,
          ObsValueConsumer(
            observable: controller.shareWhatsappObs,
            builder: (context, shareWhatsapp) {
              return Column(
                children: [
                  _ContactToggleRow(
                    title: Translate.s.create_request_share_whatsapp,
                    subtitle: Translate.s.create_request_share_whatsapp_hint,
                    enabled: shareWhatsapp,
                    onTap: controller.toggleShareWhatsapp,
                  ),
                  if (shareWhatsapp) ...[
                    Gaps.vGap9,
                    ObsValueConsumer(
                      observable: controller.whatsappSameAsPhoneObs,
                      builder: (context, same) {
                        return Column(
                          children: [
                            _ContactToggleRow(
                              title: Translate.s.create_request_whatsapp_same,
                              subtitle: Translate.s.create_request_whatsapp_same_hint,
                              enabled: same,
                              onTap: controller.toggleWhatsappSameAsPhone,
                            ),
                            if (!same) ...[
                              Gaps.vGap9,
                              GenericTextField(
                                controller: controller.contactWhatsappController,
                                fieldTypes: FieldTypes.normal,
                                type: TextInputType.phone,
                                action: TextInputAction.done,
                                validate: (v) => null,
                                label: Translate.s.create_request_whatsapp_label,
                              ),
                            ],
                          ],
                        );
                      },
                    ),
                  ],
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _ContactToggleRow extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool enabled;
  final VoidCallback onTap;

  const _ContactToggleRow({
    required this.title,
    required this.subtitle,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyle.body(color: context.colors.text)),
                Gaps.vGap4,
                Text(subtitle, style: AppTextStyle.caption(color: context.colors.text2)),
              ],
            ),
          ),
          Gaps.hGap13,
          AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            width: 44,
            height: 26,
            padding: const EdgeInsets.all(AppSpacing.xs),
            decoration: BoxDecoration(
              color: enabled ? context.colors.button : context.colors.surface3,
              borderRadius: AppRadius.buttonAll,
            ),
            alignment:
                enabled ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart,
            child: Container(
              width: 18,
              height: 18,
              decoration: BoxDecoration(
                color: enabled ? context.colors.onButton : context.colors.surface1,
                borderRadius: AppRadius.chipAll,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BuildCreateRequestCloseNote extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestCloseNote({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Text(
      Translate.s.create_request_close_note(controller.closesAtLabel()),
      style: AppTextStyle.caption(color: context.colors.text3),
    );
  }
}

class _SelectablePill extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _SelectablePill({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: selected ? context.colors.button : context.colors.surface2,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(
            color: selected ? context.colors.button : context.colors.line,
          ),
        ),
        child: Text(
          label,
          style: AppTextStyle.body(
            color: selected ? context.colors.onButton : context.colors.text,
          ),
        ),
      ),
    );
  }
}

class _DeliveryOptionTile extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _DeliveryOptionTile({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          color: context.colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(
            color: selected ? context.colors.text : context.colors.line,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(label, style: AppTextStyle.body(color: context.colors.text)),
            ),
            Icon(
              selected ? Icons.check_circle : Icons.circle_outlined,
              size: 20,
              color: selected ? context.colors.text : context.colors.text3,
            ),
          ],
        ),
      ),
    );
  }
}
