/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Media
 */
export { AudioWaveform } from './ui/Audio.Waveform';
export { MediaStream } from './ui/MediaStream';
export { RecordButton } from './ui/RecordButton';
export { ConceptPlayer } from './ui/Concept.Player';

export { YouTube } from './ui/vendor.YouTube';
export { VimeoPlayer, VimeoBackground, VimeoEvents } from './ui/vendor.Vimeo';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
