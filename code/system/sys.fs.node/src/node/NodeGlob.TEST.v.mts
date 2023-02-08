import path from 'path';

import { describe, expect, it } from '../test';
import { NodeGlob } from '.';

describe('NodeGlob', () => {
  it('matches file pattern', async () => {
    const specs = '**/*.{TEST,SPEC}.v.{ts,tsx,mts,mtsx}';
    const pattern = path.resolve(path.join('./src', specs));

    const res = await NodeGlob.find(pattern);
    const exists = res.some((path) => path.includes('NodeGlob.TEST.v.mts'));

    expect(res.length).to.greaterThan(0);
    expect(exists).to.eql(true);
  });
});
