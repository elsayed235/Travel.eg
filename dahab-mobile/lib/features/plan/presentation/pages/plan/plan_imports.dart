import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/helpers/app_snack_bar_service.dart';
import 'package:rehla/core/helpers/auth_session.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/matching/plan_matcher.dart';
import 'package:rehla/features/plan/domain/models/kept_trip.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';
import 'package:rehla/features/plan/domain/repositories/plan_repository.dart';
import 'package:rehla/features/plan/domain/requesters/programmes_requester.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'widgets/plan_widgets_imports.dart';

part 'plan_controller.dart';
part 'plan_tab.dart';
