import { Model } from '.';
import { Test, TestDb, WebStore, expect, rx } from '../../test.ui';
import { DEFAULTS, Is } from './common';

export default Test.describe('RepoList.Model', (e) => {
  const storage = TestDb.Unit.name;
  const store = WebStore.init({ network: false, storage });

  e.describe('Model.List', (e) => {
    e.it('initialize', async (e) => {
      const model = await Model.init(store);
      expect(model.index.kind === 'crdt.store.index').to.eql(true);
      expect(model.list.state.type).to.eql(DEFAULTS.typename.List);
      expect(model.store).to.equal(store);
    });

    e.it('is', async (e) => {
      const model = await Model.init(store);
      expect(Is.repoListModel(model)).to.eql(true);
      expect(Is.repoListState(model.list.state)).to.eql(true);
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

  e.describe('Model.List.Events', (e) => {
    e.it('init → dispose', async (e) => {
      const model = await Model.init(store);
      const life = rx.disposable();

      const events1 = model.events();
      const events2 = model.events(life.dispose$);

      expect(events1.disposed).to.eql(false);
      expect(events2.disposed).to.eql(false);

      life.dispose();
      expect(events1.disposed).to.eql(false);
      expect(events2.disposed).to.eql(true);

      model.dispose();
      expect(events1.disposed).to.eql(true);
      expect(events2.disposed).to.eql(true);
    });
  });

  e.describe('Model.Item', (e) => {
    e.it('init: Doc', async (e) => {
      const model = await Model.init(store);
      const item = Model.Item.state(() => model, 'Doc');
      expect(item.type).to.eql(DEFAULTS.typename.Item);
      expect(item.current.editable).to.eql(true);
    });

    e.it('init: Add', async (e) => {
      const model = await Model.init(store);
      const item = Model.Item.state(() => model, 'Add');
      expect(item.type).to.eql(DEFAULTS.typename.Item);
      expect(item.current.editable).to.eql(false);
    });
  });
});
