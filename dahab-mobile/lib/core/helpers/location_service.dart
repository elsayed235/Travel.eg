import 'package:geocode/geocode.dart';
import 'package:get_it/get_it.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:injectable/injectable.dart';

@injectable
class LocationService {
  LocationService();

  static LocationService get instance => GetIt.I<LocationService>();

  Future<String> getAddress(LatLng latLng) async {
    GeoCode geoCode = GeoCode();
    try {
      var address = await geoCode.reverseGeocoding(latitude: latLng.latitude, longitude: latLng.longitude);
      var data = "${address.countryName??""}  ${address.city??""}  ${address.region??""}  ${address.streetAddress??""}";
      return data;
    } catch (e) {
      return "";
    }
  }
}
