---
description: "Deliver a backend feature through scoped analysis, implementation, review and verification."
argument-hint: <task, failure, files or check scope>
---

# nest-feature

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

1. Resolve requirements with nest-analyst when the request is ambiguous or spans multiple behaviors; otherwise write acceptance criteria directly from the explicit request.
2. Use nest-architect for new endpoints, cross-module changes, public contract decisions or significant dependency boundaries. Use nest-database when schema, queries, transaction behavior or persistence concurrency changes. Independent read-only design analyses may run concurrently; reconcile their conclusions before writing. Skip specialists whose decisions are already resolved by code and the request.
3. Give nest-developer the agreed design, essential test requirements and a bounded file assignment; await completion.
4. Use nest-tester only when meaningful coverage remains beyond essential tests, after the developer finishes. It owns tests only.
5. Review the stable change with nest-reviewer. Route actionable findings through the bounded correction loop.
6. Run nest-verifier for the applicable checks, then report the outcome. A blocked decision or unapproved database action stops only dependent work; do not invent a workaround.
