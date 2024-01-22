import { Test, expect, type t } from '../test.ui';
import { Func } from '.';

export default Test.describe('Func', (e) => {
  e.describe('Func.import', (e) => {
    e.it('import: "ModuleA"', async (e) => {
      type R = { total: number };
      type P = { sum: number[]; debug?: boolean };

      const fn = Func.import<R, P>(async () => {
        const m = await import('../test/sample/ModuleA');
        return async (e) => {
          const total = m.ModuleA.sum(...e.sum);
          return { total };
        };
      });

      const res = await fn({ sum: [1, 2, 3] });
      expect(res.total).to.eql(6);
    });
  });
});
