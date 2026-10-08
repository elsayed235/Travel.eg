part of 'profile_imports.dart';

@RoutePage(name: 'ProfileRoute')
class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  late ProfileController controller;

  @override
  void initState() {
    controller = ProfileController(4);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RequesterConsumer(
        requester: controller._profileRequester,
        successBuilder: (context, data, isLoading) {
          return Container();
        },
        loadingBuilder: (context) {
          return Container();
        },
        failureBuilder: (context, error, callback) {
          callback.call();
          error.message;
          return Container();
        }
      )
    );
  }
}
