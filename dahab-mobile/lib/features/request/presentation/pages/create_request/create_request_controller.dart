part of 'create_request_imports.dart';

class CreateRequestController {
  CreateRequestController({
    AiRepository? aiRepository,
    this.initialText,
    this.startVoice = false,
  }) : _ai = aiRepository ?? defaultAiRepository();

  final AiRepository _ai;
  final String? initialText;
  final bool startVoice;
  final CreateRequestPreviewRequester previewRequester = CreateRequestPreviewRequester();
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();

  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController quantityController = TextEditingController();
  final TextEditingController needByController = TextEditingController();
  final TextEditingController locationController = TextEditingController();

  final ObsValue<int> stepObs = ObsValue.withInit(0);
  final ObsValue<String> descriptionObs = ObsValue.withInit('');
  final ObsValue<int?> quantityObs = ObsValue.withInit(null);
  final ObsValue<String> quantityUnitObs = ObsValue.withInit('قطعة');
  final ObsValue<DateTime?> needByObs = ObsValue.withInit(null);
  final ObsValue<String> locationLabelObs = ObsValue.withInit('');
  final ObsValue<int?> locationDistanceKmObs = ObsValue.withInit(null);
  final ObsValue<double?> latitudeObs = ObsValue.withInit(null);
  final ObsValue<double?> longitudeObs = ObsValue.withInit(null);
  final ObsValue<int> matchingOwnersObs = ObsValue.withInit(0);
  final ObsValue<DateTime?> closesAtObs = ObsValue.withInit(null);
  final ObsValue<File?> photoFileObs = ObsValue.withInit(null);
  final ObsValue<bool> hasPhotoObs = ObsValue.withInit(false);
  /// null = no radius selected (user can toggle off).
  final ObsValue<int?> radiusKmObs = ObsValue.withInit(null);
  final ObsValue<RequestDeliveryPref> deliveryObs =
      ObsValue.withInit(RequestDeliveryPref.either);
  final ObsValue<bool> verifiedOnlyObs = ObsValue.withInit(false);
  final ObsValue<bool> sharePhoneObs = ObsValue.withInit(true);
  final ObsValue<bool> shareWhatsappObs = ObsValue.withInit(true);
  final ObsValue<bool> whatsappSameAsPhoneObs = ObsValue.withInit(true);
  final TextEditingController contactPhoneController =
      TextEditingController();
  final TextEditingController contactWhatsappController =
      TextEditingController();
  final ObsValue<List<RequestRadiusOption>> radiusOptionsObs =
      ObsValue.withInit(const <RequestRadiusOption>[]);
  final ObsValue<bool> locatingObs = ObsValue.withInit(false);

  // Smart composer (roadmap feature 01) + voice request (feature 02).
  final ObsValue<bool> listeningObs = ObsValue.withInit(false);
  final ObsValue<bool> structuringObs = ObsValue.withInit(false);
  final ObsValue<StructuredRequestDomainModel?> aiResultObs = ObsValue.withInit(null);
  _AiUndoSnapshot? _aiUndo;
  String _textBeforeVoice = '';

  final ObsValue<List<RequestCategory>> categoriesObs =
      ObsValue.withInit(const <RequestCategory>[]);
  final ObsValue<RequestCategory?> categoryObs = ObsValue.withInit(null);
  final ObsValue<List<RequestCategory>> hashtagSuggestionsObs =
      ObsValue.withInit(const <RequestCategory>[]);
  final ObsValue<bool> showHashtagSuggestionsObs = ObsValue.withInit(false);
  final ObsValue<bool> termsAcceptedObs = ObsValue.withInit(false);

  static const double _defaultLat = 31.4225;
  static const double _defaultLng = 31.6584;

  bool _previewApplied = false;
  int _hashtagTokenStart = -1;

  /// [phone] comes from the signed-in user; contact fields stay empty for guests.
  void init({String? phone}) {
    if (phone != null && phone.trim().isNotEmpty) {
      contactPhoneController.text = phone.trim();
      contactWhatsappController.text = phone.trim();
    }
    previewRequester.request();
  }

