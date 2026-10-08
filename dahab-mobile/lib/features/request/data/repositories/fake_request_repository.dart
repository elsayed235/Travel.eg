import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/request/domain/models/create_request_domain_model.dart';
import 'package:flutter_tdd/features/request/domain/repositories/request_repository.dart';

class FakeRequestRepository implements RequestRepository {
  static const categories = <RequestCategory>[
    RequestCategory(id: 'clothes', name: 'ملابس'),
    RequestCategory(id: 'food', name: 'مواد غذائية'),
    RequestCategory(id: 'electronics', name: 'إلكترونيات'),
    RequestCategory(id: 'furniture', name: 'أثاث'),
    RequestCategory(id: 'home', name: 'أدوات منزلية'),
    RequestCategory(id: 'auto', name: 'سيارات وقطع غيار'),
    RequestCategory(id: 'books', name: 'كتب ومستلزمات'),
    RequestCategory(id: 'other', name: 'أخرى'),
  ];

  @override
  Future<MyResult<CreateRequestPreviewDomainModel>> getCreatePreview() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return MyResult.isSuccess(
      CreateRequestPreviewDomainModel(
        description: 'محتاج جهاز لابتوب خفيف للشغل زي الصورة',
        quantity: 1,
        quantityUnit: 'قطعة',
        needBy: DateTime(2026, 10, 25),
        closesAt: DateTime(2026, 10, 26),
        locationLabel: 'دمياط الجديدة',
        locationDistanceKm: 15,
        matchingOwners: 231,
        defaultRadiusKm: 15,
        categories: categories,
        radiusOptions: const [
          RequestRadiusOption(km: 5, matchingOwners: 48),
          RequestRadiusOption(km: 15, matchingOwners: 231),
          RequestRadiusOption(km: 30, matchingOwners: 510),
          RequestRadiusOption(km: 50, matchingOwners: 890),
        ],
      ),
    );
  }
}
