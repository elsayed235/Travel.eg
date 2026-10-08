enum ListingChipKind { available, verified, insurance, neutral }

/// Legacy dual-cycle; feed is requests-only (مطلوب).
enum MarketplaceSide { offer, request }

class ListingChip {
  final String label;
  final ListingChipKind kind;

  const ListingChip({required this.label, required this.kind});
}

/// Home / explore request card — mirrors create-request inputs (no price).
class ListingDomainModel {
  final String id;
  final String title;
  final String requesterName;
  final String categoryId;
  final String categoryName;
  final int quantity;
  final String quantityUnit;
  final DateTime needBy;
  final double distanceKm;
  final String? locationLabel;
  final int? placeholderColor;
  final String? imageUrl;

  const ListingDomainModel({
    required this.id,
    required this.title,
    required this.requesterName,
    required this.categoryId,
    required this.categoryName,
    required this.quantity,
    required this.needBy,
    required this.distanceKm,
    this.quantityUnit = 'قطعة',
    this.locationLabel,
    this.placeholderColor,
    this.imageUrl,
  });

  MarketplaceSide get side => MarketplaceSide.request;
}

class HomeFeedDomainModel {
  final String locationLabel;
  final int locationDistanceKm;
  final int ownersInRange;
  final int totalRequests;
  final List<ListingDomainModel> listings;

  const HomeFeedDomainModel({
    required this.locationLabel,
    required this.locationDistanceKm,
    required this.ownersInRange,
    required this.totalRequests,
    required this.listings,
  });
}
