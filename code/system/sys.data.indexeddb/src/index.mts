/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { IndexedDb } from './IndexedDb';

/**
 * Library.UI
 */
export { Info } from './ui/ui.Info';
export { DevReload } from './ui/ui.Dev.Reload';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
