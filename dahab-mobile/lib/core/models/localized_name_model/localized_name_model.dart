import 'package:collection/collection.dart';
import 'package:flutter_tdd/core/constants/app_config.dart';

/// how to use ?
/// @JsonKey(name: "name", ) required final LocalizedNameModel localizedName,
class LocalizedNameModel {
  final dynamic jsonValue;

  const LocalizedNameModel([this.jsonValue]);

  factory LocalizedNameModel.empty() {
    return const LocalizedNameModel();
  }

  factory LocalizedNameModel.fromString(String? str) {
    final contentJson = {AppConfig.instance.defaultLanguage: str};
    contentJson.putIfAbsent(AppConfig.instance.defaultLanguage, () => str);
    return LocalizedNameModel(contentJson);
  }


  factory LocalizedNameModel.fromJson(json) {
    return LocalizedNameModel(json);
  }

  Map<String, String> toJson() {
    if (jsonValue is Map) {
      return ((jsonValue ?? <String, String>{}) as Map).cast<String, String>();
    } else {
      return <String, String>{};
    }
  }

  String? getStringByLangCode(String langCode) {
    if (jsonValue is Map) {
      // ignore: avoid_dynamic_calls
      return jsonValue[langCode];
    }
    return null;
  }
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LocalizedNameModel &&
          runtimeType == other.runtimeType &&
          () {
            if (jsonValue is Map && other.jsonValue is Map) {
              return const DeepCollectionEquality().equals(jsonValue, other.jsonValue);
            } else {
              return jsonValue == other.jsonValue;
            }
          }();

  @override
  int get hashCode => jsonValue.hashCode;


}

LocalizedNameModel localizedNameModelFromJson(dynamic json) {
  return LocalizedNameModel(json);
}

Map<String, dynamic>? localizedNameModelToJson(LocalizedNameModel? map) {
  if (map == null) return null;
  return map.jsonValue;
}
