import { Dev } from '.';
import { describe, expect, it } from '../test';
import { Spec } from './common.libs.mjs';

describe('Dev', () => {
  it('imports base methods from underlying module', async () => {
    expect(Dev.Bus).to.be.an('object');
    expect(Dev.Spec).to.be.an('object');
    expect(Dev.SpecList).to.be.an('function');
    expect(Dev.Harness).to.be.an('function');
    expect(Dev.render).to.be.an('function');
    expect(Dev.headless).to.be.an('function');

    expect(Dev.ctx).to.equal(Spec.ctx);
    expect(Dev.describe).to.equal(Spec.describe);
  });
});
