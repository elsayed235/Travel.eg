part of 'account_notifications_imports.dart';

class AccountNotificationsController {
  final ObsValue<bool> pushObs = ObsValue.withInit(true);
  final ObsValue<bool> offersObs = ObsValue.withInit(true);
  final ObsValue<bool> smsObs = ObsValue.withInit(false);

  void dispose() {}
}
