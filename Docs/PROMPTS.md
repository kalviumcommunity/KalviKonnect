# 📝 AI Prompts & Decision Log

This log tracks the interaction between the engineer and AI tools to document key architectural decisions and code generation.

---

### **Prompt 1: Project Scaffolding**
- **Prompt:** "Set up a MERN stack project named Kalvi Connect. Backend: Node, Express, Prisma (PostgreSql), JWT. Frontend: React, Vite, Tailwind. Organize folders into controllers, routes, services for backend and pages, components, context for frontend."
- **Output:** A complete directory structure with `package.json` files and basic `server.js`.
- **Decision:** Accepted the modular folder structure.
- **Reason:** Separating concerns (MVC-ish) ensures scalability for Milestone 2 features like complex filtering.

### **Prompt 2: Prisma Schema Design**
- **Prompt:** "Generate a Prisma schema for Kalvi Connect. Include models for User (Student/Mentor/Manager), Resource (Notes/Hackathons), and PlacementExperience. Use PostgreSQL as the provider."
- **Output:** A `schema.prisma` file with relational mappings.
- **Decision:** Kept the schema in the "Engineer Zone" for manual review.
- **Reason:** AI sometimes forgets `@default(now())` or `@updatedAt` which are critical for feed sorting.

### **Prompt 3: Express Server Boilerplate**
- **Prompt:** "Create a basic Express server.js with CORS, express.json, and a placeholder GET route at root."
- **Output:** A standard Express setup code block.
- **Decision:** Replaced `var` with `const` and added `dotenv` configuration manually.
- **Reason:** To ensure stricter scoping and secure environment variable handling from Step 1.

### **Prompt 4: Tailwind Setup & Configuration**
- **Prompt:** "Configure Tailwind CSS with PostCSS for a Vite project. Add Inter and Outfit from Google Fonts to the design system."
- **Output:** `tailwind.config.js` and `index.css` with font imports.
- **Decision:** Accepted "Vibe Zone" generation but adjusted the primary blue hex code.
- **Reason:** UI defaults were generic; manually tuned colors to match a "premium" educational platform aesthetic.

### **Prompt 5: React Router Shell**
- **Prompt:** "Set up React Router DOM v6 in App.jsx. Create routes for Dashboard (/), Login (/login), and a protected route for senior experience submission."
- **Output:** A functional `<Router>` with `<Routes>` and placeholder components.
- **Decision:** Standardized the layout wrapper for all routes.
- **Reason:** Consistency in the navigation bar/footer is better handled by a shared layout component generated early.

### **Prompt 6: Milestone 2 Strategic Definition**
- **Prompt:** "Define 3 personas for Kalvi Connect: Student, Mentor, and Campus Manager. Map them to features and write a sharp problem statement that avoids mentioning features."
- **Output:** Structured personas and a problem statement focused on "Information Luck."
- **Decision:** Rejected the first weak problem statement provided by AI.
- **Reason:** Ensuring the problem highlights the "transient nature" of current communication rather than just "needing a site."

### **Prompt 7: Ruthless MVP Scoping**
- **Prompt:** "Categorize these 15 features into MVP, Post-MVP, and Cut buckets. Be ruthless and cut at least 3 high-effort features."
- **Output:** Bucketed list with justifications.
- **Decision:** Manually moved "Hackathon Application Logic" and "Real-time Chat" to Cut/Post-MVP.
- **Reason:** Preventing "Feature Creep" early on to ensure a high-quality "Knowledge Hub" experience can be shipped faster.

### **Prompt 8: Complete Prisma Schema Design**
- **Prompt:** "Generate a 3NF normalized Prisma schema for Kalvi Connect. Extract University and Tag into separate models. Add composite indexes for [universityId, createdAt] on Notes, and denormalize upvote/reply counts. Use @unique for user-level post constraints (one upvote per post)."
- **Output:** A robust schema with junction tables and strict indexing.
- **Decision:** Accepted the composite indexing for specific feed performance.
- **Reason:** Ensuring that we don't just normalized (increasing join latency) but also optimize for the most common campus-specific feed queries we identified in our Persona research.

### **Prompt 9: 3-Layer API Architecture**
- **Prompt:** "Build a 3-layer MERN backend for Kalvi Connect. Enforce Routes -> Controllers -> Services. Use express-validator, JWT for auth, and roleCheck middleware for RBAC (Student/Mentor/Manager). Ensure all Prisma calls are inside Services and all list endpoints have non-negotiable pagination (max 50)."
- **Output:** Fully decoupled backend codebase with centralized error handling.
- **Decision:** Used a `Prisma Singleton` (db.js) to avoid multiple DB connections.
- **Reason:** Prevents "Max Connection Exceeded" errors in serverless/low-tier DB environments.

### **Prompt 10: Atomic Transactions & Denormalization Sync**
- **Prompt:** "When upvoting a note, create an Upvote record and increment note.upvoteCount atomically using a Prisma transaction. Handle duplicate upvotes with a 400 error."
- **Output:** Transactional logic using `prisma.$transaction`.
- **Decision:** Applied the same logic to `Discussion Threads` (incrementing `replyCount`).
- **Reason:** To ensure data integrity between the count summaries (fast reads) and the actual records (slow writes).
