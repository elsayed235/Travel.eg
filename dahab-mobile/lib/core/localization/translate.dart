import 'package:flutter/material.dart';
import 'package:flutter_tdd/generated/l10n.dart';

class Translate {
  Translate._();

  // TODO @Deprecated('use .of(context)')
  static S get s {
    return S.current;
  }

  static S of(BuildContext context) {
    return S.of(context);
  }

  static Future<void> initForTest({String? languageCode}) async {
    await S.load(Locale(languageCode ?? 'en'));
  }
}
