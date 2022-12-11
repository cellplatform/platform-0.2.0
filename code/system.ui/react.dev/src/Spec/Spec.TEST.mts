import { Spec } from '.';
import { describe, expect, it } from '../test';
import { SpecContext } from './Spec.Context.mjs';

describe('Spec (UI)', () => {
  describe('Context', () => {
    it('e.ctx(e)', () => {
      const args = SpecContext.args();
      const ctx = Spec.ctx({ id: 'foo', ctx: args.ctx, timeout: () => null as any });

      expect(typeof ctx.component.render).to.eql('function');
      expect(typeof ctx.rerun).to.eql('function');
      expect(typeof ctx.toObject).to.eql('function');
    });

    it('e.ctx(e): throw', () => {
      const fn = () => Spec.ctx({} as any);
      expect(fn).to.throw(/Expected a {ctx} object/);
    });
  });
});
