import 'package:flutter_tdd/features/offers/domain/models/offer_why_tag.dart';
import 'package:flutter_tdd/features/offers/domain/models/offers_domain_model.dart';

class BestOfferPick {
  final OfferDomainModel offer;
  final List<OfferWhyTag> reasons;

  const BestOfferPick({required this.offer, required this.reasons});
}

/// Picks the offer to recommend and the reasons to show. Rules + template,
/// no LLM: the "why" tags already carry the signal.
class BestOfferExplainer {
  BestOfferExplainer._();

  static BestOfferPick? pick(List<OfferDomainModel> offers) {
    if (offers.length < 2) return null;
    final tags = OfferWhyTagX.compute(offers);
    OfferDomainModel? best;
    for (final o in offers) {
      if (o.isBest) {
        best = o;
        break;
      }
    }
    best ??= offers.reduce((a, b) {
      final ta = tags[a.id]?.length ?? 0;
      final tb = tags[b.id]?.length ?? 0;
      if (ta != tb) return ta > tb ? a : b;
      return (a.rating ?? 0) >= (b.rating ?? 0) ? a : b;
    });
    final reasons = tags[best.id] ?? const <OfferWhyTag>[];
    return BestOfferPick(offer: best, reasons: reasons);
  }
}
