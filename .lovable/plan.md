## Talkie IELTS — Full Platform Upgrade

This is a large, multi-phase change. I'll keep the lavender aesthetic, mascot, and existing speaking flow intact while rebranding and adding Listening / Reading / Writing / Mock Test / Personalized AI / per-user History.

### 1. Rebrand: MeowTalk Practice → Talkie IELTS
- `index.html`: title, meta, apple-mobile-web-app-title, OG tags
- `vite.config.ts` PWA manifest (name, short_name, theme)
- Headers in `Index.tsx`, `ModeSelectPage.tsx` (which becomes the IELTS hub or is removed), `HistoryPage.tsx`, `FullTestPage.tsx`
- `ShareResultCard.tsx` text "MeowTalk Practice predicted…" → "Talkie IELTS predicted…"
- Loading screens / toasts referencing the old name

### 2. Remove English Growth
- Delete `src/pages/GrowthPracticePage.tsx`, `src/pages/ModeSelectPage.tsx` (mode chooser no longer needed — `/` goes straight to IELTS home)
- Delete `supabase/functions/evaluate-growth/`
- Update `App.tsx` routes (remove `/growth`, make `/` = `Index`)
- Remove any "Growth" buttons/links

### 3. Homepage additions (keep current layout)
- Stronger lavender **Streak** pill + small "📈 Weekly Progress" mini-stat near streak
- New bottom section **"Why Talkie IELTS?"** — 8 minimal feature cards (Real IELTS simulation, AI feedback, Personalized study plans, Mock exams, Writing correction, Vocabulary improvement, Pronunciation feedback, Progress tracking)
- New top-level section linking to the four skills + Full Mock Test

### 4. New skill modules
Each as its own route under `/practice-listening`, `/practice-reading`, `/practice-writing`, plus existing `/practice/:part` for Speaking, and `/mock-test` for the full simulation.

**Listening** (`ListeningPage.tsx`)
- 4 sections, embedded `<audio>` with public-domain IELTS-style tracks (use placeholder MP3 URLs from archive.org / open IELTS resources; if none load, allow user-supplied URL)
- Question fields per section, timer, submit → score + band estimate
- AI explanation of mistakes via new edge function `evaluate-listening`

**Reading** (`ReadingPage.tsx`)
- Bundled IELTS-style passages in `src/data/readingPassages.ts` (public-domain text rewritten in IELTS style)
- Task types: T/F/NG, matching headings, sentence completion, MCQ
- Score, band, AI explanations via `evaluate-reading` edge function

**Writing** (`WritingPage.tsx`)
- Task 1 + Task 2 prompts in `src/data/writingPrompts.ts`
- Textarea with word counter, timer
- `evaluate-writing` edge function returns: TR/CC/LR/GRA bands, overall band, improved sample, grammar-corrected version, vocab upgrades

**Speaking** — keep current system. Small stability tweaks in `useVoiceRecorder.ts` (already solid).

### 5. Full Mock Test (`MockTestPage.tsx`)
- Sequential flow Listening → Reading → Writing → Speaking
- Final AI report: overall band, per-section bands, strengths, weaknesses, recommendations via `mock-test-report` edge function

### 6. Personalized AI study system
- New table `user_skills` (session_id, skill, score, weight, updated_at)
- Update each evaluate function to also upsert weak-skill signals
- Homepage shows "Recommended for you" card pointing to weakest skill
- New edge function `recommend-practice` that reads recent attempts and returns next suggested task

### 7. History per-user fix
- Add `session_id` column to `speaking_attempts` (and new `listening_attempts`, `reading_attempts`, `writing_attempts`, `mock_results` tables) defaulting to client-side persisted session id (same `useStreak` session id pattern)
- RLS policies filter by `session_id` header? Currently anonymous — easiest fix: filter queries client-side by `session_id` and tighten RLS to require it in WHERE
- `HistoryPage.tsx`: filter all queries by current `session_id`; show date, section, band, mistakes, trend sparkline

### 8. Tech notes
- All AI calls use Lovable AI Gateway via edge functions (model `google/gemini-3-flash-preview` default; `google/gemini-2.5-pro` for writing eval)
- Use tool-calling for structured JSON output
- Listening/Reading content shipped as TypeScript data files; audio loaded from public CDN URLs the user can swap

### Migrations
1. New tables: `listening_attempts`, `reading_attempts`, `writing_attempts`, `mock_results`, `user_skills`
2. Add `session_id text not null` to `speaking_attempts` (backfill nullable then enforce)
3. RLS: allow insert/select where `session_id = current_setting('request.headers')::json->>'x-session-id'` — actually simpler: keep anon access but require `session_id` filter; document that this is session-scoped, not authenticated

### Out of scope / honest caveats
- I won't add real licensed Cambridge IELTS audio. Listening audio will use public-domain English speech samples (e.g. LibriVox) framed as "IELTS-style" practice. Quality won't match official tests.
- Without auth, "per-user history" is per-browser-session (uuid in localStorage). True account isolation needs sign-in — I can add email auth in a follow-up if you want.
- Scope is large; I'll deliver in this single pass but some screens will be functional-minimal rather than richly designed.

### Files (created/edited, ~25)
Created: `ListeningPage.tsx`, `ReadingPage.tsx`, `WritingPage.tsx`, `MockTestPage.tsx`, `WhyTalkieSection.tsx`, `src/data/listeningTests.ts`, `src/data/readingPassages.ts`, `src/data/writingPrompts.ts`, edge functions `evaluate-listening`, `evaluate-reading`, `evaluate-writing`, `mock-test-report`, `recommend-practice`
Edited: `index.html`, `vite.config.ts`, `App.tsx`, `Index.tsx`, `HistoryPage.tsx`, `FullTestPage.tsx`, `ShareResultCard.tsx`, `useStreak.ts` (export sessionId helper)
Deleted: `GrowthPracticePage.tsx`, `ModeSelectPage.tsx`, `supabase/functions/evaluate-growth/`

Confirm and I'll execute.