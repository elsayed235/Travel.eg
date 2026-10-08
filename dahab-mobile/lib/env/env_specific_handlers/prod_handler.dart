import 'package:rehla/env/app_env_type.dart';
import 'package:rehla/env/config_handler.dart';
Future<void> main() async {
  await handleConfig(AppEnvType.prod);
}
