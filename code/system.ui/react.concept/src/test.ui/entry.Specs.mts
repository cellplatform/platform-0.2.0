export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.concept.tests': () => import('./-TestRunner'),
  'sys.ui.concept.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.ui.concept.PlayBar__': () => import('../ui/ui.PlayBar/-SPEC'),
  'sys.ui.concept.ScreenLayout': () => import('../ui/ui.Layout.Screen/-dev/-SPEC'),
  'sys.ui.concept.Layout.VideoDiagram': () => import('../ui/ui.Layout.VideoDiagram/-SPEC'),
  'sys.ui.concept.Empty': () => import('../ui/ui.Empty/-SPEC'),

  // sys.ui.common
  'sys.ui.common.Layout.Split': () => import('../ui/-sys.common.Layout.Split/-SPEC'),
};

export default Specs;
