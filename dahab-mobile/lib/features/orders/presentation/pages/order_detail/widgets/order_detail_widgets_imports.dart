import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/core/widgets/CachedImage.dart';
import 'package:flutter_tdd/core/widgets/GenericTextField.dart';
import 'package:flutter_tdd/core/widgets/app_button.dart';
import 'package:flutter_tdd/core/widgets/app_chip.dart';
import 'package:flutter_tdd/features/orders/domain/models/order_domain_model.dart';
import 'package:intl/intl.dart';

part 'build_order_summary_card.dart';
part 'build_confirmation_code.dart';
part 'build_enter_confirmation_code.dart';
part 'build_order_status_actions.dart';
part 'build_order_timeline.dart';
part 'build_request_lifecycle_strip.dart';
part 'build_handover_ritual.dart';
