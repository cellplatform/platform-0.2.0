import { Dev } from '../../index.mjs';
import { describe, expect, it } from '../../test';

describe('headless (test runner)', () => {
  it('success (OK)', async () => {
    const Specs = {
      'sample.MySample': () => import('../sample.specs/MySample.SPEC'),
      'sample.empty': () => import('../sample.specs/Empty.SPEC'),
    };
    const res = await Dev.headless(Specs);
    expect(res.ok).to.eql(true);
    expect(res.total).to.eql(2);
    expect(res.elapsed).to.greaterThan(0);
  });

  it('fail', async () => {
    const Specs = {
      'sample.Fail': () => import('../sample.specs/Fail.SPEC'),
    };
    const res = await Dev.headless(Specs);
    expect(res.ok).to.eql(false);
    expect(res.total).to.eql(1);
    expect(res.elapsed).to.greaterThan(0);
  });
});
