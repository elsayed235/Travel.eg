import 'dart:io';
import 'dart:math';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tdd/core/errors/custom_error.dart';
import 'package:flutter_tdd/core/extensions/common_extension.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/helpers/psermission_services.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:get_it/get_it.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';
import 'package:permission_handler/permission_handler.dart';

@injectable
class AppFileService {
  /// Max size in Bytes (default 8MB)
  static const int defaultMaxSize = 8000000;
  /// pick file from device with optional parameter 'allowMultiple' if true user can select multi files else can select one file
  /// 'allowAddAttachments' optional parameter contain max size for each file "by default _maxSize = '8000'", and what type of file
  /// should be selected by user 'allowedExtensions'
  ///
  /// [pickFile] should return list<PlatformFile> or null
  Future<List<File>?> pickFile(
    BuildContext context, {
    List<String>? allowedMimeType,
    List<String>? allowedExtensions,
    FileType? fileType,
    int? maxFileSize,
    bool allowMultiple = false,
  }) async {
    final maxSize = maxFileSize ?? defaultMaxSize;

    /// Check if user has access to storage
    bool canAccess =
        await GetIt.I<PermissionServices>().requestPermission(Permission.storage, context);

    if (canAccess) {
      /// Pick file from device
      FilePickerResult? pickedFiles = await FilePicker.platform.pickFiles(
        type: fileType ?? (allowedExtensions.isNullOrEmpty ? FileType.any : FileType.custom),
        allowMultiple: allowMultiple,
        allowCompression: true,
        allowedExtensions: allowedExtensions,
      );

      if (pickedFiles != null) {
        List<String> fileHasHugeSize = [];
        List<File> acceptedFiles = [];

        /// Check file size and add it to acceptedFiles if it's size is less than allowed size
        for (var file in pickedFiles.files) {
          if (file.size > maxSize) {
            fileHasHugeSize.add(file.name);
          } else {
            acceptedFiles.add(File(file.path!));
          }
        }

        /// Show warning if file size is more than allowed size
        _showAllowedSizeExceededWarning(fileHasHugeSize: fileHasHugeSize, maxSize: maxSize);

        return acceptedFiles;
      }
    }
    return null;
  }

  Future<List<File>?> pickImagesFiles(BuildContext context, {required bool allowMulti}) async {
    List<File>? files;
    await showCupertinoModalPopup(
        context: context,
        useRootNavigator: false,
        builder: (context) {
          return CupertinoActionSheet(
            actions: [
              CupertinoActionSheetAction(
                onPressed: () async {
                  final file = await _onCameraPressed(context);
                  if (file != null) {
                    files = [file];
                  }
                  Navigator.pop(context);
                },
                child: Text(
                  Translate.s.camera,
                  style: AppTextStyle.s14_w400(color: context.colors.blackOpacity),
                ),
              ),
              CupertinoActionSheetAction(
                onPressed: () async {
                  final images = await _pickImageFiles(context, allowMultiple: allowMulti);
                  if (images != null) {
                    files = images;
                  }
                  Navigator.pop(context);
                },
                child: Text(
                  Translate.s.pick,
                  style: AppTextStyle.s14_w400(color: context.colors.blackOpacity),
                ),
              ),
            ],
            cancelButton: CupertinoActionSheetAction(
              onPressed: () => Navigator.pop(context),
              child: Text(
                Translate.s.app_cancel,
                style: AppTextStyle.s14_w400(color: context.colors.blackOpacity),
              ),
            ),
          );
        });
    return files;
  }

  Future<File?> _onCameraPressed(BuildContext context) async {
    try {
      final picker = ImagePicker();
      XFile? pickedFile = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 60,
      );
      if (pickedFile != null) {
        return File(pickedFile.path);
      }
      return null;
    } on PlatformException catch (e) {
      if (e.code == "camera_access_denied") {
        AppSnackBar.showErrorSnackBar(error: CustomError(msg: e.message ?? ""));
      }
      return null;
    }
  }

  Future<List<File>?> _pickImageFiles(
    BuildContext context, {
    bool allowMultiple = false,
  }) async {
    return pickFile(
      context,
      allowedMimeType: null,
      allowMultiple: allowMultiple,
      fileType: FileType.image,
    );
  }

  Future<List<File>?> pickVideoFiles(
    BuildContext context, {
    bool allowMultiple = false,
  }) async {
    return pickFile(
      context,
      allowedMimeType: null,
      allowMultiple: allowMultiple,
      fileType: FileType.video,
    );
  }


  void _showAllowedSizeExceededWarning({
    required List<String> fileHasHugeSize,
    required int maxSize,
  }) {
    if (fileHasHugeSize.isNotEmpty) {
      String filesName = fileHasHugeSize.join(", ");
      AppSnackBar.showSimpleToast(msg: Translate.s.size_more_than_mg_error((maxSize) / pow(1024, 2), filesName));
    }
  }

}

