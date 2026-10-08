import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';

enum ExploreSort { nearest, soonest }

class ExploreCategory {
  final String id;
  final String label;

  const ExploreCategory({required this.id, required this.label});
}

/// Explore uses the same request-shaped card as home (no price).
class ExploreListingDomainModel {
  final String id;
  final String title;
  final String requesterName;
  final String categoryId;
  final String categoryName;
  final int quantity;
  final String quantityUnit;
  final DateTime needBy;
  final double distanceKm;
  final int? placeholderColor;
  final String? imageUrl;

  const ExploreListingDomainModel({
    required this.id,
    required this.title,
    required this.requesterName,
    required this.categoryId,
    required this.categoryName,
    required this.quantity,
    required this.needBy,
    required this.distanceKm,
    this.quantityUnit = 'قطعة',
    this.placeholderColor,
    this.imageUrl,
  });

  ListingDomainModel toListing() {
    return ListingDomainModel(
      id: id,
      title: title,
      requesterName: requesterName,
      categoryId: categoryId,
      categoryName: categoryName,
      quantity: quantity,
      quantityUnit: quantityUnit,
      needBy: needBy,
      distanceKm: distanceKm,
      placeholderColor: placeholderColor,
      imageUrl: imageUrl,
    );
  }
}

class ExploreDomainModel {
  final String locationLabel;
  final int radiusKm;
  final List<ExploreCategory> categories;
  final List<ExploreListingDomainModel> listings;

  const ExploreDomainModel({
    required this.locationLabel,
    required this.radiusKm,
    required this.categories,
    required this.listings,
  });
}
