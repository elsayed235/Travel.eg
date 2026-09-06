# خطة إصلاح منصة دهب — كل البنود ما عدا الدفع

## Context — ليه بنعمل ده

جرد الفيتشرز (artifact `2cfe0d86`) طلّع إن الباك إند أنضج من الفرونت بفارق كبير: 224 مسار API و42 خدمة و478 اختبار ناجح، بس نسبة كبيرة من الشغل ده مش موصولة بأي شاشة، وفيه باگات مؤكدة بتوصل للمستخدم النهائي.

المطلوب: إصلاح كل ما رصده التقرير **ما عدا أي شغل بيلمس الفلوس**.

**Baseline الحالي (متحقَّق منه):** `tsc --noEmit` نظيف · `vitest run` 478/478 · `npm run build` ناجح.
> ملاحظة: خطأ `AttractionsView.tsx` اللي كان في التقرير اتصلح خارج الجلسة دي، فاتشال من الخطة.

### خارج النطاق (قرار المستخدم)
أي حاجة بتلمس الدفع أو حركة الفلوس: تكامل Paymob، فورم الكارت في `BookingPaymentStep.tsx`، **وكمان** ربط الاسترداد والمطابقة (`processRefund`, `processOpsRefund`, `reconcileLedger`, `/commerce/refund`, `/operations/refund`).
الملفات دي **ممنوع تتلمس**، وأي بند تحت بيقرب منها لازم يفضل بعيد عنها (منصوص عليه في §3 و§2).

### تصحيحات على التقرير المنشور (متحقَّق منها في الكود)
| التقرير قال | الحقيقة |
|---|---|
| `src/shared/api/index.ts` ميت بالكامل | **لأ.** `src/shared/index.ts:11` بيعمل `export * from './api'` و7 ملفات سيرفر بتستورد الـbarrel. الحذف لازم يبقى 3 خطوات بترتيب (§2). |
| ثغرة الـSVG سببها الـ`mimeType` بيبني الامتداد | **الآلية غلط، الخلاصة صح.** `ext` في `adminContentRoutes.ts:238` محسوب ومش مستخدم. الاسم المخزّن = `filename` اللي بيبعته العميل، منقّى بـ`[a-zA-Z0-9._-]` — والنقطة مسموحة، يبقى `evil.svg` بيفضل `.svg`. |
| فايربيز بيتحمّل من أول لحظة | **لأ، هو lazy فعلاً.** التسريب أضيق: `AuthView.tsx:4` بيستورد `humanizeAuthError` استاتيك من `lib/firebase` فبيسحب 736KB في شانك مسار الـauth (§6a). |
| 36 ملف مهجور | العدد الحقيقي أكبر (~49 بالـgrep، ~66 بمشية reachability). **مش هنثق في أي قايمة يدوية** — §2 بيولّدها ميكانيكياً. |

---

## Workstream 1 — إصلاح رفع صور الـCMS  🔒 أمان

**الملفات:** `server.ts` (`:143` helmet, `:149` body parser, `:178-201` تقديم الميديا) · `server/api/adminContentRoutes.ts` (`:199`, `:214-275`) · `src/components/operations/command-center/CmsContentDashboard.tsx:831` · جديد `server/utils/imageValidation.ts` · جديد `tests/security/mediaUpload.test.ts`

**(أ) حد الـbody — مقيّد بالمسار، مش عام.**
ما نرفعش `express.json()` العام لـ14MB؛ ده بيدّي 224 مسار ميزانية parse ضخمة. بدل كده:
- نخلي `express.json()` العام صريح بحده (100KB) عشان الربط يبقى ظاهر.
- نركّب parser تاني على مسار الرفع بس، **قبل** الـmount في `server.ts:171`:
  `app.use('/api/admin/content/media/upload', express.json({ limit: … }))`
- الحد يتحسب من رقم واحد: نستورد `MAX_UPLOAD_SIZE` ونحسب `ceil(MAX * 4/3) + 64KB` (base64 بيزوّد 33%، و`limit` بيقيس الـbody الخام).
- نضيف فرع `entity.too.large` في `server/middleware/errorHandler.ts` يرجّع JSON بدل صفحة Express HTML، وفحص حجم client-side في `CmsContentDashboard` قبل التحويل لـbase64.

**(ب) allowlist + magic bytes.** `server/utils/imageValidation.ts` جنب `detectImageDimensions` الموجودة (نفس التقنية):
- `ALLOWED = { 'image/jpeg':'.jpg', 'image/png':'.png', 'image/webp':'.webp', 'image/gif':'.gif' }` — **SVG مستبعد عمداً**.
- `sniffImageType(buffer)` بيقرا الـmagic bytes: `FF D8 FF` / `89 50 4E 47…` / `RIFF…WEBP` / `GIF8[79]a`.
- ترتيب الهاندلر: parse → ارفض لو الـmime مش في الـallowlist → decode → ارفض لو أكبر من `MAX_UPLOAD_SIZE` → **ارفض لو `sniffImageType(buffer) !== mimeType`** → اكتب.

**(ج) الاسم يبقى من عند السيرفر — ده إصلاح الـXSS الفعلي.** بدل `:238-241`:
الامتداد ييجي من الـMIME المتحقَّق منه (`ALLOWED[mimeType]`)، والـstem يتنضّف بـ`[^a-zA-Z0-9_-]` (**من غير نقطة**) ويتقص عند 60 حرف. الاسم الأصلي يفضل مخزّن في `cmsMedia.create({ filename })` كـ**بيانات للعرض** بس.

**(د) تقديم الميديا** — `server.ts:190-200`: نشيل `.svg` من الخريطة · `X-Content-Type-Options: nosniff` · `Cross-Origin-Resource-Policy: same-site` · أي امتداد بره الخريطة يترد بـ`application/octet-stream` + `Content-Disposition: attachment` · و**`Content-Security-Policy: default-src 'none'; sandbox` على المسار ده وحده** — ده بيعطّل أي SVG قديم على الديسك من غير ما نلمس helmet العام.

**(هـ) الملفات القديمة:** لوج وقت الإقلاع في `migrateMediaAssets()` (`server.ts:120`) يسرد أي ملف بامتداد بره الـallowlist. **مانحذفش محتوى مستخدم تلقائياً.**

**CSP عام دلوقتي؟ لأ — بند منفصل لاحقاً.** الـCSP المقيّد بالمسار في (د) بيقفل الثغرة الفعلية. الـCSP العام مداه التطبيق كله ومفيش أي اختبار فرونت يثبت إن الدخول لسه شغّال، ومحتاج سياستين مختلفتين (dev فيه Vite middlewares بتحقن inline styles وHMR websocket، وprod لأ)، وسطر التعليق في `server.ts:143` بيقول ده بالظبط. الخبر الكويس: صفر `dangerouslySetInnerHTML` في `src/`، وكل الـinline styles هي `style={{}}` بتاعة React (CSSOM، مش محكومة بالـCSP) — يعني `script-src 'self'` صارمة ممكنة كـworkstream مستقل بعد ما Phase 0 تنزل.

