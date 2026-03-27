# 🎓 Kalvi Connect

**Kalvi Connect** is a centralized knowledge-sharing platform exclusively designed for Kalvium students. It serves as a community hub for sharing notes, placement experiences, hackathon opportunities, and career-focused discussions.

---

## 🔐 Auth & Security
- **JWT Authentication**: Secure stateless auth with 7-day token expiry.
- **Role-Based Access Control (RBAC)**: Specific endpoints restricted to `Campus Manager`, `Student`, or `Mentor`.
- **Ownership Verification**: Backend re-validates that only the original author can edit or delete a post.
- **Password Security**: Bcrypt (12 rounds) used for all hashing.

---

## 🚀 Performance
- **Pagination**: Every list endpoint is paginated (default 10, max 50).
- **Caching**: `max-age=60` on public feeds and **ETags** on private data like bookmarks.
- **Prisma Transactions**: Atomic updates for `upvoteCount` and `replyCount`.

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Node.js installed
- PostgreSQL database (or Neon/Render URL)

### 2. Environment Variables
Create a `.env` in the `backend/` folder with:
```env
PORT=5000
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secure_secret"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Start Backend
```bash
cd backend
npm install
npx prisma db push # Sync schema
npm run dev
```

---

## 📦 Project Structure Docs
- [API Documentation](file:///Users/sriman/Developer/Projects/forge%20program%20/kalvikonnect/KalviKonnect/Docs/API_DOCS.md)
- [Auth Flow & RBAC](file:///Users/sriman/Developer/Projects/forge%20program%20/kalvikonnect/KalviKonnect/Docs/AUTH_FLOW.md)
- [Security implementation](file:///Users/sriman/Developer/Projects/forge%20program%20/kalvikonnect/KalviKonnect/Docs/SECURITY_NOTES.md)

## Running Costs

KalviKonnect uses OpenRouter with openai/gpt-4o-mini for AI features.
Pricing: ~$0.15 per million input tokens, ~$0.60 per million output tokens.

Per-Request Estimate (Note Summarizer):
- Average input: ~800 tokens (prompt + note content)
- Average output: ~150 tokens
- Cost per request: (800/1,000,000 x $0.15) + (150/1,000,000 x $0.60) = ~$0.00012

Monthly Cost at Scale:
- 200 students x 5 summaries/week = ~4,000 requests/month = ~$0.48
- 200 students x 20 summaries/week = ~16,000 requests/month = ~$1.92
- 500 students x 20 summaries/week = ~40,000 requests/month = ~$4.80

Token usage is logged on every AI call in Render logs under event: ai_token_usage.
