---
description: "Implement a small, clearly scoped backend change and verify it."
argument-hint: <task, failure, files or check scope>
---

# nest-quick

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

1. Confirm the request is local and explicit. State criteria directly; do not launch analysis roles for a trivial change.
2. Assign nest-developer a narrow change plus essential tests, then await completion.
3. If inspection reveals a new public contract, auth-policy decision, schema change or cross-module design uncertainty, pause dependent writes and propose the feature route with the concrete unresolved decision. Do not silently grow this route.
4. Run nest-verifier for focused tests and relevant static/build checks. Add nest-reviewer for auth/security-sensitive changes or when requested. Report scope and any checks omitted with reasons.
