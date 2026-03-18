# 🔐 Auth Flow & Security Architecture

## 1. Authentication Lifecycle
- **Registration**: User provides Kalvium email, password, and university context. Password hashed via **bcryptjs** (salt=12).
- **Login**: Credential verification → issuance of **JWT** (7-day expiry).
- **Token Usage**: Handled via `Authorization: Bearer <token>` header.

## 2. Public vs. Protected Endpoints
| Public | Protected (Auth Only) | Restricted (RBAC/Ownership) |
| :--- | :--- | :--- |
| GET /notes | POST /notes | PUT/DELETE /notes (Owner) |
| GET /notes/:id | GET /placements | PATCH /hackathons (Owner) |
| GET /announcements | POST /upvotes | POST /announcements (Manager Only) |
| POST /auth/login | GET /bookmarks | DELETE /bookmarks (Owner) |

## 3. Role-Based Access Control (RBAC) Table
| Role | Can Post Notes | Can Post Experiences | Can Post Announcements |
| :--- | :--- | :--- | :--- |
| **Student** | ✅ | ✅ | ❌ |
| **Mentor** | ✅ | ✅ | ❌ |
| **Campus Manager** | ❌ (View Only) | ❌ (View Only) | ✅ |

## 4. Token Expiry & Refresh
Currently handled by a single long-lived access token (7d). If the token is expired, the backend returns a mandatory `401 Token Expired` status, signaling the client to redirect to the login page.
