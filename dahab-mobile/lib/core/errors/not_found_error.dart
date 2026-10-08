
import 'package:flutter_tdd/core/localization/translate.dart';

import 'base_error.dart';

class NotFoundError extends BaseError {
  NotFoundError({this.msg}) : super(msg ?? Translate.s.error_NotFound_Error);

  final String? msg;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      super == other &&
          other is NotFoundError &&
          runtimeType == other.runtimeType &&
          message == other.message;

  @override
  int get hashCode => super.hashCode ^ message.hashCode;
}
