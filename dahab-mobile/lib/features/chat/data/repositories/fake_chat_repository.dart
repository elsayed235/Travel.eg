import 'package:flutter_tdd/core/constants/fake_images.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/chat/domain/models/chat_domain_model.dart';
import 'package:flutter_tdd/features/chat/domain/repositories/chat_repository.dart';

class FakeChatRepository implements ChatRepository {
  static final Map<String, PublicUserDomainModel> _users = {
    'u-owner-1': const PublicUserDomainModel(
      id: 'u-owner-1',
      name: 'محل الأمل للتجهيزات',
      avatarInitial: 'أ',
      avatarUrl: FakeImages.provider1,
      verified: true,
      city: 'دمياط الجديدة',
      rating: 4.8,
      ratingCount: 34,
      completedDeals: 28,
      bio: 'تجهيزات أفراح ومناسبات — كراسي وطاولات وإضاءة.',
      contacts: ChatContactVisibility(
        showPhone: true,
        showWhatsapp: true,
        phone: '01011112222',
        whatsapp: '01011112222',
      ),
      listingTitles: ['كراسي شيفاري ذهبي', 'طاولات مستديرة'],
    ),
    'u-owner-2': const PublicUserDomainModel(
      id: 'u-owner-2',
      name: 'مصطفى ع.',
      avatarInitial: 'م',
      avatarUrl: FakeImages.provider2,
      verified: false,
      city: 'دمياط',
      rating: 4.6,
      ratingCount: 9,
      completedDeals: 7,
      bio: 'أجهّز مناسبات صغيرة ومتوسطة في دمياط.',
      contacts: ChatContactVisibility(
        showPhone: false,
        showWhatsapp: true,
        whatsapp: '01033334444',
      ),
      listingTitles: ['إضاءة LED'],
    ),
    'u-renter-1': const PublicUserDomainModel(
      id: 'u-renter-1',
      name: 'أحمد حسن',
      avatarInitial: 'ح',
      avatarUrl: FakeImages.provider3,
      verified: true,
      city: 'دمياط الجديدة',
      rating: 4.9,
      ratingCount: 12,
      completedDeals: 5,
      bio: 'بدور على تجهيزات نظيفة للمناسبات.',
      contacts: ChatContactVisibility(
        showPhone: true,
        showWhatsapp: false,
        phone: '01055556666',
      ),
      listingTitles: [],
    ),
    'u1': const PublicUserDomainModel(
      id: 'u1',
      name: 'طارق فودة',
      avatarInitial: 'ط',
      verified: true,
      city: 'دمياط الجديدة',
      rating: 4.7,
      ratingCount: 18,
      completedDeals: 11,
      bio: 'بطلب وبعرض حاجات للمناسبات.',
      contacts: ChatContactVisibility(
        showPhone: true,
        showWhatsapp: true,
        phone: '01012345678',
        whatsapp: '01012345678',
      ),
      listingTitles: ['كراسي شيفاري ذهبي', 'طقم كوشة أبيض'],
    ),
  };

