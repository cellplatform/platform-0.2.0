import { IndexedDb } from '.';
import { Test, Time, expect } from '../test.ui';

export default Test.describe('IndexedDb', (e) => {
  e.timeout(5000);

  const name = 'dev.test';
  type T = { name: string; db: IDBDatabase };

  const assertDbExists = async (name: string, exists = true) => {
    const databases = await indexedDB.databases();
    const match = databases.find((db) => db.name === name);
    expect(Boolean(match)).to.eql(exists);
  };

  e.describe('setup', (e) => {
    e.it(`delete test database: "${name}"`, async (e) => {
      await IndexedDb.delete(name);
    });
  });

  e.describe('create', (e) => {
    e.it('create', async (e) => {
      await Time.wait(100);
      const res = await IndexedDb.init<T>({ name, store: (db) => ({ name, db }) });
      expect(res.name).to.eql(name);
      expect(res.db instanceof IDBDatabase).to.eql(true);
      await assertDbExists(name, true);
      res.db.close();
    });

    e.it('create (already exists)', async (e) => {
      await Time.wait(100);
      const res1 = await IndexedDb.init<T>({ name, store: (db) => ({ name, db }) });
      const res2 = await IndexedDb.init<T>({ name, store: (db) => ({ name, db }) });
      expect(res1.db.name).to.eql(res2.name);

      res1.db.close();
      res2.db.close();
    });
  });

  e.describe('delete', (e) => {
    e.it('delete non-existant database (no error)', async (e) => {
      const res = await IndexedDb.delete('404-no-exist');
      expect(res.error).to.eql(undefined);
    });

    e.it('delete', async (e) => {
      await assertDbExists(name, true);
      const res = await IndexedDb.delete(name);
      expect(res.name).to.eql('dev.test');
      expect(res.error).to.eql(undefined);

      await Time.wait(500);
      await assertDbExists(name, false);
      expect(res.error).to.eql(undefined);
      expect(res.name).to.eql(name);
    });
  });

  e.describe('IndexedDb.Database', (e) => {
    e.it('isClosed', async (e) => {
      const res = await IndexedDb.init<T>({ name, store: (db) => ({ name, db }) });
      expect(IndexedDb.Database.isClosed(res.db)).to.eql(false);

      res.db.close();
      expect(IndexedDb.Database.isClosed(res.db)).to.eql(true);
    });
  });
});
