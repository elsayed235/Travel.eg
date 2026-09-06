# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mixed traveler types visiting Dahab, Egypt: adventure seekers (diving, safaris), families, solo backpackers, and luxury travelers. All share the job of planning, experiencing, and reflecting on a Dahab trip. Secondary users: local service suppliers (dive shops, safari operators, hotels, transfer drivers) and an internal operations team managing the platform.

## Product Purpose

Dahab is a comprehensive travel companion platform that transforms how travelers experience Dahab, Sinai. It replaces fragmented booking, guidebook, and planning tools with a single lifecycle-aware companion that adapts from initial inspiration through post-trip reflection. Success means every traveler — regardless budget, travel style, or trip phase — feels the platform understands their moment and delivers exactly what they need next.

## Positioning

A lifecycle-aware travel companion that adapts its intelligence to where you are in your journey — not a static booking engine or generic travel guide. The platform's mechanism is the traveler lifecycle: it detects your phase (dreaming, planning, arriving, exploring, departing, remembering) and recomposes the entire interface around that moment. No competitor ships a single surface that is simultaneously a booking platform, real-time trip companion, AI concierge, and post-trip memory keeper.

## Operating Context

- Bilingual (English/Arabic) with RTL support; Egyptian and international travelers
- Mobile-first web app served via Express + Vite
- Firebase authentication (Google federated sign-in)
- Paymob payment processing for Egyptian market
- Offline-capable with service worker considerations
- Data persistence via SQLite (default), with JSON fallback
- Gemini AI integration for trip generation, AI concierge (DayGi), and contextual recommendations
- The platform operates in a real tourism ecosystem with live supplier data, pricing, and availability

## Capabilities and Constraints

- Multi-step booking engine (diving, safari, hotel, transfers, food)
- AI trip generation and DayGi AI concierge
- Real-time contextual recommendations by time-of-day and location
- 12-stage journey companion (pre-booking through post-trip)
- Spatial map with nearby services
- Curated stories and gallery
- Operations console and supplier portal
- CMS-driven content management
- Must preserve: lifecycle composition logic, i18n system, theme engine (6 themes), token system, all existing API routes and backend functionality
- Must not regress: security model (session-based identity, deny-by-default API access), data persistence, payment flow integrity

## Brand Commitments

- Name: "Dahab" (the destination IS the brand)
- Voice: warm, knowledgeable, slightly adventurous — not corporate, not precious
- Arabic bilingual is not optional — it is a core feature
- The platform must feel local and authentic to Dahab/Sinai, not generic travel

## Evidence on Hand

- Full working platform with 42+ component directories, 100+ API routes
- Design token system (colors, typography, motion, services, photography, microcopy) at `src/tokens/`
- 6-theme engine with CSS variable cascade at `src/index.css`
- Bilingual translation system at `src/i18n/translations.ts`
- Lifecycle-aware homepage composition at `src/services/homepageCompositionResolver.ts`
- Real seed data for destinations, activities, and local commerce

## Product Principles

1. **Lifecycle-aware**: The platform detects and adapts to where you are in your journey — never show a departing traveler a "book now" CTA
2. **Locally authentic**: Dahab knowledge, not generic travel content — the platform knows the tides, the best shisha at sunset, the dive spots locals love
3. **Bilingual-first**: Arabic is not a translation layer — it is a first-class design surface with proper RTL, typography, and cultural context
4. **Progressive depth**: Start simple (one tap to explore), reveal complexity on demand (full trip planning, budget tracking, AI concierge)
5. **Trust through transparency**: Show real pricing, real availability, real traveler reviews — no hidden fees, no bait-and-switch

## Accessibility & Inclusion

- Theme engine supports high contrast, reduced motion, and large text modes
- RTL layout for Arabic with proper bidirectional text handling
- Must maintain keyboard navigation and screen reader support
