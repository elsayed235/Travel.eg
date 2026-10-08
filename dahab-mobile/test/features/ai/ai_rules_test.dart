import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_tdd/features/ai/data/repositories/fake_ai_repository.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/ai/domain/services/best_offer_explainer.dart';
import 'package:flutter_tdd/features/ai/domain/services/chat_safety_rules.dart';
import 'package:flutter_tdd/features/offers/domain/models/offer_why_tag.dart';
import 'package:flutter_tdd/features/offers/domain/models/offers_domain_model.dart';

const _categories = ['clothes', 'food', 'electronics', 'furniture', 'home', 'auto', 'books', 'other'];

OfferDomainModel _offer(String id, {num price = 100, double km = 5, double? rating, bool best = false}) {
  return OfferDomainModel(
    id: id,
    providerUserId: 'u$id',
    providerName: 'Owner $id',
    avatarInitial: 'O',
    distanceKm: km,
    price: price,
    insurance: 0,
    deliveryKind: OfferDeliveryKind.free,
    rating: rating,
    isBest: best,
  );
}

void main() {
  group('FakeAiRepository.structureRequest', () {
    final repo = FakeAiRepository();

    test('extracts category, specs and title from Egyptian Arabic', () async {
      final result = await repo.structureRequest(
        text: 'محتاج لابتوب خفيف للشغل زي الصورة، يكون رامات ١٦ على الأقل',
        categoryIds: _categories,
      );
      final data = result.data!;
      expect(data.categoryId, 'electronics');
      expect(data.title, 'لابتوب خفيف للشغل');
      expect(data.specs, contains('رام 16 جيجا على الأقل'));
      expect(data.specs, contains('خفيف الوزن'));
      // "16" belongs to the RAM spec, not the quantity.
      expect(data.quantity, isNull);
    });

    test('reads a count with Arabic digits', () async {
      final result = await repo.structureRequest(
        text: 'عايز ٢٠ كرسي لفرح بكرة',
        categoryIds: _categories,
      );
      final data = result.data!;
      expect(data.categoryId, 'furniture');
      expect(data.quantity, 20);
      final tomorrow = DateTime.now().add(const Duration(days: 1));
      expect(data.needBy?.day, tomorrow.day);
    });

    test('resolves a weekday to the next occurrence', () async {
      final result = await repo.structureRequest(text: 'مطلوب بروجكتور الخميس', categoryIds: _categories);
      final needBy = result.data!.needBy!;
      expect(needBy.weekday, DateTime.thursday);
      expect(needBy.isAfter(DateTime.now()), isTrue);
    });

    test('ignores categories the app does not offer', () async {
      final result = await repo.structureRequest(text: 'محتاج لابتوب', categoryIds: const ['food']);
      expect(result.data!.categoryId, isNull);
    });
  });

  group('FakeAiRepository.parseSearch', () {
    final repo = FakeAiRepository();

    test('finds the category and drops filler words', () async {
      final result = await repo.parseSearch(text: 'حد محتاج كراسي لفرح؟', categoryIds: _categories);
      final data = result.data!;
      expect(data.categoryId, 'furniture');
      expect(data.keywords, containsAll(['كراسي', 'فرح']));
      expect(data.keywords, isNot(contains('محتاج')));
    });

    test('maps a category name to its id', () async {
      final result = await repo.parseSearch(text: 'طلبات إلكترونيات قريبة مني', categoryIds: _categories);
      expect(result.data!.categoryId, 'electronics');
      expect(result.data!.keywords, isEmpty);
    });

    test('understands colloquial clothing words', () async {
      final result = await repo.parseSearch(text: 'هدوم شتوي', categoryIds: _categories);
      expect(result.data!.categoryId, 'clothes');
      expect(result.data!.keywords, ['شتوي']);
    });
  });

  group('ChatSafetyRules', () {
    test('flags off-platform payment', () {
      expect(ChatSafetyRules.check('حوّل على فودافون كاش أحسن'), SafetyFlag.offPlatformPayment);
      expect(ChatSafetyRules.check('ابعت على انستا باي'), SafetyFlag.offPlatformPayment);
    });

    test('flags advance payment', () {
      expect(ChatSafetyRules.check('ابعت العربون الأول'), SafetyFlag.advancePayment);
    });

    test('lets normal messages through', () {
      expect(ChatSafetyRules.check('متاح وأقدر أسلّمه بكرة'), isNull);
      expect(ChatSafetyRules.check(''), isNull);
    });
  });

  group('BestOfferExplainer', () {
    test('prefers the offer marked best', () {
      final pick = BestOfferExplainer.pick([_offer('1', price: 90), _offer('2', best: true)]);
      expect(pick!.offer.id, '2');
    });

    test('otherwise picks the offer with the most reasons', () {
      final pick = BestOfferExplainer.pick([
        _offer('1', price: 80, km: 2, rating: 4.9),
        _offer('2', price: 120, km: 9, rating: 4.1),
      ]);
      expect(pick!.offer.id, '1');
      expect(pick.reasons, containsAll([OfferWhyTag.nearest, OfferWhyTag.cheapest, OfferWhyTag.topRated]));
    });

    test('needs at least two offers to compare', () {
      expect(BestOfferExplainer.pick([_offer('1')]), isNull);
    });
  });
}
