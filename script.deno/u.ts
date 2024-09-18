import { c } from '@sys/std-s';
export { Cmd } from '@sys/std-s';

export type CmdOutput = {
  output: Deno.CommandOutput;
  path: string;
};

/**
 * Logging helpers.
 */
export const Log = {
  /**
   * Log a set of results to the console.
   */
  output(results: CmdOutput[], options: { title?: string; pad?: boolean } = {}) {
    const success = results.every(({ output }) => output.success);

    if (options.pad) console.log();
    const title = `${(options.title ?? 'Results').replace(/\:$/, '')}:`;
    console.info(title, success ? c.green('success') : c.red('failed'));

    results.forEach((item) => {
      const status = item.output.success ? c.green('success') : c.red('failed');
      const path = c.gray(item.path);
      const bullet = item.output.success ? c.green('•') : c.red('•');
      console.info('', bullet, path, status);
    });

    if (options.pad) console.log();
    return success;
  },
} as const;
