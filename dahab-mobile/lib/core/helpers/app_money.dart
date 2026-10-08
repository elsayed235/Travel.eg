import 'package:intl/intl.dart';

/// Prices are charged in EGP (server/services/fxService.ts). Latin digits in
/// both languages, as on the website, so amounts read the same everywhere.
class AppMoney {
  const AppMoney._();

  static final NumberFormat _egp = NumberFormat('#,##0', 'en');

  static String egp(num amount) => 'EGP ${_egp.format(amount)}';
}
