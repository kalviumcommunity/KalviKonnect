# 🚀 KalviKonnect — Complete Build Prompts (RTCROS Format)
## All prompts to ship the full project to production standard
 
> **How to use:** Run each prompt in order. After every prompt, check the terminal for errors and fix before moving to the next. Each prompt ends with a terminal check instruction.
 
---
 
## PROMPT 1 — Project Health Check & Dependency Audit
 
**R — Role:**
You are a senior full-stack engineer doing a codebase audit before the final build sprint. You read every file, identify what is missing, what is broken, and what is inconsistent before writing a single line of new code.
 
**T — Task:**
Audit the entire KalviKonnect codebase — backend and frontend — and produce a complete health report. Fix every dependency mismatch, missing environment variable, broken import, or misconfigured file before any feature work begins.
 
**C — Context:**
KalviKonnect is a MERN stack project: React + Vite frontend, Node + Express + Prisma + PostgreSQL backend. The project has been built across multiple milestones. Some files may have incomplete implementations, broken imports, missing .env keys, or mismatched package versions. Before adding any new features, the foundation must be solid.
 
**R — Requirements:**
- Run `npm install` in both /backend and /frontend — fix any peer dependency warnings
- Verify all environment variables exist in .env.example: DATABASE_URL, JWT_SECRET, PORT, GEMINI_API_KEY, VITE_API_URL, VITE_APP_NAME
- Check every import in backend service files — confirm all referenced modules exist
- Run `npx prisma validate` — fix any schema errors
- Run `npx prisma db push` — confirm migrations apply cleanly
- Run the backend with `nodemon` — fix any startup errors
- Run the frontend with `vite` — fix any build errors
- Confirm the Prisma singleton in db.js is correctly structured
- Check server.js: CORS, compression, morgan, json middleware, error handler all present in correct order
- Check package.json scripts in both backend and frontend
 
**O — Output:**
- Fixed package.json (both backend and frontend)
- Fixed .env.example (both)
- Fixed any broken imports
- Backend starts cleanly on `npm run dev`
- Frontend starts cleanly on `npm run dev`
- `npx prisma studio` opens without error
 
**S — Scope/Constraints:**
- Do NOT add new features in this prompt — health check only
- Fix every console error before proceeding
- If DATABASE_URL is missing, use a placeholder and document clearly
 
**✅ Terminal Check:**
```bash
cd backend && npm run dev
# Expect: Server running on port 5000 — no errors
cd frontend && npm run dev
# Expect: Vite dev server on localhost:5173 — no errors
cd backend && npx prisma validate
# Expect: Schema is valid
```
 
---
 
## PROMPT 2 — Backend AI Provider: Gemini Integration
 
**R — Role:**
You are a senior backend engineer integrating Google Gemini as the AI provider for KalviKonnect. You write production-grade AI service code with error handling, fallback mechanisms, and token cost logging.
 
**T — Task:**
Replace any existing OpenRouter or placeholder AI implementation with a robust Google Gemini integration. Build the complete `aiService.js` that all AI features in Notes and Placements will use.
 
**C — Context:**
KalviKonnect uses AI in two modules: Notes (summary, key points, topic extraction) and Placements (experience structuring, prep checklist). All AI calls must go through a single `aiService.js` in the backend service layer. The Gemini API key is stored in `.env` as `GEMINI_API_KEY`. The frontend never calls any AI provider directly.
 
**R — Requirements:**
 
Install dependencies:
```bash
npm install @google/generative-ai
```
 
Build `backend/src/services/aiService.js`:
```js
const { GoogleGenerativeAI } = require("@google/generative-ai");
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
const generateResponse = async (prompt, systemMsg = "") => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemMsg
    });
 
    const result = await model.generateContent(prompt);
    const text   = result.response.text();
 
    // Token usage logging for cost visibility
    const usage  = result.response.usageMetadata;
    console.log(`[AI] tokens used — input: ${usage?.promptTokenCount}, output: ${usage?.candidatesTokenCount}`);
 
    return { success: true, text };
  } catch (err) {
    console.error("[AI] Gemini call failed:", err.message);
    // Fallback — never crash the main request
    return { success: false, fallback: true, error: err.message };
  }
};
 
module.exports = { generateResponse };
```
 
Build `backend/src/utils/promptBuilder.js`:
- `buildNoteSummaryPrompt(noteContent)` — returns prompt for 3-part JSON response
- `buildPlacementStructurePrompt(rawText, company, role)` — returns prompt for structured experience
- `buildPrepChecklistPrompt(company, role, rounds)` — returns prompt for checklist
 
Rate limiting for AI endpoints:
```bash
npm install express-rate-limit
```
```js
// Apply to all /ai routes in server.js
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 10,               // 10 AI requests per minute per IP
  message: { error: true, message: "Too many AI requests, please try again shortly", statusCode: 429 }
});
app.use("/api/notes/:id/ai", aiLimiter);
app.use("/api/placements/:id/ai", aiLimiter);
```
 
Add `GEMINI_API_KEY` validation to server startup:
```js
const required = ["DATABASE_URL", "JWT_SECRET", "GEMINI_API_KEY"];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
});
```
 
**O — Output:**
- `backend/src/services/aiService.js` — Gemini integration with fallback
- `backend/src/utils/promptBuilder.js` — all prompt builder functions
- Rate limiting applied to AI endpoints
- Server startup validation for GEMINI_API_KEY
- `.env.example` updated with `GEMINI_API_KEY=your_key_here`
 
**S — Scope/Constraints:**
- GEMINI_API_KEY never in any frontend file
- All AI calls async with try/catch — a failing AI call never crashes the main endpoint
- `{ success: false, fallback: true }` returned on failure — frontend shows a graceful message
- Use `gemini-1.5-flash` model — faster and cheaper than pro for student platform scale
 
**✅ Terminal Check:**
```bash
cd backend && node -e "require('./src/services/aiService').generateResponse('test').then(console.log)"
# Expect: { success: true, text: '...' }
```
 
---
 
## PROMPT 3 — Note Intelligence: Summary, Key Points & Topic Extraction
 
**R — Role:**
You are an AI integration specialist building the complete Notes AI module for KalviKonnect. You design structured prompts that return reliable JSON, handle partial failures gracefully, and display AI insights cleanly in the UI.
 
**T — Task:**
Build all three Note AI features end to end: Concise Summary, Key Takeaways (bullet points), and Exam Topic Extraction. This covers the backend endpoint, service logic, Prisma schema if needed, and the frontend display component.
 
