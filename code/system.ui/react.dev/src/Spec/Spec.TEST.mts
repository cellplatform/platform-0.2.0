import { describe, it, expect } from '../test';
import { Spec } from '.';

describe('Spec (UI)', () => {
  it('e.ctx(e)', () => {
    const dummy = { ctx: { render: () => null } } as any;
    const ctx = Spec.ctx(dummy);
    expect(typeof ctx.render).to.eql('function');
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });
});
