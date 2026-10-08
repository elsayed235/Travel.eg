import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/widgets/CachedImage.dart';

/// Product (order) image with offer-sender avatar badge.
class ChatOrderAvatar extends StatelessWidget {
  final String? orderImageUrl;
  final String? peerAvatarUrl;
  final String peerInitial;
  final bool peerOnline;
  final double size;
  final double peerSize;
  final Color? borderColor;

  const ChatOrderAvatar({
    super.key,
    required this.orderImageUrl,
    required this.peerAvatarUrl,
    required this.peerInitial,
    this.peerOnline = false,
    this.size = 54,
    this.peerSize = 22,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    final border = borderColor ?? context.colors.bg;
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(
            child: orderImageUrl != null
                ? CachedImage(
                    url: orderImageUrl!,
                    width: size,
                    height: size,
                    fit: BoxFit.cover,
                    borderRadius: AppRadius.buttonAll,
                    bgColor: context.colors.surface3,
                  )
                : Container(
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: context.colors.surface3,
                      borderRadius: AppRadius.buttonAll,
                      border: Border.all(color: context.colors.line),
                    ),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      size: size * 0.36,
                      color: context.colors.text3,
                    ),
                  ),
          ),
          PositionedDirectional(
            end: -2,
            bottom: -2,
            child: Container(
              width: peerSize,
              height: peerSize,
              decoration: BoxDecoration(
                borderRadius: AppRadius.buttonAll,
                border: Border.all(color: border, width: 2),
              ),
              clipBehavior: Clip.antiAlias,
              child: peerAvatarUrl != null
                  ? CachedImage(
                      url: peerAvatarUrl!,
                      width: peerSize,
                      height: peerSize,
                      fit: BoxFit.cover,
                      borderRadius: AppRadius.buttonAll,
                      bgColor: context.colors.surface2,
                    )
                  : Container(
                      alignment: Alignment.center,
                      color: context.colors.surface2,
                      child: Text(
                        peerInitial,
                        style: AppTextStyle.micro(color: context.colors.text2),
                      ),
                    ),
            ),
          ),
          if (peerOnline)
            PositionedDirectional(
              end: -1,
              bottom: -1,
              child: Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: context.colors.green,
                  borderRadius: AppRadius.chipAll,
                  border: Border.all(color: border, width: 1.5),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
