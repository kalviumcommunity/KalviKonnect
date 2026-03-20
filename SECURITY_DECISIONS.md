# Security Decisions (Milestone 6)

## Identity Is Not Trust
- **Bcrypt (12 rounds)**: Prevents brute-force or rainbow table attacks on leaked databases. 12 rounds is chosen for a good performance-security balance in 2024.
- **Consistent Error Messages**: Login failure intentionally returns `401 "Invalid credentials"` rather than revealing whether the user exists ("User not found") to prevent username enumeration attacks.
- **Data Serialization**: By implementing `userSerializer`, we ensure that Prisma query results containing `passwordHash` are stripped before responding. A zero-tolerance policy applies to leaking hashes.

## Tokens Are Contracts
- **Stateless Verification**: JWTs carry `{ userId, role, email }` directly. Verification is immediate and lightweight without needing a database hit for every protected POST/PUT request.
- **Expiration**: JWTs are strictly limited to `7d` in `JWT_SECRET`. This limits the attack window if a token is stolen while retaining usability.
- **Strict Error Handling**: We discern between `TokenExpiredError` and `JsonWebTokenError` and appropriately return `401` in both, so the frontend router handles context clearing securely.

## Logged In Is Not Allowed (RBAC)
- **Centralized Middleware**: A factory middleware `roleCheck(['CAMPUS_MANAGER'])` strictly checks `req.user.role`. This enforces authorization over routing endpoints so backend controllers don't duplicate authorization paths.
- **Backend Enforced**: We do not rely entirely on the frontend to hide a button. `POST /announcements` strictly checks server-side context.
- **Ownership Validation**: For `PUT/PATCH/DELETE` operations in discussions, placements, hackathons, and notes, the service definitively checks `record.authorId === userId` to return `403 Access Denied`.

## Happy Paths Don't Count
- **Database Level Uniqueness**: Duplicate operations like upvotes and bookmarks use `@@unique` in Prisma. This ensures zero race-conditions and guarantees `P2002` correctly produces `409 Conflict`.
- **401 vs 403 Distinction**: `401` enforces *authentication* (who are you?) while `403` enforces *authorization* (can you do this?). The exact distinction drives accurate frontend responses: `401` triggers `LOGOUT` and clears `localStorage`, whereas `403` produces an access denied toast warning the user without breaking session state.
