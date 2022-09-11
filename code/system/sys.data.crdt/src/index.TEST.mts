import { describe, it, expect } from './TEST/index.mjs';
import { Pkg } from './index.pkg.mjs';

describe('Module', () => {
  it('Pkg', async () => {
    //
    /**
     * TODO 🐷
     *
     */
    expect(Pkg.name).to.eql('sys.data.crdt');
    expect(Pkg.version).to.eql('0.0.0');
  });
});
