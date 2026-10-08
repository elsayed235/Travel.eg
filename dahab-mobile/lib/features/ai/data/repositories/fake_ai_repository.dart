import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/ai/domain/models/ai_domain_models.dart';
import 'package:flutter_tdd/features/ai/domain/repositories/ai_repository.dart';

/// Offline stand-in for the AI gateway. Uses simple Arabic keyword rules so
/// the flows behave realistically until the backend endpoints exist.
class FakeAiRepository implements AiRepository {
  static const _categoryKeywords = <String, List<String>>{
    'electronics': ['لابتوب', 'موبايل', 'شاشة', 'كاميرا', 'سماعة', 'تليفزيون', 'بلايستيشن', 'بروجكتور', 'شاحن'],
    'furniture': ['كرسي', 'كراسي', 'ترابيزة', 'ترابيزات', 'سرير', 'كنبة', 'دولاب', 'مكتب'],
    'clothes': ['فستان', 'بدلة', 'جاكيت', 'قميص', 'لبس', 'شنطة', 'جزمة'],
    'food': ['أكل', 'رز', 'سكر', 'زيت', 'لحمة', 'فراخ'],
    'home': ['خلاط', 'مكواة', 'غسالة', 'تلاجة', 'سجادة', 'مروحة', 'تكييف', 'حلل', 'دفاية'],
    'auto': ['عربية', 'كاوتش', 'بطارية', 'قطع غيار', 'موتوسيكل', 'عجلة'],
    'books': ['كتاب', 'كتب', 'كشكول', 'ملزمة', 'مستلزمات'],
  };

  static const _weekdays = <String, int>{
    'الاتنين': DateTime.monday,
    'الاثنين': DateTime.monday,
    'التلات': DateTime.tuesday,
    'الثلاثاء': DateTime.tuesday,
    'الأربع': DateTime.wednesday,
    'الاربع': DateTime.wednesday,
    'الخميس': DateTime.thursday,
    'الجمعة': DateTime.friday,
    'السبت': DateTime.saturday,
    'الحد': DateTime.sunday,
    'الأحد': DateTime.sunday,
  };

  static const _wordNumbers = <String, int>{
    'واحد': 1,
    'واحدة': 1,
    'اتنين': 2,
    'اثنين': 2,
    'تلاتة': 3,
    'ثلاثة': 3,
    'أربعة': 4,
    'اربعة': 4,
    'خمسة': 5,
    'عشرة': 10,
  };

  static const _requestPrefixes = ['محتاج', 'محتاجة', 'عايز', 'عايزة', 'عاوز', 'مطلوب', 'أنا', 'انا', 'ضروري'];

