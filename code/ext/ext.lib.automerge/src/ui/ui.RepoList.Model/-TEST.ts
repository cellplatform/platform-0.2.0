import { WebStore, Test, expect, type t, Is } from '../../test.ui';
import { Model } from '.';
import { DEFAULTS } from './common';

export default Test.describe('RepoList.Model', (e) => {
  const store = WebStore.init();

  e.describe('Model.List', (e) => {
    e.it('typename', (e) => {
      const model = Model.init(store);
      expect(model.list.type).to.eql(DEFAULTS.typename.list);
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
