part of 'discover_imports.dart';

/// Discover tab body (hosted by the Home shell's IndexedStack).
class DiscoverTab extends StatefulWidget {
  final DiscoverController controller;

  const DiscoverTab({super.key, required this.controller});

  @override
  State<DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends State<DiscoverTab> {
  @override
  void initState() {
    super.initState();
    widget.controller.init(context.read<DestinationCubit>().state);
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DestinationCubit, RehlaDestination>(
      listener: (context, destination) => widget.controller.onDestinationChanged(destination),
      builder: (context, destination) {
        return BuildDiscoverBody(controller: widget.controller, destination: destination);
      },
    );
  }
}
