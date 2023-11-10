import { StoreMetaDb } from '.';
import { WebStore } from '../Store.Web';
import { IndexedDb, Test, Time, expect, expectError, type t } from '../test.ui';
import { DEFAULTS, Is } from './common';

export default Test.describe('Store.Web: MetaDb', (e) => {
  const name = 'dev.test';

  e.it('init', async (e) => {
    const db = await StoreMetaDb.init();

    await Time.wait(300);
    const databases = (await IndexedDb.list()).map((e) => e.name);

    const dbname = DEFAULTS.sys.dbname;
    expect(databases).to.include(dbname);
    expect(db.database.name).to.eql(dbname);
    db.dispose();
  });

  e.it('dispose', async (e) => {
    const db = await StoreMetaDb.init();
    expect(db.disposed).to.eql(false);

    db.dispose();
    expect(db.disposed).to.eql(true);
    expect(IndexedDb.Database.isClosed(db.database)).to.eql(true);
  });

  e.describe('getOrCreate', (e) => {
    e.it('getOrCreate', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const db = await StoreMetaDb.init();
      const res = await db.getOrCreate(store);

      expect(res?.dbname).to.eql(name);
      expect(res?.dbname).to.eql(store.info.storage?.name);
      expect(Is.automergeUrl(res?.indexUri)).to.eql(true);

      db.dispose();
      store.dispose();
    });

    e.it('get', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const db = await StoreMetaDb.init();
      const res = await db.get(store);

      expect(res?.dbname).to.eql(name);
      expect(res?.dbname).to.eql(store.info.storage?.name);
      expect(Is.automergeUrl(res?.indexUri)).to.eql(true);

      db.dispose();
      store.dispose();
    });

    e.it('exists', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const db = await StoreMetaDb.init();

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
      const db = await StoreMetaDb.init();
      const err = 'Cannot add repo index as it does storage is not enabled';
      expectError(() => db.getOrCreate(store), err);
      store.dispose();
      db.dispose();
    });
  });
});
