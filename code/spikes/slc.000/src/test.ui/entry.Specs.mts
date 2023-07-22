export { Pkg } from '../index.pkg.mjs';

const importCommon = async () => {
  const { dev } = await import('sys.ui.react.common');
  const { Specs } = await dev();
  return {
    'sys.ui.common.Grid': Specs['sys.ui.common.Grid'],
  };
};

export const Specs = {
  // SLC (Social Lean Canvas)
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.ui.IFrameRef': () => import('../ui/ui.IFrameRef/-SPEC'),
  'slc.ui.ConceptPlayer': () => import('../ui/ui.ConceptPlayer/-dev/-SPEC'),
  'slc.ui.Payment.Stripe': () => import('../ui/ui.Payment.Stripe/-SPEC'),

  // External
  'slc.ext.Ember': () => import('../ui/ext.Ember/-SPEC'),

  // sys.common
  ...(await importCommon()),
};

export default Specs;
