/// A trip the signed-in traveler owns (GET /api/trips/user/:id).
class ServerTrip {
  final String id;
  final String title;
  final String status;
  final DateTime? start;
  final DateTime? end;
  final int lengthDays;

  const ServerTrip({
    required this.id,
    required this.title,
    required this.status,
    required this.start,
    required this.end,
    required this.lengthDays,
  });

  bool get live => status != 'CANCELLED' && status != 'COMPLETED' && status != 'DRAFT';

  /// Day number today (1-based) when the trip is under way, else null.
  int? dayOf(DateTime today) {
    final s = start;
    if (s == null) return null;
    final e = end ?? s.add(Duration(days: lengthDays - 1));
    final d = DateTime(today.year, today.month, today.day);
    if (d.isBefore(s) || d.isAfter(e)) return null;
    return d.difference(s).inDays + 1;
  }

  int get days {
    final s = start;
    final e = end;
    if (s != null && e != null) return e.difference(s).inDays + 1;
    return lengthDays;
  }

  factory ServerTrip.fromJson(Map<String, dynamic> json) => ServerTrip(
        id: json['id'] as String? ?? '',
        title: json['title'] as String? ?? '',
        status: json['status'] as String? ?? '',
        start: _day(json['startDate']),
        end: _day(json['endDate']),
        lengthDays: (json['lengthDays'] as num?)?.toInt() ?? 1,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'status': status,
        'startDate': start?.toIso8601String().substring(0, 10),
        'endDate': end?.toIso8601String().substring(0, 10),
        'lengthDays': lengthDays,
      };
}

/// One booking with what the traveler needs on the day: who picks them up,
/// in what, and the code the operator scans.
class TripBooking {
  final String id;
  final String bookingRef;
  final String tripId;
  final String skuId;
  final String serviceType;
  final String title;
  final num amountEgp;
  final String paymentState;
  final String supplierState;
  final int passengers;
  final String pickup;
  final String date;
  final String time;
  final String confirmationCode;
  final DateTime? freeCancellationUntil;
  final String driverEn;
  final String driverAr;
  final String driverPhone;
  final String vehicle;
  final String plate;
  final String guide;
  final String guidePhone;
  final String supplierEn;
  final String supplierAr;
  final String supplierPhone;

  const TripBooking({
    required this.id,
    required this.bookingRef,
    required this.tripId,
    required this.skuId,
    required this.serviceType,
    required this.title,
    required this.amountEgp,
    required this.paymentState,
    required this.supplierState,
    required this.passengers,
    required this.pickup,
    required this.date,
    required this.time,
    required this.confirmationCode,
    required this.freeCancellationUntil,
    required this.driverEn,
    required this.driverAr,
    required this.driverPhone,
    required this.vehicle,
    required this.plate,
    required this.guide,
    required this.guidePhone,
    required this.supplierEn,
    required this.supplierAr,
    required this.supplierPhone,
  });

  bool get cancelled => supplierState == 'CANCELLED' || supplierState == 'REJECTED';

  bool get paid => const {'CAPTURED', 'SETTLED', 'PAID', 'AUTHORIZED'}.contains(paymentState);

  bool get payOnArrival => paymentState == 'PENDING' || paymentState == 'INITIATED' || paymentState == 'CASH_PENDING';

  String driver(bool arabic) => arabic && driverAr.isNotEmpty ? driverAr : driverEn;

  String supplier(bool arabic) => arabic && supplierAr.isNotEmpty ? supplierAr : supplierEn;

  /// Where the booking is on the way to the traveler, 0–3:
  /// confirmed · driver assigned · on the way · arrived.
  int get stage {
    switch (supplierState) {
      case 'ARRIVED':
      case 'IN_PROGRESS':
      case 'COMPLETED':
        return 3;
      case 'EN_ROUTE':
      case 'DISPATCHED':
        return 2;
      case 'ASSIGNED':
        return 1;
      case 'CONFIRMED':
        return 0;
      default:
        return -1;
    }
  }

  /// Local start time, read as Dahab wall-clock on the phone.
  DateTime? get startsAt {
    final d = DateTime.tryParse(date);
    if (d == null) return null;
    final m = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM)?', caseSensitive: false).firstMatch(time.trim());
    if (m == null) return d;
    var h = int.parse(m.group(1)!);
    final suffix = m.group(3)?.toUpperCase();
    if (suffix != null) {
      h = h % 12;
      if (suffix == 'PM') h += 12;
    }
    return DateTime(d.year, d.month, d.day, h, int.parse(m.group(2)!));
  }

  factory TripBooking.fromJson(Map<String, dynamic> json, {String title = ''}) {
    final res = json['assignedResource'] is Map ? Map<String, dynamic>.from(json['assignedResource'] as Map) : const {};
    final sup = json['supplier'] is Map ? Map<String, dynamic>.from(json['supplier'] as Map) : const {};
    return TripBooking(
      id: json['id'] as String? ?? '',
      bookingRef: json['bookingRef'] as String? ?? '',
      tripId: json['tripId'] as String? ?? '',
      skuId: json['skuId'] as String? ?? '',
      serviceType: json['serviceType'] as String? ?? '',
      title: (json['title'] as String?) ?? title,
      amountEgp: json['amountEGP'] as num? ?? 0,
      paymentState: json['paymentState'] as String? ?? '',
      supplierState: json['supplierState'] as String? ?? '',
      passengers: (json['passengersCount'] as num?)?.toInt() ?? 1,
      pickup: json['pickupLocation'] as String? ?? '',
      date: json['scheduledDate'] as String? ?? '',
      time: json['scheduledTime'] as String? ?? '',
      confirmationCode: json['confirmationCode'] as String? ?? '',
      freeCancellationUntil: DateTime.tryParse(json['freeCancellationUntil'] as String? ?? '')?.toLocal(),
      driverEn: res['driverName'] as String? ?? '',
      driverAr: res['driverNameAr'] as String? ?? '',
      driverPhone: res['driverPhone'] as String? ?? '',
      vehicle: res['vehicleModel'] as String? ?? '',
      plate: res['vehiclePlate'] as String? ?? '',
      guide: res['guideName'] as String? ?? '',
      guidePhone: res['guidePhone'] as String? ?? '',
      supplierEn: sup['businessName'] as String? ?? '',
      supplierAr: sup['businessNameAr'] as String? ?? '',
      supplierPhone: (sup['whatsapp'] as String?) ?? (sup['phone'] as String? ?? ''),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'bookingRef': bookingRef,
        'tripId': tripId,
        'skuId': skuId,
        'serviceType': serviceType,
        'title': title,
        'amountEGP': amountEgp,
        'paymentState': paymentState,
        'supplierState': supplierState,
        'passengersCount': passengers,
        'pickupLocation': pickup,
        'scheduledDate': date,
        'scheduledTime': time,
        'confirmationCode': confirmationCode,
        'freeCancellationUntil': freeCancellationUntil?.toUtc().toIso8601String(),
        'assignedResource': {
          'driverName': driverEn,
          'driverNameAr': driverAr,
          'driverPhone': driverPhone,
          'vehicleModel': vehicle,
          'vehiclePlate': plate,
          'guideName': guide,
          'guidePhone': guidePhone,
        },
        'supplier': {'businessName': supplierEn, 'businessNameAr': supplierAr, 'phone': supplierPhone},
      };
}

DateTime? _day(dynamic v) {
  if (v is! String || v.length < 10) return null;
  final d = DateTime.tryParse(v.substring(0, 10));
  return d == null ? null : DateTime(d.year, d.month, d.day);
}
