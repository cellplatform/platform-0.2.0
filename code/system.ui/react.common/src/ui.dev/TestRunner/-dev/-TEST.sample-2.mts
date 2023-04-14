import { Dev, expect } from '../../../test.ui';
import type { TestCtx } from './-types.mjs';

export default Dev.describe('root', (e) => {
  Array.from({ length: 50 }).forEach((_, i) => {
    e.describe(`suite ${i + 1}`, (e) => {
      Array.from({ length: 5 }).forEach((_, i) => {
        e.it(`does thing ${i + 1}`, async (e) => {
          const ctx = e.ctx as TestCtx;
          expect(123).to.eql(123);
        });
      });
    });
  });
});
