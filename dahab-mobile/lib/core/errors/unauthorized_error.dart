import 'package:flutter_tdd/core/localization/translate.dart';

import 'base_error.dart';

class UnauthorizedError extends BaseError {
  UnauthorizedError({String? message}) : super(message??Translate.s.error_Unauthorized_Error);
}
