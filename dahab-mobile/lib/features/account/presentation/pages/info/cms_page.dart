part of 'info_imports.dart';

/// A page the website team edits in the CMS (about-dahab, faq,
/// travel-guides), rendered with the same block types the website renders.
class CmsPage extends StatefulWidget {
  final String slug;
  final String fallbackTitle;

  const CmsPage({super.key, required this.slug, required this.fallbackTitle});

  @override
  State<CmsPage> createState() => _CmsPageState();
}

class _CmsPageState extends State<CmsPage> {
  late Future<ApiReply> _load = _fetch();

  Future<ApiReply> _fetch() => RehlaApi.get('content/pages/${widget.slug}?include_blocks=true');

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ApiReply>(
      future: _load,
      builder: (context, snap) {
        if (!snap.hasData) {
          return InfoScaffold(title: widget.fallbackTitle, children: const [InfoLoading()]);
        }
        final reply = snap.data!;
        final page = reply.map['page'];
        if (!reply.ok || page is! Map) {
          return InfoScaffold(
            title: widget.fallbackTitle,
            children: [
              InfoMessage(
                icon: AppIcons.info,
                message: Translate.s.info_load_failed,
                actionLabel: Translate.s.retry,
                onAction: () => setState(() => _load = _fetch()),
              ),
            ],
          );
        }
        final ar = Localizations.localeOf(context).languageCode == 'ar';
        String pick(Map m, String key) {
          final local = (m['${key}_${ar ? 'ar' : 'en'}'] as String? ?? '').trim();
          return local.isNotEmpty ? local : (m['${key}_en'] as String? ?? '').trim();
        }

        final title = pick(page, 'title');
        final subtitle = pick(page, 'subtitle');
        final description = pick(page, 'description');
        final body = pick(page, 'body');
        final hero = infoImageUrl(page['hero_image_url'] as String?);
        final blocks = reply
            .list('blocks')
            .where((b) => (b['visible'] ?? 1) != 0 && b['visible'] != false)
            .toList()
          ..sort((a, b) => ((a['sort_order'] as num?) ?? 0).compareTo((b['sort_order'] as num?) ?? 0));

        final content = <Widget>[
          if (hero != null) ...[
            ClipRRect(
              borderRadius: AppRadius.cardAll,
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(hero, fit: BoxFit.cover, errorBuilder: (_, _, _) => const SizedBox.shrink()),
              ),
            ),
            Gaps.vGap24,
          ],
          if (subtitle.isNotEmpty && description.isNotEmpty) ...[
            _Paragraphs(description, lead: true),
            Gaps.vGap18,
          ],
          if (body.isNotEmpty) ...[_Paragraphs(body), Gaps.vGap24],
          for (final b in blocks) ...[_CmsBlock(block: b, pick: pick), Gaps.vGap18],
        ];

        return InfoScaffold(
          title: title.isEmpty ? widget.fallbackTitle : title,
          intro: subtitle.isNotEmpty ? subtitle : description,
          children: content.isEmpty
              ? [InfoMessage(icon: AppIcons.doc, message: Translate.s.info_empty)]
              : content,
        );
      },
    );
  }
}

class _Paragraphs extends StatelessWidget {
  final String text;
  final bool lead;

  const _Paragraphs(this.text, {this.lead = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final paras = text.split(RegExp(r'\n\s*\n')).map((p) => p.trim()).where((p) => p.isNotEmpty).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < paras.length; i++) ...[
          if (i > 0) Gaps.vGap12,
          Text(
            paras[i],
            style: (lead ? AppTextStyle.s16_w400(color: colors.text) : AppTextStyle.body(color: colors.text2))
                .copyWith(height: 1.65),
          ),
        ],
      ],
    );
  }
}

class _CmsBlock extends StatelessWidget {
  final Map<String, dynamic> block;
  final String Function(Map m, String key) pick;

  const _CmsBlock({required this.block, required this.pick});

