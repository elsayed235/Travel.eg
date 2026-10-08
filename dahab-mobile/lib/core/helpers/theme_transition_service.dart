import 'package:flutter/material.dart';

/// Coordinates smooth theme transitions.
/// The toggle calls [transition] which covers the screen, changes the theme
/// underneath, then fades the cover out — so the user never sees a hard cut.
class ThemeTransitionService {
  ThemeTransitionService._();
  static final instance = ThemeTransitionService._();

  Future<void> Function(Color coverColor, VoidCallback changeTheme)? _handler;
  bool _busy = false;

  void setHandler(Future<void> Function(Color, VoidCallback) handler) {
    _handler = handler;
  }

  void clearHandler() {
    _handler = null;
  }

  Future<void> transition(Color coverColor, VoidCallback changeTheme) async {
    if (_busy || _handler == null) {
      changeTheme();
      return;
    }
    _busy = true;
    try {
      await _handler!(coverColor, changeTheme);
    } finally {
      _busy = false;
    }
  }
}
