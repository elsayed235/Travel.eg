import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:flutter_tdd/core/errors/forbidden_error.dart';
import 'package:flutter_tdd/core/errors/not_found_error.dart';
import 'package:flutter_tdd/core/errors/unknown_error.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'result.freezed.dart';

@freezed
class MyResult<T> with _$MyResult<T> {
  const MyResult._();

  T? get data => whenOrNull(isSuccess: (data) => data);

  BaseError? get error => whenOrNull(isError: (err) => err);

  const factory MyResult.isSuccess([T? data]) = IsSuccess<T>;

  const factory MyResult.isError(BaseError error) = IsError;

  factory MyResult.unknownError() {
    return MyResult.isError(UnknownError());
  }

  factory MyResult.forbiddenError() {
    return MyResult.isError(ForbiddenError());
  }

  factory MyResult.notFoundError() {
    return MyResult.isError(NotFoundError());
  }

  bool get isSuccess => when(isSuccess: (_) => true, isError: (_) => false);

  bool get isError => when(isSuccess: (_) => false, isError: (_) => true);
}
