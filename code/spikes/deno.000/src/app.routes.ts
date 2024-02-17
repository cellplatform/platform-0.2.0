import { init as ai } from './app.route.openai.ts';
import { init as root } from './app.route.root.ts';
import { deno } from './app.route.deno.ts';

/**
 * Route index.
 */
export const Routes = { root, ai, deno } as const;
