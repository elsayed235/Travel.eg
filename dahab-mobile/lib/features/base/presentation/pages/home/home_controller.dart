part of 'home_imports.dart';

class HomeController {
  final HomeFeedRequester feedRequester = HomeFeedRequester();
  final ExploreController exploreController = ExploreController();
  final OrdersController ordersController = OrdersController();
  final AccountController accountController = AccountController();
  final ObsValue<int> navIndexObs = ObsValue.withInit(0);
  final ObsValue<String> categoryIdObs = ObsValue.withInit('all');

  bool _ordersLoaded = false;

  void init() {
    feedRequester.request();
    accountController.ensureLoaded();
  }

  void onNavChanged(BuildContext context, int index) {
    navIndexObs.setValue(index);
    if (index == 1) {
      final radius = context.read<DeviceCubit>().state.model.searchRadiusKm;
      exploreController.ensureLoaded(defaultRadiusKm: radius);
    }
    if (index == 2 && !_ordersLoaded) {
      _ordersLoaded = true;
      ordersController.init();
    }
    if (index == 3) {
      accountController.ensureLoaded();
    }
  }

  void openExplore(BuildContext context, {String? query, String? categoryId}) {
    if (query != null && query.trim().isNotEmpty) {
      exploreController.searchController.text = query.trim();
      exploreController.onQueryChanged(query.trim());
    }
    if (categoryId != null) {
      exploreController.onCategoryChanged(categoryId);
    }
    onNavChanged(context, 1);
  }

  /// Home AI card: open create-request with voice running, or with an
  /// example the smart composer fills in immediately.
  void openAiRequest(BuildContext context, {String? text, bool voice = false}) {
    AiTracker.track('ai_home_try', {'mode': voice ? 'voice' : 'example'});
    AuthSession.requireAuthThen(
      context,
      () async => AutoRouter.of(context).push(
        CreateRequestRoute(initialText: text, startVoice: voice),
      ),
    );
  }

  void onCategoryChanged(String id) => categoryIdObs.setValue(id);

  Future<void> openCreateRequest(BuildContext context) async {
    if (!AuthSession.isAuthorized(context)) {
      await AutoRouter.of(context).push(const LoginRoute());
      return;
    }
    await AutoRouter.of(context).push(CreateRequestRoute());
  }

  List<ListingDomainModel> filterListings(
    List<ListingDomainModel> listings, {
    required String categoryId,
  }) {
    if (categoryId == 'all') return listings;
    return listings.where((e) => e.categoryId == categoryId).toList();
  }

  void dispose() {
    exploreController.dispose();
    ordersController.dispose();
    accountController.dispose();
  }
}
