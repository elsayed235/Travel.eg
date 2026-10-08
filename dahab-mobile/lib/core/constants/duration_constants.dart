class DurationConstants {
  const DurationConstants._();

  static const connectTimeoutDuration = Duration(milliseconds: 15000);
  static const receiveTimeoutDuration = Duration(milliseconds: 15000);


  static const normalAnimationDuration = Duration(milliseconds: 400);

  static const shortAnimationDuration = Duration(milliseconds: 300);

  static const longAnimationDuration = Duration(milliseconds: 800);

  static const longDuration = Duration(seconds: 3);

  static  DateTime minDateTimeDuration = DateTime.now().subtract(const Duration(days: 356 * 4));
  static  DateTime maxDateTimeDuration = DateTime.now().add(const Duration(days: 356 * 4));
}
