import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tdd/core/helpers/app_snack_bar_service.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:url_launcher/url_launcher.dart';

@injectable
class ShareServices {
  static ShareServices get instance => GetIt.I<ShareServices>();

  void copyToClipBoard(String text) {
    Clipboard.setData(ClipboardData(text: text)).then((value) {
        AppSnackBar.showSimpleToast(msg: "Copied successfully");
    });
  }

  Future<bool?> launchURL({required String url}) async {
    final uri = Uri.parse(url);
    return await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<bool?> launchURLInApp({required String url}) async {
    final uri = Uri.parse(url);

    if (await canLaunchUrl(uri)) {
      final launched = await launchUrl(uri, mode: LaunchMode.inAppWebView);
      return launched;
    } else {
      return null;
      // throw 'Could not launch $url';
    }
  }

  Future<bool?> launchURLExternally({required String url}) async {
    final uri = Uri.parse(url);

    if (await canLaunchUrl(uri)) {
      final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      return launched;
    } else {
      return null;
      // throw 'Could not launch $url';
    }
  }

  void launchWhatsApp(phone) async {
    String message = 'مرحبا بك';
    var whatsAppUrl = "https://api.whatsapp.com/send?phone=+$phone&text=$message";
    if (await canLaunchUrl(Uri.parse(whatsAppUrl))) {
      await launchUrl(Uri.parse(whatsAppUrl));
    } else {
      AppSnackBar.showSimpleToast(msg: Translate.s.something_went_wrong);
    }
  }

  void callPhone({required String phone}) async {
    final Uri phoneLaunchUri = Uri(
      scheme: 'tel',
      path: phone,
    );
    await launchUrl(phoneLaunchUri);
  }

  void sendEmail({required String email}) async {
    final Uri emailLaunchUri = Uri(
      scheme: 'mailto',
      path: email,
    );
    await launchUrl(emailLaunchUri);
  }

  void onLink({required BuildContext context, required String link}) {
    launchURL(url: link);
  }


}
