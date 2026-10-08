import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';

abstract class HomeRepository {
  Future<MyResult<HomeFeedDomainModel>> getFeed();
}
