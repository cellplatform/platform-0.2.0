export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.concept.tests': () => import('./-TestRunner'),
  'sys.ui.concept.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'sys.ui.concept.Layout': () => import('../ui/ui.Layout/-dev/-SPEC'),
  'sys.ui.concept.Index': () => import('../ui/ui.Index/-SPEC'),
  'sys.ui.concept.VideoDiagram': () => import('../ui/ui.VideoDiagram/-SPEC'),
  'sys.ui.concept.VideoDiagram.Edit': () => import('../ui/ui.VideoDiagram/-SPEC.Edit'),
  'sys.ui.concept.Empty': () => import('../ui/ui.Empty/-SPEC'),
  // 'sys.ui.concept.Layout.Stateful': () => import('../ui/ui.Layout/-dev/-SPEC.Stateful'),

  '__sys.ui.concept.PlayBar': () => import('../ui/ui.PlayBar__/-SPEC'),

  // sys.ui.common
  'sys.ui.common.Layout.Split': () => import('../ui/-sys.common.Layout.Split/-SPEC'),
};

export default Specs;