**مخاطر:** رفع حد الرفع من غير `sniffImageType` بيحوّل سقف 100KB لسقف 14MB على مسار مُصادَق عليه — **(أ) و(ب) في نفس الكوميت**.
**تحقق:** اختبار node-env لـ`sniffImageType` وباني الاسم (`filename:'x.svg'` + `mimeType:'image/png'` + بايتات PNG ← لازم ينتهي بـ`.png`؛ `image/svg+xml` ← يترفض؛ PNG معلن ببايتات JPEG ← يترفض) · `curl` بصورة 400KB ← 201 (كانت 413) · `curl -i /api/media/<legacy>.svg` ← `attachment`.

---

## Workstream 2 — حذف الكود الميت

**القايمة تتولّد ميكانيكياً — مش grep.** سكريبت `scripts/find-unreachable.ts` (المجلد موجود وفاضي) يشتغل بـ`tsx`:
- **يستخدم `ts.resolveModuleName` بالـ`tsconfig.json` الحقيقي** — لا resolver يدوي. (تجربة الـPlan agent: resolver يدوي على ويندوز خلط الـseparators فقال إن كل barrel في الريبو ميت، ومن ضمنهم اللي 7 ملفات سيرفر بتستورده.)
- **الجذور لازم تكون متعددة:** `src/main.tsx` · `server.ts` · `vite.config.ts` · `vitest.config.ts` · كل `tests/**/*.test.ts` + `tests/setup.ts` · `server/test/run*.ts` · ملفات `server/db/{sqlite,seeds,research}/*.ts` المشار لها في سكربتات `package.json` · كل `*.d.ts`. (السيرفر بيستورد `src/data/dahabGeography` و`src/shared`؛ الاختبارات بتستورد `src/services/placeMapper`.)
- **يمشي لحد الـfixpoint** — حذف كومبوننت بيخلي غيره غير قابل للوصول.

**الكوميتات، بالترتيب ده:**
1. ملفات الكومبوننتس غير القابلة للوصول — **ما عدا الـ14 بتوع `mytrip/`**، دول بتاعين §3 لأنه محتاج يقراهم قبل ما يحذفهم. قبل الحذف: grep الـ19 سكريبت في `tests/browser-qa/*.mjs` على `id=` بتاع كل كومبوننت.
2. `maps/DahabSpatialContextMap.tsx` هو **الوحيد** اللي بيستخدم `@vis.gl/react-google-maps` → احذف الملف + `npm uninstall` + سطر `vendor-maps` في `vite.config.ts:32` (وعدّل التعليق فوقه، بقى غير صحيح) + راجع مفتاح الخرايط في `.env.example`/`Dockerfile`. كوميت لوحده عشان الـbundle delta يبان.
3. `src/tokens/` (7 ملفات، صفر مراجع، وTailwind v4 هنا متظبّط بـ`@tailwindcss/vite` من غير `tailwind.config.js` فمش متقرية كـtheme). كوميت منفصل مع ملاحظة — ملفات design tokens حاجة الناس بتنوي توصلها بعدين.
4. سلسلة `buildProblemDetails` — **بالترتيب ده بالظبط**: احذف `server/utils/problemDetails.ts` (صفر مستدعين لـ`createProblemDetails`) ← دلوقتي `buildProblemDetails` بقى بصفر مستدعين، احذف `src/shared/api/index.ts` ← شيل `export * from './api'` من `src/shared/index.ts:11` **وسيب باقي الملف، هو حي جداً**. النوع `ProblemDetails` في `src/shared/types/api.ts` يفضل.

**كنس دوال `api.ts` مؤجّل لـPhase 4** — لأن §4 بيحيي 4 دوال (`getFitWindowOptions`, `getPostActivityFood`, `getTravelEstimate`, `parseSearchIntent`)، و5 دوال تانية مابتموتش غير بعد حذف الملفات فوق. الحساب النهائي هناك.

**مخاطر:** `noUnusedLocals` مقفول (بدليل `ext` الميت اللي بيعدّي الـtypecheck)، فـ`tsc` **مش** هيمسك import زايد بعد حذف — الاعتماد على إعادة تشغيل السكريبت. · `App.tsx:57` بيربط الاسم `OperationsConsoleView` بـ`CommandCenterShell`؛ احذف ملف `operations/OperationsConsoleView.tsx` و**ماتلمسش `App.tsx`**.
**تحقق:** `npm run lint && npm run test && npm run build` بعد كل كوميت + إعادة تشغيل السكريبت + تسجيل `du -k dist/assets/*.js` قبل/بعد.

---

## Workstream 3 — تفكيك MyTripView + نقل منطق الميزانية

**الهدف (قرار المستخدم):** نفكّك التصميم **الحالي** لكومبوننتس ترسم **نفس الواجهة بالظبط**، ننقل المنطق الحقيقي من المهجورين، ثم نحذفهم.

`MyTripView.tsx` فيه بانرات أقسام جاهزة — نقراها كمواصفة التفكيك:

| الأسطر | القسم | الملف الجديد |
|---|---|---|
| 196–424 | SUB-FLOW ROUTING (8 بلوكات `if (isXOpen) return`) | `mytrip/MyTripSubFlows.tsx` |
| 425–493 | كوكبيت الهيدر | `mytrip/sections/TripCockpitHeader.tsx` |
| 497–595 | كارت الهيرو | `mytrip/sections/TripHeroCard.tsx` |
| 596–677 | بانر Next Up | `mytrip/sections/NextUpBanner.tsx` |
| 678–738 | شريط التابات | `mytrip/sections/TripTabRibbon.tsx` |
| 739–1021 | تاب Timeline | `mytrip/sections/TripTimelineTab.tsx` |
| 1022–1147 | تاب Bookings → 3 ملفات | `sections/TripBookingsTab.tsx` · `sections/TripBudgetCard.tsx` · `sections/TripGroupSplitCard.tsx` |
| 1148–1292 | تاب Tools | `sections/TripToolsTab.tsx` |
| 1293–1322 | المودالات | تفضل في `MyTripView.tsx` |

زائد استخراجين منطق (مش markup): `mytrip/useMyTripSubFlows.ts` (الـ8 `useState` في `:96-108` + الـcallbacks المتكررة، بيشيل ~130 سطر) و`mytrip/tripActivityIcon.tsx` (`getActivityIcon` من `:186-207`).
`myTripData.ts` **يفضل** — 6 ملفات حية بتستورده.

