import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/core/widgets/CachedImage.dart';
import 'package:flutter_tdd/core/widgets/app_button.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/chat/domain/models/chat_domain_model.dart';
import 'package:flutter_tdd/features/chat/presentation/widgets/chat_order_avatar.dart';
import 'package:intl/intl.dart';

import '../../../../../../core/widgets/app_price.dart';

part 'build_message_bubble.dart';
part 'build_chat_composer.dart';
part 'build_chat_peer_header.dart';
part 'build_chat_date_chip.dart';
part 'build_chat_typing_bubble.dart';
part 'build_chat_reply_bar.dart';
part 'build_chat_attach_sheet.dart';
part 'build_chat_image_viewer.dart';
part 'build_chat_order_card.dart';
part 'build_chat_ai_assist.dart';
