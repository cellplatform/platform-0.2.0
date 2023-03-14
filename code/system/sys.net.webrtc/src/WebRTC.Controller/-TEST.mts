import { Dev, expect } from '../test.ui';

export default Dev.describe('WebRtc.Controller', (e) => {
  e.timeout(1000 * 15);

  e.it('tmp', async (e) => {
    expect(123).to.eql(123);
  });
});