  static final List<ConversationDomainModel> _conversations = [
    ConversationDomainModel(
      id: 'c1',
      orderId: 'ord-1',
      orderImageUrl: FakeImages.chairs,
      peerUserId: 'u-owner-1',
      peerName: 'محل الأمل للتجهيزات',
      peerInitial: 'أ',
      peerAvatarUrl: FakeImages.provider1,
      peerVerified: true,
      peerOnline: true,
      myRole: ChatPeerRole.requester,
      title: 'كراسي أفراح ذهبي',
      lastMessage: 'تمام، الصورة واضحة جداً',
      lastAt: DateTime(2026, 9, 16, 18, 40),
      unreadCount: 2,
      isMyRequest: true,
    ),
    ConversationDomainModel(
      id: 'c2',
      orderId: 'ord-list-1',
      orderImageUrl: FakeImages.backdrop,
      peerUserId: 'u-renter-1',
      peerName: 'أحمد حسن',
      peerInitial: 'ح',
      peerAvatarUrl: FakeImages.provider3,
      peerVerified: true,
      peerOnline: false,
      peerLastSeen: DateTime(2026, 9, 15, 11, 45),
      myRole: ChatPeerRole.owner,
      title: 'كراسي شيفاري ذهبي',
      lastMessage: 'ممكن تبعتلي صورة أقرب؟',
      lastAt: DateTime(2026, 9, 15, 12, 10),
      unreadCount: 1,
      isMyRequest: false,
    ),
    ConversationDomainModel(
      id: 'c3',
      orderId: 'ord-3',
      orderImageUrl: FakeImages.lighting,
      peerUserId: 'u-owner-2',
      peerName: 'مصطفى ع.',
      peerInitial: 'م',
      peerAvatarUrl: FakeImages.provider2,
      peerVerified: false,
      peerOnline: false,
      peerLastSeen: DateTime(2026, 9, 12, 8, 50),
      myRole: ChatPeerRole.requester,
      title: 'إضاءة LED للمناسبات',
      lastMessage: 'استلمت الإضاءة، شكراً',
      lastAt: DateTime(2026, 9, 12, 9, 20),
      unreadCount: 0,
      isMyRequest: true,
    ),
  ];

  static ChatOrderCard _orderCardFor(ConversationDomainModel c, {num? price, String? status}) {
    return ChatOrderCard(
      orderId: c.orderId,
      title: c.title,
      imageUrl: c.orderImageUrl,
      quantityLabel: c.orderId == 'ord-3' ? '١٠ وحدات' : '١٠٠ كرسي',
      needBy: DateTime(2026, 10, 25),
      price: price ?? 1200,
      providerName: c.peerName,
      statusLabel: status ?? 'تم قبول العرض',
    );
  }

