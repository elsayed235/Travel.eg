import 'package:injectable/injectable.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/http/models/result.dart';
import 'package:rehla/core/models/model_to_domain/model_to_domain.dart';
import 'package:rehla/features/plan/data/data_sources/plan_remote_data_source.dart';
import 'package:rehla/features/plan/data/models/programme_model/programme_model.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';
import 'package:rehla/features/plan/domain/repositories/plan_repository.dart';

@Injectable(as: PlanRepository)
class ImplPlanRepository extends PlanRepository with ModelToDomainResult {
  @override
  Future<MyResult<List<ProgrammeDomainModel>>> getProgrammes() async {
    final result = await getIt<PlanRemoteDataSource>().getProgrammes();
    return toDomainResultList<ProgrammeDomainModel, ProgrammeModel>(result);
  }

  /// Same message shape the website sends, so operations read one format.
  @override
  Future<MyResult<dynamic>> requestPlan(ProgrammeDomainModel programme, PlanAnswers answers) {
    final message = [
      'Plan request: ${programme.titleEn} (${programme.id})',
      'Destination: ${answers.destination.nameEn}',
      'Nights: ${answers.nights ?? 'flexible'} · Party: ${answers.party?.name ?? '-'} · '
          'Pace: ${answers.pace?.wire ?? '-'} · Budget: ${answers.budget?.wire ?? '-'}',
      'Wants: ${answers.vibes.isEmpty ? '-' : answers.vibes.map((v) => v.name).join(', ')}',
      'Sent from: REHLA app',
    ].join('\n');
    return getIt<PlanRemoteDataSource>().requestPlan(message);
  }
}
