# Flutter Implementation Spec — Marketplace App (v3 Design)

This document is the single source of truth for turning the v3 design into Flutter.
Hand this file to Claude Code **before** asking for any screen.

---

## 0. Ground rules

1. **No screen work until the design system compiles and renders in a gallery screen.**
2. **No hardcoded colors, sizes, radii, or text styles anywhere outside `core/theme/`.**
   If a widget contains `Color(0xFF...)` or `BorderRadius.circular(12)`, it is wrong.
3. **No backend.** Every screen is built against a fake repository returning static models.
   Networking comes after the UI is approved.
4. **Arabic-first.** `Directionality` is RTL app-wide; nothing relies on `Alignment.centerLeft`
   — use `centerStart` / `EdgeInsetsDirectional` everywhere.

---

## 1. Project structure (feature-first)

```
lib/
├── main.dart
├── app/
│   ├── app.dart                 # MaterialApp, theme wiring, locale
│   ├── router.dart              # go_router config
│   └── di.dart                  # providers / service locator
├── core/
│   ├── theme/
│   │   ├── app_colors.dart      # ← tokens, section 2
│   │   ├── app_radius.dart
│   │   ├── app_spacing.dart
│   │   ├── app_typography.dart
│   │   └── app_theme.dart       # builds ThemeData light + dark
│   ├── widgets/                 # design-system components, section 4
│   │   ├── app_button.dart
│   │   ├── app_chip.dart
│   │   ├── app_segmented.dart
│   │   ├── app_search_field.dart
│   │   ├── app_field.dart
│   │   ├── app_list_row.dart
│   │   ├── app_rating.dart
│   │   ├── app_price.dart
│   │   ├── app_availability_calendar.dart
│   │   ├── app_terms_list.dart
│   │   └── app_bottom_nav.dart
│   ├── utils/
│   │   ├── arabic_numerals.dart
│   │   └── date_format.dart
│   └── gallery/
│       └── design_gallery_screen.dart   # every component in both themes
├── features/
│   ├── home/
│   │   ├── data/       models + fake repository
│   │   ├── domain/     entities
│   │   └── presentation/  screen + widgets + state
│   ├── search/
│   ├── listing/
│   ├── request/
│   ├── offers/
│   ├── transaction/
│   └── shop/
└── l10n/
    └── app_ar.arb
```

**Rule:** a widget used by two features moves to `core/widgets/`. A widget used by one
feature stays in that feature's `presentation/widgets/`.

---

## 2. Design tokens

### `core/theme/app_colors.dart`

