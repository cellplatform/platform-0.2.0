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
export { Image } from './ui/Image';

export { Vimeo, VimeoBackground, VimeoEvents } from './ui/vendor.Vimeo';
export { YouTube } from './ui/vendor.YouTube';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Specs, Pkg };
};