**C — Context:**
Students share academic notes on KalviKonnect. Many notes are dense lecture content. AI analysis transforms a wall of text into immediately actionable study material. The feature is triggered on demand from the Note detail page — not automatically on create. AI responses are cached on the Note model to avoid repeat API costs.
 
**R — Requirements:**
 
Prisma schema addition:
```prisma
model Note {
  aiSummary   String?  // cached AI summary
  aiKeyPoints String?  // cached JSON array of key points
  aiTopics    String?  // cached JSON array of topics/questions
  aiAnalyzedAt DateTime? // when AI was last run
}
```
 
Prompt in `promptBuilder.js`:
```js
exports.buildNoteAnalysisPrompt = (title, content) => ({
  system: `You are an expert academic tutor. Analyze the following study note and return ONLY valid JSON with no markdown, no code fences. Return exactly this shape:
{
  "summary": "2-3 sentence concise summary",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "examTopics": ["likely exam topic 1", "likely question 1", "topic 2", "question 2"]
}`,
  user: `Title: ${title}\n\nContent: ${content.substring(0, 3000)}`
});
```
 
Backend endpoint:
```
POST /api/notes/:id/ai/analyze
Auth: Token required
Logic:
  1. Fetch note — 404 if not found
  2. If aiAnalyzedAt exists and < 24 hours ago → return cached result
  3. Call generateResponse with note prompt
  4. Parse JSON from AI response
  5. Save to note: aiSummary, aiKeyPoints, aiTopics, aiAnalyzedAt
  6. Return { summary, keyPoints, examTopics }
```
 
Frontend component `NoteAIInsights.jsx`:
- Three collapsible sections: Summary, Key Takeaways, Exam Topics
- "Analyze with AI" button — loading state while AI runs
- If `success: false` from backend → show: "AI analysis is temporarily unavailable"
- Cache indicator: "Last analyzed 2 hours ago" shown when cached
 
**O — Output:**
- Updated Prisma schema + migration
- `backend/src/services/notes.service.js` — `analyzeNoteWithAI` function
- `backend/src/controllers/notes.controller.js` — `analyzeNote` handler
- `backend/src/routes/notes.routes.js` — POST /:id/ai/analyze route
- `frontend/src/components/notes/NoteAIInsights.jsx`
- `frontend/src/pages/Notes/NoteDetailPage.jsx` — integrates NoteAIInsights
 
**S — Scope/Constraints:**
- AI endpoint rate limited (from Prompt 2)
- Cached results used within 24 hours — no repeat API calls for the same note
- JSON parsing wrapped in try/catch — malformed AI response triggers fallback message
- Only the note's author OR any authenticated user can trigger analysis (open analysis)
- `content` truncated to 3000 chars for the prompt — Gemini has token limits
 
**✅ Terminal Check:**
```bash
curl -X POST http://localhost:5000/api/notes/NOTE_ID/ai/analyze \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expect: { success: true, data: { summary, keyPoints, examTopics } }
```
 
---
 
## PROMPT 4 — Placement Intelligence: Experience Structuring & Prep Checklist
 
**R — Role:**
You are a full-stack developer building the Placement AI module. You understand technical interview processes deeply and design prompts that produce actionable, structured output for students preparing for placements.
 
**T — Task:**
Build the complete Placement AI feature: automatic round-by-round breakdown of raw placement experiences, key preparation topics extraction, and a personalized preparation checklist. This covers backend endpoint, service logic, and a premium frontend "AI Insights" display box.
 
**C — Context:**
Students post raw placement experiences on KalviKonnect: "I applied to Google, had 3 rounds, first was DSA with dynamic programming questions, second was system design, third was HR..." The AI transforms this into a structured, scannable breakdown that other students can use to prepare. This is one of KalviKonnect's highest-value features.
 
**R — Requirements:**
 
Prisma schema addition:
```prisma
model PlacementPost {
  aiRoundBreakdown String?  // cached JSON
  aiPrepTopics     String?  // cached JSON array
  aiPrepChecklist  String?  // cached JSON array
  aiAnalyzedAt     DateTime?
}
```
 
Prompt in `promptBuilder.js`:
```js
exports.buildPlacementAnalysisPrompt = (company, role, rawExperience) => ({
  system: `You are a career coach specializing in tech placements. Analyze this placement experience and return ONLY valid JSON with no markdown:
{
  "roundBreakdown": [
    { "round": "Round 1 — Technical DSA", "focus": "...", "tips": "..." },
    { "round": "Round 2 — System Design", "focus": "...", "tips": "..." }
  ],
  "prepTopics": ["topic 1", "topic 2", "topic 3"],
  "prepChecklist": [
    { "category": "DSA", "items": ["Arrays & Strings", "DP basics"] },
    { "category": "System Design", "items": ["CAP theorem", "Load balancing"] }
  ]
}`,
  user: `Company: ${company}\nRole: ${role}\n\nExperience: ${rawExperience.substring(0, 2500)}`
});
```
 
Backend endpoint:
```
POST /api/placements/:id/ai/analyze
Auth: Token required
Cache: 24 hours same as Notes AI
```
 
Frontend premium UI component `PlacementAIInsights.jsx`:
- Styled with orange accent — distinct "AI Insights" label badge
- Three sections: Interview Round Breakdown (timeline style), Key Prep Topics (tag chips), Prep Checklist (grouped checkboxes)
- "Generate AI Insights" button with loading spinner
- Fallback message on AI failure
 
**O — Output:**
- Updated Prisma schema + migration
- `backend/src/services/placements.service.js` — `analyzePlacementWithAI`
- `backend/src/controllers/placements.controller.js` — `analyzePlacement` handler
- `backend/src/routes/placements.routes.js` — POST /:id/ai/analyze
- `frontend/src/components/placements/PlacementAIInsights.jsx`
- `frontend/src/pages/Placements/PlacementDetailPage.jsx` — integrates insights
 
**S — Scope/Constraints:**
- Rate limited to 10 requests per minute (from Prompt 2 rate limiter)
- Prep checklist items rendered as visual cards — not plain bullet points
- If AI returns partial JSON — show only the sections that parsed correctly
- Company and role fields are sent to the prompt — AI tailors the checklist specifically
 
**✅ Terminal Check:**
```bash
curl -X POST http://localhost:5000/api/placements/PLACEMENT_ID/ai/analyze \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expect: { success: true, data: { roundBreakdown, prepTopics, prepChecklist } }
```
 
---
 
