part of 'conversation_imports.dart';

class ConversationController {
  final String conversationId;
  late final ConversationDetailRequester detailRequester;
  final ChatRepository _repo;
  final AiRepository _ai;
  final ObsValue<List<String>> smartRepliesObs = ObsValue.withInit(const <String>[]);
  final ObsValue<SafetyFlag?> peerSafetyFlagObs = ObsValue.withInit(null);
  bool _peerWarningDismissed = false;
  final TextEditingController messageController = TextEditingController();
  final ObsValue<bool> sendingObs = ObsValue.withInit(false);
  final ObsValue<bool> hasTextObs = ObsValue.withInit(false);
  final ObsValue<bool> peerTypingObs = ObsValue.withInit(false);
  final ObsValue<ChatMessageDomainModel?> replyToObs = ObsValue.withInit(null);
  final ImagePicker _picker = ImagePicker();
  final ScrollController scrollController = ScrollController();
  Timer? _typingTimer;
  bool _needsInitialScroll = true;

  ConversationController(
    this.conversationId, {
    ChatRepository? repository,
    AiRepository? aiRepository,
  })  : _repo = repository ?? FakeChatRepository(),
        _ai = aiRepository ?? defaultAiRepository() {
    detailRequester = ConversationDetailRequester(conversationId, repository: _repo);
    messageController.addListener(_onTextChanged);
  }

  void init() => detailRequester.request().then((_) => _refreshAi());

  void _onTextChanged() {
    final has = messageController.text.trim().isNotEmpty;
    if (hasTextObs.getValue() != has) hasTextObs.setValue(has);
  }

  void setReply(ChatMessageDomainModel message) {
    if (message.kind == ChatMessageKind.system ||
        message.kind == ChatMessageKind.orderCard) {
      return;
    }
    replyToObs.setValue(message);
  }

  void clearReply() => replyToObs.setValue(null);

  String _previewFor(ChatMessageDomainModel message) {
    if (message.kind == ChatMessageKind.image) {
      final caption = message.text?.trim();
      if (caption != null && caption.isNotEmpty) {
        return '${Translate.s.chat_photo} · $caption';
      }
      return Translate.s.chat_photo;
    }
    return message.text ?? '';
  }

  /// Smart replies (feature 06) and the peer safety banner (feature 07).
  Future<void> _refreshAi() async {
    final data = detailRequester.data;
    if (data == null) return;
    _checkPeerSafety(data.messages);
    ChatMessageDomainModel? lastPeer;
    for (final m in data.messages.reversed) {
      if (m.kind == ChatMessageKind.system || m.kind == ChatMessageKind.orderCard) continue;
      if (!m.mine) lastPeer = m;
      break;
    }
    if (lastPeer == null) {
      smartRepliesObs.setValue(const []);
      return;
    }
    final result = await _ai.suggestReplies(
      conversationId: conversationId,
      isMyRequest: data.conversation.isMyRequest,
      lastPeerMessage: lastPeer.text ?? '',
    );
    smartRepliesObs.setValue(result.data ?? const []);
  }

  void _checkPeerSafety(List<ChatMessageDomainModel> messages) {
    if (_peerWarningDismissed) return;
    for (final m in messages.reversed) {
      if (m.mine || m.text == null) continue;
      final flag = ChatSafetyRules.check(m.text!);
      if (flag == SafetyFlag.offPlatformPayment || flag == SafetyFlag.advancePayment) {
        peerSafetyFlagObs.setValue(flag);
        AiTracker.track('ai_safety_peer_warning', {'flag': flag!.name});
        return;
      }
    }
  }

  void dismissPeerWarning() {
    _peerWarningDismissed = true;
    peerSafetyFlagObs.setValue(null);
  }

  void useSmartReply(String text) {
    messageController.value = TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
    AiTracker.track('ai_reply_used');
  }

  Future<void> send(BuildContext context, {bool skipSafetyCheck = false}) async {
    final text = messageController.text.trim();
    if (text.isEmpty || sendingObs.getValue()) return;
    if (!skipSafetyCheck) {
      final flag = ChatSafetyRules.check(text);
      if (flag != null) {
        AiTracker.track('ai_safety_outgoing_warning', {'flag': flag.name});
        final sendAnyway = await showModalBottomSheet<bool>(
          context: context,
          backgroundColor: context.colors.surface1,
          elevation: 0,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
          builder: (ctx) => BuildChatSafetySheet(flag: flag),
        );
        if (sendAnyway != true || !context.mounted) return;
      }
    }
    smartRepliesObs.setValue(const []);
    final reply = replyToObs.getValue();
    sendingObs.setValue(true);
    final result = await _repo.sendText(
      conversationId: conversationId,
      text: text,
      replyToId: reply?.id,
      replyToPreview: reply == null ? null : _previewFor(reply),
      replyToMine: reply?.mine ?? false,
    );
    sendingObs.setValue(false);
    result.when(
      isSuccess: (data) {
        if (data != null) {
          messageController.clear();
          clearReply();
          detailRequester.applyLocal(data);
          _simulatePeerTyping();
          scrollToBottom(animated: true);
        }
      },
      isError: (error) {
        AppSnackBar.showSimpleToast(msg: error.message);
      },
    );
  }

