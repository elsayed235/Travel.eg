import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/requester/requester.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';
import 'package:rehla/features/plan/domain/repositories/plan_repository.dart';

/// Every destination's programmes, fetched once; the planner ranks locally.
class ProgrammesRequester extends Requester<List<ProgrammeDomainModel>> {
  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await getIt<PlanRepository>().getProgrammes();
    if (isClosed) return;
    result.when(
      isSuccess: (data) => successState(data ?? const []),
      isError: (error) => failedState(error, () => request(fromRemote: fromRemote)),
    );
  }
}
