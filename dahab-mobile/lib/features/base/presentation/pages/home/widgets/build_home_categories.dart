part of 'home_widgets_imports.dart';

/// Filters the request list directly below it.
class BuildHomeCategories extends StatelessWidget {
  final String selectedId;
  final List<ListingDomainModel> listings;
  final ValueChanged<String> onChanged;

  const BuildHomeCategories({
    super.key,
    required this.selectedId,
    required this.listings,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final counts = <String, int>{'all': listings.length};
    for (final l in listings) {
      counts[l.categoryId] = (counts[l.categoryId] ?? 0) + 1;
    }
    return AppCategoryChips(selectedId: selectedId, counts: counts, onChanged: onChanged);
  }
}
