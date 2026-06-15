# Exit Exam Preparation & Mastery Learning Platform

A blueprint-driven, performance-driven preparation platform for the **Ethiopian MoE
National Exit Examination — BSc Software Engineering & Computing Technology (BAND 1)**.

Everything is generated from two official sources — the **Test Blueprint** and the
**1,251-question bank** — with **no LLM / AI generation at runtime**. All classification,
difficulty calibration, and explanations are produced deterministically at seed time.

It answers three questions at any moment:

- **What am I weak at?** → mastery analytics & topic heatmap
- **Why am I weak at it?** → permanent mistake journal
- **What should I study next?** → study planner, targeted practice & note links

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Full-stack in one process; REST route handlers + React Server Components |
| UI | **Tailwind CSS + shadcn-style components + Recharts + lucide-react** | Matches the requested frontend stack |
| Backend | **Next.js Route Handlers (REST)** | All exam/mastery/spaced-repetition/analytics logic in server-side TS |
| ORM / DB | **Prisma + SQLite** | Zero external services for local/personal use; one-command setup. Portable to PostgreSQL (see below) |

> The brief allowed any stack ("use whatever tech stack you deem preferred"). SQLite +
> Next.js full-stack was chosen over a separate Spring Boot + Postgres deployment so the
> whole thing runs with a single `npm run dev` and no database server. The Prisma schema is
> Postgres-ready.

---

## Quick start

```bash
cd exit-exam-platform
npm install
npm run setup     # prisma db push + seed (blueprint + 1251 questions + 53 topic notes)
npm run dev       # http://localhost:3000
```

To re-seed from scratch at any time: `rm prisma/dev.db && npm run setup`.

### Switching to PostgreSQL
1. In `prisma/schema.prisma` set `datasource.provider = "postgresql"`.
2. Set `DATABASE_URL` in `.env` to your connection string.
3. `npm run setup`.

---

## Data pipeline (build-time, deterministic)

- `data/parse_qbank.py` — parses the `.docx` question bank into `data/questions.json`
  (1,251 questions, 100% answer + 4-option coverage).
- `data/blueprint.json` — the structured blueprint: 4 themes, 13 courses (with % weight,
  credit hours, expected items, general objective), and 53 learning-outcome **topics** with
  Bloom's-level item allocations.
- `lib/classifier.ts` — assigns each question a **topic**, **difficulty** (Easy → Very Hard,
  from complexity + concept count + the topic's Bloom profile), **question type**
  (MCQ / Scenario / Case Study / Problem Solving), and a synthesized **explanation**.
- `lib/notes-content.ts` — hand-authored study notes for all 53 topics.
- `prisma/seed.ts` — loads it all into the database.

---

## Features → where they live

| Requirement | Implementation |
|---|---|
| Blueprint analysis engine | `data/blueprint.json`, `/blueprint` page |
| Question bank processing & classification | `lib/classifier.ts`, `prisma/seed.ts` |
| Difficulty (success rate + complexity + concepts) | `lib/classifier.ts` (`baseDifficulty`) |
| Mastery at course/topic/difficulty/type levels | `lib/mastery.ts` |
| Permanent mistake journal + grouping + repeats | `lib/grading.ts`, `lib/analytics.ts`, `/mistakes` |
| Mistake → note deep linking ("Review Notes") | `noteHref` in grading/analytics |
| Smart practice (weakness / mistake / spaced) | `lib/exam-builder.ts` (priority ranking) |
| Spaced repetition (1→2→4→7→14d) | `lib/spaced-repetition.ts` |
| Exam modes (quick/topic/course/weakness/mistake) | `lib/exam-builder.ts`, `/practice` |
| Exit-exam simulation (blueprint-matched, timed) | `buildSimulation`, `/exam`, `/session/[id]` |
| Readiness prediction | `lib/mastery.ts` (`overall.readiness`) |
| Analytics (heatmap, progress, improvement) | `lib/analytics.ts`, `/analytics` |
| Study planner (weight + mastery + mistakes) | `lib/study-planner.ts`, `/plan` |
| Notes: search, bookmark, highlight, progress | `lib/notes.ts`, `/notes`, `/notes/[courseId]` |

### REST API
- `POST /api/sessions` — build a session (any mode) → returns questions (no answers)
- `POST /api/sessions/:id/submit` — grade, record attempts/mistakes/reviews → returns results
- `POST /api/plan` — regenerate the study plan
- `PATCH /api/notes/:noteId` — toggle complete / bookmark / set highlights

---

## How readiness is calculated

For each course: mastery is the difficulty-weighted correctness over your **latest** attempt
per question. Readiness blends each course's mastery by its **blueprint exam weight** and
**shrinks it by coverage confidence** (how much of that course you've actually practiced), so
you can't look "ready" without both performing well *and* covering the material. Pass
threshold = **70%**.

---

## Design & experience

A premium, focused SaaS feel (inspired by Linear / Vercel / Raycast), not a typical LMS:

- **Design system** — Geist typography, a neutral surface palette with an indigo accent,
  layered dark mode (never pure black), `shadow-soft`/`shadow-lift` elevation, and smooth
  theme transitions. Tokens live in `app/globals.css` + `tailwind.config.ts`.
- **Theming** — light / dark / system via `next-themes`, persisted, with a topbar toggle and
  a command-palette switch.
- **Command palette** — `⌘K` (`components/command-menu.tsx`, `cmdk`) for instant navigation
  and one-keystroke quiz launching.
- **Navigation** — slim sidebar on desktop, bottom tab bar on mobile; every section is 1 click away.
- **Motion** — Framer Motion page transitions, animated nav indicator, count-up readiness ring,
  hover lift on cards, and skeleton loading states (`app/loading.tsx`).
- **Onboarding** — a 5-step welcome flow (`/welcome`) → stream, exam year, import, study goal,
  then a **diagnostic assessment** that samples every course and produces a baseline-results
  screen (strengths, weak areas, recommended study order, predicted readiness) and the initial
  study plan. New users are gated into it until complete.
- **Question UX** — large readable stem, keyboard shortcuts (`A–D`/`1–4` select, `←/→` navigate,
  `F` flag, `Enter` next/submit), flag + "add to review list", timer, palette, and a rich graded
  review with explanations and note deep-links.
- **Mistake review** — "open notes", "retake similar", and "mark as understood" per item.
- **Accessibility** — focus-visible rings, keyboard-navigable command palette/quiz, reduced-motion
  support, and semantic, theme-aware components.
- **Settings** (`/settings`) — theme, stream, exam year, daily goal, target readiness, replay
  onboarding, and reset progress.

## Notes on integrity

- No runtime LLM calls anywhere. Explanations are templated from the verified correct answer
  + the linked learning outcome; the "why" is delivered through the authored notes.
- The question bank ships with no explanations; difficulty and topic tags are inferred
  deterministically and **recalibrate as you answer** (historical success rate feeds back in
  via the mastery layer).