**التغيير السلوكي الوحيد — نقل حساب الميزانية.** `MyTripView.tsx:1082-1112` بيعرض `0%` و`7,600 EGP` و`w-[25%]` و`18%` و`$160` ثابتين لكل مسافر. ننقل الـ`useMemo` من `SmartBudgetSection.tsx:29-64` لدالة **نقية قابلة للاختبار**:
```
src/components/mytrip/tripBudget.ts
  export const CATEGORY_MAP: Record<LedgerEntryType, { en; ar; color }>
  export function summariseBudget(entries: LedgerEntry[], tripBudgetEGP: number):
    { totalSpent; totalRefunded; remaining; percentSpent; categories: { key; spent; color }[] }
```
انحرافان مقصودان عن المهجور: (1) ترجع `key` مش label مترجم — الأصل بيعمل `language === 'ar' ? …` جوه الـmemo فبيخلي `language` dependency ويمنع الاختبار والترجمة؛ التوطين يتم في الكومبوننت بـ`t()`. (2) `SmartBudgetSection.tsx:14` فيه `ar: '逆ع عمولات'` — codepoint صيني تايه، الصح `'عكس عمولات'`؛ ماننقلش الغلطة.
بعدها `TripBudgetCard` يستدعي `summariseBudget(ledgerEntries, activeTrip?.totalEstimatedEGP ?? 850)`، و`MyTripView` لازم يضيف `ledgerEntries` لتفكيك `useTrip()` (`:76-86` مش بيسحبها حالياً).

> **⚠️ نقطة التماس الوحيدة مع الشغل خارج النطاق:** `summariseBudget` بتقرا قيود `REFUND_ISSUED`/`COMMISSION_REVERSAL`/`RECOVERY_CREDIT` **للعرض فقط**. لازم تفضل في `src/components/mytrip/` — **مش** في موديول commerce مشترك — عشان مايبقاش فيه أي درز يتصادم مع شغل الاسترداد بعدين.

**إنقاذان أصغر:** عدد المسافرين — `MyTripView.tsx:132` بيقول `tripBrief.travelersCount || profile.travelersCount || 2` فالمسافر الفردي بيشوف "2 Travelers"؛ الصح في `GroupTravelSection.tsx:11`: `activeTrip?.travelersCount ?? profile.travelersCount ?? 1` (لاحظ `??` مش `||`). · **`TripStyleSummary.durationLabel()` ماينتقلش** — بيحرق `'en-GB'` و`'day'/'days'` إنجليزي، و`formatTripDateRange` المستخدمة حالياً أفضل منه.

**ثم حذف الـ14:** `BookingsSection`, `GroupTravelSection`, `ItineraryAuditorCard`, `MyTripHeader`, `MyTripStatusBadge`, `PreparationPreviewModal`, `SmartBudgetSection`, `SupportCard`, `TodaysContextCard`, `TripStyleSummary`, `TripToolInfoModal`, `TripToolsSection`, `WhatsNextCard`, `TripTimeline`.

**إثبات إن الواجهة ماتغيّرتش:**
1. `tests/e2e/mytrip-baseline.spec.ts` — قبل أي تعديل على `master`: لكل 3 تابات × لغتين، صوّر (أ) PNG كامل و(ب) `outerHTML` منقّى (شيل ids المولّدة، اطوِ المسافات، رتّب توكنز الـclass). بعد التعديل: الـdiff لازم يبقى **متطابق بايت-بايت ما عدا أرقام الميزانية** — ودي التغيير المقصود.
2. اختبار وحدة `tests/domain/tripBudget.test.ts`: دفتر فاضي ← صفر و`remaining === budget` · الاسترداد بيطرح · الفئات مرتّبة تنازلي · `budget === 0` ← `percentSpent === 0` (مفيش قسمة على صفر).

**مخاطر:** انفجار الـprops — `TripTimelineTab` محتاج 14 prop لو ورّثناهم. **الحل:** الأقسام تنادي `useTrip()`/`useLanguage()`/`useTheme()` **بنفسها** (ده اللي كل مهجور بيعمله أصلاً، `SmartBudgetSection.tsx:26-28`)، والـprops تبقى الـstate المحلي بس (3–4). · **~8 كوميتات، قسم واحد كل مرة**، كل واحد `tsc`-نظيف وبيعيد تشغيل الـHTML diff — كوميت واحد بـ1300 سطر مش قابل للمراجعة. · تفريعات `isDark` في كل حتة: **انسخها حرفياً**، ماتنضّفش الـhex بتاع اللايت مود في نفس المرور (ده تغيير بصري لابس هدوم refactor).

---

## Workstream 4 — توصيل طبقة `/api/context/*`

**خطوة 1 — نقل الأنواع.** `RouteEstimate`, `WindowFitOption`, `PostActivityFoodSpot` من `server/services/mapsContextService.ts:4-58` لـ`src/shared/types/context.ts` (سابقة مطابقة: `src/shared/types/food.ts`, موثّقة في `FoodNowView.tsx:50-53`). `mapsContextService` يستوردهم من هناك (الاتجاه ده موجود عنده أصلاً في `:1`)، و`src/shared/index.ts` يعمل re-export. نضيف كمان أغلفة الرد `FitWindowResponse` و`PostActivityFoodResponse` (موجودة دلوقتي كـinline annotations في `:244-249` و`:361-366`).

**خطوة 2 — إصلاح الأغلفة الأربعة** (`src/services/api.ts:1019-1055`) للمعيار المتبع في `getDahabDining`: (أ) `signal?: AbortSignal` أخير ممرّر لـ`fetchWithTimeout` (اللي بيدمج signal المستدعي مع الـtimeout في `:149-161`) · (ب) نوع رجوع صريح بدل `any` · (ج) `readJson` بدل `res.json()` عشان 404 اللي بيقع على `index.html` يطلع `ApiError` مقروء مش `Unexpected token '<'` · (د) نص fallback بلغة المسافر. `parseSearchIntent` يحتفظ بـ`timeout: AI_TIMEOUT_MS`.

**خطوة 3 — احذف `/api/context/daily-briefing`.** `geminiReasoningService.generateDailyBriefing` (`:122-131`) **مابينداش Gemini أصلاً**، بيتجاهل 2 من 3 باراميترات، وبيرجّع قالب — وفيه briefing حقيقي شغّال في DayGI (`src/shared/types/daygi.ts:99`). احذف `server.ts:468-476` والدالة. مفيش غلاف عميل، فمدى التأثير صفر. قاعدة `/^\/context\//` في `apiAccessPolicy.ts:51` ماتحتاجش تعديل.

