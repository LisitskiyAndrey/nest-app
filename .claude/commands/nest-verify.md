---
description: "Run selected existing backend checks without repairing failures."
argument-hint: <task, failure, files or check scope>
---

# nest-verify

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

Delegate to nest-verifier with the requested check scope and current changed paths. Default to unit tests, lint, format:check and build; add HTTP e2e when HTTP/auth behavior is affected. Inspect test setup, installed tooling and permissions first. Report exact commands, exit results, omitted/blocked checks and test-double versus real-database coverage. Do not edit source/config, install tools, repair failures or launch an implementation pipeline.
