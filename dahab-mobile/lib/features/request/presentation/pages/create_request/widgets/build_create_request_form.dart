part of 'create_request_widgets_imports.dart';

class BuildCreateRequestForm extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            Translate.s.create_request_category,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap6,
          BuildCreateRequestCategories(controller: controller),
          Gaps.vGap13,
          GenericTextField(
            controller: controller.descriptionController,
            fieldTypes: FieldTypes.rich,
            type: TextInputType.multiline,
            action: TextInputAction.newline,
            max: 5,
            label: Translate.s.create_request_description,
            hint: Translate.s.create_request_description_hint,
            validate: (value) => value.validateDescription(),
            onChange: controller.onDescriptionChanged,
            autoValidateMode: AutovalidateMode.onUserInteraction,
          ),
          Gaps.vGap4,
          Text(
            Translate.s.create_request_hashtag_hint,
            style: AppTextStyle.micro(color: context.colors.text3),
          ),
          BuildCreateRequestHashtagSuggestions(controller: controller),
          Gaps.vGap9,
          BuildCreateRequestAiAssist(controller: controller),
          Gaps.vGap13,
          GenericTextField(
            controller: controller.quantityController,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.number,
            action: TextInputAction.next,
            label: Translate.s.create_request_quantity,
            hint: Translate.s.create_request_quantity_hint,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            validate: (value) => value.validateQuantity(),
            onChange: controller.onQuantityChanged,
            suffixIcon: Padding(
              padding: const EdgeInsetsDirectional.only(end: AppSpacing.lg),
              child: Center(
                widthFactor: 1,
                child: ObsValueConsumer(
                  observable: controller.quantityUnitObs,
                  builder: (context, unit) {
                    return Text(
                      unit,
                      style: AppTextStyle.caption(color: context.colors.text2),
                    );
                  },
                ),
              ),
            ),
            autoValidateMode: AutovalidateMode.onUserInteraction,
          ),
          Gaps.vGap9,
          GenericTextField(
            controller: controller.needByController,
            fieldTypes: FieldTypes.clickable,
            type: TextInputType.datetime,
            action: TextInputAction.next,
            label: Translate.s.create_request_need_by,
            hint: Translate.s.create_request_date_hint,
            validate: (_) {
              if (controller.needByObs.getValue() == null) {
                return Translate.s.create_request_err_date;
              }
              return null;
            },
            onTab: () => controller.pickNeedBy(context),
            suffixIcon: Icon(
              Icons.calendar_today_outlined,
              size: 18,
              color: context.colors.text3,
            ),
            autoValidateMode: AutovalidateMode.onUserInteraction,
          ),
          Gaps.vGap9,
          GenericTextField(
            controller: controller.locationController,
            fieldTypes: FieldTypes.clickable,
            type: TextInputType.streetAddress,
            action: TextInputAction.done,
            label: Translate.s.create_request_location,
            hint: Translate.s.create_request_location_hint,
            validate: (_) {
              if (controller.locationLabelObs.getValue().trim().isEmpty) {
                return Translate.s.create_request_err_location;
              }
              return null;
            },
            onTab: () => controller.openLocationPicker(context),
            suffixIcon: Icon(
              Icons.map_outlined,
              size: 18,
              color: context.colors.text3,
            ),
            autoValidateMode: AutovalidateMode.onUserInteraction,
          ),
          Gaps.vGap9,
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: ObsValueConsumer(
              observable: controller.locatingObs,
              builder: (context, locating) {
                return Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: locating ? null : () => controller.useCurrentLocation(context),
                    borderRadius: AppRadius.buttonAll,
                    splashFactory: NoSplash.splashFactory,
                    child: Container(
                      padding: const EdgeInsetsDirectional.symmetric(
                        horizontal: AppSpacing.lg,
                        vertical: AppSpacing.md,
                      ),
                      decoration: BoxDecoration(
                        color: context.colors.surface2,
                        borderRadius: AppRadius.buttonAll,
                        border: Border.all(color: context.colors.line),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.my_location_outlined,
                            size: 16,
                            color: locating ? context.colors.text3 : context.colors.text,
                          ),
                          Gaps.hGap6,
                          Text(
                            locating
                                ? Translate.s.pick_location_loading
                                : Translate.s.pick_location_current,
                            style: AppTextStyle.caption(
                              color: locating ? context.colors.text3 : context.colors.text,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class BuildCreateRequestCategories extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestCategories({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.categoriesObs,
      builder: (context, categories) {
        return ObsValueConsumer(
          observable: controller.categoryObs,
          builder: (context, selected) {
            return Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final category in categories)
                  GestureDetector(
                    onTap: () => controller.selectCategory(category),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 160),
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg,
                        vertical: AppSpacing.sm,
                      ),
                      decoration: BoxDecoration(
                        color: selected?.id == category.id
                            ? context.colors.button
                            : context.colors.surface2,
                        borderRadius: AppRadius.chipAll,
                        border: Border.all(
                          color: selected?.id == category.id
                              ? context.colors.button
                              : context.colors.line,
                        ),
                      ),
                      child: Text(
                        category.name,
                        style: AppTextStyle.caption(
                          color: selected?.id == category.id
                              ? context.colors.onButton
                              : context.colors.text,
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        );
      },
    );
  }
}

class BuildCreateRequestHashtagSuggestions extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestHashtagSuggestions({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.showHashtagSuggestionsObs,
      builder: (context, show) {
        if (!show) return const SizedBox.shrink();
        return ObsValueConsumer(
          observable: controller.hashtagSuggestionsObs,
          builder: (context, suggestions) {
            if (suggestions.isEmpty) return const SizedBox.shrink();
            return Container(
              margin: const EdgeInsets.only(top: AppSpacing.sm),
              decoration: BoxDecoration(
                color: context.colors.surface1,
                borderRadius: AppRadius.buttonAll,
                border: Border.all(color: context.colors.line),
              ),
              child: Column(
                children: [
                  for (var i = 0; i < suggestions.length; i++) ...[
                    if (i > 0) Divider(height: 1, color: context.colors.line),
                    InkWell(
                      onTap: () => controller.insertHashtag(suggestions[i]),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.lg,
                          vertical: AppSpacing.md,
                        ),
                        child: Row(
                          children: [
                            Text(
                              suggestions[i].hashtag,
                              style: AppTextStyle.body(color: context.colors.text),
                            ),
                            const Spacer(),
                            Text(
                              suggestions[i].name,
                              style: AppTextStyle.caption(color: context.colors.text2),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }
}
