// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes

import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:rehla/core/helpers/file_service.dart' as _i780;
import 'package:rehla/core/helpers/firebase_analytics_helper.dart' as _i83;
import 'package:rehla/core/helpers/global_context.dart' as _i160;
import 'package:rehla/core/helpers/global_notification.dart' as _i412;
import 'package:rehla/core/helpers/loading_helper.dart' as _i1013;
import 'package:rehla/core/helpers/location_service.dart' as _i659;
import 'package:rehla/core/helpers/psermission_services.dart' as _i450;
import 'package:rehla/core/helpers/share_services.dart' as _i1061;
import 'package:rehla/core/helpers/utilities.dart' as _i568;
import 'package:rehla/core/http/dio_helper/actions/delete.dart' as _i672;
import 'package:rehla/core/http/dio_helper/actions/get.dart' as _i605;
import 'package:rehla/core/http/dio_helper/actions/patch.dart' as _i804;
import 'package:rehla/core/http/dio_helper/actions/post.dart' as _i1014;
import 'package:rehla/core/http/dio_helper/actions/put.dart' as _i220;
import 'package:rehla/core/http/dio_helper/utils/dio_header.dart' as _i694;
import 'package:rehla/core/http/dio_helper/utils/dio_options.dart' as _i320;
import 'package:rehla/core/http/dio_helper/utils/handle_errors.dart' as _i790;
import 'package:rehla/core/http/dio_helper/utils/handle_json_response.dart'
    as _i1000;
import 'package:rehla/core/http/dio_helper/utils/handle_request_body.dart'
    as _i199;
import 'package:rehla/core/http/generic_http/generic_http.dart' as _i185;
import 'package:rehla/core/network/network_info.dart' as _i455;
import 'package:rehla/features/discover/data/data_sources/discover_remote_data_source.dart'
    as _i130;
import 'package:rehla/features/discover/data/data_sources/impl_discover_remote_data_source.dart'
    as _i644;
import 'package:rehla/features/discover/data/repositories/impl_discover_repository.dart'
    as _i73;
import 'package:rehla/features/discover/domain/repositories/discover_repository.dart'
    as _i329;
import 'package:rehla/features/plan/data/data_sources/impl_plan_remote_data_source.dart'
    as _i1025;
import 'package:rehla/features/plan/data/data_sources/plan_remote_data_source.dart'
    as _i58;
import 'package:rehla/features/plan/data/repositories/impl_plan_repository.dart'
    as _i521;
import 'package:rehla/features/plan/domain/repositories/plan_repository.dart'
    as _i424;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.factory<_i659.LocationService>(() => _i659.LocationService());
    gh.factory<_i1061.ShareServices>(() => _i1061.ShareServices());
    gh.factory<_i780.AppFileService>(() => _i780.AppFileService());
    gh.factory<_i450.PermissionServices>(() => _i450.PermissionServices());
    gh.singleton<_i1013.LoadingHelper>(() => _i1013.LoadingHelper());
    gh.lazySingleton<_i455.NetworkInfoImpl>(() => _i455.NetworkInfoImpl());
    gh.lazySingleton<_i320.DioOptions>(() => _i320.DioOptions());
    gh.lazySingleton<_i790.HandleErrors>(() => _i790.HandleErrors());
    gh.lazySingleton<_i199.HandleRequestBody>(() => _i199.HandleRequestBody());
    gh.lazySingleton<_i1000.HandleJsonResponse<dynamic>>(
      () => _i1000.HandleJsonResponse<dynamic>(),
    );
    gh.lazySingleton<_i694.DioHeader>(() => _i694.DioHeader());
    gh.lazySingleton<_i804.Patch>(() => _i804.Patch());
    gh.lazySingleton<_i1014.Post>(() => _i1014.Post());
    gh.lazySingleton<_i672.Delete>(() => _i672.Delete());
    gh.lazySingleton<_i605.Get>(() => _i605.Get());
    gh.lazySingleton<_i220.Put>(() => _i220.Put());
    gh.lazySingleton<_i185.GenericHttpImpl<dynamic>>(
      () => _i185.GenericHttpImpl<dynamic>(),
    );
    gh.lazySingleton<_i160.GlobalContext>(() => _i160.GlobalContext());
    gh.lazySingleton<_i412.GlobalNotification>(
      () => _i412.GlobalNotification(),
    );
    gh.lazySingleton<_i568.Utilities>(() => _i568.Utilities());
    gh.lazySingleton<_i83.FirebaseAnalyticsHelper>(
      () => _i83.FirebaseAnalyticsHelper(),
    );
    gh.factory<_i329.DiscoverRepository>(() => _i73.ImplDiscoverRepository());
    gh.factory<_i130.DiscoverRemoteDataSource>(
      () => _i644.ImplDiscoverRemoteDataSource(),
    );
    gh.factory<_i58.PlanRemoteDataSource>(
      () => _i1025.ImplPlanRemoteDataSource(),
    );
    gh.factory<_i424.PlanRepository>(() => _i521.ImplPlanRepository());
    return this;
  }
}
