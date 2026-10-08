
import 'package:flutter_tdd/core/models/localized_name_model/localized_name_model.dart';

import 'app_env_type.dart';
import 'i_environment_config_reader.dart';

class FlutterEnvironmentConfigReader implements IEnvironmentConfigReader {
  // AppEnvType get envType => AppEnvType.fromValue(getAppEnvName());
  AppEnvType get envType => AppEnvType.stage;

  FlutterEnvironmentConfigReader._();

  static FlutterEnvironmentConfigReader get instance => FlutterEnvironmentConfigReader._();

  /// org url should be get when user login and write org url
  String? _orgBaseUrl;

  void setPrgBaseUrl(String value) {
    /// TODO to work on when support multi-env switching
    return;
    // if (value != _orgBaseUrl) {
    //   _orgBaseUrl = value;
    // }
  }

  @override
  String getBaseUrl() => _orgBaseUrl ?? "https://${const String.fromEnvironment('APP_BASE_URL')}";

  @override
  String getAPIUrl() => getBaseUrl() + const String.fromEnvironment('APP_API');

  @override
  String getLogoUrl() => getBaseUrl() + const String.fromEnvironment('APP_LOGO_URL');

  LocalizedNameModel getAppLocalizedName() =>
      LocalizedNameModel.fromJson({"ar": getAppNameAr(), "en": getAppNameEN()});

  @override
  String getAppNameAr() => const String.fromEnvironment('APP_APP_NAME_AR');

  @override
  String getAppNameEN() => const String.fromEnvironment('APP_APP_NAME_EN');

  @override
  String getClientId() => const String.fromEnvironment('APP_CLIENT_ID');

  @override
  String getAnonymousClientId() => const String.fromEnvironment('APP_ANONYMOUS_CLIENT_ID');

  @override
  String getAnonymousClientSECRET() => const String.fromEnvironment('APP_ANONYMOUS_CLIENT_SECRET');

  @override
  String getAnonymousGrantType() => const String.fromEnvironment('APP_GRANT_TYPE');

  @override
  String getAppEnvName() => const String.fromEnvironment('APP_ENV_NAME');

  @override
  String? getLocalLogoAssetsPath() => const String.fromEnvironment('APP_LOCAL_LOGO');

  @override
  String getAppId() => const String.fromEnvironment('APP_ID');
}
