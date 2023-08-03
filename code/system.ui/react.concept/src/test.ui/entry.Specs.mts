export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.concept.tests': () => import('./-TestRunner'),
  'sys.ui.concept.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.ui.concept.ui.PlayBar': () => import('../ui/ui.PlayBar/-SPEC'),
  'sys.ui.concept.ui.ScreenLayout': () => import('../ui/ui.ScreenLayout/-dev/-SPEC'),

  'sys.ui.concept.ui.VideoDiagram__': () => import('../ui/ui.VideoDiagram__/-SPEC'),
  'sys.ui.concept.ui.VideoLayout__': () => import('../ui/ui.VideoLayout__/-SPEC'),
};

export default Specs;
