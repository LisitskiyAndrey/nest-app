# my-nest-app context

Read the repository's existing CLAUDE.md and affected code first. This file records observed starting points, not permission to rewrite the application. Re-check package.json and schema when making decisions.

- Package manager: pnpm (packageManager currently pnpm@11.0.8). Never silently switch managers, install dependencies, or change lockfiles for an unrelated task.
- NestJS 11, Prisma 7 with PostgreSQL, Passport/JWT, Argon2, class-validator/class-transformer, Swagger, Jest/Supertest.
- Modules: src/modules/auth and src/modules/users. Layers: presentation/http, application/use-cases and ports, domain, infrastructure. Tokens and module wiring follow neighboring code.
- Shared configuration/database/errors: src/app/. Shared DTOs and pagination: src/shared/.
- Prisma schema: prisma/schema.prisma. Generated client: src/generated/prisma; do not hand-edit it. Preserve existing migrations.
- Existing application use cases use Nest dependency injection decorators. Preserve that established convention; do not introduce a framework-purity refactor. Keep domain independent of Nest/Prisma, controllers thin, persistence in infrastructure, and Prisma out of use cases.
- RefreshSession currently stores id, userId, tokenHash, expiresAt, createdAt; do not assume a revokedAt column. Session rotation and concurrent refresh require explicit atomicity analysis.
- API errors are normalized through src/app/errors/. Inspect its actual filter and error mapper before adding errors. Inspect src/main.ts and existing controllers for validation, cookies, CORS and Swagger behavior.
- Unit specs live beside source (\*.spec.ts). HTTP e2e: test/app.e2e-spec.ts with test/jest-e2e.json. That suite currently overrides PrismaService with in-memory doubles: passing it does not prove database constraints, transactions or concurrent behavior.
- tsconfig.json uses nodenext and path aliases. Follow neighboring imports; do not assume strict:true or change compiler options as incidental cleanup.

## Existing checks

Run from the repository root using the existing installed toolchain:

- Focused unit: pnpm run test -- --runInBand --runTestsByPath <spec-path> (check local Jest argument forwarding; use pnpm exec jest --runInBand --runTestsByPath <spec-path> if needed).
- Unit suite: pnpm run test --runInBand.
- HTTP e2e: pnpm run test:e2e --runInBand; inspect setup before execution. It may require local socket permissions, but its current Prisma double does not require starting PostgreSQL.
- Lint: pnpm run lint (eslint ., without autofix).
- Format check: pnpm run format:check (without writes).
- Build: pnpm run build (writes dist and potentially incremental compiler artifacts).
- Do not use lint:fix or format for read-only verification. Never format the whole repository for a scoped change.
- Database integration tests require a confirmed isolated test database. Do not start Docker, migrate or use a database inferred from .env automatically.

## Boundaries

Do not read or print .env values or credentials. Do not touch ../my-users-app unless the user expands scope. No database resets, migration application, deployment, git commits/pushes or destructive commands are authorized by these workflows. Follow existing runtime permissions; do not bypass them. A migration file may be prepared for an explicitly requested schema change; applying it is a separate action.

## Library documentation MCP

Context7 is configured in `.mcp.json` using the official HTTP endpoint. Technical agents preload `nest-library-docs` and have access to its two documentation tools. Consult [mcp.md](mcp.md) for approval, diagnostics, version matching and information boundaries. Use actual installed package versions; resolve them afresh rather than treating this reference as a version lock. Analyst/verifier roles do not need documentation tools; forward API-evidence gaps to the coordinator.
