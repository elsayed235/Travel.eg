import 'package:dio/dio.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:injectable/injectable.dart';

import '../../models/http_request_model.dart';

@lazySingleton
class HandleJsonResponse<BaseModel> {
  Future<MyResult<BaseModel>> call(
    MyResult<Response> response,
    ResType responseType,
    _ToJsonFunc toJsonFunc,
    _ResponseKeyFunc? dataKeyFun,
  ) async {
    return response.when(
      isSuccess: (successData) {
        var responseData = successData?.data;
        switch (responseType) {
          case ResType.type:
            var data = dataKeyFun == null ? responseData : Function.apply(dataKeyFun, [responseData]);
            return MyResult.isSuccess(data);
          case ResType.model:
            var data = Function.apply(toJsonFunc, [
              dataKeyFun == null ? responseData : Function.apply(dataKeyFun, [responseData])
            ]);
            return MyResult.isSuccess(data);
          case ResType.list:
            var data = Function.apply(toJsonFunc, [
              dataKeyFun == null ? responseData : Function.apply(dataKeyFun, [responseData])
            ]);
            return MyResult.isSuccess(data);
        }
      },
      isError: (error){
        return MyResult.isError(error);
      },
    );
  }
}

typedef _ToJsonFunc = Function(dynamic data);
typedef _ResponseKeyFunc = Function(Response data);
