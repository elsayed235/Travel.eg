import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';
import 'package:flutter_tdd/features/base/domain/repositories/base_repository.dart';

class ProfileRequester extends Requester<UserDomainModel> {
  final int userId;

  ProfileRequester({required this.userId});
  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) {
      loadingState();
    }
    var result = await getIt.get<BaseRepository>().getUser(fromRemote);
    result.when(
      isSuccess: (data) {
        successState(data!);
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }




}
