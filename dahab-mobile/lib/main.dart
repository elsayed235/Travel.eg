import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_phoenix/flutter_phoenix.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/helpers/app_firebase.dart';
import 'package:rehla/core/helpers/device_settings.dart';
import 'package:rehla/core/helpers/global_notification.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/helpers/di.dart';
import 'core/routes/router_imports.dart';
import 'my_app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppFirebase.init();
  getIt.registerSingleton(SharedPreferences.getInstance());
  getIt.registerSingleton(AppRouter());
  await configureDependencies();
  if (AppFirebase.enabled) getIt<GlobalNotification>().setupNotification();

  final deviceCubit = DeviceCubit();
  await DeviceSettings.hydrate(deviceCubit);
  final destinationCubit = DestinationCubit(await DestinationCubit.hydrate());

  runApp(
    MultiBlocProvider(
      providers: [
        BlocProvider(create: (BuildContext context) => deviceCubit),
        BlocProvider(create: (BuildContext context) => destinationCubit),
      ],
      child: Phoenix(child: const MyApp()),
    ),
  );
}
