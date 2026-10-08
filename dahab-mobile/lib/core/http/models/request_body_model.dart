class RequestBodyModel{
  final String url;
  final Function(dynamic) errorFunc;
  final Map<String, dynamic> body;
  final bool showLoader;
  final bool forceRefresh;

  /// Background reads (ambient conditions, prefetches) fail without a toast.
  final bool quiet;

  RequestBodyModel({
    required this.url,
    this.body=const<String,dynamic>{},
    this.showLoader = true,
    this.forceRefresh = true,
    this.quiet = false,
    required this.errorFunc,
  });
}