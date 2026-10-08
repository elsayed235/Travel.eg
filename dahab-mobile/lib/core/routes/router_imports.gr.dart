// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouterGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes

import 'package:auto_route/auto_route.dart' as _i13;
import 'package:flutter/material.dart' as _i14;
import 'package:rehla/features/account/presentation/pages/account_help/account_help_imports.dart'
    as _i1;
import 'package:rehla/features/account/presentation/pages/account_notifications/account_notifications_imports.dart'
    as _i2;
import 'package:rehla/features/account/presentation/pages/account_privacy/account_privacy_imports.dart'
    as _i3;
import 'package:rehla/features/account/presentation/pages/edit_profile/edit_profile_imports.dart'
    as _i5;
import 'package:rehla/features/auth/presentation/pages/active_account/active_account_imports.dart'
    as _i4;
import 'package:rehla/features/auth/presentation/pages/forget_password/forget_password_imports.dart'
    as _i6;
import 'package:rehla/features/auth/presentation/pages/login/login_imports.dart'
    as _i8;
import 'package:rehla/features/auth/presentation/pages/register/register_imports.dart'
    as _i9;
import 'package:rehla/features/auth/presentation/pages/reset_password/reset_password_imports.dart'
    as _i10;
import 'package:rehla/features/auth/presentation/pages/splash/splash_imports.dart'
    as _i11;
import 'package:rehla/features/base/presentation/pages/home/home_imports.dart'
    as _i7;
import 'package:rehla/features/general/presentation/pages/terms/terms_imports.dart'
    as _i12;

/// generated route for
/// [_i1.AccountHelp]
class AccountHelpRoute extends _i13.PageRouteInfo<void> {
  const AccountHelpRoute({List<_i13.PageRouteInfo>? children})
    : super(AccountHelpRoute.name, initialChildren: children);

  static const String name = 'AccountHelpRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i1.AccountHelp();
    },
  );
}

/// generated route for
/// [_i2.AccountNotifications]
class AccountNotificationsRoute extends _i13.PageRouteInfo<void> {
  const AccountNotificationsRoute({List<_i13.PageRouteInfo>? children})
    : super(AccountNotificationsRoute.name, initialChildren: children);

  static const String name = 'AccountNotificationsRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i2.AccountNotifications();
    },
  );
}

/// generated route for
/// [_i3.AccountPrivacy]
class AccountPrivacyRoute extends _i13.PageRouteInfo<void> {
  const AccountPrivacyRoute({List<_i13.PageRouteInfo>? children})
    : super(AccountPrivacyRoute.name, initialChildren: children);

  static const String name = 'AccountPrivacyRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i3.AccountPrivacy();
    },
  );
}

/// generated route for
/// [_i4.ActiveAccount]
class ActiveAccountRoute extends _i13.PageRouteInfo<ActiveAccountRouteArgs> {
  ActiveAccountRoute({
    _i14.Key? key,
    String? phone,
    bool isRegister = false,
    String? fullName,
    List<_i13.PageRouteInfo>? children,
  }) : super(
         ActiveAccountRoute.name,
         args: ActiveAccountRouteArgs(
           key: key,
           phone: phone,
           isRegister: isRegister,
           fullName: fullName,
         ),
         initialChildren: children,
       );

  static const String name = 'ActiveAccountRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      final args = data.argsAs<ActiveAccountRouteArgs>(
        orElse: () => const ActiveAccountRouteArgs(),
      );
      return _i4.ActiveAccount(
        key: args.key,
        phone: args.phone,
        isRegister: args.isRegister,
        fullName: args.fullName,
      );
    },
  );
}

class ActiveAccountRouteArgs {
  const ActiveAccountRouteArgs({
    this.key,
    this.phone,
    this.isRegister = false,
    this.fullName,
  });

  final _i14.Key? key;

  final String? phone;

  final bool isRegister;

  final String? fullName;

  @override
  String toString() {
    return 'ActiveAccountRouteArgs{key: $key, phone: $phone, isRegister: $isRegister, fullName: $fullName}';
  }
}

/// generated route for
/// [_i5.EditProfile]
class EditProfileRoute extends _i13.PageRouteInfo<void> {
  const EditProfileRoute({List<_i13.PageRouteInfo>? children})
    : super(EditProfileRoute.name, initialChildren: children);

  static const String name = 'EditProfileRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i5.EditProfile();
    },
  );
}

/// generated route for
/// [_i6.ForgetPassword]
class ForgetPasswordRoute extends _i13.PageRouteInfo<void> {
  const ForgetPasswordRoute({List<_i13.PageRouteInfo>? children})
    : super(ForgetPasswordRoute.name, initialChildren: children);

  static const String name = 'ForgetPasswordRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i6.ForgetPassword();
    },
  );
}

/// generated route for
/// [_i7.Home]
class HomeRoute extends _i13.PageRouteInfo<void> {
  const HomeRoute({List<_i13.PageRouteInfo>? children})
    : super(HomeRoute.name, initialChildren: children);

  static const String name = 'HomeRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i7.Home();
    },
  );
}

/// generated route for
/// [_i8.Login]
class LoginRoute extends _i13.PageRouteInfo<void> {
  const LoginRoute({List<_i13.PageRouteInfo>? children})
    : super(LoginRoute.name, initialChildren: children);

  static const String name = 'LoginRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i8.Login();
    },
  );
}

/// generated route for
/// [_i9.Register]
class RegisterRoute extends _i13.PageRouteInfo<void> {
  const RegisterRoute({List<_i13.PageRouteInfo>? children})
    : super(RegisterRoute.name, initialChildren: children);

  static const String name = 'RegisterRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i9.Register();
    },
  );
}

/// generated route for
/// [_i10.ResetPassword]
class ResetPasswordRoute extends _i13.PageRouteInfo<void> {
  const ResetPasswordRoute({List<_i13.PageRouteInfo>? children})
    : super(ResetPasswordRoute.name, initialChildren: children);

  static const String name = 'ResetPasswordRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i10.ResetPassword();
    },
  );
}

/// generated route for
/// [_i11.Splash]
class SplashRoute extends _i13.PageRouteInfo<void> {
  const SplashRoute({List<_i13.PageRouteInfo>? children})
    : super(SplashRoute.name, initialChildren: children);

  static const String name = 'SplashRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i11.Splash();
    },
  );
}

/// generated route for
/// [_i12.Terms]
class TermsRoute extends _i13.PageRouteInfo<void> {
  const TermsRoute({List<_i13.PageRouteInfo>? children})
    : super(TermsRoute.name, initialChildren: children);

  static const String name = 'TermsRoute';

  static _i13.PageInfo page = _i13.PageInfo(
    name,
    builder: (data) {
      return const _i12.Terms();
    },
  );
}
