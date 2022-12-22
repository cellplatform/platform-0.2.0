import { Spec } from '.';
import { describe, expect, it, t, TestSample } from '../test';

describe('Spec', () => {
  it('e.ctx(e)', async () => {
    const { ctx, dispose } = await TestSample.context();

    expect(typeof ctx.component.render).to.eql('function');
    expect(typeof ctx.toObject).to.eql('function');

    dispose();
  });

  it('e.ctx(e): throw', () => {
    const fn = () => Spec.ctx({} as any);
    expect(fn).to.throw(/Expected a {ctx} object/);
  });

  describe('Wrangle', () => {
    const Wrangle = Spec.Wrangle;

    describe('Wrangle.ctx', () => {
      it('from ctx (already), pass-through', async () => {
        const { ctx, dispose } = await TestSample.context();
        expect(Wrangle.ctx(ctx)).to.equal(ctx);
        dispose();
      });

      it('from test args ("it")', async () => {
        const { ctx, dispose } = await TestSample.context();

        let _testArgs: t.TestHandlerArgs;
        const suite = Spec.describe('MySuite', (e) => {
          e.it('MyTest', (e) => (_testArgs = e));
        });
        await suite.run({ ctx });

        expect(Wrangle.ctx(suite)).to.eql(undefined); // NB: No match on a suite.

        const res = Wrangle.ctx(_testArgs!);
        expect(res).to.equal(ctx);

        dispose();
      });

      it('no match (throw: true/false)', () => {
        const INVALID = [undefined, null, {}, [], true, 123, 'a', () => null];
        INVALID.forEach((value) => {
          const fn = () => Wrangle.ctx(value, { throw: true });
          expect(fn).to.throw(/Expected a {ctx}/);
          expect(Wrangle.ctx(value)).to.eql(undefined);
        });
      });
    });
  });
});
