---
description: "Review a requested backend diff without changing files or starting implementation."
argument-hint: <task, failure, files or check scope>
---

# nest-review

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

Resolve the review target from the arguments: explicit files, commit/range or PR content available locally. Default to the staged and unstaged tracked working-tree changes; list relevant untracked source/tests separately and read them when needed. Never discard untracked content. Delegate to nest-reviewer with the target and acceptance criteria. Return actionable findings by severity with precise file/line references, limitations and any unverified assumptions. Do not run tests/builds, edit code or start a correction loop in this review-only command.
