import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/requester/consumer/requester_consumer.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/text/app_fonts.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_entrance.dart';
import 'package:rehla/features/discover/domain/content/discover_content.dart';
import 'package:rehla/features/discover/domain/models/conditions_domain_model.dart';
import 'package:rehla/features/discover/domain/models/discover_door.dart';
import 'package:rehla/features/discover/domain/models/editorial_pick.dart';
import 'package:rehla/features/discover/domain/requesters/conditions_requester.dart';

import '../discover_imports.dart';

part 'build_discover_body.dart';
part 'build_discover_hero.dart';
part 'build_destination_switcher.dart';
part 'build_conditions_strip.dart';
part 'build_discover_doors.dart';
part 'build_discover_picks.dart';
part 'build_plan_prompt.dart';
