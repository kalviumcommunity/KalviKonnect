# Authentication Flow (Milestone 6)

## Registration Flow
1. **Frontend**: User fills out Name, Email, Role, and Password (min 8 characters).
2. **Frontend Validation**: `react-hook-form` ensures inputs are valid.
3. **Backend Route**: `POST /auth/register`
4. **Backend Validation**: `express-validator` middleware checks everything. If invalid, returns 400.
5. **Service**: `authService.register` checks if email exists. If so, throws 409 Conflict.
6. **Hashing**: Password is hashed via `bcryptjs` with saltRounds: 12.
7. **Storage**: User created in PostgreSQL via Prisma.
8. **Token**: JWT created with `{ userId, role, email }` payload, expiring in 7 days.
9. **Response**: Returns `{ id, name, email, role, universityId, token }`. `passwordHash` is intentionally excluded via `userSerializer`.

## Login Flow
1. **Frontend**: User submits Email and Password.
2. **Backend Route**: `POST /auth/login`
3. **Validation**: Email and password presence checked.
4. **Service**: `authService.login` looks up user.
5. **Comparison**: Password verified against DB hash using `bcrypt.compare()`.
6. **Error Case**: If user missing or password mismatch, returns 401 "Invalid credentials".
7. **Success**: Returns `{ id, name, email, role, universityId, token }` with token.

## Token Verification
1. **Interceptor**: Frontend attaches `Authorization: Bearer <token>` to request.
2. **Middleware**: Backend `auth.js` intercepts Request.
3. **Absence**: Returns 401 "Authentication required" if missing.
4. **Expiration**: `TokenExpiredError` caught, returns 401 "Token expired, please log in again".
5. **Invalid**: `JsonWebTokenError` caught, returns 401 "Invalid token".
6. **Grant**: Attaches `{ userId, role, email }` payload to `req.user` and proceeds to feature controllers.
