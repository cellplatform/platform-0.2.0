import { handler } from './mod.ts';
// import { handler } from './mod.proxy.ts';

/**
 * Start
 */
Deno.serve(handler);
