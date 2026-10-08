part of 'plan_imports.dart';

enum PlanPhase { compose, building, results }

/// The guided planner (website: components/plan/PlanView). One question per
/// screen; single-choice steps advance on their own, the multi-choice step
/// waits for "Next". Answers are kept on the device so leaving the tab — or
/// the app — never loses them.
class PlanController {
  static const _storageKey = 'rehla_plan_v1';
  static const _tripKey = 'rehla_trip_v1';

  final ProgrammesRequester programmesRequester = ProgrammesRequester();

  final ObsValue<PlanAnswers> answersObs = ObsValue.withInit(const PlanAnswers(destination: RehlaDestination.dahab));
  final ObsValue<int> stepObs = ObsValue.withInit(0);

  /// +1 moving forward, -1 back: which way the question slides.
  final ObsValue<int> directionObs = ObsValue.withInit(1);
  final ObsValue<PlanPhase> phaseObs = ObsValue.withInit(PlanPhase.compose);
  final ObsValue<Set<PlanStep>> answeredObs = ObsValue.withInit(const {});
  final ObsValue<bool> showAllObs = ObsValue.withInit(false);
  final ObsValue<PlanSort> sortObs = ObsValue.withInit(PlanSort.best);
  final ObsValue<String?> busyIdObs = ObsValue.withInit(null);
  final ObsValue<KeptTrip?> keptObs = ObsValue.withInit(null);

  /// The shell switches to the Trip tab when a plan is kept.
  void Function()? onTripKept;

  PlanAnswers get answers => answersObs.getValue();
  PlanStep get step => PlanStep.values[stepObs.getValue()];

  Future<void> init(RehlaDestination destination) async {
    programmesRequester.request();
    answersObs.setValue(PlanAnswers(destination: destination));
    await _loadTrip();
    try {
      final raw = (await SharedPreferences.getInstance()).getString(_storageKey);
      if (raw == null) return;
      final saved = jsonDecode(raw) as Map<String, dynamic>;
      answersObs.setValue(
        PlanAnswers.fromJson(saved['answers'] as Map<String, dynamic>).copyWith(destination: destination),
      );
      stepObs.setValue((saved['step'] as int? ?? 0).clamp(0, PlanStep.values.length - 1));
      answeredObs.setValue({for (final s in (saved['answered'] as List? ?? const [])) ?PlanStep.values.asNameMap()[s]});
      // "Building" is a moment, not a place to come back to.
      final phase = PlanPhase.values.asNameMap()[saved['phase']] ?? PlanPhase.compose;
      phaseObs.setValue(phase == PlanPhase.building ? PlanPhase.results : phase);
    } catch (_) {
      // A corrupt save just means starting fresh.
    }
  }

