import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/helpers/firebase_analytics_helper.dart';
import 'package:flutter_tdd/core/helpers/general_providers.dart';
import 'package:flutter_tdd/core/routes/router_imports.dart';
import 'package:flutter_tdd/core/theme/themes/app_dark_theme.dart';
import 'package:flutter_tdd/core/theme/themes/app_light_theme.dart';
import 'package:flutter_tdd/core/widgets/network_layer/network_layer_widget.dart';
import 'package:flutter_tdd/core/widgets/theme_transition_host.dart';
import 'package:flutter_tdd/generated/l10n.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<StatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    getIt<FirebaseAnalyticsHelper>()
        .analytics
        .setConsent(adStorageConsentGranted: false, analyticsStorageConsentGranted: true);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final initialMode = context.read<DeviceCubit>().state.model.themeMode;
    return MultiBlocProvider(
      providers: GeneralProviders.instance.providers(context),
      child: ThemeTransitionHost(
        // Keep AdaptiveTheme mounted — remounting on DeviceCubit emits broke live swaps.
        child: AdaptiveTheme(
          light: AppLightTheme().theme,
          dark: AppDarkTheme().theme,
          initial: initialMode,
          builder: (theme, darkTheme) {
            return BlocBuilder<DeviceCubit, DeviceState>(
              buildWhen: (prev, next) =>
                  prev.model.locale != next.model.locale ||
                  prev.model.isNetworkConnected != next.model.isNetworkConnected,
              builder: (context, state) {
                return MaterialApp.router(
                  debugShowCheckedModeBanner: false,
                  title: 'دبّرها',
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
