import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/discover/domain/models/conditions_domain_model.dart';

abstract class DiscoverRepository {
  Future<MyResult<ConditionsDomainModel>> getConditions(RehlaDestination destination);
}
