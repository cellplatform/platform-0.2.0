export { Pkg } from '../index.pkg.mjs';

export const ExtSpecs = {
  'sys.ui.media.video.YouTube': () => import('../ui/vendor.YouTube/-dev/-SPEC'),
};

export const Specs = {
  'sys.ui.media.Audio.Player': () => import('../ui/Audio.Player/-dev/-SPEC'),
  'sys.ui.media.Concept.Player': () => import('../ui/Concept.Player/-dev/-SPEC'),
  'sys.ui.media.MediaStream': () => import('../ui/MediaStream/-dev/-SPEC'),
  'sys.ui.media.RecordButton': () => import('../ui/RecordButton/-SPEC'),
  'sys.ui.media.SeekBar': () => import('../ui/SeekBar/-SPEC'),
  ...ExtSpecs,
};

export default Specs;
