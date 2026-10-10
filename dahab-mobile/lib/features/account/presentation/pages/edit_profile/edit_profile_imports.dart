import 'dart:io';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/helpers/app_snack_bar_service.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_button.dart';
import 'package:rehla/core/widgets/default_app_bar.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rehla/core/widgets/app_icon.dart';

part 'edit_profile.dart';
part 'edit_profile_controller.dart';
part 'widgets/build_edit_profile_field.dart';
part 'widgets/build_edit_profile_avatar.dart';
