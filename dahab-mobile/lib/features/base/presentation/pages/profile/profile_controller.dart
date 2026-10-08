part of 'profile_imports.dart';

class ProfileController {

  late ProfileRequester _profileRequester ;

  ProfileController(int userId){
    _profileRequester = ProfileRequester(userId: userId);
    _profileRequester.request();
  }



}