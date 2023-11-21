import { Store } from '../Store';
import { StoreIndexDb } from '../Store.Web.IndexDb';
import { type t } from './common';

/**
 * Create instance of the store/repo's document Index.
 */
export async function index(store: t.WebStore) {
  const dbname = StoreIndexDb.name(store);
  const db = await StoreIndexDb.init(dbname);
  const record = await db.getOrCreate(store);
  const uri = record.index;
  return Store.Index.init(store, uri);
}
