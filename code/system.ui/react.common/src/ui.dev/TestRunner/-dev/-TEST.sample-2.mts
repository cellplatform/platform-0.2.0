import { Dev, Lorem, expect, t } from '../../../test.ui';
import type { TestCtx } from './-types.mjs';

export default Dev.describe(`sample-2: ${Lorem.words(10)}`, (e) => {
  const length = 50;

  Array.from({ length }).forEach((_, i) => {
    e.describe(`suite ${i + 1}`, (e) => {
      const length = 5;

      Array.from({ length }).forEach((_, i) => {
        e.it(`does thing ${i + 1}`, async (e) => {
          if (Wrangle.shouldThrow(e)) {
            expect(123).to.eql('BOO');
          }
        });
      });
    });
  });
});

const Wrangle = {
  ctx(e: t.TestHandlerArgs) {
    return e.ctx as TestCtx;
  },

  shouldThrow(e: t.TestHandlerArgs) {
    return Wrangle.ctx(e).fail && Math.random() < 0.5;
  },
};
