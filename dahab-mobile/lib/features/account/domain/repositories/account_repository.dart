import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/account/domain/models/account_domain_model.dart';

abstract class AccountRepository {
  Future<MyResult<AccountProfileDomainModel>> getProfile();
}
