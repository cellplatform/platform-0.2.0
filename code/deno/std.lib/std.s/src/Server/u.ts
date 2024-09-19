import { c, type t } from './common.ts';

/**
 * Outputs a formatted console log within
 * meta-data about the running server and module.
 */
export const print: t.ServerLib['print'] = (addr, pkg) => {
  const port = c.bold(String(addr.port));
  const host = c.green(`http://localhost:${port}/`);
  if (pkg) {
    console.info();
    console.info(c.gray(`Module:    ${c.white(pkg.name)}`));
    console.info(c.gray(`Version:   ${c.white(pkg.version)}`));
    console.info(c.gray(`           ${host}`));
  } else {
    console.info(c.gray(`Listening on ${host}`));
  }
  console.info('');
};

/**
 * Generates a Deno.server(...) configuration options object.
 */
export const options: t.ServerLib['options'] = (port, pkg) => {
  return {
    port,
    onListen: (addr) => print(addr, pkg),
  };
};
