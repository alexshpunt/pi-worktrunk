---
title: Follow switches into another repository
type: bugfix
authors:
  - alexshpunt
created: 2026-09-03T14:30:00Z
---

Pi now follows an explicit Worktrunk switch into another repository when the command uses `-C`. The task resumes from the same session in the selected repository. When Pi completes the move itself, it also hides Worktrunk's shell auto-cd warning while preserving the rest of the command output.
