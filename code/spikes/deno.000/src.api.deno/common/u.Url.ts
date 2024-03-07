import { Path } from './libs.ts';

const join = Path.join;
const base = 'https://api.deno.com/v1';

/**
 * Deno URL helpers.
 */
export const Url = {
  base,
  join,
  build: (...parts: string[]) => join(base, ...parts),
} as const;