  void applyPreview(CreateRequestPreviewDomainModel preview) {
    if (_previewApplied) return;
    _previewApplied = true;
    final description = startVoice ? '' : (initialText?.trim() ?? preview.description);
    descriptionObs.setValue(description);
    descriptionController.text = description;
    quantityObs.setValue(preview.quantity);
    quantityController.text = '${preview.quantity}';
    quantityUnitObs.setValue(preview.quantityUnit);
    needByObs.setValue(preview.needBy);
    needByController.text = DateFormat('d MMMM', 'ar_EG').format(preview.needBy).toArabicDigits;
    locationLabelObs.setValue(preview.locationLabel);
    locationDistanceKmObs.setValue(preview.locationDistanceKm);
    locationController.text = Translate.s.create_request_location_value(
      preview.locationLabel,
      preview.locationDistanceKm.toArabicDigits,
    );
    latitudeObs.setValue(_defaultLat);
    longitudeObs.setValue(_defaultLng);
    closesAtObs.setValue(preview.closesAt);
    matchingOwnersObs.setValue(preview.matchingOwners);
    radiusOptionsObs.setValue(preview.radiusOptions);
    radiusKmObs.setValue(preview.defaultRadiusKm);
    categoriesObs.setValue(preview.categories);
    if (preview.categories.isNotEmpty) {
      categoryObs.setValue(preview.categories.first);
    }
    descriptionController.addListener(_onDescriptionControllerTick);
    _recalcOwners();
    if (startVoice || initialText != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        startVoice ? toggleVoice() : structureWithAi();
      });
    }
  }

  void _onDescriptionControllerTick() {
    descriptionObs.setValue(descriptionController.text);
    _refreshHashtagSuggestions();
  }

  String quantityLabel() {
    final qty = quantityObs.getValue();
    if (qty == null) return Translate.s.create_request_quantity_hint;
    return '${qty.toArabicDigits} ${quantityUnitObs.getValue()}';
  }

  String needByLabel() {
    final date = needByObs.getValue();
    if (date == null) return Translate.s.create_request_date_hint;
    return DateFormat('d MMMM', 'ar_EG').format(date).toArabicDigits;
  }

  String locationLabel() {
    final place = locationLabelObs.getValue();
    final km = locationDistanceKmObs.getValue();
    if (place.isEmpty) return Translate.s.create_request_location_hint;
    if (km == null) return place;
    return Translate.s.create_request_location_value(place, km.toArabicDigits);
  }

  String closesAtLabel() {
    final date = closesAtObs.getValue();
    if (date == null) return '';
    return DateFormat('d MMMM', 'ar_EG').format(date).toArabicDigits;
  }

  String deliveryLabel([RequestDeliveryPref? pref]) {
    switch (pref ?? deliveryObs.getValue()) {
      case RequestDeliveryPref.onSite:
        return Translate.s.create_request_delivery_onsite;
      case RequestDeliveryPref.pickup:
        return Translate.s.create_request_delivery_pickup;
      case RequestDeliveryPref.either:
        return Translate.s.create_request_delivery_either;
    }
  }

  String summaryLine() {
    return Translate.s.create_request_summary_line(
      quantityLabel(),
      needByLabel(),
    );
  }

  String categoryLabel() =>
      categoryObs.getValue()?.name ?? Translate.s.create_request_category_hint;

  bool get hasPhoto => hasPhotoObs.getValue() || photoFileObs.getValue() != null;

  void onDescriptionChanged(String value) {
    descriptionObs.setValue(value);
    _refreshHashtagSuggestions();
  }

  void onDescriptionSelectionChanged() {
    _refreshHashtagSuggestions();
  }

  void _refreshHashtagSuggestions() {
    final text = descriptionController.text;
    final cursor = descriptionController.selection.baseOffset;
    if (cursor < 0 || cursor > text.length) {
      showHashtagSuggestionsObs.setValue(false);
      hashtagSuggestionsObs.setValue(const []);
      return;
    }

    final before = text.substring(0, cursor);
    final match = RegExp(r'(^|[\s\n])#([^\s#]*)$').firstMatch(before);
    if (match == null) {
      showHashtagSuggestionsObs.setValue(false);
      hashtagSuggestionsObs.setValue(const []);
      _hashtagTokenStart = -1;
      return;
    }

    _hashtagTokenStart = match.start + match.group(1)!.length;
    final query = (match.group(2) ?? '').trim();
    final selected = categoryObs.getValue();
    final source = categoriesObs.getValue();
    final filtered = source.where((c) {
      if (query.isEmpty) return true;
      return c.name.contains(query) || c.hashtag.contains(query);
    }).toList();

    if (selected != null) {
      filtered.sort((a, b) {
        if (a.id == selected.id) return -1;
        if (b.id == selected.id) return 1;
        return a.name.compareTo(b.name);
      });
    }

    hashtagSuggestionsObs.setValue(filtered);
    showHashtagSuggestionsObs.setValue(filtered.isNotEmpty);
  }

  void insertHashtag(RequestCategory category) {
    final text = descriptionController.text;
    final cursor = descriptionController.selection.baseOffset.clamp(0, text.length);
    final start = _hashtagTokenStart >= 0 ? _hashtagTokenStart : cursor;
    final insert = '${category.hashtag} ';
    final newText = text.replaceRange(start, cursor, insert);
    descriptionController.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: start + insert.length),
    );
    descriptionObs.setValue(newText);
    showHashtagSuggestionsObs.setValue(false);
    hashtagSuggestionsObs.setValue(const []);
    _hashtagTokenStart = -1;
  }

  Future<void> toggleVoice() async {
    final speech = SpeechInputService.instance;
    if (listeningObs.getValue()) {
      await speech.stop();
      return;
    }
    FocusManager.instance.primaryFocus?.unfocus();
    final current = descriptionController.text.trim();
    _textBeforeVoice = current.isEmpty ? '' : '$current ';
    var heardSomething = false;
    final started = await speech.start(
      onResult: (words, isFinal) {
        if (words.trim().isEmpty) return;
        heardSomething = true;
        final text = '$_textBeforeVoice$words';
        descriptionController.value = TextEditingValue(
          text: text,
          selection: TextSelection.collapsed(offset: text.length),
        );
      },
      onDone: () {
        if (!listeningObs.getValue()) return;
        listeningObs.setValue(false);
        if (heardSomething) {
          AiTracker.track('ai_voice_request');
          structureWithAi();
        }
      },
    );
    if (!started) {
      AppSnackBar.showSimpleToast(msg: Translate.s.ai_voice_unavailable);
      return;
    }
    listeningObs.setValue(true);
  }

  Future<void> structureWithAi() async {
    if (structuringObs.getValue()) return;
    final text = descriptionController.text.trim();
    if (text.isEmpty) {
      AppSnackBar.showSimpleToast(msg: Translate.s.ai_compose_empty);
      return;
    }
    FocusManager.instance.primaryFocus?.unfocus();
    structuringObs.setValue(true);
    final result = await _ai.structureRequest(
      text: text,
      categoryIds: categoriesObs.getValue().map((c) => c.id).toList(),
      photoPath: photoFileObs.getValue()?.path,
    );
    structuringObs.setValue(false);
    result.when(
      isSuccess: (data) {
        if (data == null || data.isEmpty) {
          AppSnackBar.showSimpleToast(msg: Translate.s.ai_compose_nothing);
          return;
        }
        _applyAiResult(data);
        AiTracker.track('ai_request_structured', {
          'confidence': (data.confidence * 100).round(),
        });
      },
      isError: (error) => AppSnackBar.showSimpleToast(msg: error.message),
    );
  }

  void _applyAiResult(StructuredRequestDomainModel data) {
    _aiUndo = _AiUndoSnapshot(
      category: categoryObs.getValue(),
      quantity: quantityObs.getValue(),
      quantityUnit: quantityUnitObs.getValue(),
      needBy: needByObs.getValue(),
      closesAt: closesAtObs.getValue(),
    );
    if (data.categoryId != null) {
      final match = categoriesObs.getValue().where((c) => c.id == data.categoryId);
      if (match.isNotEmpty) categoryObs.setValue(match.first);
    }
    if (data.quantity != null) {
      _setQuantity(data.quantity, data.quantityUnit ?? quantityUnitObs.getValue());
    }
    if (data.needBy != null) _setNeedBy(data.needBy);
    aiResultObs.setValue(data);
  }

  void undoAi() {
    final snapshot = _aiUndo;
    if (snapshot == null) return;
    if (snapshot.category != null) categoryObs.setValue(snapshot.category);
    _setQuantity(snapshot.quantity, snapshot.quantityUnit);
    _setNeedBy(snapshot.needBy);
    closesAtObs.setValue(snapshot.closesAt);
    _aiUndo = null;
    aiResultObs.setValue(null);
    AiTracker.track('ai_request_undone');
  }

  void dismissAi() {
    _aiUndo = null;
    aiResultObs.setValue(null);
  }

  void _setQuantity(int? quantity, String unit) {
    quantityObs.setValue(quantity);
    quantityUnitObs.setValue(unit);
    quantityController.text = quantity == null ? '' : '$quantity';
  }

  void _setNeedBy(DateTime? date) {
    needByObs.setValue(date);
    needByController.text =
        date == null ? '' : DateFormat('d MMMM', 'ar_EG').format(date).toArabicDigits;
    if (date != null) closesAtObs.setValue(date.add(const Duration(days: 1)));
  }

  void onQuantityChanged(String value) {
    final parsed = int.tryParse(value.replaceAll(RegExp(r'[^\d]'), ''));
    quantityObs.setValue(parsed);
  }

  void toggleTermsAccepted() {
    termsAcceptedObs.setValue(!termsAcceptedObs.getValue());
  }

  void openTerms(BuildContext context) {
    AutoRouter.of(context).push(const TermsRoute());
  }

  void selectCategory(RequestCategory category) {
    categoryObs.setValue(category);
  }

  Future<void> pickPhoto(BuildContext context) async {
    final files = await getIt<AppFileService>().pickImagesFiles(context, allowMulti: false);
    if (files == null || files.isEmpty) return;
    photoFileObs.setValue(files.first);
    hasPhotoObs.setValue(true);
  }

  void removePhoto() {
    photoFileObs.setValue(null);
    hasPhotoObs.setValue(false);
  }

  Future<void> pickNeedBy(BuildContext context) async {
    final now = DateTime.now();
    final initial = needByObs.getValue() ?? now.add(const Duration(days: 1));
    final picked = await showDatePicker(
      context: context,
      initialDate: initial.isBefore(now) ? now : initial,
      firstDate: DateTime(now.year, now.month, now.day),
      lastDate: now.add(const Duration(days: 365)),
      locale: const Locale('ar', 'EG'),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: context.colors.button,
              onPrimary: context.colors.onButton,
              surface: context.colors.surface1,
              onSurface: context.colors.text,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked == null) return;
    _setNeedBy(picked);
  }

  Future<void> openLocationPicker(BuildContext context) async {
    final result = await AutoRouter.of(context).push<PickLocationResult>(
      PickLocationRoute(
        initialLat: latitudeObs.getValue() ?? _defaultLat,
        initialLng: longitudeObs.getValue() ?? _defaultLng,
      ),
    );
    if (result == null) return;
    _applyLocation(result);
  }

  Future<void> useCurrentLocation(BuildContext context) async {
    locatingObs.setValue(true);
    try {
      final permission = await Geolocator.checkPermission();
      var status = permission;
      if (status == LocationPermission.denied) {
        status = await Geolocator.requestPermission();
      }
      if (status == LocationPermission.denied ||
          status == LocationPermission.deniedForever) {
        AppSnackBar.showSimpleToast(msg: Translate.s.pick_location_failed);
        locatingObs.setValue(false);
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      final latLng = LatLng(position.latitude, position.longitude);
      final address = await LocationService.instance.getAddress(latLng);
      _applyLocation(
        PickLocationResult(
          latLng: latLng,
          address: address.trim().isEmpty
              ? Translate.s.create_request_location_hint
              : address.trim(),
          distanceKm: locationDistanceKmObs.getValue() ?? 15,
        ),
      );
    } catch (_) {
      AppSnackBar.showSimpleToast(msg: Translate.s.pick_location_failed);
    } finally {
      locatingObs.setValue(false);
    }
  }

  void _applyLocation(PickLocationResult result) {
    latitudeObs.setValue(result.latLng.latitude);
    longitudeObs.setValue(result.latLng.longitude);
    locationLabelObs.setValue(result.address);
    locationDistanceKmObs.setValue(result.distanceKm);
    locationController.text = Translate.s.create_request_location_value(
      result.address,
      result.distanceKm.toArabicDigits,
    );
  }

  /// Tap same km again to clear selection.
  void toggleRadius(int km) {
    final current = radiusKmObs.getValue();
    radiusKmObs.setValue(current == km ? null : km);
    _recalcOwners();
  }

  void setDelivery(RequestDeliveryPref pref) {
    deliveryObs.setValue(pref);
  }

  void toggleVerifiedOnly() {
    verifiedOnlyObs.setValue(!verifiedOnlyObs.getValue());
    _recalcOwners();
  }

  void toggleSharePhone() {
    sharePhoneObs.setValue(!sharePhoneObs.getValue());
  }

  void toggleShareWhatsapp() {
    shareWhatsappObs.setValue(!shareWhatsappObs.getValue());
  }

  void toggleWhatsappSameAsPhone() {
    final next = !whatsappSameAsPhoneObs.getValue();
    whatsappSameAsPhoneObs.setValue(next);
    if (next) {
      contactWhatsappController.text = contactPhoneController.text;
    }
  }

  void onContactPhoneChanged(String value) {
    if (whatsappSameAsPhoneObs.getValue()) {
      contactWhatsappController.text = value;
    }
  }

  void _recalcOwners() {
    final options = radiusOptionsObs.getValue();
    final km = radiusKmObs.getValue();
    if (km == null) {
      matchingOwnersObs.setValue(0);
      return;
    }
    final match = options.where((o) => o.km == km);
    var owners = match.isEmpty ? 0 : match.first.matchingOwners;
    if (verifiedOnlyObs.getValue() && owners > 0) {
      owners = (owners * 0.42).round().clamp(1, owners);
    }
    matchingOwnersObs.setValue(owners);
  }

  bool validateStep1() {
    final formOk = formKey.currentState?.validate() ?? false;
    if (categoryObs.getValue() == null) {
      AppSnackBar.showSimpleToast(msg: Translate.s.create_request_err_category);
      return false;
    }
    if (!formOk) {
      AppSnackBar.showSimpleToast(msg: Translate.s.create_request_validation);
      return false;
    }
    if (needByObs.getValue() == null) {
      AppSnackBar.showSimpleToast(msg: Translate.s.create_request_err_date);
      return false;
    }
    if (locationLabelObs.getValue().trim().isEmpty) {
      AppSnackBar.showSimpleToast(msg: Translate.s.create_request_err_location);
      return false;
    }
    return true;
  }

  void goToStep2() {
    if (!validateStep1()) return;
    FocusManager.instance.primaryFocus?.unfocus();
    showHashtagSuggestionsObs.setValue(false);
    stepObs.setValue(1);
  }

  void goToStep1() {
    stepObs.setValue(0);
  }

  void onClose(BuildContext context) {
    AutoRouter.of(context).maybePop();
  }

  void onPrimary(BuildContext context) {
    if (stepObs.getValue() == 0) {
      goToStep2();
      return;
    }
    if (!termsAcceptedObs.getValue()) {
      AppSnackBar.showSimpleToast(msg: Translate.s.create_request_err_terms);
      return;
    }
    AiTracker.track('request_submitted', {'ai_used': aiResultObs.getValue() == null ? 0 : 1});
    AppSnackBar.showSimpleToast(
      msg: Translate.s.create_request_submitted,
      type: ToastType.success,
    );
    AutoRouter.of(context).replace(const OrdersRoute());
  }

  void onSubmit(BuildContext context) => onPrimary(context);

  void dispose() {
    if (listeningObs.getValue()) SpeechInputService.instance.stop();
    descriptionController.removeListener(_onDescriptionControllerTick);
    descriptionController.dispose();
    quantityController.dispose();
    needByController.dispose();
    locationController.dispose();
    contactPhoneController.dispose();
    contactWhatsappController.dispose();
  }
}

/// Field values before the smart composer ran, so the user can undo it.
class _AiUndoSnapshot {
  final RequestCategory? category;
  final int? quantity;
  final String quantityUnit;
  final DateTime? needBy;
  final DateTime? closesAt;

  const _AiUndoSnapshot({
    required this.category,
    required this.quantity,
    required this.quantityUnit,
    required this.needBy,
    required this.closesAt,
  });
}
