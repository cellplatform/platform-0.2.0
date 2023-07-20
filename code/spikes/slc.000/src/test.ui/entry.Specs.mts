export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'slc.tests': () => import('./-TestRunner'),
  'slc.ui.Info': () => import('../ui/ui.Info/-dev/-SPEC'),
  'slc.ui.Ref.IFrame': () => import('../ui/ui.Ref.IFrame/-SPEC'),
  'slc.ui.Payment.Stripe': () => import('../ui/ui.Payment.Stripe/-SPEC'),
  'slc.ext.Ember': () => import('../ui/ext.Ember/-SPEC'),
};

export default Specs;
