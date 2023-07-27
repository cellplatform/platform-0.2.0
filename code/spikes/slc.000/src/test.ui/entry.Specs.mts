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

const importConcept = async () => {
  const { dev } = await import('sys.ui.react.concept');
  const { Specs } = await dev();
  return Specs;
};

export const Specs = {
  // SLC ("Social Lean Canvas")
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/slc.Info/-dev/-SPEC'),
  'slc.ui.IFrameRef': () => import('../ui/slc.IFrameRef/-SPEC'),

  // System
  'ext.ui.Payment.Stripe': () => import('../ui/ext.ui.Payment.Stripe/-SPEC'),

  // External (3rd party).
  'ext.slc.Ember': () => import('../ui/ext.slc.Ember/-dev/-SPEC'),
  'ext.slc.Ember.Stateful': () => import('../ui/ext.slc.Ember/-dev/-SPEC.Stateful'),

  // system
  ...(await importCommon()),
  ...(await importConcept()),
};

export default Specs;
