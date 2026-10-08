// ignore_for_file: avoid_print, depend_on_referenced_packages

import 'dart:convert';
import 'dart:io';

import 'package:flutter_tdd/core/constants/app_constants.dart';
import 'package:process_run/process_run.dart';

import 'app_env_type.dart';
import 'dart_environment_config_reader.dart';

/// This script is for
/// - download and set launcher icon
/// - Handle display name
Future<void> handleConfig(AppEnvType env) async {
  final reader = DartEnvironmentConfigReader(
    envType: env,
    argsMap: json.decode(File('.run/json/${env.value}.json').readAsStringSync()),
  );

  /// Handle name
  print('Handle Config>> Handle name..');
  // await _setAppId(reader.getAppId());
  final nameHandler = AppNameHandler(enName: reader.getAppNameEN(), arName: reader.getAppNameAr());
  await nameHandler.handle();

  print('Handle Config>> Handle logo..');
  final imagePath = reader.getLocalLogoAssetsPath()!;
  _copyEnvLogoToBeCommon(imagePath);
  _assertLogoFileExists(imagePath);

  await _setLauncherIcon();
}

class AppNameHandler {
  final String enName;
  final String arName;

  AppNameHandler({required this.enName, required this.arName});

  Future<void> handle() async {
    await _handleIOS();
    await _handleAndroid();
  }

  Future<void> _handleIOS() async {
    await reWriteFile(
        path: 'ios/en.lproj/InfoPlist.strings', content: _infoPlistFileContent(enName));
    await reWriteFile(
        path: 'ios/ar.lproj/InfoPlist.strings', content: _infoPlistFileContent(arName));
  }

  Future<void> _handleAndroid() async {
    await reWriteFile(
      path: 'android/app/src/main/res/values/strings.xml',
      content: _xmlFileContent(enName),
    );
    await reWriteFile(
      path: 'android/app/src/main/res/values-ar/strings.xml',
      content: _xmlFileContent(arName),
    );
  }

  Future<void> reWriteFile({required String path, required String content}) async {
    final xmlFile = File(path);
    try {
      xmlFile.deleteSync();
    } catch (_) {}

    await xmlFile.writeAsString(content);
    await xmlFile.create();
  }

  String _xmlFileContent(String name) {
    return """<?xml version="1.0" encoding="utf-8"?>
    <resources>
      <string name="APP_APP_NAME">$name</string>
     </resources>""";
  }

  String _infoPlistFileContent(String name) {
    return """
"CFBundleDisplayName" = "$name";
"CFBundleName" = "$name";
""";
  }
}

void _copyEnvLogoToBeCommon(String localLogoPath) {
  try {
    File(ApplicationConstants.logoPathPng).deleteSync();
  } catch (_) {}
  final file = File(ApplicationConstants.logoPathPng);
  file.writeAsBytesSync(File(localLogoPath).readAsBytesSync());
  file.createSync();
}

void _assertLogoFileExists(String path) {
  assert(File(path).existsSync());
}

Future<void> _setLauncherIcon() async {
  var shell = Shell();
  await shell.run('flutter pub get');
  await shell.run('flutter pub run flutter_launcher_icons');
}
