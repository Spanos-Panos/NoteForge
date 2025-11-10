## Noteforge Desktop App: Architecture and Feature Plan

Noteforge is a cross‑platform desktop app for creating and managing coding projects and learning notes, presented with a hand‑drawn notebook aesthetic. The product ships as a desktop executable, powered by a web stack (Next.js + TypeScript) wrapped in a desktop framework (Electron or Tauri) and backed by Supabase (PostgreSQL) for auth and data. The two core modules are Projects (project creation/tracking) and Notes (knowledge base + personal notes), with auxiliary features (music player, timers, gamified rewards, theming).

References and similar docs: `stronglytyped.uk`, `v1.tauri.app`, `supabase.com`, `zapier.com`, `academia.edu`, `storyly.io`.

---

### Vision and Goals

- Deliver a playful, “open‑notebook” experience to plan, learn, and build software.
- Help users get unstuck by pairing curated stack guidance with personal notes and project scaffolding.
- Provide pragmatic tools that fit daily developer workflows: project presets, “open in IDE”, timers, and ambient audio.

---

### Architecture & Technology Stack

- **Frontend**: Next.js + TypeScript. Supports SSR/SSG, API routes, and componentized UI. Styling via CSS Modules (current) or Tailwind; Tailwind can accelerate building the “hand‑drawn” theme.
- **Desktop shell**: Electron or Tauri.
  - Electron: Chromium + Node.js, mature ecosystem; easy Node APIs (e.g., spawn processes for “Open in IDE”). See `stronglytyped.uk`.
  - Tauri: Lightweight, secure, uses system WebView with Rust backend; great performance footprint. See `v1.tauri.app`.
- **Backend / Data**: Supabase (hosted PostgreSQL) for auth and data (projects, notes, tasks, progress, rewards). JavaScript SDK works in desktop apps; supports PostgREST/RPC for complex queries (`supabase.com`, `stackoverflow.com`).
- **Auth**: Supabase Auth (email/password, OAuth providers).
- **Assets & Content**: Static markdown/JSON for built‑in topics and templates; user content persisted in Postgres.
- **Dev Tools & CI/CD**: VS Code, GitHub. Packaging and releases via `electron-builder` (Electron) or `tauri build` (Tauri). Auto‑updates can come later.

---

### Packaging Options

- **Electron + Next.js**
  - Pros: Rich Node APIs; excellent community; straightforward “Open in IDE” and filesystem ops.
  - Cons: Larger bundle size and memory footprint.
  - Implementation: Run Next in production build within Electron (or use a template like Nextron, `stronglytyped.uk`).
- **Tauri + Next.js**
  - Pros: Very small, secure; native installer experience; low memory usage.
  - Cons: Rust plugin work for OS integration; Node APIs via commands/bridge.
  - Implementation: Export Next static build and serve via Tauri WebView; leverage Rust `tauri::command` for OS/IDE actions (`v1.tauri.app`).

Recommendation for MVP: start with Electron for fastest “IDE launch / filesystem” features; evaluate Tauri after MVP.

---

### Data Model (initial)

- **users**: id, email, display_name, avatar_url, theme_pref, points, created_at
- **projects**: id, user_id, name, description, cover_image, project_stack (JSON), repo_url, local_path, created_at, updated_at
- **project_tasks**: id, project_id, title, status, due_date, order_index
- **notes_topics**: id, slug, title, category, content_markdown, level, tags[], created_at
- **user_notes**: id, user_id, topic_id (nullable), project_id (nullable), title, content_richtext (JSON/MD), created_at, updated_at
- **timers**: id, user_id, project_id (nullable), kind (pomodoro/custom), work_ms, break_ms, completed_cycles, created_at
- **rewards**: id, user_id, points_delta, reason, created_at
- **achievements**: id, code, title, description, points_reward
- **user_achievements**: id, user_id, achievement_id, earned_at

Notes:
- Use JSON columns for flexible `project_stack`, e.g. `{ frontend: "React+TS", backend: "Next.js", db: "PostgreSQL" }`.
- Add indexes on `user_id`, `project_id`, and `topic_id`.

---

### Core Module: Projects (Creation & Management)

- **Project creation UI**
  - Name, description, cover image (preset gallery).
  - Stack selectors by category: Frontend, Backend, Database, Auth, Dev Tools; freeform notes field per category.
  - Optional: link Git repo, choose local folder, pick IDE.
