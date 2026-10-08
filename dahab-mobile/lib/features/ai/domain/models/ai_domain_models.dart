/// Output of the smart request composer (`POST ai/structure-request`).
///
/// Every field is optional: the composer only fills what it is confident
/// about and leaves the rest for the user.
class StructuredRequestDomainModel {
  final String? title;
  final String? categoryId;
  final int? quantity;
  final String? quantityUnit;
  final DateTime? needBy;
  final List<String> specs;
  /// 0..1 — below [autoApplyThreshold] the UI asks before applying.
  final double confidence;

  static const double autoApplyThreshold = 0.6;

  const StructuredRequestDomainModel({
    this.title,
    this.categoryId,
    this.quantity,
    this.quantityUnit,
    this.needBy,
    this.specs = const [],
    this.confidence = 0,
  });

  bool get isEmpty =>
      title == null &&
      categoryId == null &&
      quantity == null &&
      needBy == null &&
      specs.isEmpty;

  factory StructuredRequestDomainModel.fromJson(Map<String, dynamic> json) {
    return StructuredRequestDomainModel(
      title: json['title'] as String?,
      categoryId: json['category_id'] as String?,
      quantity: (json['quantity'] as num?)?.toInt(),
      quantityUnit: json['quantity_unit'] as String?,
      needBy: DateTime.tryParse(json['need_by'] as String? ?? ''),
      specs: (json['specs'] as List<dynamic>? ?? const []).cast<String>(),
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0,
    );
  }
}

/// Typical accepted price for similar deals nearby (`GET ai/price-guidance`).
/// Computed from accepted offers on the backend — no LLM.
class PriceGuidanceDomainModel {
  final num min;
  final num max;
  /// Number of accepted offers the range is based on.
  final int sampleSize;

  const PriceGuidanceDomainModel({
    required this.min,
    required this.max,
    required this.sampleSize,
  });

  num get suggested => ((min + max) / 2).round();

  /// The backend returns sample_size 0 when there are too few accepted offers.
  bool get hasData => sampleSize > 0;

  factory PriceGuidanceDomainModel.fromJson(Map<String, dynamic> json) {
    return PriceGuidanceDomainModel(
      min: json['min'] as num,
      max: json['max'] as num,
      sampleSize: (json['sample_size'] as num?)?.toInt() ?? 0,
    );
  }
}

/// Short summary of a user's reviews (`GET ai/review-summary/{userId}`).
/// Generated overnight in batch on the backend and cached.
class ReviewSummaryDomainModel {
  final String summary;
  final List<String> highlights;
  final int basedOnCount;

  const ReviewSummaryDomainModel({
    required this.summary,
    required this.highlights,
    required this.basedOnCount,
  });

  factory ReviewSummaryDomainModel.fromJson(Map<String, dynamic> json) {
    return ReviewSummaryDomainModel(
      summary: json['summary'] as String? ?? '',
      highlights: (json['highlights'] as List<dynamic>? ?? const []).cast<String>(),
      basedOnCount: (json['based_on_count'] as num?)?.toInt() ?? 0,
    );
  }
}

enum SafetyFlag { offPlatformPayment, advancePayment, abuse }

/// How the smart search understood a free-text query (`POST ai/parse-search`).
class SmartSearchDomainModel {
  final String query;
  final String? categoryId;
  final List<String> keywords;

  const SmartSearchDomainModel({
    required this.query,
    this.categoryId,
    this.keywords = const [],
  });

  bool get isEmpty => categoryId == null && keywords.isEmpty;

  factory SmartSearchDomainModel.fromJson(String query, Map<String, dynamic> json) {
    return SmartSearchDomainModel(
      query: query,
      categoryId: json['category_id'] as String?,
      keywords: (json['keywords'] as List<dynamic>? ?? const []).cast<String>(),
    );
  }
}
