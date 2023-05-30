import { Dev, expect, t, Time } from '../../../test.ui';
import type { TestCtx } from './-types.mjs';

export default Dev.describe('TestRunner Controller', (e) => {
  e.it('foo', async (e) => {
    await Time.wait(300);
    expect(123).to.eql(123);
  });
});
