# 📡 Backend API Documentation

The backend service runs on port `3001` (by default).

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a user in Supabase with unconfirmed email and sends a verification email via Resend with responsive HTML formatting.
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ "success": true, "message": "Account created! Please check your email to verify your address.", "requiresVerification": true, "user": { ... } }`

### `POST /api/auth/login`
Authenticates a user via Supabase. If the user's email is unverified, dispatches a fresh verification email via Resend and requires verification.
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response (Verified):** `{ "user": { ... }, "session": { ... } }`
- **Response (Unverified, 403):** `{ "error": "Email not verified...", "code": "EMAIL_NOT_CONFIRMED", "requiresVerification": true }`

### `POST /api/auth/resend-verification`
Dispatches a new HTML verification email via Resend for an unconfirmed user.
- **Body:** `{ "email": "user@example.com" }`
- **Response:** `{ "success": true, "message": "A fresh verification email has been sent to your inbox." }`

### `GET /api/auth/verify`
Verifies user email via confirmation token/hash and redirects to `${APP_URL}/login?verified=true`.
- **Query Params:** `?token=<hash>&email=<email>&type=signup`

### `POST /api/auth/confirm`
Confirms an unconfirmed user directly via Supabase admin service key.
- **Body:** `{ "email": "user@example.com" }`

---

## 2. Database Operations (`/api/database`)

### `POST /api/database/create`
Deploys generated tables directly to Supabase PostgreSQL.
- **Body:** `{ "tables": [...], "userId": "...", "name": "E-Commerce Database" }`
- **Response:** `{ "success": true, "connectionStrings": { ... } }`

### `GET /api/database/history?userId=...`
Fetches all databases created by the user.

### `DELETE /api/database/:id`
Drops table(s) from Supabase PostgreSQL via `DROP TABLE IF EXISTS ... CASCADE;` and deletes the database record.
- **Body:** `{ "tables": [{ "name": "student" }], "userId": "..." }`

### `GET /api/database/connection-string`
Returns connection strings in multiple formats (Direct, Pooler, .env, Prisma).

---

## 3. Groq AI Integration (`/api/groq`)

### `POST /api/groq/parse`
Parses natural language into structured tables and foreign key relationships.
- **Body:** `{ "prompt": "Create an e-commerce database with users, products, orders" }`
- **Response:** `{ "tables": [...], "relationships": [...] }`

### `POST /api/groq/adjust`
Incrementally adjusts an existing schema with a follow-up prompt.
- **Body:** `{ "currentSchema": { ... }, "adjustmentPrompt": "Add a reviews table" }`

---

## 4. Health Check (`/api/health`)

### `GET /api/health`
Returns `{ "status": "healthy", "service": "db-generator-backend" }`.