## PROMPT 5 — Complete Backend API: All Missing Endpoints
 
**R — Role:**
You are a backend engineer doing a final pass to ensure every endpoint documented in the KalviKonnect API spec is implemented, working, and returns consistent responses. You leave no endpoint half-built.
 
**T — Task:**
Audit every API route across all 8 modules and implement any missing endpoints. Every endpoint must have working validation, auth middleware where required, correct status codes, and consistent `{ success, data }` response shape.
 
**C — Context:**
KalviKonnect has 8 modules: Auth, Posts (Dashboard), Notes, Placements, Hackathons, Discussions, Upvotes, Bookmarks, and Announcements. Some endpoints from earlier milestones may be partially implemented — missing validation, missing ownership checks, or returning inconsistent shapes.
 
**R — Requirements:**
 
Verify and complete every endpoint:
 
**Auth module:**
```
POST /api/auth/register  → validation + bcrypt + JWT + select response
POST /api/auth/login     → bcrypt.compare + JWT + select response
GET  /api/auth/me        → token required + return user without passwordHash
```
 
**Posts (Dashboard):**
```
POST   /api/posts           → auth + validation (content required, min 10 chars)
GET    /api/posts           → cursor pagination + scope filter (college/kalvium)
GET    /api/posts/:id       → public + author + college included
DELETE /api/posts/:id       → auth + ownership check in service
POST   /api/posts/:id/like  → auth + upsert like (toggle like/unlike)
```
 
**Notes:**
```
POST   /api/notes             → auth + validation + tag connectOrCreate
GET    /api/notes             → public + offset pagination + tag/university filter
GET    /api/notes/:id         → public + full detail with author, tags, university
PUT    /api/notes/:id         → auth + ownership + validation
DELETE /api/notes/:id         → auth + ownership
POST   /api/notes/:id/ai/analyze → auth + rate limit + Gemini
```
 
**Placements:**
```
POST   /api/placements        → auth + validation (company required)
GET    /api/placements        → public + offset pagination + company search
GET    /api/placements/:id    → public + author included
DELETE /api/placements/:id    → auth + ownership
POST   /api/placements/:id/ai/analyze → auth + rate limit + Gemini
```
 
**Hackathons:**
```
POST   /api/hackathons              → auth + validation
GET    /api/hackathons              → public + offset pagination + status filter
GET    /api/hackathons/:id          → public + creator + applicants count
PATCH  /api/hackathons/:id/status   → auth + ownership + toggle Open/Closed
POST   /api/hackathons/:id/apply    → auth + @@unique check + 409 on duplicate
GET    /api/hackathons/:id/applicants → auth + ownership only
PATCH  /api/hackathons/:id/applicants/:userId → auth + ownership + accept/reject
```
 
**Discussions:**
```
POST   /api/discussions              → auth + validation
GET    /api/discussions              → public + offset pagination + tag filter
GET    /api/discussions/:id          → public + replies + author on each
POST   /api/discussions/:id/replies  → auth + validation + isBlocker optional
```
 
**Upvotes:**
```
POST   /api/upvotes   → auth + polymorphic (noteId OR placementId OR replyId)
                       + check existing → 409 if duplicate
                       + $transaction: create upvote + increment upvoteCount
DELETE /api/upvotes   → auth + remove upvote + decrement upvoteCount
```
 
**Bookmarks:**
```
POST   /api/bookmarks   → auth + polymorphic bookmark
GET    /api/bookmarks   → auth + offset pagination + user's own only
DELETE /api/bookmarks/:id → auth + ownership
```
 
**Announcements:**
```
POST   /api/announcements  → auth + roleMiddleware(['CampusManager']) + validation
GET    /api/announcements  → public + offset pagination
```
 
Consistent response shape enforced:
```js
// ALL success responses:
res.status(200).json({ success: true, data: result });
// 201 for creates
res.status(201).json({ success: true, data: result });
// Errors handled by central handler only
```
 
**O — Output:**
- All route files complete — no missing endpoints
- All validation middleware applied
- All ownership checks in service layer
- All list endpoints paginated
- Postman collection file saved as `KalviKonnect.postman_collection.json`
 
**S — Scope/Constraints:**
- Never return `passwordHash` anywhere
- Upvote toggle: if upvote exists → delete it (unlike), if not → create it (like) — use upsert pattern
- Hackathon applicant response: only creatorId owner can see full applicant list
- Discussion replies: include `isBlocker` field — used by the team feed to highlight blockers
 
**✅ Terminal Check:**
```bash
# Test auth
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@kalvium.com","password":"test1234","role":"Student","universityId":"VALID_ID"}'
# Expect: 201 with token
 
# Test pagination
curl "http://localhost:5000/api/notes?page=1&limit=5"
# Expect: { data: [...], total, page, totalPages, hasNextPage }
```
 
---
 
## PROMPT 6 — Complete Frontend: All Pages Wired to Backend
 
**R — Role:**
You are a senior frontend engineer doing the final wiring pass. Every page must be connected to its backend API, render all four async states, handle auth correctly, and work on mobile and desktop.
 
**T — Task:**
Complete every frontend page in KalviKonnect — wiring each to the correct backend endpoint, implementing all four async states (loading, success, error, empty), and ensuring protected routes redirect correctly.
 
**C — Context:**
KalviKonnect frontend has pages for Auth, Dashboard, Notes (list + detail), Placements (list + detail), Hackathons (list + detail), Discussions (list + detail), Announcements, Bookmarks, and User Profile. Some pages may be partially built from earlier milestones. This prompt completes every page to production quality.
 
**R — Requirements:**
 
**Auth Pages:**
- `LoginPage.jsx` — React Hook Form, field-level validation errors, loading on submit, redirect to /dashboard on success
- `RegisterPage.jsx` — same pattern + university select dropdown (fetched from GET /api/universities)
- `ProtectedRoute.jsx` — redirects to /login if no token in AuthContext
 
**Dashboard Page (`DashboardPage.jsx`):**
- Two tabs: My College / Kalvium Network using `FeedTabs.jsx`
- Cursor-based infinite scroll — "Load More" button fetches next cursor
- `PostCard.jsx` — author, college badge, timestamp, like button (toggle), content preview
- `PostForm.jsx` modal — create post with text + optional image URL + visibility selector
- Loading: skeleton cards, Error: ErrorBanner + retry, Empty: EmptyState with "Be first to post"
 
