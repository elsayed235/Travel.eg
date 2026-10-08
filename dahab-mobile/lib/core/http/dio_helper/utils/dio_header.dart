import 'package:rehla/core/constants/app_constants.dart';
import 'package:injectable/injectable.dart';

import '../../../helpers/global_state.dart';

@lazySingleton
class DioHeader {
  Map<String, String> call() {
    final String? token = GlobalState.instance.get(ApplicationConstants.keyToken);
    return {
      "Content-Type": "application/json",
      'Accept': 'application/json',
      // The REHLA API hands the session token to native clients only
      // (server/middleware/nativeClient.ts); the website uses an HttpOnly cookie.
      'X-Dahab-Client': 'native',
      if (token != null && token.isNotEmpty) 'Authorization': '${ApplicationConstants.headerBearer} $token',
    };
  }
}
