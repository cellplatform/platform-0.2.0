import { Cmd, c } from '@sys/std-s';

type R = { output: Deno.CommandOutput; path: string; args: string };
const results: R[] = [];

const run = async (path: string, args = '') => {
  const output = await Cmd.sh(`cd ${path}`, `deno test ${args}`);
  results.push({ output, path, args });
};

/**
 * Run all tests across the mono-repo.
 */

// Std Libs
await run('code/deno/std.lib/std', '-RW');
await run('code/deno/std.lib/std.sss', '-RW');

// Drivers.
await run('code/deno/driver/driver.deno.cloud', '-RW');

/**
 * Output
 */
const success = results.every(({ output }) => output.success);
console.info('Test results:', success ? c.green('success') : c.red('failed'));
results.forEach((item) => {
  const status = item.output.success ? c.green('success') : c.red('failed');
  const path = c.gray(item.path);
  const bullet = item.output.success ? c.green('•') : c.red('•');
  console.info('', bullet, path, status);
});
console.info();

if (!success) Deno.exit(1);
