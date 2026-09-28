# JINSU.DEV Portfolio

Velog-inspired portfolio frontend and BFF. The Kotlin/Spring Boot API is maintained as the independent sibling project `../profile-backend`.

## Runtime shape

```text
Browser → Next.js Server Components / Server Actions → Kotlin API → PostgreSQL
                    ↑ HttpOnly admin token ↓
```

- Next.js owns rendering, form adaptation, route revalidation, and the admin token cookie.
- Spring Boot owns authentication, validation, content use cases, transactions, Flyway migrations, and persistence.
- Zustand owns only temporary backoffice UI state. It is not a content store.
- The browser never receives the Kotlin API base URL or calls it directly.

## Local development

Start the independent backend first:

```bash
cd ../profile-backend
cp .env.local.example .env.local
docker compose --env-file .env.local up --build -d
```

Then configure and run this Next.js project:

```bash
cd ../velog-portfolio
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. The local admin password is `admin`. Backend runtime and migration instructions are documented in `../profile-backend/README.md`.

## Verification

```bash
npm run typecheck
npm run build
```

## Production configuration

Deploy this Next.js project and `profile-backend` as separate services. For this project, copy `KOTLIN_API_URL` from `.env.production.example` into the frontend hosting platform's server environment.

- `KOTLIN_API_URL` is server-only and must not use the `NEXT_PUBLIC_` prefix.
- Backend production variables belong to `profile-backend/.env.production.example`.
- Do not create or commit an actual production env file.

The Kotlin API intentionally has no browser CORS policy. Only the Next.js BFF should call it. Do not expose the local profile in production.
