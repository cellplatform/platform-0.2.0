import { t, Test } from '../common';

/**
 * Root API to the UI Spec Runner system.
 */
export const Spec = {
  describe: Test.describe,

  /**
   * Pluck and type-cast the [SpecCtx] context object from the standard
   * arguments passed into a test ("it") via the spec runner.
   */
  ctx(e: t.TestHandlerArgs) {
    if (typeof e.ctx !== 'object') {
      const msg = `Expected a {ctx} object. Make sure to pass it into the runner.`;
      throw new Error(msg);
    }
    return e.ctx as t.SpecCtx;
  },
};
