part of 'router_imports.dart';

@AutoRouterConfig(replaceInRouteName: r'$,Route')
class AppRouter extends RootStackRouter {
  @override
  List<AutoRoute> get routes => [
        AdaptiveRoute(page: SplashRoute.page, initial: true),
        AdaptiveRoute(page: LoginRoute.page),
        AdaptiveRoute(page: RegisterRoute.page),
        AdaptiveRoute(page: ActiveAccountRoute.page),
        AdaptiveRoute(page: ResetPasswordRoute.page),
        AdaptiveRoute(page: ForgetPasswordRoute.page),
        AdaptiveRoute(page: TermsRoute.page),
        AutoRoute(page: HomeRoute.page),
        ...baseRoute
      ];
}
