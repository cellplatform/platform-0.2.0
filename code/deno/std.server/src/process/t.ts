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
  sh(...line: string[]): Promise<Deno.CommandOutput>;
};
