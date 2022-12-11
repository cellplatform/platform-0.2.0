import { Spec } from '.';
import { describe, expect, it } from '../test';

describe('Spec (UI)', () => {
  describe('Context', () => {
    it('e.ctx(e)', () => {
      const dummy = { ctx: { render: () => null } } as any;
      const ctx = Spec.ctx(dummy);
      expect(typeof ctx.component.render).to.eql('function');
      expect(typeof ctx.rerun).to.eql('function');
    });

    it('e.ctx(e): throw', () => {
      const fn = () => Spec.ctx({} as any);
      expect(fn).to.throw(/Expected a {ctx} object/);
    });
  });
});
