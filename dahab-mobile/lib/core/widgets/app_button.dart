import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

enum _AppTextButton {
  minPrimaryColor,
  minWhiteColor,
  minCustomColor,
  maxPrimaryColor,
  maxWhiteColor,
  maxCustomColor,
}

class AppTextButton extends StatelessWidget {
  const AppTextButton._(
      {super.key,
      required _AppTextButton appTextButton,
      required this.text,
      required this.enabled,
      this.onPressed,
      Color? bgColor,
      double? textSize,
      double? maxHeight,
      Color? txtColor})
      : _appTextButton = appTextButton,
        _textColor = txtColor,
        _bgColor = bgColor,
        maxHeight = maxHeight ?? 52,
        _textSize = textSize;

  final _AppTextButton _appTextButton;
  final String text;
  final bool enabled;
  final VoidCallback? onPressed;

  final Color? _bgColor;
  final Color? _textColor;
  final double? _textSize;

  final double minWidth = 100;
  final double maxWidth = double.maxFinite;

  final double minHeight = 40;
  final double maxHeight;

  factory AppTextButton.minPrimary(
      {Key? key, required String text, bool enabled = true, VoidCallback? onPressed}) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.minPrimaryColor,
      text: text,
      enabled: enabled,
      onPressed: onPressed,
    );
  }

  factory AppTextButton.minWhite({Key? key, required String text, VoidCallback? onPressed}) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.minWhiteColor,
      text: text,
      enabled: true,
      onPressed: onPressed,
    );
  }

  factory AppTextButton.maxPrimary(
      {Key? key, required String text, bool enabled = true, VoidCallback? onPressed}) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.maxPrimaryColor,
      text: text,
      enabled: enabled,
      onPressed: onPressed,
    );
  }

  factory AppTextButton.maxWhite({Key? key, required String text, VoidCallback? onPressed}) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.maxWhiteColor,
      text: text,
      enabled: true,
      onPressed: onPressed,
    );
  }

  factory AppTextButton.minCustom({
    Key? key,
    required String text,
    required Color bgColor,
    required Color txtColor,
    VoidCallback? onPressed,
    double? textSize,
    double? maxHeight,
  }) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.minCustomColor,
      text: text,
      enabled: true,
      bgColor: bgColor,
      txtColor: txtColor,
      onPressed: onPressed,
      textSize: textSize,
      maxHeight: maxHeight,
    );
  }

  factory AppTextButton.maxCustom({
    Key? key,
    required String text,
    VoidCallback? onPressed,
    Color? bgColor,
    Color? txtColor,
    double? textSize,
    double? maxHeight,
  }) {
    return AppTextButton._(
      key: key,
      appTextButton: _AppTextButton.maxCustomColor,
      text: text,
      enabled: true,
      bgColor: bgColor,
      txtColor: txtColor,
      onPressed: onPressed,
      textSize: textSize,
      maxHeight: maxHeight,
    );
  }

  ButtonStyle _filledStyle(BuildContext context, {required Color bg, required Color fg}) {
    return Theme.of(context).textButtonTheme.style?.copyWith(
              padding: WidgetStateProperty.all(EdgeInsets.zero),
              overlayColor: WidgetStateProperty.all(Colors.transparent),
              elevation: WidgetStateProperty.all(0),
              shape: WidgetStateProperty.all(
                RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              ),
              foregroundColor: WidgetStateProperty.all(fg),
              backgroundColor: WidgetStateProperty.resolveWith((states) {
                if (enabled) return bg;
                return context.colors.surface3;
              }),
            ) ??
        ButtonStyle(
          padding: WidgetStateProperty.all(EdgeInsets.zero),
          overlayColor: WidgetStateProperty.all(Colors.transparent),
          elevation: WidgetStateProperty.all(0),
          shape: WidgetStateProperty.all(
            RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
          ),
          foregroundColor: WidgetStateProperty.all(fg),
          backgroundColor: WidgetStateProperty.all(enabled ? bg : context.colors.surface3),
        );
  }

  ButtonStyle _ghostStyle(BuildContext context) {
    return Theme.of(context).textButtonTheme.style?.copyWith(
              padding: WidgetStateProperty.all(EdgeInsets.zero),
              overlayColor: WidgetStateProperty.all(Colors.transparent),
              elevation: WidgetStateProperty.all(0),
              shape: WidgetStateProperty.all(
                RoundedRectangleBorder(
                  borderRadius: AppRadius.buttonAll,
                  side: BorderSide(color: context.colors.line),
                ),
              ),
              foregroundColor: WidgetStateProperty.all(context.colors.text),
              backgroundColor: WidgetStateProperty.all(context.colors.surface2),
            ) ??
        ButtonStyle(
          padding: WidgetStateProperty.all(EdgeInsets.zero),
          overlayColor: WidgetStateProperty.all(Colors.transparent),
          backgroundColor: WidgetStateProperty.all(context.colors.surface2),
        );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    switch (_appTextButton) {
      case _AppTextButton.minPrimaryColor:
        return SizedBox(
          width: minWidth,
          height: minHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _filledStyle(context, bg: colors.button, fg: colors.onButton),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s14_w500(
                  color: enabled ? colors.onButton : colors.text3,
                ),
              ),
            ),
          ),
        );

      case _AppTextButton.minWhiteColor:
        return SizedBox(
          width: minWidth,
          height: minHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _ghostStyle(context),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s14_w500(color: colors.text),
              ),
            ),
          ),
        );

      case _AppTextButton.maxPrimaryColor:
        return SizedBox(
          width: maxWidth,
          height: maxHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _filledStyle(context, bg: colors.button, fg: colors.onButton),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s16_w500(
                  color: enabled ? colors.onButton : colors.text3,
                ),
              ),
            ),
          ),
        );

      case _AppTextButton.maxWhiteColor:
        return SizedBox(
          width: maxWidth,
          height: maxHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _ghostStyle(context),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s16_w500(color: colors.text),
              ),
            ),
          ),
        );
      case _AppTextButton.minCustomColor:
        return SizedBox(
          width: minWidth,
          height: maxHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _filledStyle(context, bg: _bgColor ?? colors.button, fg: _textColor ?? colors.onButton),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s14_w500(
                  color: _textColor ?? colors.onButton,
                ).copyWith(fontSize: _textSize ?? 14),
              ),
            ),
          ),
        );
      case _AppTextButton.maxCustomColor:
        return SizedBox(
          width: maxWidth,
          height: maxHeight,
          child: BouncingWidget(
            enable: enabled && onPressed != null,
            child: TextButton(
              style: _filledStyle(context, bg: _bgColor ?? colors.button, fg: _textColor ?? colors.onButton),
              onPressed: onPressed,
              child: Text(
                text,
                style: AppTextStyle.s16_w500(
                  color: _textColor ?? colors.onButton,
                ).copyWith(fontSize: _textSize ?? 16),
              ),
            ),
          ),
        );
    }
  }
}

class BouncingWidget extends StatefulWidget {
  final Widget child;
  final bool enable;

  const BouncingWidget({
    super.key,
    required this.child,
    this.enable = true,
  });

  @override
  State<BouncingWidget> createState() => _BouncingWidgetState();
}

class _BouncingWidgetState extends State<BouncingWidget> with SingleTickerProviderStateMixin {
  late double _scale;
  late AnimationController _controller;

  @override
  void didUpdateWidget(BouncingWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
  }

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(
        milliseconds: 100,
      ),
      lowerBound: 0.0,
      upperBound: 0.03,
    )..drive(CurveTween(curve: Curves.elasticIn));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _tapDown,
      onTapUp: _tapUp,
      onTapCancel: () {
        widget.enable ? _controller.reverse() : null;
      },
      child: AnimatedBuilder(
          animation: _controller,
          child: widget.child,
          builder: (_, child) {
            _scale = 1 - _controller.value;
            return Transform.scale(
              scale: _scale,
              child: child,
            );
          }),
    );
  }

  void _tapDown(TapDownDetails details) {
    widget.enable ? _controller.forward() : null;
  }

  void _tapUp(TapUpDetails details) {
    widget.enable ? _controller.reverse() : null;
  }
}
