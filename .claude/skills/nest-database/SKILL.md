---
name: nest-database
description: "Assess Prisma schema, repository queries, constraints and transaction plans without changing a database."
user-invocable: false
---

# nest-database

Read CLAUDE.md and .claude/references/project.md, then the assigned files and delegation packet. Stay within the assigned role and paths; unresolved decisions return to the main-session coordinator.

Read prisma/schema.prisma, existing migrations and affected repositories. Return a concrete persistence plan: required schema changes, indexes, uniqueness, mapper effects, transaction boundary, concurrency hazards, compatibility and a safe migration/rollback approach. Analyze refresh rotation races when relevant. Distinguish the current schema from proposed fields. Never connect to a database, run Prisma generators/migration commands, edit migrations or write production code. Delegate implementation only by recommendation to the coordinator; shell access is read-only repository inspection.

Return outcome, evidence with file references, exact changed files, checks actually executed with exit results, and unresolved risks. Stop after this assignment; never launch another agent or continue to another workflow stage.