**Notes Pages:**
- `NotesPage.jsx` — grid layout, offset pagination, tag chips filter bar, university filter
- `NoteDetailPage.jsx` — full content, file download link, author info, NoteAIInsights component
- `NoteForm.jsx` modal — title, description, content textarea, file URL, tags multi-select, difficulty select
- Upvote button on NoteCard — optimistic update (increment locally, revert on API fail)
- Bookmark button on NoteCard — toggle with visual feedback
 
**Placements Pages:**
- `PlacementsPage.jsx` — list layout, offset pagination, company search input
- `PlacementDetailPage.jsx` — full experience view + PlacementAIInsights component
- `PlacementForm.jsx` modal — company, role, rounds, questions, tips fields
 
**Hackathons Pages:**
- `HackathonsPage.jsx` — card grid, status filter (All / Open / Closed), offset pagination
- `HackathonDetailPage.jsx` — full details, team size, required roles, Apply button
- Apply button: disabled if user already applied (check application status)
- Creator view: see list of applicants with Accept/Reject buttons
 
**Discussions Pages:**
- `DiscussionsPage.jsx` — thread list, tag filter, offset pagination
- `DiscussionDetailPage.jsx` — thread content + all replies in chronological order
- Reply form at bottom — textarea + isBlocker checkbox
- Upvote button on each reply
 
**Announcements Page:**
- `AnnouncementsPage.jsx` — list of announcements, newest first
- CampusManager sees "Create Announcement" button — others do not (UI only — backend enforces)
- `AnnouncementForm.jsx` — title, description, university scope selector
 
**Bookmarks Page:**
- `BookmarksPage.jsx` — three sections: Saved Notes, Saved Placements, Saved Hackathons
- Remove bookmark button on each item
- Empty state per section if nothing bookmarked in that category
 
**Profile Page:**
- `ProfilePage.jsx` — user's name, email, university, role, batch year
- Edit profile form — update name and batch year (email and role locked)
- "My Posts" tab showing all notes and placement posts by the user
 
**React Router setup in `App.jsx`:**
```jsx
<Routes>
  <Route path="/login"    element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard"      element={<DashboardPage />} />
    <Route path="/notes"          element={<NotesPage />} />
    <Route path="/notes/:id"      element={<NoteDetailPage />} />
    <Route path="/placements"     element={<PlacementsPage />} />
    <Route path="/placements/:id" element={<PlacementDetailPage />} />
    <Route path="/hackathons"     element={<HackathonsPage />} />
    <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
    <Route path="/discussions"    element={<DiscussionsPage />} />
    <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
    <Route path="/announcements"  element={<AnnouncementsPage />} />
    <Route path="/bookmarks"      element={<BookmarksPage />} />
    <Route path="/profile"        element={<ProfilePage />} />
  </Route>
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
```
 
**O — Output:**
- All 12 pages fully implemented and wired to backend
- All four async states on every data-fetching page
- Every form uses React Hook Form
- Protected routes working — unauthenticated users redirected to /login
- Mobile layout verified at 375px — navigation bottom tab bar working
 
**S — Scope/Constraints:**
- Zero API calls inside any component — all through custom hooks
- Optimistic updates on upvote/bookmark — revert on failure
- Pagination state stored in URL query params — pages are bookmarkable
- All forms clear on successful submission
- Modal forms close and parent list refetches after successful create
 
**✅ Terminal Check:**
```bash
cd frontend && npm run build
# Expect: Build completed successfully — no TypeScript or import errors
# Expect: dist/ folder created
```
 
---
 
## PROMPT 7 — Premium UI: Dashboard, Navigation & Global Design System
 
**R — Role:**
You are a lead UI/UX engineer building a premium, high-end SaaS-quality interface for KalviKonnect. Every design decision is intentional, responsive, and consistent with a defined design system.
 
**T — Task:**
Build the complete KalviKonnect design system and apply it across all pages. Transform the functional UI into a premium, modern interface using Tailwind CSS, consistent component tokens, and subtle micro-animations — no external animation libraries required.
 
**C — Context:**
KalviKonnect's brand colors are Orange (#F97316) as primary and Indigo (#6366F1) as accent. The platform serves students who use it on mobile daily — mobile experience must be excellent. The aesthetic should feel like a high-quality SaaS product: clean whites, clear hierarchy, thoughtful spacing.
 
**R — Requirements:**
 
Design tokens in `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  "#F97316",
          orangeLight: "#FFF7ED",
          indigo:  "#6366F1",
          indigoLight: "#EEF2FF",
          green:   "#10B981",
          blue:    "#3B82F6",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  }
}
```
 
**Navbar (Desktop sidebar):**
- Logo: "KalviKonnect" in orange, bold, with a small flame emoji
- Navigation items: Dashboard, Notes, Placements, Hackathons, Discussions, Announcements, Bookmarks, Profile
- Active item: orange background tint, orange left border
- Bottom: user avatar (initials circle), name, role badge, logout button
- Width: 240px fixed — content area left-padded
 
**Navigation (Mobile bottom tab bar):**
- 5 icons: Dashboard, Notes, Placements, Hackathons, Profile
- Active icon: orange tinted background pill
- Fixed to bottom — `fixed bottom-0` — no overlap with content
- Content padding-bottom: 80px to clear the bar
 
**Card design system:**
```
Base card: bg-white border border-slate-100 rounded-xl shadow-sm
hover: shadow-md transition-shadow duration-200
Content padding: p-5
```
 
**Buttons:**
```
Primary: bg-brand-orange text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-orange-600 transition-colors
Secondary: bg-white border border-slate-200 text-slate-700 rounded-xl px-5 py-2.5 hover:bg-slate-50
Danger: bg-red-500 text-white rounded-xl
Icon button: p-2 rounded-lg hover:bg-slate-100 text-slate-500
Min height: 44px on all buttons (touch target)
```
 
**Tag chip design:**
```
bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100
```
 
**Role badge design:**
- Student: green chip
- Mentor: indigo chip
- CampusManager: orange chip
 
**Status badge design:**
- Open: green dot + "Open"
- Closed: red dot + "Closed"
 
**Feed tab component (FeedTabs.jsx):**
- Two tabs: "My College" | "Kalvium Network"
- Active tab: orange underline border + orange text
- Smooth tab switch with CSS transition
 
