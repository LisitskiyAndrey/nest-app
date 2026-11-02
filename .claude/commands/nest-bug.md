---
description: "Reproduce and fix a backend defect, then review and verify the regression."
argument-hint: <task, failure, files or check scope>
---

# nest-bug

Request: $ARGUMENTS

Run in the main conversation. Read .claude/workflows/coordination.md and .claude/references/project.md before delegation. Apply the shared scope, handoff, ownership and evidence contracts; this command's read-only constraints override correction/implementation stages where applicable. If arguments and conversation provide no actionable target, ask for the task or scope before launching agents.

1. Capture the observed failure, expected behavior and smallest reproduction from the request/code.
2. Assign nest-debugger the affected files, reproduction and regression-test requirement. Await its evidence and focused fix. If diagnosis is blocked or requires a product/API decision, surface that instead of proceeding as if the bug were fixed.
3. Ask nest-database or nest-architect only when the evidenced cause needs their decision, then resume the debugger with the resolved decision.
4. Review the stable fix with nest-reviewer, route corrections through the bounded loop, and run nest-verifier. Report whether the original failure was reproduced and what now proves the fix.
