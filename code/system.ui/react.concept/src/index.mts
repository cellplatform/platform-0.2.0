/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Components
 */
export { Concept } from './ui/Concept';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
