export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.vercel.tests': () => import('./-TestRunner'),
  'ext.vercel.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
