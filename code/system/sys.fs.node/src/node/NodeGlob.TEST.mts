import path from 'path';

import { describe, expect, it } from '../test/index.mjs';
import { NodeGlob } from './index.mjs';

describe('NodeGlob', () => {
  it('matches file pattern', async () => {
    const specs = '**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}';
    const pattern = path.resolve(path.join('./src', specs));

    const res = await NodeGlob.find(pattern);
    const exists = res.some((path) => path.includes('NodeGlob.TEST.mts'));

    expect(res.length).to.greaterThan(0);
    expect(exists).to.eql(true);
  });
});
