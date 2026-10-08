part of 'pick_location_imports.dart';

class PickLocationController {
  PickLocationController({
    required double initialLat,
    required double initialLng,
  }) {
    pinObs.setValue(LatLng(initialLat, initialLng));
  }

  final ObsValue<LatLng> pinObs = ObsValue.withInit(const LatLng(31.4225, 31.6584));
  final ObsValue<String> addressObs = ObsValue.withInit('');
  final ObsValue<bool> loadingObs = ObsValue.withInit(false);

  GoogleMapController? mapController;

  Future<void> init() async {
    await reverseGeocode(pinObs.getValue());
  }

  void onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  Future<void> onCameraIdle() async {
    final pin = pinObs.getValue();
    await reverseGeocode(pin);
  }

  void onCameraMove(CameraPosition position) {
    pinObs.setValue(position.target);
  }

  Future<void> reverseGeocode(LatLng latLng) async {
    loadingObs.setValue(true);
    final address = await LocationService.instance.getAddress(latLng);
    addressObs.setValue(
      address.trim().isEmpty ? Translate.s.pick_location_failed : address.trim(),
    );
    loadingObs.setValue(false);
  }

  Future<void> goToCurrentLocation(BuildContext context) async {
    loadingObs.setValue(true);
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        AppSnackBar.showSimpleToast(msg: Translate.s.pick_location_failed);
        loadingObs.setValue(false);
        return;
      }
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      final target = LatLng(position.latitude, position.longitude);
      pinObs.setValue(target);
      await mapController?.animateCamera(CameraUpdate.newLatLngZoom(target, 16));
      await reverseGeocode(target);
    } catch (_) {
      AppSnackBar.showSimpleToast(msg: Translate.s.pick_location_failed);
      loadingObs.setValue(false);
    }
  }

  void confirm(BuildContext context) {
    final address = addressObs.getValue();
    if (address.isEmpty || address == Translate.s.pick_location_failed) {
      AppSnackBar.showSimpleToast(msg: Translate.s.pick_location_failed);
      return;
    }
    AutoRouter.of(context).maybePop(
      PickLocationResult(latLng: pinObs.getValue(), address: address),
    );
  }

  void dispose() {
    mapController?.dispose();
  }
}