**Micro-animations (CSS only — no Framer Motion):**
```css
/* Upvote button pulse */
.upvote-active { animation: upvotePulse 0.3s ease-out; }
@keyframes upvotePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
 
/* Card entrance */
.card-enter { animation: cardFadeIn 0.25s ease-out; }
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
 
**Empty states:**
```jsx
// Consistent empty state with emoji + text + CTA
<div className="flex flex-col items-center py-16 gap-4 text-center">
  <span className="text-5xl">{icon}</span>
  <p className="text-slate-500 max-w-xs text-sm leading-relaxed">{message}</p>
  {ctaLabel && <button className="btn-primary">{ctaLabel}</button>}
</div>
```
 
**O — Output:**
- `tailwind.config.js` with design tokens
- `Navbar.jsx` (desktop sidebar)
- `BottomNav.jsx` (mobile tab bar)
- `AppLayout.jsx` wrapping all authenticated pages
- `Button.jsx`, `Card.jsx`, `Badge.jsx`, `TagChip.jsx` shared components
- `index.css` with global CSS animations and base styles
- All existing pages updated to use the new design system
 
**S — Scope/Constraints:**
- Mobile-first — build mobile layout first, desktop is an enhancement
- No Framer Motion — all animations via CSS keyframes
- No custom fonts loaded from Google Fonts — use Inter via system stack
- All interactive elements meet 44px minimum tap target
- Dark mode prep: use Tailwind `dark:` variants on all background and text colors — toggle not required yet
 
**✅ Terminal Check:**
```bash
cd frontend && npm run build
# Expect: No Tailwind purge warnings — all classes resolved
# Open in browser at 375px width — verify bottom nav visible, no overflow
```
 
---
 
## PROMPT 8 — Production Hardening: Global Middleware, Validation & Security
 
**R — Role:**
You are a DevOps and backend security engineer doing the final production hardening pass. You treat the backend as an audit surface — every endpoint must validate its inputs, every error must return a consistent shape, and no sensitive information must leak.
 
**T — Task:**
Implement global error handling, strict input validation for all POST/PATCH routes, rate limiting, security headers, and request logging to bring the KalviKonnect backend to production-ready standard.
 
**C — Context:**
KalviKonnect is preparing for real users. The backend must handle malformed inputs gracefully, never expose stack traces in production, return consistent error shapes across every endpoint, and resist basic abuse patterns like AI endpoint spamming and brute-force login attempts.
 
**R — Requirements:**
 
Install dependencies:
```bash
npm install helmet express-rate-limit morgan
```
 
`server.js` middleware order (order is critical):
```js
// 1. Security headers
app.use(helmet());
 
// 2. CORS
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
 
// 3. Compression
app.use(compression());
 
// 4. Request logging
app.use(morgan("combined"));
 
// 5. Body parsing
app.use(express.json({ limit: "10mb" }));
 
// 6. Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", globalLimiter);
 
// 7. Stricter rate limit for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/api/auth", authLimiter);
 
// 8. Routes
app.use("/api/auth",          authRoutes);
// ... all other routes
 
// 9. 404 handler — must be AFTER all routes
app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route not found", statusCode: 404 });
});
 
// 10. Central error handler — must be LAST
app.use(globalErrorHandler);
```
 
`middleware/globalErrorHandler.js`:
```js
module.exports = (err, req, res, next) => {
  // Never expose stack trace in production
  if (process.env.NODE_ENV !== "development") {
    delete err.stack;
  }
 
  // Prisma unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({ error: true, message: "This record already exists", statusCode: 409 });
  }
 
  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({ error: true, message: "Record not found", statusCode: 404 });
  }
 
  // JWT errors
  if (err.name === "JsonWebTokenError")  return res.status(401).json({ error: true, message: "Invalid token", statusCode: 401 });
  if (err.name === "TokenExpiredError")  return res.status(401).json({ error: true, message: "Token expired, please log in again", statusCode: 401 });
 
  // Our AppError
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ error: true, message: err.message, statusCode: err.statusCode || 400 });
  }
 
  // Unknown error — log but do not expose
  console.error("[UNHANDLED ERROR]", err);
  res.status(500).json({ error: true, message: "Something went wrong", statusCode: 500 });
};
```
 
Validation middleware for all POST routes (`middleware/validate.js`):
```js
// Notes
exports.validateNote = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("content").trim().notEmpty().withMessage("Content is required").isLength({ min: 20 }),
  body("universityId").notEmpty().withMessage("University is required"),
  handleValidation
];
 
// Placements
exports.validatePlacement = [
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  handleValidation
];
 
// Hackathons
exports.validateHackathon = [
  body("name").trim().notEmpty().withMessage("Hackathon name is required"),
  body("deadline").isISO8601().withMessage("Valid deadline date required"),
  handleValidation
];
 
// Discussion
exports.validateDiscussion = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 300 }),
  body("description").trim().notEmpty().isLength({ min: 10 }),
  handleValidation
];
 
// Announcement
exports.validateAnnouncement = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  handleValidation
];
 
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, message: errors.array()[0].msg, statusCode: 400 });
  }
  next();
};
```
 
Apply to all routes before controllers.
 
**O — Output:**
- Updated `server.js` with complete middleware chain in correct order
- `middleware/globalErrorHandler.js`
- `middleware/validate.js` with all validation schemas
- Helmet security headers active
- Rate limiting on auth (20/15min) and AI endpoints (10/min) and global (500/15min)
- Morgan logging active
- `FRONTEND_URL` added to .env.example
 
**S — Scope/Constraints:**
- Stack traces never sent to client in production
- Helmet default config acceptable — do not over-configure
- Rate limit headers exposed (`standardHeaders: true`) — clients see when they are limited
- Morgan log format: "combined" in production, "dev" in development
 
**✅ Terminal Check:**
```bash
# Security headers check
curl -I http://localhost:5000/api/notes
# Expect headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
 
# Rate limit test
for i in $(seq 1 25); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"x","password":"x"}'; done
# Expect: first 20 return 401, remaining return 429
```
 
---
 
## PROMPT 9 — Search & Discovery: Global Search Across All Modules
 
**R — Role:**
You are a backend engineer building the Search and Discovery layer for KalviKonnect. You implement efficient, indexed search across all content modules using PostgreSQL's built-in text search capabilities.
 
**T — Task:**
Build a global search endpoint that searches across Notes, Placements, and Hackathons simultaneously, and individual filtered search within each module. Add a search bar to the frontend navigation that triggers the global search.
 
**C — Context:**
KalviKonnect currently has filter-by-tag and filter-by-company on individual pages. Students need a unified search experience — type a keyword and get relevant results from across all modules. Search must be fast (indexed) and respect university scope where relevant.
 
**R — Requirements:**
 
Backend global search endpoint:
```
GET /api/search?q=keyword&universityId=xxx
 
