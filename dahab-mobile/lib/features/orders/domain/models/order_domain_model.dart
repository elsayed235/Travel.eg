enum OrderStatus {
  awaitingOffers,
  offerAccepted,
  confirmed,
  delivery,
  inUse,
  completed,
  cancelled,
}

/// Whose eyes are on this order row (طلبي vs عرضي على الطلب).
enum OrderPartyRole { requester, owner }

class OrderTimelineStep {
  final String title;
  final String? subtitle;
  final DateTime? at;
  final bool done;
  final bool current;

  const OrderTimelineStep({
    required this.title,
    this.subtitle,
    this.at,
    this.done = false,
    this.current = false,
  });
}

class OrderDomainModel {
  final String id;
  final String title;
  final String providerName;
  final String? peerUserId;
  final OrderPartyRole myRole;
  final OrderStatus status;
  final DateTime eventDate;
  final String categoryId;
  final String categoryName;
  final String? imageUrl;
  /// Shown to the requester to hand to the fulfiller at pickup.
  final String? confirmationCode;
  final bool codeVerified;
  final int quantity;
  final String quantityUnit;
  final List<OrderTimelineStep> timeline;
  final List<OrderStatus> availableActions;

  const OrderDomainModel({
    required this.id,
    required this.title,
    required this.providerName,
    required this.myRole,
    required this.status,
    required this.eventDate,
    required this.categoryId,
    required this.categoryName,
    required this.quantity,
    required this.quantityUnit,
    required this.timeline,
    this.peerUserId,
    this.imageUrl,
    this.confirmationCode,
    this.codeVerified = false,
    this.availableActions = const [],
  });

  bool get isMyRequest => myRole == OrderPartyRole.requester;

  /// Requester shows this code to the fulfiller before handover.
  bool get showShareCode =>
      confirmationCode != null &&
      isMyRequest &&
      (status == OrderStatus.delivery ||
          status == OrderStatus.confirmed ||
          status == OrderStatus.inUse ||
          status == OrderStatus.completed);

  /// Fulfiller types the code the requester showed them.
  bool get showEnterCode =>
      !isMyRequest &&
      status == OrderStatus.delivery &&
      !codeVerified &&
      confirmationCode != null;

  OrderDomainModel copyWith({
    OrderStatus? status,
    bool? codeVerified,
    String? confirmationCode,
    List<OrderTimelineStep>? timeline,
    List<OrderStatus>? availableActions,
  }) {
    return OrderDomainModel(
      id: id,
      title: title,
      providerName: providerName,
      peerUserId: peerUserId,
      myRole: myRole,
      status: status ?? this.status,
      eventDate: eventDate,
      categoryId: categoryId,
      categoryName: categoryName,
      imageUrl: imageUrl,
      confirmationCode: confirmationCode ?? this.confirmationCode,
      codeVerified: codeVerified ?? this.codeVerified,
      quantity: quantity,
      quantityUnit: quantityUnit,
      timeline: timeline ?? this.timeline,
      availableActions: availableActions ?? this.availableActions,
    );
  }
}
