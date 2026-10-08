enum ChatPeerRole { requester, owner }

enum ChatMessageKind { text, image, system, orderCard }

enum ChatDeliveryStatus { sending, sent, delivered, read }

class ChatContactVisibility {
  final bool showPhone;
  final bool showWhatsapp;
  final String? phone;
  final String? whatsapp;

  const ChatContactVisibility({
    required this.showPhone,
    required this.showWhatsapp,
    this.phone,
    this.whatsapp,
  });
}

class PublicUserDomainModel {
  final String id;
  final String name;
  final String? avatarUrl;
  final String avatarInitial;
  final bool verified;
  final String city;
  final double? rating;
  final int ratingCount;
  final int completedDeals;
  final String bio;
  final ChatContactVisibility contacts;
  final List<String> listingTitles;

  const PublicUserDomainModel({
    required this.id,
    required this.name,
    required this.avatarInitial,
    required this.verified,
    required this.city,
    required this.bio,
    required this.contacts,
    required this.completedDeals,
    required this.listingTitles,
    this.avatarUrl,
    this.rating,
    this.ratingCount = 0,
  });
}

/// Product / order snapshot pinned as the first message in an order chat.
class ChatOrderCard {
  final String orderId;
  final String title;
  final String? imageUrl;
  final String quantityLabel;
  final DateTime? needBy;
  final num? price;
  final String? providerName;
  final String statusLabel;

  const ChatOrderCard({
    required this.orderId,
    required this.title,
    required this.quantityLabel,
    required this.statusLabel,
    this.imageUrl,
    this.needBy,
    this.price,
    this.providerName,
  });
}

class ChatMessageDomainModel {
  final String id;
  final ChatMessageKind kind;
  final String? text;
  final String? imageUrl;
  final bool mine;
  final DateTime at;
  final ChatDeliveryStatus delivery;
  final String? replyToId;
  final String? replyToPreview;
  final bool replyToMine;
  final ChatOrderCard? orderCard;

  const ChatMessageDomainModel({
    required this.id,
    required this.kind,
    required this.mine,
    required this.at,
    this.text,
    this.imageUrl,
    this.delivery = ChatDeliveryStatus.sent,
    this.replyToId,
    this.replyToPreview,
    this.replyToMine = false,
    this.orderCard,
  });
}

/// One conversation = one order (not one peer).
class ConversationDomainModel {
  final String id;
  final String orderId;
  final String? orderImageUrl;
  final String peerUserId;
  final String peerName;
  final String peerInitial;
  final String? peerAvatarUrl;
  final bool peerVerified;
  final bool peerOnline;
  final DateTime? peerLastSeen;
  final ChatPeerRole myRole;
  /// Product / order title.
  final String title;
  final String lastMessage;
  final DateTime lastAt;
  final int unreadCount;
  final bool isMyRequest;

  const ConversationDomainModel({
    required this.id,
    required this.orderId,
    required this.peerUserId,
    required this.peerName,
    required this.peerInitial,
    required this.peerVerified,
    required this.myRole,
    required this.title,
    required this.lastMessage,
    required this.lastAt,
    required this.unreadCount,
    required this.isMyRequest,
    this.orderImageUrl,
    this.peerAvatarUrl,
    this.peerOnline = false,
    this.peerLastSeen,
  });
}

/// Sticky deal helpers (pickup code, etc.) — still order-scoped.
class ChatDealContext {
  final String title;
  final String? imageUrl;
  final num? acceptedPrice;
  final String statusLabel;
  final String? orderId;
  final bool canShareCode;
  final bool canEnterCode;

  const ChatDealContext({
    required this.title,
    required this.statusLabel,
    this.imageUrl,
    this.acceptedPrice,
    this.orderId,
    this.canShareCode = false,
    this.canEnterCode = false,
  });
}

class ConversationDetailDomainModel {
  final ConversationDomainModel conversation;
  final List<ChatMessageDomainModel> messages;
  final ChatDealContext? deal;

  const ConversationDetailDomainModel({
    required this.conversation,
    required this.messages,
    this.deal,
  });
}