  Future<void> openAttachSheet(BuildContext context) async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => BuildChatAttachSheet(
        onCamera: () {
          Navigator.of(ctx).pop();
          sendImage(context, ImageSource.camera);
        },
        onGallery: () {
          Navigator.of(ctx).pop();
          sendImage(context, ImageSource.gallery);
        },
      ),
    );
  }

  Future<void> sendImage(BuildContext context, ImageSource source) async {
    if (sendingObs.getValue()) return;
    final file = await _picker.pickImage(
      source: source,
      imageQuality: 85,
      maxWidth: 1600,
    );
    if (file == null) return;
    final reply = replyToObs.getValue();
    sendingObs.setValue(true);
    final result = await _repo.sendImage(
      conversationId: conversationId,
      imagePath: file.path,
      replyToId: reply?.id,
      replyToPreview: reply == null ? null : _previewFor(reply),
      replyToMine: reply?.mine ?? false,
    );
    sendingObs.setValue(false);
    result.when(
      isSuccess: (data) {
        if (data != null) {
          clearReply();
          detailRequester.applyLocal(data);
          _simulatePeerTyping();
          scrollToBottom(animated: true);
        }
      },
      isError: (error) {
        AppSnackBar.showSimpleToast(msg: error.message);
      },
    );
  }

  void _simulatePeerTyping() {
    _typingTimer?.cancel();
    peerTypingObs.setValue(true);
    _typingTimer = Timer(const Duration(seconds: 2), () {
      peerTypingObs.setValue(false);
    });
  }

  void copyMessage(BuildContext context, ChatMessageDomainModel message) {
    final text = message.text?.trim();
    if (text == null || text.isEmpty) return;
    Clipboard.setData(ClipboardData(text: text));
    AppSnackBar.showSimpleToast(msg: Translate.s.chat_copied, type: ToastType.success);
  }

  void openPeerProfile(BuildContext context, String userId) {
    AutoRouter.of(context).push(UserPublicProfileRoute(userId: userId));
  }

  void openImage(BuildContext context, String path) {
    showDialog<void>(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.92),
      builder: (ctx) => BuildChatImageViewer(path: path),
    );
  }

  List<ChatTimelineItem> buildTimeline(List<ChatMessageDomainModel> messages) {
    final items = <ChatTimelineItem>[];
    DateTime? lastDay;
    for (var i = 0; i < messages.length; i++) {
      final message = messages[i];
      final day = DateTime(message.at.year, message.at.month, message.at.day);
      if (lastDay == null || day != lastDay) {
        items.add(ChatTimelineDate(day));
        lastDay = day;
      }
      final prev = i > 0 ? messages[i - 1] : null;
      final next = i < messages.length - 1 ? messages[i + 1] : null;
      final isSpecial = message.kind == ChatMessageKind.system ||
          message.kind == ChatMessageKind.orderCard;
      final isFirst = isSpecial ||
          prev == null ||
          prev.kind == ChatMessageKind.system ||
          prev.kind == ChatMessageKind.orderCard ||
          prev.mine != message.mine ||
          message.at.difference(prev.at).inMinutes > 8;
      final isLast = isSpecial ||
          next == null ||
          next.kind == ChatMessageKind.system ||
          next.kind == ChatMessageKind.orderCard ||
          next.mine != message.mine ||
          next.at.difference(message.at).inMinutes > 8;
      items.add(
        ChatTimelineMessage(
          message: message,
          isFirstInGroup: isFirst,
          isLastInGroup: isLast,
        ),
      );
    }
    return items;
  }

  String dateLabel(BuildContext context, DateTime day) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final target = DateTime(day.year, day.month, day.day);
    if (target == today) return Translate.s.chat_today;
    if (target == yesterday) return Translate.s.chat_yesterday;
    final locale = Localizations.localeOf(context).toString();
    return DateFormat('d MMMM y', locale).format(day).toLocaleDigits;
  }

  String presenceLabel(BuildContext context, ConversationDomainModel conversation) {
    if (peerTypingObs.getValue()) return Translate.s.chat_typing;
    if (conversation.peerOnline) return Translate.s.chat_online;
    final last = conversation.peerLastSeen;
    if (last == null) return conversation.peerName;
    final locale = Localizations.localeOf(context).toString();
    final time = DateFormat('d MMM · h:mm a', locale).format(last).toLocaleDigits;
    return Translate.s.chat_last_seen(time);
  }

  void onMessagesRendered() {
    if (!_needsInitialScroll) return;
    _needsInitialScroll = false;
    WidgetsBinding.instance.addPostFrameCallback((_) => scrollToBottom());
  }

  void scrollToBottom({bool animated = false}) {
    if (!scrollController.hasClients) return;
    final offset = scrollController.position.maxScrollExtent;
    if (animated) {
      scrollController.animateTo(
        offset,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    } else {
      scrollController.jumpTo(offset);
    }
  }

  void dispose() {
    _typingTimer?.cancel();
    messageController.removeListener(_onTextChanged);
    messageController.dispose();
    scrollController.dispose();
  }
}

sealed class ChatTimelineItem {
  const ChatTimelineItem();
}

class ChatTimelineDate extends ChatTimelineItem {
  final DateTime day;
  const ChatTimelineDate(this.day);
}

class ChatTimelineMessage extends ChatTimelineItem {
  final ChatMessageDomainModel message;
  final bool isFirstInGroup;
  final bool isLastInGroup;

  const ChatTimelineMessage({
    required this.message,
    required this.isFirstInGroup,
    required this.isLastInGroup,
  });
}
