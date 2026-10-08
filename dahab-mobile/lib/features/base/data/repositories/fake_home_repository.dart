import 'package:flutter_tdd/core/constants/fake_images.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/base/domain/models/home_feed_domain_model.dart';
import 'package:flutter_tdd/features/base/domain/repositories/home_repository.dart';

class FakeHomeRepository implements HomeRepository {
  @override
  Future<MyResult<HomeFeedDomainModel>> getFeed() async {
    await Future<void>.delayed(const Duration(milliseconds: 350));
    return MyResult.isSuccess(
      HomeFeedDomainModel(
        locationLabel: 'دمياط الجديدة',
        locationDistanceKm: 15,
        ownersInRange: 231,
        totalRequests: 12,
        listings: [
          ListingDomainModel(
            id: 'r1',
            title: 'محتاج جهاز لابتوب خفيف للشغل زي الصورة',
            requesterName: 'طارق فودة',
            categoryId: 'electronics',
            categoryName: 'إلكترونيات',
            quantity: 1,
            needBy: DateTime(2026, 10, 25),
            distanceKm: 2.4,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFB7C4B8,
            imageUrl: FakeImages.lighting,
          ),
          ListingDomainModel(
            id: 'r2',
            title: 'هدوم شتوي مقاس L بحالة كويسة',
            requesterName: 'سارة محمود',
            categoryId: 'clothes',
            categoryName: 'ملابس',
            quantity: 3,
            needBy: DateTime(2026, 10, 28),
            distanceKm: 1.8,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFE8E0D8,
            imageUrl: FakeImages.chairs,
          ),
          ListingDomainModel(
            id: 'r3',
            title: 'مواد غذائية جافة للمخزن — أرز وسكر وزيت',
            requesterName: 'أحمد حسن',
            categoryId: 'food',
            categoryName: 'مواد غذائية',
            quantity: 10,
            needBy: DateTime(2026, 11, 2),
            distanceKm: 4.0,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFC9B8B4,
            imageUrl: FakeImages.tables,
          ),
          ListingDomainModel(
            id: 'r4',
            title: 'مكتب خشب صغير للمذاكرة',
            requesterName: 'منى علي',
            categoryId: 'furniture',
            categoryName: 'أثاث',
            quantity: 1,
            needBy: DateTime(2026, 10, 30),
            distanceKm: 5.1,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFD8D4CF,
            imageUrl: FakeImages.backdrop,
          ),
          ListingDomainModel(
            id: 'r5',
            title: 'خلاط كهربائي منزلي شغال',
            requesterName: 'كريم يوسف',
            categoryId: 'home',
            categoryName: 'أدوات منزلية',
            quantity: 1,
            needBy: DateTime(2026, 11, 5),
            distanceKm: 3.2,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFE2DED8,
            imageUrl: FakeImages.lighting,
          ),
          ListingDomainModel(
            id: 'r6',
            title: 'إطار عجلة ١٢ إنش لعربيتي',
            requesterName: 'يوسف كمال',
            categoryId: 'auto',
            categoryName: 'سيارات',
            quantity: 2,
            needBy: DateTime(2026, 11, 8),
            distanceKm: 6.5,
            locationLabel: 'دمياط الجديدة',
            placeholderColor: 0xFFD0D4D8,
            imageUrl: FakeImages.tables,
          ),
        ],
      ),
    );
  }
}
