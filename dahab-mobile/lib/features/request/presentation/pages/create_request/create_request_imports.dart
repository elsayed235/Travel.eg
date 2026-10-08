import 'dart:io';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/helpers/file_service.dart';
import 'package:flutter_tdd/core/helpers/location_service.dart';
import 'package:flutter_tdd/core/helpers/speech_input_service.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/requester/consumer/requester_consumer.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/core/widgets/shimmers/app_screen_shimmer.dart';
import 'package:flutter_tdd/features/ai/data/repositories/ai_repository_provider.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/ai/domain/repositories/ai_repository.dart';
import 'package:flutter_tdd/features/ai/domain/services/ai_tracker.dart';
import 'package:flutter_tdd/features/auth/presentation/manager/user_cubit/user_cubit.dart';
import 'package:flutter_tdd/features/request/domain/models/create_request_domain_model.dart';
import 'package:flutter_tdd/features/request/domain/models/pick_location_result.dart';
import 'package:flutter_tdd/features/request/domain/requesters/create_request_preview_requester.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';

import 'widgets/create_request_widgets_imports.dart';

part 'create_request.dart';
part 'create_request_controller.dart';
