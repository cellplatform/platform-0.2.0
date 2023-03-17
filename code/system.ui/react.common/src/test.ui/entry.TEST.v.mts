import { describe, expect, it } from '../test';
import { Dev } from '../test.ui';

const { AllSpecs } = await import('./entry.Specs.mjs');

describe('visual specs', () => {
  it('run', async () => {
    const res = await Dev.headless(AllSpecs);
    expect(res.ok).to.eql(true);
  });
});
