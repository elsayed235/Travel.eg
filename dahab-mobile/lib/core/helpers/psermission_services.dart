import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/duration_constants.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:injectable/injectable.dart';
import 'package:permission_handler/permission_handler.dart';

@injectable
class PermissionServices {
  Future<PermissionStatus> getContactsPermission() async {
    await Permission.contacts.request();
    final PermissionStatus permission = await Permission.contacts.status;
    if (permission != PermissionStatus.granted && permission != PermissionStatus.denied) {
      final Map<Permission, PermissionStatus> permissionStatus =
          await [Permission.contacts].request();
      return permissionStatus[Permission.contacts] ?? PermissionStatus.granted;
    } else {
      return permission;
    }
  }

  Future<bool> requestPermission(Permission permission, BuildContext context) async {
    if(permission == Permission.storage && Platform.isAndroid){
      DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
      AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      if(androidInfo.version.sdkInt > 29){
        return true;
      }
    }
    await permission.request();
    PermissionStatus permissionStatus = await permission.status;
    if (permissionStatus.isGranted) return true;
    // We didn't ask for permission yet or the permission has been denied before but not permanently.
    if (permissionStatus.isPermanentlyDenied || permissionStatus.isDenied) {
      // The user opted to never again see the permission request dialog for this
      // app. The only way to change the permission's status now is to let the
      // user manually enable it in the system settings.
      AppSnackBar.showSimpleToast(msg: Translate.s.access_denied);
      Future.delayed(DurationConstants.longAnimationDuration, () {
        openAppSettings();
      },);
      return false;
    }
    return true;
  }
}
