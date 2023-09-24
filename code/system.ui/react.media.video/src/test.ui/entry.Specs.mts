export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.media.video.tests': () => import('./-TestRunner'),
  'sys.ui.media.video.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.ui.media.video.ui.PlayButton': () => import('../ui/ui.PlayButton/-SPEC'),
  'sys.ui.media.video.ui.PlayBar': () => import('../ui/ui.PlayBar/-SPEC'),
  'sys.ui.media.video.ui.VideoPlayer': () => import('../ui/ui.VideoPlayer/-SPEC'),
};

export default Specs;
