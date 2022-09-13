import { describe, it, expect } from './Test/index.mjs';
import { Filesystem } from './Filesystem.mjs';

describe('Filesystem (IndexedDB)', () => {
  it('Filesystem.Driver', () => {
    expect(Filesystem.Driver.kind).to.eql('IndexedDb');
  });
});
