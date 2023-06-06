import { TestPropList } from '..';
import { Util } from '../Test.PropList/Util.mjs';
import { Dev, expect, type t } from './-common.mjs';

export default Dev.describe('(Self) Controller Behavior', (e) => {
  e.it('init', async (e) => {
    const controller = await TestPropList.controller({});
    expect(controller.kind).to.eql('Test.PropList.Controller');
    expect(controller.suites).to.eql([]);
  });

  const import1 = import('./-TEST.sample-1.mjs');
  const import2 = import('./-TEST.sample-2.mjs');

  const expectOrder = (list: t.TestSuiteModel[]) => {
    const labels = list.map((suite) => suite.description);
    expect(labels[0]).to.eql('Sample-1');
    expect(labels[1]).to.eql('MySpec');
    expect(labels[2].startsWith('Sample-2: Lorem')).to.eql(true);
  };

  e.describe('load → all', (e) => {
    const list = [import1, import2];

    e.it('simple list (array)', async (e) => {
      const controller = await TestPropList.controller({ run: { list } });
      expectOrder(controller.suites);
    });

    e.it('function', async (e) => {
      const controller = await TestPropList.controller({ run: { list: () => list } });
      expectOrder(controller.suites);
    });

    e.it('async function', async (e) => {
      const controller = await TestPropList.controller({ run: { list: async () => list } });
      expectOrder(controller.suites);
    });
  });

  e.describe('Util', (e) => {
    e.describe('importAndInitialize', (e) => {
      e.it('mixed: no initial title', async (e) => {
        const res = await Util.importAndInitialize({
          run: { list: [import1, 'MyTitle', import2] },
        });

        expect(res.length).to.eql(2);
        expect(res[0].title).to.eql('');
        expect(res[0].suites.map((e) => e.description)).to.eql(['Sample-1', 'MySpec']);

        expect(res[1].title).to.eql('MyTitle');
        expect(res[1].suites.length).to.eql(1);
        expect(res[1].suites[0].description.startsWith('Sample-2: Lorem')).to.eql(true);
      });

      e.it('mixed: initial title', async (e) => {
        const res = await Util.importAndInitialize({ run: { list: ['MyTitle', import1] } });

        expect(res.length).to.eql(1);
        expect(res[0].title).to.eql('MyTitle');
        expect(res[0].suites.map((e) => e.description)).to.eql(['Sample-1', 'MySpec']);
      });
    });
  });
});
