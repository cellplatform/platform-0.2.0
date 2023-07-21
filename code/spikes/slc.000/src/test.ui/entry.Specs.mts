export { Pkg } from '../index.pkg.mjs';

const importCommon = async () => {
  const { dev } = await import('sys.ui.react.common');
  const { Specs } = await dev();
  return {
    'sys.ui.common.Grid': Specs['sys.ui.common.Grid'],
  };
};

export const Specs = {
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.ui.IFrameRef': () => import('../ui/ui.IFrameRef/-SPEC'),
  'slc.ui.Payment.Stripe': () => import('../ui/ui.Payment.Stripe/-SPEC'),
  'slc.ext.Ember': () => import('../ui/ext.Ember/-SPEC'),
  ...(await importCommon()),
};

export default Specs;
