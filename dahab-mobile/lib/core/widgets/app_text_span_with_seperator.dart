import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';

class AppTextSpanWithSeparator extends StatelessWidget {
  final List<TextSpanItem> textsItems;
  final TextStyle? style;
  ///to separate between texts
  final String? separator;

  const AppTextSpanWithSeparator({super.key, required this.textsItems, this.style, this.separator});

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
        children: List.generate(
          (textsItems.length * 2 - 1),
          (index) {
            if (index.isOdd) return TextSpan(text: separator ?? ", ");
            return TextSpan(
              text: textsItems[(index / 2).ceil()].title,
              recognizer: TapGestureRecognizer()
                ..onTap = () {
                  textsItems[(index / 2).ceil()].onTap?.call();
                },
            );
          },
        ),
        style: style ??
            AppTextStyle.s16_w400(
              color: context.colors.blackOpacity,
            ),
      ),
    );
  }
}

class TextSpanItem {
  final String title;
  final VoidCallback? onTap;

  TextSpanItem({
    required this.title,
    this.onTap,
  });
}
