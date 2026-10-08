/// Dates the way the website writes them: Latin digits in both languages
/// (ar-EG-u-nu-latn), 24-hour clock, short weekday and month.
class RehlaDates {
  const RehlaDates._();

  static const _wdEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  static const _wdAr = ['الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت', 'الحد'];
  static const _moEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  static const _moAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  static String weekday(DateTime d, bool arabic) => (arabic ? _wdAr : _wdEn)[d.weekday - 1];

  static String month(DateTime d, bool arabic) => (arabic ? _moAr : _moEn)[d.month - 1];

  /// "Thu 12 Nov" · "الخميس 12 نوفمبر"
  static String day(DateTime d, bool arabic) => '${weekday(d, arabic)} ${d.day} ${month(d, arabic)}';

  static String clock(DateTime d) => '${_two(d.hour)}:${_two(d.minute)}';

  /// "Thu 12 Nov, 09:30"
  static String dayClock(DateTime d, bool arabic) => '${day(d, arabic)}${arabic ? '،' : ','} ${clock(d)}';

  static String iso(DateTime d) => '${d.year}-${_two(d.month)}-${_two(d.day)}';

  static DateTime dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  /// "08:30 AM" → "08:30"; "01:30 PM" → "13:30". Anything else as written.
  static String slot(String raw) {
    final m = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM)?', caseSensitive: false).firstMatch(raw.trim());
    if (m == null) return raw;
    var h = int.parse(m.group(1)!);
    final suffix = m.group(3)?.toUpperCase();
    if (suffix != null) {
      h = h % 12;
      if (suffix == 'PM') h += 12;
    }
    return '${_two(h)}:${m.group(2)}';
  }

  /// [raw] slot on [date] as a local DateTime.
  static DateTime? at(DateTime date, String raw) {
    final hm = slot(raw).split(':');
    if (hm.length != 2) return null;
    final h = int.tryParse(hm[0]);
    final m = int.tryParse(hm[1]);
    if (h == null || m == null) return null;
    return DateTime(date.year, date.month, date.day, h, m);
  }

  static String _two(int v) => v.toString().padLeft(2, '0');
}
