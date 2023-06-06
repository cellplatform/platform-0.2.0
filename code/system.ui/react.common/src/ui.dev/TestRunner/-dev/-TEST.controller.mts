import { TestPropList } from '..';
import { Dev, expect, type t } from './-common.mjs';

export default Dev.describe('(Self) Controller Behavior', (e) => {
  e.it('init', async (e) => {
    const controller = await TestPropList.controller({});
    expect(controller.kind).to.eql('Test.PropList.Controller');
    expect(controller.all).to.eql([]);
  });

  e.describe('load → all', (e) => {
    const list = [import('./-TEST.sample-1.mjs'), import('./-TEST.sample-2.mjs')];

    const expectOrder = (list: t.TestSuiteModel[]) => {
      const labels = list.map((suite) => suite.description);
      expect(labels[0]).to.eql('Sample-1');
      expect(labels[1]).to.eql('MySpec');
      expect(labels[2].startsWith('Sample-2: Lorem')).to.eql(true);
    };

    e.it('simple list (array)', async (e) => {
      const controller = await TestPropList.controller({ run: { list } });
      expectOrder(controller.all);
    });

    e.it('function', async (e) => {
      const controller = await TestPropList.controller({ run: { list: () => list } });
      expectOrder(controller.all);
    });

    e.it('async function', async (e) => {
      const controller = await TestPropList.controller({ run: { list: async () => list } });
      expectOrder(controller.all);
    });
  });
});