**خطوة 4 — `WhatShouldIDoNowView`.**
مابر جديد `src/services/spontaneousMapper.ts` (سابقة: `diningMapper.ts`, `exploreMapper.ts`): `windowFitToSpontaneousOption(o, availableMinutes)`. اشتقاقات أمينة: `mood`/`tag` من `category` (`dive|desert→adventure`, `sunset|relaxation→chill`, `food→explore`) · `priceEstimate` من `costEgp` · `isTightFit = totalRequiredMinutes > availableMinutes * 0.85` · `timeSlot` من `new Date()` مش literal · **`whyItFits`/`whyThisDetailed`/`whyItWorks` كلهم من `reasonEn/Ar` — ماناخترعش 3 جمل من واحدة**؛ الأكورديون تلات الطبقات بيبقى عنده كلام أقل للخيارات الحية، وده الناتج الأمين.
التوصيل بنمط `FoodNowView.tsx:357-366`: `useApiResource` بـfetcher ثابت مرجعياً (`useCallback([minutes])` — arrow مضمّن بيعيد الطلب كل render)، والـ3 خيارات الحالية تفضل **fallback** (`useApiResource` بيحتفظ بالـdata القديمة عند الخطأ).
**`availableMinutes` تيجي كـprop من `MyTripView`** (اللي عنده `nextUpActivity` memo في `:135-144`) مش تتشتق هنا — عشان مايبقاش فيه ساعتين مختلفتين.
**شيل الـPrototype Switcher** (`:326-346`) و`isLowTimeWindowMode` (`:94`) — ده مبدّل QA متشحن للمسافرين. **بس سيب فرع الفرص القليلة** في `:390+`، هو empty state مشروع؛ اربط شرطه بـ`options.length === 0` (وده بالظبط اللي السيرفر بيرجّعه لما كل مرشّح محتاج وقت أطول — `mapsContextService.ts:342-344`)، وحوّل بادج "25 min available" (`:363`) لـ`availableMinutes`.
شيل كمان الحروف الثابتة المتشحنة للمسافر: `"What should you do now, Ahmed?"` (`:381`) · `"Next: Lunch · 1:30 PM"` (`:369`) · `'12:00 PM'` (`:241`) · `'Logged in as Ahmed (ahmed.traveler@example.com)'` (`:268`). `FoodNowView.tsx:65-71` حلّ مشكلة الاسم خلاص — انسخه.

**خطوة 5 — `FirstTwoHoursView`.** **ماتحاولش** تجيب مصفوفتَي `TimelineStep[]` من `fit-window` (عدم تطابق شكل). توصيلان أضيق وصح:
- **كارت `early_done` في `:488-545`** — الدرز الحقيقي. بيقول حرفياً "3 quick contextual ways to enjoy your surplus **35** minutes" بتلات أزرار ثابتة. استبدله بـ`getFitWindowOptions({ availableMinutes: clock.minutesUntilCheckIn })` عبر نفس الـmapper. الأرقام في `:250-256` حقيقية أصلاً.
  ⚠️ `ActivityOptionModal` بياخد `type: 'breakfast'|'beach'|'walk'|null` بـ`contentMap` ثابت. **الخيار الحي يروّح لـ`actionRoute`** (السيرفر بيوفّرها) بدل ما يفتح المودال — يتجنّب إعادة كتابة مودال 400 سطر. المودال يفضل لمسار الـfallback.
- **خطوة "Head toward your hotel"** (`:155-165` وتوأمها ~`:225`) بتحرق `'30–40 min'` ← ده `getTravelEstimate(origin,'hotel').displayEstimateEn/Ar`، استبدال حقل واحد ومكاشّ 24 ساعة على السيرفر. ده المستهلك الوحيد لـ`travel-time` وهو اللي بيبرّر إبقاء الـendpoint.
- المصفوفتان متكررتان ~90%؛ توحيدهما تبسيط مشروع بس **في كوميت منفصل** عن التوصيل.

**خطوة 6 — `post-activity-food` في `FoodNowView`؟ لأ، ماتستاهلش دلوقتي.** الشاشة بتدمج `/api/dahab/food` (10 أماكن حقيقية بمطابخ وفئات أسعار ومواعيد وأعلام غذائية) مع 3 منسقين؛ و`getPostActivityFood` بيرجّع 1–3 عناصر من فحص نصي `locationId.includes('blue-hole')` — بيانات **أقل**، بشكل مختلف، من غير مينيوهات. مكانها الصح كارت متابعة جوه فلو `early_done`. سيب الغلاف (متنوّع) وسجّلها في `docs/` كـ«غير موصولة عمداً».
**بس شيل مبدّلات المحاكاة المتشحنة من `FoodNowView` بغض النظر:** `isNoFoodAvailableMode` (`:113`) ← يبقى `filteredOptions.length === 0` (حقيقي وقابل للوصول من فلتر الفئة) · `isDeliveryDelayed` (`:103`) مفيش إشارة حقيقية وراه، احذف الفرع · الكارت المزروع بـ`{'dish-1':1,…}` (`:93-97`) يبدأ فاضي.

**احذف `parseSearchIntent` كمان** — مفيش مستدعي طبيعي ليه، وأغلفة ميتة هي اللي وصّلتنا للوضع ده. يترجّع لما شاشة بحث تحتاجه.

**مخاطر:** §4 بيحيي 4 دوال §2 كان هيحذفها ← **§4 قبل كنس `api.ts`** (مضبوط في الترتيب). · `useApiResource` محتاج fetcher ثابت؛ arrow مضمّن = لوب لانهائي على endpoint وراه Gemini.
**تحقق:** `tests/domain/spontaneousMapper.test.ts` على غرار `exploreMapper.test.ts` (حدود tight-fit + المجموعة الفاضية) · `curl -X POST /api/context/fit-window -d '{"availableMinutes":40}'` بيرجّع 0 خيارات ← الشاشة تعرض حالة الفرص القليلة مش crash · Playwright على `/what-should-i-do-now` بلغتين، ومع API مستنسخ بـ500 ← الـfallback المنسق لازم يرسم.

---

## Workstream 5 — ترحيل التعريب (codemod)

**الأداة: `ts-morph` تحت `tsx`** — بيلفّ الـ`typescript ~5.8.2` المثبّت أصلاً، وبيدي `ConditionalExpression` حقيقي، و`replaceWithText()` على عقدة واحدة بيحافظ على باقي الملف بايت-بايت. (jscodeshift/recast محتاج إعداد TSX منفصل ومش فاهم الـtsconfig.)

```
scripts/i18n/extract.ts   # مسح ← manifest JSON للمراجعة. مابيكتبش مصدر.
scripts/i18n/apply.ts     # manifest معتمد ← تعديل المصادر + الكتالوج
scripts/i18n/verify.ts    # إعادة مسح؛ يثبت إن كل نص معروض ماتغيّرش
```
مرحلتين وبينهم artifact JSON يراجعه إنسان — دي قصة الأمان كلها.

