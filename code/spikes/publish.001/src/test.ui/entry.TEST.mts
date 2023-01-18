import { describe, expect, it } from '../test';
import { Dev } from '../test.ui';
import Specs from './entry.Specs.mjs';

describe('visual specs', () => {
  it('run', async () => {
    const res = await Dev.headless(Specs);
    expect(res.ok).to.eql(true);
  });
});
