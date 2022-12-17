import { t } from '../common';

/**
 * Pluck and type-cast the [SpecCtx] context object from the standard
 * arguments passed into a test ("it") via the spec runner.
 */
export function asCtx(e: t.TestHandlerArgs) {
  if (typeof e.ctx !== 'object') {
    throw new Error(`Expected a {ctx} object. Make sure to pass it into the runner.`);
  }
  return e.ctx as t.SpecCtx;
}
