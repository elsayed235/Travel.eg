import 'package:flutter_tdd/core/localization/translate.dart';

import 'base_error.dart';

class UnknownError extends BaseError {
  final String? msg;
   UnknownError({this.msg}):super(msg??Translate.s.something_went_wrong);
}
