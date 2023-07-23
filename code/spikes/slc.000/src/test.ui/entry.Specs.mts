export { Pkg } from '../index.pkg.mjs';

const importCommon = async () => {
  const { dev } = await import('sys.ui.react.common');
  const { Specs } = await dev();
  return {
    'sys.ui.common.Grid': Specs['sys.ui.common.Grid'],
    'sys.ui.common.Item.LabelItem': Specs['sys.ui.common.Item.LabelItem'],
  };
};

export const Specs = {
  // SLC ("Social Lean Canvas")
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.IFrameRef': () => import('../ui/ui.IFrameRef/-SPEC'),

  'sys.common.ui.ConceptSlug': () => import('../ui/ui.Concept.Slug/-SPEC'),
  'sys.common.ui.Position': () => import('../ui/ui.Position/-SPEC'),
  'sys.common.ui.Position.Selector': () => import('../ui/ui.PositionSelector/-SPEC'),
  'sys.common.ui.Payment.Stripe': () => import('../ui/ui.Payment.Stripe/-SPEC'),

  // External
  'slc.ext.Ember': () => import('../ui/ext.Ember/-dev/-SPEC'),

  // sys.common
  ...(await importCommon()),
};

export default Specs;
