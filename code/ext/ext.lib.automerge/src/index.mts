/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Doc } from './Doc';
import { Store } from './Store';
import { WebStore } from './Store.Web';
export { WebStoreIndex } from './Store.Web.Index';
export { StoreIndexDb } from './Store.Web.IndexDb';
export { A, Data, Is, toObject } from './common';

export { Doc, Store, WebStore };
export const Crdt = {
  Doc,
  Store,
  WebStore,
} as const;

/**
 * Library: UI
 */
export { Info, InfoField } from './ui/ui.Info';
export { RepoList } from './ui/ui.RepoList';
export { His } from './ui/ui.History.Grid';

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export { Specs } from './test.ui/entry.Specs.mjs';

export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
