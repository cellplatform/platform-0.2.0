/**
 * Unix child process.
 * https://docs.deno.com/api/deno/~/Deno.Command
 */
export const Cmd = {
  /**
   * Run an <shell> command.
   */
  sh(...line: string[]) {
    const command = line.join(' && ');
    return Cmd.run(['-c', command], { cmd: 'sh' });
  },

  /**
   * Run a <unix> command (on spawned child process).
   */
  async run(args: string[], options: { cmd?: string; silent?: boolean } = {}) {
    const cmd = options.cmd ?? Deno.execPath();
    const command = new Deno.Command(cmd, {
      args,
      stdout: 'piped', // Capture the "standard" output.
      stderr: 'piped', // Capture the "error" output.
    });

    // Execute the command and collect its output.
    const res = await command.output();
    const { code, stdout, stderr } = res;

    if (!options.silent) {
      if (code === 0) {
        console.log(new TextDecoder().decode(stdout));
      } else {
        console.error(new TextDecoder().decode(stderr));
      }
    }

    return res;
  },
} as const;
