import 'package:flutter_tdd/core/localization/translate.dart';

import 'base_error.dart';

class BadRequestError extends BaseError {
  final String? msg;

   BadRequestError({this.msg}):super(msg??Translate.s.error_BadRequest_Error);


  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      super == other &&
          other is BadRequestError &&
          runtimeType == other.runtimeType &&
          message == other.message;

  @override
  int get hashCode => super.hashCode ^ message.hashCode;
}
