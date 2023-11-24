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
import { DocUri, Is, toObject } from './common';
export { Store } from './Store';
export { DocUri, Is, WebStore, toObject };
export { TestDb } from './test.ui/TestDb';

/**
 * Library: UI
 */
export { useDocument } from './ui/common';
export { Info };
export const UI = {
  DocUri,
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
