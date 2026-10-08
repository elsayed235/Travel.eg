import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/helpers/app_quiet_success.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/requester/consumer/requester_consumer.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/widgets/default_app_bar.dart';
import 'package:flutter_tdd/core/widgets/shimmers/app_screen_shimmer.dart';
import 'package:flutter_tdd/features/orders/data/repositories/fake_orders_repository.dart';
import 'package:flutter_tdd/features/orders/domain/repositories/orders_repository.dart';
import 'package:flutter_tdd/features/orders/domain/models/order_domain_model.dart';
import 'package:flutter_tdd/features/orders/domain/requesters/orders_requesters.dart';

import 'widgets/order_detail_widgets_imports.dart';

part 'order_detail.dart';
part 'order_detail_controller.dart';
