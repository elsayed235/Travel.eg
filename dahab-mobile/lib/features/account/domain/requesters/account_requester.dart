import 'package:rehla/core/requester/requester.dart';
import 'package:rehla/core/requester/state/requester_state.dart';
import 'package:rehla/features/account/data/repositories/fake_account_repository.dart';
import 'package:rehla/features/account/domain/models/account_domain_model.dart';
import 'package:rehla/features/account/domain/repositories/account_repository.dart';

class AccountRequester extends Requester<AccountProfileDomainModel> {
  AccountRequester({AccountRepository? repository})
      : _repository = repository ?? FakeAccountRepository(),
        super(initialState: RequesterState.success(FakeAccountRepository.seedProfile));

  final AccountRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    // Keep existing success content — never emit loading for account chrome.
    final result = await _repository.getProfile();
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
