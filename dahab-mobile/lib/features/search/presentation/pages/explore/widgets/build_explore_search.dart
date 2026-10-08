part of 'explore_widgets_imports.dart';

class BuildExploreSearch extends StatelessWidget {
  final ExploreController controller;

  const BuildExploreSearch({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.listeningObs,
      builder: (context, listening) => AppSearchField(
        hint: listening ? Translate.s.ai_voice_listening : Translate.s.explore_search_hint,
        controller: controller.searchController,
        onChanged: controller.onQueryChanged,
        leadingTools: [
          AppSearchToolButton(
            icon: listening ? Icons.stop_rounded : Icons.mic_none_rounded,
            onTap: controller.toggleVoiceSearch,
          ),
          AppSearchToolButton(
            icon: Icons.tag,
            onTap: () {
              final text = controller.searchController.text;
              if (!text.endsWith('#') && text.isNotEmpty && !text.endsWith(' ')) {
                controller.searchController.text = '$text #';
              } else if (text.isEmpty || text.endsWith(' ')) {
                controller.searchController.text = '$text#';
              }
              controller.searchController.selection = TextSelection.collapsed(
                offset: controller.searchController.text.length,
              );
              controller.onQueryChanged(controller.searchController.text);
            },
          ),
          AppSearchToolButton(icon: Icons.search, filled: true, onTap: controller.onSearchPressed),
        ],
      ),
    );
  }
}
