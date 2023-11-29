import { WebStore } from './Store.Web';

/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Data, DocUri, Is, toObject } from './common';
import { Store } from './Store';
import { Doc } from './Store.Doc';
export { Data, Doc, DocUri, Is, Store, toObject, WebStore };

export const Crdt = {
  Uri: DocUri,
  Is,
  Data,
  Store,
  WebStore,
} as const;

/**
 * Library: UI
 */
import { Info } from './ui/ui.Info';
import { RepoList } from './ui/ui.RepoList';

export { useDocument } from './ui/common';
export { Info };
export const UI = {
  Uri: DocUri,
  Is,
  Data,
  WebStore,
  Info,
  RepoList,
} as const;

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
