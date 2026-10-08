import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/search/data/repositories/fake_search_repository.dart';
import 'package:flutter_tdd/features/search/domain/models/explore_domain_model.dart';
import 'package:flutter_tdd/features/search/domain/repositories/search_repository.dart';

class ExploreRequester extends Requester<ExploreDomainModel> {
  ExploreRequester({SearchRepository? repository})
      : _repository = repository ?? FakeSearchRepository();

  final SearchRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) {
      loadingState();
    }
    final result = await _repository.getExplore();
    result.when(
      isSuccess: (data) {
        if (data != null) {
          successState(data);
        }
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }
}