- **Project list/grid**
  - Thumbnails, quick actions: open, edit, delete.
  - Filter/sort by date, name, or tag.
- **Project “Open Book” view**
  - Left page: project summary (name, description, chosen stack, short explanations and tips).
  - Right page: editable notes area with autosave to DB.
  - Task checklist with progress bar.
- **Persistence & sync**
  - Autosave project notes, tasks; optimistic UI; optional Supabase Realtime listeners.
- **“Open in IDE”**
  - Electron: use Node `child_process.spawn` to open VS Code/IntelliJ with `local_path`.
  - Tauri: use `tauri::command` to invoke OS process with path (`v1.tauri.app`).

Example stack snippet:
- Frontend: TypeScript + React + TailwindCSS — fast UI iteration; utility classes speed styling.
- Backend: Next.js API routes — good for small app services and local utilities.
- DB: PostgreSQL via Supabase — hosted, scalable, simple JS SDK.

---

### Core Module: Notes (Knowledge Base & Personal Notes)

- **Structure**
  - Curated topics: languages, frameworks, general dev concepts, and “Full Stacks” recipes.
  - Personal notebooks: user‑authored pages, optionally linked to a topic or project.
- **Content management**
  - Pre‑made content stored as Markdown/HTML/JSON; rendered in app.
  - Topic fields: title, description, steps, images, code samples, requirements, tips.
- **Editors**
  - Rich‑text or Markdown editor (e.g., TipTap/React‑Quill).
  - Supports images and code blocks; autosave to Supabase.
  - Offline drafts via IndexedDB/localStorage with reconciliation on reconnect.
- **Navigation**
  - Left table of contents with hierarchical pages (e.g., C → Pages 1–6).
  - Search and filters (by tag, difficulty).
- **Tech Stack Templates**
  - Clickable “recipes” (e.g., React+TS+Tailwind Web App) that prefill steps, commands, and recommended libraries.

Inspiration: free‑form pages like OneNote/Notion (`zapier.com`).

---

### Additional Features

- **Audio Player (Ambient Music)**
  - Simple footer player using HTML5 Audio or a React audio component.
  - Controls: play/pause, next/prev, volume; rotating album icon; local files or streams.
  - Rationale: focus benefits of preferred background music (`academia.edu`).
- **Timers / Progress Tracking**
  - Pomodoro timer with customizable intervals and per‑project association.
  - Log cycles, show streaks, and update project progress.
  - Research‑backed engagement with timers (`zapier.com`).
- **Gamification**
  - Points for completed tasks/timers; badges for milestones.
  - Cosmetic unlocks (themes, avatars) purchasable with points.
  - Engagement patterns documented in `storyly.io`.
- **Theming & Customization**
  - Global dark/light mode; per‑project accent colors.
  - Settings for font size and layout; store preferences per user.

---

### UI/UX and Hand‑Drawn Aesthetic

- **Visual language**
  - Paper or chalkboard textures; hand‑drawn iconography; fonts like Architect’s Daughter or Caveat.
  - Elements with sketch‑like borders, faux torn edges, index tabs.
- **Layout**
  - “Open book” two‑page view for Projects; responsive columns; good scroll behavior.
  - Prominent top‑right settings “gear”; profile avatar top‑left; central nav with “Projects / Notes”.
- **Accessibility**
  - Sufficient contrast in dark/light modes; readable fonts; resizable text.
  - Keyboard navigation support; ARIA labels on custom components.

---

### MVP Scope (Phase 1)

- Supabase Auth (email/password), profile page.
- Projects: CRUD, stack selection (basic), cover presets, “open book” view with right‑side notes and task checklist.
- Notes: browse curated topics, search, read; create personal notes with autosave.
- Theming: dark/light toggle saved per user.
- “Open in IDE” (VS Code) for a selected local path (Electron route for MVP).
- Packaging: desktop installer for Windows; manual builds for macOS/Linux.

Out of scope for MVP: audio player, gamification, advanced templates, offline sync beyond basic drafts.

---

### Roadmap (after MVP)

- Phase 2: Audio player; Pomodoro timers; basic points and badges; project templates (recipes).
- Phase 3: Advanced stack questionnaire; Supabase Realtime sync; collaborative sharing (read‑only).
- Phase 4: Tauri build evaluation/migration; offline‑first with local cache; auto‑updates.
- Phase 5: AI helpers for content drafting and stack recommendations; rewards store for cosmetics.

---

### Example User Journeys

