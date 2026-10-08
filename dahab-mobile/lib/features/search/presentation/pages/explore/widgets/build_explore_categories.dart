part of 'explore_widgets_imports.dart';

class BuildExploreCategories extends StatelessWidget {
  final String selectedId;
  final Map<String, int> counts;
  final ValueChanged<String> onChanged;

  const BuildExploreCategories({
    super.key,
    required this.selectedId,
    required this.counts,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return AppCategoryChips(selectedId: selectedId, counts: counts, onChanged: onChanged);
  }
}
