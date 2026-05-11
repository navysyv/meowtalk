## Scope

This is a large multi-feature request (8 sections, ~25+ sub-requirements). To stay safe and stable per your "do not redesign / preserve UI" constraints, I want to align before touching code.

## Proposed phased delivery

I'd ship this in 3 incremental phases so each one stays stable and you can validate between them. **Each phase = one approval.**

### Phase 1 — Mock flow + content expansion (frontend only, no backend changes)

- **Full Mock flow auto-sequence**: rewrite `MockTestPage` so the user clicks Start once, then the app auto-routes Listening → Reading → Writing → Speaking via a `?mock=<token>&step=N` query param. Each section page detects mock mode, hides "Try again", and auto-advances on submit. State persisted in `sessionStorage` (autosave).
- **Final mock summary**: new `MockSummaryPage` reading the 4 section bands from sessionStorage, computing overall IELTS band (avg, rounded to nearest .5), showing strengths/weaknesses + 3 personalized tips (static rule-based, no extra AI call needed).
- **Listening**: keep current 4 sections as "Test 1". Add **Test 2** and **Test 3** (4 sections × 10 Qs each = 40 per test). Adds matching/map-labeling question types alongside existing fill/mcq.
- **Reading**: keep current as "Test 1", add **Test 2** and **Test 3** (3 passages × ~13 Qs = 40 per test) with TFNG, matching headings, MCQ, sentence completion.
- **Writing**: add **Writing Test 2** with new Task 1 chart (line + table variant) and Task 2 prompts grouped by category (education / tech / environment / society / health).
- **Lazy loading**: convert section pages to `React.lazy()` in `App.tsx` so initial bundle stays small; test data files split per-test and dynamically `import()`-ed only when selected.

### Phase 2 — Account & data isolation

- Wire `useAuth` into all attempt inserts: when user is logged in, store `user_id` on rows; History page filters by `user_id` for logged-in users (and falls back to `session_id` for guests).
- Migration: add nullable `user_id uuid` to `speaking_attempts`, `writing_attempts`, `reading_attempts`, `listening_attempts`, `mock_results`, `daily_streaks`; tighten RLS so authed users only see their own rows, anon users see only their `session_id`.
- Auth persistence is already correct (`persistSession: true`); no change needed there.

### Phase 3 — Freemium

- Add `is_premium` boolean to `profiles` (default false, no payment wiring yet — just the flag and UI).
- Free limits: 2 full mock tests / week, basic feedback only.
- Premium UI: subtle badge in header, soft upgrade prompt card on History page, "Premium insight" blurred preview on feedback cards.
- Upgrade button just opens a "Coming soon" dialog for now (no Stripe/Paddle until you confirm — that's a separate flow with its own approval).

## Stability guardrails (applied across all phases)

- No service worker changes (current one-shot cleanup stays as-is).
- No new heavy deps. Charts stay as inline SVG (`Task1Chart`).
- All new pages use the existing lavender tokens, `TalkieCat`, `DecorativeBackground`. Zero visual redesign.
- Mock-mode state lives in `sessionStorage` only — no global store, no context churn.
- Test data dynamically imported to keep main bundle small.

## Questions before I start

1. **Phase 1 first, alone?** Or do you want me to attempt all 3 phases in one go? (Strongly recommend phase-by-phase for stability.)
2. **Freemium without payments now?** Phase 3 would just add the UI + flag. Real Stripe/Paddle checkout would come later as a separate request. OK?
3. **New listening audio**: I'll reuse the current public-domain Wikimedia clips for Tests 2 & 3 (different clips, new transcripts/questions). OK, or do you have specific audio sources?

Reply with answers (or just "go phase 1") and I'll start.

NO LAZY LOADING, everything should be stabilized and fast