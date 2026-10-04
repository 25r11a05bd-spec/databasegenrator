# 📡 Backend API Documentation

The backend service runs on port `3001` (by default).

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a user in Supabase with pre-verified email.
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ "user": { ... }, "message": "Account created and verified successfully!" }`

### `POST /api/auth/login`
Authenticates a user via Supabase.
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:** `{ "user": { ... }, "session": { ... } }`

### `POST /api/auth/confirm`
Auto-confirms an unconfirmed user via Supabase admin service key.
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