- **Create a new project**
  1) New Project → enter name/description → pick cover and basic stack.
  2) Save → lands in “open book” with stack summary left, personal notes right.
  3) Add initial tasks; click “Open in IDE” to launch VS Code at `local_path`.
- **Study a topic and take notes**
  1) Browse Notes → select “C → Memory Management”.
  2) Read steps and examples; open personal note pane; jot insights and code.
  3) Notes autosave; later, link note to an active project task.
- **Focus session**
  1) Start Pomodoro tied to a project task.
  2) On completion, award points; increment progress; suggest a short break track.

---

### APIs, Security, and Permissions

- Use Supabase Row Level Security (RLS) policies to restrict rows by `auth.uid()`.
- Store minimal secrets in the client; prefer Supabase edge functions for privileged logic if needed.
- For filesystem/IDE actions:
  - Electron: restrict IPC; validate inputs; whitelist allowed commands.
  - Tauri: use scoped filesystem and commands; define explicit `allowlist` (`v1.tauri.app`).

---

### Styles and Implementation Notes

- Tailwind utilities can rapidly prototype “sketch” borders, shadows, and textures. Alternatively, keep CSS Modules and compose with variables for themes.
- Provide CSS variables for theme tokens (colors, font sizes, spacing) and per‑project accents.
- Use a small icon set with consistent stroke weights; avoid visual noise; keep controls discoverable.

---

### Tech Stack Categories and Recommendations (Curated Library)

- **Structured categories**: General, Game Dev, Web App, Machine Learning, Mobile, DevOps.
- **Filters**: popularity, difficulty, date added, tags.
- **Selection modes**:
  - AI questionnaire suggests stacks based on goals.
  - Category browsing reveals subtopics (e.g., “Web App” → Frontend/Backend).
- **Per‑stack content**:
  - Project guide (step‑by‑step).
  - Benefits and tradeoffs.
  - Frameworks & libraries with short descriptions.
  - Example projects and use‑cases.

---

### Learning Resources and Content Structure (Curated + Personal)

- **Learning categories**
  - Design Styles (grids, color theory, neumorphism, glassmorphism, 8px system).
  - Programming Languages (C, C++, C#, Java, Python, etc.).
  - Libraries & Frameworks (React, Django, TensorFlow, etc.).
  - General Development (version control, debugging, testing, deployment, best practices).
- **Depth model**
  - Example for C:
    - Page 1: Overview.
    - Page 2: Syntax and Data Types.
    - Page 3: Control Structures.
    - Page 4: Functions and Methods.
    - Page 5: Memory Management.
    - Page 6: Advanced Topics.
- **Navigation**
  - Left TOC with nested pages (e.g., “Page 4.1: General Syntax”, “Page 4.2: Implementation Examples”).

---

### Feasibility & Work Plan

- The Next.js + Supabase stack is proven (`supabase.com`, `stronglytyped.uk`).
- Packaging via Electron/Tauri is well‑documented (`stronglytyped.uk`, `v1.tauri.app`).
- Main effort: schema design, desktop bridging, and polished UI/UX.
- Suggested milestones:
  1) Auth + basic shell and theming.
  2) Projects CRUD + “open book” view + IDE launch.
  3) Notes reader + personal notes editor + autosave.
  4) Packaging for Windows; smoke test on macOS/Linux.
  5) Timers, audio, gamification; iterate on content and templates.

---

### Project Motivation

This idea comes from the frustration of scattered resources and “tutorial hell.” By combining structured knowledge (languages, frameworks, styles) with practical project setup (repositories, IDEs, folders), users can move from learning to building without friction. A single, playful hub reduces cognitive load and increases momentum.

---

### Appendix: Implementation Details (Quick Ref)

- “Open in IDE”
  - Electron: `spawn('code', ['-n', localPath])` or platform‑specific commands; validate paths.
  - Tauri: define command to launch IDE via system APIs; prompt user to set IDE path.
- Offline drafts
  - Save editor state to IndexedDB; on reconnect, upsert to Supabase with conflict resolution.
- Autosave pattern
  - Debounce input; save every N seconds or on blur; show subtle “saved” indicator.
- Realtime updates
  - Optional: subscribe to project/task channels for multi‑window coherence.
- Testing
  - Unit tests for data transforms; smoke tests for editors and project flows; manual E2E for packaging.

---

With this plan, Noteforge is technically sound and scoped for incremental delivery. Build the MVP, validate the “open notebook” experience, then layer in timers, audio, and gamification to deepen engagement.