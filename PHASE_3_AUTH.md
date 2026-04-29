# Phase 3: Authentication System

Custom JWT-based authentication for PIDEC 1.0 platform. Complete implementation of login, register, refresh, and logout flows with HTTP-only cookies and bcrypt password hashing.

## Architecture

### Backend (Express + TypeScript)

**Directory Structure:**

```
apps/api/src/
├── infrastructure/auth/
│   ├── jwt.ts          # JWT token generation and verification
│   └── password.ts     # bcryptjs password hashing
├── domain/
│   ├── repositories/auth-repository.ts  # Database queries for auth
│   └── services/auth-service.ts         # Business logic (register/login/verify)
└── presentation/
    ├── controllers/auth-controller.ts   # HTTP request handlers
    └── routes/auth.ts                  # Express routes
```

**Key Components:**

1. **JWT Utilities** (`infrastructure/auth/jwt.ts`)
   - `generateAccessToken()` — Create 15-minute access token
   - `generateRefreshToken()` — Create 7-day refresh token
   - `verifyToken()` — Verify and decode JWT (throws on invalid)
   - Uses `SUPABASE_SERVICE_ROLE_KEY` as JWT secret

2. **Password Hashing** (`infrastructure/auth/password.ts`)
   - `hashPassword()` — Bcrypt hash with 10 salt rounds
   - `verifyPassword()` — Compare plain-text against hash

3. **Auth Service** (`domain/services/auth-service.ts`)
   - `register()` — Create new user (validates email, password, name)
   - `login()` — Authenticate user (verifies password, returns tokens)
   - `verifyEmail()` — Mark user as verified (email verification flow)

4. **Auth Controller** (`presentation/controllers/auth-controller.ts`)
   - `POST /auth/register` — Public: register with email/password/name/role/matric/dept/level
   - `POST /auth/login` — Public: login with email/password
   - `POST /auth/refresh` — Public: refresh access token
   - `POST /auth/logout` — Protected: clear cookies
   - `GET /auth/me` — Protected: get current user info

5. **Auth Middleware** (`presentation/middleware/auth.ts`)
   - `requireAuth()` — Verify JWT access token from cookie or Authorization header
   - `requireRole(...roles)` — Guard routes by user role (student/admin/judge)

### Frontend (Next.js + React)

**Components & Utilities:**

1. **Auth Client** (`apps/web/src/shared/lib/auth-client.ts`)
   - `AuthApiClient` class wraps auth endpoints
   - `authClient.login(email, password)` — Authenticate
   - `authClient.register(data)` — Create account
   - `authClient.refresh()` — Refresh token
   - `authClient.logout()` — Logout
   - `authClient.getMe()` — Get current user

2. **Admin Login Form** (`apps/web/src/app/admin/login/form.tsx`)
   - Email + password input fields
   - Client-side validation
   - Error display with Alert component
   - Loading state during submission
   - Redirects to `/admin` on success
   - Role check: only admins can access admin console

## Database Schema Updates

Migration `0018_custom_auth_admin_seed.sql` provides:

1. **Removed Auth.users FK Constraints**
   - `public.users.id` no longer requires auth.users.id
   - `public.judges.id` now FKs to `public.users.id` (was auth.users)

2. **Added password_hash Column**
   - `public.users.password_hash: text` — bcrypt hash storage
   - Nullable (for email-only accounts in future)

3. **Single-Admin Constraint**
   - `idx_users_single_admin` — Unique index on (role) WHERE role='admin' AND deleted_at IS NULL
   - Ensures only one non-deleted admin account exists

4. **Seed Function**
   - `seed_initial_admin(email, bcrypt_hash, name)` — Create or update admin account
   - Idempotent: safe to re-run; updates on email collision

## Deployment & Testing

### 1. Run Migration

```bash
# Via Supabase CLI or SQL editor
-- Execute migration 0018 first
-- Then seed admin account:

select public.seed_initial_admin(
  'admin@pidec.com.ng',
  crypt('YOUR_STRONG_PASSWORD', gen_salt('bf', 10)),
  'PIDEC Platform Admin'
);

-- Verify admin account created
select id, email, role, name, password_hash is not null as has_password
from users
where role = 'admin' and deleted_at is null;
```

