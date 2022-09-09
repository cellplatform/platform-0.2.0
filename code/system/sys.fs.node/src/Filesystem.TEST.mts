import { describe, it, expect } from './TEST/index.mjs';

import { Filesystem, NodeDriver } from './index.mjs';

describe('Filesystem (Node)', () => {
  it('Filesystem.Driver', () => {
    expect(Filesystem.Driver.kind).to.eql('Node');
    expect(Filesystem.Driver.Node).to.equal(NodeDriver);
  });
});
