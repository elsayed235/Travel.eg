import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/helpers/app_money.dart';
import 'package:rehla/core/helpers/rehla_dates.dart';
import 'package:rehla/core/http/rehla_api.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/routes/router_imports.gr.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_fonts.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/rehla_photo.dart';
import 'package:rehla/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'package:rehla/features/auth/presentation/manager/user_cubit/user_cubit.dart';
import 'package:rehla/features/base/presentation/shell_actions.dart';
import 'package:rehla/features/experiences/domain/experience_catalogue.dart';
import 'package:rehla/features/experiences/domain/experience_fit.dart';
import 'package:rehla/features/experiences/domain/models/experience.dart';
import 'package:rehla/features/trip/data/trip_remote.dart';
import 'package:rehla/features/trip/domain/trip_store.dart';
import 'package:rehla/core/widgets/app_icon.dart';

part 'widgets/build_experience_card.dart';
part 'widgets/build_experience_row.dart';
part 'widgets/build_experience_bits.dart';
part 'pages/experience_page.dart';
part 'pages/booking_sheet.dart';
part 'pages/checkout_page.dart';

/// Opens an experience over whichever tab asked.
void openExperience(BuildContext context, Experience experience) {
  Navigator.of(context).push(RehlaPageRoute<void>(builder: (_) => ExperiencePage(experience: experience)));
}
