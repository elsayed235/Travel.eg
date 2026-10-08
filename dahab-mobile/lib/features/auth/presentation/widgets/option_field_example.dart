import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/base_form_option.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/base_options_display_widget.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/local_options_requester.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_matchers/string_option_matcher.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';

class OptionFieldExample extends StatefulWidget {
  const OptionFieldExample({super.key});

  @override
  State<OptionFieldExample> createState() => _OptionFieldExampleState();
}

class _OptionFieldExampleState extends State<OptionFieldExample> {
  List<UserDomainModel> selectedUsers = [];

  @override
  Widget build(BuildContext context) {
    return BaseFormOption<UserDomainModel, String>(
      hintText: Translate.of(context).failureActions,
      bottomSheetTitle: Translate.of(context).failureActions,
      showSearch: false,
      isMultiple: false,
      showDecoration: true,
      optionsRequester: LocalOptionsRequester(
        options: _getOptions(),
        optionMatcher: StringOptionMatcher(stringGetter: (option) => option.id),
      ),
      selectedItems: selectedUsers,
      selectedOptionBuilder: (actions) {
        return BaseOptionsDisplayWidget<UserDomainModel>(
          titleGetter: (value) => value.firstName,
          selectedOptions: actions,
        );
      },
      valueIdGetter: (value) => value?.id,
      valueMainTitleGetter: (value) => value?.firstName,
      onSaveValue: (actions, iMultiple) {
        setState(() {
          selectedUsers = actions ?? [];
        });
      },
      onClearPressed: () {
        setState(() {
          selectedUsers = [];
        });
      },
    );
  }

  List<UserDomainModel> _getOptions() => [
        UserDomainModel(email: "", firstName: "tarek", id: "1", lastName: "", phone: ""),
        UserDomainModel(email: "", firstName: "fouda", id: "2", lastName: "", phone: ""),
      ];
}
