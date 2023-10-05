/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Components
 */
export { Video } from './ui.Video';

export { PlayBar } from './ui/ui.PlayBar';
export { PlayButton } from './ui/ui.PlayButton';
export { VideoPlayer } from './ui/ui.VideoPlayer';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
