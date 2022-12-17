import { Spec } from '.';
import { SpecContext } from '../Spec.Context';
import { describe, expect, it, rx, slug } from '../test';

describe('Spec', () => {
  const bus = rx.bus();
  const timeout = () => null as any;

  const Sample = {
    instance: () => ({ bus, id: `foo.${slug()}` }),
    create: () => SpecContext.create(Sample.instance()),
  };

  it('e.ctx(e)', () => {
    const instance = Sample.instance();
    const wrapper = SpecContext.create(instance);
    const ctx = Spec.ctx({ id: 'foo', ctx: wrapper.ctx, timeout, description: 'MyFoo' });
    expect(typeof ctx.component.render).to.eql('function');
    expect(typeof ctx.toObject).to.eql('function');
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });
});
