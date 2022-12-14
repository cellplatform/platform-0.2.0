import { Spec } from '.';
import { rx, describe, expect, it, slug } from '../test';
import { SpecContext } from './Spec.Context.mjs';

const bus = rx.bus();

describe('SpecContext', () => {
  it('e.ctx(e)', () => {
    const instance = { bus, id: `foo.${slug()}` };
    const res = SpecContext.create(instance);
    const ctx = Spec.ctx({ id: 'foo', ctx: res.ctx, timeout: () => null as any });

    expect(typeof ctx.component.render).to.eql('function');
    expect(typeof ctx.toObject).to.eql('function');
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });

  it('unique {props.id}', () => {
    const instance = { bus, id: `foo.${slug()}` };
    const res1 = SpecContext.create(instance);
    const res2 = SpecContext.create(instance);
    expect(res1.props.id).to.not.eql(res2.props.id);
  });

  it('props.toObject', () => {
    const instance = { bus, id: `foo.${slug()}` };
    const res = SpecContext.create(instance);
    const obj = res.ctx.toObject();
    expect(obj.props).to.eql(res.props);
    expect(obj.instance).to.equal(instance);
  });
});
