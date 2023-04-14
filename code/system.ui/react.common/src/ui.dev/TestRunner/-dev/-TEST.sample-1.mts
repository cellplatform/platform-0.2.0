import { Dev, expect } from '../../../test.ui';
import type { TestCtx } from './-types.mjs';

export default Dev.describe('root', (e) => {
  e.it('foo', async (e) => {
    expect(123).to.eql(123);
  });

  e.it('bar', async (e) => {
    const ctx = e.ctx as TestCtx;
    if (ctx.fail) expect(123).to.eql(5);
  });

  e.it.skip('skipped test', async (e) => {});
  e.it(`TODO: ${Dev.Lorem.toString()}`, async (e) => {});
  e.it(`TODO: short`, async (e) => {});

  e.describe.skip('skipped suite', (e) => {
    e.describe('child suite', (e) => {
      e.it('hello', async (e) => {});
    });
  });

  e.describe('child', (e) => {
    e.it('foo', async (e) => {});
    e.it.skip('bar', async (e) => {});
  });
});
