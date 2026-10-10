part of 'active_account_imports.dart';

@RoutePage(name: 'ActiveAccountRoute')
class ActiveAccount extends StatefulWidget {
  final String? phone;
  final bool isRegister;
  final String? fullName;

  const ActiveAccount({
    super.key,
    this.phone,
    this.isRegister = false,
    this.fullName,
  });

  @override
  State<ActiveAccount> createState() => _ActiveAccountState();
}

class _ActiveAccountState extends State<ActiveAccount> {
  static const _resendAfter = 30;

  late final ActiveAccountController controller;
  Timer? _timer;
  int _secondsLeft = _resendAfter;

  @override
  void initState() {
    super.initState();
    controller = ActiveAccountController(
      isRegister: widget.isRegister,
      phone: widget.phone,
      fullName: widget.fullName,
    );
    _startCountdown();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _secondsLeft = _resendAfter);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft <= 1) t.cancel();
      setState(() => _secondsLeft--);
    });
  }

  void _resend() {
    controller.onResend();
    _startCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final phone = widget.phone == null || widget.phone!.isEmpty ? '••••' : widget.phone!;
    // Isolate the number so it keeps its LTR order inside Arabic text.
    final isolatedPhone = '\u2066$phone\u2069';
    final time = '0:${_secondsLeft.toString().padLeft(2, '0')}'.toArabicDigits;
    return BuildAuthScaffold(
      step: widget.isRegister ? null : 2,
      totalSteps: widget.isRegister ? null : 3,
      child: ListView(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xxl,
        ),
        children: [
          BuildAuthHeader(
            title: Translate.s.auth_otp_title,
            subtitle: Translate.s.auth_otp_subtitle(isolatedPhone),
            icon: AppIcons.chat,
          ),
          PinFieldWidget(onComplete: controller.onComplete),
          Gaps.vGap6,
          Center(
            child: _secondsLeft > 0
                ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                    child: Text(
                      Translate.s.auth_otp_resend_in(time),
                      style: AppTextStyle.caption(color: colors.text2),
                    ),
                  )
                : TextButton.icon(
                    onPressed: _resend,
                    icon: AppIcon.ui(AppIcons.refresh, size: 16, color: colors.text),
                    label: Text(
                      Translate.s.auth_otp_resend,
                      style: AppTextStyle.s13_w500(color: colors.text),
                    ),
                  ),
          ),
          Gaps.vGap18,
          BuildActiveButton(controller: controller),
          Gaps.vGap13,
          Text(
            Translate.s.auth_otp_hint,
            style: AppTextStyle.micro(color: colors.text3),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
