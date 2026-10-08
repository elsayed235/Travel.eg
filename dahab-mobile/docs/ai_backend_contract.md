# AI gateway: backend contract

The app never calls an LLM directly. It calls these endpoints on our backend,
which owns the model key, prompts, rate limits and caching. Until they exist the
app runs on `FakeAiRepository`. Build with `--dart-define=AI_REMOTE=true` to
switch to `ImplAiRepository` (`lib/features/ai/data/repositories/`).

**Model:** Claude Haiku 4.5 (`claude-haiku-4-5`, $1 / $5 per 1M input/output tokens)
for every LLM route. Move a route to Sonnet 5 only if measured quality falls short.

## Shared rules

- Per-user limit: 20 AI calls a day. Over the limit, return `429`; the app shows the error message.
- Cache responses keyed on the normalized input text (and the photo hash).
- Put the fixed system prompt and the category list first so prompt caching applies.
- Log `usage` from every model response so we can check the cost estimate after month one.
- Every response is plain JSON (no envelope). The app parses it exactly as shown below.
- The app shows a global error message for any 4xx or 5xx response. For the background endpoints (price guidance, smart replies, review summary), return `200` with empty values instead of an error when there is no data or the user hit the rate limit. Price guidance makes no LLM call, so it needs no rate limit.

## `POST ai/structure-request`: smart request composer (feature 01)

Multipart body:

| field | type | notes |
|---|---|---|
| `text` | string | What the user typed or dictated (Egyptian Arabic). |
| `category_ids` | string[] | Only these ids may be returned. |
| `photo` | file, optional | Request photo. Send it to the model as an image block. |

Response (use structured outputs with this schema so the JSON always parses):

```json
{
  "title": "لابتوب خفيف للشغل",
  "category_id": "electronics",
  "quantity": 1,
  "quantity_unit": "قطعة",
  "need_by": "2026-10-01",
  "specs": ["رام 16 جيجا على الأقل", "خفيف الوزن"],
  "confidence": 0.92
}
```

- Every field except `specs` and `confidence` may be `null`. Return `null` rather than guess.
- `need_by`: resolve relative dates ("بكرة", "الخميس") against the server date in Africa/Cairo.
- `confidence` is 0 to 1. Below 0.6 the app asks the user to check the fields carefully.
- Store the structured result with the request. Notification targeting uses it (see below).
- Target cost: about $0.004 per call.

## `POST ai/parse-search`: smart search (Explore)

Body: `{ "text": "حد محتاج كراسي لفرح؟", "category_ids": ["furniture", "…"] }`

Turns a free-text or dictated search into a category and up to 4 keywords.
The app ranks nearby requests by keyword hits inside that category.

```json
{ "category_id": "furniture", "keywords": ["كراسي", "فرح"] }
```

- Strip filler words ("محتاج", "حد", "قريب مني") and prefixes ("لفرح" → "فرح").
- Cache aggressively. Searches repeat a lot, so most calls should never reach the model.
- Short queries (one word) never hit this endpoint; the app filters them locally.
- Target cost: about $0.001 per call (short input, tiny output).

## `GET ai/price-guidance?item=…&category_id=…`: price range (feature 04)

No LLM. Take the 25th to 75th percentile of accepted offer prices for the same
category within the requester's radius over the last 90 days.

```json
{ "min": 150, "max": 250, "sample_size": 34 }
```

When fewer than 5 accepted offers match, return `{ "min": 0, "max": 0, "sample_size": 0 }`. The app then hides the hint.

## `POST ai/suggest-replies`: smart replies (feature 06)

Body: `{ "conversation_id": "…", "role": "requester" | "owner" }`

The server loads the last 6 messages itself. Never trust message text sent by
the client. Return up to 3 short replies in Egyptian Arabic, each under 40 characters:

```json
["متاح وأقدر أسلّمه بكرة", "السعر شامل التوصيل", "تحب تستلم بنفسك؟"]
```

Only call the model when the last message is from the peer; otherwise return `[]`.

## `GET ai/review-summary/{userId}`: review summaries (feature 08)

Generated nightly with the Message Batches API (50% cheaper) for users with
new reviews, then served from the database.

```json
{
  "summary": "الناس بتقول إنه ملتزم بالمواعيد…",
  "highlights": ["ملتزم بالمواعيد", "الحالة زي الوصف"],
  "based_on_count": 18
}
```

For users with fewer than 3 reviews, return `{ "summary": "", "highlights": [], "based_on_count": 0 }`. The app hides the card.

## Server-only features (no app changes needed)

- **Targeted notifications (feature 03).** When a request is published, notify only
  owners in the radius whose listings or past offers match the request's
  `category_id` and title keywords, instead of every owner in range. Phase 3 adds
  similarity search over listing titles.
- **Safety filter (feature 07).** The app already warns on-device using the rules
  in `lib/features/ai/domain/services/chat_safety_rules.dart`. The server runs the same
  rules on every message and sends only flagged messages to Haiku to confirm.
  Confirmed messages go to the moderation queue.

## Analytics events the app sends

`ai_home_try` (mode: voice or example), `ai_smart_search` (has_category), `ai_voice_search`,
`ai_request_structured` (confidence), `ai_request_undone`, `ai_voice_request`,
`request_submitted` (ai_used), `ai_best_offer_opened`, `ai_price_suggestion_used`,
`ai_reply_used`, `ai_safety_outgoing_warning` (flag), `ai_safety_peer_warning` (flag).
