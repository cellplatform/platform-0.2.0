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
export { Store } from './Store';
export { DocUri, Is, toObject } from './common';
export { WebStore };

/**
 * Library: UI
 */
export { useDocument } from './ui/common';
export { Info };
export const UI = {
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
