import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'package:rehla/features/auth/presentation/manager/user_cubit/user_cubit.dart';

class GeneralProviders {
  GeneralProviders._();

  static GeneralProviders instance = GeneralProviders._();

  List<BlocProvider> providers(BuildContext context) => [
        BlocProvider<AuthCubit>(
          create: (BuildContext context) => AuthCubit(),
        ),
        BlocProvider.value(
          value: context.read<DeviceCubit>(),
        ),
        BlocProvider.value(
          value: context.read<DestinationCubit>(),
        ),
        BlocProvider<UserCubit>(
          create: (BuildContext context) => UserCubit(),
        ),
      ];
}
