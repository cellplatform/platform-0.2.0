/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { Info } from './ui/ui.Info';
export { Canvas } from './ui/ui.Canvas';
export { CanvasCrdt } from './ui/ui.Canvas.Crdt';

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs.mjs';

export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
