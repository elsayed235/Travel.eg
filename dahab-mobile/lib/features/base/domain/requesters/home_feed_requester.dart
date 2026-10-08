import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/base/data/repositories/fake_home_repository.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';
import 'package:flutter_tdd/features/base/domain/repositories/home_repository.dart';

class HomeFeedRequester extends Requester<HomeFeedDomainModel> {
  HomeFeedRequester({HomeRepository? repository})
      : _repository = repository ?? FakeHomeRepository();

  final HomeRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) {
      loadingState();
    }
    final result = await _repository.getFeed();
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
