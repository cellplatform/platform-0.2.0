import type { t } from '../common';
export { Pkg } from '../index.pkg';

export const Specs = {
  'sys.ui.media.Audio.Player': () => import('../ui/Audio.Player/-dev/-SPEC'),
  'sys.ui.media.MediaStream': () => import('../ui/MediaStream/-dev/-SPEC'),
  'sys.ui.media.RecordButton': () => import('../ui/RecordButton/-SPEC'),
} as t.SpecImports;
export default Specs;
