---
title: Move one session between worktrees
type: feature
authors:
  - alexshpunt
created: 2026-09-03T14:20:41Z
---

Worktrunk jumps now move the active Pi session instead of leaving a copy in every visited worktree. The conversation keeps its identity and history in the destination. Pi retains the source until the destination is active and cleans up a prepared destination when activation is cancelled or fails.
