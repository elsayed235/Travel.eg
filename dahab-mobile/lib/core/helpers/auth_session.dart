import 'dart:convert';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/constants/app_constants.dart';
import 'package:rehla/core/helpers/global_state.dart';
import 'package:rehla/core/routes/router_imports.gr.dart';
import 'package:rehla/features/auth/domain/models/user_domain_model.dart';
import 'package:rehla/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'package:rehla/features/auth/presentation/manager/user_cubit/user_cubit.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Session the website already uses: the traveler record plus the bearer
/// token native clients receive (`X-Dahab-Client: native`).
abstract class AuthSession {
  static const userKey = 'user';
  static const tokenKey = 'token';
  static const guestKey = 'guest_browse';

  static Future<void> hydrate(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    if (!context.mounted) return;
    final raw = prefs.getString(userKey);
    if (raw == null || raw.isEmpty) {
      _publishToken(null);
      context.read<AuthCubit>().onUpdateAuth(false);
      context.read<DeviceCubit>().updateUserAuth(false);
      return;
    }
    final user = _decode(raw);
    if (user == null) {
      await clear();
      if (!context.mounted) return;
      context.read<AuthCubit>().onUpdateAuth(false);
      context.read<DeviceCubit>().updateUserAuth(false);
      return;
    }
    if (!context.mounted) return;
    context.read<UserCubit>().onUpdateUserData(user);
    context.read<AuthCubit>().onUpdateAuth(true);
    context.read<DeviceCubit>().updateUserAuth(true);
    _publishToken(prefs.getString(tokenKey));
    await prefs.setBool(guestKey, false);
  }

  static bool isAuthorized(BuildContext context) {
    return context.read<AuthCubit>().state.authorized;
  }

  static Future<bool> hasPersistedSession() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(userKey);
    return raw != null && raw.isNotEmpty;
  }

  static Future<void> signIn(
    BuildContext context, {
    required UserDomainModel user,
    String token = 'fake-token',
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(userKey, _encode(user));
    await prefs.setString(tokenKey, token);
    _publishToken(token);
    await prefs.setBool(guestKey, false);
    if (!context.mounted) return;
    context.read<UserCubit>().onUpdateUserData(user);
    context.read<AuthCubit>().onUpdateAuth(true);
    context.read<DeviceCubit>().updateUserAuth(true);
  }

  /// Open the public home the way the website does before sign-in.
  static Future<void> continueAsGuest(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(userKey);
    await prefs.remove(tokenKey);
    _publishToken(null);
    await prefs.setBool(guestKey, true);
    if (!context.mounted) return;
    context.read<AuthCubit>().onUpdateAuth(false);
    context.read<DeviceCubit>().updateUserAuth(false);
  }

  static Future<void> signOut(BuildContext context) async {
    await clear();
    if (!context.mounted) return;
    context.read<AuthCubit>().onUpdateAuth(false);
    context.read<DeviceCubit>().updateUserAuth(false);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(userKey);
    await prefs.remove(tokenKey);
    _publishToken(null);
    await prefs.setBool(guestKey, false);
  }

  static void _publishToken(String? token) {
    GlobalState.instance.set(
      ApplicationConstants.keyToken,
      (token == null || token.isEmpty) ? null : token,
    );
  }

  /// After sign-in or sign-up: back to whatever asked for it (a booking, the
  /// account tab) when the app shell is underneath, otherwise into the shell.
  static Future<void> leaveAuth(BuildContext context) async {
    final router = AutoRouter.of(context);
    final shellBelow = router.stack.any((page) => page.name == HomeRoute.name);
    if (!shellBelow) {
      await router.replaceAll([const HomeRoute()]);
      return;
    }
    router.popUntil(
      (route) => route.settings.name != LoginRoute.name && route.settings.name != RegisterRoute.name,
    );
  }

  static Future<void> requireAuthThen(
    BuildContext context,
    Future<void> Function() action,
  ) async {
    if (!isAuthorized(context)) {
      await AutoRouter.of(context).push(const LoginRoute());
      return;
    }
    await action();
  }

  static UserDomainModel demoUser({
    String phone = '01012345678',
    String firstName = 'طارق',
    String lastName = 'فودة',
  }) {
    return UserDomainModel(
      id: 'u1',
      email: '',
      phone: phone,
      firstName: firstName,
      lastName: lastName,
    );
  }

  static String _encode(UserDomainModel user) {
    return jsonEncode({
      'id': user.id,
      'email': user.email,
      'phone': user.phone,
      'firstName': user.firstName,
      'lastName': user.lastName,
    });
  }

  static UserDomainModel? _decode(String raw) {
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return UserDomainModel(
        id: map['id'] as String? ?? 'u1',
        email: map['email'] as String? ?? '',
        phone: map['phone'] as String? ?? '',
        firstName: map['firstName'] as String? ?? '',
        lastName: map['lastName'] as String? ?? '',
      );
    } catch (_) {
      return null;
    }
  }
}
