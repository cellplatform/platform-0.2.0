import { type t } from './common';

/**
 * TODO 🐷
 * - pass (e) to loader.
 * - take in:
 *    - metadata: name
 *    - beforeRun, afterRun handlers
 * - function props:
 *    - stats: { run: { total:number }, log: [] }
 * - function methods:
 *    - load() ← pre-load the module, but don't run it.
 */

/**
 * Dynamic function importer (lazy load).
 */
const lazyFunctionLoader = <R extends t.FuncResponse, P extends t.FuncParams = never>(
  loader: (args: P) => Promise<t.Func<R, P>>,
): t.Func<R, P> => {
  let cached: t.Func<R, P> | undefined;
  const fn: t.Func<R, P> = async (args?: P) => {
    cached = cached || (cached = await loader(args!));
    if (typeof cached !== 'function') throw new Error(`Module loader did not return a function.`);
    return await cached(args!);
  };
  return fn;
};

/**
 * Dynamic function.
 */
export const Func = { import: lazyFunctionLoader } as const;
