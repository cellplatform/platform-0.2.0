import { Spec } from '.';
import { SpecContext } from '../Spec.Context';
import { describe, expect, it, rx, slug, t } from '../test';

describe('Spec', () => {
  const bus = rx.bus();
  const timeout = () => null as any;

  const Sample = {
    instance: () => ({ bus, id: `foo.${slug()}` }),
    create: () => SpecContext.create(Sample.instance()),
    ctx() {
      const instance = Sample.instance();
      const wrapper = SpecContext.create(instance);
      const ctx = Spec.ctx({ id: 'foo', ctx: wrapper.ctx, timeout, description: 'MyFoo' });
      return ctx;
    },
  };

  it('e.ctx(e)', () => {
    const ctx = Sample.ctx();
    expect(typeof ctx.component.render).to.eql('function');
    expect(typeof ctx.toObject).to.eql('function');
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });

  describe('Wrangle', () => {
    const Wrangle = Spec.Wrangle;

    describe('Wrangle.ctx', () => {
      it('from ctx (already), pass-through', () => {
        const ctx = Sample.ctx();
        expect(Wrangle.ctx(ctx)).to.equal(ctx);
      });

      it('from test args ("it")', async () => {
        const ctx = Sample.ctx();
        let _testArgs: t.TestHandlerArgs;
        const suite = Spec.describe('MySuite', (e) => {
          e.it('MyTest', (e) => (_testArgs = e));
        });
        await suite.run({ ctx });

        expect(Wrangle.ctx(suite)).to.eql(undefined); // NB: No match on a suite.

        const res = Wrangle.ctx(_testArgs!);
        expect(res).to.equal(ctx);
      });

      it('no match (throw: true/false)', () => {
        const INVALID = [undefined, null, {}, [], true, 123, 'a', () => null];

        INVALID.forEach((value) => {
          expect(Wrangle.ctx(value)).to.eql(undefined);

          const fn = () => Wrangle.ctx(value, { throw: true });
          expect(fn).to.throw(/Expected a {ctx}/);
        });
      });
    });
  });
});
