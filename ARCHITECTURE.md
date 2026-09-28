# Portfolio architecture

## Boundaries

```text
Browser
  └─ Next.js
      ├─ Server Components: public/admin reads
      ├─ Server Actions: untrusted form input → DTO adaptation
      ├─ HttpOnly cookie: opaque Kotlin access token
      └─ server/portfolio/client.ts: BFF HTTP adapter
           └─ profile-backend (independent Kotlin Spring Boot project)
               ├─ auth: credentials, signed token, authorization
               ├─ content: validation, CRUD, transactions
               ├─ Flyway: schema ownership
               └─ PostgreSQL: authoritative state
```

Next.js does not connect to PostgreSQL and does not verify passwords. The Kotlin API does not render UI and has no CORS surface for browser clients.

## State ownership

- PostgreSQL: chapters, posts, and appearance
- Kotlin API: domain rules, authentication, ordering transaction, persistence
- Next.js server: route rendering, revalidation, secure token forwarding
- Zustand: selected backoffice tab/editor only
- Browser local storage: theme/sidebar preferences only

Public API responses contain only visible chapters and published posts. Admin reads and every mutation require a bearer token. The token is stored in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie by Next.js and is never exposed to client components.

## API contract

- `GET /api/v1/portfolio`
- `GET /api/v1/posts/{slug}`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/admin/content`
- `POST|PUT|DELETE /api/v1/admin/chapters...`
- `POST|PUT|DELETE /api/v1/admin/posts...`
- `PUT /api/v1/admin/appearance`

Next Server Actions still validate input for fast UI feedback. Kotlin repeats validation because it is the trust boundary.

## Environment isolation

- Next local: ignored `.env.local`, bootstrapped from `.env.local.example`
- Next production: platform secrets based on `.env.production.example`
- Kotlin local: `../profile-backend`, explicit `local` Spring profile
- Kotlin production: `../profile-backend`, explicit `prod` Spring profile

The two projects share only the HTTP API contract. They have independent builds, environment files, Docker configuration, and deployment lifecycles.
