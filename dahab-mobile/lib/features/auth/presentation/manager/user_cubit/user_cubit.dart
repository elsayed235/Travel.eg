import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_tdd/features/auth/domain/models/user_domain_model.dart';

part 'user_state.dart';

class UserCubit extends Cubit<UserState> {
  UserCubit() : super(const UserInitial());

  void onUpdateUserData(UserDomainModel model){
    emit(UserUpdateState(model: model, changed: !state.changed));
  }

}
