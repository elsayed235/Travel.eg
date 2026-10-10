part of 'info_imports.dart';

/// A reading page: back button, a large title that hands over to a compact
/// one in the bar once it scrolls away, then the content.
class InfoScaffold extends StatefulWidget {
  final String title;
  final String? intro;
  final List<Widget> children;

  const InfoScaffold({super.key, required this.title, this.intro, required this.children});

  @override
  State<InfoScaffold> createState() => _InfoScaffoldState();
}

class _InfoScaffoldState extends State<InfoScaffold> {
  final _scroll = ScrollController();
  final _compact = ValueNotifier(false);

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() => _compact.value = _scroll.offset > 44);
  }

  @override
  void dispose() {
    _scroll.dispose();
    _compact.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            ValueListenableBuilder<bool>(
              valueListenable: _compact,
              builder: (context, compact, _) => AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: compact ? colors.line : Colors.transparent)),
                ),
                height: 52,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                child: Row(
                  children: [
                    InfoBackButton(onTap: () => Navigator.of(context).maybePop()),
                    Expanded(
                      child: AnimatedOpacity(
                        opacity: compact ? 1 : 0,
                        duration: const Duration(milliseconds: 180),
                        child: Text(
                          widget.title,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyle.s16_w500(color: colors.text),
                        ),
                      ),
                    ),
                    const SizedBox(width: 44),
                  ],
                ),
              ),
            ),
            Expanded(
              child: ListView(
                controller: _scroll,
                padding: EdgeInsetsDirectional.fromSTEB(
                  AppSpacing.xl,
                  AppSpacing.xs,
                  AppSpacing.xl,
                  AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
                ),
                children: [
                  Semantics(
                    header: true,
                    child: Text(
                      widget.title,
                      style: AppTextStyle.screenTitle(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                    ),
                  ),
                  if (widget.intro != null && widget.intro!.isNotEmpty) ...[
                    Gaps.vGap8,
                    Text(widget.intro!, style: AppTextStyle.body(color: colors.text2).copyWith(height: 1.55)),
                  ],
                  Gaps.vGap24,
                  ...widget.children,
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class InfoBackButton extends StatelessWidget {
  final VoidCallback onTap;

  const InfoBackButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: MaterialLocalizations.of(context).backButtonTooltip,
      child: InkResponse(
        onTap: onTap,
        radius: 22,
        child: SizedBox.square(
          dimension: 44,
          child: Center(
            child: AppIcon.ui(AppIcons.back, size: 22, color: context.colors.text, mirrorInRtl: true),
          ),
        ),
      ),
    );
  }
}

/// Loading, failed and empty states shared by the server-backed pages.
class InfoLoading extends StatelessWidget {
  const InfoLoading({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.colors.surface2;
    Widget bar(double w, double h) => FractionallySizedBox(
          alignment: AlignmentDirectional.centerStart,
          widthFactor: w,
          child: Container(
            height: h,
            margin: const EdgeInsets.only(bottom: AppSpacing.md),
            decoration: BoxDecoration(color: c, borderRadius: const BorderRadius.all(Radius.circular(6))),
          ),
        );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [bar(1, 120), bar(0.9, 14), bar(0.95, 14), bar(0.6, 14), Gaps.vGap16, bar(1, 72), bar(1, 72)],
    );
  }
}

class InfoMessage extends StatelessWidget {
  final String icon;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  const InfoMessage({super.key, required this.icon, required this.message, this.actionLabel, this.onAction});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(color: colors.surface2, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: AppIcon.ui(icon, size: 24, color: colors.text2),
          ),
          Gaps.vGap16,
          Text(message, textAlign: TextAlign.center, style: AppTextStyle.body(color: colors.text2)),
          if (actionLabel != null && onAction != null) ...[
            Gaps.vGap16,
            OutlinedButton(
              onPressed: onAction,
              style: OutlinedButton.styleFrom(
                foregroundColor: colors.text,
                side: BorderSide(color: colors.line2),
                minimumSize: const Size(120, 44),
                shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              ),
              child: Text(actionLabel!),
            ),
          ],
        ],
      ),
    );
  }
}

/// Server images may be absolute or a path on the website host.
String? infoImageUrl(String? raw) {
  final url = raw?.trim() ?? '';
  if (url.isEmpty) return null;
  if (url.startsWith('http')) return url;
  if (AppConfig.instance.hostUrl.trim().isEmpty) return null;
  return AppConfig.instance.assetUrl(url);
}
