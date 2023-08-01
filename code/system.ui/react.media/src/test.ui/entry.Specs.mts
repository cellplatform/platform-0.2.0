export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.media.Audio.Player': () => import('../ui/Audio.Player/-dev/-SPEC'),
  'sys.ui.media.MediaStream': () => import('../ui/MediaStream/-dev/-SPEC'),
  'sys.ui.media.RecordButton': () => import('../ui/RecordButton/-SPEC'),
};

export default Specs;