**⚠️ الـpredicate اللي في التقرير غير آمن كما هو.** بوابة واحدة (الفرعان literals) بتختار 4145 عقدة، **1099 منهم `isRTL ? 'rotate-180' : ''`** — CSS واتجاه، مش نصوص. الصح **3 بوابات**:
1. **الشرط** يطابق `/^(language|lang|locale|currentLanguage|siteLanguage)\s*===\s*['"]ar['"]$/` — مش `isRTL`/`isAr` أبداً.
2. **الفرعان** `StringLiteral | NoSubstitutionTemplateLiteral` (ميكانيكي) أو `TemplateExpression` (تفريغ متغيرات).
3. **فرع عربي فيه حروف عربية فعلاً** `/[؀-ۿ]/` — لو مفيش حرف عربي في أي فرع، فده مش ترجمة.

**النتيجة المقيسة:** 2242 ميكانيكي في 88 ملف · 132 بمتغيرات (99 معرّف بسيط، 33 تعبير) · 45 بيسقطوا في البوابة 3 ← **مراجعة يدوية** (`'rtl':'ltr'`, `'←':'→'`, `'left-3.5':'right-3.5'`…) · 476 مستبعدين صح (473 منهم `obj.fieldAr : obj.field`) · 1297 بشرط `isRTL` مستبعدين صح.

**تسمية 2242 مفتاح:** `<namespace>.<slug>` — الـnamespace من جدول ثابت في `extract.ts` (يتراجع مرة واحدة) يطابق المتبع فعلاً (`arrival/`→`arrival.` عنده 100 مفتاح، `mytrip/`→`myTrip.`، `operations/command-center/`→`cmd.` عنده 424)؛ والـslug = أول 4–5 كلمات من **الفرع الإنجليزي** camelCase، أقصى 40 حرف. تصادم بنفس النص ← **مفتاح واحد** (متوقع عدد معتبر: "Recommended"، "15 min"، "Back to My Trip" بتتكرر كتير). تصادم بنص مختلف ← `-2`. **assert صارم** إن أي مفتاح مولّد مش موجود في الـ1174 الحاليين.
سبب الـslug بدل hash: الـdiff لازم يبقى مقروء لواحد بيقرر هل `arrival.dropYourLuggageAtA` هو المفتاح الصح. الإدراج تحت البانرات المرقّمة الموجودة، **من غير إعادة ترتيب أي مدخل حالي**.

**مشكلة نطاق `t`:** **55 من الـ88 ملف مابيفكّكوش `t`** من `useLanguage()`. الكودمود لكل ملف: يلاقي نمط `const { … } = useLanguage()` ويضيف `t` لو ناقص؛ ولو الملف مافيهوش `useLanguage()` خالص ← **يفشل بصوت عالي ويتخطاه** ويسجّله للمراجعة اليدوية.
الضحية الحقيقية: **`src/lib/firebase.ts`** — `humanizeAuthError` (`:183-217`) فيه 14 زوج ثنائي اللغة، دالة عادية بتاخد `lang`، ومايقدرش ينادي hook. **الحل: §6a بينقلها لـ`src/lib/authErrorMessages.ts` بجدول محلي خاص بيها، والملف مستبعد من الكودمود.**
**استبعادات ملزمة:** `src/lib/firebase.ts` · `src/components/booking/BookingPaymentStep.tsx` (91 ternary — الملف خارج النطاق وأي كودمود يلمسه هيتصادم مع شغل الدفع).

**الـ132 حالة متغيرات — نوسّع `t()`، مانشرش `interpolate`.** اتفاقية `{placeholder}` موجودة أصلاً في 8 مداخل بالكتالوج، والمساعد `interpolate` **مكرر حرفياً** في `HotelDetailView.tsx:27` و`HotelsView.tsx:36`. طيّه جوه `t()` بيحذف النسختين ومابيضيفش حاجة على أي call site.
```ts
type TVars = Record<string, string | number>;
t(key): string
t(key, fallback: string): string          // 226 استدعاء حالي — لازم يفضل شغّال
t(key, vars: TVars, fallback?: string): string
```
التمييز بـ`typeof b === 'object'`. `interpolate` تروح `src/i18n/interpolate.ts` كتصدير مسمّى قابل للاختبار، والنسختين المحليتين يتحذفوا. ولفّ `t` في `useCallback([language])` وإنت هناك — هي بتتعاد كل render وهتبقى dependency لـmemos في الملفات المرحّلة.
تسمية الـplaceholder: المعرّف البسيط ← آخر مقطع (`${profile.name}` → `{name}`) · التعبير ← يروح inline في كائن الـvars (`{ count: totalSteps - completedCount }`). **قاعدة: الحالة تتحوّل آلياً بس لو الفرعين عندهم نفس مجموعة أسماء الـplaceholders**، غير كده ← manifest ويدوي.
الجمع المكتوب بالإيد (~6، زي `count === 1 ? 'فرد' : 'أفراد'`): `t()` مافيهوش plurals وICU MessageFormat مبالغة هنا ← **يدوي كمفتاحين + شرط JS في الـcall site**، مع ملاحظة في الكتالوج إن صيغ المثنى/الجمع العربية تقريبية. **ماندّعيش إن الكودمود بيحلها.**
الـ27 حالة فيها `'`/`’`: الباعث **مايبنيش الـliteral بإيده أبداً** — `ts.factory.createStringLiteral` بيختار ويهرّب الاقتباس صح، وخطوة verify بتمسك أي فرق. fixture إجباري فيه `"You're here! Your room should be ready now."` و`"Ralph's German Bakery"`.

**الدفعات (PR لكل واحدة، أقل مدى تأثير الأول):**
| # | النطاق | ~عدد |
|---|---|---|
| 0 | توقيع `t()` + `interpolate.ts` + حذف النسختين + اختباراتها | 0 |
| 1 | `tripos/` + `navigation/` + `common/` | ~150 |
| 2 | `arrival/` + `spontaneous/` + `food/` | ~410 |
| 3 | `operations/` + `intelligence/` (إداري، أقل خطر على المسافر) | ~350 |
| 4 | `booking/` + `commerce/` + `bookings/` — **بدون `BookingPaymentStep.tsx`** | ~250 |
| 5 | الباقي | ~1080 |
| 6 | الـ45 مرفوض + 11 باگ فرعين متطابقين + 6 جمع — **كله يدوي** | ~62 |

**التحقق — أقوى فحص متاح:**
1. **قبل:** `extract --snapshot` يسجّل `{file,line,en,ar}` لكل عقدة مطابقة = 2242×2 نص، دي الحقيقة المرجعية.
2. **بعد:** لكل موقع، حُلّ `t('key')` من الكتالوج الجديد للغتين (بحث في dictionary مسطّح، مش محتاج runtime) وقارن. **أي فرق — فاصلة عليا متغيّرة، مسافة نهائية ضايعة، `—` متطبّعة — يفشّل الجولة.** ده إثبات ستاتيكي يغطي 100% من المواقع، بما فيها اللي وراها states مفيش اختبار بيوصلها.
3. **زائد لقطة نص معروض لكل لغة** للنصف البنيوي — كودمود ممكن ينتج نفس النصوص ويكسر JSX. `tests/e2e/i18n-text-snapshot.spec.ts`: ~15 مسار × لغتين، `document.body.innerText` منقّى، diff قبل/بعد. بيحتاج التطبيق يقلع ← فبيمسك كمان `t is not defined` من تفكيك ناقص، وده أرجح فشل.
4. **ثوابت الكتالوج** كاختبار vitest (`tests/domain/translations.test.ts`): كل مفتاح فريد · مفيش `en`/`ar` فاضي · كل `{placeholder}` في `en` موجود في `ar` والعكس · مفتاح غير مرجَع = تحذير.

