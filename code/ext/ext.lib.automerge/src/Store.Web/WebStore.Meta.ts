import { Store } from '../Store';
import { StoreIndexDb as IndexDb } from '../Store.Web.IndexDb';
import { type t } from './common';

export const WebStoreMeta = {
  IndexDb,

  /**
   * Initialize new store.
   */
  async index(store: t.WebStore) {
    const db = await IndexDb.init();
    const record = await db.getOrCreate(store);
    const uri = record.indexUri;
    const doc = await Store.Index.init(store, uri);
    return doc;
  },
} as const;
