/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { A, Data, Is, toObject } from './common';

import { Doc } from './logic/Doc';
import { Store } from './logic/Store';
import { WebStore } from './logic/Store.Web';

export { Doc } from './logic/Doc';
export { Store } from './logic/Store';
export { StoreIndex } from './logic/Store.Index';
export { WebStore } from './logic/Store.Web';
export { WebStoreIndex } from './logic/Store.Web.Index';
export { StoreIndexDb } from './logic/Store.Web.IndexDb';

export const Crdt = {
  Doc,
  Store,
  WebStore,
} as const;

/**
 * Library: UI
 */
export { HistoryCommit } from './ui/ui.History.Commit';
export { HistoryGrid } from './ui/ui.History.Grid';
export { Info, InfoField } from './ui/ui.Info';
export { RepoList } from './ui/ui.RepoList';

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export { Specs } from './test.ui/entry.Specs.mjs';