**الـ11 باگ فرعين متطابقين (دفعة 6):** أهمهم **باگان حقيقيان** في `restaurants/RestaurantsView.tsx:390` (`row.tier : row.tier`) و`:395` (`row.example : row.example`) — بيانات الصف (`:374-376`) فيها `tier`/`en`/`ar`/`example` ومفيش `tierAr`/`exampleAr`، يعني **القارئ العربي بيشوف "Budget ($)" و"Street ta'ameya, baladi bread, tea"**. الإصلاح محتوى: نضيف الحقول. الباقي (`'—':'—'`, `' · ':' · '`, `'name@example.com'` ×2…) غير ضار ← يتطوى.

**مخاطر:** سطح التصادم **كامل** — 88 من ~200 ملف حي، وده اللي بيفرض الترتيب تحت. · `t` بيرجّع المفتاح نفسه للمسافر لو مفقود ومفيش تشخيص (`nav.memories` اتشحن كده مرة، فيه تعليق عنه في `translations.ts:19-20`) ← ضيف `console.warn` في `import.meta.env.DEV` ضمن دفعة 0. · **الـ476 حالة `obj.fieldAr : obj.field` هي أغلب دين التعريب الباقي والكودمود مابيلمسهاش** — اكتب ده في الـPR، مانخليش «التعريب خلص» توحي إنها اتعملت.

---

## Workstream 6 — الأداء والـSEO

**(أ) استخراج `humanizeAuthError` — مكسب 736KB في 5 دقايق.** متحقَّق من البيلد: `dist/assets/AuthView-*.js` بيبدأ بـ`import"./vendor-firebase-*.js"` (استيراد جانبي ستاتيكي)، و`vendor-firebase` = 736KB، والدالة (`src/lib/firebase.ts:183-217`) مابتلمسش أي API لفايربيز.
1. `src/lib/authErrorMessages.ts` بالدالة منقولة حرفياً. 2. `lib/firebase.ts` يعمل `export { humanizeAuthError } from './authErrorMessages'` عشان `AuthContext.tsx:216,233,257,330` (بتوصلها عبر `(await loadFirebase()).humanizeAuthError`) تفضل شغّالة من غير تعديل. 3. `AuthView.tsx:4` يستورد من الموديول الجديد.
**تحقق:** `npm run build` ثم `grep vendor-firebase dist/assets/AuthView-*.js` ← لازم يبقى فاضي. **لازم ينزل قبل §5.**

**(ب) تقليم الخطوط: 11 عائلة ← 5.** الاستخدام المقيس: `Outfit` ×459 · `font-serif` ×263 (Playfair) · `Plus Jakarta Sans` ×46 · `JetBrains Mono` ×1. ستاكات `src/index.css:4-11` هي المواصفة الحقيقية، وكل عائلة بعد الأولى في أي ستاك **غير قابلة للوصول** — والـ11 كلهم بيتحمّلوا.
**نبقي:** Outfit (400–800) · Plus Jakarta Sans (400–700) · Playfair Display (400–700) · Alexandria (400–700, عربي أساسي) · El Messiri (400–700, عربي serif).
**نشيل:** Space Grotesk · Cairo · IBM Plex Sans Arabic · Readex Pro · JetBrains Mono (استخدام واحد، fallback `ui-monospace`).
كمان: نستبدل نطاقات `200..900` بالأوزان المستخدمة فعلاً (`font-light` ×3 و`font-extralight` ×1 ← حوّلهم `font-normal`). **والأفضل: استضافة ذاتية للـ5 عائلات وحذف الـpreconnect** — بيشيل round trip طرف-ثالث حاجب على شبكة سيناء المحمولة، وهو القيد اللي `vite.config.ts:24-25` بيسمّيه بنفسه.
**قبل الحذف:** `grep "font-\['(Cairo|Readex|Space_Grotesk|IBM_Plex|JetBrains)"` — حالياً JetBrains Mono ×1 بس.

**(ج) `index.html`.** ضيف `og:*` (title/description/image/url/type/site_name/locale + `locale:alternate=ar_EG`) · `twitter:card=summary_large_image` + العناوين · `canonical` · `favicon.svg` + `apple-touch-icon` + 32×32 · `site.webmanifest` (`theme_color`/`background_color: #081714`, `display: standalone`) · `theme-color` · `hreflang` en/ar/x-default · `robots`. الأصول في `public/` (مش موجود، ينشأ — Vite بينسخه كما هو).
**مشكلة `<html lang="en" class="dark">`:** `LanguageContext.applyLanguageAttributes` (`:29-39`) بيضبط `lang`/`dir` من JS بعد التركيب، فالزائر العربي مستنده `lang="en" dir="ltr"` لحد ما React يشتغل. **الحل:** سكريبت inline صغير (~10 أسطر) في `<head>` قبل الـstylesheet يقرا نفس مفتاح `localStorage.getItem('dahab_os_lang')` و`navigator.language` ويطبّق `lang`/`dir`/الكلاس فوراً — من غير وميض ولا layout shift، والمنطق يفضل مصدره الوحيد `LanguageContext` (بنكرّر القراءة بس، مش القرار).
⚠️ سكريبت inline هو بالظبط اللي `script-src 'self'` الصارمة بتمنعه ← سجّل الـhash في تذكرة الـCSP.

**(د) Prerendering — نقترحه كمتابعة، مش دلوقتي.** الحجة له: فيه Express موجود و`app.get('*')` في `server.ts:3167-3181` سطر واحد. الحجة ضده: كل الشجرة `React.lazy` وراء `AuthProvider`/`TripProvider`/`CommerceProvider` بيقروا `localStorage`/`sessionStorage` وقت الإنشاء (`useArrivalClock` بيكتب في `sessionStorage` أول render) — SSR محتاج يحرسهم كلهم، ده refactor مش تغيير إعداد؛ و`renderToString` بيسحب الشجرة كلها في `dist/server.cjs` المبني بـ`esbuild --packages=external`.
**الـ80% الرخيصة: حقن `<meta>` من السيرفر بدون رندر React** — في هاندلر `app.get('*')`، طابق المسار مع جدول `cmsPages` وجدول الفنادق واستبدل نصوص `<title>`/`og:`/`canonical`/`description` في `dist/index.html` قبل الإرسال. ~40 سطر، صفر مخاطرة، وبيصلّح اللي الـprerendering كان مطلوب له (معاينات الروابط وميتاداتا الزواحف). Googlebot بينفّذ JS فبيشوف المحتوى المرندر أصلاً. **اعملها ضمن (ج)، وقول صراحة إن الـSSR مؤجّل مش مرفوض.**

