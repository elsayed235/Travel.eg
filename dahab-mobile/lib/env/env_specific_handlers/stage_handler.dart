import 'package:flutter_tdd/env/app_env_type.dart';
import 'package:flutter_tdd/env/config_handler.dart';
Future<void> main() async {
  await handleConfig(AppEnvType.stage);
}
