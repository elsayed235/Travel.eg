import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';

typedef WidgetFailureBuilder = Widget Function(
    BuildContext context, BaseError error, VoidCallback callback);