Returns:
{
  notes:      [...top 5 note results],
  placements: [...top 5 placement results],
  hackathons: [...top 3 hackathon results]
}
```
 
Service implementation:
```js
exports.globalSearch = async ({ q, universityId }) => {
  if (!q || q.trim().length < 2) return { notes: [], placements: [], hackathons: [] };
 
  const searchTerm = q.trim();
 
  const [notes, placements, hackathons] = await Promise.all([
    db.note.findMany({
      where: {
        OR: [
          { title:       { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } }
        ],
        ...(universityId ? { universityId } : {})
      },
      take: 5,
      orderBy: { upvoteCount: "desc" },
      select: { id: true, title: true, description: true, upvoteCount: true,
                author: { select: { id: true, name: true } } }
    }),
    db.placementPost.findMany({
      where: {
        OR: [
          { company: { contains: searchTerm, mode: "insensitive" } },
          { role:    { contains: searchTerm, mode: "insensitive" } }
        ]
      },
      take: 5,
      orderBy: { upvoteCount: "desc" },
      select: { id: true, company: true, role: true, upvoteCount: true,
                author: { select: { id: true, name: true } } }
    }),
    db.hackathonPost.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
        status: "Open"
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, description: true, deadline: true, status: true }
    })
  ]);
 
  return { notes, placements, hackathons };
};
```
 
Frontend search bar (`GlobalSearch.jsx`):
- Input with 300ms debounce — no API call on every keystroke
- Dropdown results overlay — sections for Notes, Placements, Hackathons
- Keyboard navigation: arrow keys + Enter to navigate to result
- Click result: navigate to the appropriate detail page
- Escape key or click outside: close dropdown
- Empty state: "No results for 'keyword'"
- Minimum 2 characters before search triggers
 
Place search bar in Navbar (desktop) and at top of a dedicated Search page (mobile).
 
**O — Output:**
- `backend/src/routes/search.routes.js`
- `backend/src/services/search.service.js`
- `backend/src/controllers/search.controller.js`
- `frontend/src/components/shared/GlobalSearch.jsx`
- `frontend/src/services/search.service.js`
- `frontend/src/hooks/useSearch.js` — debounced search hook
 
**S — Scope/Constraints:**
- Search results are read-only — no auth required for the search endpoint
- Debounce 300ms on frontend — no API spam on every keystroke
- Results limited to top 5+3 — never return unbounded results even in search
- `mode: "insensitive"` on all contains queries — case-insensitive search
 
**✅ Terminal Check:**
```bash
curl "http://localhost:5000/api/search?q=DSA"
# Expect: { notes: [...], placements: [...], hackathons: [...] }
 
curl "http://localhost:5000/api/search?q=a"
# Expect: { notes: [], placements: [], hackathons: [] }  (too short — min 2 chars)
```
 
---
 
## PROMPT 10 — User Profile, University Setup & Onboarding
 
**R — Role:**
You are a full-stack engineer completing the user onboarding and profile management experience. You ensure new users can select their university, view and edit their profile, and see their contribution history.
 
**T — Task:**
Build the complete user onboarding flow (university selection on first login), the profile page, and the university list endpoint. Seed the database with Kalvium's partner universities.
 
**C — Context:**
Every KalviKonnect user belongs to a university. On first login after registration, new users who have not selected a university should be prompted to choose one. The profile page shows the user's contributions and allows name + batch year updates.
 
**R — Requirements:**
 
University seed data in `prisma/seed.js`:
```js
const universities = [
  { name: "Amrita Vishwa Vidyapeetham", city: "Coimbatore" },
  { name: "Lovely Professional University", city: "Phagwara" },
  { name: "KL University", city: "Guntur" },
  { name: "Chandigarh University", city: "Chandigarh" },
  { name: "VIT University", city: "Vellore" },
  { name: "SRM Institute of Science and Technology", city: "Chennai" },
  { name: "Manipal Institute of Technology", city: "Manipal" },
  { name: "JAIN University", city: "Bangalore" },
];
```
 
Run with: `npx prisma db seed`
 
University endpoint:
```
GET /api/universities  → public, returns all universities as [{ id, name, city }]
```
 
User profile endpoints:
```
GET    /api/users/me          → auth, return full profile
PATCH  /api/users/me          → auth, update name + batchYear only
GET    /api/users/me/notes    → auth, user's own notes paginated
GET    /api/users/me/placements → auth, user's own placements paginated
```
 
Onboarding flow (frontend):
- After login, check if `user.universityId` is null
- If null → redirect to `/onboarding` before showing dashboard
- Onboarding page: searchable university dropdown, select and save
- After save: PATCH /api/users/me with universityId, redirect to /dashboard
 
Profile page (`ProfilePage.jsx`):
- Avatar circle with initials (first letter of name)
- Name, email (read-only), role badge, university name, batch year
- Edit modal: name + batchYear fields
- Two tabs: "My Notes" | "My Placements" — paginated lists of the user's contributions
- Stats row: Notes count, Placements count, Total upvotes received
 
**O — Output:**
- `prisma/seed.js` with university data
- `backend/src/routes/universities.routes.js`
- `backend/src/routes/users.routes.js`
- `frontend/src/pages/Onboarding/OnboardingPage.jsx`
- `frontend/src/pages/Profile/ProfilePage.jsx`
- `frontend/src/components/profile/ProfileStats.jsx`
- `frontend/src/components/profile/EditProfileModal.jsx`
 
**S — Scope/Constraints:**
- Email and role are never editable after registration
- `universityId` editable only through the onboarding flow — not in the general edit profile form
- Profile stats (note count, placement count) computed via Prisma `_count` — no separate queries
- Onboarding page is not wrapped in ProtectedRoute — accessible without a complete profile
 
**✅ Terminal Check:**
```bash
cd backend && npx prisma db seed
# Expect: Seeded X universities
 
