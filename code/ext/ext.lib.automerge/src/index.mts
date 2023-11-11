/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { WebStore } from './Store.Web';
export { WebStore };

export { Store } from './Store';
export { toObject } from './common';

/**
 * Library: UI
 */
import { Info } from './ui/ui.Info';
import { RepoList } from './ui/ui.RepoList';
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
