/**
 * Module (Meta)
 */
export { Pkg } from './index.pkg';

/**
 * Library
 */
export { A, Cmd, Data, Is, toObject } from './common';
export { Store, StoreIndex };

import { Doc, Store, StoreIndex } from './crdt';
import { Sync } from './crdt.sync';
export { Doc, Sync };

import { StoreIndexDb, WebStore, WebStoreIndex } from './crdt.web';
export { StoreIndexDb, WebStore, WebStoreIndex };

export const Crdt = {
  Doc,
  Sync,
  Store,
  WebStore,
} as const;

/**
 * Library: UI
 */
export { Redraw, useDoc, useDocs, useRedrawOnChange } from './ui/ui.use';
export { HistoryCommit } from './ui/ui.History.Commit';
export { HistoryGrid } from './ui/ui.History.Grid';
export { Info, InfoField } from './ui/ui.Info';
export { RepoList } from './ui/ui.RepoList';

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export { Specs } from './test.ui/entry.Specs';