  Future<void> _persist() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        _storageKey,
        jsonEncode({
          'answers': answers.toJson(),
          'step': stepObs.getValue(),
          'phase': phaseObs.getValue().name,
          'answered': answeredObs.getValue().map((s) => s.name).toList(),
        }),
      );
    } catch (_) {}
  }

  /// A door or pick opened the planner: start in that place with those wishes
  /// and ask the next thing (how long). The door is the newer intent.
  void preset(RehlaDestination destination, List<PlanVibe> vibes) {
    answersObs.setValue(PlanAnswers(destination: destination, vibes: vibes));
    answeredObs.setValue({PlanStep.destination, if (vibes.isNotEmpty) PlanStep.vibes});
    directionObs.setValue(1);
    stepObs.setValue(PlanStep.when.index);
    phaseObs.setValue(PlanPhase.compose);
    showAllObs.setValue(false);
    _persist();
  }

  /// The app's place changed elsewhere (Discover): plans follow it.
  void syncDestination(RehlaDestination destination) {
    if (answers.destination == destination) return;
    answersObs.setValue(answers.copyWith(destination: destination));
    _persist();
  }

  void answer(PlanAnswers next, {bool advance = false}) {
    answersObs.setValue(next);
    answeredObs.setValue({...answeredObs.getValue(), step});
    _persist();
    if (advance) {
      // A beat to see the choice land before the next question slides in.
      Future.delayed(const Duration(milliseconds: 260), this.next);
    }
  }

  Future<void> chooseDestination(BuildContext context, RehlaDestination destination) async {
    answer(answers.copyWith(destination: destination), advance: true);
    // Choosing a place re-themes the app, as on the website.
    await context.read<DestinationCubit>().select(context, destination);
  }

  void toggleVibe(PlanVibe vibe) {
    final vibes = answers.vibes.contains(vibe)
        ? (answers.vibes.where((v) => v != vibe).toList())
        : [...answers.vibes, vibe];
    answer(answers.copyWith(vibes: vibes));
  }

  bool isAnswered(PlanStep s) => answeredObs.getValue().contains(s);

  void next() {
    if (stepObs.getValue() >= PlanStep.values.length - 1) {
      finish();
      return;
    }
    directionObs.setValue(1);
    stepObs.setValue(stepObs.getValue() + 1);
    _persist();
  }

  void back() {
    if (stepObs.getValue() == 0) return;
    directionObs.setValue(-1);
    stepObs.setValue(stepObs.getValue() - 1);
    _persist();
  }

  /// A short "shaping your plans" beat, then the results.
  void finish({bool all = false}) {
    showAllObs.setValue(all);
    phaseObs.setValue(PlanPhase.building);
    Future.delayed(const Duration(milliseconds: 1100), () {
      if (phaseObs.getValue() == PlanPhase.building) phaseObs.setValue(PlanPhase.results);
      _persist();
    });
  }

  void editAnswers() {
    directionObs.setValue(-1);
    stepObs.setValue(0);
    phaseObs.setValue(PlanPhase.compose);
    _persist();
  }

  void startOver(RehlaDestination destination) {
    answersObs.setValue(PlanAnswers(destination: destination));
    answeredObs.setValue(const {});
    editAnswers();
  }

  List<PlanMatch> matchesFrom(List<ProgrammeDomainModel> programmes) => PlanMatcher.rank(programmes, answers);

  /// Top three when showing matches; every plan, sorted, when showing all.
  List<PlanMatch> visible(List<PlanMatch> matches) =>
      showAllObs.getValue() ? PlanMatcher.sort(matches, sortObs.getValue()) : matches.take(3).toList();

  void openProgramme(BuildContext context, PlanMatch match) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: context.colors.bg,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (_) => BuildProgrammeSheet(
        match: match,
        onKeep: () => keepTrip(match.programme),
        onRequest: () => requestPlan(context, match.programme),
      ),
    );
  }

  /// The chosen plan becomes the trip. Nothing is sent until [requestPlan].
  Future<void> keepTrip(ProgrammeDomainModel programme) async {
    final current = keptObs.getValue();
    final sent = current != null && current.id == programme.id && current.sent;
    keptObs.setValue(KeptTrip.fromProgramme(programme, sent: sent));
    await _persistTrip();
    onTripKept?.call();
  }

  Future<void> _loadTrip() async {
    try {
      final raw = (await SharedPreferences.getInstance()).getString(_tripKey);
      if (raw == null) return;
      keptObs.setValue(KeptTrip.fromJson(jsonDecode(raw) as Map<String, dynamic>));
    } catch (_) {}
  }

  Future<void> _persistTrip() async {
    final prefs = await SharedPreferences.getInstance();
    final trip = keptObs.getValue();
    if (trip == null) {
      await prefs.remove(_tripKey);
      return;
    }
    await prefs.setString(_tripKey, jsonEncode(trip.toJson()));
  }

  /// Sends the plan to the operations team, who confirm it with local hosts
  /// and reply on WhatsApp. Needs a session. A kept trip is marked sent.
  Future<void> requestPlan(BuildContext context, ProgrammeDomainModel programme) async {
    if (!AuthSession.isAuthorized(context)) {
      AppSnackBar.showSimpleToast(msg: Translate.s.plan_request_signIn);
      await AuthSession.requireAuthThen(context, () async {});
      return;
    }
    busyIdObs.setValue(programme.id);
    final result = await getIt<PlanRepository>().requestPlan(programme, answers);
    busyIdObs.setValue(null);
    if (result.isSuccess) {
      final current = keptObs.getValue();
      if (current != null && current.id == programme.id) {
        keptObs.setValue(current.copyWith(sent: true));
      } else {
        keptObs.setValue(KeptTrip.fromProgramme(programme, sent: true));
      }
      await _persistTrip();
    }
    AppSnackBar.showSimpleToast(
      msg: result.isSuccess ? Translate.s.plan_request_sent : Translate.s.plan_request_failed,
    );
  }

  void dispose() => programmesRequester.close();
}
