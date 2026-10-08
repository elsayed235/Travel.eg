import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';

class NetworkLayerWidget extends StatefulWidget {
  final Widget child;
  final bool isNetworkConnected;

  const NetworkLayerWidget({
    super.key,
    required this.child,
    required this.isNetworkConnected,
  });

  @override
  State<NetworkLayerWidget> createState() => _NetworkLayerWidgetState();
}

class _NetworkLayerWidgetState extends State<NetworkLayerWidget> {
   final ObsValue<bool> _visibilityObs  = ObsValue<bool>.withInit(false);

   @override
  void didUpdateWidget(covariant NetworkLayerWidget oldWidget) {
     if (!widget.isNetworkConnected) {
       _visibilityObs.setValue(true);
     }else{
       Future.delayed(const Duration(milliseconds: 1000), () {
         _visibilityObs.setValue(false);
       });
     }
    super.didUpdateWidget(oldWidget);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(child: widget.child),
          ObsValueConsumer(
              observable: _visibilityObs,
              builder: (context, visible) {
                return Visibility(
                  visible: visible,
                  child: Container(
                    height: Platform.isIOS? 35 : 30,
                    width: MediaQuery.of(context).size.width,
                    padding: const EdgeInsets.only(top: 6),
                    color: widget.isNetworkConnected? context.colors.green : context.colors.black,
                    child: Text(
                      Translate.of(context).no_internet_connection,
                      textAlign: TextAlign.center,
                      style: AppTextStyle.s12_w400(
                        color: context.colors.white,
                      ),
                    ),
                  ),
                );
              }
          ),
        ],
      ),
    );
  }
}
