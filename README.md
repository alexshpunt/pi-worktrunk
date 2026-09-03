# 🚦 pi-worktrunk

A [Pi](https://pi.dev) extension that runs Worktrunk commands, moves the active
session with worktree changes, and reports Pi status in `wt list`.

## 🚀 Installation

```sh
pi install npm:pi-worktrunk
```

## ✨ Usage

`/wt` accepts the same arguments as the `wt` CLI:

```text
/wt list
/wt switch main
/wt switch --create fix/parser
/wt switch -C ../other-repository @
/wt land
/wt config show
```

Pi passes arguments directly to Worktrunk. Worktrunk flags and configured aliases
work without extension-specific syntax.

Two bare commands open compact Pi interfaces:

- `/wt list` opens the worktree inspector.
- `/wt switch` opens the worktree picker and moves to the selected worktree.

After other successful commands, Pi moves when Worktrunk reports a destination
or creates exactly one worktree. An explicit `-C` also lets Pi follow a switch
into another repository. When Pi completes the move, it hides Worktrunk's shell
auto-cd warning and keeps the rest of the command output. If the command removes
the current worktree, Pi recovers in a surviving worktree. Pi stays put when no
unique destination can be identified or when a command fails without removing
the current worktree.

Each successful move transfers the active Pi session to the destination. The
conversation keeps its session identity and history, while the source file is
removed so repeated jumps leave one session in `/resume`. If destination
activation is cancelled or fails, Pi keeps the source and removes the prepared
destination copy.

### 🏷️ Worktrunk aliases

Configured aliases pass directly through `/wt`:

```text
/wt land
/wt deploy staging
```

Model calls run configured aliases and other Worktrunk commands without an
additional Pi confirmation. Worktrunk continues to enforce its own safety checks
and project-command approvals.

## 🚦 Status markers

The extension maps Pi lifecycle events to Worktrunk branch markers:

- `session_start` sets `💬`.
- `agent_start` sets `🤖`.
- `agent_end` restores `💬`.
- `session_shutdown` clears the marker.

## 🧰 Agent tool

The extension registers one `worktrunk` tool. Its `command` field enumerates the
built-in commands and configured aliases. Its optional `args` array passes the
remaining arguments directly to `wt` without shell expansion:

```json
{ "command": "switch", "args": ["--create", "fix/parser"] }
```

The tool description includes the generated built-in command tree, meaningful
options, arguments, and canonical examples. Commands added by a newer installed
Worktrunk version and repository aliases are discovered at startup. Agent calls
run without an additional Pi confirmation. Commands that move to another
worktree stop the old model turn, switch to a linked session, report Worktrunk's
result, and resume the task there.

## 🧰 Requirements

- Install [`wt`](https://worktrunk.dev/) and make it available on your `PATH`.
- Run Pi from a Git repository that Worktrunk can manage.

## 🛡️ Safety

- Pi stays put rather than choosing between several destinations.
- Recovery takes precedence when a command removes the current worktree.
- Worktrunk retains control of hooks, project-command approvals, dirty-worktree
  checks, force flags, branch deletion, and command errors.
- Session movement keeps the source until the destination is active, then removes it.

## 📄 License

[MIT](LICENSE)
