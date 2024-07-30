import { Syncer } from '.';
import { Monaco, Test, expect } from '../test.ui';

export default Test.describe('Monaco.Crdt.syncer', (e) => {
  e.it('exposed library API', async (e) => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });
});
