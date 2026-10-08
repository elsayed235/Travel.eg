import 'base_error.dart';

class FormatError extends BaseError {
  FormatError() : super('Format Error');

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      super == other && other is FormatError && runtimeType == other.runtimeType;

}
