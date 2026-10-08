import 'package:rehla/core/constants/app_config.dart';
import 'package:rehla/core/errors/base_error.dart';
import 'package:rehla/core/http/generic_http/api_names.dart';
import 'package:rehla/core/http/generic_http/generic_http.dart';
import 'package:rehla/core/http/models/http_request_model.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/features/auth/domain/models/user_domain_model.dart';

/// Email session against the same routes the website uses
/// (`POST /api/auth/login` and `POST /api/auth/register`).
/// New accounts are always Traveler; the server ignores any role in the body.
class AuthRemote {
  const AuthRemote._();

  static bool get configured => AppConfig.instance.hostUrl.trim().isNotEmpty;

  static Future<AuthOutcome> signIn({
    required String email,
    required String password,
  }) {
    return _post(ApiNames.login, {'email': email, 'password': password});
  }

  static Future<AuthOutcome> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) {
    return _post(ApiNames.register, {
      'name': name,
      'email': email,
      'phone': phone,
      'password': password,
    });
  }

  static Future<AuthOutcome> _post(String url, Map<String, dynamic> body) async {
    if (!configured) {
      return AuthOutcome.fail(Translate.s.auth_server_missing);
    }
    final result = await GenericHttpImpl<dynamic>()(
      HttpRequestModel(
        url: url,
        requestMethod: RequestMethod.post,
        responseType: ResType.type,
        requestBody: body,
        quiet: true,
      ),
    );
    if (result.isError) {
      return AuthOutcome.fail(_readable(result.error));
    }
    final payload = _asMap(result.data);
    final user = _asMap(payload?['user']);
    if (user == null) {
      return AuthOutcome.fail(Translate.s.auth_server_missing);
    }
    final session = _asMap(payload?['session']);
    final token = session?['token'];
    return AuthOutcome.ok(
      user: _userFrom(user),
      token: token is String ? token : '',
    );
  }

  static UserDomainModel _userFrom(Map<String, dynamic> user) {
    final name = (user['name'] as String? ?? '').trim();
    final parts = name.split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    final first = parts.isEmpty ? name : parts.first;
    final last = parts.length > 1 ? parts.sublist(1).join(' ') : '';
    return UserDomainModel(
      id: user['id'] as String? ?? '',
      email: user['email'] as String? ?? '',
      phone: user['phone'] as String? ?? '',
      firstName: first,
      lastName: last,
    );
  }

  static Map<String, dynamic>? _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    return null;
  }

  static String _readable(BaseError? error) {
    final msg = error?.message.trim() ?? '';
    if (msg.isEmpty || msg.startsWith('<')) return Translate.s.auth_server_missing;
    return msg;
  }
}

class AuthOutcome {
  final UserDomainModel? user;
  final String token;
  final String? error;

  const AuthOutcome.ok({required this.user, required this.token}) : error = null;

  const AuthOutcome.fail(this.error)
      : user = null,
        token = '';

  bool get ok => user != null;
}