  @override
  Future<MyResult<StructuredRequestDomainModel>> structureRequest({
    required String text,
    required List<String> categoryIds,
    String? photoPath,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    final normalized = _westernDigits(text.trim());
    if (normalized.isEmpty) {
      return const MyResult.isSuccess(StructuredRequestDomainModel());
    }

    final categoryId = _matchCategory(normalized, categoryIds);
    final quantity = _matchQuantity(normalized);
    final needBy = _matchNeedBy(normalized, DateTime.now());
    final specs = _matchSpecs(normalized);
    final title = _matchTitle(normalized);

    final found = [categoryId, quantity, needBy, title].where((e) => e != null).length;
    return MyResult.isSuccess(
      StructuredRequestDomainModel(
        title: title,
        categoryId: categoryId,
        quantity: quantity?.$1,
        quantityUnit: quantity?.$2,
        needBy: needBy,
        specs: specs,
        confidence: (0.35 + found * 0.15 + (specs.isEmpty ? 0 : 0.05)).clamp(0, 0.95),
      ),
    );
  }

  static const _searchStopwords = {
    'عندي', 'محتاج', 'محتاجة', 'عايز', 'عايزة', 'عاوز', 'ممكن', 'حد', 'فيه', 'في', 'من',
    'على', 'عشان', 'أو', 'او', 'مطلوب', 'أنا', 'انا', 'حاجة', 'زي', 'اللي', 'ده', 'دي',
    'كويس', 'كويسة', 'طلبات', 'طلب', 'قريب', 'قريبة', 'مني', 'جنبي', 'للإيجار', 'للايجار',
    'إيجار', 'ايجار', 'أأجر', 'أأجره', 'اأجر', 'للبيع', 'أبيع', 'ابيع', 'أشتري', 'اشتري',
  };

  static const _categoryNames = <String, List<String>>{
    'electronics': ['إلكترونيات', 'الكترونيات', 'أجهزة', 'اجهزة'],
    'furniture': ['أثاث', 'اثاث', 'عفش'],
    'clothes': ['ملابس', 'هدوم'],
    'food': ['مواد غذائية', 'بقالة'],
    'home': ['أدوات منزلية', 'ادوات منزلية', 'مطبخ'],
    'auto': ['سيارات', 'عربيات'],
    'books': ['كتب'],
  };

  @override
  Future<MyResult<SmartSearchDomainModel>> parseSearch({
    required String text,
    required List<String> categoryIds,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    final normalized = _westernDigits(text.trim());
    String? categoryId = _matchCategory(normalized, categoryIds);
    if (categoryId == null) {
      for (final entry in _categoryNames.entries) {
        if (categoryIds.contains(entry.key) && entry.value.any(normalized.contains)) {
          categoryId = entry.key;
          break;
        }
      }
    }
    final categoryWords = _categoryNames.values.expand((e) => e).toSet();
    final knownWords = _categoryKeywords.values.expand((e) => e).toSet();
    final keywords = normalized
        .split(RegExp(r'[\s،,.؟?!]+'))
        .map((w) => w.startsWith('و') && w.length > 3 ? w.substring(1) : w)
        .map((w) => w.startsWith('لل') ? w.substring(2) : w)
        .map((w) => _stripLamPrefix(w, knownWords))
        .map((w) => w.startsWith('ال') && w.length > 4 ? w.substring(2) : w)
        .where((w) => w.length >= 3)
        .where((w) => !_searchStopwords.contains(w) && !categoryWords.contains(w))
        .where((w) => !RegExp(r'^\d+$').hasMatch(w))
        .toSet()
        .take(4)
        .toList();
    return MyResult.isSuccess(
      SmartSearchDomainModel(query: text.trim(), categoryId: categoryId, keywords: keywords),
    );
  }

  /// "لفرح" → "فرح"; keeps real words that start with ل ("لابتوب", "لحمة").
  String _stripLamPrefix(String word, Set<String> known) {
    if (word.length < 4 || known.contains(word) || !word.startsWith('ل')) return word;
    final second = word[1];
    if (second == 'ا' || second == 'ل') return word;
    return word.substring(1);
  }

  @override
  Future<MyResult<PriceGuidanceDomainModel>> getPriceGuidance({
    required String itemLabel,
    String? categoryId,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    final base = switch (categoryId ?? _matchCategory(itemLabel, _categoryKeywords.keys.toList())) {
      'electronics' => 200,
      'furniture' => 40,
      'clothes' => 150,
      'auto' => 300,
      'home' => 80,
      _ => 100,
    };
    return MyResult.isSuccess(
      PriceGuidanceDomainModel(
        min: (base * 0.75).round(),
        max: (base * 1.25).round(),
        sampleSize: 12 + itemLabel.length % 30,
      ),
    );
  }

  @override
  Future<MyResult<List<String>>> suggestReplies({
    required String conversationId,
    required bool isMyRequest,
    required String lastPeerMessage,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final msg = lastPeerMessage;
    final replies = <String>[];
    if (isMyRequest) {
      if (msg.contains('صور')) replies.add('ياريت تبعتلي صورة حقيقية للحاجة');
      if (msg.contains('سعر') || msg.contains('بكام')) replies.add('ينفع تنزل في السعر شوية؟');
      replies.addAll(['إمتى تقدر تسلّم؟', 'تمام، متفقين', 'التأمين بيرجع إمتى؟']);
    } else {
      if (msg.contains('إمتى') || msg.contains('امتى')) replies.add('أقدر أسلّمه بكرة الصبح');
      if (msg.contains('صور')) replies.add('هبعتلك صورة دلوقتي');
      replies.addAll(['متاح وجاهز', 'السعر شامل التوصيل', 'تحب تستلم بنفسك؟']);
    }
    return MyResult.isSuccess(replies.toSet().take(3).toList());
  }

  @override
  Future<MyResult<ReviewSummaryDomainModel>> getReviewSummary(String userId) async {
    await Future<void>.delayed(const Duration(milliseconds: 350));
    return const MyResult.isSuccess(
      ReviewSummaryDomainModel(
        summary: 'الناس بتقول إنه ملتزم بالمواعيد والحاجة بتوصل بنفس الحالة اللي في الصور، وبيرد بسرعة.',
        highlights: ['ملتزم بالمواعيد', 'الحالة زي الوصف', 'رد سريع'],
        basedOnCount: 18,
      ),
    );
  }

  String _westernDigits(String input) {
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    final buffer = StringBuffer();
    for (final ch in input.split('')) {
      final i = arabic.indexOf(ch);
      buffer.write(i >= 0 ? '$i' : ch);
    }
    return buffer.toString();
  }

  String? _matchCategory(String text, List<String> allowedIds) {
    for (final entry in _categoryKeywords.entries) {
      if (!allowedIds.contains(entry.key)) continue;
      if (entry.value.any(text.contains)) return entry.key;
    }
    return null;
  }

  (int, String)? _matchQuantity(String text) {
    final unitMatch = RegExp(r'(\d+)\s*(كيلو|متر|قطعة|قطع)').firstMatch(text);
    if (unitMatch != null) {
      final unit = unitMatch.group(2)!;
      return (int.parse(unitMatch.group(1)!), unit == 'قطع' ? 'قطعة' : unit);
    }
    // A bare count ("2 كرسي"), ignoring numbers inside specs ("رامات 16")
    // and durations ("لمدة 3 أيام").
    final stripped = text
        .replaceAll(RegExp(r'رام\S*\s*\d+'), '')
        .replaceAll(RegExp(r'(لمدة|بعد)\s+\d+'), '');
    final bare = RegExp(r'(\d{1,3})\s+(\S+)').firstMatch(stripped);
    if (bare != null && !RegExp(r'جيجا|يوم|أيام|ايام|ساعة|جنيه').hasMatch(bare.group(2)!)) {
      return (int.parse(bare.group(1)!), 'قطعة');
    }
    for (final entry in _wordNumbers.entries) {
      if (RegExp('(^|\\s)${entry.key}(\\s|\$)').hasMatch(text)) return (entry.value, 'قطعة');
    }
    return null;
  }

  DateTime? _matchNeedBy(String text, DateTime now) {
    final today = DateTime(now.year, now.month, now.day);
    if (text.contains('النهاردة') || text.contains('النهارده')) return today;
    if (text.contains('بكرة') || text.contains('بكره') || text.contains('غدا')) {
      return today.add(const Duration(days: 1));
    }
    final inDays = RegExp(r'بعد\s+(\d+)\s*(يوم|أيام|ايام)').firstMatch(text);
    if (inDays != null) return today.add(Duration(days: int.parse(inDays.group(1)!)));
    for (final entry in _weekdays.entries) {
      if (text.contains(entry.key)) {
        var delta = (entry.value - today.weekday) % 7;
        if (delta == 0) delta = 7;
        return today.add(Duration(days: delta));
      }
    }
    return null;
  }

  List<String> _matchSpecs(String text) {
    final specs = <String>[];
    final ram = RegExp(r'رام\S*\s*(\d+)').firstMatch(text);
    if (ram != null) specs.add('رام ${ram.group(1)} جيجا على الأقل');
    if (text.contains('خفيف')) specs.add('خفيف الوزن');
    if (text.contains('جديد')) specs.add('جديد');
    if (text.contains('مستعمل')) specs.add('مستعمل مقبول');
    final duration = RegExp(r'لمدة\s+(\S+(\s+(يوم|أيام|ايام))?)').firstMatch(text);
    if (duration != null) specs.add('لمدة ${duration.group(1)}');
    return specs;
  }

  String? _matchTitle(String text) {
    final clause = text.split(RegExp(r'[،,.\n]|\sزي\s|\sيكون\s|\sلمدة\s')).first.trim();
    final words = clause.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
    while (words.isNotEmpty && _requestPrefixes.contains(words.first)) {
      words.removeAt(0);
    }
    if (words.isEmpty) return null;
    return words.take(5).join(' ');
  }
}
