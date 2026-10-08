import 'package:collection/collection.dart';
import 'package:flutter_tdd/core/extensions/common_extension.dart';
import 'package:flutter_tdd/generated/l10n.dart';

abstract class CollectionHelper {
  /// check two collections (Map, List) are equal or not ignoring ordering.
  static bool isEqual(Object? e1, Object? e2) {
    var equalChecker = const DeepCollectionEquality.unordered().equals;
    return equalChecker(e1, e2);
  }

  static bool isNotIdenticalOptionsList<T>(
      {List<T>? incomingSelectedItems,
      List<T>? currentSelectedItems,
      required String? Function(T?) valueIdGetter}) {
    if (incomingSelectedItems.isNullOrEmpty && currentSelectedItems.isNetherNullNorEmpty) {
      return true;
    }
    List<String> widgetSelectedItemsIds =
        incomingSelectedItems?.map((e) => valueIdGetter(e)).whereType<String>().toList() ?? [];
    List<String> optionControllerSelectedItemsIds =
        currentSelectedItems?.map((e) => valueIdGetter(e)).whereType<String>().toList() ?? [];
    if (widgetSelectedItemsIds.length == optionControllerSelectedItemsIds.length &&
        widgetSelectedItemsIds
            .every((element) => optionControllerSelectedItemsIds.contains(element))) {
      return false;
    }
    return true;
  }

  /// This method will return a new map without null values
  ///
  /// Example:
  /// ```json
  /// {a: 1, b: null, c: 3}
  /// ```
  /// will be converted to
  /// ```json
  /// {a: 1, c: 3}
  /// ```
  /// Example 2:
  /// ```json
  /// {"a": 1, "b": "", "c": null}
  /// ```
  /// will be converted to
  /// ```json
  /// {"a": 1}
  /// ```
  /// Example 3:
  /// ```json
  /// {"a": 1, "b": [], "c": [null], "d": [null, null], "e": [1, null]}
  /// ```
  /// will be converted to
  /// ```json
  /// {"a": 1, "e": [1, null]}
  static Map<String, dynamic>? getMapWithoutNullOrEmptyValues(Map<dynamic, dynamic>? map) {
    if (map == null) {
      return null;
    }
    final result = <String, dynamic>{};
    map.forEach((key, value) {
      if (value is Map) {
        final nestedMap = getMapWithoutNullOrEmptyValues(value);
        if (nestedMap != null) {
          result[key.toString()] = nestedMap;
        }
      } else if (value is List) {
        if (value.any((element) => element != null)) {
          result[key.toString()] = value;
        }
      } else if (value is String) {
        if (value.isNotEmpty) {
          result[key.toString()] = value;
        }
      } else if (value != null) {
        result[key.toString()] = value;
      }
    });
    return result;
  }

  /// This method will return a new map without nested json objects
  ///
  /// Example:
  /// ```json
  /// {
  /// "someKey":
  ///   {"ar": "someArValue",
  ///   "en": "someEnValue"
  ///   }
  /// }
  /// ```
  /// will be converted to
  /// ```json
  /// {
  /// "someKey.ar": "someArValue",
  /// "someKey.en": "someEnValue"
  /// }
  /// ```
  ///
  /// Example 2:
  /// ```json
  /// {"someKey":
  ///  {"ar": {"ar1": "someArValue1", "ar2": "someArValue2"},
  ///   "en": {"en1": "someEnValue1", "en2": "someEnValue2"}
  /// }
  /// ```
  /// will be converted to
  /// ```json
  /// {
  /// "someKey.ar.ar1": "someArValue1",
  /// "someKey.ar.ar2": "someArValue2",
  /// "someKey.en.en1": "someEnValue1",
  /// "someKey.en.en2": "someEnValue2"
  /// }
  /// ```
  static Map<String, dynamic>? flattenNestedJson(Map<dynamic, dynamic>? map,
      [bool ignoreLocalizedCase = false]) {
    final supportedLanguages = S.delegate.supportedLocales.map((e) => e.languageCode).toList();
    bool isLocalizedCase(Map map) {
      var keys = map.keys;
      for (var e in keys) {
        if (supportedLanguages.contains(e) == false) {
          return false;
        }
      }
      return true;
    }

    bool isAllowedLocalizedCase(Map map) {
      if (ignoreLocalizedCase == false) {
        return true;
      } else {
        return isLocalizedCase(map) == false;
      }
    }

    if (map == null) {
      return null;
    }
    final result = <String, dynamic>{};
    map.forEach((key, value) {
      if (value is Map && isAllowedLocalizedCase(value)) {
        final nestedMap = flattenNestedJson(value);
        if (nestedMap != null) {
          nestedMap.forEach((nestedKey, nestedValue) {
            result['$key.$nestedKey'] = nestedValue;
          });
        }
      } else {
        result[key.toString()] = value;
      }
    });
    return result;
  }

  static Map<String, dynamic>? deflattenJson(Map<dynamic, dynamic>? map) {
    if (map == null) {
      return null;
    }
    final result = <String, dynamic>{};
    map.forEach((key, value) {
      final splitKeys = key.toString().split('.');
      if (splitKeys.length >= 2) {
        final mainKey = splitKeys.first;
        splitKeys.removeAt(0);
        final nestedKey = splitKeys.join('.');
        final aggregatedJson = deflattenJson({nestedKey: value});
        if (result.containsKey(mainKey)) {
          (result[mainKey] as Map).addAll(aggregatedJson!);
        } else {
          result[mainKey] = aggregatedJson;
        }
      } else {
        result[key.toString()] = value;
      }
    });
    return result;
  }

  static bool isEmptyJson(Object? json) {
    if (json == null) {
      return true;
    }
    if (json is Map) {
      return json.isEmpty;
    }
    if (json is List) {
      return json.isEmpty;
    }
    return false;
  }

}
