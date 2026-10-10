import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/widgets/app_bottom_nav.dart';
import 'package:rehla/core/widgets/rehla_photo.dart';
import 'package:rehla/features/account/presentation/pages/account/account_imports.dart';
import 'package:rehla/features/account/presentation/pages/account/widgets/account_widgets_imports.dart';
import 'package:rehla/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'package:rehla/features/auth/presentation/manager/user_cubit/user_cubit.dart';
import 'package:rehla/features/base/presentation/shell_actions.dart';
import 'package:rehla/features/daygi/presentation/daygi_imports.dart';
import 'package:rehla/features/discover/domain/models/discover_door.dart';
import 'package:rehla/features/discover/presentation/pages/discover/discover_imports.dart';
import 'package:rehla/features/experiences/domain/experience_catalogue.dart';
import 'package:rehla/features/explore/presentation/explore_imports.dart';
import 'package:rehla/features/plan/domain/matching/plan_matcher.dart';
import 'package:rehla/features/plan/domain/models/kept_trip.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';
import 'package:rehla/features/plan/presentation/pages/plan/plan_imports.dart';
import 'package:rehla/features/trip/domain/trip_store.dart';
import 'package:rehla/features/trip/presentation/trip_imports.dart';

import 'widgets/home_widgets_imports.dart';
import 'package:rehla/core/widgets/app_icon.dart';

part 'home.dart';
part 'home_controller.dart';
