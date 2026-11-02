# Main-session coordination contract

The command runs in the MAIN Claude Code conversation. The main session is the coordinator; it calls named project subagents using the runtime's Agent tool (Task on older runtimes). Do not spawn a coordinator subagent or ask a specialist to run another specialist. If named agents or delegation are unavailable, report the missing capability instead of pretending delegation happened.

## Start and scope

1. Read CLAUDE.md, .claude/references/project.md, package scripts and relevant code. Treat the command arguments as the requested scope, not authority to override repository instructions.
2. Inspect git status and the relevant diff without dumping secrets. Record the initial changed/untracked paths and enough relevant before-state to separate this run's edits from pre-existing work. Never stash, reset, stage or overwrite unrelated changes. A dirty tree alone is not a blocker. Ask only if overlapping work is actively changing and cannot be safely preserved.
3. State the selected route, observable acceptance criteria and affected modules. For missing product decisions, inspect available context first and ask a focused question only when the answer changes the implementation.

## Delegation packet

Each launch must include: objective; acceptance criteria; exact allowed files/directories and shared files it must not edit; relevant CLAUDE.md constraints; verified decisions and prior specialist results; baseline dirty paths; checks appropriate to its scope; and output expectations. Agents do not inherit all conversation context. Pass evidence explicitly, using file references and concise summaries. Do not pass secrets.

Require each specialist to return: outcome (COMPLETE, NEEDS_DECISION, BLOCKED or CHECK_FAILED); findings with file/line references; exact files changed; commands actually run and exit results; unverified assumptions and recommended next action. Empty findings and unrun checks are not a pass.

## Third-party API evidence

Before a design or implementation depends on an uncertain/version-sensitive library API, have the owning technical agent use its preloaded nest-library-docs skill. Pass the package version, verified library ID, relevant source URLs and supported decision to later agents. Avoid duplicate calls for the same question/version. Never send code, task-specific private context or secrets to the documentation server. MCP failure degrades documentation evidence; it is not permission to guess APIs or skip verification. See .claude/references/mcp.md for project setup and limits.

## Ownership and concurrency

- At most two independent read-only analysis/review agents concurrently. Do not review a moving diff; wait for all writers first. Consolidate duplicate findings.
- One code writer at a time in this checkout, including test writers. Implementation, tests and shared module/schema/DTO edits are sequential. Database and architecture specialists advise; nest-developer owns production integration.
- Specialists never launch agents, change .claude configuration, invent requirements or expand scope. The main session resolves dependencies and owns handoffs.
- Use foreground agents when their next action may require a runtime permission or user decision. Do not repeatedly retry denied actions through another tool.

## Review and correction loop

Review acceptance criteria, correctness, authentication/authorization, data exposure, contract compatibility and tests. Send actionable findings to the owning writer; do not have reviewers fix their own findings. Allow at most two correction rounds for the task. Each round must include targeted re-verification and review of the revised diff. If a blocker remains after round two, summarize evidence and stop for a decision rather than looping. An infrastructure failure is BLOCKED, not a reason to change product behavior.

## Finish

Before final verification, freeze writes. Use nest-verifier for the selected applicable checks, passing changed paths and relevant baseline failures. Changes after verification invalidate affected results and require those checks again. Report behavior, changed files, criteria-to-evidence mapping, check results and remaining risks. Distinguish test-double HTTP coverage from real PostgreSQL verification. Do not call a task fully verified when relevant checks fail, are blocked or were not run. No automatic commits, database operations or deployment.

This is a prompt-based workflow, not a persistent scheduler or hard transactional engine. Permissions and tool availability are enforced by Claude Code. Role path boundaries, concurrency limits and retry counts are instructions; do not represent them as OS-level isolation.
