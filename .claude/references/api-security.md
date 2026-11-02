# API, authentication and security conventions

Read when changing auth, HTTP contracts, validation, error mapping or configuration. Use the actual controllers, ports, schema and startup configuration as evidence; examples from previous instructions are not feature requirements.

## Access and refresh tokens

- Access tokens authorize requests through the existing Passport JWT strategy and Bearer header conventions. Keep their lifetime short and payload minimal; do not add persistent access-token storage without a requirement.
- Never put passwords, hashes, refresh tokens or unnecessary personal data in JWT payloads. Keep secrets and TTL configuration external and validated at startup.
- Refresh tokens belong to refresh sessions, are used only to obtain a new pair, and must be stored only as hashes. Use the existing password-hasher/token-provider boundaries.
- Refresh must verify the token, resolve its session, validate the hash and expiration/revocation represented by the actual schema, invalidate the previous session and create the replacement pair. Use atomic persistence when replacement must succeed together; consider concurrent reuse.
- Current RefreshSession fields are `id`, `userId`, `tokenHash`, `expiresAt`, `createdAt`; do not invent `revokedAt`, user-agent or IP fields.
- Logout invalidates the requested session. Do not introduce logout-all or other new modes unless requested.
- Passwords use Argon2 through the existing port. No plaintext storage/logging, manual password comparison or general-purpose hashing substitutes.

## DTOs and HTTP documentation

- Represent HTTP input with DTO classes validated by class-validator. Keep DTOs in presentation; do not use Prisma models as request DTOs or pass DTO classes into use cases.
- Optional input fields require both TypeScript optional syntax and `@IsOptional()`. Make transformations explicit, and distinguish an omitted PATCH field from an explicitly supplied value.
- Preserve existing global validation settings and response presenters. Review all returned fields for sensitive data; do not blindly return Prisma records.
- Swagger is served at `/docs`. When endpoint DTOs, response shape, auth or status changes, update its Swagger metadata in the same change.
- Use applicable operation, body, param/query, auth and response decorators; document actual behavior and errors rather than speculative contracts.

## Errors and configuration

- Use explicit existing domain/application errors for expected failures; map them through the established presentation/global exception filter in `src/app/errors`.
- No HTTP exceptions in domain. Preserve the normalized error envelope and avoid catch-and-rethrow without added handling.
- Public errors must not reveal stack traces, Prisma details, database constraint names, SQL, secrets or filesystem paths. Use generic auth errors when detail would enable account enumeration.
- Preserve Helmet, CORS, throttling, JWT guards, global validation, environment validation and response sanitization. Do not weaken security just to pass tests or make protected routes public without an explicit requirement.
- Centralize typed, validated configuration through the existing ConfigModule/ConfigService pattern. Inspect actual variable names and validation; do not introduce hypothetical variables or scattered direct environment access.
- Never read/expose `.env` values without explicit need and approval, commit secrets, log passwords/full tokens, or return password/refresh-token hashes.

## Relevant evidence

For affected auth changes, cover applicable registration/login, refresh expiry/reuse, logout, missing users/sessions, invalid tokens and unauthorized access. Include HTTP validation/error-shape and sensitive-field assertions where relevant. Database atomicity and constraints need real isolated persistence evidence; a successful mocked HTTP test is insufficient.
