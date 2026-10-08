import 'dart:convert';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/routes/router_imports.gr.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';
import 'package:flutter_tdd/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'package:flutter_tdd/features/auth/presentation/manager/user_cubit/user_cubit.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Fake-first session: prefs + cubits. Networking can replace [signIn] later.
abstract class AuthSession {
  static const userKey = 'user';
  static const tokenKey = 'token';
  static const guestKey = 'guest_browse';

  static Future<void> hydrate(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    if (!context.mounted) return;
    final raw = prefs.getString(userKey);
    if (raw == null || raw.isEmpty) {
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
    await prefs.setBool(guestKey, false);
    if (!context.mounted) return;
    context.read<UserCubit>().onUpdateUserData(user);
    context.read<AuthCubit>().onUpdateAuth(true);
    context.read<DeviceCubit>().updateUserAuth(true);
  }

  /// Browse marketplace without an account.
  static Future<void> continueAsGuest(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(userKey);
    await prefs.remove(tokenKey);
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
    await prefs.setBool(guestKey, false);
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
