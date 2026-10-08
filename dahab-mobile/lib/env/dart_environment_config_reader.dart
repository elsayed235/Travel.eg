

import 'app_env_type.dart';
import 'i_environment_config_reader.dart';

class DartEnvironmentConfigReader implements IEnvironmentConfigReader {
  final AppEnvType envType;
  final Map<String, dynamic> argsMap;

  DartEnvironmentConfigReader({required this.envType, required this.argsMap});

  @override
  String getBaseUrl() => "https://${argsMap['APP_BASE_URL']}";

  @override
  String getAPIUrl() => getBaseUrl() + argsMap['APP_API'];

  @override
  String getLogoUrl() => getBaseUrl() + argsMap['APP_LOGO_URL'];

  @override
  String getAppNameAr() => argsMap['APP_APP_NAME_AR'];

  @override
  String getAppNameEN() => argsMap['APP_APP_NAME_EN'];

  @override
  String getClientId() => argsMap['APP_CLIENT_ID'];

  @override
  String getAnonymousClientId() => argsMap['APP_ANONYMOUS_CLIENT_ID'];

  @override
  String getAnonymousClientSECRET() => argsMap['APP_ANONYMOUS_CLIENT_SECRET'];

  @override
  String getAnonymousGrantType() => argsMap['APP_GRANT_TYPE'];

  @override
  String getAppEnvName() => argsMap['APP_ENV_NAME'];

  @override
  String? getLocalLogoAssetsPath() => argsMap['APP_LOCAL_LOGO'];

  @override
  String getAppId() => argsMap['APP_ID'];
}
