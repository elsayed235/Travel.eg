import 'package:injectable/injectable.dart';
import 'package:rehla/core/http/generic_http/api_names.dart';
import 'package:rehla/core/http/generic_http/generic_http.dart';
import 'package:rehla/core/http/models/http_request_model.dart';
import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/plan/data/models/programme_model/programme_model.dart';

import 'plan_remote_data_source.dart';

@Injectable(as: PlanRemoteDataSource)
class ImplPlanRemoteDataSource extends PlanRemoteDataSource {
  @override
  Future<MyResult<List<ProgrammeModel>>> getProgrammes() async {
    final model = HttpRequestModel(
      url: ApiNames.programmes,
      requestMethod: RequestMethod.get,
      responseType: ResType.list,
      responseKey: (data) => (data as Map<String, dynamic>)['programmes'],
      toJsonFunc: (json) =>
          List<ProgrammeModel>.from((json as List).map((e) => ProgrammeModel.fromJson(e as Map<String, dynamic>))),
    );
    return await GenericHttpImpl<List<ProgrammeModel>>()(model);
  }

  @override
  Future<MyResult<dynamic>> requestPlan(String message) async {
    final model = HttpRequestModel(
      url: ApiNames.supportMessages,
      requestMethod: RequestMethod.post,
      responseType: ResType.type,
      requestBody: {'category': 'plan_request', 'message': message},
    );
    return await GenericHttpImpl<dynamic>()(model);
  }
}
