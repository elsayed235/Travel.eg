import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/base/domain/models/listing_detail_domain_model.dart';

abstract class ListingRepository {
  Future<MyResult<ListingDetailDomainModel>> getListing(String id);
}
