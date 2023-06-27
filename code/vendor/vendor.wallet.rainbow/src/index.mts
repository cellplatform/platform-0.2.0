/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Components
 */
export { Connect } from './ui/Connect';
export { ChainSelector } from './ui/ChainSelector';
export { Info } from './ui/Info';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
