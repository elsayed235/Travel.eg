import 'package:flutter/foundation.dart';
import 'package:injectable/injectable.dart';
import 'package:simple_connection_checker/simple_connection_checker.dart';

abstract class NetworkInfo {
  Future<bool> get isConnected;
}

@lazySingleton
class NetworkInfoImpl extends NetworkInfo{

  @preResolve
  @override
  Future<bool> get isConnected async {
    // The checker opens a socket lookup the browser cannot make, so on the web
    // it always says "offline" (and GenericHttp would wait forever). The
    // browser reports a dropped connection as a failed request instead.
    if (kIsWeb) return true;
    return await SimpleConnectionChecker.isConnectedToInternet();
  }

}
