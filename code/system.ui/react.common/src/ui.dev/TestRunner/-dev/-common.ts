import { type t } from '../common';
import type { TestCtx } from './-types';

export type { TestCtx };
export * from '../../../test.ui';

export const Wrangle = {
  ctx(e: t.TestHandlerArgs) {
    return e.ctx as TestCtx;
  },

  shouldThrow(e: t.TestHandlerArgs) {
    return Wrangle.ctx(e).fail && Math.random() < 0.5;
  },
};
