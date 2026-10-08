import 'package:flutter_tdd/core/errors/unknown_error.dart';

abstract class BaseError {
  const BaseError(this.message);

  final String message;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is BaseError && runtimeType == other.runtimeType;

  @override
  int get hashCode => 0;

  factory BaseError.unknown({String? msg}) {
    return UnknownError(msg: msg);
  }
}