### 2. Environment Variables

**Backend** (`.env` in `apps/api`):

```env
SUPABASE_SERVICE_ROLE_KEY=<project-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
CORS_ORIGIN=http://localhost:3000
COOKIE_DOMAIN=localhost  # Set to .pidec.com.ng in production
NODE_ENV=development
```

**Frontend** (`.env.local` in `apps/web`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 3. Local Testing Flow

```bash
# Terminal 1: Start backend
cd apps/api
pnpm dev
# Listens on http://localhost:4000

# Terminal 2: Start frontend
cd apps/web
pnpm dev
# Listens on http://localhost:3000

# Browser: Navigate to http://localhost:3000/admin/login
# Use seeded admin credentials
```

**Test Cases:**

1. ✅ Admin login with correct credentials → redirect to `/admin`
2. ✅ Admin login with wrong password → error: "Invalid email or password"
3. ✅ Admin login with non-existent email → error: "Invalid email or password"
4. ✅ Non-admin user login (student) → error: "Only administrators can access..."
5. ✅ GET /auth/me (protected) without token → 401 Unauthorized
6. ✅ POST /auth/logout (protected) → clear cookies
7. ✅ POST /auth/refresh with expired token → 401
8. ✅ POST /auth/register validation → reject weak passwords, invalid emails

### 4. Token Flow Diagram

```
User submits email/password
         ↓
POST /auth/login (validate + hash comparison)
         ↓
Generate JWT pair (access: 15min, refresh: 7day)
         ↓
Set HTTP-only cookies (access-token, refresh-token)
         ↓
Browser includes cookies in subsequent requests
         ↓
requireAuth middleware verifies access token
         ↓
Attach req.user { id, email, role }
```

### 5. Cookie Security

- **Access Token Cookie:**
  - Name: `access-token`
  - HttpOnly: true
  - Secure: true (production only)
  - SameSite: Strict
  - MaxAge: 15 minutes

- **Refresh Token Cookie:**
  - Name: `refresh-token`
  - HttpOnly: true
  - Secure: true (production only)
  - SameSite: Strict
  - MaxAge: 7 days

## Role-Based Routing

Use `requireRole()` middleware to protect routes:

```typescript
// Admin-only routes
router.delete('/admin/users/:id', requireAuth, requireRole('admin'), adminController.deleteUser);

// Admin or Judge routes
router.get('/scores', requireAuth, requireRole('admin', 'judge'), scoreController.list);

// All authenticated users
router.get('/profile', requireAuth, profileController.getMe);
```

## Extending Authentication

### Email Verification (Phase 4)

1. Send verification email on register
2. `POST /auth/verify-email` endpoint with token
3. Calls `authService.verifyEmail(userId)` to set `email_verified_at`

### Password Reset (Phase 4)

1. `POST /auth/forgot-password` — send reset email with token
2. `POST /auth/reset-password` — validate token, update password

### OAuth Integration (Future)

1. Add GitHub/Google login endpoints
2. Map OAuth user to local `users` table
3. Allow account linking

## Known Limitations

1. **No Email Verification Yet** — Accounts auto-verified on register (Phase 4)
2. **No Refresh Token Rotation** — Same refresh token valid for 7 days (Phase 4+)
3. **No Rate Limiting per Endpoint** — Global rate limit exists (Phase 4)
4. **No Session Management** — No ability to list/revoke sessions (Phase 5)

## API Response Format

All auth endpoints return standard `ApiResponse<T>`:

```typescript
// Success
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@pidec.com.ng",
      "name": "Admin Name",
      "role": "admin"
    }
  }
}

// Error
{
  "status": "error",
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

## What's Next (Phase 4+)

1. ✅ Phase 3 Complete: Custom JWT auth + admin login form
2. 📋 Phase 4: Email verification, password reset, registration UX
3. 📋 Phase 5: Admin dashboard, user management, session controls
4. 📋 Phase 6: Judge/student dashboards, submission flows
