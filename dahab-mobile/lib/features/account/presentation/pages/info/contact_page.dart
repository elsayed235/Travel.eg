part of 'info_imports.dart';

/// The website footer's contact, hours and social slots (content/site-info).
/// Slots the team hasn't filled are hidden, never shown as placeholders.
class ContactPage extends StatefulWidget {
  final VoidCallback? onAskDaygi;

  const ContactPage({super.key, this.onAskDaygi});

  @override
  State<ContactPage> createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage> {
  late Future<ApiReply> _load = RehlaApi.get('content/site-info');

  @override
  Widget build(BuildContext context) {
    final title = Translate.s.account_contact;
    return FutureBuilder<ApiReply>(
      future: _load,
      builder: (context, snap) {
        if (!snap.hasData) return InfoScaffold(title: title, children: const [InfoLoading()]);
        final reply = snap.data!;
        if (!reply.ok) {
          return InfoScaffold(
            title: title,
            children: [
              InfoMessage(
                icon: AppIcons.info,
                message: Translate.s.info_load_failed,
                actionLabel: Translate.s.retry,
                onAction: () => setState(() => _load = RehlaApi.get('content/site-info')),
              ),
            ],
          );
        }
        final info = reply.map['info'] is Map ? Map<String, dynamic>.from(reply.map['info'] as Map) : const <String, dynamic>{};
        final ar = Localizations.localeOf(context).languageCode == 'ar';
        String slot(String group, String key) {
          final g = info[group];
          if (g is! Map) return '';
          final v = g[key];
          if (v is! Map) return '';
          final local = ar ? (v['valueAr'] as String? ?? '').trim() : '';
          return local.isNotEmpty ? local : (v['value'] as String? ?? '').trim();
        }

        final phone = slot('contact', 'contact.phone');
        final whatsapp = slot('contact', 'contact.whatsapp');
        final email = slot('contact', 'contact.email');
        final address = slot('contact', 'contact.address');
        final hours = [
          (Translate.s.contact_weekdays, slot('hours', 'hours.weekday')),
          (Translate.s.contact_weekend, slot('hours', 'hours.weekend')),
          (Translate.s.contact_holidays, slot('hours', 'hours.holidays')),
        ].where((h) => h.$2.isNotEmpty).toList();
        final social = [
          ('Instagram', slot('social', 'social.instagram')),
          ('Facebook', slot('social', 'social.facebook')),
          ('TikTok', slot('social', 'social.tiktok')),
          ('YouTube', slot('social', 'social.youtube')),
          (Uri.tryParse(slot('social', 'social.website'))?.host ?? '', slot('social', 'social.website')),
        ].where((s) => s.$2.startsWith('http')).toList();

        final reach = <Widget>[
          if (phone.isNotEmpty)
            GroupedRow(
              icon: AppIcons.call,
              tint: GroupedTint.lagoon,
              title: Translate.s.contact_call,
              subtitle: phone,
              onTap: () => ShareServices.instance.callPhone(phone: phone.replaceAll(RegExp(r'[^\d+]'), '')),
            ),
          if (whatsapp.isNotEmpty)
            GroupedRow(
              icon: AppIcons.chat,
              tint: GroupedTint.green,
              title: Translate.s.contact_whatsapp,
              subtitle: whatsapp,
              external: true,
              onTap: () => ShareServices.instance.launchURL(url: 'https://wa.me/${whatsapp.replaceAll(RegExp(r'\D'), '')}'),
            ),
          if (email.isNotEmpty)
            GroupedRow(
              icon: AppIcons.mail,
              tint: GroupedTint.coral,
              title: Translate.s.contact_email,
              subtitle: email,
              onTap: () => ShareServices.instance.sendEmail(email: email),
            ),
          if (address.isNotEmpty)
            GroupedRow(icon: AppIcons.pin, title: Translate.s.contact_address, subtitle: address),
        ];

        return InfoScaffold(
          title: title,
          intro: Translate.s.contact_intro,
          children: [
            if (reach.isEmpty && hours.isEmpty && social.isEmpty)
              InfoMessage(
                icon: AppIcons.chat,
                message: Translate.s.contact_unset,
                actionLabel: widget.onAskDaygi == null ? null : Translate.s.account_ask_daygi,
                onAction: widget.onAskDaygi,
              ),
            if (reach.isNotEmpty) ...[GroupedSection(children: reach), Gaps.vGap24],
            if (hours.isNotEmpty) ...[
              GroupedSection(
                title: Translate.s.contact_hours,
                children: [
                  for (final (label, value) in hours)
                    GroupedRow(icon: AppIcons.clock, title: label, subtitle: value),
                ],
              ),
              Gaps.vGap24,
            ],
            if (social.isNotEmpty)
              GroupedSection(
                title: Translate.s.contact_follow,
                children: [
                  for (final (name, url) in social)
                    GroupedRow(
                      icon: AppIcons.globe,
                      title: name,
                      external: true,
                      onTap: () => ShareServices.instance.launchURL(url: url),
                    ),
                ],
              ),
          ],
        );
      },
    );
  }
}
