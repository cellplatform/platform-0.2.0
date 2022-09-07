import { describe, it, expect, slug } from '../TEST/index.mjs';
import { FsIndexedDb } from './index.mjs';

describe('FsIndexedDb', () => {
  it('default', async () => {
    const db = await FsIndexedDb();
    expect(db.id).to.eql('fs');
    expect(db.version).to.eql(1);
  });

  it('custom "id"', async () => {
    const id = `fs.${slug}`;
    const db = await FsIndexedDb({ id: `  ${id}  ` });
    expect(db.id).to.eql(id); // NB: trimmed.
  });

  it('lazy evaluation: driver', async () => {
    const db = await FsIndexedDb();

    const io1 = db.driver.io;
    const io2 = db.driver.io;

    expect(io1.dir).to.eql('/');
    expect(io1).to.equal(io2);
  });

  it('lazy evaluation: indexer', async () => {
    const db = await FsIndexedDb();

    const indexer1 = db.driver.indexer;
    const indexer2 = db.driver.indexer;

    expect(indexer1.dir).to.eql('/');
    expect(indexer1).to.equal(indexer2);
  });
});
