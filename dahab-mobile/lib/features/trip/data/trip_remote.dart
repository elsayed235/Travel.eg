import 'dart:convert';
import 'dart:math';

import 'package:rehla/core/http/rehla_api.dart';
import 'package:rehla/features/trip/domain/models/trip_booking.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// The trip and booking routes the website's booking sheet uses: create a
/// PLANNED trip, hold, then settle (src/services/heldCheckout.ts). Identity is
/// always the session's; nothing here sends a user id in a body.
class TripRemote {
  const TripRemote._();

  static const _cacheKey = 'rehla_trip_bundle_v1';

  static String attemptKey(String prefix) {
    final r = Random.secure();
    final tail = List.generate(8, (_) => r.nextInt(16).toRadixString(16)).join();
    return '$prefix-${DateTime.now().millisecondsSinceEpoch}-$tail';
  }

  static Future<List<ServerTrip>?> myTrips(String userId) async {
    final reply = await RehlaApi.get('trips/user/$userId');
    if (!reply.ok) return null;
    return reply.list('trips').map(ServerTrip.fromJson).toList();
  }

  static Future<List<TripBooking>?> bookings(String tripId) async {
    final reply = await RehlaApi.get('trips/$tripId/bookings');
    if (!reply.ok) return null;
    final titles = <String, String>{};
    for (final item in reply.list('items')) {
      final bookingId = item['bookingId'];
      if (bookingId is String) titles[bookingId] = item['title'] as String? ?? '';
    }
    return reply
        .list('bookings')
        .map((b) => TripBooking.fromJson(b, title: titles[b['id']] ?? titles[b['bookingRef']] ?? ''))
        .toList();
  }

  /// Last good read, so the voucher opens without a connection.
  static Future<TripBundle?> cached() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_cacheKey);
    if (raw == null) return null;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return TripBundle(
        trip: ServerTrip.fromJson(Map<String, dynamic>.from(map['trip'] as Map)),
        bookings: (map['bookings'] as List)
            .whereType<Map>()
            .map((b) => TripBooking.fromJson(Map<String, dynamic>.from(b)))
            .toList(),
        offline: true,
      );
    } catch (_) {
      return null;
    }
  }

  static Future<void> cache(TripBundle? bundle) async {
    final prefs = await SharedPreferences.getInstance();
    if (bundle == null) {
      await prefs.remove(_cacheKey);
      return;
    }
    await prefs.setString(
      _cacheKey,
      jsonEncode({'trip': bundle.trip.toJson(), 'bookings': bundle.bookings.map((b) => b.toJson()).toList()}),
    );
  }

  /// PLANNED, not DRAFT: the server only takes items on a planned trip.
  static Future<ApiReply> createTrip({
    required String title,
    required DateTime start,
    required int lengthDays,
    required int travelers,
  }) {
    String day(DateTime d) => d.toIso8601String().substring(0, 10);
    return RehlaApi.post('trips', {
      'id': 'TRIP-EXP-${DateTime.now().millisecondsSinceEpoch}',
      'title': title,
      'status': 'PLANNED',
      'lengthDays': lengthDays,
      'travelersCount': travelers,
      'budget': 'Moderate',
      'pace': 'Balanced',
      'interests': const <String>[],
      'startDate': day(start),
      'endDate': day(start.add(Duration(days: lengthDays - 1))),
      'totalEstimatedEGP': 0,
      'totalPaidEGP': 0,
    });
  }

  static Future<ApiReply> hold({
    required String tripId,
    required String skuId,
    required String date,
    required String timeSlot,
    required int guests,
    required String key,
  }) {
    return RehlaApi.post('commerce/hold', {
      'tripId': tripId,
      'skuId': skuId,
      'date': date,
      'timeSlot': timeSlot,
      'passengersCount': guests,
      'idempotencyKey': key,
    });
  }

  static Future<ApiReply> checkout({
    required String tripId,
    required String name,
    required String phone,
    required String email,
    required Map<String, dynamic> item,
    required String key,
  }) {
    return RehlaApi.post('commerce/checkout/multi', {
      'tripId': tripId,
      'travelerName': name,
      'travelerPhone': phone,
      'travelerEmail': email,
      'items': [item],
      // The website sells experiences pay-on-arrival; nothing is charged here.
      'paymentParams': {'idempotencyKey': key, 'provider': 'CASH_ON_ARRIVAL'},
    });
  }

  static Future<ApiReply> availability({
    required String serviceType,
    required String skuId,
    required String date,
    required int guests,
  }) {
    return RehlaApi.post('commerce/availability/rich', {
      'serviceType': serviceType,
      'skuId': skuId,
      'date': date,
      'passengers': guests,
    });
  }

  static Future<ApiReply> reschedule({
    required String bookingId,
    required String tripId,
    required String date,
    required String time,
  }) {
    return RehlaApi.post('bookings/$bookingId/reschedule', {
      'tripId': tripId,
      'newDate': date,
      'newTime': time,
      'idempotencyKey': attemptKey('RESCHED'),
    });
  }

  static Future<SupplierTrust> trust(String supplierId) async {
    final replies = await Future.wait([
      RehlaApi.get('reviews/supplier/$supplierId'),
      RehlaApi.get('suppliers/$supplierId/reliability'),
    ]);
    final reviews = replies[0];
    final score = replies[1].map['score'];
    final s = score is Map ? Map<String, dynamic>.from(score) : const <String, dynamic>{};
    return SupplierTrust(
      average: reviews.map['average'] as num? ?? 0,
      count: (reviews.map['count'] as num?)?.toInt() ?? 0,
      reviews: reviews.list('reviews').map(SupplierReview.fromJson).toList(),
      reliability: (s['overall'] as num?)?.toInt() ?? 0,
      sample: (s['sampleSize'] as num?)?.toInt() ?? 0,
    );
  }

  static Future<List<EmergencyLine>> emergency() async {
    final reply = await RehlaApi.get('dahab/emergency');
    return reply
        .list('emergencyHotlines')
        .map((l) => EmergencyLine(l['service'] as String? ?? '', l['number'] as String? ?? ''))
        .where((l) => l.number.isNotEmpty)
        .toList();
  }
}

class TripBundle {
  final ServerTrip trip;
  final List<TripBooking> bookings;
  final bool offline;

  const TripBundle({required this.trip, required this.bookings, this.offline = false});
}

class SupplierTrust {
  final num average;
  final int count;
  final List<SupplierReview> reviews;
  final int reliability;
  final int sample;

  const SupplierTrust({
    required this.average,
    required this.count,
    required this.reviews,
    required this.reliability,
    required this.sample,
  });

  static const empty = SupplierTrust(average: 0, count: 0, reviews: [], reliability: 0, sample: 0);
}

class SupplierReview {
  final int rating;
  final String body;
  final String bodyAr;
  final String author;
  final DateTime? at;

  const SupplierReview({required this.rating, required this.body, required this.bodyAr, required this.author, this.at});

  String text(bool arabic) => arabic && bodyAr.isNotEmpty ? bodyAr : body;

  factory SupplierReview.fromJson(Map<String, dynamic> json) => SupplierReview(
        rating: (json['rating'] as num?)?.toInt() ?? 0,
        body: json['body'] as String? ?? '',
        bodyAr: json['bodyAr'] as String? ?? '',
        author: json['authorName'] as String? ?? '',
        at: DateTime.tryParse(json['createdAt'] as String? ?? ''),
      );
}

class EmergencyLine {
  final String service;
  final String number;

  const EmergencyLine(this.service, this.number);
}
