import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';

abstract class PlanRepository {
  Future<MyResult<List<ProgrammeDomainModel>>> getProgrammes();

  Future<MyResult<dynamic>> requestPlan(ProgrammeDomainModel programme, PlanAnswers answers);
}
