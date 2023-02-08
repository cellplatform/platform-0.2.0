import { describe, it, expect } from './test';
import { Crdt, CrdtPath, CrdtBus } from './index.mjs';

describe('Root Mdule API', () => {
  it('API', () => {
    expect(Crdt.Path).to.equal(CrdtPath);
    expect(Crdt.Bus).to.equal(CrdtBus);
  });
});
