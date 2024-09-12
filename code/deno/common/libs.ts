export * from './lib.Fs.ts';
export * from './lib.Testing.ts';

export * as dotenv from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
export * as DateTime from 'https://deno.land/std@0.224.0/datetime/mod.ts';

/**
 * Console: formatting colors.
 */
import * as color from 'https://deno.land/std@0.224.0/fmt/colors.ts';
export { color, color as c };
