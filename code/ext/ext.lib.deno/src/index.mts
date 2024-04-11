/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { DenoHttp } from './DenoHttp';

/**
 * Dev
 */
import SpecSample from './ui/ui.Sample.01/-SPEC';
export const Sample = { spec: SpecSample } as const;

export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
