import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/helpers/auth_session.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/widgets/app_bottom_nav.dart';
import 'package:flutter_tdd/features/account/presentation/pages/account/account_imports.dart';
import 'package:flutter_tdd/features/account/presentation/pages/account/widgets/account_widgets_imports.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';
import 'package:flutter_tdd/features/base/domain/requesters/home_feed_requester.dart';
import 'package:flutter_tdd/features/ai/domain/services/ai_tracker.dart';
import 'package:flutter_tdd/features/orders/presentation/pages/orders/orders_imports.dart';
import 'package:flutter_tdd/features/orders/presentation/pages/orders/widgets/orders_widgets_imports.dart';
import 'package:flutter_tdd/features/search/presentation/pages/explore/explore_imports.dart';
import 'package:flutter_tdd/features/search/presentation/pages/explore/widgets/explore_widgets_imports.dart';

import 'widgets/home_widgets_imports.dart';

part 'home.dart';
part 'home_controller.dart';
