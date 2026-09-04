---
title: Keep Worktrunk usable across session replacement
type: bugfix
authors:
  - alexshpunt
created: 2026-09-03T22:12:00Z
---

Worktrunk no longer keeps a queued model invocation locked after another extension replaces or reloads the active session. A new model invocation now replaces an orphaned queued invocation instead of failing with “Another model-triggered Worktrunk invocation is still pending”; the superseded internal command is ignored if it arrives late. Commands that cannot move the Pi session, including `wt step commit`, now run in the current model turn instead of waiting for a queued follow-up. Successful worktree moves report their output through the replacement session, and commands interrupted by a reload no longer try to report through the stale source context.
