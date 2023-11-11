import { StoreIndexDb } from '.';
import { WebStore } from '../Store.Web';
import { IndexedDb, Test, Time, expect, expectError } from '../test.ui';
import { DEFAULTS, Is } from './common';

export default Test.describe('Store.Web: IndexDb', (e) => {
  const name = 'dev.test';

  const init = () => {
    return StoreIndexDb.init({ name: '.index.test' });
  };

  e.it('init (defaults)', async (e) => {
    const db = await StoreIndexDb.init();

    await Time.wait(100);
    const databases = (await IndexedDb.list()).map((e) => e.name);

    const dbname = DEFAULTS.sys.dbname;
    expect(databases).to.include(dbname);
    expect(db.database.name).to.eql(dbname);
    expect(db.name).to.eql(dbname);
    db.dispose();
  });

  e.it('dispose', async (e) => {
    const db = await init();
    expect(db.disposed).to.eql(false);

    db.dispose();
    expect(db.disposed).to.eql(true);
    expect(IndexedDb.Database.isClosed(db.database)).to.eql(true);
  });

  e.describe('retrieve', (e) => {
    e.describe('getOrCreate', (e) => {
      e.it('creates and store in DB', async (e) => {
        const store = WebStore.init({ network: false, storage: { name } });
        const db = await init();
        const res = await db.getOrCreate(store);

        expect(res?.dbname).to.eql(name);
        expect(res?.dbname).to.eql(store.info.storage?.name);
        expect(Is.automergeUrl(res?.index)).to.eql(true);

        db.dispose();
        store.dispose();
      });

      e.it('two instances return same record', async (e) => {
        const store = WebStore.init({ network: false, storage: { name } });
        const db = await init();
        const res1 = await db.getOrCreate(store);
        const res2 = await db.getOrCreate(store);

        expect(res1.dbname).to.eql(res2.dbname);
        expect(res1.index).to.eql(res2.index);
        console.log('res1', res1);
        console.log('res2', res2);
      });
    });

    e.it('get', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const db = await init();
      const res = await db.get(store);

      expect(res?.dbname).to.eql(name);
      expect(res?.dbname).to.eql(store.info.storage?.name);
      expect(Is.automergeUrl(res?.index)).to.eql(true);

      db.dispose();
      store.dispose();
    });

    e.it('exists', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const db = await init();

      expect(await db.exists(store)).to.eql(true);

      const res = await db.delete(store);
      expect(res.existed).to.eql(true);

      expect(await db.exists(store)).to.eql(false);
      expect(await db.get(store)).to.eql(undefined);

      db.dispose();
      store.dispose();
    });

    e.it('throw: storage not enabled on repo', async (e) => {
      const store = WebStore.init({ network: false, storage: false });
      const db = await init();
      const err = 'does not have storage enabled';
      expectError(() => db.getOrCreate(store), err);
      store.dispose();
      db.dispose();
    });
  });
});
