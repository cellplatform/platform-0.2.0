import { t, Test, maybeWait } from '../common';
import { Wrangle } from './Wrangle.mjs';

/**
 * Root API to the UI Spec Runner system.
 */
export const Spec = {
  Wrangle,

  /**
   * Spec (root test suite) creator.
   * Usage:
   *
   *    export default Spec.describe('My Thing', (e) => {
   *      e.it('name', (e) => {
   *        cont ctx = Spec.ctx(e);
   *      });
   *    });
   *
   */
  describe: Test.describe,

  /**
   * Pluck and type-cast the {ctx} context object from the standard
   * arguments passed into a test ("it") via the spec runner.
   */
  ctx(e: t.TestHandlerArgs) {
    Wrangle.ctx(e, { throw: true });
    return e.ctx as t.DevCtx;
  },

  /**
   * Pluck the {ctx} and run the given handler if this is the
   * initial test run within the session.
   */
  async initial(e: t.TestHandlerArgs, fn: (ctx: t.DevCtx) => any) {
    const ctx = Spec.ctx(e);
    if (ctx.isInitial) await maybeWait(fn(ctx));
    return ctx;
  },
};
