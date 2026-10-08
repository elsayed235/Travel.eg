import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/errors/base_error.dart';
import 'package:rehla/core/errors/unknown_error.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/helpers/global_context.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/svg_icon_wrapper.dart';
import 'package:rehla/res.dart';
import 'package:fluttertoast/fluttertoast.dart';

enum ToastType { success, error, info }
abstract class AppSnackBar {
  const AppSnackBar._();

  static bool _isSnackBarActive = false;

  static Map<ToastType, Color> toastBgColors = {
    ToastType.success: AppColors.snackBarGreenSuccess,
    ToastType.error: AppColors.snackBarRedError,
    ToastType.info: AppColors.snackBarYellowAlert,
  };

  static void showSuccessSnackBar(String message) {
    _showSnackBar(_CustomSnackBar(
        color: AppColors.snackBarGreenSuccess, icon: Res.successSnackBar, message: message));
  }

  static void showErrorSnackBar({
    required BaseError error,
    VoidCallback? callback,
  }) {
    _showSnackBar(_CustomSnackBar(
        color: AppColors.snackBarRedError,
        icon: Res.errorSnackBar,
        callback: callback,
        message: error.message));
  }

  static void showUnknownErrorSnackBar({VoidCallback? callback}) {
    showErrorSnackBar(error: UnknownError(), callback: callback);
  }

  static void showWarningSnackBar({required String message}) {
    _showSnackBar(_CustomSnackBar(
      color: AppColors.snackBarYellowAlert,
      icon: Res.warningSnackBar,
      message: message,
    ));
  }

  static void _showSnackBar(_CustomSnackBar snackBar,
      {
      // if true, show snackBar even if another snackBar is active
      bool forceShow = false}) {
    BuildContext context = getIt.get<GlobalContext>().context();
    if (_isSnackBarActive && !forceShow) return;
    _isSnackBarActive = true;
    ScaffoldMessenger.of(context).showSnackBar(snackBar).closed.then((value) {
      _isSnackBarActive = false;
    });
  }


  static void showSimpleToast(
      {required String msg,
        Color? color,
        Color? textColor,
        ToastType type = ToastType.error}) {
    Fluttertoast.showToast(
        msg: msg,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.CENTER,
        backgroundColor: color ?? toastBgColors[type],
        textColor: textColor ?? AppColors.onSnack,
        fontSize: 16.0);
  }
}

class _CustomSnackBar extends SnackBar {
  final String message;
  final VoidCallback? callback;
  final String icon;
  final Color color;
  final String? callbackMessage;

  _CustomSnackBar({
    required this.color,
    required this.icon,
    required this.message,
    this.callback,
    this.callbackMessage, Color? iconColor,
  }) : super(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl, vertical: AppSpacing.md),
            backgroundColor: Colors.transparent,
            elevation: 0,
            behavior: SnackBarBehavior.fixed,
            content: _SnackBarWidget(
              color: color,
              message: message,
              icon: icon,
              iconColor: iconColor,
              callback: callback,
              callbackMessage: callbackMessage,
            ));
}

class _SnackBarWidget extends StatelessWidget {
  final String icon;
  final String message;
  final Color color;
  final VoidCallback? callback;
  final String? callbackMessage;
  final Color? iconColor;

  const _SnackBarWidget({
    required this.icon,
    required this.message,
    required this.color,
    this.callback,
    this.callbackMessage, required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        borderRadius: AppRadius.cardAll,
        color: color,
      ),
      child: Row(
        children: [
          SvgIconWrapper(size: 20, iconPath: icon, color: iconColor),
          Gaps.hGap8,
          Expanded(
            child: Text(
              message,
              style: const AppTextStyle.s12_w400(color: AppColors.onSnack),
              overflow: TextOverflow.visible,
            ),
          ),
          if (callback != null) Gaps.hGap4,
          if (callback != null)
            InkWell(
              onTap: callback,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(callbackMessage ?? Translate.s.retry,
                      style: const AppTextStyle.s14_w400(color: AppColors.onSnack)
                  ),
                  SizedBox(
                    width: callbackMessage!.length * 10,
                    child: Divider(
                      color: AppColors.onSnack,
                      height: 0,
                      thickness: 1,
                    ),
                  )
                ],
              ),
            ),
        ],
      ),
    );
  }
}