**(هـ) الـ150 رابط Unsplash — سيبهم، بس وقّف النزيف.** (الحقيقة: 150 في `src/` **+ 49 في `server/`**، منهم جوه `mapsContextService.getFitWindowOptions` اللي §4 على وشك يعرضها للمسافرين.)
**ماننزّلهمش ونستضيفهم:** الترخيص قرار إنسان مش مهندس، وحجم الـbundle مايتأثرش (روابط runtime مش أصول)، والحل الحقيقي هو خط الميديا بتاع الـCMS (§1) اللي عنده جدول `cms_media` بـ`alt_en`/`alt_ar`/`credit`.
**اللي يستاهل:** (1) توحيد باراميترات التحويل (`?q=80&w=…&auto=format&fit=crop`) على اللي ناقصينها — bandwidth ببلاش. (2) `loading="lazy"` + `width`/`height` صريحين على كل `<img>` بيتغذّى منهم — بيقتل الـCLS، وميكانيكي. (3) **الأهم: `src/data/placeholderImagery.ts`** بثوابت مسمّاة تستبدل الـ150 literal، والـ49 بتوع السيرفر يروحوا لنفس الموديول في `src/shared/` (الاتجاه ده موجود أصلاً). بعدها التبديل لميديا الـCMS ملف واحد، وقاعدة lint تمنع أي `images.unsplash.com` جديد في `src/`.

---

## Workstream 7 — الاختبارات

**(أ) اختبار عقد العميل↔السيرفر — `tests/domain/apiContract.test.ts`، ستاتيكي مش runtime.**
`server.ts` مفيهوش `export`، وبينادي `app.listen` وبيشغّل migrations وseeds و`setInterval`×2 في جسم الموديول — استيراده من اختبار بيقلّع سيرفر حقيقي. تصديره هو الصح على المدى الطويل بس تغيير كبير وخطر على ملف 3225 سطر، والمقاربة الستاتيكية بتمسك الباگ الموجود فعلاً من غيره.
**عدّ السيرفر** (`tests/helpers/serverRoutes.ts`، بالـTS compiler API المثبّت): (1) في `server.ts` كل `CallExpression` على `app.<method>` أول وسيطه `StringLiteral` بيبدأ بـ`/api` (95). (2) في كل `server/api/*.ts` كل `<ident>Router.<method>` بـ`StringLiteral` (129). (3) في `server.ts` كل `app.use(<prefix>, <Identifier>)`، حلّ المعرّف لملف الراوتر واضم `prefix + path` (9 mounts في `:159-208`؛ تخطّى اللي وسيطهم التاني middleware مش راوتر). (4) الناتج `Set<"GET /api/hotels/*">` بعد استبدال كل `:param` بـ`*`.
**عدّ العميل** (`tests/helpers/clientRoutes.ts`): كل `fetchWithTimeout`/`fetch` في `src/services/api.ts`، الوسيط 0؛ `StringLiteral` كما هو، و`TemplateExpression` بضم المقاطع واستبدال كل `${…}` بـ`*` (بيتعامل صح مع `` `/api/market/alerts/${encodeURIComponent(id)}/acknowledge` ``)؛ الميثود من خاصية `method:` بافتراضي `GET`.
**التأكيدات:** كل مسار عميل لازم يبقى موجود على السيرفر — **ده بيفشل النهاردة** على `checkTransferAvailability` → `/api/inventory/transfers/check`، وده إثبات إن الأداة شغّالة؛ يبقى أخضر بعد حذفها في §2 · مطابقة **الميثود** كمان، مش المسار بس (`POST /commerce/availability` مقابل `GET /inventory/:serviceType` هو اللبس اللي وراه الباگ) · مسارات السيرفر بدون مستدعي = **تحذير لا يفشّل** (ده مُدخل §2؛ تفشيله يمنع بناء endpoint قبل واجهته).
**حد معروف يتكتب في doc comment:** المسارات المبنية بالتجميع بره `api.ts` مش مرئية — اتنين موجودين (`cmsFetch` في `CmsContentDashboard`). ضيف تأكيد تاني رخيص: **ممنوع `fetch('/api/…')` بره `src/services/`** — يلاقيهم أو يمنع الجداد.

**(ب) طبقة اختبار الفرونت — بالترتيب ده:**
1. **الأول: ترقية سكربتات Playwright لسويت حقيقي.** ده أعلى قيمة لكل ساعة، وهو اللي §3 و§5 محتاجينه عشان يبقوا **قابلين للتحقق أصلاً**. `playwright.config.ts` في الجذر بـ`webServer` بيشغّل `npm run dev`، `projects: [{name:'en'},{name:'ar'}]`، `testDir: 'tests/e2e'`. انقل 3–4 من الـ19 `.mjs` (`home-page-qa`, `hotels-qa`, `command-center-qa` + `my-trip` جديد) لـ`tests/e2e/*.spec.ts`. ضيف `"test:e2e": "playwright test"` و**سيب `npm test` vitest بس** عشان السويت السريع يفضل سريع. ده بيدي §3 مقارنة الرندر و§5 لقطة النص ببلاش، وبيتقاعد 19 ملف منحرف.
2. **بعدين طبقة jsdom رفيعة — للـhooks بس، مش للصفحات.** §3 و§4 بينتجوا الأهداف الصح (`summariseBudget`, `spontaneousMapper`) وهي **دوال نقية مش محتاجة DOM خالص** ← تتكتب في سويت الـnode الموجودة، **من غير أي stack جديد**. اللي محتاج DOM فعلاً هو `useApiResource` (إلغاء عند unmount، إبقاء الـdata عند الخطأ، `requiresSignIn` — تلات سلوكيات بيدّعيها تعليقها ومفيش حاجة بتتحقق منها) و`t()` الجديدة. ← `@testing-library/react` + `jsdom` كـ**مشروع vitest تاني** (`vitest.workspace.ts`) بـ`environment: 'jsdom'`، `include: ['tests/ui/**/*.test.tsx']`، و**من غير `tests/setup.ts`** (تبديل الـadapter وفخاخ fs بلا معنى وبطيئة في بيئة متصفح). ~4 ملفات: `useApiResource`, `useArrivalClock`, `LanguageContext`, `tripBudget`-في-كومبوننت.
3. **ماتعملش** اختبارات jsdom للشاشات الكبيرة ولا JSX snapshots — `MyTripView` 1300 سطر Tailwind، واختبار jsdom له بيأكّد على نصوص كلاسات؛ ومع §3 بينقل markup و§5 بينقل 2242 نص، الـsnapshots هتبقى churn خالص.

