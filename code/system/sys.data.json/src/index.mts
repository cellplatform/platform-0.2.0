/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Data Structures
 */
export { Json } from './Json';
export { Patch } from './Json.Patch';
export { PatchState } from './Json.PatchState';

/**
 * Dev
 */
export const dev = async () => {
  // const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg };
};