  static final Map<String, ConversationDetailDomainModel> _details = {
    'c1': ConversationDetailDomainModel(
      conversation: _conversations[0],
      deal: const ChatDealContext(
        title: 'كراسي أفراح ذهبي',
        imageUrl: FakeImages.chairs,
        acceptedPrice: 1200,
        statusLabel: 'تم قبول العرض',
        orderId: 'ord-1',
        canShareCode: true,
      ),
      messages: [
        ChatMessageDomainModel(
          id: 'm-order-1',
          kind: ChatMessageKind.orderCard,
          mine: false,
          at: DateTime(2026, 9, 15, 9, 55),
          orderCard: ChatOrderCard(
            orderId: 'ord-1',
            title: 'كراسي أفراح ذهبي',
            imageUrl: FakeImages.chairs,
            quantityLabel: '١٠٠ كرسي',
            needBy: DateTime(2026, 10, 25),
            price: 1200,
            providerName: 'محل الأمل للتجهيزات',
            statusLabel: 'تم قبول العرض',
          ),
        ),
        ChatMessageDomainModel(
          id: 'm1',
          kind: ChatMessageKind.text,
          mine: true,
          at: DateTime(2026, 9, 15, 10, 5),
          text: 'السلام عليكم، محتاج أتأكد من لون الكراسي',
          delivery: ChatDeliveryStatus.read,
        ),
        ChatMessageDomainModel(
          id: 'm2',
          kind: ChatMessageKind.text,
          mine: false,
          at: DateTime(2026, 9, 15, 10, 12),
          text: 'وعليكم السلام، لون دهبي مطفي زي الصورة',
        ),
        ChatMessageDomainModel(
          id: 'm5',
          kind: ChatMessageKind.image,
          mine: false,
          at: DateTime(2026, 9, 16, 17, 8),
          imageUrl: FakeImages.chairs,
          text: 'من المخزن',
        ),
        ChatMessageDomainModel(
          id: 'm6',
          kind: ChatMessageKind.text,
          mine: true,
          at: DateTime(2026, 9, 16, 17, 20),
          text: 'حلو أوي، والتوصيل مجاني؟',
          delivery: ChatDeliveryStatus.read,
          replyToId: 'm5',
          replyToPreview: 'صورة · من المخزن',
          replyToMine: false,
        ),
        ChatMessageDomainModel(
          id: 'm7',
          kind: ChatMessageKind.text,
          mine: false,
          at: DateTime(2026, 9, 16, 17, 25),
          text: 'أيوه توصيل مجاني داخل دمياط الجديدة',
        ),
        ChatMessageDomainModel(
          id: 'm8',
          kind: ChatMessageKind.text,
          mine: true,
          at: DateTime(2026, 9, 16, 18, 40),
          text: 'تمام، الصورة واضحة جداً',
          delivery: ChatDeliveryStatus.delivered,
        ),
      ],
    ),
    'c2': ConversationDetailDomainModel(
      conversation: _conversations[1],
      deal: const ChatDealContext(
        title: 'كراسي شيفاري ذهبي',
        imageUrl: FakeImages.backdrop,
        statusLabel: 'عرض على الطلب',
        orderId: 'ord-list-1',
      ),
      messages: [
        ChatMessageDomainModel(
          id: 'm-order-2',
          kind: ChatMessageKind.orderCard,
          mine: false,
          at: DateTime(2026, 9, 14, 9, 55),
          orderCard: ChatOrderCard(
            orderId: 'ord-list-1',
            title: 'كراسي شيفاري ذهبي',
            imageUrl: FakeImages.backdrop,
            quantityLabel: '٢٠٠ كرسي',
            needBy: DateTime(2026, 10, 25),
            price: 3000,
            providerName: 'أحمد حسن',
            statusLabel: 'عرض على الطلب',
          ),
        ),
        ChatMessageDomainModel(
          id: 'm20',
          kind: ChatMessageKind.text,
          mine: false,
          at: DateTime(2026, 9, 14, 10),
          text: 'مرحبا، شفت العرض ومهتم',
        ),
        ChatMessageDomainModel(
          id: 'm21',
          kind: ChatMessageKind.image,
          mine: true,
          at: DateTime(2026, 9, 14, 10, 20),
          imageUrl: FakeImages.chairs,
          delivery: ChatDeliveryStatus.read,
        ),
        ChatMessageDomainModel(
          id: 'm22',
          kind: ChatMessageKind.text,
          mine: false,
          at: DateTime(2026, 9, 15, 12, 10),
          text: 'ممكن تبعتلي صورة أقرب؟',
        ),
      ],
    ),
    'c3': ConversationDetailDomainModel(
      conversation: _conversations[2],
      deal: const ChatDealContext(
        title: 'إضاءة LED للمناسبات',
        imageUrl: FakeImages.lighting,
        acceptedPrice: 850,
        statusLabel: 'مكتمل',
        orderId: 'ord-3',
      ),
      messages: [
        ChatMessageDomainModel(
          id: 'm-order-3',
          kind: ChatMessageKind.orderCard,
          mine: false,
          at: DateTime(2026, 9, 12, 8, 50),
          orderCard: ChatOrderCard(
            orderId: 'ord-3',
            title: 'إضاءة LED للمناسبات',
            imageUrl: FakeImages.lighting,
            quantityLabel: '١٠ وحدات',
            needBy: DateTime(2026, 9, 12),
            price: 850,
            providerName: 'مصطفى ع.',
            statusLabel: 'مكتمل',
          ),
        ),
        ChatMessageDomainModel(
          id: 'm30',
          kind: ChatMessageKind.text,
          mine: false,
          at: DateTime(2026, 9, 12, 9),
          text: 'الإضاءة جاهزة للاستلام',
        ),
        ChatMessageDomainModel(
          id: 'm31',
          kind: ChatMessageKind.text,
          mine: true,
          at: DateTime(2026, 9, 12, 9, 20),
          text: 'استلمت الإضاءة، شكراً',
          delivery: ChatDeliveryStatus.read,
        ),
      ],
    ),
  };

  /// Maps offer ids → conversation id (order-scoped).
  static const Map<String, String> offerConversationIds = {
    '1': 'c1',
    '2': 'c3',
  };

