part of 'plan_imports.dart';

/// Plan tab body (hosted by the Home shell's IndexedStack).
class PlanTab extends StatefulWidget {
  final PlanController controller;

  /// Set when a Discover door or pick opened the planner; consumed once.
  final ObsValue<List<PlanVibe>?> presetObs;

  const PlanTab({super.key, required this.controller, required this.presetObs});

  @override
  State<PlanTab> createState() => _PlanTabState();
}

class _PlanTabState extends State<PlanTab> {
  PlanController get controller => widget.controller;

  @override
  void initState() {
    super.initState();
    controller.init(context.read<DestinationCubit>().state).then((_) => _applyPreset());
    // The shell and this tab live as long as the app, so the subscription does too.
    widget.presetObs.listen((_) => _applyPreset());
  }

  void _applyPreset() {
    final vibes = widget.presetObs.getValue();
    if (vibes == null || !mounted) return;
    controller.preset(context.read<DestinationCubit>().state, vibes);
    widget.presetObs.setValue(null);
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<DestinationCubit, RehlaDestination>(
      listener: (_, destination) => controller.syncDestination(destination),
      child: ObsValueConsumer(
        observable: controller.phaseObs,
        builder: (context, phase) => AnimatedSwitcher(
          duration: context.destination.tempo,
          switchInCurve: Curves.easeOutCubic,
          switchOutCurve: Curves.easeInCubic,
          transitionBuilder: (child, animation) => FadeTransition(
            opacity: animation,
            child: ScaleTransition(scale: Tween(begin: 0.98, end: 1.0).animate(animation), child: child),
          ),
          child: switch (phase) {
            PlanPhase.compose => BuildPlanCompose(key: const ValueKey('compose'), controller: controller),
            PlanPhase.building => const BuildPlanBuilding(key: ValueKey('building')),
            PlanPhase.results => BuildPlanResults(key: const ValueKey('results'), controller: controller),
          },
        ),
      ),
    );
  }
}
