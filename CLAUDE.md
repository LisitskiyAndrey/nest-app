# CLAUDE.md

## Project context

This project is a backend application built with TypeScript and NestJS.

The architecture is hybrid:

- top level organization is feature-first
- each feature is internally split into:
  - domain
  - application
  - infrastructure
  - presentation

Claude must preserve these boundaries in every code change.

The goal is not only to make the code work, but to keep the codebase maintainable, predictable, testable, and easy to evolve.

---

## Core principles

1. Prefer feature-first organization over technical-layer-first organization.

Good:

- `src/modules/users/...`
- `src/modules/payments/...`
- `src/modules/auth/...`

Bad:

- `src/controllers/...`
- `src/services/...`
- `src/repositories/...` as global top-level buckets for the whole app

2. Inside each feature, respect architectural boundaries:

- `domain` contains business rules and pure domain logic
- `application` contains use cases and orchestration
- `infrastructure` contains persistence and external integrations
- `presentation` contains HTTP transport layer concerns

3. Always depend inward.

Allowed dependency direction:

- presentation -> application -> domain
- infrastructure -> domain
- infrastructure may be used by application through interfaces/contracts
- domain must not depend on NestJS, databases, HTTP, Prisma, TypeORM, queues, or third-party transport concerns

4. Keep NestJS framework concerns out of domain logic whenever possible.

5. Controllers must stay thin.
   Controllers handle request/response mapping and delegate work to application layer use cases.

6. Repositories are infrastructure concerns.
   Do not put direct database access in controllers or in presentation layer.

7. DTOs are transport models.
   Do not use DTOs as domain entities.

8. Favor explicit naming and explicit mappings over "magic".

9. Prefer simple, obvious code over clever abstractions.

10. Do not introduce cross-feature coupling without a clear reason.

---

## Preferred project structure

Use this structure as the default unless the current feature already follows a compatible variant:

```txt
src/
  main.ts
  app.module.ts

  core/
    config/
    common/
    database/
    auth/
    logger/

  modules/
    users/
      domain/
        entities/
        value-objects/
        services/
        events/
        repositories/
      application/
        use-cases/
        commands/
        queries/
        dto/
        mappers/
      infrastructure/
        persistence/
        repositories/
        adapters/
      presentation/
        http/
          controllers/
          dto/
          presenters/
        graphql/
        message-patterns/
      users.module.ts

    payments/
      domain/
      application/
      infrastructure/
      presentation/
      payments.module.ts
```
