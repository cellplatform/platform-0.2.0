import { WebStore } from './Store.Web';
import { Info } from './ui/ui.Info';
import { RepoList } from './ui/ui.RepoList';

/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { As, DocUri, Is, toObject } from './common';
export { As, DocUri, Is, WebStore, toObject };

export { Store } from './Store';
export { Doc } from './Store.Doc';
export { TestDb } from './test.ui/TestDb';

/**
 * Library: UI
 */
export { useDocument } from './ui/common';
export { Info };
export const UI = {
  Uri: DocUri,
  As,
  Is,
  WebStore,
  Info,
  RepoList,
};

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
