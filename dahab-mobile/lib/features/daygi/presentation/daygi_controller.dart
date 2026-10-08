part of 'daygi_imports.dart';

class DgMessage {
  final bool fromUser;
  final String text;
  final String why;
  final List<Experience> cards;
  final List<(String, String)> followUps;
  final bool pending;
  final String? note;

  const DgMessage({
    required this.fromUser,
    required this.text,
    this.why = '',
    this.cards = const [],
    this.followUps = const [],
    this.pending = false,
    this.note,
  });
}

/// DayGi: answers with real cards from the catalogue (and the server's own
/// reply when signed in), and keeps a plan that is edited block by block.
class DaygiController {
  final TextEditingController input = TextEditingController();
  final ScrollController scroll = ScrollController();
  final ObsValue<List<DgMessage>> messagesObs = ObsValue.withInit(const []);
  final ObsValue<DayPlan> planObs = ObsValue.withInit(const DayPlan());
  final ObsValue<int> dayObs = ObsValue.withInit(1);
  final ObsValue<bool> planOpenObs = ObsValue.withInit(false);
  final ObsValue<bool> listeningObs = ObsValue.withInit(false);
  final ObsValue<bool> busyObs = ObsValue.withInit(false);

  Future<void> init() async {
    ExperienceCatalogue.instance.ensureLoaded();
    final plan = await DayPlan.load();
    planObs.setValue(plan);
    if (plan.blocks.isNotEmpty) planOpenObs.setValue(true);
  }

  Future<void> send(BuildContext context, [String? text]) async {
    final prompt = (text ?? input.text).trim();
    if (prompt.isEmpty || busyObs.getValue()) return;
    input.clear();
    final arabic = context.isArabic;
    final signedIn = context.read<AuthCubit>().state.authorized;
    busyObs.setValue(true);
    _push(DgMessage(fromUser: true, text: prompt));
    _push(const DgMessage(fromUser: false, text: '', pending: true));

    final days = DaygiMatcher.days(prompt);
    if (days != null) setDays(days);

    final catalogue = ExperienceCatalogue.instance;
    await catalogue.ensureLoaded();
    final cards = DaygiMatcher.match(prompt, catalogue.items, catalogue.live);

    DaygiAnswer? answer;
    if (signedIn) {
      answer = await DaygiRemote.ask(prompt, arabic: arabic, tripId: TripStore.instance.bundle?.trip.id);
    }
    final text0 = answer != null && !answer.signedOut && answer.text.isNotEmpty
        ? answer.text
        : (cards.isEmpty ? Translate.s.dg_local_none : Translate.s.dg_local_reply(cards.length));
    final follow = (answer?.followUps.isNotEmpty ?? false)
        ? answer!.followUps
        : <(String, String)>[
            (Translate.s.dg_try_2, Translate.s.dg_try_2),
            (Translate.s.dg_try_3, Translate.s.dg_try_3),
          ];
    _replaceLast(DgMessage(
      fromUser: false,
      text: text0,
      why: answer?.why ?? '',
      cards: cards,
      followUps: follow,
      note: signedIn ? null : Translate.s.dg_sign_in_note,
    ));
    busyObs.setValue(false);
  }

  void _push(DgMessage m) {
    messagesObs.setValue([...messagesObs.getValue(), m]);
    _toBottom();
  }

  void _replaceLast(DgMessage m) {
    final list = [...messagesObs.getValue()];
    if (list.isNotEmpty) list.removeLast();
    messagesObs.setValue([...list, m]);
    _toBottom();
  }

  void _toBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!scroll.hasClients) return;
      scroll.animateTo(scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 320), curve: Curves.easeOutCubic);
    });
  }

  void _setPlan(DayPlan plan) {
    planObs.setValue(plan);
    plan.save();
  }

  void setDays(int days) {
    _setPlan(planObs.getValue().withDays(days));
    if (dayObs.getValue() > days) dayObs.setValue(days);
  }

  void addToPlan(Experience e) {
    _setPlan(planObs.getValue().add(e, dayObs.getValue()));
    planOpenObs.setValue(true);
  }

  void remove(PlanBlock block) => _setPlan(planObs.getValue().remove(block));

  /// Another open outing of the same kind that is not already in the plan.
  Experience? alternativeFor(PlanBlock block) {
    final catalogue = ExperienceCatalogue.instance;
    final current = catalogue.byId(block.experienceId);
    if (current == null) return null;
    final plan = planObs.getValue();
    final now = DateTime.now();
    final pool = catalogue.items
        .where((e) => e.id != current.id && !plan.has(e.id) && e.openOn(now) && e.isWater == current.isWater)
        .toList()
      ..sort((a, b) => (a.bookable.priceEgp - current.bookable.priceEgp)
          .abs()
          .compareTo((b.bookable.priceEgp - current.bookable.priceEgp).abs()));
    return pool.isEmpty ? null : pool.first;
  }

  void swap(PlanBlock block) {
    final alt = alternativeFor(block);
    if (alt != null) _setPlan(planObs.getValue().swap(block, alt));
  }

  Future<void> toggleVoice(BuildContext context) async {
    final speech = SpeechInputService.instance;
    if (listeningObs.getValue()) {
      await speech.stop();
      listeningObs.setValue(false);
      return;
    }
    final ok = await speech.start(
      onResult: (words, isFinal) {
        input.text = words;
        input.selection = TextSelection.collapsed(offset: words.length);
      },
      onDone: () => listeningObs.setValue(false),
    );
    listeningObs.setValue(ok);
    if (!ok) AppSnackBar.showSimpleToast(msg: Translate.s.dg_voice_unavailable);
  }

  void dispose() {
    input.dispose();
    scroll.dispose();
  }
}
