import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/base_options_requester.dart';

class LocalOptionsRequester<T, S> extends BaseOptionsRequester<T, S> {
  LocalOptionsRequester({required super.optionMatcher, required List<T> options})
      : super(
            isRemotelySearch: false,
            immediatelyRequestOptions: true,
            fetcher: (searchTerm) async {
              return MyResult.isSuccess(options);
            });
}
