/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Module API
 */
export { Concept } from './index.Concept';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
