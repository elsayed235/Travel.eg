import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';

abstract class BaseRepository {

  Future<MyResult<UserDomainModel>> getUser(bool param);

}