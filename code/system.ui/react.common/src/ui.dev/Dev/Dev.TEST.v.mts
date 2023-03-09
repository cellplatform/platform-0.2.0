import { Dev } from '.';
import { describe, expect, it } from '../../test';
import { Spec } from '../common';

describe('Dev', () => {
  it('imports base methods from underlying module', () => {
    expect(Dev.Bus).to.be.an('object');
    expect(Dev.Spec).to.be.an('object');
    expect(Dev.SpecList).to.be.an('function');
    expect(Dev.Harness).to.be.an('function');
    expect(Dev.render).to.be.an('function');
    expect(Dev.headless).to.be.an('function');

    expect(Dev.ctx).to.equal(Spec.ctx);
    expect(Dev.describe).to.equal(Spec.describe);
  });

  it('helper: trimStringsDeep', () => {
    const obj = { child: { value: 'hello'.repeat(10) } };
    const res = Dev.trimStringsDeep(obj, { maxLength: 5 });

    expect(res.child.value).to.eql('hello...');
    expect(res).to.not.eql(obj);
  });
});
