part of 'plan_imports.dart';

enum PlanPhase { compose, building, results }

/// The guided planner (website: components/plan/PlanView). One question per
/// screen; single-choice steps advance on their own, the multi-choice step
/// waits for "Next". Answers are kept on the device so leaving the tab — or
/// the app — never loses them.
class PlanController {
  static const _storageKey = 'rehla_plan_v1';
  static const _plansKey = 'rehla_plans_v1';

  /// The single kept plan of earlier builds; folded into [_plansKey] once.
  static const _legacyTripKey = 'rehla_trip_v1';

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
  /// Every plan the traveler saved, newest first. The Trip tab lists them.
  final ObsValue<List<KeptTrip>> savedObs = ObsValue.withInit(const []);

  /// The plan just saved: the shell shows "Saved · See your plans" for it.
  final ObsValue<KeptTrip?> justSavedObs = ObsValue.withInit(null);
  Timer? _justSavedTimer;

  /// The shell opens the saved plans (the Trip tab).
  void Function()? onSeePlans;

  PlanAnswers get answers => answersObs.getValue();
  PlanStep get step => PlanStep.values[stepObs.getValue()];

  Future<void> init(RehlaDestination destination) async {
    programmesRequester.request();
    answersObs.setValue(PlanAnswers(destination: destination));
    await loadPlans();
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
        saved: savedObs,
        onSave: () => toggleSaved(match.programme),
        onRequest: () => requestPlan(context, match.programme),
      ),
    );
  }

  bool isSaved(String id) => savedObs.getValue().any((t) => t.id == id);

  /// Saving is one tap and stays where you are: the plan joins the list and
  /// a short confirmation offers the way to it. Tapping again un-saves.
  Future<void> toggleSaved(ProgrammeDomainModel programme) async {
    if (isSaved(programme.id)) {
      await removePlan(programme.id);
      return;
    }
    HapticFeedback.mediumImpact();
    final trip = KeptTrip.fromProgramme(programme);
    savedObs.setValue([trip, ...savedObs.getValue()]);
    await _persistPlans();
    justSavedObs.setValue(trip);
    _justSavedTimer?.cancel();
    _justSavedTimer = Timer(const Duration(seconds: 4), () => justSavedObs.setValue(null));
  }

  Future<void> removePlan(String id) async {
    savedObs.setValue(savedObs.getValue().where((t) => t.id != id).toList());
    if (justSavedObs.getValue()?.id == id) justSavedObs.setValue(null);
    await _persistPlans();
  }

  void seePlans() {
    _justSavedTimer?.cancel();
    justSavedObs.setValue(null);
    onSeePlans?.call();
  }

  /// The saved plans from this phone (and the one plan earlier builds kept).
  Future<void> loadPlans() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_plansKey);
      if (raw != null) {
        savedObs.setValue([
          for (final item in jsonDecode(raw) as List)
            if (item is Map) ?KeptTrip.fromJson(Map<String, dynamic>.from(item)),
        ]);
        return;
      }
      final legacy = prefs.getString(_legacyTripKey);
      if (legacy == null) return;
      final trip = KeptTrip.fromJson(jsonDecode(legacy) as Map<String, dynamic>);
      if (trip != null) savedObs.setValue([trip]);
      await _persistPlans();
      await prefs.remove(_legacyTripKey);
    } catch (_) {}
  }

  Future<void> _persistPlans() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_plansKey, jsonEncode([for (final t in savedObs.getValue()) t.toJson()]));
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
      // A sent plan is kept too, marked sent, so it never goes missing.
      final saved = savedObs.getValue();
      savedObs.setValue(
        isSaved(programme.id)
            ? [for (final t in saved) t.id == programme.id ? t.copyWith(sent: true) : t]
            : [KeptTrip.fromProgramme(programme, sent: true), ...saved],
      );
      await _persistPlans();
    }
    AppSnackBar.showSimpleToast(
      msg: result.isSuccess ? Translate.s.plan_request_sent : Translate.s.plan_request_failed,
    );
  }

  void dispose() {
    _justSavedTimer?.cancel();
    programmesRequester.close();
  }
}