```dart
import 'package:flutter/material.dart';

@immutable
class AppColors extends ThemeExtension<AppColors> {
  final Color bg;        // screen background
  final Color surface1;  // cards, fields
  final Color surface2;  // inputs, filters
  final Color surface3;  // icon tiles, secondary buttons
  final Color line;      // 1px hairline dividers
  final Color line2;     // stronger border (emphasis)
  final Color text;      // primary text
  final Color text2;     // secondary text
  final Color text3;     // tertiary / disabled
  final Color button;    // primary button fill
  final Color onButton;  // primary button label
  final Color green;     // availability / success
  final Color greenBg;
  final Color amber;     // rating, verification
  final Color amberBg;
  final Color red;       // late, problems

  const AppColors({
    required this.bg, required this.surface1, required this.surface2,
    required this.surface3, required this.line, required this.line2,
    required this.text, required this.text2, required this.text3,
    required this.button, required this.onButton,
    required this.green, required this.greenBg,
    required this.amber, required this.amberBg, required this.red,
  });

  static const dark = AppColors(
    bg:       Color(0xFF0A0B0D),
    surface1: Color(0xFF131518),
    surface2: Color(0xFF1B1E22),
    surface3: Color(0xFF262A2F),
    line:     Color(0x17FFFFFF), // white @ 9%
    line2:    Color(0x29FFFFFF), // white @ 16%
    text:     Color(0xFFECEDEE),
    text2:    Color(0xFF9298A0),
    text3:    Color(0xFF61666D),
    button:   Color(0xFFFFFFFF),
    onButton: Color(0xFF0A0B0D),
    green:    Color(0xFF3FA07A),
    greenBg:  Color(0x243FA07A),
    amber:    Color(0xFFC99A4B),
    amberBg:  Color(0x24C99A4B),
    red:      Color(0xFFD4586B),
  );

  static const light = AppColors(
    bg:       Color(0xFFFFFFFF),
    surface1: Color(0xFFFFFFFF),
    surface2: Color(0xFFF5F5F4),
    surface3: Color(0xFFECECEA),
    line:     Color(0xFFE4E4E1),
    line2:    Color(0xFFD3D3CF),
    text:     Color(0xFF101214),
    text2:    Color(0xFF5C6169),
    text3:    Color(0xFF8C9198),
    button:   Color(0xFF101214),
    onButton: Color(0xFFFFFFFF),
    green:    Color(0xFF2E7F5F),
    greenBg:  Color(0x1A2E7F5F),
    amber:    Color(0xFF96701F),
    amberBg:  Color(0x1C96701F),
    red:      Color(0xFFB4384C),
  );

  @override
  AppColors copyWith({ /* all fields nullable */ }) => throw UnimplementedError();

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      bg: Color.lerp(bg, other.bg, t)!,
      // ... lerp every field
    );
  }
}

extension AppColorsX on BuildContext {
  AppColors get c => Theme.of(this).extension<AppColors>()!;
}
```

Usage in widgets: `context.c.surface1`, `context.c.text2`. Never `Colors.grey`.

### `core/theme/app_radius.dart`

```dart
class AppRadius {
  static const image  = 6.0;   // product thumbnails
  static const chip   = 6.0;   // filter chips, tags
  static const button = 8.0;   // buttons, fields, search bar
  static const card   = 10.0;  // cards, offer cards
  static const sheet  = 14.0;  // bottom sheets only
  // Nothing in this app exceeds 14. If a design asks for more, it is wrong.
}
```

### `core/theme/app_spacing.dart`

```dart
class AppSpacing {
  static const xs = 4.0;
  static const sm = 6.0;
  static const md = 9.0;
  static const lg = 13.0;
  static const xl = 18.0;   // screen horizontal padding
  static const xxl = 24.0;
}
```

### `core/theme/app_typography.dart`

Font: **IBM Plex Sans Arabic** via `google_fonts` (`GoogleFonts.ibmPlexSansArabic`).
Bundle it as an asset for release builds — do not fetch fonts at runtime in production.

| Token | Size | Weight | Use |
|---|---|---|---|
| `screenTitle` | 19 | 700 | screen heading |
| `sectionTitle` | 14 | 600 | section heading |
| `itemTitle` | 13.5 | 400 | product / person name |
| `price` | 17 | 600 | price figure (letterSpacing -0.02em) |
| `priceUnit` | 11 | 300 | "/اليوم" |
| `body` | 13 | 400 | field values |
| `caption` | 11.5 | 300 | secondary line, distance, rating |
| `micro` | 10 | 300 | tags, nav labels |

`height` (line-height) = 1.5 for body and below, 1.35 for titles.

---

## 3. Theme assembly

```dart
ThemeData buildTheme(AppColors c, Brightness b) => ThemeData(
  useMaterial3: true,
  brightness: b,
  scaffoldBackgroundColor: c.bg,
  extensions: [c],
  fontFamily: GoogleFonts.ibmPlexSansArabic().fontFamily,
  splashFactory: NoSplash.splashFactory,   // no Material ripple — it breaks the look
  highlightColor: Colors.transparent,
  dividerTheme: DividerThemeData(color: c.line, thickness: 1, space: 1),
  cardTheme: CardTheme(
    elevation: 0, color: c.surface1,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.card),
      side: BorderSide(color: c.line),
    ),
  ),
  appBarTheme: AppBarTheme(
    backgroundColor: c.bg, surfaceTintColor: Colors.transparent,
    elevation: 0, scrolledUnderElevation: 0,
  ),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: c.bg, elevation: 0,
  ),
);
```

