import 'package:flutter_tdd/core/constants/app_constants.dart';
import 'package:injectable/injectable.dart';

import '../../../helpers/global_state.dart';

@lazySingleton
class DioHeader {
  Map<String, String> call() {
    String? token = GlobalState.instance.get(ApplicationConstants.keyToken);
    return {
      "Content-Type": "application/json",
      'Accept': 'application/json',
      'Authorization': '${ApplicationConstants.headerBearer} $token',
    };
  }
}
