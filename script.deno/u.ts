import { c } from '@sys/std-s';

export type CmdOutput = {
  output: Deno.CommandOutput;
  path: string;
};

/**
 * Log a set of results to the console.
 */
export function logOutput(results: CmdOutput[], options: { title?: string } = {}) {
  const success = results.every(({ output }) => output.success);

  const title = `${(options.title ?? 'Results').replace(/\:$/, '')}:`;
  console.info(title, success ? c.green('success') : c.red('failed'));

  results.forEach((item) => {
    const status = item.output.success ? c.green('success') : c.red('failed');
    const path = c.gray(item.path);
    const bullet = item.output.success ? c.green('•') : c.red('•');
    console.info('', bullet, path, status);
  });
  console.info();

  return { success } as const;
}
