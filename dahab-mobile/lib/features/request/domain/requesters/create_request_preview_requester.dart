import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/request/data/repositories/fake_request_repository.dart';
import 'package:flutter_tdd/features/request/domain/models/create_request_domain_model.dart';
import 'package:flutter_tdd/features/request/domain/repositories/request_repository.dart';

class CreateRequestPreviewRequester extends Requester<CreateRequestPreviewDomainModel> {
  CreateRequestPreviewRequester({RequestRepository? repository})
      : _repository = repository ?? FakeRequestRepository();

  final RequestRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) {
      loadingState();
    }
    final result = await _repository.getCreatePreview();
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
