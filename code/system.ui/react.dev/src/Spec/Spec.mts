import { t } from '../common';

/**
 * Root API to the UI Spec Runner system.
 */
export const Spec = {
  ctx(e: t.TestHandlerArgs) {
    if (typeof e.ctx !== 'object') {
      const msg = `Expected a {ctx} object. Make sure to pass it into the runner.`;
      throw new Error(msg);
    }
    return e.ctx as t.SpecCtx;
  },
};
