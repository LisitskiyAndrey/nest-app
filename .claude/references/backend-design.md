# Backend design and implementation conventions

Read for architectural, TypeScript or persistence changes. CLAUDE.md contains the always-on constraints; the existing source and schema determine concrete names and behavior.

## Boundaries and ports

- Presentation owns controllers, HTTP guards/decorators, DTOs, validation, status codes, response presenters and Swagger. Controllers delegate to use cases; no hashing, JWT creation or repository orchestration there.
- Application owns use cases, application services, inputs/results and external capability ports. Do not pass HTTP DTO classes to use cases or import presentation/infrastructure implementations, Express, Prisma Client, concrete JWT libraries or Argon2 into them.
- Preserve the existing Nest dependency injection decorators in application classes. Domain entities, invariants, errors and repository contracts remain independent of frameworks, databases, ConfigService and environment variables.
- Infrastructure implements domain/application contracts: Prisma repositories/mappers, password hashing, token providers, strategies and external clients. Bind implementations through existing injection tokens in Nest modules.
- Introduce ports only for meaningful external boundaries; clocks/IDs are useful when deterministic tests require them. Avoid abstractions without a practical need.
- Use input objects for complex use-case inputs and domain/application results for outputs. Simple arguments are acceptable when already conventional.
- Follow the actual directory structure; no large file moves or architectural rewrite to match an example template.

## Naming and TypeScript

- Prefer responsibility-specific names: `LoginUseCase`, `UserRepository`, `PrismaUserRepository`, `LoginDto`, `UserResponseDto`. Avoid generic Helper/Manager/Utils services.
- Preserve existing `Port` suffixes, tokens and module bindings; do not rename them as incidental cleanup.
- Match existing ESLint/Prettier/import conventions. Use `import type` where appropriate, prefer `const`, avoid `any`, and narrow `unknown` at untrusted boundaries.
- Avoid unsafe casts, unjustified non-null assertions and undocumented TypeScript suppressions. Handle discriminated unions exhaustively; reuse domain constants.
- Keep functions focused; avoid circular dependencies and using `forwardRef` to conceal a boundary problem.
- Inspect actual tsconfig settings instead of assuming strict mode; do not change them for an unrelated task.
- Use existing dependencies first. Before adding a package, justify the need and check its TypeScript fit; place it in the correct dependency section and update the pnpm lockfile only for that dependency change. No incidental major upgrades.

## Persistence

- Prisma belongs in infrastructure. Use the current `prisma/schema.prisma` and existing repository contracts, not hypothetical fields or donor examples.
- Prepare new migrations for explicitly scoped schema changes; preserve applied migrations and generated clients. Applying migrations or generating artifacts requires the relevant authorization and tooling context.
- Use transactions for related operations that must succeed atomically. Analyze concurrency explicitly; sequential success with mocks does not prove race safety.
- Avoid N+1 queries, select required fields, and keep password/token hashes out of public results. Use mappers where needed to preserve domain contracts.
- Paginate potentially unbounded collections and use deterministic ordering. Respect existing pagination types and API compatibility.
- Prefer Prisma query capabilities over raw SQL; parameterize any necessary raw queries.

## Tests and delivery

- Add essential success/failure/regression coverage with implementation. Test observable behavior using repository, hasher, token-provider and external-service doubles for unit tests.
- Add focused Supertest coverage for changed HTTP behavior. Existing HTTP tests use a Prisma double; real repository mappings, constraints and transactions need an isolated integration database.
- Never use production credentials/data for tests. Do not start PostgreSQL or infer database authority from an environment file.
- Keep tests deterministic and independent; cover only relevant risks rather than every possible auth scenario for every task.
- Completion requires implemented criteria, preserved boundaries and compatibility, accurate validation/Swagger, safe responses and applicable tests, lint, format checks and build. Explicitly report every failed, blocked or omitted check.
- Run the narrow relevant check first; see [project.md](project.md) for actual scripts. Review existing dirty changes without attributing them to the current task without evidence.
