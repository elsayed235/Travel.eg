part of 'listing_imports.dart';

class ListingController {
  ListingController(
    this.listingId, {
    ChatRepository? chatRepository,
    AiRepository? aiRepository,
  })  : detailRequester = ListingDetailRequester(listingId: listingId),
        _chatRepo = chatRepository ?? FakeChatRepository(),
        _ai = aiRepository ?? defaultAiRepository();

  final String listingId;
  final ListingDetailRequester detailRequester;
  final ChatRepository _chatRepo;
  final AiRepository _ai;
  final ObsValue<PriceGuidanceDomainModel?> priceGuidanceObs = ObsValue.withInit(null);
  final ObsValue<DateTime?> selectedDateObs = ObsValue.withInit(null);
  final ObsValue<int> modeIndexObs = ObsValue.withInit(0);
  final ObsValue<bool> submittingObs = ObsValue.withInit(false);
  final TextEditingController offerPriceController = TextEditingController();
  final TextEditingController offerQtyController = TextEditingController();

  void init() {
    detailRequester.request().then((_) {
      final data = detailRequester.data;
      if (data == null) return;
      _loadPriceGuidance(data);
      if (!data.allowsRent && data.allowsBuy) {
        modeIndexObs.setValue(1);
      }
      offerQtyController.text = '${data.minQuantity}';
      final unitPrice = modeIndexObs.getValue() == 1 && data.allowsBuy
          ? data.buyPrice
          : data.rentPrice;
      offerPriceController.text = '${unitPrice.round()}';

      final preferred = DateTime(data.month.year, data.month.month, 25);
      final day = data.availability[DateTime(preferred.year, preferred.month, preferred.day)];
      if (day != null && !day.isBooked) {
        selectedDateObs.setValue(preferred);
      } else {
        final firstFree = data.availability.entries
            .where((e) => !e.value.isBooked)
            .map((e) => e.key)
            .toList()
          ..sort();
        if (firstFree.isNotEmpty) {
          selectedDateObs.setValue(firstFree.first);
        }
      }
    });
  }

  Future<void> _loadPriceGuidance(ListingDetailDomainModel detail) async {
    final result = await _ai.getPriceGuidance(itemLabel: detail.title);
    final guidance = result.data;
    priceGuidanceObs.setValue(guidance != null && guidance.hasData ? guidance : null);
  }

  void applySuggestedPrice(num price) {
    offerPriceController.text = '${price.round()}';
    AiTracker.track('ai_price_suggestion_used');
  }

  void onPickDate(DateTime date) => selectedDateObs.setValue(date);

  void onModeChanged(int index) {
    modeIndexObs.setValue(index);
    final data = detailRequester.data;
    if (data == null) return;
    final unitPrice = _isBuyMode(data) ? data.buyPrice : data.rentPrice;
    offerPriceController.text = '${unitPrice.round()}';
  }

  bool _isBuyMode(ListingDetailDomainModel detail) {
    if (!detail.allowsRent && detail.allowsBuy) return true;
    return modeIndexObs.getValue() == 1 && detail.allowsBuy;
  }

  num totalFor(ListingDetailDomainModel detail) {
    final unit = _isBuyMode(detail) ? detail.buyPrice : detail.rentPrice;
    return unit * detail.bookQuantity;
  }

  String dealModeLabel(ListingDetailDomainModel detail) {
    return _isBuyMode(detail) ? Translate.s.listing_buy : Translate.s.listing_rent;
  }

  Future<void> openOfferSheet(BuildContext context, ListingDetailDomainModel detail) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) {
        final bottom = MediaQuery.viewInsetsOf(ctx).bottom;
        return Padding(
          padding: EdgeInsetsDirectional.only(
            start: AppSpacing.xl,
            end: AppSpacing.xl,
            top: AppSpacing.xl,
            bottom: bottom + AppSpacing.xl,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                detail.isRequest
                    ? Translate.s.listing_fulfill_sheet_title
                    : Translate.s.listing_offer_sheet_title,
                style: AppTextStyle.sectionTitle(color: ctx.colors.text),
              ),
              Gaps.vGap6,
              Text(
                detail.isRequest
                    ? Translate.s.listing_fulfill_sheet_hint(
                        detail.minQuantity.toArabicDigits,
                        detail.moneyCycle.insuranceAmount.toArabicDigits,
                      )
                    : Translate.s.listing_offer_sheet_hint(
                        detail.minQuantity.toArabicDigits,
                        detail.moneyCycle.insuranceAmount.toArabicDigits,
                      ),
                style: AppTextStyle.caption(color: ctx.colors.text2),
              ),
              Gaps.vGap18,
              GenericTextField(
                controller: offerPriceController,
                fieldTypes: FieldTypes.normal,
                type: TextInputType.number,
                action: TextInputAction.next,
                validate: (v) => null,
                label: Translate.s.listing_offer_price_label,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),
              BuildListingPriceSuggestion(
                guidanceObs: priceGuidanceObs,
                onApply: applySuggestedPrice,
              ),
              Gaps.vGap13,
              GenericTextField(
                controller: offerQtyController,
                fieldTypes: FieldTypes.normal,
                type: TextInputType.number,
                action: TextInputAction.done,
                validate: (v) => null,
                label: Translate.s.listing_offer_qty_label(detail.quantityUnit),
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),
              Gaps.vGap18,
              ObsValueConsumer(
                observable: submittingObs,
                builder: (context, submitting) {
                  return AppTextButton.maxPrimary(
                    text: detail.isRequest
                        ? Translate.s.listing_fulfill_submit
                        : Translate.s.listing_offer_submit,
                    onPressed: submitting
                        ? null
                        : () => submitOffer(context, detail),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> submitOffer(BuildContext context, ListingDetailDomainModel detail) async {
    final price = num.tryParse(offerPriceController.text.trim());
    final qty = int.tryParse(offerQtyController.text.trim());
    if (price == null || price <= 0) {
      AppSnackBar.showSimpleToast(msg: Translate.s.listing_offer_err_price);
      return;
    }
    if (qty == null || qty < detail.minQuantity) {
      AppSnackBar.showSimpleToast(
        msg: Translate.s.listing_offer_err_qty(detail.minQuantity.toArabicDigits),
      );
      return;
    }
    if (submittingObs.getValue()) return;
    submittingObs.setValue(true);
    final result = await _chatRepo.openConversationForListingOffer(
      listingId: detail.id,
      ownerUserId: detail.ownerUserId,
      listingTitle: detail.title,
      offerPrice: price,
      quantity: qty,
      quantityUnit: detail.quantityUnit,
      dealLabel: dealModeLabel(detail),
      insuranceAmount: detail.moneyCycle.insuranceAmount,
    );
    submittingObs.setValue(false);
    if (!context.mounted) return;
    result.when(
      isSuccess: (conversationId) {
        if (conversationId == null) return;
        Navigator.of(context).pop();
        AppSnackBar.showSimpleToast(
          msg: Translate.s.listing_offer_sent,
          type: ToastType.success,
        );
        AutoRouter.of(context).push(ConversationRoute(conversationId: conversationId));
      },
      isError: (error) {
        AppSnackBar.showSimpleToast(msg: error.message);
      },
    );
  }

  void openOwnerProfile(BuildContext context, ListingDetailDomainModel detail) {
    AutoRouter.of(context).push(UserPublicProfileRoute(userId: detail.ownerUserId));
  }

  void dispose() {
    offerPriceController.dispose();
    offerQtyController.dispose();
  }
}
