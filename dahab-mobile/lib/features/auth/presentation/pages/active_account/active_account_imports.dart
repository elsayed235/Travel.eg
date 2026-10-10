import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:rehla/core/constants/CustomButtonAnimation.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/helpers/app_quiet_success.dart';
import 'package:rehla/core/helpers/auth_session.dart';
import 'package:rehla/core/helpers/app_snack_bar_service.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/routes/router_imports.gr.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';
import 'package:rehla/features/auth/presentation/widgets/build_auth_chrome.dart';
import 'package:rehla/features/auth/presentation/widgets/pin_field_widget.dart';

import 'widgets/active_account_widgets_imports.dart';
import 'package:rehla/core/widgets/app_icon.dart';

part 'active_account.dart';
part 'active_account_controller.dart';
