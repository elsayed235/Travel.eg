import 'package:rehla/core/helpers/rehla_dates.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/features/experiences/domain/experience_catalogue.dart';
import 'package:rehla/features/experiences/domain/models/experience.dart';

/// The "why it fits you" line under every result. Each reason is read from
/// something real: the live wind against the operator's limit, today's
/// sunset, the activity's level, or its first departure.
class ExperienceFit {
  const ExperienceFit._();

  static FitReason? reason(Experience e, LiveConditions? live) {
    final wind = live?.windKnots;
    if (wind != null && e.maxWindKnots != null && !e.windOk(wind)) {
      return FitReason(Translate.s.xp_fit_wind_high(_kn(wind), _kn(e.maxWindKnots!)), warning: true);
    }
    if (e.isSunset && live?.sunsetClock != null) {
      return FitReason(Translate.s.xp_fit_sunset(live!.sunsetClock!));
    }
    if (e.firstTimerFriendly && e.isWater) return FitReason(Translate.s.xp_fit_first_time);
    final first = e.bookable.firstSlotMinutes;
    if (e.isWater && first != null && first < 11 * 60) return FitReason(Translate.s.xp_fit_morning);
    if (wind != null && e.maxWindKnots != null) return FitReason(Translate.s.xp_fit_wind_ok(_kn(wind)));
    if (e.firstTimerFriendly) return FitReason(Translate.s.xp_fit_first_time);
    return null;
  }

  static String duration(int minutes) {
    if (minutes <= 0) return '';
    if (minutes < 60) return Translate.s.xp_minutes(minutes);
    if (minutes == 60) return Translate.s.xp_hour_one;
    if (minutes == 90) return Translate.s.xp_hour_half;
    if (minutes == 120) return Translate.s.xp_hour_two;
    final h = minutes / 60;
    return Translate.s.xp_hours(h == h.roundToDouble() ? h.toInt().toString() : h.toStringAsFixed(1));
  }

  /// "Free cancellation up to 24 h before", or null when the SKU has no policy.
  static String? cancellation(Experience e) {
    final h = e.bookable.cancellationHours;
    if (h == null) return null;
    return Translate.s.xp_free_cancel_hours(h);
  }

  /// The real deadline for a chosen departure.
  static DateTime? deadline(Experience e, DateTime day, String slot) {
    final h = e.bookable.cancellationHours;
    final start = RehlaDates.at(day, slot);
    if (h == null || start == null) return null;
    return start.subtract(Duration(hours: h));
  }

  static String _kn(num v) => v.round().toString();
}

class FitReason {
  final String text;
  final bool warning;

  const FitReason(this.text, {this.warning = false});
}
