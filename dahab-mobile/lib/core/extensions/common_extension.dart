
import 'dart:developer';

extension TextUtilsStringExtension on String? {
  /// Returns true if string is:
  /// - null
  /// - empty
  /// - whitespace string.
  /// - == "null"
  ///
  /// Characters considered "whitespace" are listed [here](https://stackoverflow.com/a/59826129/10830091).
  bool get isNullEmptyOrWhitespace {
    if (this == null) {
      return true;
    } else {
      return this!.isEmpty || this!.trim().isEmpty || this == "null";
    }
  }
}

extension ListUtilExtension on List? {
  /// Returns true if list is:
  /// - null
  /// - empty
  bool get isNullOrEmpty {
    return this == null || this!.isEmpty;
  }

  bool get isNetherNullNorEmpty {
    return !isNullOrEmpty;
  }
}

extension ListUpdate<T> on List<T> {
  List<T> update(int pos, T t) {
    List<T> list = [];
    try {
      list.add(t);
      replaceRange(pos, pos + 1, list);
      return this;
    } catch (e) {
      log("unable to update list");
      return this;
    }
  }
}
