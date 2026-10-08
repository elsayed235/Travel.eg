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
    return await SimpleConnectionChecker.isConnectedToInternet();
  }

}