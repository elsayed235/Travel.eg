import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/helpers/auth_session.dart';
import 'package:flutter_tdd/core/helpers/speech_input_service.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/core/widgets/app_category_item.dart';
import 'package:flutter_tdd/features/ai/data/repositories/ai_repository_provider.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/ai/domain/repositories/ai_repository.dart';
import 'package:flutter_tdd/features/ai/domain/services/ai_tracker.dart';
import 'package:flutter_tdd/features/search/domain/models/explore_domain_model.dart';
import 'package:flutter_tdd/features/search/domain/requesters/explore_requester.dart';

part 'explore_controller.dart';
