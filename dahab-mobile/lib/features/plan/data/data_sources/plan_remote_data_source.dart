import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/plan/data/models/programme_model/programme_model.dart';

abstract class PlanRemoteDataSource {
  Future<MyResult<List<ProgrammeModel>>> getProgrammes();

  /// A plan request into the support queue (operations confirm it with local
  /// hosts while a destination's catalogue is early). Needs a session.
  Future<MyResult<dynamic>> requestPlan(String message);
}
