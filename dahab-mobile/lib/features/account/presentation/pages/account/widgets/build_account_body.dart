part of 'account_widgets_imports.dart';

/// The Account tab works the same signed in or not: everything a traveler
/// needs (help, safety, language, appearance, the fine print) is here
/// before an account exists; signing in only adds the profile on top.
class BuildAccountBody extends StatelessWidget {
  final AccountController controller;

  const BuildAccountBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthCubit, AuthState>(
      builder: (context, authState) {
        if (!authState.authorized) {
          return _AccountList(controller: controller, top: [BuildAccountGuestCard(controller: controller)]);
        }
        return RequesterConsumer<AccountProfileDomainModel>(
          requester: controller.accountRequester,
          loadingBuilder: (_) => _AccountList(controller: controller, signedIn: true, top: const [_ProfilePlaceholder()]),
          failureBuilder: (context, error, callback) => _AccountList(
            controller: controller,
            signedIn: true,
            top: [
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: context.colors.surface1,
                  borderRadius: AppRadius.cardAll,
                  border: Border.all(color: context.colors.line),
                ),
                child: Row(
                  children: [
                    Expanded(child: Text(error.message, style: AppTextStyle.body(color: context.colors.text2))),
                    TextButton(onPressed: callback, child: Text(Translate.s.retry)),
                  ],
                ),
              ),
            ],
          ),
          successBuilder: (context, profile, _) {
            controller.applyProfile(profile);
            return _AccountList(
              controller: controller,
              signedIn: true,
              top: [BuildAccountHeader(profile: profile, onEdit: () => controller.openEditProfile(context))],
            );
          },
        );
      },
    );
  }
}

class _AccountList extends StatelessWidget {
  final AccountController controller;
  final bool signedIn;
  final List<Widget> top;

