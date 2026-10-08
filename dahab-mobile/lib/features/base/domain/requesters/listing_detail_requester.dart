import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/base/data/repositories/fake_listing_repository.dart';
import 'package:flutter_tdd/features/base/domain/models/listing_detail_domain_model.dart';
import 'package:flutter_tdd/features/base/domain/repositories/listing_repository.dart';

class ListingDetailRequester extends Requester<ListingDetailDomainModel> {
  ListingDetailRequester({
    required this.listingId,
    ListingRepository? repository,
  }) : _repository = repository ?? FakeListingRepository();

  final String listingId;
  final ListingRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) {
      loadingState();
    }
    final result = await _repository.getListing(listingId);
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) {
        failedState(error, () => request(fromRemote: fromRemote));
      },
    );
  }
}
