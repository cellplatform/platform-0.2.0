/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { A, Data, Is, toObject } from './common';

import { Sync } from './crdt.sync';
import { Doc } from './crdt/Doc';
import { Store } from './crdt/Store';
import { WebStore } from './crdt/Store.Web';

export { Doc } from './crdt/Doc';
export { Store } from './crdt/Store';
export { StoreIndex } from './crdt/Store.Index';
export { WebStore } from './crdt/Store.Web';
export { WebStoreIndex } from './crdt/Store.Web.Index';
export { StoreIndexDb } from './crdt/Store.Web.IndexDb';

export { Sync } from './crdt.sync';

export const Crdt = {
  Doc,
  Sync,
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
export { CmdBar } from './ui/ui.Cmd.Bar';
export { Redraw, useDoc, useDocs, useRedrawOnChange } from './ui.use';

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export { Specs } from './test.ui/entry.Specs.mjs';
