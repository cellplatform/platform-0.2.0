import { Model } from '.';
import { Test, WebStore, expect } from '../../test.ui';
import { DEFAULTS } from './common';

export default Test.describe('RepoList.Model', (e) => {
  const store = WebStore.init({ network: false, storage: 'dev.test' });

  e.describe('Model.List', (e) => {
    e.it('init', async (e) => {
      const model = await Model.init(store);
      expect(model.index.kind === 'store:index').to.eql(true);
      expect(model.list.state.type).to.eql(DEFAULTS.typename.list);
      expect(model.ctx().store).to.equal(store);
    });

    e.it('dispose', async (e) => {
      const model = await Model.init(store);
      const events = model.list.state.events();
      expect(model.disposed).to.eql(false, 'model');
      expect(events.disposed).to.eql(false, 'events');

      model.dispose();

      expect(model.disposed).to.eql(true, 'model');
      expect(events.disposed).to.eql(true, 'events');
    });
  });

  e.describe('Model.Item', (e) => {
    e.it('init', async (e) => {
      const model = await Model.init(store);
      const item = Model.Item.state({ ctx: model.ctx });
      expect(item.type).to.eql(DEFAULTS.typename.item);
    });
  });
});