  const _AccountList({required this.controller, required this.top, this.signedIn = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ListView(
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.xl,
        AppSpacing.lg,
        AppSpacing.xl,
        AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
      ),
      children: [
        Semantics(
          header: true,
          child: Text(
            Translate.s.account_title,
            style: AppTextStyle.screenTitle(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
          ),
        ),
        Gaps.vGap18,
        ...top,
        Gaps.vGap24,
        if (signedIn) ...[
          GroupedSection(
            title: Translate.s.account_section_profile,
            children: [
              GroupedRow(
                icon: AppIcons.user,
                tint: GroupedTint.lagoon,
                title: Translate.s.account_edit_profile,
                onTap: () => controller.openEditProfile(context),
              ),
              GroupedRow(
                icon: AppIcons.bell,
                tint: GroupedTint.amber,
                title: Translate.s.account_notifications,
                onTap: () => controller.openNotifications(context),
              ),
            ],
          ),
          Gaps.vGap24,
        ],
        GroupedSection(
          title: Translate.s.account_section_trip,
          children: [
            GroupedRow(
              icon: AppIcons.sparkle,
              tint: GroupedTint.lagoon,
              title: Translate.s.account_ask_daygi,
              subtitle: Translate.s.account_ask_daygi_hint,
              onTap: () => ShellActions.askDaygi(null),
            ),
            GroupedRow(
              icon: AppIcons.calendar,
              tint: GroupedTint.coral,
              title: Translate.s.account_my_trip,
              subtitle: Translate.s.account_my_trip_hint,
              onTap: () => ShellActions.openTab(ShellActions.trip),
            ),
          ],
        ),
        Gaps.vGap24,
        GroupedSection(
          title: Translate.s.account_section_help,
          children: [
            GroupedRow(
              icon: AppIcons.sos,
              tint: GroupedTint.red,
              title: Translate.s.account_emergency,
              subtitle: Translate.s.account_emergency_hint,
              onTap: () => controller.open(context, const EmergencyPage()),
            ),
            GroupedRow(
              icon: AppIcons.chat,
              tint: GroupedTint.green,
              title: Translate.s.account_contact,
              subtitle: Translate.s.account_contact_hint,
              onTap: () => controller.open(context, ContactPage(onAskDaygi: () => controller.askDaygiFrom(context))),
            ),
            GroupedRow(
              icon: AppIcons.question,
              tint: GroupedTint.lagoon,
              title: Translate.s.account_faq,
              onTap: () => controller.open(context, CmsPage(slug: 'faq', fallbackTitle: Translate.s.account_faq)),
            ),
            GroupedRow(
              icon: AppIcons.book,
              tint: GroupedTint.amber,
              title: Translate.s.account_guides,
              onTap: () => controller.open(
                context,
                CmsPage(slug: 'travel-guides', fallbackTitle: Translate.s.account_guides),
              ),
            ),
          ],
        ),
        Gaps.vGap24,
        GroupedSection(
          title: Translate.s.account_section_preferences,
          children: [
            BlocBuilder<DeviceCubit, DeviceState>(
              buildWhen: (a, b) => a.model.locale != b.model.locale,
              builder: (context, state) => GroupedRow(
                icon: AppIcons.globe,
                tint: GroupedTint.lagoon,
                title: Translate.s.prefs_language,
                value: controller.languageLabel(state.model.locale),
                onTap: () => showPreferencesSheet(context),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Translate.s.prefs_appearance, style: AppTextStyle.s14_w500(color: colors.text)),
                  Gaps.vGap12,
                  const BuildAppearancePicker(),
                ],
              ),
            ),
          ],
        ),
        Gaps.vGap24,
        GroupedSection(
          title: Translate.s.account_section_about,
          children: [
            GroupedRow(
              icon: AppIcons.info,
              title: Translate.s.account_about,
              onTap: () => controller.open(
                context,
                CmsPage(slug: 'about-dahab', fallbackTitle: Translate.s.account_about),
              ),
            ),
            GroupedRow(
              icon: AppIcons.doc,
              title: Translate.s.account_terms,
              onTap: () => controller.open(context, LegalPage.terms()),
            ),
            GroupedRow(
              icon: AppIcons.shield,
              title: Translate.s.account_privacy,
              onTap: () => controller.open(context, LegalPage.privacy()),
            ),
          ],
        ),
        if (signedIn) ...[
          Gaps.vGap24,
          GroupedSection(
            children: [
              GroupedRow(
                icon: AppIcons.logout,
                title: Translate.s.label_logout,
                destructive: true,
                chevron: false,
                onTap: () => controller.confirmLogout(context),
              ),
            ],
          ),
        ],
        Gaps.vGap32,
        Center(
          child: Opacity(
            opacity: 0.7,
            child: Column(
              children: [
                RehlaMark(size: 28, color: colors.text3, sunColor: colors.highlight),
                Gaps.vGap6,
                Text(Translate.s.splash_line, textAlign: TextAlign.center, style: AppTextStyle.caption(color: colors.text3)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// Not signed in: what an account adds, and the two ways in.
class BuildAccountGuestCard extends StatelessWidget {
  final AccountController controller;

  const BuildAccountGuestCard({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
        gradient: LinearGradient(
          begin: AlignmentDirectional.topStart,
          end: AlignmentDirectional.bottomEnd,
          colors: [colors.actionWash, colors.surface1],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: colors.surface1,
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.line),
                ),
                alignment: Alignment.center,
                child: AppIcon.ui(AppIcons.user, size: 22, color: colors.button),
              ),
              Gaps.hGap12,
              Expanded(
                child: Text(
                  Translate.s.account_guest_title,
                  style: AppTextStyle.s18_w500(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                ),
              ),
            ],
          ),
          Gaps.vGap12,
          Text(Translate.s.account_guest_body, style: AppTextStyle.body(color: colors.text2).copyWith(height: 1.55)),
          Gaps.vGap18,
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: FilledButton(
                    onPressed: () => controller.openLogin(context),
                    style: FilledButton.styleFrom(
                      backgroundColor: colors.button,
                      foregroundColor: colors.onButton,
                      shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                    ),
                    child: Text(Translate.s.auth_guest_login_cta, style: AppTextStyle.s14_w500(color: colors.onButton)),
                  ),
                ),
              ),
              Gaps.hGap10,
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: OutlinedButton(
                    onPressed: () => controller.openRegister(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colors.text,
                      backgroundColor: colors.surface1,
                      side: BorderSide(color: colors.line2),
                      shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                    ),
                    child: Text(
                      Translate.s.auth_create_account,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.s14_w500(color: colors.text),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProfilePlaceholder extends StatelessWidget {
  const _ProfilePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 88,
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
    );
  }
}
