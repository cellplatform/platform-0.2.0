import { describe, expect, it } from '../../test';
import { Syncer } from './common';
import { Monaco } from '../..';

describe('Monaco.Crdt.syncer', () => {
  it('api reference', () => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });
});