**Material defaults that will fight this design — override all of them:**

| Default | Problem | Fix |
|---|---|---|
| `surfaceTint` on cards/appbars | adds a purple wash in dark mode | `surfaceTintColor: Colors.transparent` |
| Ink ripple | cheap-looking splash on premium surfaces | `NoSplash.splashFactory` |
| `Card` elevation | shadows; this design uses hairlines only | `elevation: 0` + `side: BorderSide` |
| M3 default radii (12–28) | too round | always pass `AppRadius.*` |
| `ListTile` padding | inconsistent with 18px screen padding | build rows manually, don't use `ListTile` |
| `TextField` filled/underline | wrong look | `InputDecoration.collapsed` inside a custom container |

---

## 4. Component contracts

Build these first, in `core/widgets/`, and render them in `design_gallery_screen.dart`
in **both themes side by side** before touching any feature.

```dart
AppButton({required String label, VoidCallback? onTap,
           AppButtonKind kind = AppButtonKind.primary, bool expanded = false})
// kinds: primary (button/onButton), secondary (surface2 + line border)

AppChip({required String label, AppChipKind kind = AppChipKind.neutral})
// kinds: neutral(surface2), available(greenBg/green), verified(amberBg/amber), ad(transparent + line2)

AppMarketSideBadge({required MarketplaceSide side, bool compact = false, bool expanded = false})
// MarketplaceSide.request → amber badge «مطلوب» (home / explore rows)
// MarketplaceSide.offer → green (legacy)

AppCategoryRail({required List<AppCategoryItem> categories, required String selectedId, required ValueChanged<String> onChanged})
// Premium icon tiles (ملابس / مواد غذائية / إلكترونيات…). Filters home + explore feeds.

AppRequestRow({…}) // Shared request card: photo · مطلوب · title · requester/distance · category+qty chips · need-by date. No price.

AppSegmented({required List<String> items, required int index, required ValueChanged<int> onChanged})
// used for إيجار / شرا

AppSearchField({required String hint, required List<Widget> leadingTools})
// tools: visual search (filled button color), voice, barcode

AppField({required String label, required String value, bool isPlaceholder = false})

AppListRow({required String title, required Widget thumbnail, required String metaLine,
            required List<Widget> chips, required Widget trailing})
// this is the Amazon-style divider-separated row — the most reused widget in the app

AppRating({required double value, required int count})   // ★ ٤٫٨ (٣٤)

AppPrice({required num amount, String? unit, bool muted = false})

AppAvailabilityCalendar({required DateTime month,
                         required Map<DateTime, DayAvailability> data,
                         required DateTime? selected, required ValueChanged<DateTime> onPick})
// DayAvailability: { int available, int total } → full / partial / free / picked

AppTermsList({required List<(String label, String value)> terms})

AppBottomNav({required int index, required ValueChanged<int> onChanged})
// center item is a filled square button, not a FAB
```

### Dual marketplace cycle (معروض vs مطلوب)

Home feed is **requests-only** (مطلوب). Create-request and home cards share the same fields:
photo · category · description · quantity · need-by · location — **no price**.

| Side | Meaning | Badge color | Where |
|---|---|---|---|
| `request` | Requester is looking | amber (`amberBg`/`amber`) | Home items, create flow |
| `offer` | Owner listed (legacy / explore) | green | Optional elsewhere |

**Home layout:** location pill · headline · search · **category rail (filter)** · create-request CTA · «طلبات قريبة» list (`AppRequestRow`).
**Explore:** same categories + request rows; sort nearest / needed-soonest; no rent/buy or price.

### Create request (simplified)

User is always the **requester**. No prices.

**Step 1:** photo · general category · description + `#` hashtags · quantity · need-by · location

**Step 2:** summary · reach radius (toggle select/clear) · delivery · verified-only · contacts · terms

Payment is always cash (no picker).

### Orders (طلباتي)

