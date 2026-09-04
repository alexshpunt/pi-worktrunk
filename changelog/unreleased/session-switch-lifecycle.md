---
title: Keep Worktrunk usable across session replacement
type: bugfix
authors:
  - alexshpunt
created: 2026-09-03T22:12:00Z
---

Worktrunk no longer keeps a queued model invocation locked after another extension replaces or reloads the active session. Successful worktree moves report their output through the replacement session, and commands interrupted by a reload no longer try to report through the stale source context.