  Map<String, dynamic> get _config {
    final raw = block['config'];
    if (raw is Map) return Map<String, dynamic>.from(raw);
    if (raw is String && raw.trim().isNotEmpty) {
      try {
        final decoded = jsonDecode(raw);
        if (decoded is Map) return Map<String, dynamic>.from(decoded);
      } catch (_) {}
    }
    return const {};
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final title = pick(block, 'title');
    final body = pick(block, 'body');
    final config = _config;
    final ar = Localizations.localeOf(context).languageCode == 'ar';
    String local(Map m, String key) {
      final v = (m['${key}_${ar ? 'ar' : 'en'}'] as String? ?? '').trim();
      return v.isNotEmpty ? v : (m['${key}_en'] as String? ?? '').trim();
    }

    Widget heading(String text) => Padding(
          padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
          child: Semantics(
            header: true,
            child: Text(text, style: AppTextStyle.s18_w500(color: colors.text)),
          ),
        );

    switch (block['type']) {
      case 'faq':
        final items = (config['items'] as List? ?? const []).whereType<Map>().toList();
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (title.isNotEmpty) heading(title),
            DecoratedBox(
              decoration: BoxDecoration(
                color: colors.surface1,
                borderRadius: AppRadius.cardAll,
                border: Border.all(color: colors.line),
              ),
              child: Column(
                children: [
                  for (var i = 0; i < items.length; i++) ...[
                    if (i > 0) Divider(height: 1, thickness: 1, color: colors.line, indent: AppSpacing.lg, endIndent: AppSpacing.lg),
                    _FaqItem(question: local(items[i], 'question'), answer: local(items[i], 'answer')),
                  ],
                ],
              ),
            ),
          ],
        );
      case 'image_text':
        final image = infoImageUrl(config['image_url'] as String?);
        return _Card(
          image: image,
          title: title,
          body: body,
        );
      case 'stats':
        final items = (config['items'] as List? ?? const []).whereType<Map>().toList();
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (title.isNotEmpty) heading(title),
            Wrap(
              spacing: AppSpacing.md,
              runSpacing: AppSpacing.md,
              children: [
                for (final s in items)
                  Container(
                    width: (MediaQuery.sizeOf(context).width - AppSpacing.xl * 2 - AppSpacing.md) / 2,
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: colors.surface1,
                      borderRadius: AppRadius.cardAll,
                      border: Border.all(color: colors.line),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${s['value'] ?? ''}', style: AppTextStyle.s24_w700(color: colors.button)),
                        Gaps.vGap4,
                        Text(local(s, 'label'), style: AppTextStyle.caption(color: colors.text2)),
                      ],
                    ),
                  ),
              ],
            ),
          ],
        );
      case 'quote':
        if (body.isEmpty) return const SizedBox.shrink();
        return Container(
          padding: const EdgeInsetsDirectional.only(start: AppSpacing.lg),
          decoration: BoxDecoration(
            border: BorderDirectional(start: BorderSide(color: colors.highlight, width: 3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                body,
                style: AppTextStyle.s18_w400(color: colors.text).copyWith(
                  fontFamily: AppFonts.display(context),
                  fontStyle: FontStyle.italic,
                  height: 1.5,
                ),
              ),
              if ((config['attribution'] as String? ?? '').isNotEmpty) ...[
                Gaps.vGap8,
                Text('— ${config['attribution']}', style: AppTextStyle.caption(color: colors.text3)),
              ],
            ],
          ),
        );
      case 'divider':
        return Divider(height: 1, thickness: 1, color: colors.line);
      case 'cta':
      case 'rich_text':
      default:
        if (title.isEmpty && body.isEmpty) return const SizedBox.shrink();
        return _Card(title: title, body: body, accent: block['type'] == 'cta');
    }
  }
}

class _Card extends StatelessWidget {
  final String? image;
  final String title;
  final String body;
  final bool accent;

  const _Card({this.image, required this.title, required this.body, this.accent = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: accent ? colors.actionWash : colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (image != null)
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Image.network(image!, fit: BoxFit.cover, errorBuilder: (_, _, _) => const SizedBox.shrink()),
            ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (title.isNotEmpty)
                  Semantics(
                    header: true,
                    child: Text(title, style: AppTextStyle.s18_w500(color: colors.text)),
                  ),
                if (title.isNotEmpty && body.isNotEmpty) Gaps.vGap8,
                if (body.isNotEmpty) _Paragraphs(body),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FaqItem extends StatefulWidget {
  final String question;
  final String answer;

  const _FaqItem({required this.question, required this.answer});

  @override
  State<_FaqItem> createState() => _FaqItemState();
}

class _FaqItemState extends State<_FaqItem> {
  var _open = false;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      expanded: _open,
      child: InkWell(
        onTap: () => setState(() => _open = !_open),
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(child: Text(widget.question, style: AppTextStyle.s16_w500(color: colors.text))),
                  Gaps.hGap10,
                  AnimatedRotation(
                    turns: _open ? (Directionality.of(context) == TextDirection.rtl ? -0.25 : 0.25) : 0,
                    duration: const Duration(milliseconds: 200),
                    child: AppIcon.ui(AppIcons.chevron, size: 18, color: colors.text3, mirrorInRtl: true),
                  ),
                ],
              ),
              AnimatedSize(
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeOutCubic,
                alignment: AlignmentDirectional.topStart,
                child: _open
                    ? Padding(
                        padding: const EdgeInsets.only(top: AppSpacing.md),
                        child: Text(widget.answer, style: AppTextStyle.body(color: colors.text2).copyWith(height: 1.6)),
                      )
                    : const SizedBox(width: double.infinity),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
