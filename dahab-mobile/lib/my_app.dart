import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rehla/core/bloc/destination_cubit/destination_cubit.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/helpers/app_firebase.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/helpers/firebase_analytics_helper.dart';
import 'package:rehla/core/helpers/general_providers.dart';
import 'package:rehla/core/routes/router_imports.dart';
import 'package:rehla/core/theme/themes/app_dark_theme.dart';
import 'package:rehla/core/theme/themes/app_light_theme.dart';
import 'package:rehla/core/widgets/network_layer/network_layer_widget.dart';
import 'package:rehla/core/widgets/theme_transition_host.dart';
import 'package:rehla/generated/l10n.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<StatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    if (AppFirebase.enabled) {
      getIt<FirebaseAnalyticsHelper>()
          .analytics
          .setConsent(adStorageConsentGranted: false, analyticsStorageConsentGranted: true);
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final initialMode = context.read<DeviceCubit>().state.model.themeMode;
    // Opens in the saved destination's palette; DestinationCubit.select swaps it live.
    final destination = context.read<DestinationCubit>().state;
    return MultiBlocProvider(
      providers: GeneralProviders.instance.providers(context),
      child: ThemeTransitionHost(
        // Keep AdaptiveTheme mounted — remounting on DeviceCubit emits broke live swaps.
        child: AdaptiveTheme(
          light: AppLightTheme(destination).theme,
          dark: AppDarkTheme(destination).theme,
          initial: initialMode,
          builder: (theme, darkTheme) {
            return BlocBuilder<DeviceCubit, DeviceState>(
              buildWhen: (prev, next) =>
                  prev.model.locale != next.model.locale ||
                  prev.model.isNetworkConnected != next.model.isNetworkConnected,
              builder: (context, state) {
                return MaterialApp.router(
                  debugShowCheckedModeBanner: false,
                  title: 'REHLA',
                  // AdaptiveTheme already resolves the active ThemeData into [theme].
                  // Force MaterialApp to use it so system brightness can't override.
                  theme: theme,
                  darkTheme: darkTheme,
                  themeMode: ThemeMode.light,
                  supportedLocales: S.delegate.supportedLocales,
                  locale: state.model.locale,
                  localizationsDelegates: const [
                    S.delegate,
                    DefaultCupertinoLocalizations.delegate,
                    GlobalMaterialLocalizations.delegate,
                    GlobalWidgetsLocalizations.delegate,
                    GlobalCupertinoLocalizations.delegate,
                  ],
                  routerDelegate: getIt.get<AppRouter>().delegate(navigatorObservers: () {
                    return [
                      if (AppFirebase.enabled)
                        FirebaseAnalyticsObserver(
                          analytics: getIt<FirebaseAnalyticsHelper>().analytics,
                        ),
                    ];
                  }),
                  routeInformationParser: getIt.get<AppRouter>().defaultRouteParser(),
                  builder: EasyLoading.init(builder: (ctx, child) {
                    ScreenUtil.init(ctx);
                    final isArabic = state.model.locale.languageCode == 'ar';
                    return Directionality(
                      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
                      child: NetworkLayerWidget(
                        isNetworkConnected: state.model.isNetworkConnected,
                        child: child!,
                      ),
                    );
                  }),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
