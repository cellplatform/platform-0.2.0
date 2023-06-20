import { Pkg } from './index.pkg.mjs';

export { Pkg };
export { WebRtc } from './WebRtc';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
