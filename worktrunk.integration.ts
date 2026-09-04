import assert from "node:assert/strict";
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  assistantMessage,
  getToolCallNames,
  PiIntegrationTest,
  text,
  toolCall,
} from "pi-coding-agent-test";

test("a model-triggered worktree move continues in the destination session", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-worktrunk-continuation-"));
  const fixture = join(root, "fixture");
  const bin = join(root, "bin");
  const targetFile = join(root, "target-path");
  const logFile = join(root, "wt.log");
  await mkdir(fixture);
  await mkdir(bin);
  await writeFile(join(fixture, "README.md"), "fixture\n");

  try {
    const wt = join(bin, "wt");
    await writeFile(wt, `#!/usr/bin/env bash
set -eu
target="$(dirname "$PWD")/destination"
mkdir -p "$target"
printf '%s' "$target" > "$WT_TEST_TARGET_FILE"
printf '%s\n' "$PWD :: $*" >> "$WT_TEST_LOG_FILE"
case " $* " in
  *" --version "*) printf 'wt 0.76.0\\n' ;;
  *" --help "*) printf 'Commands:\\n  switch  Switch worktrees\\n  list  List worktrees\\n  config  Manage config\\n' ;;
  *"list.json-schema=2"*"list"*"--format=json"*) printf '{"schema":2,"items":[{"branch":"main","worktree":{"path":"%s","current":true,"main":true}},{"branch":"feature","worktree":{"path":"%s","current":false}}]}\\n' "$PWD" "$target" ;;
  *" switch "*) printf 'switched\\n' ;;
  *) printf '\\n' ;;
esac
`);
    await chmod(wt, 0o755);

    const result = await new PiIntegrationTest({
      testName: "session-move-continuation",
      artifactsDir: resolve(".agents/tmp/test-runs"),
      cwd: fixture,
      extensions: [resolve("worktrunk.ts")],
      tools: ["worktrunk"],
      rawMode: false,
      environment: {
        PATH: `${bin}:${process.env.PATH}`,
        WT_TEST_TARGET_FILE: targetFile,
        WT_TEST_LOG_FILE: logFile,
      },
      conversation: [
        assistantMessage([
          toolCall({
            id: "switch-worktree",
            name: "worktrunk",
            arguments: { command: "switch", args: ["feature"] },
          }),
        ], { stopReason: "toolUse" }),
        assistantMessage([text("Continued after the move.")]),
      ],
    }).run("Switch to the feature worktree and continue the task there");

    const target = await readFile(targetFile, "utf8");
    assert.deepEqual(getToolCallNames(result), ["worktrunk"]);
    assert.equal(result.providerRequests.length, 2, "one move must start exactly one continuation turn");
    const continuedRequest = result.providerRequests[1] as { systemPrompt?: unknown };
    assert.equal(typeof continuedRequest.systemPrompt, "string");
    assert.match(
      continuedRequest.systemPrompt as string,
      new RegExp(`Current working directory: ${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"),
      await readFile(logFile, "utf8"),
    );
    assert.equal((result.messages.at(-1) as { role?: unknown } | undefined)?.role, "assistant");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
