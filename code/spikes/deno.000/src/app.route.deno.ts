import { init as subhosting } from './app.route.deno.subhosting.ts';

/**
 * Deno Cloud
 */
export const deno = {
  subhosting,
} as const;
