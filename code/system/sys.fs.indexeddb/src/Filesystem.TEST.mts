import { describe, it, expect } from './TEST/index.mjs';
import { Filesystem } from './Filesystem.mjs';

describe('Filesystem (IndexedDB)', () => {
  it('base object', () => {
    expect(Filesystem.driver.kind).to.eql('IndexedDb');
  });
});
