# Security Changes and Bugs Fixed

1. **Authorization Bypass (Role Verification)**
   - **Bug**: Previously, endpoints like `/announcements` only checked if an incoming request was authenticated but failed to definitively enforce `CAMPUS_MANAGER` role.
   - **Fix**: Added `roleCheck.js` which verifies `req.user.role`, eliminating capability for Student/Mentor accounts to forge backend POST requests to restricted endpoints.

2. **Information Leakage (Password Hash)**
   - **Bug**: Operations that returned the `user` object directly passed on results of Prisma queries, which implicitly shipped the `passwordHash` variable inside the API payload.
   - **Fix**: Created `utils/userSerializer.js` ensuring strict payload filtering. `passwordHash` is now guaranteed zero-visibility on `/auth/me`, `/auth/register`, and `/auth/login`.

3. **Inconsistent/Leaky Authentication States**
   - **Bug**: Invalid tokens caused 500 errors, and no distinguishing error format allowed the frontend to know whether the token was corrupted or merely expired, leaving `localStorage` cluttered with dead tokens.
   - **Fix**: Updated `auth.js` and `errorHandler.js` to catch `TokenExpiredError` & `JsonWebTokenError` specifically. The frontend `api.js` interceptor now properly captures `401` status codes and cleans `localStorage`, mitigating stale state hazards.

4. **Missing Ownership Enforcement**
   - **Bug**: Some update actions permitted any authenticated user to potentially patch/delete data they didn't author if they had the entity `id`.
   - **Fix**: Integrated ownership constraint matching (`record.authorId !== userId -> 403`) precisely inside the Service layer across Notes, Hackathons, Placements, Discussions, and Bookmarks.
