import 'package:rehla/core/localization/translate.dart';

extension Validator on String {

  String? noValidate() {
    return null;
  }

  String? validateEmpty({String? message}) {
    if (trim().isEmpty) {
      return message ?? Translate.s.fillField;
    }
    return null;
  }

  String? validateName({String? message}) {
    if (trim().isEmpty) {
      return message ??  Translate.s.fillField;
    }else if(length<8 || length>30){
      return  message ??  Translate.s.nameValidation;
    }
    return null;
  }


  String? validatePassword({String? message}) {
    if (trim().isEmpty) {
      return message ??  Translate.s.fillField;
    } else if (!RegExp(
        r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$')
        .hasMatch(this)) {
      return message ?? Translate.s.passValidation;
    }
    return null;
  }

  /// One sign-in field: an address, or a mobile number.
  String? validateEmailOrPhone() {
    if (trim().isEmpty) return Translate.s.fillField;
    if (contains('@')) return validateEmail();
    return validatePhone();
  }

  String? validateEmail({String? message}) {
    if (trim().isEmpty) {
      return message ??  Translate.s.fillField;
    } else if (!RegExp(
        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
        .hasMatch(this)) {
      return message ?? Translate.s.mailValidation;
    }
    return null;
  }

  String? validateEmailORNull({String? message}) {
    if (trim().isNotEmpty) {
      if (!RegExp(
          r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
          .hasMatch(this)) {
        return message ?? Translate.s.mailValidation;
      }
    }
    return null;
  }

  String? validatePhone({String? message}) {
    if (trim().isEmpty) {
      return message ??  Translate.s.fillField;
    } else if (!RegExp(
        r'(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)')
        .hasMatch(this) ||
        length < 10) {
      return message ??Translate.s.phoneValidation;
    }
    return null;
  }

  String? validatePhoneOrNull({String? message}) {
    if (trim().isEmpty) {
      return null;
    } else if (!RegExp(
        r'(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)')
        .hasMatch(this) ||
        length < 10) {
      return message ?? Translate.s.phoneValidation;
    }
    return null;
  }

  String? validatePasswordConfirm({required String pass, String? message}) {
    if (trim().isEmpty) {
      return message ??  Translate.s.fillField;
    } else if (this != pass) {
      return message ?? Translate.s.confirmValidation;
    }
    return null;
  }
}

String? validateDropDown( dynamic model,{String? message}) {
  if (model == null) {
    return message ??  Translate.s.fillField;
  }
  return null;
}

extension NullableStringValidator on String? {
  String? validateEmpty({String? message}) {
    if (this == null || this!.trim().isEmpty) {
      return message ?? Translate.s.fillField;
    }
    return null;
  }

  String? validateDescription({String? message}) {
    final value = this?.trim() ?? '';
    if (value.isEmpty) {
      return message ?? Translate.s.create_request_err_description;
    }
    if (value.length < 8) {
      return message ?? Translate.s.create_request_err_description_short;
    }
    return null;
  }

  String? validateQuantity({String? message}) {
    final raw = this?.trim() ?? '';
    if (raw.isEmpty) {
      return message ?? Translate.s.create_request_err_quantity;
    }
    final parsed = int.tryParse(raw.replaceAll(RegExp(r'[^\d]'), ''));
    if (parsed == null || parsed < 1) {
      return message ?? Translate.s.create_request_err_quantity;
    }
    return null;
  }

  String? validateBudget({String? message}) {
    final raw = this?.trim() ?? '';
    if (raw.isEmpty) {
      return message ?? Translate.s.create_request_err_budget;
    }
    final parsed = num.tryParse(raw.replaceAll(RegExp(r'[^\d.]'), ''));
    if (parsed == null || parsed <= 0) {
      return message ?? Translate.s.create_request_err_budget;
    }
    return null;
  }

  String? validatePercent({String? message}) {
    final raw = this?.trim() ?? '';
    if (raw.isEmpty) {
      return message ?? Translate.s.create_request_err_percent;
    }
    final parsed = double.tryParse(raw.replaceAll(RegExp(r'[^\d.]'), ''));
    if (parsed == null || parsed < 0 || parsed > 100) {
      return message ?? Translate.s.create_request_err_percent;
    }
    return null;
  }
}
