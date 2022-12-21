import { t, Is, Spec } from '../common';

export const SampleDevTools = {
  /**
   * Render an user-invokable test button.
   */
  button(input: t.DevCtx | t.TestHandlerArgs) {
    /**
     * TODO 🐷
     *   Standard button visual.
     */

    const ctx = Spec.Wrangle.ctx(input, { throw: true });

    console.log('ctx', ctx);

    return ctx;
  },
};
