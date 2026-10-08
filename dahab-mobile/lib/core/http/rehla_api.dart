import 'package:dio/dio.dart';
import 'package:rehla/core/constants/app_config.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/http/dio_helper/utils/dio_header.dart';
import 'package:rehla/core/http/generic_http/api_names.dart';

/// JSON calls that need the server's error `code` (PRICE_CHANGED,
/// HOLD_EXPIRED, …) rather than a toast: booking, holds and the trip.
/// Same base URL and headers as the generic client, no response cache.
class RehlaApi {
  const RehlaApi._();

  static bool get configured => AppConfig.instance.hostUrl.trim().isNotEmpty;

  static Dio get _dio => Dio(
        BaseOptions(
          baseUrl: ApiNames.baseUrl,
          headers: getIt<DioHeader>().call(),
          connectTimeout: const Duration(seconds: 12),
          receiveTimeout: const Duration(seconds: 20),
        ),
      );

  static Future<ApiReply> get(String path) => _send(() => _dio.get(path));

  static Future<ApiReply> post(String path, Map<String, dynamic> body) => _send(() => _dio.post(path, data: body));

  static Future<ApiReply> _send(Future<Response<dynamic>> Function() call) async {
    if (!configured) return const ApiReply.fail(status: 0, code: 'NO_HOST');
    try {
      final res = await call();
      return ApiReply.ok(res.data);
    } on DioException catch (e) {
      final data = e.response?.data;
      final map = data is Map ? data : const {};
      final error = map['error'] ?? map['detail'] ?? map['message'];
      return ApiReply.fail(
        status: e.response?.statusCode ?? 0,
        code: map['code'] is String ? map['code'] as String : null,
        message: error is String ? error : null,
        details: map['details'] is Map ? Map<String, dynamic>.from(map['details'] as Map) : null,
      );
    } catch (_) {
      return const ApiReply.fail(status: 0);
    }
  }
}

class ApiReply {
  final dynamic data;
  final int status;
  final String? code;
  final String? message;
  final Map<String, dynamic>? details;

  const ApiReply.ok(this.data)
      : status = 200,
        code = null,
        message = null,
        details = null;

  const ApiReply.fail({required this.status, this.code, this.message, this.details}) : data = null;

  bool get ok => status >= 200 && status < 300;

  bool get unauthorized => status == 401;

  /// No answer at all: offline, no host, or the server is down.
  bool get unreachable => status == 0;

  Map<String, dynamic> get map {
    final d = data;
    if (d is Map<String, dynamic>) return d;
    if (d is Map) return Map<String, dynamic>.from(d);
    return const {};
  }

  List<Map<String, dynamic>> list(String key) {
    final v = map[key];
    if (v is! List) return const [];
    return v.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList();
  }
}
