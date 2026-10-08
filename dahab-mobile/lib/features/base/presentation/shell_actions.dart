/// What a pushed page (an experience, checkout) may ask of the app shell
/// underneath it. The shell installs these while it is alive.
class ShellActions {
  ShellActions._();

  static const home = 0;
  static const discover = 1;
  static const daygi = 2;
  static const trip = 3;
  static const account = 4;

  static void Function(int tab)? _openTab;
  static void Function(String? question)? _askDaygi;

  static void install({required void Function(int tab) openTab, required void Function(String? question) askDaygi}) {
    _openTab = openTab;
    _askDaygi = askDaygi;
  }

  static void uninstall() {
    _openTab = null;
    _askDaygi = null;
  }

  static void openTab(int tab) => _openTab?.call(tab);

  static void askDaygi(String? question) => _askDaygi?.call(question);
}