curl "http://localhost:5000/api/universities"
# Expect: [{ id, name, city }, ...]
```
 
---
 
## PROMPT 11 — Frontend Performance: React.memo, useMemo & Load Testing
 
**R — Role:**
You are a performance engineer running the final frontend optimization pass. You use the React Profiler to identify real re-render problems, apply memoization only where the data proves it is needed, and run an Artillery load test on the two heaviest backend endpoints.
 
**T — Task:**
Profile the KalviKonnect frontend with React DevTools, fix unnecessary re-renders on the feed pages, fix the double-fetch bug, and produce a load test report comparing before and after performance numbers.
 
**C — Context:**
KalviKonnect's heaviest pages are the Notes feed (tag filtering triggers re-renders), the Dashboard feed (cursor pagination adds items to state), and the Discussion detail (many reply cards). These need a React Profiler audit and targeted memoization before deployment.
 
**R — Requirements:**
 
React.memo — apply to pure display components:
```js
// NoteCard, PlacementCard, HackathonCard, PostCard, ThreadCard, ReplyCard
// Wrap only after Profiler confirms they are re-rendering unnecessarily
export const NoteCard = React.memo(({ note, onUpvote, onBookmark }) => {
  // ...
}, (prev, next) => prev.note.id === next.note.id && prev.note.upvoteCount === next.note.upvoteCount);
// Custom comparison: only re-render if upvoteCount or id changes
```
 
useMemo — apply to expensive computations in hooks:
```js
// In useNotes: filtered notes should not recompute on every render
const filteredNotes = useMemo(
  () => notes.filter(n => selectedTag ? n.tags.some(t => t.tag.name === selectedTag) : true),
  [notes, selectedTag]
);
```
 
useCallback — stable callbacks passed to memo'd children:
```js
const handleUpvote   = useCallback((noteId) => upvoteNote(noteId), []);
const handleBookmark = useCallback((noteId) => bookmarkNote(noteId), []);
```
 
Fix double-fetch bug in all hooks:
```js
// WRONG — missing dependency array runs on every render
useEffect(() => { fetchNotes(); });
 
// CORRECT — runs once on mount, re-runs only when filters change
useEffect(() => { fetchNotes(); }, [page, selectedTag, universityId]);
```
 
Artillery load test (`artillery.yml`):
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 30
      arrivalRate: 10
      name: "Warm up"
    - duration: 60
      arrivalRate: 50
      name: "Peak load — 50 concurrent users"
  defaults:
    headers:
      Content-Type: "application/json"
 
scenarios:
  - name: "Feed browsing"
    flow:
      - get:
          url: "/api/notes?page=1&limit=10"
      - get:
          url: "/api/placements?page=1&limit=10"
      - get:
          url: "/api/posts?scope=kalvium&limit=10"
      - get:
          url: "/api/search?q=DSA"
```
 
Run and document:
```bash
npm install -g artillery
artillery run artillery.yml --output before.json
# Apply all optimizations
artillery run artillery.yml --output after.json
artillery report after.json
```
 
Document in `PERFORMANCE.md`:
- React Profiler screenshots: before and after render flamegraph
- Components memoized with justification from Profiler data
- Artillery results: median, p95, p99 response times, throughput, error rate
 
**O — Output:**
- All feed card components wrapped with React.memo where Profiler confirmed benefit
- All expensive computations in hooks wrapped with useMemo
- All callbacks passed to memoized children wrapped with useCallback
- Double-fetch bugs fixed across all useEffect calls
- `artillery.yml` load test config
- `PERFORMANCE.md` updated with load test results
 
**S — Scope/Constraints:**
- Do NOT apply React.memo blindly — only where Profiler shows actual unnecessary re-renders
- Wrong useMemo dependency arrays are worse than no memo — verify each dependency list
- Artillery must run against the actual running server — not mocked
- Document the specific component and render count before and after each memo fix
 
**✅ Terminal Check:**
```bash
npm install -g artillery
artillery run artillery.yml
# Expect: p95 response time < 200ms for notes feed
# Expect: 0% error rate under 50 concurrent users
```
 
---
 
## PROMPT 12 — Deployment: Full Production Setup
 
**R — Role:**
You are a DevOps engineer preparing KalviKonnect for its first production deployment. You configure the backend for Render, the frontend for Netlify, the database for managed PostgreSQL, and verify the entire deployed system works end to end.
 
**T — Task:**
Prepare all deployment configuration, environment variables, build scripts, and production-specific settings for KalviKonnect. Deploy and verify the complete system.
 
**C — Context:**
KalviKonnect deploys to: Render (backend Node.js service), Render/Neon (managed PostgreSQL), Netlify (frontend static). The deployment must support environment-specific configuration — development and production behave differently for logging, error handling, and CORS.
 
**R — Requirements:**
 
Backend `package.json` scripts:
```json
{
  "scripts": {
    "start":  "node src/server.js",
    "dev":    "nodemon src/server.js",
    "build":  "npx prisma generate",
    "migrate":"npx prisma migrate deploy"
  }
}
```
 
`render.yaml` (Render deployment config):
```yaml
services:
  - type: web
    name: kalvikonnect-backend
    env: node
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: kalvikonnect-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: GEMINI_API_KEY
        sync: false
      - key: FRONTEND_URL
        value: https://kalvikonnect.netlify.app
 
databases:
  - name: kalvikonnect-db
    databaseName: kalvikonnect
    user: kalvikonnect
```
 
`netlify.toml` (Netlify deployment config):
```toml
[build]
  command = "npm run build"
  publish = "dist"
 
[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
```
 
Frontend `vite.config.js` — ensure base path:
```js
export default defineConfig({
  plugins: [react()],
  base: "/"
});
```
 
Production `.env` checklist:
```
Backend (Render env vars):
  DATABASE_URL=postgresql://...
  JWT_SECRET=<generate strong secret>
  GEMINI_API_KEY=<your key>
  FRONTEND_URL=https://your-netlify-app.netlify.app
  NODE_ENV=production
  PORT=5000
 
Frontend (Netlify env vars):
  VITE_API_URL=https://your-render-app.onrender.com/api
  VITE_APP_NAME=KalviKonnect
```
 
CORS update for production:
```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```
 
Prisma for production:
```js
// db.js — production connection pool config
const db = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL + "?connection_limit=10&pool_timeout=20" }
  },
  log: process.env.NODE_ENV === "development" ? ["query"] : ["error"]
});
```
 
Post-deployment verification checklist:
```
□ Backend health check: GET /api/health → { status: "ok", timestamp }
□ Auth works: POST /api/auth/register → 201
□ Notes feed: GET /api/notes → paginated response
□ AI works: POST /api/notes/:id/ai/analyze → AI response
□ CORS works: frontend domain in allow list
□ HTTPS enforced on both frontend and backend
□ Database migrations applied: npx prisma migrate deploy
□ University seed data present: GET /api/universities → non-empty array
```
 
Add health check endpoint:
```js
// routes/health.routes.js
router.get("/health", async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
  } catch {
    res.status(503).json({ status: "error", message: "Database unreachable" });
  }
});
```
 
