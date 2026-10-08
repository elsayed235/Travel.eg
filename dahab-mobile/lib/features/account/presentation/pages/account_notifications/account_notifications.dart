part of 'account_notifications_imports.dart';

@RoutePage(name: 'AccountNotificationsRoute')
class AccountNotifications extends StatefulWidget {
  const AccountNotifications({super.key});

  @override
  State<AccountNotifications> createState() => _AccountNotificationsState();
}

class _AccountNotificationsState extends State<AccountNotifications> {
  final AccountNotificationsController controller = AccountNotificationsController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_notifications),
      body: ListView(
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          Text(
            Translate.s.account_notifications_hint,
            style: AppTextStyle.body(color: context.colors.text2),
          ),
          Gaps.vGap18,
          _ToggleCard(
            title: Translate.s.account_notif_push,
            subtitle: Translate.s.account_notif_push_hint,
            obs: controller.pushObs,
          ),
          Gaps.vGap9,
          _ToggleCard(
            title: Translate.s.account_notif_offers,
            subtitle: Translate.s.account_notif_offers_hint,
            obs: controller.offersObs,
          ),
          Gaps.vGap9,
          _ToggleCard(
            title: Translate.s.account_notif_sms,
            subtitle: Translate.s.account_notif_sms_hint,
            obs: controller.smsObs,
          ),
        ],
      ),
    );
  }
}

class _ToggleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final ObsValue<bool> obs;

  const _ToggleCard({
    required this.title,
    required this.subtitle,
    required this.obs,
  });

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: obs,
      builder: (context, enabled) {
        return Container(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.lg,
          ),
          decoration: BoxDecoration(
            color: context.colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: context.colors.line),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTextStyle.body(color: context.colors.text)),
                    Gaps.vGap4,
                    Text(subtitle, style: AppTextStyle.caption(color: context.colors.text3)),
                  ],
                ),
              ),
              Switch.adaptive(
                value: enabled,
                activeThumbColor: context.colors.onButton,
                activeTrackColor: context.colors.button,
                inactiveThumbColor: context.colors.surface1,
                inactiveTrackColor: context.colors.surface3,
                onChanged: obs.setValue,
              ),
            ],
          ),
        );
      },
    );
  }
}
