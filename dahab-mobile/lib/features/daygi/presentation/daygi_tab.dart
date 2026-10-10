part of 'daygi_imports.dart';

/// DayGi as a place, not a popup: the conversation, the plan it is building
/// underneath, and one line to type or talk.
class DaygiTab extends StatelessWidget {
  final DaygiController controller;

  const DaygiTab({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      children: [
        _Header(controller: controller),
        Expanded(
          child: ObsValueConsumer(
            observable: controller.messagesObs,
            builder: (context, messages) => ListView(
              controller: controller.scroll,
              padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.md, AppSpacing.screenH, AppSpacing.xl),
              children: [
                _Greeting(onTry: (q) => controller.send(context, q)),
                for (final m in messages) BuildDaygiMessage(message: m, controller: controller),
              ],
            ),
          ),
        ),
        BuildDaygiPlan(controller: controller),
        Container(
          padding: EdgeInsetsDirectional.fromSTEB(
            AppSpacing.screenH,
            AppSpacing.md,
            AppSpacing.screenH,
            AppSpacing.md + MediaQuery.paddingOf(context).bottom,
          ),
          decoration: BoxDecoration(color: colors.bg, border: Border(top: BorderSide(color: colors.line))),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: 48,
                  padding: const EdgeInsetsDirectional.only(start: AppSpacing.lg),
                  decoration: BoxDecoration(
                    color: colors.surface1,
                    borderRadius: AppRadius.chipAll,
                    border: Border.all(color: colors.line),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: controller.input,
                          textInputAction: TextInputAction.send,
                          onSubmitted: (_) => controller.send(context),
                          style: AppTextStyle.s14_w400(color: colors.text),
                          decoration: InputDecoration(
                            isCollapsed: true,
                            filled: false,
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            hintText: Translate.s.dg_hint,
                            hintStyle: AppTextStyle.s14_w400(color: colors.text3),
                          ),
                        ),
                      ),
                      ObsValueConsumer(
                        observable: controller.listeningObs,
                        builder: (context, listening) => IconButton(
                          tooltip: Translate.s.dg_voice,
                          onPressed: () => controller.toggleVoice(context),
                          icon: AppIcon.ui(
                            listening ? AppIcons.voice : AppIcons.mic,
                            color: listening ? colors.highlight : colors.text2,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Gaps.hGap8,
              ObsValueConsumer(
                observable: controller.busyObs,
                builder: (context, busy) => Semantics(
                  button: true,
                  label: Translate.s.dg_send,
                  child: GestureDetector(
                    onTap: busy ? null : () => controller.send(context),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(color: busy ? colors.surface3 : colors.button, shape: BoxShape.circle),
                      child: AppIcon.ui(AppIcons.arrowUp, color: busy ? colors.text3 : colors.onButton, size: 20),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Header extends StatelessWidget {
  final DaygiController controller;

  const _Header({required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.md, AppSpacing.screenH, AppSpacing.md),
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: colors.line))),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                center: const Alignment(-0.3, -0.4),
                colors: [colors.button.withValues(alpha: 0.9), colors.button],
              ),
            ),
            child: AppIcon.ui(AppIcons.sparkle, size: 20, color: colors.onButton),
          ),
          Gaps.hGap10,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('DayGi', style: AppTextStyle.s16_w700(color: colors.text).copyWith(fontFamily: AppFonts.display(context))),
                Row(
                  children: [
                    Container(width: 6, height: 6, decoration: BoxDecoration(color: colors.green, shape: BoxShape.circle)),
                    Gaps.hGap4,
                    Text(Translate.s.dg_subtitle, style: AppTextStyle.caption(color: colors.text3)),
                  ],
                ),
              ],
            ),
          ),
          ObsValueConsumer(
            observable: controller.planObs,
            builder: (context, plan) {
              final trip = TripStore.instance.bundle?.trip;
              final start = trip?.start;
              final range = start == null
                  ? ''
                  : ' · ${start.day}–${start.add(Duration(days: plan.days - 1)).day} ${RehlaDates.month(start, arabic)}';
              return PopupMenuButton<int>(
                tooltip: Translate.s.dg_days_pick,
                onSelected: controller.setDays,
                color: colors.surface1,
                itemBuilder: (_) => [
                  for (var d = 1; d <= 7; d++)
                    PopupMenuItem(value: d, child: Text(Translate.s.dg_days(d), style: AppTextStyle.s14_w400(color: colors.text))),
                ],
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: colors.surface1,
                    borderRadius: AppRadius.chipAll,
                    border: Border.all(color: colors.line),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      AppIcon.ui(AppIcons.calendar, size: 13, color: colors.button),
                      Gaps.hGap6,
                      Text('${Translate.s.dg_days(plan.days)}$range', style: AppTextStyle.s12_w600(color: colors.text)),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _Greeting extends StatelessWidget {
  final ValueChanged<String> onTry;

  const _Greeting({required this.onTry});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final tries = [Translate.s.dg_try_1, Translate.s.dg_try_2, Translate.s.dg_try_3];
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DgBubble(fromUser: false, child: Text(Translate.s.dg_greeting, style: AppTextStyle.s14_w400(color: colors.text).copyWith(height: 1.55))),
          Gaps.vGap8,
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [for (final t in tries) DgSuggestion(label: t, onTap: () => onTry(t))],
          ),
        ],
      ),
    );
  }
}