---

## ترتيب التنفيذ

القيد الحاكم: **§5 بيلمس 88 من ~200 ملف حي** — منهم `FirstTwoHoursView` (153) و`FoodNowView` (151) و`WhatShouldIDoNowView` (108) و`MyTripView`، وهم بالظبط الملفات اللي §3 و§4 بيعيدوا كتابتها. أي تداخل = تصادم غير قابل للدمج بعلامات conflict جوه نصوص عربية.
القيد التاني: 5 دوال في `api.ts` مابتثبتش موتها غير بعد حذف الكومبوننتس، و§4 بيحيي 4 دوال §2 كان هيحذفها.

**Phase 0 — شبكة الأمان (يمنع كل اللي بعده)**
§7a — ترقية سويت Playwright + `playwright.config.ts`. مفيش حاجة في الخطة دي قابلة للتحقق من غيره. نص يوم.

**Phase 1 — مستقلة، بدون تصادم، تنزل فوراً**
- §1 إصلاح رفع الـCMS (الأمان الوحيد هنا؛ الـCSP العام مؤجّل لتذكرته).
- §6a استخراج `humanizeAuthError` — **لازم قبل §5** لأنه بيشيل الملف الوحيد اللي الكودمود مايقدرش يتعامل معاه.
- §7b(i) اختبار العقد — بيفشل النهاردة، وده المقصود؛ ينزل مع حذف `checkTransferAvailability`.

**Phase 2 — الكود الميت، بترتيب داخلي صارم**
§2 بأربع كوميتات (فوق). **بيسيب الـ14 بتوع `mytrip/` لـ§3** لأنه محتاج يقراهم عشان ينقل المنطق. ناتج السكريبت = checklist §3.
كنس دوال `api.ts` **مؤجّل لـPhase 4** عمداً.

**Phase 3 — إعادتا الكتابة الكبيرتان، بالتوازي (ملفات منفصلة)**
§3 (`src/components/mytrip/*`) و§4 (`spontaneous/`, `arrival/`, `food/`, `services/`, `shared/types/`) مجموعتا ملفات منفصلتان تماماً ← ممكن يتعملوا بالتوازي. الاتنين بينتهوا بمقارنة رندر Playwright.
**الارتباط الوحيد:** prop الـ`availableMinutes` بيتمرّر من `MyTripView` اللي §3 بيعيد هيكلته ← اتفقوا على اسم الـprop ومصدره (`nextUpActivity`) من الأول، سطر واحد في `MyTripSubFlows.tsx`.

**Phase 4 — تنضيف معتمد على 2+3+4**
- §2ب كنس `api.ts`: 28 + 5 (بعد الحذف) − 4 (§4 أحياها) − 2 (خارج النطاق: `processOpsRefund`, `reconcileLedger`) = **27 قابلة للحذف**، ومعاهم `checkTransferAvailability` ← §7 يبقى أخضر.
- §6ب/ج/هـ الخطوط + `index.html` + حقن الميتا + `placeholderImagery.ts`.

**Phase 5 — الكودمود، آخر حاجة، لوحده، بتجميد للكود**
§5 لما مايكونش فيه أي حاجة تانية طايرة على `src/components/`. دفعة 0 الأول (تغيير API عام لـ`LanguageContext`، يستاهل مراجعته الخاصة)، ثم 1–5 بمجلد لكل PR وكل واحدة مبوّبة بـ`verify.ts` + لقطة نص Playwright، ثم دفعة 6 يدوي. الاستبعادات غير قابلة للتفاوض.
§7b(ii) مشروع jsdom الرفيع — محتاج توقيع `t()` الجديد فبيتعمل هنا.

**Phase 6 — متابعات، خارج الخطة دي**
مرور CSP كامل · SSR/prerender حقيقي · الـ476 حالة `obj.fieldAr : obj.field` · تفكيك `MarketIntelligenceView` (2668 سطر / 147KB).

---

## التحقق النهائي

بعد كل كوميت: `npm run lint` (`tsc --noEmit`) · `npm test` (لازم يفضل 478+ ناجح) · `npm run build`.
بوابات إضافية: `npx playwright test` أخضر على `master` **قبل** ما أي workstream يبدأ (شرط مسبق لـ§3 و§5) · اختبار العقد بيتحوّل من أحمر لأخضر بعد Phase 4 · مقارنة الـHTML المنقّى لـ`/my-trip` (3 تابات × لغتين) متطابقة ما عدا أرقام الميزانية · `verify.ts` بيثبت إن 2242×2 نص ماتغيّروش · `du -k dist/assets/*.js` مسجّل قبل/بعد Phase 2 و§6.

## حاجات قررنا ماتتعملش (وليه)
1. **CSP عام مع إصلاح الـCMS** — الـCSP المقيّد بالمسار بيقفل الثغرة؛ العام محتاج دومينات فايربيز وGoogle Fonts وUnsplash وسياستين dev/prod، ومفيش اختبار يثبت إن الدخول نجا.
2. **رفع `express.json()` العام لـ15MB** — بيحوّل سقف 100KB لسقف 15MB على 224 مسار عشان مسار واحد.
3. **الثقة في أي قايمة كود ميت من resolver يدوي** — بما فيها اللي في التقرير المنشور.
4. **جذر reachability واحد (`main.tsx`)** — كان هيحذف 3 ملفات حية بيستوردها السيرفر والاختبارات.
5. **الـpredicate كما هو في التقرير** — كان هيحوّل 1099 ternary بتاع CSS/اتجاه لمفاتيح ترجمة.
6. **توصيل `post-activity-food` بـ`FoodNowView`** — بيانات أقل من الكوربوس المدموج أصلاً، مكسب معلوماتي سالب.
7. **تغذية `TimelineStep[]` من `fit-window`** — عدم تطابق شكل؛ الدرز الحقيقي كارت `early_done`.
8. **إبقاء `/api/context/daily-briefing`** — مابينداش موديل، بيتجاهل مدخلاته، ومكرر لفيتشر شغّال.
9. **نقل `TripStyleSummary.durationLabel()`** — بيحرق `'en-GB'`؛ `formatTripDateRange` أفضل منه.
10. **تنزيل واستضافة الـ150 صورة Unsplash** — الترخيص قرار إنسان، والحل الحقيقي خط ميديا الـCMS.
11. **SSR/prerender حقيقي دلوقتي** — حقن `<meta>` من السيرفر بيدي 80% في 40 سطر وصفر مخاطرة.
12. **اختبارات jsdom للشاشات الكبيرة أو JSX snapshots** — churn خالص مع §3 و§5.
13. **تشغيل §5 بالتوازي مع §3 أو §4** — أعلى 4 ملفات في الكودمود هم بالظبط الـ4 اللي بيتعاد كتابتهم.
