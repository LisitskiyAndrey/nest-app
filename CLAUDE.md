# my-nest-app

NestJS 11 REST API: TypeScript, Prisma 7/PostgreSQL, Passport/JWT, Argon2, Swagger, Jest/Supertest.
Scope: auth, refresh sessions and users. Use pnpm; inspect current scripts and neighboring code first.

## Architecture

- Modules: `src/modules/auth` and `src/modules/users`; shared infrastructure: `src/app`, shared types: `src/shared`.
- Keep controllers thin; HTTP DTOs/validation/Swagger in presentation, orchestration in application, persistence/security adapters in infrastructure.
- Keep domain independent of NestJS, Prisma, HTTP and environment access; preserve existing Nest DI in application classes.
- Use existing ports/tokens and module bindings; never access Prisma from controllers or use cases.
- Preserve API compatibility and local conventions; avoid unrelated refactors, dependencies and compiler/config changes.

## Safety and data

- Never read or expose `.env` values without explicit need and approval; never commit secrets or log credentials/tokens.
- Use Argon2 through the password-hasher port; store only refresh-token hashes and rotate refresh sessions.
- Preserve authentication, authorization, validation, throttling, Helmet and CORS; sanitize responses and errors.
- Schema: `prisma/schema.prisma`; migrations: `prisma/migrations`; never hand-edit `src/generated/prisma` or applied migrations.
- No database reset/truncation, destructive Git commands, migration application, service startup or deployment without explicit authorization.
- Preserve staged/unstaged work; no automatic commits, pushes, whole-repository formatting or unrelated lockfile changes.

## Workflow

- Read the affected code, tests and relevant references below before editing; implement the smallest coherent change with essential tests.
- Use `/nest-feature`, `/nest-bug`, `/nest-quick`, `/nest-plan`, `/nest-review` or `/nest-verify` for the corresponding workflow.
- The main session coordinates named subagents; pass scope, criteria, file ownership and prior results explicitly.
- One writer at a time; parallelize only independent read-only analysis. Review stable diffs; allow at most two correction rounds.
- Follow [coordination](.claude/workflows/coordination.md) when delegating; stop dependent work on unresolved decisions.

## Verification and completion

- Run focused tests first, then applicable `pnpm run test --runInBand`, `pnpm run test:e2e --runInBand`, `pnpm run lint`, `pnpm run format:check`, `pnpm run build`.
- Use existing installed tools; no automatic installs or autofix. Build writes artifacts; respect runtime permissions.
- For version-sensitive library APIs, use Context7 for the installed version; follow [.claude/references/mcp.md](.claude/references/mcp.md), disclose evidence gaps, and never send project code or secrets.
- Current HTTP e2e mock Prisma; they do not prove PostgreSQL constraints, transactions or concurrent behavior.
- Report changed files, implemented behavior, actual check results and unverified risks; never claim unrun checks passed.

## Read on demand

- Layout, check commands and test setup: [.claude/references/project.md](.claude/references/project.md).
- Layer boundaries, ports, naming, TypeScript and persistence: [.claude/references/backend-design.md](.claude/references/backend-design.md).
- Auth, tokens, DTOs, Swagger, errors and configuration: [.claude/references/api-security.md](.claude/references/api-security.md).
- Workflow usage and role catalog: [.claude/README.md](.claude/README.md).
