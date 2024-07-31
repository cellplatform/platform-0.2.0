import { Monaco, Test, expect } from '../../test.ui';
import { Syncer } from './common';

export default Test.describe('Monaco.Crdt.syncer', (e) => {
  e.it('exposed library API', async () => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });
});
