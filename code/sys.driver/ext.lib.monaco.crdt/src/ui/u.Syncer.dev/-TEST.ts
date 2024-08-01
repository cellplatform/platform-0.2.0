import { Monaco } from '../..';
import { Test, expect } from '../../test.ui';
import { Syncer } from './common';

export default Test.describe('Monaco.Crdt.syncer', (e) => {
  e.it('api reference', (e) => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });
});
