# 🛡️ Security Implementation Notes

## 1. Backend as Single Source of Truth
We enforce all security logic on the backend. Hiding a "Delete" button in the React UI is a usability feature, NOT a security feature. The backend re-validates ownership using `post.authorId === req.user.userId` before every write operation.

## 2. Password Safety
- **Hashing**: Using `bcryptjs` with 12 salt rounds (industry standard).
- **Masking**: The `passwordHash` field is explicitly excluded from all Prisma queries using `select: { password: false }` or explicit inclusion of only safe fields. No endpoint ever returns a password hash.

## 3. Validation Boundary
Input validation via `express-validator` acts as a firewall *before* business logic runs. This prevents malformed data or injection attempts from touching the database.

## 4. Role Enforcement (RBAC)
We never trust `req.body.role`. Roles are extracted from the verified JWT payload, which was signed on the server. This prevents "Role Escalation" attacks where a user might try to pass `role: "CAMPUS_MANAGER"` in a POST request.

## 5. Caching Strategy
- **Public Feed (Notes)**: Cached for 60 seconds (`max-age=60`) to reduce DB load for the most common read path.
- **Personal Data (Bookmarks)**: Uses **ETags** based on `user.updatedAt`. This ensures the client only downloads the list if it has actually changed since the last fetch.
- **Critical Writes**: All `POST`, `PUT`, `PATCH`, and `DELETE` requests bypass all caching to ensure real-time consistency.
