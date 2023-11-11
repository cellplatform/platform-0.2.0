import { Model } from '.';
import { Test, WebStore, expect } from '../../test.ui';
import { DEFAULTS } from './common';

export default Test.describe('RepoList.Model', (e) => {
  const store = WebStore.init({ network: false, storage: 'dev.test' });

  e.describe('Model.List', (e) => {
    e.it('typename', (e) => {
      const model = Model.init(store);
      expect(model.list.type).to.eql(DEFAULTS.typename.list);
    });

    e.it('dispose', (e) => {
      const model = Model.init(store);
      const events = model.list.events();
      expect(model.disposed).to.eql(false, 'model');
      expect(events.disposed).to.eql(false, 'events');

      model.dispose();

      expect(model.disposed).to.eql(true, 'model');
      expect(events.disposed).to.eql(true, 'events');
    });
  });

  e.describe('Model.Item', (e) => {
    e.it('typename', (e) => {
      const model = Model.init(store);
      const item = Model.Item.state({ ctx: model.ctx });
      expect(item.type).to.eql(DEFAULTS.typename.item);
    });
  });
});
