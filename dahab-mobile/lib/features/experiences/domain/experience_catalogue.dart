import 'dart:convert';

import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/http/rehla_api.dart';
import 'package:rehla/features/experiences/domain/models/experience.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// The Dahab catalogue every screen reads from: Home's rail, the Discover
/// map, DayGi's cards and the Today tab's wind check. Loaded once, kept in
/// prefs so the app opens with something offline.
class ExperienceCatalogue {
  ExperienceCatalogue._();

  static final ExperienceCatalogue instance = ExperienceCatalogue._();

  static const _cacheKey = 'rehla_catalogue_v1';

  final ObsValue<CatalogueState> stateObs = ObsValue.withInit(const CatalogueState.loading());

  Future<void>? _loading;

  List<Experience> get items => stateObs.getValue().items;

  LiveConditions? get live => stateObs.getValue().live;

  Experience? byId(String id) {
    for (final e in items) {
      if (e.id == id) return e;
    }
    return null;
  }

  Experience? bySku(String skuId) {
    for (final e in items) {
      if (e.bookable.skuId == skuId) return e;
    }
    return null;
  }

  Future<void> ensureLoaded() => _loading ??= _load();

  Future<void> reload() {
    _loading = _load();
    return _loading!;
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    if (items.isEmpty) {
      final cached = prefs.getString(_cacheKey);
      if (cached != null) {
        final parsed = _parse(jsonDecode(cached) as Map<String, dynamic>);
        if (parsed.isNotEmpty) stateObs.setValue(CatalogueState.ready(parsed, live, usdRate, offline: true));
      }
    }

    final replies = await Future.wait([
      RehlaApi.get('dahab/activities'),
      RehlaApi.get('dahab/places'),
      RehlaApi.get('telemetry/conditions?d=dahab'),
      RehlaApi.get('fx/rates'),
    ]);
    final acts = replies[0];
    final places = replies[1];
    final conditions = replies[2].ok ? LiveConditions.fromJson(replies[2].map) : live;
    final fx = replies[3].map['data'];
    final usd = fx is Map ? ((fx['egpPerUnit'] as Map?)?['USD'] as num?) : usdRate;

    if (!acts.ok) {
      if (items.isEmpty) {
        stateObs.setValue(CatalogueState.failed(unreachable: acts.unreachable));
      } else {
        stateObs.setValue(CatalogueState.ready(items, conditions, usd, offline: true));
      }
      _loading = null;
      return;
    }
    final raw = {'activities': acts.map['activities'], 'places': places.map['places'] ?? const []};
    final parsed = _parse(raw);
    stateObs.setValue(CatalogueState.ready(parsed, conditions, usd));
    await prefs.setString(_cacheKey, jsonEncode(raw));
  }

  num? get usdRate => stateObs.getValue().egpPerUsd;

  List<Experience> _parse(Map<String, dynamic> raw) {
    final places = <String, ExperiencePlace>{};
    for (final p in (raw['places'] as List? ?? const [])) {
      if (p is Map) {
        final place = ExperiencePlace.fromJson(Map<String, dynamic>.from(p));
        places[place.id] = place;
      }
    }
    final out = <Experience>[];
    for (final a in (raw['activities'] as List? ?? const [])) {
      if (a is! Map) continue;
      final json = Map<String, dynamic>.from(a);
      // Only what can be sold: the website does not show a price it cannot charge.
      if (json['bookable'] is! Map) continue;
      final e = Experience.fromJson(json, places);
      if (e.bookable.skuId.isEmpty || e.bookable.serviceType == 'transfer') continue;
      out.add(e);
    }
    return out;
  }
}

class CatalogueState {
  final List<Experience> items;
  final LiveConditions? live;
  final num? egpPerUsd;
  final bool loading;
  final bool failed;
  final bool unreachable;
  final bool offline;

  const CatalogueState.loading()
      : items = const [],
        live = null,
        egpPerUsd = null,
        loading = true,
        failed = false,
        unreachable = false,
        offline = false;

  const CatalogueState.ready(this.items, this.live, this.egpPerUsd, {this.offline = false})
      : loading = false,
        failed = false,
        unreachable = false;

  const CatalogueState.failed({required this.unreachable})
      : items = const [],
        live = null,
        egpPerUsd = null,
        loading = false,
        failed = true,
        offline = false;
}

/// The reading behind "Live from Open-Meteo": nothing here is estimated.
class LiveConditions {
  final num windKnots;
  final num? waterC;
  final num airC;
  final String source;
  final DateTime? observedAt;
  final String? sunsetClock;

  const LiveConditions({
    required this.windKnots,
    required this.waterC,
    required this.airC,
    required this.source,
    required this.observedAt,
    required this.sunsetClock,
  });

  String? get observedClock {
    final t = observedAt?.toLocal();
    if (t == null) return null;
    return '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
  }

  static LiveConditions? fromJson(Map<String, dynamic> json) {
    final wind = json['windKnots'];
    if (wind is! num) return null;
    final sunset = json['sunset'] as String?;
    return LiveConditions(
      windKnots: wind,
      waterC: json['waterTemperatureC'] as num?,
      airC: json['airTemperatureC'] as num? ?? 0,
      source: json['source'] as String? ?? '',
      observedAt: DateTime.tryParse(json['observedAt'] as String? ?? ''),
      sunsetClock: sunset != null && sunset.length >= 16 ? sunset.substring(11, 16) : null,
    );
  }
}