Request-shaped orders — **no prices**. Fields: photo · category · title · qty · need-by · peer · status.
Timeline: published → offer accepted → ready for pickup → handover code → completed (no insurance/deposit/late fee).
List + detail use the same visual language as `AppRequestRow` (مطلوب / عرضي chips).

---

## 5. Arabic specifics

```dart
// main.dart
MaterialApp.router(
  locale: const Locale('ar', 'EG'),
  supportedLocales: const [Locale('ar', 'EG')],
  localizationsDelegates: const [
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  builder: (context, child) =>
      Directionality(textDirection: TextDirection.rtl, child: child!),
);
```

**Arabic-Indic numerals** (٢٥ not 25) — the design uses them everywhere:

```dart
// core/utils/arabic_numerals.dart
const _ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
extension ArabicNum on String {
  String get toArabicDigits =>
      replaceAllMapped(RegExp(r'\d'), (m) => _ar[int.parse(m[0]!)]);
}
// Prices: NumberFormat.decimalPattern('ar_EG') already emits Arabic-Indic digits.
```

Apply this **only at the presentation layer**. Models keep real `int` / `DateTime`.

**Other RTL rules:**
- `EdgeInsetsDirectional.only(start:, end:)` — never `left:` / `right:`
- Chevrons/back arrows point **right** in RTL; use `Icons.arrow_forward` for "back",
  or better: `Directionality`-aware icons via `Icons.arrow_back` which auto-flips when
  `matchTextDirection: true` on the image, or just pick the correct glyph explicitly.
- Test every screen with a long Arabic string to catch overflow before it ships.

---

## 6. Build order for Claude Code

Do these as **separate sessions**, verifying each before moving on.

| # | Task | Done when |
|---|---|---|
| 1 | Create project, add deps, wire theme extension, build `design_gallery_screen` | Gallery renders every component in light + dark, no hardcoded values |
| 2 | Golden tests for the gallery | `flutter test --update-goldens` produces stable snapshots in both themes |
| 3 | Shell: bottom nav + go_router with 5 empty tabs | Navigation works, nav bar matches design |
| 4 | Home screen with fake repo | Matches mockup; rows use `AppListRow` |
| 5 | Listing screen incl. availability calendar | Calendar shows full / partial / free / picked correctly |
| 6 | Create-request flow (2 steps) | Validation + "reaches N owners" line |
| 7 | Offers screen | Four comparison fields per offer |
| 8 | Search + results + empty state | Empty state offers: create request / widen radius |
| 9 | Transaction timeline + handover code | States render in order |

**Suggested deps:** `google_fonts`, `go_router`, `flutter_riverpod` (or your preferred
state solution — pick one and stay with it), `freezed` + `json_serializable`,
`cached_network_image`, `intl`, `golden_toolkit` (dev).

---

## 7. Prompt to open with in Claude Code

> Read `FLUTTER_SPEC.md` in the repo root. Create a new Flutter project following the
> structure in section 1. Implement section 2 tokens exactly as written — do not adjust
> any hex value, radius, or size. Then implement every component in section 4 and a
> gallery screen that renders each one in both light and dark themes.
>
> Constraints: no hardcoded colors or sizes outside `core/theme/`; no Material ripple;
> no elevation or shadows anywhere; all padding uses `EdgeInsetsDirectional`; app is
> RTL Arabic only. Stop after the gallery screen and show me a screenshot before
> building any feature screen.

That last sentence is the important one. Review the gallery, then unlock the screens.

---

## 8. QA notes (for your own review pass)

- Golden tests per screen in both themes catch visual regressions cheaply.
- Test with `textScaleFactor` at 1.3 — Arabic at large text sizes breaks tight rows first.
- Check the calendar around month boundaries and a fully-booked month.
- Check every screen with: empty list, single item, 50 items, and a 60-character Arabic title.
- Verify no widget renders correctly only because of LTR assumptions — flip to LTR
  temporarily in debug and look for layouts that *improve*; those have a hardcoded side.
