/**
 * Meta
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { WebRtc } from './WebRtc';

/**
 * Dynamically load UI components.
 */
export async function ui() {
  const { Connect } = await import('./ui/ui.Connect');
  const { GroupVideo } = await import('./ui/ui.GroupVideo');
  return { Connect, GroupVideo } as const;
}

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
