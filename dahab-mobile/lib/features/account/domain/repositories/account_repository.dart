import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/account/domain/models/account_domain_model.dart';

abstract class AccountRepository {
  Future<MyResult<AccountProfileDomainModel>> getProfile();
}
