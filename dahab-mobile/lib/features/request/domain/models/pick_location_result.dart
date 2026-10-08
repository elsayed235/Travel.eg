import 'package:google_maps_flutter/google_maps_flutter.dart';

class PickLocationResult {
  final LatLng latLng;
  final String address;
  final int distanceKm;

  const PickLocationResult({
    required this.latLng,
    required this.address,
    this.distanceKm = 15,
  });
}
