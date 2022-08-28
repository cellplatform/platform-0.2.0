import { expect, describe, it } from '../TEST/index.mjs';
import { IndexedDb } from './index.mjs';

type Sample = { name: string };

describe('IndexedDb (Helpers)', () => {
  const createSample = async (name: string) => {
    const db = await IndexedDb.create<Sample>({
      name,
      version: 1,
      schema(req, e) {
        const db = req.result;
        const names = db.createObjectStore('names', { keyPath: 'id' });
        names.createIndex('NameIndex', ['id']);
      },
      store(db) {
        // HINT: Pass the [db] instance into some "Store/Controller" logic here.
        const driver: Sample = { name };
        return driver;
      },
    });

    return db;
  };

  it('create', async () => {
    expect(await IndexedDb.list()).to.eql([]);

    const name = 'foo.sample.1';
    await createSample(name);

    const databases = await IndexedDb.list();
    expect(databases.length).to.eql(1);
    expect(databases[0].name).to.eql(name);
    expect(databases[0].version).to.eql(1);
  });
});
