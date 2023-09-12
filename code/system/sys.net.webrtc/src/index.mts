/**
 * Meta
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { WebRtc } from './WebRtc';

export async function ui() {
  const { Connect } = await import('./ui/ui.Connect');
  return { Connect } as const;
}

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
