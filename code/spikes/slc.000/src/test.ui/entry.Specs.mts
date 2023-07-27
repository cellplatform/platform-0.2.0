export { Pkg } from '../index.pkg.mjs';

const importCommon = async () => {
  const { dev } = await import('sys.ui.react.common');
  const { Specs } = await dev();
  return {
    'sys.ui.common.Grid': Specs['sys.ui.common.Grid'],
    'sys.ui.common.Item.LabelItem': Specs['sys.ui.common.Item.LabelItem'],
    'sys.ui.common.Position': Specs['sys.ui.common.Position'],
    'sys.ui.common.Position.Selector': Specs['sys.ui.common.Position.Selector'],
  };
};

export const Specs = {
  // SLC ("Social Lean Canvas")
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.IFrameRef': () => import('../ui/ui.IFrameRef/-SPEC'),

  // System
  'sys.ui.concept.Slug': () => import('../ui/ui.Concept.Slug/-SPEC'),
  'sys.ui.concept.Player': () => import('../ui/ui.Concept.Player/-SPEC'),
  'ext.ui.Stripe.Payment': () => import('../ui/ui.Payment.Stripe/-SPEC'),

  // External (3rd party).
  'slc.ext.Ember': () => import('../ui/ext.Ember/-dev/-SPEC'),
  'slc.ext.Ember.Stateful': () => import('../ui/ext.Ember/-dev/-SPEC.Stateful'),

  // sys.common
  ...(await importCommon()),
};

export default Specs;
