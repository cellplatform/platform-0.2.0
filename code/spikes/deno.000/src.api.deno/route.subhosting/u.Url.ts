import { Path } from './u.common.ts';

const join = Path.join;
const base = 'https://api.deno.com/v1';

/**
 * Deno URL helpers.
 */
export const Url = {
  join,
  base,
  build: (...parts: string[]) => join(base, ...parts),
} as const;
