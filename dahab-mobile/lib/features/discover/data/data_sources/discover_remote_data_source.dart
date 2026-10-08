import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/discover/data/models/conditions_model/conditions_model.dart';

abstract class DiscoverRemoteDataSource {
  Future<MyResult<ConditionsModel>> getConditions(String destination);
}
