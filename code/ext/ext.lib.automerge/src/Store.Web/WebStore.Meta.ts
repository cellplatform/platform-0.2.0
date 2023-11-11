import { Store } from '../Store';
import { StoreMetaDb as Db } from '../Store.Meta.Db';
import { type t } from './common';

export const WebStoreMeta = {
  Db,

  /**
   * Initialize new store.
   */
  async init(store: t.WebStore) {
    /**
     * TODO 🐷
     */

    // const key = DEFAULTS.localstorage.indexKey;
    // let uri = options.uri || localStorage.getItem(key) || undefined;

    // if (uri && !store.doc.exists(uri)) {
    //   throw new Error(`Index of the store respository does not exist: ${uri}`);
    // }

    // let uri = undefined;

    const db = await Db.init();
    const record = await db.getOrCreate(store);

    // (await indexRef).dbname

    const uri = record.indexUri;

    console.log('uri', uri);

    // console.log('uri', uri);
    const doc = await Store.Index.init(store, uri);
    // if (!options.uri && !uri) localStorage.setItem(key, index.uri);
    return doc;
  },
} as const;
