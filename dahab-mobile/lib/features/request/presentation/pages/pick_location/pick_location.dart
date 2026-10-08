part of 'pick_location_imports.dart';

@RoutePage(name: 'PickLocationRoute')
class PickLocation extends StatefulWidget {
  final double initialLat;
  final double initialLng;

  const PickLocation({
    super.key,
    required this.initialLat,
    required this.initialLng,
  });

  @override
  State<PickLocation> createState() => _PickLocationState();
}

class _PickLocationState extends State<PickLocation> {
  late final PickLocationController controller;

  @override
  void initState() {
    super.initState();
    controller = PickLocationController(
      initialLat: widget.initialLat,
      initialLng: widget.initialLng,
    );
    controller.init();
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
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.lg,
              ),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => AutoRouter.of(context).maybePop(),
                    behavior: HitTestBehavior.opaque,
                    child: Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 14,
                      color: context.colors.text,
                    ),
                  ),
                  Gaps.hGap9,
                  Expanded(
                    child: Text(
                      Translate.s.pick_location_title,
                      style: AppTextStyle.screenTitle(color: context.colors.text),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  ObsValueConsumer(
                    observable: controller.pinObs,
                    builder: (context, pin) {
                      return GoogleMap(
                        initialCameraPosition: CameraPosition(target: pin, zoom: 15),
                        myLocationEnabled: true,
                        myLocationButtonEnabled: false,
                        zoomControlsEnabled: false,
                        mapToolbarEnabled: false,
                        compassEnabled: false,
                        onMapCreated: controller.onMapCreated,
                        onCameraMove: controller.onCameraMove,
                        onCameraIdle: controller.onCameraIdle,
                      );
                    },
                  ),
                  IgnorePointer(
                    child: Icon(
                      Icons.location_on,
                      size: 40,
                      color: context.colors.button,
                    ),
                  ),
                  PositionedDirectional(
                    start: AppSpacing.xl,
                    end: AppSpacing.xl,
                    bottom: AppSpacing.xl,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        ObsValueConsumer(
                          observable: controller.addressObs,
                          builder: (context, address) {
                            return ObsValueConsumer(
                              observable: controller.loadingObs,
                              builder: (context, loading) {
                                return Container(
                                  padding: const EdgeInsets.all(AppSpacing.lg),
                                  decoration: BoxDecoration(
                                    color: context.colors.surface1,
                                    borderRadius: AppRadius.cardAll,
                                    border: Border.all(color: context.colors.line),
                                  ),
                                  child: Text(
                                    loading
                                        ? Translate.s.pick_location_loading
                                        : (address.isEmpty
                                            ? Translate.s.pick_location_loading
                                            : address),
                                    style: AppTextStyle.body(color: context.colors.text),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                        Gaps.vGap9,
                        AppTextButton.maxCustom(
                          text: Translate.s.pick_location_current,
                          onPressed: () => controller.goToCurrentLocation(context),
                          bgColor: context.colors.surface2,
                          txtColor: context.colors.text,
                        ),
                        Gaps.vGap9,
                        AppTextButton.maxPrimary(
                          text: Translate.s.pick_location_confirm,
                          onPressed: () => controller.confirm(context),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
