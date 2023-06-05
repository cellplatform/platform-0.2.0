import { Dev, expect, type t, Time, type TestCtx, Wrangle } from './-common.mjs';
import { TestPropList } from '..';

export default Dev.describe('(Self) Controller Behavior', (e) => {
  e.it('init', async (e) => {
    const controller = await TestPropList.controller({});
    expect(controller.kind).to.eql('Test.PropList.Controller');
    expect(controller.all).to.eql([]);
  });

  e.describe('load → all', (e) => {
    const all = [import('./-TEST.sample-1.mjs'), import('./-TEST.sample-2.mjs')];

    const expectOrder = (all: t.TestSuiteModel[]) => {
      const labels = all.map((suite) => suite.description);
      expect(labels[0]).to.eql('Sample-1');
      expect(labels[1]).to.eql('MySpec');
      expect(labels[2].startsWith('Sample-2: Lorem')).to.eql(true);
    };

    e.it('plain array', async (e) => {
      const controller = await TestPropList.controller({
        run: { all },
      });

      expectOrder(controller.all);
    });

    e.it('function', async (e) => {
      const controller = await TestPropList.controller({
        run: { all: () => all },
      });
      expectOrder(controller.all);
    });

    e.it('async function', async (e) => {
      const controller = await TestPropList.controller({
        run: { all: async () => all },
      });
      expectOrder(controller.all);
    });
  });
});
