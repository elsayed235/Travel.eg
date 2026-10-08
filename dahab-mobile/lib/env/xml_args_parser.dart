import 'dart:io';

import 'package:collection/collection.dart';
import 'package:flutter_tdd/core/extensions/string_helper_extension.dart';
import 'package:xml/xml.dart';

class XmlArgsParser {
  final String configFilePath;

  XmlArgsParser(this.configFilePath);

  Map<String, dynamic> getArgsMap() {
    final document = XmlDocument.parse(File(configFilePath).readAsStringSync());
    final String rowArgs = _getArgsAsString(document);

    final argsNamesWithValues = rowArgs.replaceAll('&quot;', '').split('--dart-define=');

    final Map<String, dynamic> argsAsMap = _convertArgsToMap(argsNamesWithValues);
    return argsAsMap;
  }

  Map<String, dynamic> _convertArgsToMap(List<String> argsNamesWithValues) {
    Map<String, dynamic> argsAsMap = {};
    for (var element in argsNamesWithValues) {
      final parts = element.replaceAll('--dart-define=', '').split('=');
      if (parts.first.trim().isNotBlank && parts.last.trim().isNotBlank) {
        argsAsMap.putIfAbsent(parts.first.trim(), () => parts.last.trim().replaceAll('"', ''));
      }
    }
    return argsAsMap;
  }

  String _getArgsAsString(XmlDocument document) {
    final attr = document.findAllElements('option').where((element) {
      final a = element.attributes.where((p0) {
        return p0.value.toString().startsWith('--dart-define');
      }).firstOrNull;
      return a != null;
    }).first;
    final rowArgs = attr.attributes.last.value;
    return rowArgs;
  }
}
