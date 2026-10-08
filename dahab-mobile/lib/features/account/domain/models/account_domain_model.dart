enum AccountRequestStatus { open, closed, cancelled }

/// Owner-side listing lifecycle (items I published for others to rent/buy).
enum AccountListingStatus {
  active,
  offerReceived,
  insuranceHeld,
  depositPaid,
  inProgress,
  lateFeeDue,
  completed,
  paused,
}

enum AccountListingDealType { rent, buy, both }

enum AccountListingInsurancePayer { requester, owner }

enum AccountListingPaymentMethod { online, cash }

class AccountAddress {
  final String id;
  final String title;
  final String details;
  final bool isDefault;

  const AccountAddress({
    required this.id,
    required this.title,
    required this.details,
    this.isDefault = false,
  });
}

class AccountStats {
  final int ordersCount;
  final int listingsCount;
  final int requestsCount;
  final int reviewsCount;

  const AccountStats({
    required this.ordersCount,
    required this.listingsCount,
    required this.requestsCount,
    required this.reviewsCount,
  });
}

class AccountListingMoneyCycle {
  final double insurancePercent;
  final num insuranceAmount;
  final AccountListingInsurancePayer insurancePayer;
  final double depositPercent;
  final num depositAmount;
  final double lateFeePercent;
  final num lateFeeAmount;
  final AccountListingPaymentMethod paymentMethod;
  /// 0 insurance · 1 deposit · 2 late fee · 3 complete
  final int currentStepIndex;

  const AccountListingMoneyCycle({
    required this.insurancePercent,
    required this.insuranceAmount,
    required this.insurancePayer,
    required this.depositPercent,
    required this.depositAmount,
    required this.lateFeePercent,
    required this.lateFeeAmount,
    required this.paymentMethod,
    required this.currentStepIndex,
  });
}

class AccountMyListing {
  final String id;
  final String title;
  final String categoryName;
  final AccountListingDealType dealType;
  final num price;
  final String priceUnit;
  final int quantity;
  final String quantityUnit;
  final String? imageUrl;
  final AccountListingStatus status;
  final int incomingOffersCount;
  final String city;
  final DateTime publishedAt;
  final AccountListingMoneyCycle moneyCycle;
  final List<OrderTimelineStepLite> timeline;

  const AccountMyListing({
    required this.id,
    required this.title,
    required this.categoryName,
    required this.dealType,
    required this.price,
    required this.priceUnit,
    required this.quantity,
    required this.quantityUnit,
    required this.status,
    required this.incomingOffersCount,
    required this.city,
    required this.publishedAt,
    required this.moneyCycle,
    required this.timeline,
    this.imageUrl,
  });
}

/// Lightweight timeline step (avoids coupling account → orders feature).
class OrderTimelineStepLite {
  final String title;
  final String? subtitle;
  final DateTime? at;
  final bool done;
  final bool current;

  const OrderTimelineStepLite({
    required this.title,
    this.subtitle,
    this.at,
    this.done = false,
    this.current = false,
  });
}

class AccountSearchRequest {
  final String id;
  final String title;
  final int quantity;
  final String quantityUnit;
  final DateTime needBy;
  final num budget;
  final int offersCount;
  final int radiusKm;
  final AccountRequestStatus status;

  const AccountSearchRequest({
    required this.id,
    required this.title,
    required this.quantity,
    required this.quantityUnit,
    required this.needBy,
    required this.budget,
    required this.offersCount,
    required this.radiusKm,
    required this.status,
  });
}

class AccountReview {
  final String id;
  final String listingTitle;
  final String shopName;
  final double rating;
  final String comment;
  final DateTime date;
  final bool givenByMe;

  const AccountReview({
    required this.id,
    required this.listingTitle,
    required this.shopName,
    required this.rating,
    required this.comment,
    required this.date,
    required this.givenByMe,
  });
}

class AccountProfileDomainModel {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String city;
  final bool verified;
  final AccountStats stats;
  final List<AccountAddress> addresses;
  final List<AccountSearchRequest> searchRequests;
  final List<AccountMyListing> myListings;
  final List<AccountReview> reviews;
  final bool pushEnabled;
  final bool offersEnabled;
  final bool smsEnabled;
  final String? photoPath;

  const AccountProfileDomainModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.city,
    required this.verified,
    required this.stats,
    required this.addresses,
    required this.searchRequests,
    required this.myListings,
    required this.reviews,
    required this.pushEnabled,
    required this.offersEnabled,
    required this.smsEnabled,
    this.photoPath,
  });

  String get fullName {
    final full = '$firstName $lastName'.trim();
    return full.isEmpty ? email : full;
  }

  String get initials {
    final parts = fullName.split(RegExp(r'\s+')).where((e) => e.isNotEmpty).toList();
    if (parts.isEmpty) return 'د';
    if (parts.length == 1) return parts.first.substring(0, 1);
    return '${parts.first.substring(0, 1)}${parts.last.substring(0, 1)}';
  }

  AccountProfileDomainModel copyWith({
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? city,
    bool? pushEnabled,
    bool? offersEnabled,
    bool? smsEnabled,
    List<AccountAddress>? addresses,
    List<AccountSearchRequest>? searchRequests,
    List<AccountMyListing>? myListings,
    List<AccountReview>? reviews,
    String? photoPath,
    bool clearPhoto = false,
  }) {
    return AccountProfileDomainModel(
      id: id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      city: city ?? this.city,
      verified: verified,
      stats: stats,
      addresses: addresses ?? this.addresses,
      searchRequests: searchRequests ?? this.searchRequests,
      myListings: myListings ?? this.myListings,
      reviews: reviews ?? this.reviews,
      pushEnabled: pushEnabled ?? this.pushEnabled,
      offersEnabled: offersEnabled ?? this.offersEnabled,
      smsEnabled: smsEnabled ?? this.smsEnabled,
      photoPath: clearPhoto ? null : (photoPath ?? this.photoPath),
    );
  }
}
