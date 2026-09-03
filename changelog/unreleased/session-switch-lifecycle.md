---
title: Keep Worktrunk usable across session replacement
type: bugfix
authors:
  - alexshpunt
created: 2026-09-03T22:12:00Z
---

Worktrunk no longer keeps a queued model invocation locked after another extension replaces the active session. Successful worktree moves also report their output through the replacement session instead of using the stale source context.
