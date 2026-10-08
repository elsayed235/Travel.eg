import 'package:flutter_tdd/core/widgets/app_availability_calendar.dart';
import 'package:flutter_tdd/core/widgets/app_terms_list.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';

enum ListingDealType { rent, buy, both }

enum ListingInsurancePayer { requester, owner }

enum ListingPaymentMethod { online, cash }

class ListingMoneyCycleInfo {
  final double insurancePercent;
  final num insuranceAmount;
  final ListingInsurancePayer insurancePayer;
  final double depositPercent;
  final num depositAmount;
  final double lateFeePercent;
  final num lateFeeAmount;
  final ListingPaymentMethod paymentMethod;

  const ListingMoneyCycleInfo({
    required this.insurancePercent,
    required this.insuranceAmount,
    required this.insurancePayer,
    required this.depositPercent,
    required this.depositAmount,
    required this.lateFeePercent,
    required this.lateFeeAmount,
    required this.paymentMethod,
  });
}

class ListingDetailDomainModel {
  final String id;
  final String title;
  final String shopName;
  final String ownerUserId;
  final bool ownerVerified;
  final String categoryName;
  final ListingDealType dealType;
  final MarketplaceSide side;
  final double rating;
  final int ratingCount;
  final int quantity;
  final String quantityUnit;
  final int minQuantity;
  final String condition;
  final String city;
  final String deliveryLabel;
  final num rentPrice;
  final String rentUnit;
  final num buyPrice;
  final String buyUnit;
  final DateTime month;
  final int stockAvailable;
  final int stockTotal;
  final Map<DateTime, DayAvailability> availability;
  final List<AppTermItem> terms;
  final ListingMoneyCycleInfo moneyCycle;
  final int bookQuantity;
  final int? placeholderColor;
  final String? imageUrl;
  final List<String> galleryUrls;
  final List<String> hashtags;

  const ListingDetailDomainModel({
    required this.id,
    required this.title,
    required this.shopName,
    required this.ownerUserId,
    required this.ownerVerified,
    required this.categoryName,
    required this.dealType,
    required this.side,
    required this.rating,
    required this.ratingCount,
    required this.quantity,
    required this.quantityUnit,
    required this.minQuantity,
    required this.condition,
    required this.city,
    required this.deliveryLabel,
    required this.rentPrice,
    required this.rentUnit,
    required this.buyPrice,
    required this.buyUnit,
    required this.month,
    required this.stockAvailable,
    required this.stockTotal,
    required this.availability,
    required this.terms,
    required this.moneyCycle,
    required this.bookQuantity,
    this.placeholderColor,
    this.imageUrl,
    this.galleryUrls = const [],
    this.hashtags = const [],
  });

  bool get allowsRent =>
      dealType == ListingDealType.rent || dealType == ListingDealType.both;

  bool get allowsBuy =>
      dealType == ListingDealType.buy || dealType == ListingDealType.both;

  bool get isRequest => side == MarketplaceSide.request;
  bool get isOffer => side == MarketplaceSide.offer;
}
