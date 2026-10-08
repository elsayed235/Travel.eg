import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/requester/requester.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/discover/domain/models/conditions_domain_model.dart';
import 'package:rehla/features/discover/domain/repositories/discover_repository.dart';

/// Live conditions for the destination on screen. Switching place clears the
/// old reading first, so Dahab's wind never shows under Siwa's name.
class ConditionsRequester extends Requester<ConditionsDomainModel> {
  RehlaDestination _destination = RehlaDestination.dahab;

  Future<void> forDestination(RehlaDestination destination) {
    _destination = destination;
    loadingState();
    return request();
  }

  @override
  Future<void> request({bool fromRemote = true}) async {
    final asked = _destination;
    final result = await getIt<DiscoverRepository>().getConditions(asked);
    if (asked != _destination || isClosed) return;
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) => failedState(error, () => request(fromRemote: fromRemote)),
    );
  }
}
