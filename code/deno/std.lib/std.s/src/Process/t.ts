import type { t } from '../common.ts';

/**
 * Unix child process.
 * https://docs.deno.com/api/deno/~/Deno.Command
 */
export type Cmd = {
  /**
   * Run a <unix> command (on spawned child process).
   */
  run(args: string[], options?: { cmd?: string; silent?: boolean }): Promise<Deno.CommandOutput>;

  /**
   * Run an <shell> command.
   */
  sh(options?: { args?: string[]; silent?: boolean }): t.ShellCmd;
};

/**
 * A shell command ("sh").
 */
export type ShellCmd = {
  run(...args: string[]): Promise<Deno.CommandOutput>;
};
