part of 'info_imports.dart';

/// Terms and privacy as numbered sections a traveler can scan.
class LegalPage extends StatelessWidget {
  final String title;
  final String intro;
  final List<(String, String)> sections;

  const LegalPage({super.key, required this.title, required this.intro, required this.sections});

  factory LegalPage.terms() => LegalPage(
        title: Translate.s.account_terms,
        intro: Translate.s.terms_intro,
        sections: [
          (Translate.s.terms_1_title, Translate.s.terms_1_body),
          (Translate.s.terms_2_title, Translate.s.terms_2_body),
          (Translate.s.terms_3_title, Translate.s.terms_3_body),
          (Translate.s.terms_4_title, Translate.s.terms_4_body),
          (Translate.s.terms_5_title, Translate.s.terms_5_body),
          (Translate.s.terms_6_title, Translate.s.terms_6_body),
          (Translate.s.terms_7_title, Translate.s.terms_7_body),
        ],
      );

  factory LegalPage.privacy() => LegalPage(
        title: Translate.s.account_privacy,
        intro: Translate.s.privacy_intro,
        sections: [
          (Translate.s.privacy_1_title, Translate.s.privacy_1_body),
          (Translate.s.privacy_2_title, Translate.s.privacy_2_body),
          (Translate.s.privacy_3_title, Translate.s.privacy_3_body),
          (Translate.s.privacy_4_title, Translate.s.privacy_4_body),
          (Translate.s.privacy_5_title, Translate.s.privacy_5_body),
          (Translate.s.privacy_6_title, Translate.s.privacy_6_body),
          (Translate.s.privacy_7_title, Translate.s.privacy_7_body),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return InfoScaffold(
      title: title,
      intro: intro,
      children: [
        for (final (i, (heading, body)) in sections.indexed) ...[
          if (i > 0) Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.xl),
            child: Divider(height: 1, thickness: 1, color: colors.line),
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 26,
                height: 26,
                margin: const EdgeInsets.only(top: 1),
                decoration: BoxDecoration(color: colors.actionWash, shape: BoxShape.circle),
                alignment: Alignment.center,
                child: Text('${i + 1}', style: AppTextStyle.s12_w600(color: colors.button)),
              ),
              Gaps.hGap12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Semantics(
                      header: true,
                      child: Text(heading, style: AppTextStyle.s16_w500(color: colors.text)),
                    ),
                    Gaps.vGap6,
                    Text(body, style: AppTextStyle.body(color: colors.text2).copyWith(height: 1.65)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
