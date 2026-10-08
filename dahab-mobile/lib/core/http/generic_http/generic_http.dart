
import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/helpers/global_context.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:injectable/injectable.dart';

import '../../network/network_info.dart';
import '../dio_helper/actions/delete.dart';
import '../dio_helper/actions/get.dart';
import '../dio_helper/actions/patch.dart';
import '../dio_helper/actions/post.dart';
import '../dio_helper/actions/put.dart';
import '../dio_helper/utils/handle_json_response.dart';
import '../models/http_request_model.dart';
import '../models/request_body_model.dart';

abstract class GenericHttp<T> {
  Future<MyResult<T>> call(HttpRequestModel model);
}

@lazySingleton
class GenericHttpImpl<T> extends GenericHttp<T> {

  @preResolve
  @override
  Future<MyResult<T>> call(HttpRequestModel model) async {
    RequestBodyModel params = RequestBodyModel(
      url: model.url,
      showLoader: model.showLoader ?? false,
      forceRefresh: model.refresh,
      errorFunc: model.errorFunc ?? (data) => data,
      body: model.requestBody ?? {},
    );

    await _checkInternetConnection();

    MyResult<Response> response;
    switch (model.requestMethod) {
      case RequestMethod.get:
        response = await getIt<Get>()(params);
        break;
      case RequestMethod.post:
        response = await getIt<Post>()(params);
        break;
      case RequestMethod.delete:
        response = await getIt<Delete>()(params);
        break;
      case RequestMethod.put:
        response = await getIt<Put>()(params);
        break;
      case RequestMethod.patch:
        response = await getIt<Patch>()(params);
        break;
    }
    var customType = HandleJsonResponse<T>()(
      response,
      model.responseType,
      model.toJsonFunc ?? (val) {},
      model.responseKey,
    );
    return customType;
  }

  Future<void> _checkInternetConnection() async {
    var context = getIt<GlobalContext>().context();
    await getIt<NetworkInfoImpl>().isConnected.then((connected) async {
      context.read<DeviceCubit>().setNetworkStatus(connected);
      if (!connected) {
        await Future.delayed(const Duration(seconds: 5), ()async {
          await _checkInternetConnection();
        });
      }
    });

  }

}
