import { describe, it, expect } from './TEST/index.mjs';
import { Filesystem } from './Filesystem.mjs';

describe('Filesystem (Node)', () => {
  it('base object', () => {
    expect(Filesystem.driver.kind).to.eql('Node');
  });
});
