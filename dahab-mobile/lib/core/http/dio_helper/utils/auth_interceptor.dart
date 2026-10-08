import 'dart:developer';

import 'package:dio/dio.dart';
import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/http/dio_helper/actions/post.dart';
import 'package:flutter_tdd/core/http/generic_http/api_names.dart';
import 'package:flutter_tdd/core/http/models/request_body_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthInterceptor extends Interceptor {
  final pref = getIt<SharedPreferences>();

  String? accessToken;

  bool isInvalidSession = false;

  // AuthInterceptor(this._dio, this.restClient);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    return handler.next(options);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 403 || err.response?.statusCode == 401) {
      final result = await refreshToken();
      if (result) {
        final result = await _retry(err, handler);
        if (result) {
          return;
        } else {
          if (err.requestOptions.headers["requiresToken"] == true && isInvalidSession) {
            isInvalidSession = true;
          }
        }
      } else {
        if (err.requestOptions.headers["requiresToken"] == true && isInvalidSession) {
          isInvalidSession = true;
        }
      }
    }
    handler.next(err);

    return;
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = pref.getString("refreshToken");
      final resistanceAccessToken = pref.getString("token");

      RequestBodyModel params = RequestBodyModel(
        url: ApiNames.refreshToken,
        body: {
          'accessToken': resistanceAccessToken,
          'refreshToken': refreshToken,
        },
        errorFunc: (data) => data,
      );
      final result = await getIt<Post>()(params);

      return result.when(isSuccess: (response) {
        Map<String, dynamic> data = response!.data;
        String? accessToken = data['result'];
        if (accessToken != null && (accessToken.isNotEmpty)) {
          pref.setString("token", accessToken);
          pref.setString("refreshToken", refreshToken ?? "");
          return Future.value(true);
        }
        return Future.value(false);
      }, isError: (error) {
        return Future.value(false);
      });
    } catch (error, s) {
      log('refreshToken in AuthInterceptor error $error | s $s');
      return Future.value(false);
    }
  }

  Future<bool> _retry(
    DioException dioException,
    ErrorInterceptorHandler handler,
  ) async {
    try {
      final dio = Dio();
      final resistanceAccessToken = pref.getString("token");

      dioException.requestOptions.headers["Authorization"] = "Bearer ${resistanceAccessToken!}";

      //create request with new access token
      final opts = Options(
        method: dioException.requestOptions.method,
        headers: dioException.requestOptions.headers,
      );
      final cloneReq = await dio.request(dioException.requestOptions.path,
          options: opts,
          data: dioException.requestOptions.data,
          queryParameters: dioException.requestOptions.queryParameters);

      handler.resolve(cloneReq);
      return Future.value(true);
    } catch (e) {
      log('error happened in _retry and then we will logout from the application');
      return Future.value(false);
    }
  }
}
