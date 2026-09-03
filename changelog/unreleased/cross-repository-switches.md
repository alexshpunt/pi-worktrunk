---
title: Follow switches into another repository
type: bugfix
authors:
  - alexshpunt
created: 2026-09-03T14:30:00Z
---

Pi now follows an explicit Worktrunk switch into another repository when the command uses `-C`. The source session stays available, and the task resumes from a linked session in the selected repository.
