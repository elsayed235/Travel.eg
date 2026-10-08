enum RequestDeliveryPref { onSite, pickup, either }

/// Kept for listing / legacy copy; create-request flow no longer uses these.
enum RequestDealType { rent, buy, both }

enum RequestPaymentMethod { online, cash }

enum RequestInsurancePayer { requester, owner }

class RequestCategory {
  final String id;
  final String name;

  const RequestCategory({required this.id, required this.name});

  String get hashtag => '#$name';
}

class RequestRadiusOption {
  final int km;
  final int matchingOwners;

  const RequestRadiusOption({
    required this.km,
    required this.matchingOwners,
  });
}

class CreateRequestPreviewDomainModel {
  final String description;
  final int quantity;
  final String quantityUnit;
  final DateTime needBy;
  final DateTime closesAt;
  final String locationLabel;
  final int locationDistanceKm;
  final int matchingOwners;
  final int? defaultRadiusKm;
  final List<RequestRadiusOption> radiusOptions;
  final List<RequestCategory> categories;

  const CreateRequestPreviewDomainModel({
    required this.description,
    required this.quantity,
    required this.quantityUnit,
    required this.needBy,
    required this.closesAt,
    required this.locationLabel,
    required this.locationDistanceKm,
    required this.matchingOwners,
    this.defaultRadiusKm,
    this.radiusOptions = const [],
    this.categories = const [],
  });
}
