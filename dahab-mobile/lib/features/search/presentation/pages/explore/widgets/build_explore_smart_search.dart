part of 'explore_widgets_imports.dart';

/// Under the search field: "try it" prompts when idle, a progress row while
/// the query is being understood, and what we understood once it is.
class BuildExploreSmartSearch extends StatelessWidget {
  final ExploreController controller;
  final String query;

  const BuildExploreSmartSearch({super.key, required this.controller, required this.query});

  String _categoryLabel(String id) {
    for (final c in AppCategories.withAll) {
      if (c.id == id) return c.label;
    }
    return id;
  }

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.smartSearchingObs,
      builder: (context, searching) {
        return ObsValueConsumer(
          observable: controller.smartSearchObs,
          builder: (context, smart) {
            if (searching) return _loading(context);
            if (smart != null) return _understood(context, smart);
            if (query.isEmpty) return _tryPrompts(context);
            return const SizedBox.shrink();
          },
        );
      },
    );
  }

  Widget _loading(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.md),
      child: Row(
        children: [
          SizedBox(
            width: 14,
            height: 14,
            child: CircularProgressIndicator(strokeWidth: 1.6, color: context.colors.green),
          ),
          Gaps.hGap9,
          Text(
            Translate.s.ai_search_loading,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
        ],
      ),
    );
  }

  Widget _understood(BuildContext context, SmartSearchDomainModel smart) {
    return Container(
      margin: const EdgeInsets.only(top: AppSpacing.md),
      padding: const EdgeInsetsDirectional.fromSTEB(
        AppSpacing.lg,
        AppSpacing.sm,
        AppSpacing.xs,
        AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: context.colors.greenBg,
        borderRadius: AppRadius.cardAll,
      ),
      child: Row(
        children: [
          Icon(Icons.auto_awesome, size: 16, color: context.colors.green),
          Gaps.hGap9,
          Expanded(
            child: Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.xs,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                Text(
                  Translate.s.ai_search_understood,
                  style: AppTextStyle.caption(color: context.colors.green),
                ),
                if (smart.categoryId != null)
                  _Tag(label: _categoryLabel(smart.categoryId!), strong: true),
                for (final k in smart.keywords) _Tag(label: k),
              ],
            ),
          ),
          TextButton(
            onPressed: controller.clearSmartSearch,
            child: Text(
              Translate.s.ai_search_clear,
              style: AppTextStyle.caption(color: context.colors.green),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tryPrompts(BuildContext context) {
    final examples = [
      Translate.s.ai_search_example_1,
      Translate.s.ai_search_example_2,
      Translate.s.ai_search_example_3,
    ];
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome_outlined, size: 14, color: context.colors.green),
              Gaps.hGap6,
              Text(
                Translate.s.ai_search_try_title,
                style: AppTextStyle.micro(color: context.colors.text2),
              ),
            ],
          ),
          Gaps.vGap6,
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (final e in examples) ...[
                  Material(
                    color: context.colors.surface1,
                    borderRadius: AppRadius.chipAll,
                    child: InkWell(
                      onTap: () => controller.runSmartSearch(e),
                      borderRadius: AppRadius.chipAll,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.lg,
                          vertical: AppSpacing.sm,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: AppRadius.chipAll,
                          border: Border.all(color: context.colors.line),
                        ),
                        child: Text(e, style: AppTextStyle.caption(color: context.colors.text)),
                      ),
                    ),
                  ),
                  Gaps.hGap6,
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  final String label;
  final bool strong;

  const _Tag({required this.label, this.strong = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 2),
      decoration: BoxDecoration(
        color: strong ? context.colors.green : context.colors.surface1,
        borderRadius: AppRadius.chipAll,
      ),
      child: Text(
        label,
        style: AppTextStyle.caption(
          color: strong ? context.colors.surface1 : context.colors.text,
        ),
      ),
    );
  }
}
