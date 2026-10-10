part of 'home_imports.dart';

/// The app shell: Home · Discover · DayGi · Trip (Today on trip days) ·
/// Account. The planner is reached from Home's ready-made trips and the
/// empty Trip tab, and sits behind the tabs with its own back control.
class HomeController {
  static const planIndex = 5;

  final AccountController accountController = AccountController();
  final PlanController planController = PlanController();
  final ExploreController exploreController = ExploreController();
  final DaygiController daygiController = DaygiController();
  final TodayController todayController = TodayController();
  final ScrollController discoverScroll = ScrollController();
  late final DiscoverController discoverController = DiscoverController(
    onDoor: _openDoor,
    onAsk: askDaygi,
    onSeeToday: () => _go(ShellActions.discover),
    onSearch: () => _openSearch(),
  );

  /// What the planner should start with when a door opened it.
  final ObsValue<List<PlanVibe>?> planPresetObs = ObsValue.withInit(null);
  final ObsValue<int> navIndexObs = ObsValue.withInit(ShellActions.home);

  late BuildContext _context;
  int _beforePlan = ShellActions.home;
  final List<StreamSubscription<dynamic>> _subs = [];

  void init(BuildContext context) {
    _context = context;
    accountController.ensureLoaded();
    daygiController.init();
    todayController.init();
    ExperienceCatalogue.instance.ensureLoaded();
    planController.onSeePlans = () => _go(ShellActions.trip);
    ShellActions.install(openTab: _go, askDaygi: (q) => askDaygi(q, false));

    final auth = context.read<AuthCubit>();
    final user = context.read<UserCubit>();
    void syncTrip() => TripStore.instance.load(auth.state.authorized ? user.state.model?.id : null);
    syncTrip();
    _subs
      ..add(auth.stream.listen((_) => syncTrip()))
      ..add(user.stream.listen((_) => syncTrip()));
  }

  /// The tab the bar highlights; the planner keeps the tab it came from lit.
  int barIndex(int index) => index == planIndex ? _beforePlan : index;

  void _go(int index) {
    if (index != planIndex) _beforePlan = index;
    navIndexObs.setValue(index);
    if (index == ShellActions.account) accountController.ensureLoaded();
    if (index == ShellActions.trip) TripStore.instance.refresh();
  }

  void onNavChanged(BuildContext context, int index) {
    if (index == navIndexObs.getValue()) {
      if (index == ShellActions.home && discoverScroll.hasClients) {
        final reduce = MediaQuery.disableAnimationsOf(context);
        discoverScroll.animateTo(
          0,
          duration: reduce ? Duration.zero : context.read<DestinationCubit>().state.tempo,
          curve: Curves.easeOutCubic,
        );
      }
      return;
    }
    _go(index);
  }

  /// Back from the planner to the tab that opened it.
  void closePlan() => navIndexObs.setValue(_beforePlan);

  /// Open the planner, already set to [vibes].
  void openPlan(List<PlanVibe> vibes) {
    // A fresh list every time: the observable only notifies on a new value.
    planPresetObs.setValue(List.of(vibes));
    _beforePlan = barIndex(navIndexObs.getValue());
    navIndexObs.setValue(planIndex);
  }

  /// A ready-made trip, opened the same way the planner opens one.
  void openProgramme(BuildContext context, ProgrammeDomainModel programme) {
    planController.openProgramme(context, PlanMatch(programme, 0, const []));
  }

  /// A saved plan, day by day, over the shell.
  void openSavedPlan(BuildContext context, KeptTrip plan) {
    Navigator.of(context).push(
      RehlaPageRoute<void>(
        builder: (_) => SavedPlanPage(
          id: plan.id,
          plans: planController.savedObs,
          onSend: (p) => planController.requestPlan(_context, p.toProgramme()),
          onRemove: (p) => planController.removePlan(p.id),
          onChange: () => openPlan(const []),
        ),
      ),
    );
  }

  /// "Compare" lands on every plan, not a new questionnaire.
  void showAllPlans() {
    planController.finish(all: true);
    _beforePlan = barIndex(navIndexObs.getValue());
    navIndexObs.setValue(planIndex);
  }

  /// DayGi is a tab: open it, ask [question] if there is one, or listen.
  void askDaygi(String? question, bool voice) {
    _go(ShellActions.daygi);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_context.mounted) return;
      if (question != null && question.trim().isNotEmpty) {
        daygiController.send(_context, question);
      } else if (voice) {
        daygiController.toggleVoice(_context);
      }
    });
  }

  /// Sea and desert pictograms open Discover filtered; the others ask DayGi.
  /// Places without a live catalogue keep the planner.
  void _openDoor(DiscoverDoor door) {
    if (door.asksDaygi) {
      askDaygi(door.ask(_context.isArabic), false);
      return;
    }
    if (_context.read<DestinationCubit>().state != RehlaDestination.dahab) {
      openPlan(door.planVibes);
      return;
    }
    final (kind, query) = switch (door.id) {
      'kite' => (ExploreKind.sea, _context.isArabic ? 'كايت' : 'kite'),
      'desert' => (ExploreKind.desert, ''),
      'dive' => (ExploreKind.sea, ''),
      _ => (ExploreKind.all, ''),
    };
    _openSearch(kind: kind, query: query);
  }

  void _openSearch({ExploreKind kind = ExploreKind.all, String query = ''}) {
    Navigator.of(_context).push(RehlaPageRoute<void>(builder: (_) => SearchPage(kind: kind, query: query)));
  }

  static const _exitWindow = Duration(seconds: 2);

  /// Shows the "press back again to exit" hint above the bar.
  final ObsValue<bool> exitHintObs = ObsValue.withInit(false);
  DateTime? _exitArmedAt;
  Timer? _exitHintTimer;

  /// System back on the shell: out of the planner, then back to Home; on Home
  /// a second press within [_exitWindow] leaves the app.
  void onBack() {
    final index = navIndexObs.getValue();
    if (index == planIndex) {
      closePlan();
      return;
    }
    if (index != ShellActions.home) {
      _go(ShellActions.home);
      return;
    }
    final now = DateTime.now();
    final armed = _exitArmedAt;
    if (armed != null && now.difference(armed) < _exitWindow) {
      SystemNavigator.pop();
      return;
    }
    _exitArmedAt = now;
    HapticFeedback.selectionClick();
    exitHintObs.setValue(true);
    _exitHintTimer?.cancel();
    _exitHintTimer = Timer(_exitWindow, () => exitHintObs.setValue(false));
  }

  void dispose() {
    _exitHintTimer?.cancel();
    for (final s in _subs) {
      s.cancel();
    }
    ShellActions.uninstall();
    discoverScroll.dispose();
    accountController.dispose();
    discoverController.dispose();
    planController.dispose();
    exploreController.dispose();
    daygiController.dispose();
    todayController.dispose();
  }
}
