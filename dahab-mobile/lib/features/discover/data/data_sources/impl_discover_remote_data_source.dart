import 'package:injectable/injectable.dart';
import 'package:rehla/core/http/generic_http/api_names.dart';
import 'package:rehla/core/http/generic_http/generic_http.dart';
import 'package:rehla/core/http/models/http_request_model.dart';
import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/discover/data/models/conditions_model/conditions_model.dart';

import 'discover_remote_data_source.dart';

@Injectable(as: DiscoverRemoteDataSource)
class ImplDiscoverRemoteDataSource extends DiscoverRemoteDataSource {
  @override
  Future<MyResult<ConditionsModel>> getConditions(String destination) async {
    final model = HttpRequestModel(
      url: '${ApiNames.conditions}?d=$destination',
      requestMethod: RequestMethod.get,
      responseType: ResType.model,
      // 503 means "no reading right now": the strip just stays hidden.
      quiet: true,
      toJsonFunc: (json) => ConditionsModel.fromJson(json),
    );
    return await GenericHttpImpl<ConditionsModel>()(model);
  }
}
