import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_matchers/option_matcher.dart';

class StringOptionMatcher<T> extends OptionMatcher<T, String> {
  final String? Function(T option) stringGetter;

  StringOptionMatcher({required this.stringGetter});

  @override
  bool match(T option, String? searchParams, List<T> allOptions) {
    return stringGetter(option)?.contains(searchParams?.toLowerCase() ?? '') ?? true;
  }

  @override
  bool matchText(T option, String? searchParams, List<T> allOptions) {
    return match(option, searchParams, allOptions);
  }

  @override
  String? stringToSearchParam(String? str) {
    return str;
  }
}
