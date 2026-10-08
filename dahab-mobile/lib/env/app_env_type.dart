enum AppEnvType {
  dev('.run/dev.run.xml', 'dev'),
  stage('.run/stage.run.xml', 'stage'),
  prod('.run/prod.run.xml', 'prod');

  final String path;
  final String value;

  const AppEnvType(this.path, this.value);

  factory AppEnvType.fromValue(String value) {
    try {
      return AppEnvType.values.firstWhere((element) => element.value == value);
    } catch (_) {}
    return dev;
  }
}
