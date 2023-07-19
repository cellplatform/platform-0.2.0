import { t, Dev, expect } from './-common';

/**
 * TODO 🐷
 * - test replacement (delete + add)
 * - caret locations
 * - startup (initial state) replacing the entire document (should merge)
 */

export default Dev.describe('MonacoCrdt', (e) => {
  e.it('text syncs to second editor', async (e) => {
    const ctx = Wrangle.ctx(e);
    ctx.peer1.editor.setValue('hello world');
  });
});

/**
 * Helpers
 */
const Wrangle = {
  ctx(e: t.TestHandlerArgs) {
    return e.ctx as t.TestCtx;
  },
};
