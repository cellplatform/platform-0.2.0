export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.media.video.tests': () => import('./-TestRunner'),
  'sys.ui.media.video.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.ui.media.video.ui.Player': () => import('../ui/ui.Player/-dev/-SPEC'),
};

export default Specs;
