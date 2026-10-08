import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/search/domain/models/explore_domain_model.dart';

abstract class SearchRepository {
  Future<MyResult<ExploreDomainModel>> getExplore();
}
