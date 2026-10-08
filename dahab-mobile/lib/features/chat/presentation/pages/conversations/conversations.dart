part of 'conversations_imports.dart';

@RoutePage(name: 'ConversationsRoute')
class Conversations extends StatefulWidget {
  const Conversations({super.key});

  @override
  State<Conversations> createState() => _ConversationsState();
}

class _ConversationsState extends State<Conversations> {
  final ConversationsController controller = ConversationsController();

  @override
  void initState() {
    super.initState();
    controller.init();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.chat_conversations_title),
      body: RequesterConsumer<List<ConversationDomainModel>>(
        requester: controller.requester,
        loadingBuilder: (_) => AppScreenShimmer.list(),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, items, _) {
          if (items.isEmpty) {
            return Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    Translate.s.chat_conversations_empty_title,
                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                    textAlign: TextAlign.center,
                  ),
                  Gaps.vGap9,
                  Text(
                    Translate.s.chat_conversations_empty_subtitle,
                    style: AppTextStyle.body(color: context.colors.text2),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.sm),
            itemCount: items.length,
            separatorBuilder: (_, _) => Divider(
              height: 1,
              thickness: 1,
              color: context.colors.line,
              indent: 86,
            ),
            itemBuilder: (context, index) {
              final item = items[index];
              final unread = item.unreadCount > 0;
              final time = DateFormat('h:mm a', locale).format(item.lastAt).toLocaleDigits;
              return Material(
                color: context.colors.bg,
                child: InkWell(
                  onTap: () => controller.openConversation(context, item.id),
                  splashFactory: NoSplash.splashFactory,
                  child: Padding(
                    padding: const EdgeInsetsDirectional.fromSTEB(
                      AppSpacing.xl,
                      AppSpacing.md,
                      AppSpacing.xl,
                      AppSpacing.md,
                    ),
                    child: Row(
                      children: [
                        ChatOrderAvatar(
                          orderImageUrl: item.orderImageUrl,
                          peerAvatarUrl: item.peerAvatarUrl,
                          peerInitial: item.peerInitial,
                          peerOnline: item.peerOnline,
                          size: 56,
                          peerSize: 22,
                        ),
                        Gaps.hGap13,
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item.title,
                                      style: unread
                                          ? AppTextStyle.itemTitle(color: context.colors.text)
                                          : AppTextStyle.body(color: context.colors.text),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  Text(
                                    time,
                                    style: AppTextStyle.micro(
                                      color: unread
                                          ? context.colors.green
                                          : context.colors.text3,
                                    ),
                                  ),
                                ],
                              ),
                              Gaps.vGap4,
                              Text(
                                item.peerName,
                                style: AppTextStyle.caption(color: context.colors.text2),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Gaps.vGap6,
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item.lastMessage,
                                      style: AppTextStyle.body(
                                        color: unread
                                            ? context.colors.text
                                            : context.colors.text2,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (unread) ...[
                                    Gaps.hGap9,
                                    Container(
                                      constraints: const BoxConstraints(minWidth: 20),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: AppSpacing.sm,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: context.colors.green,
                                        borderRadius: AppRadius.chipAll,
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        item.unreadCount.toLocaleDigits,
                                        style: AppTextStyle.micro(
                                          color: context.colors.onGreen,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
