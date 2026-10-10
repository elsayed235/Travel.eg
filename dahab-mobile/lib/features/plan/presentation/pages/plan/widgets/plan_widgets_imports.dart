import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/constants/app_config.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/helpers/app_money.dart';
import 'package:rehla/core/helpers/copy_direction.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/requester/consumer/requester_consumer.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/text/app_fonts.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_entrance.dart';
import 'package:rehla/features/plan/domain/matching/plan_matcher.dart';
import 'package:rehla/features/plan/domain/models/kept_trip.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';

import '../plan_imports.dart';
import 'package:rehla/core/widgets/app_icon.dart';

part 'plan_labels.dart';
part 'build_plan_option.dart';
part 'build_plan_compose.dart';
part 'build_plan_step_body.dart';
part 'build_plan_building.dart';
part 'build_plan_results.dart';
part 'build_plan_card.dart';
part 'build_programme_image.dart';
part 'build_programme_sheet.dart';
part 'build_save_plan_button.dart';
