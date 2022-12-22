import { t, Test } from '../common';
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
   * Pluck and type-cast the [SpecCtx] context object from the standard
   * arguments passed into a test ("it") via the spec runner.
   */
  ctx(e: t.TestHandlerArgs) {
    Wrangle.ctx(e, { throw: true });
    return e.ctx as t.DevCtx;
  },
};
