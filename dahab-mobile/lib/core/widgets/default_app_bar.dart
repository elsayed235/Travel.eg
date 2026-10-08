import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/res.dart';

class DefaultAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final Widget? leading;
  final List<Widget> actions;
  final double? size;
  final bool? showBack;
  final bool? centerTitle;

  const DefaultAppBar({
    super.key,
    required this.title,
    this.actions = const [],
    this.leading,
    this.size,
    this.showBack = true,
    this.centerTitle,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title,
        style: AppTextStyle.screenTitle(color: context.colors.text),
      ),
      centerTitle: centerTitle ?? true,
      systemOverlayStyle: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarBrightness:
            Theme.of(context).brightness == Brightness.dark ? Brightness.dark : Brightness.light,
        statusBarIconBrightness:
            Theme.of(context).brightness == Brightness.dark ? Brightness.light : Brightness.dark,
      ),
      backgroundColor: context.colors.bg,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      leadingWidth: showBack == true ? 55 : 10,
      leading: leading ??
          Visibility(
            visible: showBack ?? true,
            child: IconButton(
              icon: SvgPicture.asset(
                Res.arrow,
                colorFilter: ColorFilter.mode(context.colors.text, BlendMode.srcIn),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
      actions: actions,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(size ?? 65);
}
