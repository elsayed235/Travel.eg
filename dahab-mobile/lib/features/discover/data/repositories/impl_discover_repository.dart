import 'package:injectable/injectable.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/core/models/model_to_domain/model_to_domain.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/discover/data/data_sources/discover_remote_data_source.dart';
import 'package:rehla/features/discover/data/models/conditions_model/conditions_model.dart';
import 'package:rehla/features/discover/domain/models/conditions_domain_model.dart';
import 'package:rehla/features/discover/domain/repositories/discover_repository.dart';

@Injectable(as: DiscoverRepository)
class ImplDiscoverRepository extends DiscoverRepository with ModelToDomainResult {
  @override
  Future<MyResult<ConditionsDomainModel>> getConditions(RehlaDestination destination) async {
    final result = await getIt<DiscoverRemoteDataSource>().getConditions(destination.name);
    return toDomainResult<ConditionsDomainModel, ConditionsModel>(result);
  }
}
