/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { Doc } from './Doc';
export { Store } from './Store';
export { WebStore } from './Store.Web';
export { WebStoreIndex } from './Store.Web.Index';
export { StoreIndexDb } from './Store.Web.IndexDb';
export { Data, Is, toObject } from './common';

/**
 * Library: UI
 */
export { Info, InfoField } from './ui/ui.Info';
export { RepoList } from './ui/ui.RepoList';

/**
 * Dev
 */
export { TestDb } from './test.ui/TestDb';
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
