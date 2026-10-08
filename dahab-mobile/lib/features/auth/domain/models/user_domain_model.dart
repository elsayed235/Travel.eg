import 'package:rehla/core/models/domain_model/base_domain_model.dart';

class UserDomainModel extends BaseDomainModel {

  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;

  UserDomainModel({
    required this.id,
    required this.email,
    required this.phone,
    required this.firstName,
    required this.lastName,
  });


  String get getFullName {
    final full = '$firstName $lastName'.trim();
    return full.isEmpty ? email : full;
  }



}
