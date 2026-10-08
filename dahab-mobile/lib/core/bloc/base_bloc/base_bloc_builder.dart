import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/constants/app_loader_widget.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/constants/types.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';

import 'base_bloc.dart';
import 'base_state.dart';

class BaseBlocBuilder<T> extends StatelessWidget {
  final BaseBloc<T> bloc;
  final Widget Function(T data) onSuccessWidget;
  final WidgetFailureBuilder? onFailedWidget;
  final WidgetBuilder? onLoadingWidget;

  const BaseBlocBuilder({
    super.key,
    required this.bloc,
    required this.onSuccessWidget,
    this.onFailedWidget,
    this.onLoadingWidget,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BaseBloc<T>, BaseState<T>>(
      bloc: bloc,
      builder: (_, state) {
        return state.maybeWhen(
          orElse: () => Gaps.empty,
          success: (changed,data) {
            return onSuccessWidget(data as T);
          },
          loading: () => onLoadingWidget?.call(context) ?? const AppLoaderWidget.largeLogo(),
          failure: (error, callback) =>
              onFailedWidget?.call(context, error, callback) ??
              ShowErrorWidget(error: error, callback: callback),
        );
      },
    );
  }
}

class ShowErrorWidget extends StatelessWidget {
  final BaseError error;
  final VoidCallback callback;

  const ShowErrorWidget({
    super.key,
    required this.error,
    required this.callback,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      error.message,
      style: const AppTextStyle.s16_w400(color: AppColors.snackBarRedError),
    );
  }
}
