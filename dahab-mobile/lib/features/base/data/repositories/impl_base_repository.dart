import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/models/model_to_domain/model_to_domain.dart';
import 'package:flutter_tdd/features/auth/data/models/user_model/user_model.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';
import 'package:flutter_tdd/features/base/data/data_sources/home_remote_data_source.dart';
import 'package:flutter_tdd/features/base/domain/repositories/base_repository.dart';
import 'package:injectable/injectable.dart';


@Injectable(as: BaseRepository)
class ImplBaseRepository extends BaseRepository with ModelToDomainResult {

  @override
  Future<MyResult<UserDomainModel>> getUser(bool param)async {
    var result = await getIt.get<HomeRemoteDataSource>().getUser(param);
    return toDomainResult<UserDomainModel, UserModel>(result);
  }



}