  @override
  Future<MyResult<List<ConversationDomainModel>>> getConversations() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final sorted = List<ConversationDomainModel>.from(_conversations)
      ..sort((a, b) => b.lastAt.compareTo(a.lastAt));
    return MyResult.isSuccess(sorted);
  }

  @override
  Future<MyResult<ConversationDetailDomainModel>> getConversation(String id) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final detail = _details[id];
    if (detail == null) return MyResult.notFoundError();
    return MyResult.isSuccess(detail);
  }

  @override
  Future<MyResult<ConversationDetailDomainModel>> sendText({
    required String conversationId,
    required String text,
    String? replyToId,
    String? replyToPreview,
    bool replyToMine = false,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 120));
    final current = _details[conversationId];
    if (current == null) return MyResult.notFoundError();
    final now = DateTime.now();
    final message = ChatMessageDomainModel(
      id: 'm-${now.millisecondsSinceEpoch}',
      kind: ChatMessageKind.text,
      mine: true,
      at: now,
      text: text,
      delivery: ChatDeliveryStatus.sent,
      replyToId: replyToId,
      replyToPreview: replyToPreview,
      replyToMine: replyToMine,
    );
    return MyResult.isSuccess(_appendMessage(current, message, preview: text));
  }

  @override
  Future<MyResult<ConversationDetailDomainModel>> sendImage({
    required String conversationId,
    required String imagePath,
    String? caption,
    String? replyToId,
    String? replyToPreview,
    bool replyToMine = false,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 180));
    final current = _details[conversationId];
    if (current == null) return MyResult.notFoundError();
    final now = DateTime.now();
    final message = ChatMessageDomainModel(
      id: 'm-img-${now.millisecondsSinceEpoch}',
      kind: ChatMessageKind.image,
      mine: true,
      at: now,
      imageUrl: imagePath,
      text: caption,
      delivery: ChatDeliveryStatus.sent,
      replyToId: replyToId,
      replyToPreview: replyToPreview,
      replyToMine: replyToMine,
    );
    return MyResult.isSuccess(
      _appendMessage(current, message, preview: caption?.isNotEmpty == true ? caption! : '📷 صورة'),
    );
  }

  ConversationDomainModel _copyConv(
    ConversationDomainModel current, {
    required String lastMessage,
    required DateTime lastAt,
  }) {
    return ConversationDomainModel(
      id: current.id,
      orderId: current.orderId,
      orderImageUrl: current.orderImageUrl,
      peerUserId: current.peerUserId,
      peerName: current.peerName,
      peerInitial: current.peerInitial,
      peerAvatarUrl: current.peerAvatarUrl,
      peerVerified: current.peerVerified,
      peerOnline: current.peerOnline,
      peerLastSeen: current.peerLastSeen,
      myRole: current.myRole,
      title: current.title,
      lastMessage: lastMessage,
      lastAt: lastAt,
      unreadCount: 0,
      isMyRequest: current.isMyRequest,
    );
  }

  ConversationDetailDomainModel _appendMessage(
    ConversationDetailDomainModel current,
    ChatMessageDomainModel message, {
    required String preview,
  }) {
    final conv = _copyConv(
      current.conversation,
      lastMessage: preview,
      lastAt: message.at,
    );
    final updated = ConversationDetailDomainModel(
      conversation: conv,
      messages: [...current.messages, message],
      deal: current.deal,
    );
    _details[current.conversation.id] = updated;
    _replaceConversation(conv);
    return updated;
  }

  @override
  Future<MyResult<String>> openConversationForOffer({
    required String offerId,
    required String providerUserId,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final existing = offerConversationIds[offerId];
    if (existing != null) return MyResult.isSuccess(existing);

    final user = _users[providerUserId];
    final orderId = 'ord-offer-$offerId';
    final id = 'c-order-$orderId';
    final now = DateTime.now();
    final conv = ConversationDomainModel(
      id: id,
      orderId: orderId,
      orderImageUrl: FakeImages.chairs,
      peerUserId: providerUserId,
      peerName: user?.name ?? 'صاحب العرض',
      peerInitial: user?.avatarInitial ?? '؟',
      peerAvatarUrl: user?.avatarUrl,
      peerVerified: user?.verified ?? false,
      peerOnline: true,
      myRole: ChatPeerRole.requester,
      title: 'كراسي أفراح ذهبي',
      lastMessage: 'تفاصيل الطلب',
      lastAt: now,
      unreadCount: 0,
      isMyRequest: true,
    );
    final card = _orderCardFor(conv, price: 1200, status: 'عرض قيد المناقشة');
    _conversations.insert(0, conv);
    _details[id] = ConversationDetailDomainModel(
      conversation: conv,
      deal: ChatDealContext(
        title: conv.title,
        imageUrl: conv.orderImageUrl,
        statusLabel: card.statusLabel,
        orderId: orderId,
      ),
      messages: [
        ChatMessageDomainModel(
          id: 'm-order-new',
          kind: ChatMessageKind.orderCard,
          mine: false,
          at: now,
          orderCard: card,
        ),
      ],
    );
    return MyResult.isSuccess(id);
  }

  @override
  Future<MyResult<String>> openConversationForListingOffer({
    required String listingId,
    required String ownerUserId,
    required String listingTitle,
    required num offerPrice,
    required int quantity,
    required String quantityUnit,
    required String dealLabel,
    required num insuranceAmount,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final user = _users[ownerUserId];
    final orderId = 'ord-listing-$listingId';
    final id = 'c-order-$orderId-${DateTime.now().millisecondsSinceEpoch}';
    final now = DateTime.now();
    final conv = ConversationDomainModel(
      id: id,
      orderId: orderId,
      orderImageUrl: FakeImages.chairs,
      peerUserId: ownerUserId,
      peerName: user?.name ?? 'صاحب العرض',
      peerInitial: user?.avatarInitial ?? '؟',
      peerAvatarUrl: user?.avatarUrl,
      peerVerified: user?.verified ?? false,
      peerOnline: false,
      peerLastSeen: now.subtract(const Duration(minutes: 20)),
      myRole: ChatPeerRole.requester,
      title: listingTitle,
      lastMessage: 'تفاصيل الطلب',
      lastAt: now,
      unreadCount: 0,
      isMyRequest: true,
    );
    final card = ChatOrderCard(
      orderId: orderId,
      title: listingTitle,
      imageUrl: FakeImages.chairs,
      quantityLabel: '$quantity $quantityUnit',
      needBy: now.add(const Duration(days: 14)),
      price: offerPrice,
      providerName: user?.name,
      statusLabel: 'عرض قيد المناقشة',
    );
    _conversations.insert(0, conv);
    _details[id] = ConversationDetailDomainModel(
      conversation: conv,
      deal: ChatDealContext(
        title: listingTitle,
        imageUrl: FakeImages.chairs,
        acceptedPrice: offerPrice,
        statusLabel: card.statusLabel,
        orderId: orderId,
      ),
      messages: [
        ChatMessageDomainModel(
          id: 'm-list-order',
          kind: ChatMessageKind.orderCard,
          mine: false,
          at: now,
          orderCard: card,
        ),
        ChatMessageDomainModel(
          id: 'm-list-hi',
          kind: ChatMessageKind.text,
          mine: true,
          at: now.add(const Duration(seconds: 1)),
          text: 'مرحبا، مهتم بالعرض ($dealLabel)',
          delivery: ChatDeliveryStatus.sent,
        ),
      ],
    );
    return MyResult.isSuccess(id);
  }

  @override
  Future<MyResult<PublicUserDomainModel>> getPublicUser(String userId) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final user = _users[userId];
    if (user == null) return MyResult.notFoundError();
    return MyResult.isSuccess(user);
  }

  void _replaceConversation(ConversationDomainModel conv) {
    final index = _conversations.indexWhere((e) => e.id == conv.id);
    if (index >= 0) {
      _conversations[index] = conv;
    } else {
      _conversations.insert(0, conv);
    }
  }
}
