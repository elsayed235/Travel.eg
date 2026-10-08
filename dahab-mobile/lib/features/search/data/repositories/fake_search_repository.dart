import 'package:flutter_tdd/core/constants/fake_images.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/widgets/app_category_item.dart';
import 'package:flutter_tdd/features/search/domain/models/explore_domain_model.dart';
import 'package:flutter_tdd/features/search/domain/repositories/search_repository.dart';

class FakeSearchRepository implements SearchRepository {
  @override
  Future<MyResult<ExploreDomainModel>> getExplore() async {
    await Future<void>.delayed(const Duration(milliseconds: 280));
    return MyResult.isSuccess(
      ExploreDomainModel(
        locationLabel: 'دمياط الجديدة',
        radiusKm: 25,
        categories: [
          for (final c in AppCategories.withAll)
            ExploreCategory(id: c.id, label: c.label),
        ],
        listings: [
          ExploreListingDomainModel(
            id: 'r1',
            title: 'محتاج جهاز لابتوب خفيف للشغل زي الصورة',
            requesterName: 'طارق فودة',
            categoryId: 'electronics',
            categoryName: 'إلكترونيات',
            quantity: 1,
            needBy: DateTime(2026, 10, 25),
            distanceKm: 2.4,
            imageUrl: FakeImages.lighting,
            placeholderColor: 0xFFB7C4B8,
          ),
          ExploreListingDomainModel(
            id: 'r2',
            title: 'هدوم شتوي مقاس L بحالة كويسة',
            requesterName: 'سارة محمود',
            categoryId: 'clothes',
            categoryName: 'ملابس',
            quantity: 3,
            needBy: DateTime(2026, 10, 28),
            distanceKm: 1.8,
            imageUrl: FakeImages.chairs,
            placeholderColor: 0xFFE8E0D8,
          ),
          ExploreListingDomainModel(
            id: 'r3',
            title: 'مواد غذائية جافة للمخزن — أرز وسكر وزيت',
            requesterName: 'أحمد حسن',
            categoryId: 'food',
            categoryName: 'مواد غذائية',
            quantity: 10,
            needBy: DateTime(2026, 11, 2),
            distanceKm: 4.0,
            imageUrl: FakeImages.tables,
            placeholderColor: 0xFFC9B8B4,
          ),
          ExploreListingDomainModel(
            id: 'r4',
            title: 'مكتب خشب صغير للمذاكرة',
            requesterName: 'منى علي',
            categoryId: 'furniture',
            categoryName: 'أثاث',
            quantity: 1,
            needBy: DateTime(2026, 10, 30),
            distanceKm: 5.1,
            imageUrl: FakeImages.backdrop,
            placeholderColor: 0xFFD8D4CF,
          ),
          ExploreListingDomainModel(
            id: 'r5',
            title: 'خلاط كهربائي منزلي شغال',
            requesterName: 'كريم يوسف',
            categoryId: 'home',
            categoryName: 'أدوات منزلية',
            quantity: 1,
            needBy: DateTime(2026, 11, 5),
            distanceKm: 3.2,
            imageUrl: FakeImages.lighting,
            placeholderColor: 0xFFE2DED8,
          ),
          ExploreListingDomainModel(
            id: 'r6',
            title: 'إطار عجلة ١٢ إنش لعربيتي',
            requesterName: 'يوسف كمال',
            categoryId: 'auto',
            categoryName: 'سيارات',
            quantity: 2,
            needBy: DateTime(2026, 11, 8),
            distanceKm: 6.5,
            imageUrl: FakeImages.tables,
            placeholderColor: 0xFFD0D4D8,
          ),
          ExploreListingDomainModel(
            id: 'r7',
            title: 'كتب ثانوية عامة رياضيات وفيزياء',
            requesterName: 'نورهان سامي',
            categoryId: 'books',
            categoryName: 'كتب',
            quantity: 5,
            needBy: DateTime(2026, 11, 12),
            distanceKm: 3.9,
            imageUrl: FakeImages.backdrop,
            placeholderColor: 0xFFE8E4DE,
          ),
          ExploreListingDomainModel(
            id: 'r8',
            title: 'حاجة متنوعة — أدوات يدوية بسيطة',
            requesterName: 'محمود فتحي',
            categoryId: 'other',
            categoryName: 'أخرى',
            quantity: 1,
            needBy: DateTime(2026, 11, 15),
            distanceKm: 8.2,
            imageUrl: FakeImages.chairs,
            placeholderColor: 0xFFDCD8D2,
          ),
        ],
      ),
    );
  }
}