**O — Output:**
- `render.yaml` deployment config
- `netlify.toml` deployment config
- Updated `server.js` with production CORS
- Updated `db.js` with production pool config
- Health check endpoint at GET /api/health
- Complete README.md with setup, env vars, and deployment instructions
- Both backend and frontend successfully deployed and reachable
 
**S — Scope/Constraints:**
- JWT_SECRET must be generated with high entropy — use `openssl rand -base64 64`
- DATABASE_URL must include connection pool params in production
- Frontend VITE_API_URL must point to the production backend — not localhost
- `npx prisma migrate deploy` (not `db push`) in production — tracked migrations only
- Seed command runs once manually after deployment — not part of the deploy pipeline
 
**✅ Terminal Check:**
```bash
# Health check
curl https://your-render-app.onrender.com/api/health
# Expect: { status: "ok", ... }
 
# CORS verification
curl -H "Origin: https://your-netlify-app.netlify.app" \
     -I https://your-render-app.onrender.com/api/notes
# Expect: Access-Control-Allow-Origin: https://your-netlify-app.netlify.app
 
# Frontend build test
cd frontend && npm run build
# Expect: dist/ created, no errors
```
 
---
 
## PROMPT 13 — Final QA: End-to-End User Journey Testing
 
**R — Role:**
You are a QA engineer running the final end-to-end verification before KalviKonnect goes live. You test every critical user journey from registration to AI insight generation and verify nothing is broken.
 
**T — Task:**
Run the complete user journey test suite across KalviKonnect's production build. Fix every bug found. Document the test results. Ship only after all critical paths pass.
 
**C — Context:**
KalviKonnect has four user roles (Student, Mentor, CampusManager, and guest). Every core user flow must work correctly end to end — from registration to creating content to using AI features to the edge cases in auth and permissions.
 
**R — Requirements:**
 
**Journey 1 — Student Registration and Onboarding:**
```
1. Visit /register
2. Fill in name, email, password, role=Student, university from dropdown
3. Submit → 201 → JWT token stored → redirect to /dashboard
4. Verify: dashboard shows My College and Kalvium Network tabs
5. Verify: username and role badge visible in sidebar
```
 
**Journey 2 — Notes Full Cycle:**
```
1. Navigate to /notes
2. Click "Share a Note" → fill form → submit
3. Verify: new note appears at top of feed
4. Click note → detail page loads
5. Click "Analyze with AI" → loading → AI insights appear
6. Click upvote → count increments (optimistic)
7. Click bookmark → note saved to /bookmarks
8. Edit own note → changes saved
9. Log in as different student → try to edit → 403 blocked
```
 
**Journey 3 — Placement Experience:**
```
1. Post a placement experience with company + role + tips
2. View own experience → "Analyze with AI" → structured breakdown appears
3. Search by company name → experience appears in results
4. Another student upvotes → count increments
```
 
**Journey 4 — Hackathon Team Formation:**
```
1. Post a hackathon as Student A
2. Log in as Student B → apply to hackathon
3. Log in as Student A → view applicants → accept Student B
4. Verify: Student B's application status shows "Accepted"
5. Close hackathon → status changes to Closed → Apply button disabled
```
 
**Journey 5 — Campus Manager Announcements:**
```
1. Log in as CampusManager
2. Navigate to /announcements → "Create Announcement" button visible
3. Post announcement → appears in feed
4. Log in as Student → "Create Announcement" button NOT visible
5. Student tries POST /api/announcements via Postman → 403 returned
```
 
**Journey 6 — Auth Edge Cases:**
```
1. Try accessing /dashboard without token → redirect to /login
2. Use expired token on a protected endpoint → 401 "Token expired"
3. Try to delete another user's note → 403
4. Try to sign up with existing email → 409
5. Leave app open, wait (or fake token expiry) → next API call → redirect to /login
```
 
**Journey 7 — Search:**
```
1. Type "DSA" in search bar
2. Verify: notes, placements results appear
3. Type single char "D" → no results (min 2 chars)
4. Click a result → navigate to correct detail page
```
 
**Journey 8 — Mobile Layout:**
```
1. Open at 375px viewport width
2. Verify: bottom tab bar visible and navigable
3. Verify: note form is full-width sheet
4. Verify: all buttons minimum 44px height
5. Verify: no horizontal overflow on any page
```
 
For every bug found — document:
- Bug title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Fix applied
- Verified fixed
 
**O — Output:**
- All 8 journeys pass
- Bug log documented in `QA_REPORT.md`
- All bugs from the log have "✅ Fixed" status
- Final `npm run build` completes with zero errors
 
**S — Scope/Constraints:**
- Test on both localhost and production URL if deployed
- Mobile testing at 375px viewport in browser DevTools
- Every API error tested with Postman — not just UI testing
- Zero console errors in browser when running any journey
 
**✅ Final Terminal Check:**
```bash
# Backend
cd backend && npm run dev
# Expect: No errors on startup
 
# Frontend build
cd frontend && npm run build
# Expect: Build successful — dist/ created
 
# Prisma validate
cd backend && npx prisma validate
# Expect: Schema is valid
 
# Artillery smoke test
artillery run artillery.yml --output final.json
# Expect: 0 errors, p95 < 300ms
 
# Confirm: git status — all files committed
git status
# Expect: Working tree clean
```
 
---
 
## Quick Reference — Prompt Execution Order
 
| # | Prompt | Focus | Check When Done |
|---|--------|-------|-----------------|
| 1 | Project Health Check | Foundation | Server starts clean |
| 2 | Gemini AI Integration | AI service | generateResponse works |
| 3 | Note Intelligence | Notes AI | 3-part AI response |
| 4 | Placement Intelligence | Placements AI | Structured breakdown |
| 5 | Complete Backend API | All endpoints | All routes respond correctly |
| 6 | Complete Frontend | All pages wired | npm run build passes |
| 7 | Premium UI | Design system | Mobile + desktop verified |
| 8 | Production Hardening | Security + validation | Rate limits work |
| 9 | Search & Discovery | Global search | Results returned |
| 10 | Profile & Onboarding | User management | Seed data present |
| 11 | Frontend Performance | React + Load test | Artillery p95 < 200ms |
| 12 | Deployment | Render + Netlify | Health check passes |
| 13 | Final QA | All journeys | Zero bugs open |
 
> Run prompts in order. Fix all terminal errors before advancing. The project ships when Prompt 13 passes completely.