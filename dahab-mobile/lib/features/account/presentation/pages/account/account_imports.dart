import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/helpers/auth_session.dart';
import 'package:flutter_tdd/core/helpers/device_settings.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/features/account/domain/models/account_domain_model.dart';
import 'package:flutter_tdd/features/account/domain/requesters/account_requester.dart';
import 'package:flutter_tdd/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';

import 'widgets/account_widgets_imports.dart';

part 'account_controller.dart';
