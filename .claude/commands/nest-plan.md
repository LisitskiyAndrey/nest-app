---
description: "Produce an implementation plan for a backend task without editing code."
argument-hint: <task, failure, files or check scope>
---

# nest-plan

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

Use nest-analyst only for unresolved requirements, nest-architect for the file-level design, and nest-database for persistence changes when relevant. Pass earlier results forward. Return acceptance criteria, ordered files/steps, API/schema effects, essential tests, verification commands and unresolved decisions. Read-only planning: do not start implementation, write plan files, run builds/tests or change configuration. Stop after the plan unless the user explicitly requested implementation too.
