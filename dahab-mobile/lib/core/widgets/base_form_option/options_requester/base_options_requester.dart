import 'dart:async';

import 'package:flutter_tdd/core/extensions/common_extension.dart';
import 'package:flutter_tdd/core/extensions/string_helper_extension.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_matchers/option_matcher.dart';
import 'package:get/get_rx/src/rx_workers/utils/debouncer.dart';

class BaseOptionsRequester<T, S> extends Requester<List<T>> {
  final Future<MyResult<List<T>>> Function(S? searchParams) fetcher;
  final bool immediatelyRequestOptions;
  final OptionMatcher<T, S> optionMatcher;
  final bool isRemotelySearch;
  List<T>? optionsRepository;
  S? _searchParam;
  final Debouncer _debouncer = Debouncer();

  bool _isSearchApplied = false;

  bool get isSearchApplied => (_searchParam != null && _searchParam != '') || _isSearchApplied;

  set isSearchApplied(bool value) {
    _isSearchApplied = value;
  }

  BaseOptionsRequester(
      {required this.isRemotelySearch,
      required this.immediatelyRequestOptions,
      required this.optionMatcher,
      required this.fetcher}) {
    if (immediatelyRequestOptions) {
      request();
    }
  }

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await fetcher(_searchParam);
    result.when(isSuccess: (items) {
      /// Set Options Repository if not set.
      optionsRepository ??= items ?? [];

      /// any received items in new search should be added to options repository
      optionsRepository = <dynamic>{...optionsRepository!, ...items ?? []}.whereType<T>().toList();

      /// In case of remotely search we have already options from local search,
      /// we need the following step to remove duplicated options and make sure the local results
      /// will display firstly for a better user experience
      List<T> handledItems = <dynamic>{...data ?? [], ...items ?? []}.whereType<T>().toList();
      successState(handledItems);
    }, isError: (error) {
      failedState(error, request);
    });
  }

  void emitLastData() {
    successState(data ?? []);
  }

  void resetOptionsWithSelected(List<T>? selected) {
    if (selected.isNullOrEmpty) return;
    List<T>? selectedNotIncluded;
    if (optionsRepository != null) {
      selectedNotIncluded =
          selected!.where((element) => !optionsRepository!.contains(element)).toList();
    }
    successState([...selectedNotIncluded ?? [], ...optionsRepository ?? []]);
  }

  Future<List<T>> get options async {
    await requestIfNoDataAndWaitIfLoading();
    return optionsRepository ?? [];
  }

  Future<void> search(S? searchTerm) async {
    _isSearchApplied = searchTerm != null;
    if (isRemotelySearch) {
      _searchRemotely(searchTerm);
    } else {
      _searchLocally(searchTerm: searchTerm);
    }
  }

  void _searchRemotely(S? searchTerm) {
    _searchLocally(searchTerm: searchTerm, isWaitingRemotely: true);
    _searchParam = searchTerm;
    if (searchTerm == null) {
      _debouncer.cancel();
      _searchParam = null;
      successState(optionsRepository!);
    } else {
      _debouncer.call(() {
        request();
      });
    }
  }

  void _searchLocally({S? searchTerm, bool? isWaitingRemotely}) {
    if (optionsRepository == null) {
      successState([]);
      return;
    }
    if (searchTerm == null) {
      successState(optionsRepository!);
      return;
    }
    List<T> searchedEntries = [];
    for (var element in optionsRepository!) {
      if (optionMatcher.match(element, searchTerm, optionsRepository!)) {
        searchedEntries.add(element);
      }
    }
    successState(searchedEntries, isWaitingRemotely ?? false);
  }

  void addOptionLocally(T option) {
    optionsRepository?.insert(0, option);
    successState(optionsRepository ?? []);
  }

  void searchByText(String value) {
    if (isRemotelySearch) {
      _searchRemotely(optionMatcher.stringToSearchParam(value));
    } else {
      _searchByStringLocally(value);
    }
  }

  void _searchByStringLocally(String searchTerm) {
    _isSearchApplied = searchTerm.isNotEmpty;
    if (searchTerm.isBlank) {
      successState(optionsRepository!);
      return;
    }
    List<T> searchedEntries = [];
    for (var element in optionsRepository!) {
      if (optionMatcher.matchText(element, searchTerm, optionsRepository!)) {
        searchedEntries.add(element);
      }
    }
    successState(searchedEntries, false);
  }

  @override
  void clear() {
    optionsRepository = null;
    _searchParam = null;
    _isSearchApplied = false;
    super.clear();
  }
}
