export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.ui.IFrameRef': () => import('../ui/ui.IFrameRef/-SPEC'),
  'slc.ui.Payment.Stripe': () => import('../ui/ui.Payment.Stripe/-SPEC'),
  'slc.ext.Ember': () => import('../ui/ext.Ember/-SPEC'),
};

export default Specs;
