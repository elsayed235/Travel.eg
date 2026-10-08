part of 'create_request_widgets_imports.dart';

class BuildCreateRequestReachCard extends StatelessWidget {
  final CreateRequestController controller;

  const BuildCreateRequestReachCard({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.matchingOwnersObs,
      builder: (context, owners) {
        final closes = controller.closesAtLabel();
        return Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: context.colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: context.colors.line),
          ),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  width: 3,
                  decoration: BoxDecoration(
                    color: context.colors.green,
                    borderRadius: const BorderRadiusDirectional.only(
                      topStart: Radius.circular(AppRadius.card),
                      bottomStart: Radius.circular(AppRadius.card),
                    ),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsetsDirectional.only(
                      start: AppSpacing.lg,
                      end: AppSpacing.lg,
                      top: AppSpacing.lg,
                      bottom: AppSpacing.lg,
                    ),
                    child: Text(
                      Translate.s.create_request_reach(
                        owners.toArabicDigits,
                        closes,
                      ),
                      style: AppTextStyle.body(color: context.colors.text2),
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
